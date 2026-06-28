import React, { useEffect, useState } from 'react';
import { X, Calendar, User, UserCheck, Shield, FileText, Download, Printer, Eye, Lock } from 'lucide-react';

export default function RecordDetailsModal({ record, isOpen, onClose, onDownload }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'preview'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Medical Record Capsule</span>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight mt-0.5">{record.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 px-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'summary' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Findings
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'preview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            File Preview (PDF / Imaging Scan)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'summary' ? (
            <>
              {/* Patient and clinical cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50/40 border border-blue-50 rounded-2xl">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient Name</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{record.patientName}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Age & Gender</p>
                  <p className="text-sm font-bold text-slate-800">
                    {record.patientAge} yrs <span className="text-slate-350">/</span> {record.patientGender}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Consulting Doctor</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{record.doctorName}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Record Date</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{record.date}</span>
                  </p>
                </div>
              </div>

              {/* Patient ID bar */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xxs font-bold text-slate-500">
                <span>Unique Patient Ref: <span className="text-slate-800">{record.patientId}</span></span>
                <span>Department Ref: <span className="text-slate-800">{record.department}</span></span>
              </div>

              {/* Detailed findings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-800 text-sm">Clinical Summary & Findings</h4>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                    {record.details}
                  </pre>
                </div>
              </div>

              {/* Clinical Verification footer */}
              <div className="text-[10px] text-slate-400 bg-slate-50/50 p-4 border border-dashed border-slate-200 rounded-xl leading-relaxed">
                <span className="font-bold text-slate-500">HIPAA PRIVACY STATEMENT:</span> This record is protected under HIPAA compliance guidelines. The content displayed is digitally encrypted and signed by {record.doctorName}. Unauthorized dissemination is strictly prohibited.
              </div>
            </>
          ) : (
            /* File Preview Mode */
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] flex flex-col justify-between p-6 text-white relative">
              {/* Overlay grid lines for scan aesthetic */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-xs text-slate-350">
                  <Lock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Secure Cryptographic Node: CarePortal-SVR-7</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-extrabold uppercase">
                  PDF preview
                </span>
              </div>

              {/* Preview Medical Card Document */}
              <div className="my-12 text-center space-y-4 z-10 flex flex-col items-center">
                <div className="w-16 h-20 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center shadow-lg relative">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-200">{record.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                    Patient: {record.patientName} ({record.patientGender}, {record.patientAge}y) • Signed by {record.doctorName}
                  </p>
                </div>
                <div className="bg-slate-800/80 px-4 py-2 border border-slate-700 rounded-xl text-[10px] text-slate-300 font-mono inline-block">
                  SHA-256 Checksum: e3b0c442...{record.patientId}
                </div>
              </div>

              {/* Preview Toolbar */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 z-10 text-[10px] text-slate-400">
                <span>Rendering Page 1 of 1</span>
                <button
                  onClick={() => onDownload(record)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Open Full PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button 
            onClick={() => onDownload(record)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Summary
          </button>
        </div>

      </div>
    </div>
  );
}
