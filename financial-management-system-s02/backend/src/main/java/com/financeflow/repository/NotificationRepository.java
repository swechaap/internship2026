package com.financeflow.repository;

import java.util.List;

import com.financeflow.entity.NotificationEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}