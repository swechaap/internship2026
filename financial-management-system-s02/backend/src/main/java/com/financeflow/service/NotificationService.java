package com.financeflow.service;

import com.financeflow.entity.NotificationEntity;
import com.financeflow.entity.UserEntity;
import com.financeflow.repository.NotificationRepository;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void notify(UserEntity user, String title, String message, String type) {
        notificationRepository.save(NotificationEntity.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .readFlag(false)
                .build());
    }
}