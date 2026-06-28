package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.Prescription;
import com.medicalpro.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        prescription.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(prescriptionRepository.save(prescription));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionRepository.findByPatientId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        return prescriptionRepository.findById(id).map(p -> {
            p.setMedicineName(prescription.getMedicineName());
            p.setDosage(prescription.getDosage());
            p.setMorning(prescription.getMorning());
            p.setAfternoon(prescription.getAfternoon());
            p.setNight(prescription.getNight());
            p.setDuration(prescription.getDuration());
            p.setInstructions(prescription.getInstructions());
            return ResponseEntity.ok(prescriptionRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}
