package com.financeflow.repository;

import com.financeflow.entity.ReceiptEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<ReceiptEntity, Long> {
}