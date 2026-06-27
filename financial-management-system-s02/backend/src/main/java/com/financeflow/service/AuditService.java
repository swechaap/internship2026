package com.financeflow.service;

import com.financeflow.entity.AuditLogEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.repository.AuditLogRepository;

import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void record(UserEntity user, String action, String entityName, String details) {
        auditLogRepository.save(AuditLogEntity.builder()
                .user(user)
                .roleName(user != null && user.getRole() != null ? user.getRole().getName() : "SYSTEM")
                .action(action)
                .entityName(entityName)
                .details(details)
                .build());
    }
}