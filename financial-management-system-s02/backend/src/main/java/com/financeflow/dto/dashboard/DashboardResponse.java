package com.financeflow.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalUsers,
        BigDecimal totalExpenses,
        BigDecimal pendingApprovals,
        List<SeriesPoint> trend,
        List<SeriesPoint> categories,
        List<ActivityPoint> auditActivities) {

    public record SeriesPoint(String label, BigDecimal value) {}
    public record ActivityPoint(String label, String value) {}
}