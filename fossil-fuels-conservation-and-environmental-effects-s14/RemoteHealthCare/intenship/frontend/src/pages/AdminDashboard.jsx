import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  patientActivityData, 
  emergencyCasesData, 
  recentActivities 
} from '../data/dummyData';
import StatCard from '../components/cards/StatCard';
import PatientActivityChart from '../components/charts/PatientActivityChart';
import EmergencyCasesChart from '../components/charts/EmergencyCasesChart';
import RecentActivityTable from '../components/tables/RecentActivityTable';
import UserManagementTable from '../components/tables/UserManagementTable';
import EmergencyMonitoringList from '../components/tables/EmergencyMonitoringList';
import { ArrowUpRight, ShieldAlert, Award, FileSpreadsheet, ShieldCheck, X } from 'lucide-react';

export default function AdminDashboard() {
  const { globalSearchQuery } = useOutletContext();

  // Stats State
  const [stats, setStats] = useState([
    { id: 'total-patients', title: 'Total Patients', value: '12,842', change: '+14%', isPositive: true, timeframe: 'vs last month', color: 'blue' },
    { id: 'active-emergencies', title: 'Active Emergencies', value: '3', change: '+2 today', isPositive: false, timeframe: 'currently active', color: 'red' },
    { id: 'admins-available', title: 'System Admins', value: '8', change: 'Roster active', isPositive: true, timeframe: 'staff roster', color: 'green' }
  ]);

  // Emergencies State
  const [emergencies, setEmergencies] = useState(() => {
    const saved = localStorage.getItem('careportal_emergencies_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse emergencies store in dashboard', e);
      }
    }
    return [
      { id: 'em-1', title: 'Cardiac Arrest Alert', location: 'Sector 4 (Central)', priority: 'Critical', unit: 'Ambulance Unit 4', timestamp: '4m ago', status: 'In Progress' },
      { id: 'em-2', title: 'Multiple Vehicle Trauma', location: 'Sector 9 (Highways)', priority: 'Critical', unit: 'Ambulance Unit 12', timestamp: '12m ago', status: 'Pending' },
      { id: 'em-3', title: 'Stroke Alert Dispatch', location: 'Sector 7 (South-West)', priority: 'High', unit: 'Ambulance Unit 9', timestamp: '1h ago', status: 'Completed' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('careportal_emergencies_store', JSON.stringify(emergencies));
  }, [emergencies]);

  // Users State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('careportal_users_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.some(u => u.role === 'Manager') || !parsed.some(u => u.role === 'Accountant')) {
          return [
            { id: 'usr-1', name: 'Sarah Connor', role: 'Admin', email: 's.connor@careportal.org', status: 'Active' },
            { id: 'usr-2', name: 'Michael Chen', role: 'Admin', email: 'm.chen@careportal.org', status: 'Active' },
            { id: 'usr-3', name: 'John Doe', role: 'Patient', email: 'j.doe@gmail.com', status: 'Active' },
            { id: 'usr-4', name: 'Christine Palmer', role: 'Manager', email: 'c.palmer@careportal.org', status: 'Active' },
            { id: 'usr-5', name: 'Robert Downey', role: 'Patient', email: 'r.downey@stark.com', status: 'Active' },
            { id: 'usr-6', name: 'Alice Smith', role: 'Patient', email: 'a.smith@yahoo.com', status: 'Suspended' },
            { id: 'usr-7', name: 'Stephen Strange', role: 'Accountant', email: 's.strange@careportal.org', status: 'Active' }
          ];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse users store in dashboard', e);
      }
    }
    return [
      { id: 'usr-1', name: 'Sarah Connor', role: 'Admin', email: 's.connor@careportal.org', status: 'Active' },
      { id: 'usr-2', name: 'Michael Chen', role: 'Admin', email: 'm.chen@careportal.org', status: 'Active' },
      { id: 'usr-3', name: 'John Doe', role: 'Patient', email: 'j.doe@gmail.com', status: 'Active' },
      { id: 'usr-4', name: 'Christine Palmer', role: 'Manager', email: 'c.palmer@careportal.org', status: 'Active' },
      { id: 'usr-5', name: 'Robert Downey', role: 'Patient', email: 'r.downey@stark.com', status: 'Active' },
      { id: 'usr-6', name: 'Alice Smith', role: 'Patient', email: 'a.smith@yahoo.com', status: 'Suspended' },
      { id: 'usr-7', name: 'Stephen Strange', role: 'Accountant', email: 's.strange@careportal.org', status: 'Active' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('careportal_users_store', JSON.stringify(users));
  }, [users]);

  // Activities logs State
  const [activities, setActivities] = useState(recentActivities);

  // Notifications banner
  const [dispatchNotification, setDispatchNotification] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Sync Stats Count with active emergencies
  useEffect(() => {
    const activeCount = emergencies.filter(e => e.status !== 'Completed').length;
    setStats(prev => prev.map(s => {
      if (s.id === 'active-emergencies') {
        return {
          ...s,
          value: activeCount.toString()
        };
      }
      return s;
    }));
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

    // Add activity log
    const newActivity = {
      id: `act-${Date.now()}`,
      user: `Ambulance Unit ${unitNumber}`,
      avatar: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=150',
      role: 'Emergency Dispatch',
      action: `Dispatched response for ${randomIssue} @ ${randomSector} [Priority: ${randomPriority}]`,
      category: 'Emergency',
      date: 'Just now',
      status: 'active'
    };
    setActivities(prev => [newActivity, ...prev]);

    // Toast Alert
    setDispatchNotification(`Emergency Unit ${unitNumber} Dispatched: ${randomIssue} @ ${randomSector}`);
    setTimeout(() => {
      setDispatchNotification(null);
    }, 6000);
  };

  // Update dispatch status
  const handleUpdateEmergencyStatus = (id, nextStatus) => {
    setEmergencies(prev => prev.map(em => {
      if (em.id === id) {
        // Log action if completed
        if (nextStatus === 'Completed') {
          const resolveAct = {
            id: `act-${Date.now()}`,
            user: em.unit,
            avatar: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=150',
            role: 'Emergency Team',
            action: `Resolved incident response for ${em.title} at ${em.location}`,
            category: 'Emergency',
            date: 'Just now',
            status: 'completed'
          };
          setActivities(prev => [resolveAct, ...prev]);
        }
        return { ...em, status: nextStatus };
      }
      return em;
    }));
  };

  // User Management callbacks
  const handleAddUser = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    
    // Log activity
    const newAct = {
      id: `act-${Date.now()}`,
      user: 'CMD Office',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      role: 'System Administrator',
      action: `Created new user credentials for ${newUser.name} [Access: ${newUser.role}]`,
      category: 'Booking',
      date: 'Just now',
      status: 'completed'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Log activity
    const newAct = {
      id: `act-${Date.now()}`,
      user: 'CMD Office',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      role: 'System Administrator',
      action: `Modified user privilege profile for ${updatedUser.name} [Access: ${updatedUser.role}]`,
      category: 'Booking',
      date: 'Just now',
      status: 'completed'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleDeleteUser = (id) => {
    const user = users.find(u => u.id === id);
    if (user && window.confirm(`Revoke all clinical credentials and system access for ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));

      // Log activity
      const newAct = {
        id: `act-${Date.now()}`,
        user: 'CMD Office',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
        role: 'System Administrator',
        action: `Revoked credentials and deleted account for ${user.name}`,
        category: 'Booking',
        date: 'Just now',
        status: 'completed'
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* Alert toast notification */}
      {dispatchNotification && (
        <div className="bg-red-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-red-600/15 border border-red-500 animate-in slide-in-from-top-4 duration-300 z-50">
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

      {/* Top Welcome Panel */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-500/30">
              Live Monitor Node
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Chief Medical Dashboard</h2>
            <p className="text-xs text-slate-300 max-w-xl font-medium">
              Portal systems synchronized. Monitoring {emergencies.filter(e=>e.status!=='Completed').length} active triage alerts, {stats.find(s=>s.id==='admins-available')?.value} staff on-duty, and active dispatches.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleQuickDispatch}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-500/15 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Quick Dispatch</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Save System Status
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <PatientActivityChart data={patientActivityData} />
        </div>
      </div>

      {/* Triage monitoring & Stacked Emergency Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <EmergencyCasesChart data={emergencyCasesData} />
        </div>
        <div className="lg:col-span-2">
          <EmergencyMonitoringList 
            emergencies={emergencies}
            onUpdateStatus={handleUpdateEmergencyStatus}
            onDispatch={handleQuickDispatch}
          />
        </div>
      </div>

      {/* User Management and Incident logs */}
      <div className="space-y-6">
        <UserManagementTable 
          users={users}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
        
        <RecentActivityTable 
          activities={activities.slice(0, 8)}
          onViewAuditTrail={() => setIsAuditModalOpen(true)}
        />
      </div>

      {/* Audit Trail Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAuditModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Clinical & Dispatch Audit Trail</h3>
                <p className="text-[10px] text-slate-400">Chronological clinical log index of credentials and triage telemetry</p>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Audit Logs
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <img src={act.avatar} alt="" className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{act.user}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{act.role} • {act.date}</p>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{act.action}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase shrink-0
                    ${act.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-650 border border-red-100'}
                  `}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
