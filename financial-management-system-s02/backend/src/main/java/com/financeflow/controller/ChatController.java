package com.financeflow.controller;

import java.security.Principal;

import com.financeflow.dto.chat.ChatRequest;
import com.financeflow.dto.chat.ChatResponse;
import com.financeflow.service.ChatService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request, Principal principal) {
        return ResponseEntity.ok(chatService.answer(request, principal.getName()));
    }
}