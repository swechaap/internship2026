package com.financeflow.dto.report;

import java.math.BigDecimal;
import java.util.Map;

public record ReportResponse(BigDecimal totalExpenses, Map<String, BigDecimal> byCategory, Map<String, BigDecimal> byDepartment) {
}