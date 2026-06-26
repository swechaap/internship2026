package com.klef.demo.tracker.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "hospital.search")
public class HospitalSearchProperties {
  private String overpassUrl = "https://overpass-api.de/api";
  private double radiusKm = 10.0;
  private int timeoutSeconds = 25;

  public String getOverpassUrl() {
    return overpassUrl;
  }

  public void setOverpassUrl(String overpassUrl) {
    this.overpassUrl = overpassUrl;
  }

  public double getRadiusKm() {
    return radiusKm;
  }

  public void setRadiusKm(double radiusKm) {
    this.radiusKm = radiusKm;
  }

  public int getTimeoutSeconds() {
    return timeoutSeconds;
  }

  public void setTimeoutSeconds(int timeoutSeconds) {
    this.timeoutSeconds = timeoutSeconds;
  }
}
