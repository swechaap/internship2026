import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Bell, Loader2 } from 'lucide-react';

export default function MedicineReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userData = JSON.parse(sessionStorage.getItem('patient_data') || '{}');

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    if (!userData.id) {
      setError("Please log in as a patient.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:1999/api/reminders/patient/${userData.id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch medicine reminders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:1999/api/reminders/${id}/status?status=${status}`, { method: 'PUT' });
      fetchReminders();
    } catch (err) {
      console.error(err);
      alert("Failed to update reminder status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          Medicine Reminders
        </h1>
        <p className="text-slate-500 mt-2">Manage your scheduled medication and track your adherence.</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Reminders</h3>
          <p className="text-slate-500 mt-1">You don't have any medicine reminders set up yet.</p>
          <p className="text-sm text-slate-400 mt-2">You can ask the AI Chatbot to schedule a reminder for you!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map(reminder => (
            <div key={reminder.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${reminder.status === 'Active' ? 'bg-blue-500' : reminder.status === 'Completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                  {reminder.medicineName}
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  reminder.status === 'Active' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  reminder.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {reminder.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500">Rx</span>
                  </div>
                  <span className="text-sm font-medium">{reminder.dosage}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{reminder.time}</span>
                </div>
              </div>

              {reminder.status === 'Active' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => updateStatus(reminder.id, 'Completed')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 font-medium text-sm rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Taken
                  </button>
                  <button
                    onClick={() => updateStatus(reminder.id, 'Cancelled')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium text-sm rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Skip
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
