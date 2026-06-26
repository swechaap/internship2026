package com.klef.demo.tracker.dto;

import com.klef.demo.tracker.model.EmergencyRequestRecord;
import com.klef.demo.tracker.model.LocationHistoryEntry;

import java.util.List;

public class TrackResponse {
  public EmergencyRequestRecord request;
  public List<LocationHistoryEntry> locationHistory;

  public TrackResponse() {
  }
}
