import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(userId, onConnectCallback) {
        if (this.client && this.client.active) {
            if (onConnectCallback) onConnectCallback();
            return;
        }

        // Use the same host/port as backend, assuming standard local setup.
        // In production, this should be derived from environment variables.
        const socketUrl = 'http://localhost:8080/ws';

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                if (onConnectCallback) onConnectCallback();
                
                // General notification subscription
                if (userId) {
                    this.subscribe(`/topic/patient/${userId}/notifications`, (msg) => {
                        console.log('Notification:', msg.body);
                        // Can be hooked up to a toast system
                    });
                }
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (!this.client || !this.client.connected) {
            console.warn('Cannot subscribe, STOMP client not connected');
            return null;
        }

        const subscription = this.client.subscribe(topic, callback);
        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    unsubscribe(topic) {
        const sub = this.subscriptions.get(topic);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    sendMessage(destination, body) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn('Cannot send message, STOMP client not connected');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export default new WebSocketService();
