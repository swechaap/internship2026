package com.financeflow.repository;

import java.util.Optional;

import com.financeflow.entity.UserEntity;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    @EntityGraph(attributePaths = "role")
    Optional<UserEntity> findByEmailIgnoreCase(String email);
}
