package com.klef.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendCredentialsEmail(String toEmail, String name, String role, String password) {
        try {
            if (mailSender == null) {
                logger.warn("JavaMailSender is not configured. Email could not be sent to {}", toEmail);
                logger.info("[MOCK EMAIL] To: {}, Subject: CarePortal Login Credentials, Body: Hello {}, your new account as {} has been created. Use password: {} to log in.", toEmail, name, role, password);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@careportal.org");
            message.setTo(toEmail);
            message.setSubject("CarePortal - Your Secure Access Credentials");
            message.setText("Hello " + name + ",\n\n" +
                    "Your account has been created in the CarePortal Remote Healthcare Network by the Administrator.\n\n" +
                    "Here are your secure login credentials:\n" +
                    "----------------------------------------\n" +
                    "Role: " + role + "\n" +
                    "Authorized Email: " + toEmail + "\n" +
                    "Temporary Passkey: " + password + "\n" +
                    "----------------------------------------\n\n" +
                    "Please log in and update your passkey under settings.\n\n" +
                    "This is an automated security transmission. Please do not reply to this email.");
            
            mailSender.send(message);
            logger.info("Credentials email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send credentials email to " + toEmail, e);
            logger.info("[MOCK EMAIL FALLBACK] To: {}, Role: {}, Temp Passkey: {}", toEmail, role, password);
        }
    }
    public void sendAppointmentNotification(String toEmail, String doctorName, String patientName, String date, String time, boolean isVideo, String issue) {
        try {
            String typeStr = isVideo ? "Video Consultation" : "Appointment";
            if (mailSender == null) {
                logger.warn("JavaMailSender is not configured. Email could not be sent to {}", toEmail);
                logger.info("[MOCK EMAIL] To: {}, Subject: New {} Scheduled, Body: Hello Dr. {}, patient {} has booked a {} on {} at {}. Issue: {}", toEmail, typeStr, doctorName, patientName, typeStr, date, time, issue);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@careportal.org");
            message.setTo(toEmail);
            message.setSubject("CarePortal - New " + typeStr + " Scheduled");
            
            StringBuilder text = new StringBuilder();
            text.append("Hello Dr. ").append(doctorName).append(",\n\n")
                .append("A patient has booked a new ").append(typeStr.toLowerCase()).append(" with you via the CarePortal chatbot.\n\n")
                .append("Details:\n")
                .append("----------------------------------------\n")
                .append("Patient Name: ").append(patientName).append("\n")
                .append("Date: ").append(date).append("\n")
                .append("Time: ").append(time).append("\n");
            
            if (issue != null && !issue.isEmpty()) {
                text.append("Issue: ").append(issue).append("\n");
            }
            
            text.append("----------------------------------------\n\n");
            
            if (isVideo) {
                text.append("Please log in to the portal at the scheduled time to join the video consultation room.\n\n");
            }
            
            text.append("This is an automated notification. Please do not reply to this email.");
            
            message.setText(text.toString());
            mailSender.send(message);
            logger.info("Appointment notification email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send appointment notification email to " + toEmail, e);
            logger.info("[MOCK EMAIL FALLBACK] To: {}, Type: {}, Date: {}, Time: {}", toEmail, isVideo ? "Video Consultation" : "Appointment", date, time);
        }
    }
}
