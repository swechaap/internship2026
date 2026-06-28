package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_notes")
@Data
public class ConsultationNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private String diagnosis;
    private String notes;
    private String recommendations;
    private String treatmentPlan;
    private LocalDateTime createdAt;
}
