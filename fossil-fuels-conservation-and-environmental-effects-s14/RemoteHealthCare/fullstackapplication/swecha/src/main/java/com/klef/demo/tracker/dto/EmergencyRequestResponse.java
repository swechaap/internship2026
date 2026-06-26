package com.klef.demo.tracker.dto;

import com.klef.demo.tracker.model.EmergencyPriority;
import com.klef.demo.tracker.model.RequestStatus;

import java.time.Instant;
import java.util.List;

public class EmergencyRequestResponse {
  public String requestId;
  public String patientName;
  public String address;
  public String emergencyType;
  public EmergencyPriority priority;
  public RequestStatus status;
  public String ambulanceId;
  public String vehicleNumber;
  public String driverName;
  public String driverPhone;
  public String hospitalId;
  public String hospitalName;
  public double hospitalLatitude;
  public double hospitalLongitude;
  public double estimatedDistanceKm;
  public int estimatedEtaMinutes;
  public int responseMinutes;
  public double allocationScore;
  public Instant requestTime;
  public List<NearestAmbulanceCandidate> candidates;

  public EmergencyRequestResponse() {
  }
}
