package com.financeflow.service;

import com.financeflow.dto.chat.ChatRequest;
import com.financeflow.dto.chat.ChatResponse;
import com.financeflow.entity.ChatHistoryEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.repository.ChatHistoryRepository;
import com.financeflow.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public ChatService(ChatHistoryRepository chatHistoryRepository, UserRepository userRepository, AIService aiService) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    public ChatResponse answer(ChatRequest request, String email) {
        return chat(request, email);
    }

    public ChatResponse chat(ChatRequest request, String email) {
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String answer = aiService.answer(request.message(), user);
        chatHistoryRepository.save(ChatHistoryEntity.builder()
                .user(user)
                .question(request.message())
                .answer(answer)
                .askedAt(java.time.Instant.now())
                .build());
        return new ChatResponse(answer);
    }
}