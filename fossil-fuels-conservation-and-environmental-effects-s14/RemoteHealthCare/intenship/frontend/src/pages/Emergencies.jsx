import React, { useState, useEffect } from 'react';
import EmergencyMonitoringList from '../components/tables/EmergencyMonitoringList';
import EmergencyCasesChart from '../components/charts/EmergencyCasesChart';
import StatCard from '../components/cards/StatCard';
import { ArrowUpRight, ShieldAlert, Activity, Users } from 'lucide-react';

const defaultEmergencies = [
  { id: 'em-1', title: 'Cardiac Arrest Alert', location: 'Sector 4 (Central)', priority: 'Critical', unit: 'Ambulance Unit 4', timestamp: '4m ago', status: 'In Progress' },
  { id: 'em-2', title: 'Multiple Vehicle Trauma', location: 'Sector 9 (Highways)', priority: 'Critical', unit: 'Ambulance Unit 12', timestamp: '12m ago', status: 'Pending' },
  { id: 'em-3', title: 'Stroke Alert Dispatch', location: 'Sector 7 (South-West)', priority: 'High', unit: 'Ambulance Unit 9', timestamp: '1h ago', status: 'Completed' }
];

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState(() => {
    const saved = localStorage.getItem('careportal_emergencies_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse emergencies store', e);
      }
    }
    return defaultEmergencies;
  });

  const [dispatchNotification, setDispatchNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('careportal_emergencies_store', JSON.stringify(emergencies));
  }, [emergencies]);

  // Quick Dispatch Handler
  const handleQuickDispatch = () => {
    const sectors = ['Sector 4 (Central)', 'Sector 7 (South-West)', 'Sector 9 (Highways)', 'Sector 2 (Industrial)'];
    const issues = ['Acute Cardiac Event', 'Tachypnea Respiratory Arrest', 'Anaphylactic Stroke Alert', 'Closed Trauma Fracture'];
    const priorities = ['Critical', 'High', 'Medium'];
    
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const unitNumber = Math.floor(Math.random() * 20) + 1;

    const newDispatchId = `em-${Date.now()}`;
    const newEmergency = {
      id: newDispatchId,
      title: randomIssue,
      location: randomSector,
      priority: randomPriority,
      unit: `Ambulance Unit ${unitNumber}`,
      timestamp: 'Just now',
      status: 'Pending'
    };

    setEmergencies(prev => [newEmergency, ...prev]);

    // Toast Alert
    setDispatchNotification(`Emergency Unit ${unitNumber} Dispatched: ${randomIssue} @ ${randomSector}`);
    setTimeout(() => {
      setDispatchNotification(null);
    }, 6000);
  };

  const handleUpdateEmergencyStatus = (id, nextStatus) => {
    setEmergencies(prev => prev.map(em => {
      if (em.id === id) {
        return { ...em, status: nextStatus };
      }
      return em;
    }));
  };

  // Stats derivation
  const activeCount = emergencies.filter(e => e.status !== 'Completed').length;
  const pendingCount = emergencies.filter(e => e.status === 'Pending').length;
  const inProgressCount = emergencies.filter(e => e.status === 'In Progress').length;
  const completedCount = emergencies.filter(e => e.status === 'Completed').length;

  const stats = [
    { id: 'active-em', title: 'Active Emergencies', value: activeCount.toString(), change: '+2 today', isPositive: false, timeframe: 'currently dispatching', color: 'red' },
    { id: 'pending-em', title: 'Pending Dispatch', value: pendingCount.toString(), change: 'Awaiting units', isPositive: false, timeframe: 'in queue', color: 'amber' },
    { id: 'progress-em', title: 'In Progress', value: inProgressCount.toString(), change: 'En-route', isPositive: true, timeframe: 'active responders', color: 'blue' },
    { id: 'completed-em', title: 'Resolved Cases', value: completedCount.toString(), change: '100% success', isPositive: true, timeframe: 'this week', color: 'green' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Alert toast notification */}
      {dispatchNotification && (
        <div className="bg-red-655 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-red-600/15 border border-red-500 animate-in slide-in-from-top-4 duration-300 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping mr-1 shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider">Triage Alert:</span>
            <span className="text-xs font-semibold">{dispatchNotification}</span>
          </div>
          <button 
            onClick={() => setDispatchNotification(null)}
            className="text-white hover:text-red-200 text-xs font-bold cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Emergency Response & Dispatch Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ambulance tracking, responder unit status logs, and immediate cardiac / trauma triage dispatches.
          </p>
        </div>
        <button 
          onClick={handleQuickDispatch}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Quick Dispatch Unit</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Telemetry Chart */}
        <div>
          <EmergencyCasesChart data={[
            { name: 'Mon', cardiac: activeCount, trauma: pendingCount + 2, stroke: inProgressCount, other: 1 },
            { name: 'Tue', cardiac: 4, trauma: 5, stroke: 2, other: 3 },
            { name: 'Wed', cardiac: 5, trauma: 6, stroke: 1, other: 2 },
            { name: 'Thu', cardiac: 3, trauma: 4, stroke: 3, other: 1 },
            { name: 'Fri', cardiac: 6, trauma: 8, stroke: 4, other: 5 }
          ]} />
        </div>

        {/* Monitoring List */}
        <div className="lg:col-span-2">
          <EmergencyMonitoringList 
            emergencies={emergencies}
            onUpdateStatus={handleUpdateEmergencyStatus}
            onDispatch={handleQuickDispatch}
          />
        </div>
      </div>

    </div>
  );
}
