package com.klef.demo.tracker.controller;

import com.klef.demo.tracker.dto.AmbulanceLocationUpdateRequest;
import com.klef.demo.tracker.dto.EmergencyRequestCreateRequest;
import com.klef.demo.tracker.dto.EmergencyRequestResponse;
import com.klef.demo.tracker.dto.EmergencyStatusUpdateRequest;
import com.klef.demo.tracker.dto.TrackResponse;
import com.klef.demo.tracker.service.DispatchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EmergencyController {
  private final DispatchService dispatchService;

  public EmergencyController(DispatchService dispatchService) {
    this.dispatchService = dispatchService;
  }

  @PostMapping("/emergency/request")
  public EmergencyRequestResponse createEmergencyRequest(@Valid @RequestBody EmergencyRequestCreateRequest request) {
    return dispatchService.createEmergencyRequest(request);
  }

  @GetMapping("/emergency/{requestId}")
  public TrackResponse getEmergency(@PathVariable String requestId) {
    return dispatchService.trackRequest(requestId);
  }

  @GetMapping("/emergency/track/{requestId}")
  public TrackResponse trackEmergency(@PathVariable String requestId) {
    return dispatchService.trackRequest(requestId);
  }

  @PutMapping("/emergency/status")
  public Map<String, Object> updateStatus(@Valid @RequestBody EmergencyStatusUpdateRequest request) {
    return dispatchService.updateEmergencyStatus(request);
  }

  @PostMapping("/ambulance/location")
  public Map<String, Object> updateLocationV2(@Valid @RequestBody AmbulanceLocationUpdateRequest request) {
    return dispatchService.updateAmbulanceLocation(request);
  }

  @PostMapping("/ambulance/update-location")
  public Map<String, Object> updateLocation(@Valid @RequestBody AmbulanceLocationUpdateRequest request) {
    return dispatchService.updateAmbulanceLocation(request);
  }

  @GetMapping("/ambulance/nearest")
  public List<?> nearestAmbulances(@RequestParam double latitude, @RequestParam double longitude, @RequestParam(defaultValue = "CRITICAL") String priority) {
    return dispatchService.getNearestAmbulances(latitude, longitude, com.klef.demo.tracker.model.EmergencyPriority.valueOf(priority));
  }
}
