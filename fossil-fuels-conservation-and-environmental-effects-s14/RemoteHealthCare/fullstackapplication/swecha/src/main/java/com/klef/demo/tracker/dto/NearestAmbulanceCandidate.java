package com.klef.demo.tracker.dto;

public class NearestAmbulanceCandidate {
  public String ambulanceId;
  public String vehicleNumber;
  public String driverName;
  public String driverPhone;
  public double latitude;
  public double longitude;
  public int workload;
  public double distanceKm;
  public int etaMinutes;
  public double score;

  public NearestAmbulanceCandidate() {
  }
}
