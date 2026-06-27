package com.financeflow.repository;

import java.util.List;

import com.financeflow.entity.BudgetEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    List<BudgetEntity> findByDepartmentId(Long departmentId);
}