import React from 'react';
import { FileText, ShieldAlert, HeartPulse, User, Pill, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function RecentActivityTable({ activities, onViewAuditTrail }) {
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Scan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <FileText className="w-3.5 h-3.5" /> Scan
          </span>
        );
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Emergency
          </span>
        );
      case 'Prescription':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Pill className="w-3.5 h-3.5" /> Rx Prescribe
          </span>
        );
      case 'Report':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <HeartPulse className="w-3.5 h-3.5" /> Lab Report
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-100">
            <User className="w-3.5 h-3.5" /> Booking
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Processed
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-xs bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 animate-pulse">
            <AlertCircle className="w-3 h-3" /> Dispatched
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
            <Clock className="w-3 h-3" /> Awaiting
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Recent Incident Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status of emergency dispatches and clinical records</p>
        </div>
        {onViewAuditTrail && (
          <button 
            onClick={onViewAuditTrail}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            View Audit Trail
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              <th className="px-6 py-4">User / Operator</th>
              <th className="px-6 py-4">Action Summary</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Time Elapsed</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={act.avatar} 
                      alt={act.user} 
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shrink-0" 
                    />
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{act.user}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{act.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-700 max-w-xs sm:max-w-sm md:max-w-md truncate">
                    {act.action}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(act.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-medium text-xs">
                  {act.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {getStatusBadge(act.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
