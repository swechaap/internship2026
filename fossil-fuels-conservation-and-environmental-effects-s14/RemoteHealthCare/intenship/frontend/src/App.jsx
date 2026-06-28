import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import MedicalRecords from './pages/MedicalRecords';
import Login from './pages/Login';
import Users from './pages/Users';
import Emergencies from './pages/Emergencies';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';

// Aesthetically styled placeholder component for sub-sections
function PortalPlaceholderPage({ title, description, badge }) {
  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-2xl relative shadow-sm">
          🏥
          {badge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] text-white items-center justify-center font-extrabold">{badge}</span>
            </span>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        <div className="pt-2">
          <a 
            href="/admin"
            className="px-5 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 inline-block cursor-pointer shadow-sm border border-blue-100"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Session Authentication state loaded from sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('careportal_session_active') === 'true';
  });

  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('careportal_session_role') || 'Patient';
  });

  // Persist authentication status
  const handleLogin = (selectedRole) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    sessionStorage.setItem('careportal_session_active', 'true');
    sessionStorage.setItem('careportal_session_role', selectedRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem('careportal_session_active', 'false');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    sessionStorage.setItem('careportal_session_role', newRole);
  };

  // Helper route guards
  const getLandingPage = () => {
    if (role === 'Patient' || role === 'Manager') return '/medical-records';
    if (role === 'Accountant') return '/accounts';
    return '/admin';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to={getLandingPage()} replace /> : <Login onLogin={handleLogin} />
          } 
        />

        {/* Protected Core Layout containing Dashboard and Medical Records */}
        <Route 
          element={
            isAuthenticated ? (
              <DashboardLayout role={role} setRole={handleRoleChange} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Base Redirects */}
          <Route path="/" element={<Navigate to={getLandingPage()} replace />} />
          
          <Route 
            path="/admin" 
            element={
              role === 'Admin' ? <AdminDashboard /> : <Navigate to={getLandingPage()} replace />
            } 
          />
          
          <Route 
            path="/medical-records" 
            element={
              role === 'Patient' || role === 'Manager' ? (
                <MedicalRecords />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          <Route 
            path="/accounts" 
            element={
              role === 'Accountant' ? (
                <Accounts />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/records" element={<Navigate to="/medical-records" replace />} />

          {/* Sub-sections guards */}
          <Route 
            path="/users" 
            element={
              role === 'Admin' ? (
                <Users />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          <Route 
            path="/emergencies" 
            element={
              role === 'Admin' ? (
                <Emergencies />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings />
            } 
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? getLandingPage() : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
