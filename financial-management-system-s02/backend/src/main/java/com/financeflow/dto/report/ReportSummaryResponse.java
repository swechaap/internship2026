package com.financeflow.dto.report;

import java.math.BigDecimal;
import java.util.List;

public record ReportSummaryResponse(
        BigDecimal dailyTotal,
        BigDecimal weeklyTotal,
        BigDecimal monthlyTotal,
        BigDecimal yearlyTotal,
        List<NameValuePoint> departmentTotals,
        List<NameValuePoint> categoryTotals) {

    public record NameValuePoint(String name, BigDecimal value) {}
}