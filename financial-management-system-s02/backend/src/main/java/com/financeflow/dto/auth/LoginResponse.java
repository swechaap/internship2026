package com.financeflow.dto.auth;

public record LoginResponse(String accessToken, String refreshToken, String role, String fullName, String email) {
}