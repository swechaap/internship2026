package com.klef.demo.controller;

import com.klef.demo.entity.MedicineReminder;
import com.klef.demo.repository.MedicineReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin("*")
public class MedicineReminderController {

    @Autowired
    private MedicineReminderRepository reminderRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicineReminder>> getRemindersForPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(reminderRepository.findByPatientId(patientId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MedicineReminder> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return reminderRepository.findById(id).map(reminder -> {
            reminder.setStatus(status);
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }).orElse(ResponseEntity.notFound().build());
    }
}
