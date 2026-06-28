package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_messages")
@Data
public class ConsultationMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;
    
    private String senderRole; // "PATIENT" or "DOCTOR"
    private Long senderId;
    
    private String content;
    private LocalDateTime timestamp;
    private Boolean readStatus;
}
