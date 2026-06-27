package com.financeflow.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.financeflow.dto.report.ReportResponse;
import com.financeflow.entity.ExpenseEntity;
import com.financeflow.repository.ExpenseRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ExpenseRepository expenseRepository;

    public ReportService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public ReportResponse summary() {
        List<ExpenseEntity> expenses = expenseRepository.findAll();
        BigDecimal total = expenses.stream()
                .map(expense -> expense.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        Map<String, BigDecimal> byDepartment = new LinkedHashMap<>();
        expenses.forEach(expense -> {
            byCategory.merge(expense.getCategory(), expense.getAmount(), BigDecimal::add);
            if (expense.getDepartment() != null) {
                byDepartment.merge(expense.getDepartment().getName(), expense.getAmount(), BigDecimal::add);
            }
        });
        return new ReportResponse(total, byCategory, byDepartment);
    }
}
