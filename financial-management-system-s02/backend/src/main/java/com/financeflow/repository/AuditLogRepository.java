package com.financeflow.repository;

import java.util.List;

import com.financeflow.entity.AuditLogEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Long> {
    List<AuditLogEntity> findTop50ByOrderByCreatedAtDesc();
}