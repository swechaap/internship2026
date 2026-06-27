package com.financeflow.repository;

import java.util.List;

import com.financeflow.entity.ExpenseApprovalEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseApprovalRepository extends JpaRepository<ExpenseApprovalEntity, Long> {
    List<ExpenseApprovalEntity> findByExpenseIdOrderByCreatedAtDesc(Long expenseId);
}