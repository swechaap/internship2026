package com.financeflow.dto.auth;

public record AuthResponse(String accessToken, String refreshToken, String email, String role, String fullName) {
}