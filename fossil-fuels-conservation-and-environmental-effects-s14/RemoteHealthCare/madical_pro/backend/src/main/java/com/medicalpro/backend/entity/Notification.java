package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String userRole; // "PATIENT" or "DOCTOR"
    
    private String message;
    private String type; // APPOINTMENT, REPORT, PRESCRIPTION
    private Boolean isRead;
    private LocalDateTime timestamp;
}
