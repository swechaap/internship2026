package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "treatment_progress")
@Data
public class TreatmentProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private String treatmentStatus; // Pending, Ongoing, Completed
    private Double recoveryPercentage;
    private Integer healthScore;
    private LocalDateTime nextFollowUpDate;
    private LocalDateTime updatedAt;
}
