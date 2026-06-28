package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.ConsultationRoom;
import com.medicalpro.backend.repository.ConsultationRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class ConsultationRoomController {

    @Autowired
    private ConsultationRoomRepository roomRepository;

    @GetMapping("/{roomId}")
    public ResponseEntity<ConsultationRoom> getRoomDetails(@PathVariable Long roomId) {
        return roomRepository.findById(roomId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<ConsultationRoom> getRoomByConsultation(@PathVariable Long consultationId) {
        return roomRepository.findByConsultationId(consultationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
