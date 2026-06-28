package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.Consultation;
import com.medicalpro.backend.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationRepository consultationRepository;

    @PostMapping("/book")
    public ResponseEntity<Consultation> bookConsultation(@RequestBody Consultation consultation) {
        consultation.setBookingTimestamp(LocalDateTime.now());
        consultation.setStatus("Pending");
        Consultation saved = consultationRepository.save(consultation);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<Consultation>> getPatientConsultations(@PathVariable Long id) {
        return ResponseEntity.ok(consultationRepository.findByPatientId(id));
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<List<Consultation>> getDoctorConsultations(@PathVariable Long id) {
        return ResponseEntity.ok(consultationRepository.findByDoctorId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long id) {
        return consultationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.medicalpro.backend.repository.ConsultationRoomRepository roomRepository;

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @PutMapping("/status/{id}")
    public ResponseEntity<Consultation> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return consultationRepository.findById(id).map(c -> {
            c.setStatus(status);
            Consultation saved = consultationRepository.save(c);
            
            if ("Approved".equalsIgnoreCase(status)) {
                // Generate secure video consultation room
                com.medicalpro.backend.entity.ConsultationRoom room = new com.medicalpro.backend.entity.ConsultationRoom();
                room.setConsultation(saved);
                room.setDoctor(saved.getDoctor());
                room.setPatient(saved.getPatient());
                room.setRoomStatus("PENDING");
                room.setMeetingLink("/consultation/room/" + java.util.UUID.randomUUID().toString());
                room.setCreatedAt(LocalDateTime.now());
                roomRepository.save(room);
                
                // Notify patient instantly
                messagingTemplate.convertAndSend("/topic/patient/" + saved.getPatient().getId() + "/notifications", 
                        "Your consultation request has been approved.");
            }
            
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
