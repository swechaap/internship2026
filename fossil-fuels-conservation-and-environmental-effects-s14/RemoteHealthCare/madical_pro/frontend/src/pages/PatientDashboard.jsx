import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const patientId = 1; // Hardcoded for demo

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/consultations/patient/${patientId}`);
        setConsultations(response.data);
      } catch (err) {
        console.error("Failed to fetch consultations", err);
      }
    };
    fetchConsultations();
  }, []);

  const handleJoinConsultation = async (consultationId) => {
    try {
        const { data: room } = await axios.get(`http://localhost:8080/api/rooms/consultation/${consultationId}`);
        if (room && room.roomId) {
            navigate(`/consultation/room/${room.roomId}`);
        } else {
            alert("Room not ready yet.");
        }
    } catch (e) {
        console.error("Room fetch failed", e);
        alert("Could not fetch room details. It might not be created yet.");
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan/20 to-transparent p-8 rounded-2xl border border-cyan/20 flex justify-between items-center"
      >
        <div>
            <h1 className="text-4xl font-bold mb-4">Welcome back, John!</h1>
            <p className="text-gray-300 text-lg">Manage your health and connect with your doctors.</p>
        </div>
        <button 
            onClick={() => navigate('/book-consultation')}
            className="bg-[#00E5FF] text-[#0A192F] font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:bg-cyan-400 transition-all flex items-center text-lg"
        >
            <FaVideo className="mr-3" /> Book Video Consultation
        </button>
      </motion.div>

      {/* Upcoming Consultations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center"><FaCalendarCheck className="mr-3 text-cyan" /> Upcoming Consultations</h2>
        
        {consultations.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                You have no upcoming consultations.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((consultation, idx) => (
                <motion.div 
                    key={consultation.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all flex flex-col"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Dr. {consultation.doctor?.name || "Specialist"}</h3>
                            <p className="text-cyan text-sm">{consultation.doctor?.specialization || "General"}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            consultation.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            consultation.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                            {consultation.status}
                        </span>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Date:</span>
                            <span className="font-semibold text-white">{consultation.preferredDate}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Time:</span>
                            <span className="font-semibold text-white">{consultation.preferredTime}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleJoinConsultation(consultation.id)}
                        disabled={consultation.status !== 'Approved'}
                        className="mt-auto w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-cyan/10 hover:bg-cyan text-cyan hover:text-black border border-cyan"
                    >
                        Join Consultation
                    </button>
                </motion.div>
            ))}
            </div>
        )}
      </motion.div>
    </div>
  );
}
