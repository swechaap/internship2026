package com.klef.demo.tracker.model;

import java.time.Instant;

public class EmergencyRequestRecord {
  public String requestId;
  public String patientName;
  public String phone;
  public String address;
  public String emergencyType;
  public EmergencyPriority priority;
  public double latitude;
  public double longitude;
  public Instant requestTime;
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

  public EmergencyRequestRecord() {
  }
}
