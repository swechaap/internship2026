package com.financeflow.dto.budget;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BudgetResponse(
        Long id,
        String budgetName,
        String department,
        BigDecimal allocatedAmount,
        BigDecimal usedAmount,
        BigDecimal remainingAmount,
        LocalDate validFrom,
        LocalDate validTo) {
}