package com.financeflow.dto.department;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequest(@NotBlank String name, String description, boolean active) {
}