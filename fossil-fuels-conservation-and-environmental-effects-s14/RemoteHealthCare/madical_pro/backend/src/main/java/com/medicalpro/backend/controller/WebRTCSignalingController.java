package com.medicalpro.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebRTCSignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebRTCSignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/peer/offer/{roomId}")
    public void sendOffer(@DestinationVariable String roomId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/offer", payload);
    }

    @MessageMapping("/peer/answer/{roomId}")
    public void sendAnswer(@DestinationVariable String roomId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/answer", payload);
    }

    @MessageMapping("/peer/candidate/{roomId}")
    public void sendCandidate(@DestinationVariable String roomId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/candidate", payload);
    }
    
    @MessageMapping("/peer/join/{roomId}")
    public void joinRoom(@DestinationVariable String roomId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/join", payload);
    }
    
    @MessageMapping("/peer/leave/{roomId}")
    public void leaveRoom(@DestinationVariable String roomId, @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/leave", payload);
    }
}
