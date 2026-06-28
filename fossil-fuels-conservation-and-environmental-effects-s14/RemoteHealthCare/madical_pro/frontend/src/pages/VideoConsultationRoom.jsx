import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare, Users, Settings, MoreVertical, Send } from 'lucide-react';
import WebRTCService from '../services/WebRTCService';
import WebSocketService from '../services/WebSocketService';
import axios from 'axios';

const VideoConsultationRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    const [isConnected, setIsConnected] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null);

    // In a real app, determine this from the logged-in user context
    const isDoctor = localStorage.getItem('userRole') === 'DOCTOR';
    const userId = localStorage.getItem('userId') || 1; // Fallback for demo

    useEffect(() => {
        const initRoom = async () => {
            try {
                // Connect WebSocket
                WebSocketService.connect(userId, async () => {
                    // Fetch room details
                    const { data: room } = await axios.get(`http://localhost:8080/api/rooms/${roomId}`);
                    setRoomDetails(room);

                    // Initialize WebRTC
                    const localStream = await WebRTCService.initialize(roomId, isDoctor, (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStream;
                    }

                    // If Doctor, wait for patient to join. If Patient, create offer.
                    if (!isDoctor) {
                        setTimeout(() => WebRTCService.createOffer(), 2000);
                    }

                    // Subscribe to chat
                    WebSocketService.subscribe(`/topic/room/${roomId}/chat`, (msg) => {
                        const chatData = JSON.parse(msg.body);
                        setMessages(prev => [...prev, chatData]);
                    });
                });

            } catch (err) {
                console.error("Failed to initialize room:", err);
                alert("Failed to access camera/microphone or connect to the room.");
            }
        };

        initRoom();

        return () => {
            WebRTCService.closeConnection();
            WebSocketService.disconnect();
        };
    }, [roomId, isDoctor, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled);
        WebRTCService.toggleAudio(!isAudioEnabled);
    };

    const toggleVideo = () => {
        setIsVideoEnabled(!isVideoEnabled);
        WebRTCService.toggleVideo(!isVideoEnabled);
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            const stream = await WebRTCService.toggleScreenShare();
            if (stream && localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                setIsScreenSharing(true);
            }
        } else {
            // Need a way to revert back to camera in WebRTCService
            setIsScreenSharing(false);
            window.location.reload(); // Simple fallback for demo to reset stream
        }
    };

    const endCall = () => {
        WebRTCService.closeConnection();
        if (isDoctor) {
            // Redirect to summary/prescription page
            navigate(`/doctor-dashboard`); // Or `/consultation/summary/${roomId}`
        } else {
            navigate('/patient-dashboard');
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const chatPayload = {
                senderId: userId,
                senderRole: isDoctor ? 'Doctor' : 'Patient',
                text: newMessage,
                timestamp: new Date().toISOString()
            };
            WebSocketService.sendMessage(`/app/peer/chat/${roomId}`, chatPayload); // Ensure backend has this mapping, or use topic directly
            WebSocketService.client.publish({ destination: `/topic/room/${roomId}/chat`, body: JSON.stringify(chatPayload) }); // Direct publish for demo
            setNewMessage('');
        }
    };

    return (
        <div className="h-screen bg-[#0A192F] flex flex-col font-sans overflow-hidden">
            
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-[#0f274a] border-b border-white/10 z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full bg-[#00E5FF] animate-pulse"></div>
                    <h1 className="text-white font-semibold text-lg">
                        Consultation Room {roomDetails?.consultation?.id ? `#${roomDetails.consultation.id}` : ''}
                    </h1>
                </div>
                <div className="text-gray-400 text-sm flex items-center">
                    <span className={`px-2 py-1 rounded text-xs mr-4 ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {isConnected ? 'Connected' : 'Waiting for other participant...'}
                    </span>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex relative p-4 gap-4">
                
                {/* Video Grid */}
                <div className={`flex-1 flex flex-col lg:flex-row gap-4 transition-all duration-300 ${isChatOpen ? 'lg:pr-80' : ''}`}>
                    
                    {/* Remote Video (Doctor/Patient) */}
                    <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border border-white/10 shadow-lg">
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 flex-col">
                                <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400">Waiting for {isDoctor ? 'patient' : 'doctor'} to join...</p>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm">
                            {isDoctor ? 'Patient' : 'Dr. ' + (roomDetails?.doctor?.name || '')}
                        </div>
                    </div>

                    {/* Local Video (Self) */}
                    <div className="w-1/3 max-w-sm lg:w-1/4 min-w-[240px] bg-gray-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-lg flex-shrink-0 self-end lg:self-auto h-48 lg:h-auto z-10 lg:absolute lg:bottom-4 lg:right-4 lg:h-64 lg:w-96 shadow-2xl transition-all">
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className={`w-full h-full object-cover ${!isScreenSharing ? 'scale-x-[-1]' : ''}`} // Mirror local cam
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                            You
                        </div>
                        {(!isVideoEnabled) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                    <VideoOff className="text-white w-6 h-6" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className={`absolute top-0 right-0 h-full w-80 bg-[#0f274a] border-l border-white/10 flex flex-col transition-transform duration-300 z-20 shadow-2xl ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-white font-semibold flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> In-call Messages</h2>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}>
                                <div className="text-xs text-gray-400 mb-1">{msg.senderRole}</div>
                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.senderId === userId ? 'bg-[#00E5FF] text-[#0A192F] rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-[#00E5FF] text-sm"
                        />
                        <button type="submit" className="bg-[#00E5FF] text-[#0A192F] p-2 rounded-full hover:bg-cyan-400 transition">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </main>

            {/* Bottom Controls (Google Meet Style) */}
            <div className="h-24 bg-[#0f274a] flex items-center justify-between px-8 z-30">
                <div className="w-1/3">
                    {/* Empty left space for balance */}
                </div>
                
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAudioEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    
                    <button 
                        onClick={toggleVideo}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>

                    <button 
                        onClick={toggleScreenShare}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? 'bg-[#00E5FF] text-[#0A192F]' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                        <MonitorUp className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={endCall}
                        className="w-16 h-12 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>
                </div>

                <div className="w-1/3 flex justify-end items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-white/10">
                        <Users className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-2 transition rounded-full hover:bg-white/10 relative ${isChatOpen ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        {/* Notification dot can go here */}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-white/10">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default VideoConsultationRoom;
