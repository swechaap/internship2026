import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const doctorsList = [
    { id: 1, name: "Dr. Sarah Jenkins", specialization: "Cardiologist", fee: "$150" },
    { id: 2, name: "Dr. Michael Chen", specialization: "General Physician", fee: "$80" },
    { id: 3, name: "Dr. Emily Roberts", specialization: "Neurologist", fee: "$200" }
];

const availableSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "04:00 PM", "05:00 PM"
];

const BookConsultation = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        symptoms: '',
        reason: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    // Hardcoded patient for demo
    const patientId = 1;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDoctorSelect = (docId) => {
        setFormData({ ...formData, doctorId: docId });
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
    };

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                patient: { id: patientId },
                doctor: { id: formData.doctorId },
                healthIssue: formData.reason,
                symptoms: formData.symptoms,
                preferredDate: formData.date,
                preferredTime: formData.time,
                additionalNotes: formData.notes
            };
            
            await axios.post('http://localhost:8080/api/consultations/book', payload);
            setBookingConfirmed(true);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Booking failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingConfirmed) {
        return (
            <div className="min-h-screen bg-[#0A192F] text-white flex items-center justify-center p-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl max-w-md w-full text-center">
                    <CheckCircle2 className="w-20 h-20 text-[#00E5FF] mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                    <p className="text-gray-300 mb-8">Your video consultation request has been sent to the doctor. You will be notified once it is approved.</p>
                    <button 
                        onClick={() => navigate('/patient-dashboard')}
                        className="bg-[#00E5FF] text-[#0A192F] font-semibold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors w-full"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A192F] text-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#00E5FF] mb-4">Book Video Consultation</h1>
                    <p className="text-gray-400">Schedule a real-time secure video session with our top specialists.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    
                    {/* Stepper */}
                    <div className="flex justify-between items-center mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -z-10 -translate-y-1/2 rounded"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-[#00E5FF] -z-10 -translate-y-1/2 rounded transition-all duration-300" style={{ width: `${(step - 1) * 50}%` }}></div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#00E5FF] text-[#0A192F]' : 'bg-gray-800 text-gray-500'}`}>1</div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#00E5FF] text-[#0A192F]' : 'bg-gray-800 text-gray-500'}`}>2</div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#00E5FF] text-[#0A192F]' : 'bg-gray-800 text-gray-500'}`}>3</div>
                    </div>

                    {/* Step 1: Select Doctor */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center"><Stethoscope className="mr-3 text-[#00E5FF]" /> Select a Specialist</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctorsList.map(doc => (
                                    <div 
                                        key={doc.id} 
                                        onClick={() => handleDoctorSelect(doc.id)}
                                        className={`cursor-pointer rounded-xl p-6 border transition-all ${formData.doctorId === doc.id ? 'bg-[#00E5FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                                    >
                                        <div className="w-16 h-16 bg-gray-700 rounded-full mb-4 mx-auto flex items-center justify-center">
                                            <User size={30} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-center mb-1">{doc.name}</h3>
                                        <p className="text-[#00E5FF] text-center text-sm font-medium mb-3">{doc.specialization}</p>
                                        <div className="text-center text-gray-400 text-sm">Consultation Fee: <span className="text-white font-semibold">{doc.fee}</span></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 flex justify-end">
                                <button 
                                    onClick={nextStep} 
                                    disabled={!formData.doctorId}
                                    className="bg-[#00E5FF] text-[#0A192F] font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center"><Calendar className="mr-3 text-[#00E5FF]" /> Select Date & Time</h2>
                            
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-3 text-lg">Preferred Date</label>
                                    <input 
                                        type="date" 
                                        name="date"
                                        min={getTodayDate()}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f274a] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">*Please select a future date</p>
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-3 text-lg">Available Slots</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {availableSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`py-3 rounded-lg border font-medium transition-all flex items-center justify-center ${formData.time === time ? 'bg-[#00E5FF] text-[#0A192F] border-[#00E5FF]' : 'bg-[#0f274a] text-gray-300 border-white/10 hover:border-[#00E5FF]/50'}`}
                                            >
                                                <Clock size={16} className="mr-2" /> {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-between">
                                <button onClick={prevStep} className="bg-transparent border border-gray-500 text-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-white/5 transition-colors">Back</button>
                                <button 
                                    onClick={nextStep} 
                                    disabled={!formData.date || !formData.time}
                                    className="bg-[#00E5FF] text-[#0A192F] font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Patient Details & Reason */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center"><FileText className="mr-3 text-[#00E5FF]" /> Consultation Details</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Reason for Consultation</label>
                                    <input 
                                        type="text" 
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        placeholder="e.g., Routine Checkup, Persistent Cough"
                                        className="w-full bg-[#0f274a] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00E5FF] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Detailed Symptoms</label>
                                    <textarea 
                                        name="symptoms"
                                        value={formData.symptoms}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Describe your symptoms in detail..."
                                        className="w-full bg-[#0f274a] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00E5FF] transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">Additional Notes (Optional)</label>
                                    <textarea 
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Any prior medical history or ongoing medications?"
                                        className="w-full bg-[#0f274a] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00E5FF] transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-between">
                                <button onClick={prevStep} className="bg-transparent border border-gray-500 text-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-white/5 transition-colors">Back</button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={!formData.reason || !formData.symptoms || isSubmitting}
                                    className="bg-[#00E5FF] text-[#0A192F] font-bold py-3 px-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                                >
                                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BookConsultation;
