package com.medicalpro.backend.config;

import com.medicalpro.backend.entity.Doctor;
import com.medicalpro.backend.entity.Patient;
import com.medicalpro.backend.repository.DoctorRepository;
import com.medicalpro.backend.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(DoctorRepository doctorRepository, PatientRepository patientRepository) {
        return args -> {
            if (patientRepository.count() == 0) {
                Patient patient = new Patient();
                patient.setId(1L);
                patient.setName("John Doe");
                patient.setAge(35);
                patient.setGender("Male");
                patient.setPhoneNumber("1234567890");
                patientRepository.save(patient);
            }

            if (doctorRepository.count() == 0) {
                Doctor d1 = new Doctor();
                d1.setId(1L);
                d1.setName("Sarah Jenkins");
                d1.setSpecialization("Cardiologist");
                d1.setConsultationFee(150.0);
                doctorRepository.save(d1);

                Doctor d2 = new Doctor();
                d2.setId(2L);
                d2.setName("Michael Chen");
                d2.setSpecialization("General Physician");
                d2.setConsultationFee(80.0);
                doctorRepository.save(d2);

                Doctor d3 = new Doctor();
                d3.setId(3L);
                d3.setName("Emily Roberts");
                d3.setSpecialization("Neurologist");
                d3.setConsultationFee(200.0);
                doctorRepository.save(d3);
            }
        };
    }
}
