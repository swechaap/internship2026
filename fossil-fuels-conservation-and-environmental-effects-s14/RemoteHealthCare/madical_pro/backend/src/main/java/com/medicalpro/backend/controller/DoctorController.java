package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.Doctor;
import com.medicalpro.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/specialization/{name}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String name) {
        return ResponseEntity.ok(doctorRepository.findBySpecializationIgnoreCaseContaining(name));
    }
}
