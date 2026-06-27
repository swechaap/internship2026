package com.financeflow.dto.auth;

public record UserProfileResponse(Long id, String fullName, String email, String role, boolean active) {
}