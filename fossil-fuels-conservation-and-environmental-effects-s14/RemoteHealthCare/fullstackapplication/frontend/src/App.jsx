import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './admin/AdminDashboard';
import MedicalRecords from './patient/MedicalRecords';
import Login from './pages/Login';
import Users from './admin/Users';
import Emergencies from './pages/Emergencies';
import Settings from './pages/Settings';
import Accounts from './doctor/Accounts';
import Billing from './doctor/Billing';
import Analytics from './pages/Analytics';
import ConsultationRoom from './pages/ConsultationRoom';
import BookConsultation from './pages/BookConsultation';
import ConsultationsList from './pages/ConsultationsList';
import AmbulanceTracker from './patient/AmbulanceTracker';
import MedicineReminders from './pages/MedicineReminders';
import PrescriptionsList from './pages/PrescriptionsList';

export default function App() {
  // Session Authentication state loaded from sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('careportal_session_active') === 'true';
  });

  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('careportal_session_role') || 'Doctor';
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
    if (role === 'Doctor') return '/records';
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

          <Route 
            path="/analytics" 
            element={
              role === 'Admin' || role === 'Manager' || role === 'Doctor' ? (
                <Analytics />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          <Route 
            path="/book-consultation" 
            element={
              role === 'Patient' ? (
                <BookConsultation />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          <Route 
            path="/appointments" 
            element={
              role === 'Patient' || role === 'Doctor' ? (
                <ConsultationsList />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          <Route 
            path="/consultation/:id" 
            element={
              role === 'Patient' || role === 'Doctor' ? (
                <ConsultationRoom />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* Mount fully functional MedicalRecords page component to /records route in App.jsx */}
          <Route 
            path="/records" 
            element={
              role === 'Admin' || role === 'Doctor' ? (
                <MedicalRecords />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          {/* Mount Billing page component to /billing route in App.jsx */}
          <Route 
            path="/billing" 
            element={
              role === 'Admin' || role === 'Doctor' ? (
                <Billing />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />

          {/* Sub-sections guards */}
          <Route 
            path="/users" 
            element={
              role === 'Admin' || role === 'Doctor' ? (
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
            path="/patient/emergencies" 
            element={
              role === 'Patient' ? (
                <AmbulanceTracker />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          <Route 
            path="/patient/reminders" 
            element={
              role === 'Patient' ? (
                <MedicineReminders />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          <Route 
            path="/patient/prescriptions" 
            element={
              role === 'Patient' ? (
                <PrescriptionsList />
              ) : (
                <Navigate to={getLandingPage()} replace />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              role !== 'Patient' ? (
                <Settings />
              ) : (
                <Navigate to="/medical-records" replace />
              )
            } 
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? getLandingPage() : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
