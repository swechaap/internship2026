import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle, FileUp } from 'lucide-react';

export default function UploadRecordModal({ isOpen, onClose, onSave, record }) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    recordType: 'Report',
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    department: '',
    shortDescription: '',
    details: ''
  });

  const [error, setError] = useState('');

  // Synchronize record changes to form data (e.g. for Editing)
  useEffect(() => {
    if (record) {
      setFormData({
        patientName: record.patientName || '',
        patientAge: record.patientAge || '',
        patientGender: record.patientGender || 'Male',
        recordType: record.recordType || 'Report',
        title: record.title || '',
        date: record.date || new Date().toISOString().split('T')[0],
        doctorName: record.doctorName || '',
        department: record.department || '',
        shortDescription: record.shortDescription || '',
        details: record.details || ''
      });
    } else {
      setFormData({
        patientName: '',
        patientAge: '',
        patientGender: 'Male',
        recordType: 'Report',
        title: '',
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
        department: '',
        shortDescription: '',
        details: ''
      });
    }
    setError('');
  }, [record, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.patientName ||
      !formData.patientAge ||
      !formData.title ||
      !formData.doctorName ||
      !formData.department ||
      !formData.shortDescription ||
      !formData.details
    ) {
      setError('Please fill in all clinical and patient fields.');
      return;
    }

    const updatedRecord = {
      ...record, // keep existing fields like id if editing
      id: record ? record.id : `rec-${Date.now()}`,
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      patientId: record ? record.patientId : `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      recordType: formData.recordType,
      title: formData.title,
      date: formData.date,
      shortDescription: formData.shortDescription,
      doctorName: formData.doctorName,
      department: formData.department,
      details: formData.details,
      fileUrl: record?.fileUrl || '#'
    };

    onSave(updatedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {record ? 'Edit Medical Document' : 'Upload Medical Document'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {record ? 'Modify patient medical archive attributes' : 'Add a patient record to the secure database'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs font-semibold">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 font-semibold rounded-xl text-[11px]">
              {error}
            </div>
          )}

          {/* Patient Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="e.g. Stephen Strange"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Age</label>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Gender & Record Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Gender</label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Document Type</label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
              >
                <option value="Report">Clinical Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Lab Result">Lab Result</option>
                <option value="Scan">Diagnostic Scan</option>
              </select>
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Document Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete Hemogram Analysis"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Physician Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Physician Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="e.g. Dr. Christine Palmer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-slate-500 uppercase tracking-wide">Short Abstract Summary</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Fasting report tracking glycemic count and red cell velocity."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>

          {/* Detailed findings */}
          <div className="space-y-1">
            <label className="text-slate-500 uppercase tracking-wide">Detailed Diagnostic Findings</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              placeholder="Enter comprehensive findings, diagnostic tables, prescribed dosages, and recommendations..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 font-sans"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50 p-4 -mx-5 -mb-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{record ? 'Save Changes' : 'Upload Document'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
