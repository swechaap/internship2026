package com.klef.demo.tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AmbulanceLocationUpdateRequest {
  @NotBlank
  public String ambulanceId;

  @NotNull
  public Double latitude;

  @NotNull
  public Double longitude;

  @NotNull
  public Long timestamp;
}
