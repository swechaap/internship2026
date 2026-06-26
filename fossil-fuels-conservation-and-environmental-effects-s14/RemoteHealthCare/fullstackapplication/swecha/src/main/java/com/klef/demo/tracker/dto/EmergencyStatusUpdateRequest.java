package com.klef.demo.tracker.dto;

import com.klef.demo.tracker.model.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmergencyStatusUpdateRequest {
  @NotBlank
  public String requestId;

  @NotNull
  public RequestStatus status;
}
