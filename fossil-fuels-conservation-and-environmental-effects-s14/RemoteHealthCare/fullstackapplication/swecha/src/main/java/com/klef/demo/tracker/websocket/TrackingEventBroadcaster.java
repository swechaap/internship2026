package com.klef.demo.tracker.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class TrackingEventBroadcaster {
  private final SimpMessagingTemplate messagingTemplate;

  public TrackingEventBroadcaster(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void broadcast(String topic, Object payload) {
    messagingTemplate.convertAndSend(topic, payload);
  }

  public void ambulanceAssigned(Object payload) {
    broadcast("/topic/ambulance-assigned", payload);
  }

  public void locationUpdate(Object payload) {
    broadcast("/topic/location-update", payload);
  }

  public void ambulanceNearby(Object payload) {
    broadcast("/topic/ambulance-nearby", payload);
  }

  public void patientPicked(Object payload) {
    broadcast("/topic/patient-picked", payload);
  }

  public void hospitalReached(Object payload) {
    broadcast("/topic/hospital-reached", payload);
  }

  public void statusChange(Object payload) {
    broadcast("/topic/status-change", payload);
  }
}
