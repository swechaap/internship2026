package com.medicalpro.backend.repository;

import com.medicalpro.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndUserRoleOrderByTimestampDesc(Long userId, String userRole);
}
