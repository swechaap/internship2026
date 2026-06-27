package com.financeflow.dto.expense;

import jakarta.validation.constraints.NotBlank;

public record ApprovalRequest(@NotBlank String action, String remarks) {
}