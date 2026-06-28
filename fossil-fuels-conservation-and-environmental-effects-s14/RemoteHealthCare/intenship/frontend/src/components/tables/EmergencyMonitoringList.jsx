import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Truck, Shield } from 'lucide-react';

export default function EmergencyMonitoringList({ emergencies, onUpdateStatus, onDispatch }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse';
      case 'Pending':
      default:
        return 'bg-red-50 text-red-600 border-red-100';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-600 text-white shadow-red-500/10';
      case 'High':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Emergency Triage Board</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time GPS telemetry and incident response tracking</p>
          </div>
        </div>
        
        {onDispatch && (
          <button
            onClick={onDispatch}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center gap-1 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Launch Dispatch</span>
          </button>
        )}
      </div>

      {/* Dispatches List */}
      <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
        {emergencies.length > 0 ? (
          emergencies.map((em) => (
            <div 
              key={em.id} 
              className={`p-4 bg-slate-50/50 border rounded-2xl transition-all duration-200 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                ${em.status === 'Pending' ? 'border-red-100 bg-red-50/5' : 'border-slate-100'}
              `}
            >
              {/* Left Side Info */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl text-white ${em.status === 'Completed' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'} shrink-0 mt-0.5`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{em.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${getPriorityBadge(em.priority)}`}>
                      {em.priority}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Location: <span className="text-slate-700 font-bold">{em.location}</span> • Unit Assigned: <span className="text-slate-700 font-bold">{em.unit}</span>
                  </p>
                  
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                    <span>Dispatched: {em.timestamp}</span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.5 rounded border ${getStatusBadge(em.status)}`}>
                      {em.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Status Controller */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                {em.status === 'Pending' && (
                  <button
                    onClick={() => onUpdateStatus(em.id, 'In Progress')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Set In Progress
                  </button>
                )}
                {em.status === 'In Progress' && (
                  <button
                    onClick={() => onUpdateStatus(em.id, 'Completed')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
                {em.status === 'Completed' && (
                  <span className="text-emerald-600 flex items-center gap-1 text-[10px] font-bold bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center space-y-2">
            <Shield className="w-8 h-8 text-slate-350" />
            <p>No active emergencies in telemetry queue.</p>
          </div>
        )}
      </div>

      {/* Footer statistics summary */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span>Active Dispatches: {emergencies.filter(e => e.status !== 'Completed').length}</span>
        <span className="text-slate-450">Triage response avg: 4.8 mins</span>
      </div>
    </div>
  );
}
