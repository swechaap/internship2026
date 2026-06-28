import React from 'react';
import { Pill, FileText, FlaskConical, Clipboard, Calendar, Eye, Download, User, Edit2, Trash2 } from 'lucide-react';

export default function MedicalRecordCard({ record, role, onView, onDownload, onEdit, onDelete }) {
  const getRecordTypeDetails = (type) => {
    switch (type) {
      case 'Prescription':
        return {
          icon: <Pill className="w-4 h-4" />,
          color: 'text-blue-500 bg-blue-50 border-blue-100',
          accent: 'border-l-8 border-l-blue-500',
          label: 'Prescription'
        };
      case 'Scan':
        return {
          icon: <Clipboard className="w-4 h-4" />,
          color: 'text-amber-500 bg-amber-50 border-amber-100',
          accent: 'border-l-8 border-l-amber-500',
          label: 'Diagnostic Scan'
        };
      case 'Lab Result':
        return {
          icon: <FlaskConical className="w-4 h-4" />,
          color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
          accent: 'border-l-8 border-l-emerald-500',
          label: 'Lab Result'
        };
      case 'Report':
      default:
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'text-purple-500 bg-purple-50 border-purple-100',
          accent: 'border-l-8 border-l-purple-500',
          label: 'Clinical Report'
        };
    }
  };

  const details = getRecordTypeDetails(record.recordType);

  // Security UI variables
  const isPatient = role === 'Patient';
  const isManager = role === 'Manager';

  const canEdit = isManager;
  const canDelete = isManager;

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${details.accent}`}>
      <div className="p-5 space-y-4">
        {/* Type & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${details.color}`}>
            {details.icon}
            {details.label}
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {record.date}
          </span>
        </div>

        {/* Title & Patient Information */}
        <div className="space-y-1">
          <h4 
            className="font-extrabold text-slate-950 text-base leading-snug line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer" 
            onClick={() => onView(record)}
          >
            {record.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 flex-wrap">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-700">{record.patientName}</span>
            <span className="text-slate-300">•</span>
            <span>{record.patientAge}y, {record.patientGender}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-normal">ID: {record.patientId}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
          {record.shortDescription}
        </p>

        {/* Doctor & Department */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Consultant:</span>
          <span className="text-slate-600 font-medium">
            {record.doctorName} <span className="text-slate-300 font-normal">({record.department})</span>
          </span>
        </div>
      </div>

      {/* Buttons: View, Download, Edit, Delete */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 w-full">
          {/* View Details */}
          <button
            onClick={() => onView(record)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View</span>
          </button>

          {/* Download */}
          <button
            onClick={() => onDownload(record)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 bg-white border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
            title="Download Summary"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Edit Button: Visible to Doctors and Admins */}
          {canEdit && (
            <button
              onClick={() => onEdit(record)}
              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 bg-white border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
              title="Edit Record"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button: Visible to Admin only */}
          {canDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer animate-in fade-in duration-200"
              title="Delete Record"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
