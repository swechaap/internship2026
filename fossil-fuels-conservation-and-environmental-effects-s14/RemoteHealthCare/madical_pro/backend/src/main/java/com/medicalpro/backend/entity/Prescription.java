package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private String medicineName;
    private String dosage;
    private Boolean morning;
    private Boolean afternoon;
    private Boolean night;
    private String duration;
    private String instructions;
    private LocalDateTime createdAt;
}
