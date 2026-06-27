package com.financeflow.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.financeflow.entity.ExpenseEntity;
import com.financeflow.entity.enums.ExpenseStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    List<ExpenseEntity> findByStatusOrderByCreatedAtDesc(ExpenseStatus status);

    List<ExpenseEntity> findByCreatedByEmailIgnoreCaseOrderByCreatedAtDesc(String email);

    @Query("select coalesce(sum(e.amount), 0) from ExpenseEntity e where e.expenseDate between :start and :end")
    BigDecimal totalInRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("select count(e) from ExpenseEntity e where e.status = :status")
    long countByStatus(@Param("status") ExpenseStatus status);
}