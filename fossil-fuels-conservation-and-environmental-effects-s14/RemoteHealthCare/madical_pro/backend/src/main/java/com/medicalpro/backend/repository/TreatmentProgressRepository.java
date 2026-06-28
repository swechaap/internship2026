package com.medicalpro.backend.repository;

import com.medicalpro.backend.entity.TreatmentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreatmentProgressRepository extends JpaRepository<TreatmentProgress, Long> {
    TreatmentProgress findByPatientId(Long patientId);
}
