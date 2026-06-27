package com.financeflow.service;

import java.math.BigDecimal;
import java.util.List;

import com.financeflow.dto.budget.BudgetRequest;
import com.financeflow.dto.budget.BudgetResponse;
import com.financeflow.entity.BudgetEntity;
import com.financeflow.entity.DepartmentEntity;
import com.financeflow.exception.ResourceNotFoundException;
import com.financeflow.repository.BudgetRepository;
import com.financeflow.repository.DepartmentRepository;
import com.financeflow.repository.ExpenseRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final DepartmentRepository departmentRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, DepartmentRepository departmentRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.departmentRepository = departmentRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> list() {
        return budgetRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public BudgetResponse save(BudgetRequest request) {
        DepartmentEntity department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        BigDecimal used = expenseRepository.findAll().stream()
                .filter(expense -> expense.getDepartment() != null && expense.getDepartment().getId().equals(request.departmentId()))
                .map(expense -> expense.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal remaining = request.allocatedAmount().subtract(used);
        BudgetEntity budget = BudgetEntity.builder()
                .budgetName(request.budgetName())
                .department(department)
                .allocatedAmount(request.allocatedAmount())
                .usedAmount(used)
                .remainingAmount(remaining)
                .validFrom(request.validFrom())
                .validTo(request.validTo())
                .alert80PercentSent(false)
                .alertExceededSent(false)
                .build();
        return toResponse(budgetRepository.save(budget));
    }

    private BudgetResponse toResponse(BudgetEntity budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getBudgetName(),
                budget.getDepartment() != null ? budget.getDepartment().getName() : null,
                budget.getAllocatedAmount(),
                budget.getUsedAmount(),
                budget.getRemainingAmount(),
                budget.getValidFrom(),
                budget.getValidTo());
    }
}