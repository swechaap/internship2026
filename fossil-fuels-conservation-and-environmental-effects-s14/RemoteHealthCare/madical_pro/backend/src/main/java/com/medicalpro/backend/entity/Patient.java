package com.medicalpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Integer age;
    private String gender;
    private String phoneNumber;
    private Integer healthScore;
    private Double recoveryPercentage;
    
    private String previousMedicalConditions;
}
