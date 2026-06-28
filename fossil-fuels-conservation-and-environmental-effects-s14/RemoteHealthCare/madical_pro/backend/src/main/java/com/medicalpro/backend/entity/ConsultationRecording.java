package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_recordings")
@Data
public class ConsultationRecording {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordingId;

    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    private String recordingUrl;
    private LocalDateTime recordingStart;
    private LocalDateTime recordingEnd;
}
