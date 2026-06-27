package com.financeflow.service;

import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;

import com.financeflow.config.AppSecurityProperties;
import com.financeflow.dto.auth.AuthRequest;
import com.financeflow.dto.auth.AuthResponse;
import com.financeflow.dto.auth.RefreshRequest;
import com.financeflow.dto.auth.RegisterRequest;
import com.financeflow.entity.RoleEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.exception.ResourceNotFoundException;
import com.financeflow.repository.RoleRepository;
import com.financeflow.repository.UserRepository;
import com.financeflow.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppSecurityProperties securityProperties;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AppSecurityProperties securityProperties, AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.securityProperties = securityProperties;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));
        if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }
        String refreshToken = createRefreshToken(user.getEmail());
        user.setRefreshTokenHash(hash(refreshToken));
        user.setRefreshTokenExpiresAt(Instant.now().plusSeconds(securityProperties.refreshTokenDays() * 24 * 60 * 60));
        userRepository.save(user);
        auditService.record(user, "LOGIN", "users", "User logged in");
        return new AuthResponse(createAccessToken(user), refreshToken, user.getEmail(), user.getRole().getName(), user.getFullName());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        RoleEntity role = roleRepository.findByNameIgnoreCase(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        UserEntity user = UserEntity.builder()
                .fullName(request.fullName())
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .active(true)
                .build();
        userRepository.save(user);
        return login(new AuthRequest(request.email(), request.password()));
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        String email = jwtService.extractSubject(request.refreshToken());
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRefreshTokenHash() == null || !user.getRefreshTokenHash().equals(hash(request.refreshToken()))) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        return new AuthResponse(createAccessToken(user), request.refreshToken(), user.getEmail(), user.getRole().getName(), user.getFullName());
    }

    @Transactional
    public void logout(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            user.setRefreshTokenHash(null);
            user.setRefreshTokenExpiresAt(null);
            userRepository.save(user);
            auditService.record(user, "LOGOUT", "users", "User logged out");
        });
    }

    private String createAccessToken(UserEntity user) {
        return jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().getName(), "name", user.getFullName()), securityProperties.accessTokenMinutes());
    }

    private String createRefreshToken(String email) {
        return jwtService.generateToken(email, Map.of("type", "refresh"), securityProperties.refreshTokenDays() * 24 * 60);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes()));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to hash token", exception);
        }
    }
}