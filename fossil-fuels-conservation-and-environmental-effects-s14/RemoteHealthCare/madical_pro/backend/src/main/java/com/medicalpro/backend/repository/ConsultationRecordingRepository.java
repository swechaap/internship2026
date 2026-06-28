package com.medicalpro.backend.repository;

import com.medicalpro.backend.entity.ConsultationRecording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultationRecordingRepository extends JpaRepository<ConsultationRecording, Long> {
    Optional<ConsultationRecording> findByConsultationId(Long consultationId);
}
