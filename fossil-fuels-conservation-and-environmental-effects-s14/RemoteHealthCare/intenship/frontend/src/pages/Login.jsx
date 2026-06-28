import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail, Key, ShieldCheck, UserCheck, Stethoscope, Shield, ClipboardList, CreditCard, Check } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Patient'); // 'Admin', 'Patient', 'Manager', 'Accountant'
  const [email, setEmail] = useState('patient.doe@gmail.com');
  
  const API_URL = 'http://localhost:5000/api';

  // Credentials password store
  const [passwordsStore, setPasswordsStore] = useState({
    Patient: '••••••••',
    Manager: '••••••••',
    Accountant: '••••••••',
    Admin: 's14@123'
  });

  const [password, setPassword] = useState(() => passwordsStore.Patient);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch passwords store from backend on mount
  useEffect(() => {
    fetch(`${API_URL}/passwords`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPasswordsStore(data);
          // Update the initial password input prefill
          setPassword(data.Patient || '••••••••');
        }
      })
      .catch(err => console.error('Failed to fetch passwords from backend', err));
  }, []);

  // Security gate states
  const [showAdminGateModal, setShowAdminGateModal] = useState(false);
  const [gatePasscode, setGatePasscode] = useState('');
  const [gateError, setGateError] = useState('');

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotRole, setForgotRole] = useState('Patient');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Auto-fill emails based on role selection for easy testing
  const handleRoleChange = (role) => {
    if (role === 'Admin') {
      // Prompt for secondary security gate passcode
      setGatePasscode('');
      setGateError('');
      setShowAdminGateModal(true);
    } else {
      setSelectedRole(role);
      setPassword(passwordsStore[role] || '••••••••');
      if (role === 'Manager') {
        setEmail('manager@careportal.org');
      } else if (role === 'Accountant') {
        setEmail('accountant@careportal.org');
      } else {
        setEmail('patient.doe@gmail.com');
      }
      setError('');
    }
  };

  const handleGateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'cmd@careportal.org', password: gatePasscode, role: 'Admin' })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSelectedRole('Admin');
        setEmail('cmd@careportal.org');
        setPassword(''); // Keep password empty, user must type it!
        setError('');
        setShowAdminGateModal(false);
      } else {
        setGateError(data.message || 'Invalid security gate passcode. Access denied.');
      }
    } catch (err) {
      setGateError('Connection to security server failed.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPass || !confirmPass) {
      setForgotError('Please fill in both password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }
    if (newPass.length < 4) {
      setForgotError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: forgotRole, newPassword: newPass })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordsStore(prev => ({
          ...prev,
          [forgotRole]: newPass
        }));

        if (forgotRole === selectedRole) {
          setPassword(forgotRole === 'Admin' ? '' : newPass);
        }

        setForgotSuccess(`Password for ${forgotRole} reset successfully!`);
        setTimeout(() => {
          setShowForgotModal(false);
        }, 1500);
      } else {
        setForgotError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError('Failed to connect to reset server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setTimeout(() => {
          setIsSubmitting(false);
          onLogin(selectedRole);
          
          if (selectedRole === 'Admin') {
            navigate('/admin');
          } else if (selectedRole === 'Accountant') {
            navigate('/accounts');
          } else {
            navigate('/medical-records');
          }
        }, 1000);
      } else {
        setIsSubmitting(false);
        setError(data.message || `Invalid credentials. Please enter the correct passcode for the ${selectedRole} portal.`);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Connection to authorization server failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative blurred background nodes */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-3xl -ml-60 -mt-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl -mr-40 -mb-40 pointer-events-none" />

      {/* Main Grid Card */}
      <div className="relative w-full max-w-4xl bg-slate-950/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        {/* Left Side Branding Pane */}
        <div className="col-span-5 bg-gradient-to-br from-blue-750 to-indigo-950 p-8 flex flex-col justify-between relative text-white border-r border-slate-800/50">
          {/* Scan line overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none" />
          
          <div className="flex items-center gap-3 z-10">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 shrink-0 border border-blue-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              CarePortal
            </span>
          </div>

          <div className="space-y-4 my-12 z-10">
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-500/20">
              HIPAA SECURED NODE
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
              Remote Healthcare & Response Network
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Access real-time clinical dispatches, triage telemetry, and secure encrypted medical archives.
            </p>
          </div>

          <div className="z-10 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AES-256 Cloud Encryption</span>
          </div>
        </div>

        {/* Right Side Credentials Login Form */}
        <div className="col-span-7 p-8 flex flex-col justify-center bg-slate-900/60">
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-extrabold text-white">System Authentication</h3>
            <p className="text-xs text-slate-450 font-semibold">Select your credential role to sync clinical access</p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {[
              { id: 'Patient', label: 'Patient', icon: UserCheck },
              { id: 'Manager', label: 'Manager', icon: ClipboardList },
              { id: 'Accountant', label: 'Accountant', icon: CreditCard },
              { id: 'Admin', label: 'Admin', icon: Shield }
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                   key={role.id}
                   type="button"
                   onClick={() => handleRoleChange(role.id)}
                   className={`py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-2
                     ${isSelected 
                       ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-glow' 
                       : 'bg-slate-950/20 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}
                   `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-slate-450 uppercase tracking-wide">Authorized Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@careportal.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-450 uppercase tracking-wide">Passkey Secret</label>
                <span 
                  onClick={() => {
                    setForgotRole(selectedRole);
                    setNewPass('');
                    setConfirmPass('');
                    setForgotError('');
                    setForgotSuccess('');
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-650 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/15 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authenticating & Syncing...' : 'Establish Secure Connection'}</span>
            </button>
          </form>

          {/* HIPAA Roster Subtitle */}
          <p className="text-[10px] text-slate-600 text-center mt-6">
            Protected by federal healthcare security guidelines. All connection vectors are audited.
          </p>
        </div>

      </div>

      {/* Admin Security Gate Modal */}
      {showAdminGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowAdminGateModal(false)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden p-6 text-xs font-semibold">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0 border border-red-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Admin Security Gate</h4>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Secondary Authorization</p>
              </div>
            </div>

            <p className="text-slate-400 text-xxs leading-relaxed mb-4">
              You are attempting to access a secured administrative node. Please enter the unlock passcode to proceed.
            </p>

            <form onSubmit={handleGateSubmit} className="space-y-4">
              {gateError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xxs">
                  {gateError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-450 uppercase tracking-wide">Enter Passcode</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter admin passcode"
                    value={gatePasscode}
                    onChange={(e) => {
                      setGatePasscode(e.target.value);
                      setGateError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xxs font-bold">
                <button
                  type="button"
                  onClick={() => setShowAdminGateModal(false)}
                  className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/10 transition-all cursor-pointer text-center"
                >
                  Unlock Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden p-6 text-xs font-semibold">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 border border-blue-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Reset Passkey Secret</h4>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Forgot Password Recovery</p>
              </div>
            </div>

            <p className="text-slate-400 text-xxs leading-relaxed mb-4">
              Specify the target credential role to reset and establish a new authorization passkey.
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-4">
              {forgotError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xxs">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xxs flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-450 uppercase tracking-wide">Target Role</label>
                <select
                  value={forgotRole}
                  onChange={(e) => setForgotRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 transition-all font-medium"
                >
                  <option value="Patient" className="bg-slate-900">Patient</option>
                  <option value="Manager" className="bg-slate-900">Manager</option>
                  <option value="Accountant" className="bg-slate-900">Accountant</option>
                  <option value="Admin" className="bg-slate-900">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 uppercase tracking-wide">New Passkey Secret</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                    setForgotError('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-450 uppercase tracking-wide">Confirm New Passkey</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                    setForgotError('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2 text-xxs font-bold">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-650 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer text-center"
                >
                  Save Passkey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
