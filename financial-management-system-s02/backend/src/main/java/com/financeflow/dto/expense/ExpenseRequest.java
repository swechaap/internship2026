package com.financeflow.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ExpenseRequest(
        @NotBlank String title,
        String description,
        @NotNull @Positive BigDecimal amount,
        @NotBlank String category,
        @NotNull Long departmentId,
        @NotBlank String vendor,
        @NotNull LocalDate expenseDate,
        Long receiptId) {
}