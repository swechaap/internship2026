import WebSocketService from './WebSocketService';
import adapter from 'webrtc-adapter';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.roomId = null;
        this.isDoctor = false;
        
        // Callbacks
        this.onRemoteStream = null;
        this.onIceCandidate = null;
    }

    async initialize(roomId, isDoctor, onRemoteStreamCallback) {
        this.roomId = roomId;
        this.isDoctor = isDoctor;
        this.onRemoteStream = onRemoteStreamCallback;

        this.peerConnection = new RTCPeerConnection(configuration);

        // Handle incoming remote tracks
        this.peerConnection.ontrack = (event) => {
            if (this.onRemoteStream) {
                this.onRemoteStream(event.streams[0]);
            }
        };

        // Handle local ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                WebSocketService.sendMessage(`/app/peer/candidate/${this.roomId}`, {
                    candidate: event.candidate,
                    sender: isDoctor ? 'DOCTOR' : 'PATIENT'
                });
            }
        };

        // Subscriptions for signaling
        WebSocketService.subscribe(`/topic/room/${this.roomId}/offer`, async (message) => {
            const data = JSON.parse(message.body);
            if ((isDoctor && data.sender === 'PATIENT') || (!isDoctor && data.sender === 'DOCTOR')) {
                await this.handleReceiveOffer(data.offer);
            }
        });

        WebSocketService.subscribe(`/topic/room/${this.roomId}/answer`, async (message) => {
            const data = JSON.parse(message.body);
            if ((isDoctor && data.sender === 'PATIENT') || (!isDoctor && data.sender === 'DOCTOR')) {
                await this.handleReceiveAnswer(data.answer);
            }
        });

        WebSocketService.subscribe(`/topic/room/${this.roomId}/candidate`, async (message) => {
            const data = JSON.parse(message.body);
            if ((isDoctor && data.sender === 'PATIENT') || (!isDoctor && data.sender === 'DOCTOR')) {
                await this.handleNewICECandidateMsg(data.candidate);
            }
        });

        // Get local media
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            return this.localStream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
            throw error;
        }
    }

    async createOffer() {
        if (!this.peerConnection) return;
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        WebSocketService.sendMessage(`/app/peer/offer/${this.roomId}`, {
            offer: offer,
            sender: this.isDoctor ? 'DOCTOR' : 'PATIENT'
        });
    }

    async handleReceiveOffer(offer) {
        if (!this.peerConnection) return;
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        WebSocketService.sendMessage(`/app/peer/answer/${this.roomId}`, {
            answer: answer,
            sender: this.isDoctor ? 'DOCTOR' : 'PATIENT'
        });
    }

    async handleReceiveAnswer(answer) {
        if (!this.peerConnection) return;
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async handleNewICECandidateMsg(candidate) {
        if (!this.peerConnection) return;
        try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }

    toggleAudio(enabled) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => track.enabled = enabled);
        }
    }

    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => track.enabled = enabled);
        }
    }

    async toggleScreenShare() {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const videoTrack = displayStream.getVideoTracks()[0];
            
            const sender = this.peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
            if (sender) {
                sender.replaceTrack(videoTrack);
            }

            videoTrack.onended = () => {
                const originalVideoTrack = this.localStream.getVideoTracks()[0];
                const activeSender = this.peerConnection.getSenders().find(s => s.track.kind === originalVideoTrack.kind);
                if (activeSender) {
                    activeSender.replaceTrack(originalVideoTrack);
                }
            };

            return displayStream;
        } catch (e) {
            console.error("Screen sharing failed", e);
            return null;
        }
    }

    closeConnection() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        WebSocketService.unsubscribe(`/topic/room/${this.roomId}/offer`);
        WebSocketService.unsubscribe(`/topic/room/${this.roomId}/answer`);
        WebSocketService.unsubscribe(`/topic/room/${this.roomId}/candidate`);
    }
}

export default new WebRTCService();
