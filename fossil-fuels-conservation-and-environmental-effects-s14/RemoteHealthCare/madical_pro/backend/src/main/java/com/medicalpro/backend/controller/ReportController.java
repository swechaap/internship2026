package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.MedicalReport;
import com.medicalpro.backend.repository.MedicalReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @PostMapping("/upload")
    public ResponseEntity<MedicalReport> uploadReport(@RequestBody MedicalReport report) {
        report.setUploadDate(LocalDateTime.now());
        report.setStatus("Uploaded");
        return ResponseEntity.ok(medicalReportRepository.save(report));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<MedicalReport>> getPatientReports(@PathVariable Long id) {
        return ResponseEntity.ok(medicalReportRepository.findByPatientId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReport> getReport(@PathVariable Long id) {
        return medicalReportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        medicalReportRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
