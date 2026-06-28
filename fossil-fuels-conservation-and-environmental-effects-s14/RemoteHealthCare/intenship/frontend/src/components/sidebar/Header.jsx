import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Calendar, ShieldAlert, Shield, ChevronDown, LogOut } from 'lucide-react';

export default function Header({ setIsMobileOpen, onSearch, role, setRole, onLogout, activeEmergenciesCount = 18 }) {
  const getRoleProfile = (currentRole) => {
    switch (currentRole) {
      case 'Admin':
        return {
          name: 'Chief Medical Director',
          email: 'cmd@careportal.org',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
        };
      case 'Manager':
        return {
          name: 'Clinical Manager',
          email: 'manager@careportal.org',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
        };
      case 'Accountant':
        return {
          name: 'Accounting Officer',
          email: 'accountant@careportal.org',
          avatar: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=100'
        };
      case 'Patient':
      default:
        return {
          name: 'John Doe',
          email: 'j.doe@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
        };
    }
  };

  const activeProfile = getRoleProfile(role);
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ambulance Unit 4 arrived at site. Triage in progress.', time: '4m ago', unread: true },
    { id: 2, text: 'New lab results uploaded for Patient John Doe.', time: '12m ago', unread: true },
    { id: 3, text: 'System backup: Secure data synced with HIPAA vaults.', time: '2h ago', unread: false }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Get readable page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Overview Analytics';
      case '/medical-records':
        return 'Medical Records';
      case '/accounts':
        return 'Patient Flow & Accounts';
      case '/users':
        return 'User Directory';
      case '/emergencies':
        return 'Emergency Incidents';
      case '/settings':
        return 'System Settings';
      default:
        return 'Healthcare Portal';
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Format today's date
  const getFormattedDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/95">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg lg:hidden hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4 lg:mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search records, patients, active emergencies..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      {/* Right-side Utilities */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Active Session Role Badge */}
        <div className="flex items-center gap-1.5 bg-blue-50/50 p-1 px-3 rounded-xl border border-blue-100/50 text-[11px] font-bold text-blue-700">
          <Shield className="w-3.5 h-3.5" />
          <span>{role === 'Patient' ? 'Patient Portal' : role === 'Manager' ? 'Manager Portal' : role === 'Accountant' ? 'Accountant Portal' : 'Admin Account'}</span>
        </div>

        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-655">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Emergencies Direct Link Indicator */}
        {activeEmergenciesCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-650 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">{activeEmergenciesCount} Active Emergencies</span>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-850 hover:bg-slate-100 transition-all cursor-pointer ${showNotifications ? 'bg-slate-100 text-slate-850' : ''}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-650 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden py-1 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Notifications</span>
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] text-blue-650 hover:text-blue-705 font-bold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 text-[11px] flex items-start gap-2.5 hover:bg-slate-50/50 transition-colors ${n.unread ? 'bg-blue-50/5' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                      <div className="space-y-0.5 flex-1">
                        <p className={`text-slate-655 font-medium ${n.unread ? 'text-slate-800 font-bold' : ''}`}>
                          {n.text}
                        </p>
                        <p className="text-slate-400 font-semibold">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Details Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <img
              src={activeProfile.avatar}
              alt={`${activeProfile.name} Avatar`}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-extrabold text-slate-800 leading-tight font-sans">{activeProfile.name}</p>
              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                <span>{role === 'Patient' ? 'Patient' : role}</span>
                <ChevronDown className="w-3 h-3" />
              </p>
            </div>
          </div>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden py-1 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-[11px] font-extrabold text-slate-800">{activeProfile.name}</p>
                  <p className="text-[10px] text-slate-450 font-semibold truncate">{activeProfile.email}</p>
                </div>
                <div className="p-1 text-xs">
                  {onLogout && (
                    <button 
                      onClick={() => { onLogout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
