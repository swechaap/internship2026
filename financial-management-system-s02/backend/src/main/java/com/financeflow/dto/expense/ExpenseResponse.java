package com.financeflow.dto.expense;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        String expenseCode,
        String title,
        String description,
        BigDecimal amount,
        String category,
        String department,
        String vendor,
        LocalDate expenseDate,
        String status,
        String createdBy,
        Instant createdAt) {
}