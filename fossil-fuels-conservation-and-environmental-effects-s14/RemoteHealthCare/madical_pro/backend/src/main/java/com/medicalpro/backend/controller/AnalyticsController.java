package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.TreatmentProgress;
import com.medicalpro.backend.repository.TreatmentProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private TreatmentProgressRepository treatmentProgressRepository;

    @GetMapping("/patient/{id}")
    public ResponseEntity<TreatmentProgress> getPatientAnalytics(@PathVariable Long id) {
        TreatmentProgress progress = treatmentProgressRepository.findByPatientId(id);
        if (progress != null) {
            return ResponseEntity.ok(progress);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
