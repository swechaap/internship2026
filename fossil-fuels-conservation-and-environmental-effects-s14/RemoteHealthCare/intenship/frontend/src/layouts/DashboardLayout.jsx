import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/sidebar/Header';

export default function DashboardLayout({ role, setRole, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const handleGlobalSearch = (query) => {
    setGlobalSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-805 font-sans flex">
      {/* Collapsible Left Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        role={role}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        {/* Top Header Bar */}
        <Header 
          setIsMobileOpen={setIsMobileOpen} 
          onSearch={handleGlobalSearch}
          role={role}
          setRole={setRole}
          onLogout={onLogout}
        />

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* We pass down role and search query via context to the pages */}
          <Outlet context={{ globalSearchQuery, role, setRole }} />
        </main>
      </div>
    </div>
  );
}
