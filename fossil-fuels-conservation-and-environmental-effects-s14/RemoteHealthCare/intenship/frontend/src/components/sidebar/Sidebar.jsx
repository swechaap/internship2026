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
  HeartPulse,
  CreditCard
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, role = 'Admin', activeEmergenciesCount = 18 }) {
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

  // Define full menu structure
  const allMenuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['Admin'] },
    { name: 'Users', path: '/users', icon: Users, badge: 'New', roles: ['Admin'] },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, roles: ['Patient', 'Manager'] },
    { name: 'Accounts', path: '/accounts', icon: CreditCard, roles: ['Accountant'] },
    { 
      name: 'Emergency Requests', 
      path: '/emergencies', 
      icon: ShieldAlert, 
      badge: activeEmergenciesCount > 0 ? activeEmergenciesCount.toString() : null, 
      badgeColor: 'bg-red-650',
      roles: ['Admin'] 
    },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Patient', 'Manager', 'Accountant'] },
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
