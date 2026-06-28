import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaCheck, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const doctorId = 1; // Hardcoded for demo

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/consultations/doctor/${doctorId}`);
      setRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/consultations/status/${id}`, { status });
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

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
        className="bg-gradient-to-r from-cyan/20 to-transparent p-8 rounded-2xl border border-cyan/20"
      >
        <h1 className="text-4xl font-bold mb-4">Doctor Dashboard</h1>
        <p className="text-gray-300 text-lg">Manage your appointments and join video consultations.</p>
      </motion.div>

      {/* Appointment Requests */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center"><FaUserMd className="mr-3 text-cyan" /> Consultation Requests</h2>
        
        {requests.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                You have no consultation requests.
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req, idx) => (
                <motion.div 
                    key={req.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Patient #{req.patient?.id || 'Unknown'}</h3>
                            <p className="text-gray-400 text-sm mt-1">Issue: <span className="text-white">{req.healthIssue}</span></p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                            {req.status}
                        </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-3">
                        <div className="flex items-center text-sm text-gray-300">
                            <FaCalendarAlt className="w-4 h-4 mr-3 text-cyan" />
                            <span>{req.preferredDate}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                            <FaClock className="w-4 h-4 mr-3 text-cyan" />
                            <span>{req.preferredTime}</span>
                        </div>
                        <div className="text-sm text-gray-300 border-t border-white/10 pt-3 mt-3">
                            <span className="block text-gray-500 mb-1">Symptoms:</span>
                            <span className="text-white">{req.symptoms}</span>
                        </div>
                    </div>

                    <div className="mt-auto flex gap-3">
                        {req.status === 'Pending' ? (
                            <>
                                <button 
                                    onClick={() => handleStatusUpdate(req.id, 'Approved')}
                                    className="flex-1 flex items-center justify-center py-3 rounded-xl font-bold bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/50 transition-all"
                                >
                                    <FaCheck className="mr-2" /> Accept
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                                    className="flex-1 flex items-center justify-center py-3 rounded-xl font-bold bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all"
                                >
                                    <FaTimes className="mr-2" /> Reject
                                </button>
                            </>
                        ) : req.status === 'Approved' ? (
                            <button 
                                onClick={() => handleJoinConsultation(req.id)}
                                className="w-full py-3 rounded-xl font-bold transition-all bg-[#00E5FF] text-[#0A192F] hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                            >
                                Join Consultation Room
                            </button>
                        ) : (
                            <div className="w-full text-center py-3 text-gray-500 border border-gray-700 rounded-xl">
                                Consultation {req.status}
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
            </div>
        )}
      </motion.div>
    </div>
  );
}
