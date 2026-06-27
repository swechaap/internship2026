package com.financeflow.repository;

import java.util.List;

import com.financeflow.entity.ChatHistoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryRepository extends JpaRepository<ChatHistoryEntity, Long> {
    List<ChatHistoryEntity> findTop20ByUserEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}