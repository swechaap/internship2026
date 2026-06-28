package com.medicalpro.backend.repository;

import com.medicalpro.backend.entity.ConsultationNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConsultationNoteRepository extends JpaRepository<ConsultationNote, Long> {
    Optional<ConsultationNote> findByConsultationId(Long consultationId);
}
