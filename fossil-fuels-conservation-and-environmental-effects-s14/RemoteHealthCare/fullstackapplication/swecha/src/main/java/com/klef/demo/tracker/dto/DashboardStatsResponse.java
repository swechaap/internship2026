package com.klef.demo.tracker.dto;

public class DashboardStatsResponse {
  public int totalAmbulances;
  public int availableAmbulances;
  public int busyAmbulances;
  public int activeEmergencies;
  public int completedTrips;
  public double averageResponseTime;
  public double averageArrivalTime;

  public DashboardStatsResponse() {
  }
}
