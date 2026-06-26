package com.klef.demo.tracker.model;

public class Hospital {
  public String hospitalId;
  public String hospitalName;
  public double latitude;
  public double longitude;

  public Hospital() {
  }

  public Hospital(String hospitalId, String hospitalName, double latitude, double longitude) {
    this.hospitalId = hospitalId;
    this.hospitalName = hospitalName;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
