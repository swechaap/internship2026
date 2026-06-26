import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldAlert, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  CreditCard,
  Activity,
  Video,
  CalendarPlus,
  HeartPulse
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, role = 'Admin', activeEmergenciesCount = 18 }) {
  const [userData] = React.useState(() => {
    if (role === 'Patient') {
      const data = sessionStorage.getItem('patient_data');
      return data ? JSON.parse(data) : null;
    } else {
      const data = sessionStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    }
  });

  const getRoleProfile = (currentRole) => {
    let profile = {};
    switch (currentRole) {
      case 'Admin':
        profile = { name: 'Chief Medical Director', email: 'cmd@careportal.org', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' }; break;
      case 'Doctor':
        profile = { name: 'Dr. Michael Chen', email: 'm.chen@careportal.org', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100' }; break;
      case 'Manager':
        profile = { name: 'Clinical Manager', email: 'manager@careportal.org', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' }; break;
      case 'Accountant':
        profile = { name: 'Accounting Officer', email: 'accountant@careportal.org', avatar: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=100' }; break;
      case 'Patient':
      default:
        profile = { name: 'Patient', email: 'patient@careportal.org', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' }; break;
    }

    if (userData) {
      if (currentRole === 'Patient') {
        profile.name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || profile.name;
        profile.email = userData.email || profile.email;
      } else {
        profile.name = userData.username || profile.name;
        profile.email = userData.email || profile.email;
      }
    }
    return profile;
  };

  const activeProfile = getRoleProfile(role);

  // Define full menu structure
  const allMenuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['Admin'] },
    { name: 'Analytics', path: '/analytics', icon: Activity, roles: ['Admin', 'Doctor', 'Manager'] },
    { name: 'Book Appointment', path: '/book-consultation', icon: CalendarPlus, roles: ['Patient'] },
    { name: 'Appointments', path: '/appointments', icon: Video, roles: ['Patient', 'Doctor'] },
    { name: 'Users', path: '/users', icon: Users, badge: 'New', roles: ['Admin', 'Doctor'] },
    { name: 'Medical Records', path: '/records', icon: FileText, roles: ['Admin', 'Doctor'] },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, roles: ['Patient', 'Manager'] },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText, roles: ['Patient'] },
    { name: 'Medicine Reminders', path: '/patient/reminders', icon: Activity, roles: ['Patient'] },
    { name: 'Accounts', path: '/accounts', icon: CreditCard, roles: ['Accountant'] },
    { name: 'Billing', path: '/billing', icon: CreditCard, roles: ['Admin', 'Doctor'] },
    { 
      name: 'Emergency Requests', 
      path: '/emergencies', 
      icon: ShieldAlert, 
      badge: activeEmergenciesCount > 0 ? activeEmergenciesCount.toString() : null, 
      badgeColor: 'bg-red-650',
      roles: ['Admin'] 
    },
    {
      name: 'Ambulance Tracker',
      path: '/patient/emergencies',
      icon: ShieldAlert,
      roles: ['Patient']
    },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Doctor', 'Manager', 'Accountant'] },
  ];

  // Filter menu items based on the active role
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center p-2 rounded-xl bg-blue-600/20 text-blue-400 shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent truncate">
                CarePortal
              </span>
            )}
          </div>
          
          {/* Collapse button for Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group
                  ${isActive 
                    ? 'bg-blue-650 text-white shadow-lg shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-805/60'}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-200`} />
                
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {/* Badge (e.g. for Emergencies or New features) */}
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badgeColor || 'bg-blue-605'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for Collapsed Sidebar */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* High-contrast glowing "My Health Vitals" container in records portal sidebar */}
        {!isCollapsed && role === 'Patient' && (
          <div className="mx-4 my-4 p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h4 className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">My Health Vitals</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 text-[10px] font-bold">
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase tracking-wide text-[8px]">Heart Rate</p>
                <p className="text-xs font-black text-slate-100 mt-0.5">72 <span className="text-[8px] text-slate-500 font-medium">bpm</span></p>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase tracking-wide text-[8px]">Blood Press.</p>
                <p className="text-xs font-black text-slate-100 mt-0.5">120/80 <span className="text-[7px] text-slate-500 font-medium">mmHg</span></p>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase tracking-wide text-[8px]">Oxygen Level</p>
                <p className="text-xs font-black text-slate-100 mt-0.5">98% <span className="text-[8px] text-slate-500 font-medium">SpO₂</span></p>
              </div>
              <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                <p className="text-slate-500 uppercase tracking-wide text-[8px]">Blood Sugar</p>
                <p className="text-xs font-black text-slate-100 mt-0.5">95 <span className="text-[7px] text-slate-500 font-medium">mg/dL</span></p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={activeProfile.avatar} 
              alt={`${activeProfile.name} Profile`}
              className="w-10 h-10 rounded-xl border border-slate-700 object-cover shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{activeProfile.name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {activeProfile.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
