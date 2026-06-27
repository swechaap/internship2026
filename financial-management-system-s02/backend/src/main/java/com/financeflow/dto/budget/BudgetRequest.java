package com.financeflow.dto.budget;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record BudgetRequest(
        @NotBlank String budgetName,
        @NotNull Long departmentId,
        @NotNull @Positive BigDecimal allocatedAmount,
        LocalDate validFrom,
        LocalDate validTo) {
}