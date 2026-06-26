package com.klef.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.klef.demo.repository.DoctorRepository;
import com.klef.demo.repository.EmergencyRequestRepository;
import com.klef.demo.repository.PatientRepository;
import com.klef.demo.repository.ConsultationRepository;
import com.klef.demo.repository.ConsultationRoomRepository;
import com.klef.demo.entity.Doctor;
import com.klef.demo.entity.EmergencyRequest;
import com.klef.demo.entity.Patient;
import com.klef.demo.entity.Consultation;
import com.klef.demo.entity.ConsultationRoom;
import com.klef.demo.entity.MedicineReminder;
import com.klef.demo.entity.Prescription;
import com.klef.demo.entity.MedicalRecord;
import com.klef.demo.entity.MedicalReport;
import com.klef.demo.dto.DoctorDTO;
import com.klef.demo.repository.MedicineReminderRepository;
import com.klef.demo.repository.PrescriptionRepository;
import com.klef.demo.repository.MedicalRecordRepository;
import com.klef.demo.repository.MedicalReportRepository;

@Service
public class ChatbotService {

    private final WebClient webClient;
    private final String apiUrl;
    private final String apiKey;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private ConsultationRoomRepository consultationRoomRepository;

    @Autowired
    private MedicineReminderRepository medicineReminderRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private EmailService emailService;

    public ChatbotService(
            WebClient.Builder webClientBuilder,
            @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}") String apiUrl,
            @Value("${groq.api.key:YOUR_GROQ_API_KEY_HERE}") String apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public Mono<String> getChatResponse(String query, String role) {
        
        if ("YOUR_GROQ_API_KEY_HERE".equals(apiKey)) {
            return Mono.just("⚠️ **Configuration Required:** Please add a valid Groq API Key in your `application.properties` (`groq.api.key=...`) to enable the AI assistant.");
        }
        
        String systemInstruction = buildSystemPromptForRole(role);

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemInstruction);

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", query);

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(systemMessage);
        messages.add(userMessage);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.6);

        return this.webClient.post()
                .header("Authorization", "Bearer " + this.apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    try {
                        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                        if (choices != null && !choices.isEmpty()) {
                            Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
                            String content = (String) messageMap.get("content");
                            
                            // Parse JSON and extract intent + message
                            try {
                                ObjectMapper mapper = new ObjectMapper();
                                JsonNode node = mapper.readTree(content);
                                String intent = node.has("intent") ? node.get("intent").asText() : "";
                                String message = node.has("message") ? node.get("message").asText() : content;
                                
                                // Offload blocking DB calls to boundedElastic
                                return Mono.fromCallable(() -> processIntent(intent, node, message))
                                           .subscribeOn(Schedulers.boundedElastic());
                                           
                            } catch (Exception parseEx) {
                                // If LLM didn't return valid JSON, just return the raw text
                                return Mono.just(content);
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return Mono.just("Sorry, I am having trouble connecting to the medical AI core right now.");
                })
                .onErrorResume(e -> {
                    e.printStackTrace();
                    return Mono.just("⚠️ **API Error:** " + e.getMessage() + "\n\nPlease ensure your Groq API key is correct and valid.");
                });
    }

    private String processIntent(String intent, JsonNode node, String defaultMessage) {
        if ("getAvailableDoctors".equals(intent)) {
            List<Doctor> doctors = doctorRepository.findAll();
            
            // Map to DTO
            List<DoctorDTO> doctorDTOs = new ArrayList<>();
            for (Doctor d : doctors) {
                doctorDTOs.add(new DoctorDTO(d.getId(), "Dr. " + d.getFirstName() + " " + d.getLastName(), d.getSpecialization()));
            }

            StringBuilder sb = new StringBuilder(defaultMessage).append("\n\n**Available Doctors:**\n");
            if (doctorDTOs.isEmpty()) {
                sb.append("No doctors are currently available.");
            } else {
                for (DoctorDTO dto : doctorDTOs) {
                    sb.append("- **").append(dto.getName()).append("**\n")
                      .append("  - ID: `").append(dto.getId()).append("`\n")
                      .append("  - Specialty: ").append(dto.getField()).append("\n");
                }
            }
            return sb.toString();
        } 
        else if ("emergencySOS".equals(intent)) {
            String location = node.has("location") ? node.get("location").asText() : "Unknown Location";
            EmergencyRequest req = new EmergencyRequest();
            req.setTitle("SOS Emergency (Automated)");
            req.setLocation(location);
            req.setPriority("Critical");
            req.setStatus("Pending");
            req.setUnit("Ambulance");
            req.setTimestamp(java.time.LocalDateTime.now().toString());
            
            emergencyRequestRepository.save(req);
            
            return defaultMessage + "\n\n*(An SOS emergency request has been automatically created for location: " + location + ")*";
        }
        else if ("bookAppointment".equals(intent) || "bookVideoConsultation".equals(intent)) {
            boolean hasDoctorId = node.has("doctorId") && !node.get("doctorId").isNull() && !node.get("doctorId").asText().isEmpty();
            boolean hasDate = node.has("date") && !node.get("date").isNull() && !node.get("date").asText().isEmpty();
            boolean hasTime = node.has("time") && !node.get("time").isNull() && !node.get("time").asText().isEmpty();
            
            if (!hasDoctorId) {
                List<Doctor> doctors = doctorRepository.findAll();
                StringBuilder sb = new StringBuilder(defaultMessage).append("\n\n**Available Doctors:**\n");
                if (doctors.isEmpty()) {
                    sb.append("No doctors are currently available.");
                } else {
                    for (Doctor d : doctors) {
                        sb.append("- **Dr. ").append(d.getFirstName()).append(" ").append(d.getLastName()).append("**\n")
                          .append("  - ID: `").append(d.getId()).append("`\n")
                          .append("  - Specialty: ").append(d.getSpecialization()).append("\n");
                    }
                }
                return sb.toString();
            } else if (hasDate && hasTime) {
                Long doctorId = node.get("doctorId").asLong();
                Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 1L; // Mock or extracted
                
                Patient patient = patientRepository.findById(patientId).orElse(null);
                Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
                
                if (doctor != null && patient != null) {
                    Consultation consultation = new Consultation();
                    consultation.setPatient(patient);
                    consultation.setDoctor(doctor);
                    consultation.setPreferredDate(node.get("date").asText());
                    consultation.setPreferredTime(node.get("time").asText());
                    consultation.setStatus("Pending");
                    consultation.setBookingTimestamp(java.time.LocalDateTime.now());
                    
                    boolean isVideo = "bookVideoConsultation".equals(intent);
                    String issue = node.has("issue") ? node.get("issue").asText() : "";
                    if (isVideo) {
                        consultation.setHealthIssue(issue);
                    }
                    
                    Consultation savedConsultation = consultationRepository.save(consultation);
                    
                    if (isVideo) {
                        ConsultationRoom room = new ConsultationRoom();
                        room.setConsultation(savedConsultation);
                        room.setDoctor(doctor);
                        room.setPatient(patient);
                        room.setRoomStatus("PENDING");
                        room.setMeetingLink("/room/" + java.util.UUID.randomUUID().toString().substring(0, 8));
                        room.setCreatedAt(java.time.LocalDateTime.now());
                        consultationRoomRepository.save(room);
                    }
                    
                    String doctorEmail = doctor.getEmail();
                    if (doctorEmail != null && !doctorEmail.isEmpty()) {
                        emailService.sendAppointmentNotification(doctorEmail, doctor.getFirstName(), patient.getFirstName(), node.get("date").asText(), node.get("time").asText(), isVideo, issue);
                    }
                    
                    return defaultMessage + "\n\n*(Your " + (isVideo ? "video consultation" : "appointment") + " has been successfully booked. The doctor has been notified via email.)*";
                } else {
                    return "Error: Could not find the specified doctor or patient in the database.";
                }
            }
        }
        else if ("cancelAppointment".equals(intent)) {
            if (node.has("appointmentId")) {
                Long appointmentId = node.get("appointmentId").asLong();
                return consultationRepository.findById(appointmentId).map(consultation -> {
                    consultation.setStatus("Cancelled");
                    consultationRepository.save(consultation);
                    return defaultMessage + "\n\n*(Appointment " + appointmentId + " has been successfully cancelled in the system.)*";
                }).orElse("Error: Could not find appointment with ID " + appointmentId + " in the database.");
            }
        }
        else if ("setMedicineReminder".equals(intent)) {
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 1L;
            String medicineName = node.has("medicineName") ? node.get("medicineName").asText() : "";
            String dosage = node.has("dosage") ? node.get("dosage").asText() : "";
            String time = node.has("time") ? node.get("time").asText() : "";

            Patient patient = patientRepository.findById(patientId).orElse(null);
            if (patient != null) {
                MedicineReminder reminder = new MedicineReminder();
                reminder.setPatient(patient);
                reminder.setMedicineName(medicineName);
                reminder.setDosage(dosage);
                reminder.setTime(time);
                reminder.setStatus("Active");
                medicineReminderRepository.save(reminder);
                return defaultMessage + "\n\n*(Reminder set in your schedule for " + medicineName + " " + dosage + " at " + time + ")*";
            }
        }
        else if ("getPrescriptions".equals(intent)) {
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 1L;
            List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
            if (prescriptions == null || prescriptions.isEmpty()) {
                return defaultMessage + "\n\n**Your Prescriptions:**\nYou currently have no active prescriptions.";
            }
            StringBuilder sb = new StringBuilder(defaultMessage).append("\n\n**Your Prescriptions:**\n");
            for (Prescription p : prescriptions) {
                sb.append("- ").append(p.getMedicineName()).append(" (").append(p.getDosage()).append(") - ")
                  .append(p.getInstructions()).append("\n");
            }
            return sb.toString();
        }
        else if ("uploadMedicalReport".equals(intent)) {
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 1L;
            Patient patient = patientRepository.findById(patientId).orElse(null);
            if (patient != null) {
                String filePath = node.has("filePath") ? node.get("filePath").asText() : "unknown_file";
                MedicalReport report = new MedicalReport();
                report.setPatient(patient);
                report.setFileUrl(filePath);
                report.setUploadDate(java.time.LocalDateTime.now());
                medicalReportRepository.save(report);
                return defaultMessage + "\n\n*(File " + filePath + " saved to your medical records)*";
            }
        }
        else if ("viewMedicalRecords".equals(intent)) {
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 1L;
            List<MedicalRecord> records = medicalRecordRepository.findByPatientId(String.valueOf(patientId));
            if (records == null || records.isEmpty()) {
                return defaultMessage + "\n\n**Your Medical Records:**\nNo records found.";
            }
            StringBuilder sb = new StringBuilder(defaultMessage).append("\n\n**Your Medical Records:**\n");
            for (MedicalRecord r : records) {
                sb.append("- [").append(r.getDate()).append("] ").append(r.getTitle()).append(": ").append(r.getShortDescription()).append("\n");
            }
            return sb.toString();
        }
        else if ("summarizeMedicalReport".equals(intent)) {
            // The LLM handles the actual summarization in its generated defaultMessage, we just append a note
            return defaultMessage + "\n\n*(Summary generated by Medical AI)*";
        }
        
        return defaultMessage;
    }

    private String buildSystemPromptForRole(String role) {
        return "You are a healthcare automation assistant for the Remote Healthcare & Emergency Response Portal.\n" +
                "Your role is to interpret user requests and map them to backend API calls.\n" +
                "Always respond with strictly structured JSON output that specifies the intent, parameters, and a confirmation message.\n" +
                "Never expose sensitive data (API keys, passwords).\n" +
                "Always confirm destructive actions (like canceling appointments or deleting records).\n\n" +
                "Available Intents:\n" +
                "1. bookAppointment\n" +
                "   Parameters: { patientId, doctorId, date, time }\n" +
                "   Example: {\"intent\":\"bookAppointment\",\"patientId\":123,\"doctorId\":45,\"date\":\"2026-06-27\",\"time\":\"10:00\",\"message\":\"I’ll book your appointment with Dr. Ramesh on June 27 at 10 AM. Please confirm.\"}\n\n" +
                "2. bookVideoConsultation\n" +
                "   Parameters: { patientId, doctorId, date, time, issue }\n" +
                "   Example: {\"intent\":\"bookVideoConsultation\",\"patientId\":123,\"doctorId\":45,\"date\":\"2026-06-28\",\"time\":\"14:00\",\"issue\":\"Fever\",\"message\":\"I will book your video consultation for Fever with Dr. Ramesh on June 28 at 2 PM. Please confirm.\"}\n\n" +
                "2. getAvailableDoctors\n" +
                "   Parameters: {}\n" +
                "   Example: {\"intent\":\"getAvailableDoctors\",\"message\":\"Here are the available doctors.\"}\n\n" +
                "3. cancelAppointment\n" +
                "   Parameters: { appointmentId }\n" +
                "   Example: {\"intent\":\"cancelAppointment\",\"appointmentId\":789,\"message\":\"Are you sure you want to cancel appointment 789?\"}\n\n" +
                "4. uploadMedicalReport\n" +
                "   Parameters: { patientId, filePath }\n" +
                "   Example: {\"intent\":\"uploadMedicalReport\",\"patientId\":123,\"filePath\":\"blood_test.pdf\",\"message\":\"Your blood test report has been uploaded successfully.\"}\n\n" +
                "5. summarizeMedicalReport\n" +
                "   Parameters: { reportText }\n" +
                "   Example: {\"intent\":\"summarizeMedicalReport\",\"reportText\":\"Patient has elevated cholesterol levels...\",\"message\":\"Your report shows slightly high cholesterol. A low-fat diet is recommended.\"}\n\n" +
                "6. viewMedicalRecords\n" +
                "   Parameters: { patientId }\n" +
                "   Example: {\"intent\":\"viewMedicalRecords\",\"patientId\":123,\"message\":\"Here are your medical records.\"}\n\n" +
                "7. emergencySOS\n" +
                "   Parameters: { patientId, location }\n" +
                "   Example: {\"intent\":\"emergencySOS\",\"patientId\":123,\"location\":\"Vijayawada, AP\",\"message\":\"Emergency SOS triggered. An ambulance is on the way.\"}\n\n" +
                "8. getPrescriptions\n" +
                "   Parameters: { patientId }\n" +
                "   Example: {\"intent\":\"getPrescriptions\",\"patientId\":123,\"message\":\"Here are your active prescriptions.\"}\n\n" +
                "9. setMedicineReminder\n" +
                "   Parameters: { patientId, medicineName, dosage, time }\n" +
                "   Example: {\"intent\":\"setMedicineReminder\",\"patientId\":123,\"medicineName\":\"Atorvastatin\",\"dosage\":\"10mg\",\"time\":\"21:00\",\"message\":\"I've set a reminder for Atorvastatin 10mg at 9 PM.\"}\n\n" +
                "Rules:\n" +
                "- Always return ONLY a single valid JSON object containing the \"intent\", required parameters, and a \"message\" field.\n" +
                "- Do NOT wrap the JSON in Markdown formatting (no ```json). Return pure JSON.\n" +
                "- The \"message\" field MUST contain the human-readable confirmation message to display to the user.\n" +
                "- If the user wants to book an appointment or video consultation but hasn't provided a doctor ID, set the intent to \"bookAppointment\" or \"bookVideoConsultation\" and leave doctorId empty. Do NOT use \"clarify\" in this case.\n" +
                "- If the request is otherwise unclear, ask for clarification in the message field and set intent to \"clarify\".\n" +
                "- For medical summaries, simplify technical terms for patients.\n\n" +
                "Current User Role: " + role;
    }
}
