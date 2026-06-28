package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Data
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private String healthIssue;
    private String symptoms;
    private String previousMedicalConditions;
    private String preferredDate;
    private String preferredTime;
    private String additionalNotes;
    
    private LocalDateTime bookingTimestamp;
    
    // Status: Pending, Accepted, Rejected, Rescheduled, Ongoing, Completed
    private String status;
    private String priorityLevel;
}
