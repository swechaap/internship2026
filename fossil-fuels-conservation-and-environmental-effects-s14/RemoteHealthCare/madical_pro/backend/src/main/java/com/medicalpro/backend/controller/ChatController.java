package com.medicalpro.backend.controller;

import com.medicalpro.backend.entity.ConsultationMessage;
import com.medicalpro.backend.repository.ConsultationMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ConsultationMessageRepository messageRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ConsultationMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setReadStatus(false);
        ConsultationMessage saved = messageRepository.save(chatMessage);
        
        messagingTemplate.convertAndSend("/topic/consultation/" + chatMessage.getConsultation().getId(), saved);
    }
    
    @MessageMapping("/webrtc.signal")
    public void processWebRTCSignal(@Payload String signalPayload) {
        // Broadcast the WebRTC signal to all participants in the room
        messagingTemplate.convertAndSend("/topic/webrtc", signalPayload);
    }
}
