package com.medicalpro.backend.repository;

import com.medicalpro.backend.entity.ConsultationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationParticipantRepository extends JpaRepository<ConsultationParticipant, Long> {
    List<ConsultationParticipant> findByRoomRoomId(Long roomId);
}
