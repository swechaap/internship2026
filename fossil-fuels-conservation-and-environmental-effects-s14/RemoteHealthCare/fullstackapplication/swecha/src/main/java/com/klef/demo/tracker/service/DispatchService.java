package com.klef.demo.tracker.service;

import com.klef.demo.tracker.dto.AmbulanceLocationUpdateRequest;
import com.klef.demo.tracker.dto.DashboardStatsResponse;
import com.klef.demo.tracker.dto.EmergencyRequestCreateRequest;
import com.klef.demo.tracker.dto.EmergencyRequestResponse;
import com.klef.demo.tracker.dto.EmergencyStatusUpdateRequest;
import com.klef.demo.tracker.dto.NearestAmbulanceCandidate;
import com.klef.demo.tracker.dto.TrackResponse;
import com.klef.demo.tracker.exception.NotFoundException;
import com.klef.demo.tracker.model.Ambulance;
import com.klef.demo.tracker.model.AmbulanceStatus;
import com.klef.demo.tracker.model.EmergencyPriority;
import com.klef.demo.tracker.model.EmergencyRequestRecord;
import com.klef.demo.tracker.model.Hospital;
import com.klef.demo.tracker.model.LocationHistoryEntry;
import com.klef.demo.tracker.model.RequestStatus;
import com.klef.demo.tracker.service.HospitalSearchService;
import com.klef.demo.tracker.websocket.TrackingEventBroadcaster;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class DispatchService {
  private final Map<String, Ambulance> ambulances = new ConcurrentHashMap<>();
  private final Map<String, EmergencyRequestRecord> emergencyRequests = new ConcurrentHashMap<>();
  private final Map<String, List<LocationHistoryEntry>> locationHistory = new ConcurrentHashMap<>();
  private final AtomicLong locationIdSequence = new AtomicLong(1);
  private final TrackingEventBroadcaster broadcaster;
  private final HospitalSearchService hospitalSearchService;

  public DispatchService(TrackingEventBroadcaster broadcaster, HospitalSearchService hospitalSearchService) {
    this.broadcaster = broadcaster;
    this.hospitalSearchService = hospitalSearchService;
  }

  @PostConstruct
  void seedData() {
    registerAmbulance(new Ambulance("AMB-101", "TS-09-EM-101", "Ravi Kumar", "+91 98765 11011", AmbulanceStatus.AVAILABLE, 17.3855, 78.4860, 1));
    registerAmbulance(new Ambulance("AMB-102", "TS-09-EM-205", "Suresh Patel", "+91 98765 11022", AmbulanceStatus.BUSY, 17.3901, 78.4850, 2));
    registerAmbulance(new Ambulance("AMB-103", "TS-09-EM-334", "Anita Sharma", "+91 98765 11033", AmbulanceStatus.AVAILABLE, 17.4200, 78.5010, 0));
    registerAmbulance(new Ambulance("AMB-104", "TS-09-EM-447", "Mohan Das", "+91 98765 11044", AmbulanceStatus.BUSY, 17.4500, 78.4930, 3));
    registerAmbulance(new Ambulance("AMB-105", "TS-09-EM-501", "Farah Khan", "+91 98765 11055", AmbulanceStatus.AVAILABLE, 17.4320, 78.3825, 1));
  }

  public EmergencyRequestResponse createEmergencyRequest(EmergencyRequestCreateRequest request) {
    EmergencyRequestRecord record = new EmergencyRequestRecord();
    record.requestId = "REQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    record.patientName = request.patientName;
    record.phone = request.phone;
    record.address = request.address;
    record.emergencyType = request.emergencyType;
    record.priority = request.priority;
    record.latitude = request.latitude;
    record.longitude = request.longitude;
    record.requestTime = Instant.now();
    record.status = RequestStatus.REQUESTED;

    List<NearestAmbulanceCandidate> candidates = getNearestAmbulances(request.latitude, request.longitude, request.priority);
    NearestAmbulanceCandidate bestCandidate = candidates.stream().findFirst().orElse(null);
    Hospital nearestHospital = null;
    try {
      nearestHospital = hospitalSearchService.findNearestHospital(request.latitude, request.longitude);
    } catch (NotFoundException exception) {
      // if no hospital is found, keep request alive and return fallback information
    }

    if (bestCandidate != null) {
      record.status = RequestStatus.ASSIGNED;
      record.ambulanceId = bestCandidate.ambulanceId;
      record.vehicleNumber = bestCandidate.vehicleNumber;
      record.driverName = bestCandidate.driverName;
      record.driverPhone = bestCandidate.driverPhone;
      record.estimatedDistanceKm = bestCandidate.distanceKm;
      record.estimatedEtaMinutes = bestCandidate.etaMinutes;
      record.responseMinutes = Math.max(4, (int) Math.round(bestCandidate.etaMinutes * 0.8));
      record.allocationScore = bestCandidate.score;

      Ambulance ambulance = ambulances.get(bestCandidate.ambulanceId);
      if (ambulance != null) {
        ambulance.status = AmbulanceStatus.BUSY;
        ambulance.workload = ambulance.workload + 1;
        ambulance.lastUpdated = Instant.now();
      }

      Map<String, Object> payload = new LinkedHashMap<>();
      payload.put("requestId", record.requestId);
      payload.put("ambulanceId", bestCandidate.ambulanceId);
      payload.put("vehicleNumber", bestCandidate.vehicleNumber);
      payload.put("driverName", bestCandidate.driverName);
      payload.put("hospitalName", nearestHospital != null ? nearestHospital.hospitalName : "No nearby hospital found");
      payload.put("priority", request.priority);
      payload.put("etaMinutes", bestCandidate.etaMinutes);
      broadcaster.ambulanceAssigned(payload);
      broadcaster.statusChange(Map.of(
        "requestId", record.requestId,
        "status", record.status.name(),
        "ambulanceId", bestCandidate.ambulanceId
      ));
    }

    if (nearestHospital != null) {
      record.hospitalId = nearestHospital.hospitalId;
      record.hospitalName = nearestHospital.hospitalName;
      record.hospitalLatitude = nearestHospital.latitude;
      record.hospitalLongitude = nearestHospital.longitude;
    } else {
      record.hospitalId = "UNKNOWN";
      record.hospitalName = "No nearby hospital found within search radius";
      record.hospitalLatitude = 0.0;
      record.hospitalLongitude = 0.0;
    }

    emergencyRequests.put(record.requestId, record);

    EmergencyRequestResponse response = toResponse(record, candidates);
    return response;
  }

  public TrackResponse trackRequest(String requestId) {
    EmergencyRequestRecord request = emergencyRequests.get(requestId);
    if (request == null) {
      throw new NotFoundException("Emergency request not found: " + requestId);
    }

    TrackResponse response = new TrackResponse();
    response.request = request;
    response.locationHistory = locationHistory.getOrDefault(request.ambulanceId, List.of());
    return response;
  }

  public Map<String, Object> updateEmergencyStatus(EmergencyStatusUpdateRequest updateRequest) {
    EmergencyRequestRecord request = emergencyRequests.get(updateRequest.requestId);
    if (request == null) {
      throw new NotFoundException("Emergency request not found: " + updateRequest.requestId);
    }

    request.status = updateRequest.status;
    if (updateRequest.status == RequestStatus.PATIENT_PICKED_UP) {
      broadcaster.patientPicked(Map.of("requestId", request.requestId, "status", updateRequest.status.name()));
    }
    if (updateRequest.status == RequestStatus.REACHED_HOSPITAL) {
      broadcaster.hospitalReached(Map.of("requestId", request.requestId, "status", updateRequest.status.name()));
    }
    broadcaster.statusChange(Map.of(
      "requestId", request.requestId,
      "status", updateRequest.status.name(),
      "ambulanceId", request.ambulanceId
    ));

    return Map.of(
      "requestId", request.requestId,
      "status", request.status,
      "ambulanceId", request.ambulanceId
    );
  }

  public Map<String, Object> updateAmbulanceLocation(AmbulanceLocationUpdateRequest updateRequest) {
    Ambulance ambulance = ambulances.get(updateRequest.ambulanceId);
    if (ambulance == null) {
      throw new NotFoundException("Ambulance not found: " + updateRequest.ambulanceId);
    }

    ambulance.latitude = updateRequest.latitude;
    ambulance.longitude = updateRequest.longitude;
    ambulance.lastUpdated = Instant.ofEpochMilli(updateRequest.timestamp);

    LocationHistoryEntry entry = new LocationHistoryEntry(
      locationIdSequence.getAndIncrement(),
      ambulance.ambulanceId,
      updateRequest.latitude,
      updateRequest.longitude,
      ambulance.lastUpdated
    );

    locationHistory.computeIfAbsent(ambulance.ambulanceId, ignored -> new ArrayList<>()).add(entry);
    broadcaster.locationUpdate(Map.of(
      "ambulanceId", ambulance.ambulanceId,
      "latitude", updateRequest.latitude,
      "longitude", updateRequest.longitude,
      "timestamp", updateRequest.timestamp
    ));

    return Map.of(
      "ambulanceId", ambulance.ambulanceId,
      "latitude", ambulance.latitude,
      "longitude", ambulance.longitude,
      "timestamp", ambulance.lastUpdated.toString()
    );
  }

  public List<NearestAmbulanceCandidate> getNearestAmbulances(double latitude, double longitude, EmergencyPriority priority) {
    List<NearestAmbulanceCandidate> candidates = new ArrayList<>();
    for (Ambulance ambulance : ambulances.values()) {
      if (ambulance.status != AmbulanceStatus.AVAILABLE) {
        continue;
      }
      NearestAmbulanceCandidate candidate = new NearestAmbulanceCandidate();
      candidate.ambulanceId = ambulance.ambulanceId;
      candidate.vehicleNumber = ambulance.vehicleNumber;
      candidate.driverName = ambulance.driverName;
      candidate.driverPhone = ambulance.driverPhone;
      candidate.latitude = ambulance.latitude;
      candidate.longitude = ambulance.longitude;
      candidate.workload = ambulance.workload;
      candidate.distanceKm = round(haversineKm(ambulance.latitude, ambulance.longitude, latitude, longitude));
      candidate.etaMinutes = estimateEta(candidate.distanceKm, priority, ambulance.workload);
      candidate.score = round(candidate.distanceKm * 0.5 + candidate.etaMinutes * 0.4 + ambulance.workload * 0.1 - priorityOffset(priority));
      candidates.add(candidate);
    }
    candidates.sort(Comparator.comparingDouble(candidate -> candidate.score));
    return candidates;
  }

  public DashboardStatsResponse dashboardStats() {
    DashboardStatsResponse response = new DashboardStatsResponse();
    response.totalAmbulances = ambulances.size();
    response.availableAmbulances = (int) ambulances.values().stream().filter(ambulance -> ambulance.status == AmbulanceStatus.AVAILABLE).count();
    response.busyAmbulances = (int) ambulances.values().stream().filter(ambulance -> ambulance.status == AmbulanceStatus.BUSY).count();
    response.activeEmergencies = (int) emergencyRequests.values().stream().filter(request -> request.status != RequestStatus.COMPLETED).count();
    response.completedTrips = (int) emergencyRequests.values().stream().filter(request -> request.status == RequestStatus.COMPLETED).count();
    response.averageResponseTime = 7.4;
    response.averageArrivalTime = 14.2;
    return response;
  }

  private EmergencyRequestResponse toResponse(EmergencyRequestRecord record, List<NearestAmbulanceCandidate> candidates) {
    EmergencyRequestResponse response = new EmergencyRequestResponse();
    response.requestId = record.requestId;
    response.patientName = record.patientName;
    response.address = record.address;
    response.emergencyType = record.emergencyType;
    response.priority = record.priority;
    response.status = record.status;
    response.ambulanceId = record.ambulanceId;
    response.vehicleNumber = record.vehicleNumber;
    response.driverName = record.driverName;
    response.driverPhone = record.driverPhone;
    response.hospitalId = record.hospitalId;
    response.hospitalName = record.hospitalName;
    response.hospitalLatitude = record.hospitalLatitude;
    response.hospitalLongitude = record.hospitalLongitude;
    response.estimatedDistanceKm = record.estimatedDistanceKm;
    response.estimatedEtaMinutes = record.estimatedEtaMinutes;
    response.responseMinutes = record.responseMinutes;
    response.allocationScore = record.allocationScore;
    response.requestTime = record.requestTime;
    response.candidates = candidates;
    return response;
  }

  private void registerAmbulance(Ambulance ambulance) {
    ambulances.put(ambulance.ambulanceId, ambulance);
  }

  private double haversineKm(double startLatitude, double startLongitude, double endLatitude, double endLongitude) {
    final double earthRadiusKm = 6371.0;
    double latitudeDelta = Math.toRadians(endLatitude - startLatitude);
    double longitudeDelta = Math.toRadians(endLongitude - startLongitude);
    double a = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2)
      + Math.cos(Math.toRadians(startLatitude)) * Math.cos(Math.toRadians(endLatitude))
      * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private int estimateEta(double distanceKm, EmergencyPriority priority, int workload) {
    double trafficFactor = 1 + workload * 0.08;
    double priorityFactor = switch (priority) {
      case CRITICAL -> 0.92;
      case HIGH -> 0.98;
      case MEDIUM -> 1.04;
      case LOW -> 1.08;
    };
    return Math.max(4, (int) Math.round(distanceKm / 32.0 * 60 * trafficFactor * priorityFactor));
  }

  private double priorityOffset(EmergencyPriority priority) {
    return switch (priority) {
      case CRITICAL -> 1.2;
      case HIGH -> 0.6;
      case MEDIUM -> 0.3;
      case LOW -> 0.0;
    };
  }

  private double round(double value) {
    return Math.round(value * 100.0) / 100.0;
  }
}
