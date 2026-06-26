import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Pill, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userData = JSON.parse(sessionStorage.getItem('patient_data') || '{}');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    if (!userData.id) {
      setError("Please log in as a patient.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:1999/api/prescriptions/patient/${userData.id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
      // Since we didn't explicitly implement PrescriptionController in this step, let's just handle error gracefully
      setError("Failed to fetch prescriptions. Endpoint might not be available.");
    } finally {
      setLoading(false);
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
          <Pill className="w-8 h-8 text-indigo-600" />
          My Prescriptions
        </h1>
        <p className="text-slate-500 mt-2">View and manage your active and past prescriptions.</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Prescriptions Found</h3>
          <p className="text-slate-500 mt-1">You don't have any prescriptions on record.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {prescriptions.map(prescription => (
            <div key={prescription.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {prescription.medicationName}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{prescription.dosage}</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Prescription
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-slate-700 font-medium mb-1">Instructions:</p>
                <p className="text-sm text-slate-600">{prescription.instructions}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Prescribed on {new Date(prescription.datePrescribed || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
