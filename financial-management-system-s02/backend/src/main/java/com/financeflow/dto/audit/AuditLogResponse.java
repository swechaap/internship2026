package com.financeflow.dto.audit;

import java.time.Instant;

public record AuditLogResponse(Long id, String user, String role, String action, String entityName, String details, Instant createdAt) {
}