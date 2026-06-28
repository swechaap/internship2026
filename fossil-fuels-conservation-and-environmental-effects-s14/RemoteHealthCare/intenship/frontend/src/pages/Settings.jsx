import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Bell, Shield, Eye, ShieldCheck, Clock, ToggleLeft, Key, Lock, Check } from 'lucide-react';

export default function Settings() {
  const { role } = useOutletContext();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'system', 'logs'
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [alertSound, setAlertSound] = useState(true);
  const [hipaaInterval, setHipaaInterval] = useState('30');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [passkey, setPasskey] = useState('••••••••••••');

  const getRoleProfile = (currentRole) => {
    switch (currentRole) {
      case 'Admin':
        return {
          name: 'Chief Medical Director',
          email: 'cmd@careportal.org',
          roleLabel: 'System Administrator (Full Access)',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
        };
      case 'Manager':
        return {
          name: 'Clinical Manager',
          email: 'manager@careportal.org',
          roleLabel: 'Clinical Manager (Records Control)',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
        };
      case 'Accountant':
        return {
          name: 'Accounting Officer',
          email: 'accountant@careportal.org',
          roleLabel: 'Systems Accountant (Financial Controls)',
          avatar: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=100'
        };
      case 'Patient':
      default:
        return {
          name: 'John Doe',
          email: 'j.doe@gmail.com',
          roleLabel: 'Registered Patient (Read-only)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
        };
    }
  };

  const activeProfile = getRoleProfile(role);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Portal settings saved and synchronized successfully.');
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Mock HIPAA Logs
  const auditLogs = [
    { id: 1, time: '2026-06-18 18:25:12', ip: '192.168.1.45', device: 'Windows 11 (Chrome Desktop)', action: 'Establish Secure Session', status: 'Passed' },
    { id: 2, time: '2026-06-18 17:10:44', ip: '192.168.1.45', device: 'Windows 11 (Chrome Desktop)', action: 'HIPAA Ledger Synchronization', status: 'Passed' },
    { id: 3, time: '2026-06-17 12:44:02', ip: '10.0.4.118', device: 'iOS Mobile App Responders Node', action: 'Quick Triage Telemetry Dispatch', status: 'Passed' },
    { id: 4, time: '2026-06-16 09:15:30', ip: '192.168.1.94', device: 'MacOS Catalina (Safari Desktop)', action: 'Clinical Document Download (PDF)', status: 'Audited' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
          System Configurations
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust HIPAA security protocols, configure email or SMS emergency alerts, and view account logs.
        </p>
      </div>

      {/* Settings Grid Layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        
        {/* Left Settings Sidebar Navigation */}
        <div className="bg-slate-50/60 p-4 border-r border-slate-100 space-y-2 lg:col-span-1">
          {[
            { id: 'profile', label: 'Security Profile', icon: User },
            { id: 'system', label: 'Triage & Alerts', icon: Bell },
            { id: 'logs', label: 'HIPAA Audit Logs', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSuccessMsg(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-205 cursor-pointer
                  ${isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-slate-655 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Configuration Form */}
        <div className="p-6 lg:p-8 lg:col-span-3 flex flex-col justify-between">
          
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Profile Security */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Account Security Profile</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage authenticated credentials and access parameters</p>
              </div>

              {/* Dynamic User Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                <img 
                  src={activeProfile.avatar} 
                  alt="" 
                  className="w-12 h-12 rounded-xl object-cover ring-4 ring-slate-100 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{activeProfile.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{activeProfile.email}</p>
                  <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                    {activeProfile.roleLabel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wide">Authorized Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={activeProfile.email}
                    className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wide">Passkey Hash Roster</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <Key className="w-4 h-4 absolute right-3 inset-y-0 my-auto text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-650 hover:bg-blue-600 text-white rounded-xl shadow-md text-xs font-bold cursor-pointer transition-all"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: System Settings */}
          {activeTab === 'system' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Triage & Alarm Thresholds</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Control auditory dispatches and HIPAA tracking parameters</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                
                {/* HIPAA Interval select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-slate-800 font-bold">HIPAA Audit Interval</h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">System-wide frequency for ledger key generation</p>
                  </div>
                  <select
                    value={hipaaInterval}
                    onChange={(e) => setHipaaInterval(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-850 font-bold outline-none cursor-pointer text-xs"
                  >
                    <option value="15">Every 15 Days</option>
                    <option value="30">Every 30 Days (Standard)</option>
                    <option value="60">Every 60 Days</option>
                    <option value="90">Every 90 Days</option>
                  </select>
                </div>

                {/* Dispatch Alarm Audio toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-slate-800 font-bold">Emergency Audio Alarms</h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">Play alarm tone on incoming critical triage dispatches</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlertSound(!alertSound)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none relative ${alertSound ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${alertSound ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* Email digests checkboxes */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-slate-800 font-bold">Daily Telemetry Digest</h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">Send comprehensive clinical upload audits to email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none relative ${emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${emailAlerts ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* SMS alerts checkboxes */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div>
                    <h4 className="text-slate-800 font-bold">Responders SMS dispatch alerts</h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">Forward critical priority triage codes to mobile units</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 focus:outline-none relative ${smsAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${smsAlerts ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-650 hover:bg-blue-600 text-white rounded-xl shadow-md text-xs font-bold cursor-pointer transition-all"
                >
                  Save Configurations
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: HIPAA Audit Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">HIPAA Audit Trail Ledger</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Cryptographic connection record logging system access attempts</p>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider font-semibold text-slate-400 text-[10px]">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Device Vector</th>
                      <th className="px-4 py-3">Access Action</th>
                      <th className="px-4 py-3 text-right">Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{log.time}</td>
                        <td className="px-4 py-3 font-mono text-slate-700">{log.ip}</td>
                        <td className="px-4 py-3 truncate max-w-[120px]">{log.device}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{log.action}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase
                            ${log.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}
                          `}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
