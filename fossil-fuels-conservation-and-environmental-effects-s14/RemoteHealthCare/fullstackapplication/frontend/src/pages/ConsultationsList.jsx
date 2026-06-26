import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, Video, FileText, Activity, AlertCircle, ChevronRight, MessageSquare, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';

export default function ConsultationsList() {
    const { role } = useOutletContext();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1999/api';
    
    const [consultations, setConsultations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPaymentId, setProcessingPaymentId] = useState(null);

    const isPatient = role === 'Patient';

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                let id, endpoint;
                if (isPatient) {
                    const data = sessionStorage.getItem('patient_data');
                    if (!data) return;
                    id = JSON.parse(data).id;
                    endpoint = `${API_URL}/consultations/patient/${id}`;
                } else {
                    const data = sessionStorage.getItem('user_data');
                    if (!data) return;
                    id = JSON.parse(data).id;
                    endpoint = `${API_URL}/consultations/doctor/${id}`;
                }

                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    // Sort descending by id or date to show newest first
                    data.sort((a, b) => b.id - a.id);
                    setConsultations(data);
                }
            } catch (err) {
                console.error("Failed to fetch consultations", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsultations();
    }, [API_URL, isPatient, role]);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'approved' || s === 'accepted') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
        if (s === 'completed') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-amber-100 text-amber-700 border-amber-200';
    };

    const handleJoinRoom = (consultationId) => {
        navigate(`/consultation/${consultationId}`);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/consultations/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                const updated = await response.json();
                setConsultations(prev => prev.map(c => c.id === id ? updated : c));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleProcessPayment = async (id) => {
        setProcessingPaymentId(id);
        try {
            // Simulate a short payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await fetch(`${API_URL}/consultations/${id}/pay`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const updated = await response.json();
                setConsultations(prev => prev.map(c => c.id === id ? updated : c));
            }
        } catch (err) {
            console.error("Payment failed", err);
        } finally {
            setProcessingPaymentId(null);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
            {/* Header Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                        My Appointments
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {isPatient 
                            ? 'View and manage your scheduled consultations with our specialists.' 
                            : 'Review your upcoming patient appointments and consultation requests.'}
                    </p>
                </div>
                {isPatient && (
                    <button 
                        onClick={() => navigate('/book-consultation')}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center gap-1.5 shrink-0"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Book New Appointment</span>
                    </button>
                )}
            </div>

            {/* Consultations List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : consultations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {consultations.map((consultation) => (
                        <div key={consultation.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                        {isPatient ? <Stethoscope className="w-6 h-6 text-emerald-600" /> : <User className="w-6 h-6 text-blue-600" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            {isPatient 
                                                ? `Dr. ${consultation.doctor?.firstName || ''} ${consultation.doctor?.lastName || ''}` 
                                                : `${consultation.patient?.firstName || ''} ${consultation.patient?.lastName || ''}`}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500">
                                            {isPatient ? consultation.doctor?.specialization : `Age: ${consultation.patient?.age || 'N/A'}, ${consultation.patient?.gender || 'N/A'}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${getStatusColor(consultation.status)}`}>
                                        {consultation.status || 'Pending'}
                                    </span>
                                    {consultation.status?.toLowerCase() === 'approved' && (
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                                            consultation.paymentStatus === 'Paid' 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-rose-100 text-rose-700 border-rose-200'
                                        }`}>
                                            {consultation.paymentStatus === 'Paid' ? 'Paid' : 'Payment Pending'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{consultation.preferredDate || 'TBD'}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{consultation.preferredTime || 'TBD'}</p>
                                </div>
                                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Reason / Issue</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 line-clamp-2">
                                        {consultation.healthIssue || consultation.symptoms || 'General Checkup'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                                {!isPatient && consultation.status === 'Pending' ? (
                                    <div className="flex gap-2 w-full">
                                        <button 
                                            onClick={() => handleUpdateStatus(consultation.id, 'Approved')}
                                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(consultation.id, 'Rejected')}
                                            className="flex-1 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold rounded-xl transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 w-full flex-col">
                                        <button 
                                            onClick={() => handleJoinRoom(consultation.id)}
                                            disabled={consultation.status?.toLowerCase() !== 'approved'}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Video className="w-4 h-4" /> 
                                            {consultation.status?.toLowerCase() === 'approved' ? 'Join Video Room' : 'Room Unavailable'}
                                        </button>
                                        
                                        {isPatient && consultation.status?.toLowerCase() === 'approved' && consultation.paymentStatus !== 'Paid' && (
                                            <button 
                                                onClick={() => handleProcessPayment(consultation.id)}
                                                disabled={processingPaymentId === consultation.id}
                                                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processingPaymentId === consultation.id ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                                ) : (
                                                    <><CreditCard className="w-4 h-4" /> Pay Consultation Fee</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="p-5 rounded-full bg-slate-50 text-slate-300">
                        <Calendar className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-800">No Appointments Found</h4>
                        <p className="text-xs text-slate-450 max-w-sm mx-auto">
                            {isPatient ? "You don't have any scheduled or past appointments." : "You don't have any consultation requests assigned to you."}
                        </p>
                    </div>
                    {isPatient && (
                        <button 
                            onClick={() => navigate('/book-consultation')}
                            className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition-all"
                        >
                            Book an Appointment
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
