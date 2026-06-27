package com.financeflow.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        String role,
        long totalUsers,
        long totalExpenses,
        long pendingApprovals,
        long approvedExpenses,
        long rejectedExpenses,
        BigDecimal monthlyExpenseTotal,
        BigDecimal budgetUtilizationPercent,
        List<String> recentItems) {
}