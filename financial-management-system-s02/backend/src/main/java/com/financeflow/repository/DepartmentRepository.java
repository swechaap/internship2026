package com.financeflow.repository;

import java.util.Optional;

import com.financeflow.entity.DepartmentEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {
    Optional<DepartmentEntity> findByNameIgnoreCase(String name);
}