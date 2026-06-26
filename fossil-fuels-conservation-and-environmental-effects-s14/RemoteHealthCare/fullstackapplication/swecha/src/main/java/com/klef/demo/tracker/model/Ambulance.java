package com.klef.demo.tracker.model;

import java.time.Instant;

public class Ambulance {
  public String ambulanceId;
  public String vehicleNumber;
  public String driverName;
  public String driverPhone;
  public AmbulanceStatus status;
  public double latitude;
  public double longitude;
  public int workload;
  public Instant lastUpdated;

  public Ambulance() {
  }

  public Ambulance(String ambulanceId, String vehicleNumber, String driverName, String driverPhone, AmbulanceStatus status, double latitude, double longitude, int workload) {
    this.ambulanceId = ambulanceId;
    this.vehicleNumber = vehicleNumber;
    this.driverName = driverName;
    this.driverPhone = driverPhone;
    this.status = status;
    this.latitude = latitude;
    this.longitude = longitude;
    this.workload = workload;
    this.lastUpdated = Instant.now();
  }
}
