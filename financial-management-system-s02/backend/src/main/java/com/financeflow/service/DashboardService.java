package com.financeflow.service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

import com.financeflow.dto.dashboard.DashboardSummaryResponse;
import com.financeflow.entity.enums.ExpenseStatus;
import com.financeflow.repository.AuditLogRepository;
import com.financeflow.repository.BudgetRepository;
import com.financeflow.repository.ExpenseRepository;
import com.financeflow.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardService(UserRepository userRepository, ExpenseRepository expenseRepository, BudgetRepository budgetRepository, AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public DashboardSummaryResponse summary(String role) {
        long totalUsers = userRepository.count();
        long totalExpenses = expenseRepository.count();
        long pending = expenseRepository.countByStatus(ExpenseStatus.PENDING);
        long approved = expenseRepository.countByStatus(ExpenseStatus.APPROVED);
        long rejected = expenseRepository.countByStatus(ExpenseStatus.REJECTED);
        BigDecimal monthlyTotal = expenseRepository.totalInRange(YearMonth.now().atDay(1), YearMonth.now().atEndOfMonth());
        List<String> recentItems = auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream().limit(5)
                .map(log -> log.getAction() + " " + log.getEntityName())
                .toList();
        BigDecimal allocated = budgetRepository.findAll().stream().map(b -> b.getAllocatedAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal used = budgetRepository.findAll().stream().map(b -> b.getUsedAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal utilization = allocated.signum() == 0 ? BigDecimal.ZERO : used.multiply(BigDecimal.valueOf(100)).divide(allocated, 2, java.math.RoundingMode.HALF_UP);
        return new DashboardSummaryResponse(role, totalUsers, totalExpenses, pending, approved, rejected, monthlyTotal, utilization, recentItems);
    }

    public DashboardSummaryResponse admin() {
        return summary("ADMIN");
    }

    public DashboardSummaryResponse manager() {
        return summary("MANAGER");
    }

    public DashboardSummaryResponse accountant() {
        return summary("ACCOUNTANT");
    }
}