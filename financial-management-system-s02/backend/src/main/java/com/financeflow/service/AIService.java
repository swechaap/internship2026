package com.financeflow.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Locale;

import com.financeflow.entity.UserEntity;
import com.financeflow.entity.enums.ExpenseStatus;
import com.financeflow.repository.BudgetRepository;
import com.financeflow.repository.ExpenseRepository;

import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public AIService(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public String answer(String message, UserEntity user) {
        String lower = message.toLowerCase(Locale.ROOT);
        if (lower.contains("total expenses this month")) {
            BigDecimal total = expenseRepository.totalInRange(LocalDate.now().withDayOfMonth(1), LocalDate.now());
            return "Total expenses this month are " + total;
        }
        if (lower.contains("pending approvals")) {
            return "Pending approvals: " + expenseRepository.countByStatus(ExpenseStatus.PENDING);
        }
        if (lower.contains("which department spent the most")) {
            return expenseRepository.findAll().stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            e -> e.getDepartment().getName(),
                            java.util.stream.Collectors.reducing(BigDecimal.ZERO, com.financeflow.entity.ExpenseEntity::getAmount, BigDecimal::add)))
                    .entrySet().stream()
                    .max(java.util.Map.Entry.comparingByValue())
                    .map(entry -> entry.getKey() + " spent the most with " + entry.getValue())
                    .orElse("No expense data available");
        }
        if (lower.contains("generate financial summary") || lower.contains("monthly summary")) {
            BigDecimal total = expenseRepository.findAll().stream().map(com.financeflow.entity.ExpenseEntity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal allocated = budgetRepository.findAll().stream().map(b -> b.getAllocatedAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal used = budgetRepository.findAll().stream().map(b -> b.getUsedAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal utilization = allocated.signum() == 0 ? BigDecimal.ZERO : used.multiply(BigDecimal.valueOf(100)).divide(allocated, 2, java.math.RoundingMode.HALF_UP);
            return "This month total expenses were " + total + ". Budget utilization reached " + utilization + "%";
        }
        return "I can answer questions about expenses, budgets, approvals, and monthly summaries using live application data.";
    }
}