package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String qualification;
    private Integer experienceYears;
    private Double rating;
    private String hospitalName;
    private String availability;
    private Double consultationFee;
    private String specialization;
}
