package com.klef.demo.tracker.model;

import java.time.Instant;

public class LocationHistoryEntry {
  public long id;
  public String ambulanceId;
  public double latitude;
  public double longitude;
  public Instant timestamp;

  public LocationHistoryEntry() {
  }

  public LocationHistoryEntry(long id, String ambulanceId, double latitude, double longitude, Instant timestamp) {
    this.id = id;
    this.ambulanceId = ambulanceId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.timestamp = timestamp;
  }
}
