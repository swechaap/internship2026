package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_participants")
@Data
public class ConsultationParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantId;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ConsultationRoom room;

    private Long userId; // Can be patient or doctor ID
    private String role; // "PATIENT", "DOCTOR"
    
    private LocalDateTime joinTime;
    private LocalDateTime leaveTime;
}
