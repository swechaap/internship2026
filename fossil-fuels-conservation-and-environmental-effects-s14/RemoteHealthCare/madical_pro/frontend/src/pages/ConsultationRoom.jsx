import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaDesktop, FaHandPaper, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ConsultationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC Stubs
  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // In a real WebRTC app, we'd create RTCPeerConnection here, add tracks, and exchange signaling data via WebSockets
      } catch (err) {
        console.error("Error accessing media devices", err);
      }
    }
    setupMedia();

    return () => {
      // Cleanup streams
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputMessage, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInputMessage('');
  };

  const endCall = () => {
    navigate('/');
  };

  return (
    <div className="flex h-full gap-4 relative">
      {/* Video Area */}
      <div className="flex-1 flex flex-col gap-4 relative">
        <div className="flex-1 bg-black/60 rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl flex items-center justify-center">
           {/* Remote Video Placeholder */}
           <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 rounded-full bg-gray-700 animate-pulse flex items-center justify-center text-4xl text-gray-500">
                DR
             </div>
           </div>
           <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-md text-sm text-white backdrop-blur-sm z-10">
             Dr. Sarah Connor
           </div>
           
           {/* Local Video */}
           <div className="absolute bottom-4 right-4 w-48 h-32 bg-black rounded-xl border-2 border-cyan/50 overflow-hidden shadow-lg z-10">
             <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`} />
             {isVideoOff && (
               <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                 Video Off
               </div>
             )}
           </div>
        </div>

        {/* Controls */}
        <div className="h-20 bg-black/40 backdrop-blur-md rounded-2xl border border-gray-800 flex items-center justify-center gap-6">
           <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
           </button>
           <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
              {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
           </button>
           <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all">
              <FaDesktop />
           </button>
           <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all">
              <FaHandPaper />
           </button>
           <button onClick={endCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <FaPhoneSlash />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-80 bg-black/30 backdrop-blur-md rounded-2xl border border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 font-bold text-lg">In-call Messages</div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map(msg => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col max-w-[80%] ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div className={`p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-cyan text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'}`}>
                {msg.text}
              </div>
              <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 relative">
           <input 
             type="text" 
             value={inputMessage}
             onChange={e => setInputMessage(e.target.value)}
             placeholder="Type a message..." 
             className="w-full bg-black/40 border border-gray-700 rounded-full py-3 pl-4 pr-12 text-white focus:outline-none focus:border-cyan"
           />
           <button type="submit" className="absolute right-6 top-1/2 transform -translate-y-1/2 text-cyan hover:text-white transition-colors">
              <FaPaperPlane />
           </button>
        </form>
      </div>
    </div>
  );
}
