import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  UserPlus, 
  UserMinus, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  Clock,
  ArrowUpDown,
  Building
} from 'lucide-react';

const defaultFlowEvents = [
  { id: 'flow-1', name: 'John Doe', type: 'Check-In', room: 'ICU-302', time: '10:24 AM', date: '2026-06-18', billingCode: 'TX-4482', amount: 1250 },
  { id: 'flow-2', name: 'Robert Downey', type: 'Check-Out', room: 'ER-Ward B', time: '11:15 AM', date: '2026-06-18', billingCode: 'TX-4921', amount: 3200 },
  { id: 'flow-3', name: 'Michael Chen', type: 'Check-In', room: 'Room 104', time: '01:45 PM', date: '2026-06-18', billingCode: 'TX-5510', amount: 850 },
  { id: 'flow-4', name: 'Sarah Connor', type: 'Check-In', room: 'ICU-305', time: '03:10 PM', date: '2026-06-18', billingCode: 'TX-5582', amount: 1500 },
  { id: 'flow-5', name: 'Stephen Strange', type: 'Check-Out', room: 'Neurology-A', time: '04:00 PM', date: '2026-06-18', billingCode: 'TX-5601', amount: 4800 },
  { id: 'flow-6', name: 'Alice Smith', type: 'Check-In', room: 'Room 211', time: '04:30 PM', date: '2026-06-18', billingCode: 'TX-5612', amount: 620 },
  { id: 'flow-7', name: 'Wanda Maximoff', type: 'Check-Out', room: 'Room 102', time: '05:15 PM', date: '2026-06-18', billingCode: 'TX-5630', amount: 1950 },
  { id: 'flow-8', name: 'Bruce Banner', type: 'Check-In', room: 'Triage-3', time: '06:00 PM', date: '2026-06-18', billingCode: 'TX-5645', amount: 1100 }
];

const weeklyFlowChartData = [
  { name: 'Mon', Incoming: 18, Outgoing: 12 },
  { name: 'Tue', Incoming: 24, Outgoing: 15 },
  { name: 'Wed', Incoming: 32, Outgoing: 20 },
  { name: 'Thu', Incoming: 28, Outgoing: 22 },
  { name: 'Fri', Incoming: 41, Outgoing: 35 },
  { name: 'Sat', Incoming: 15, Outgoing: 28 },
  { name: 'Sun', Incoming: 22, Outgoing: 19 }
];

export default function Accounts() {
  const { globalSearchQuery } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'Check-In', 'Check-Out'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const API_URL = 'http://localhost:5000/api';

  // Patient Flow state
  const [flowEvents, setFlowEvents] = useState([]);

  // Fetch patient flow events on mount
  useEffect(() => {
    fetch(`${API_URL}/flow-events`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFlowEvents(data);
        }
      })
      .catch(err => console.error('Failed to fetch patient flow events', err));
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Check-In',
    room: '',
    amount: ''
  });

  // Sync global search
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchTerm(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  // Derive stats dynamically
  const incomingToday = flowEvents.filter(e => e.type === 'Check-In').length;
  const outgoingToday = flowEvents.filter(e => e.type === 'Check-Out').length;
  const netGain = incomingToday - outgoingToday;
  const totalBilling = flowEvents.reduce((sum, e) => sum + e.amount, 0);

  const stats = [
    {
      id: 'flow-incoming',
      title: 'Incoming (Check-Ins)',
      value: incomingToday.toString(),
      change: '+14% vs yesterday',
      isPositive: true,
      timeframe: 'today',
      color: 'blue',
      icon: UserPlus
    },
    {
      id: 'flow-outgoing',
      title: 'Outgoing (Check-Outs)',
      value: outgoingToday.toString(),
      change: '+8% vs yesterday',
      isPositive: false, // Outgoing increasing is not a standard positive but represents activity
      timeframe: 'today',
      color: 'red',
      icon: UserMinus
    },
    {
      id: 'flow-net',
      title: 'Net Occupancy Delta',
      value: `${netGain > 0 ? '+' : ''}${netGain}`,
      change: 'Active patient shift',
      isPositive: netGain >= 0,
      timeframe: 'net today',
      color: netGain >= 0 ? 'green' : 'amber',
      icon: Activity
    },
    {
      id: 'flow-billing',
      title: 'Billing Audited Today',
      value: `$${totalBilling.toLocaleString()}`,
      change: '+25% audit rate',
      isPositive: true,
      timeframe: 'system total',
      color: 'purple',
      icon: DollarSign
    }
  ];

  const handleOpenAdd = () => {
    setFormData({ name: '', type: 'Check-In', room: '', amount: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.room) return;

    try {
      const response = await fetch(`${API_URL}/flow-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          room: formData.room,
          amount: parseFloat(formData.amount) || 500
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFlowEvents(prev => [...prev, data.event]);
        setIsModalOpen(false);
        setSuccessMsg(`Patient flow event recorded successfully for ${formData.name}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Failed to save flow event.');
      }
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Failed to connect to the backend server.');
    }
  };

  // Filter Ledger
  const filteredEvents = flowEvents.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.billingCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold space-y-1">
          <p className="font-bold text-slate-400">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} style={{ color: item.color }}>
              {item.name}: {item.value} Patients
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Upper header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Patient Flow & Accounts Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time patient admissions (incoming) and discharges (outgoing), and review billing logs.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Flow Event</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between hover:shadow-md transition-all duration-300">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className={`text-[10px] font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                  Scope: {stat.timeframe}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-slate-50 text-slate-500 border border-slate-100`}>
                <Icon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Weekly Patient Flow Trends</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Comparison of Admissions (Incoming) and Discharges (Outgoing)</p>
          </div>
          <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-655">
            <span className="bg-white text-blue-600 px-3 py-1 rounded-lg shadow-sm">Weekly</span>
            <span className="px-3 py-1 cursor-pointer hover:text-slate-800">Monthly</span>
          </div>
        </div>

        <div className="h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyFlowChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="Incoming" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncoming)" />
              <Area type="monotone" dataKey="Outgoing" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorOutgoing)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient flow ledger table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
        
        {/* Table Toolbar controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Patient Flow Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Audited listing of hospital arrivals and departures</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 inset-y-0 my-auto text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, room, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            {/* Type Filters */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 text-xs font-bold text-slate-550">
              {['All', 'Check-In', 'Check-Out'].map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    typeFilter === type 
                      ? 'bg-blue-50 text-blue-650' 
                      : 'hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {type === 'All' ? 'All Flow' : type}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* The actual table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/20 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Flow Event</th>
                <th className="px-6 py-4">Assigned Room</th>
                <th className="px-6 py-4">Event Time</th>
                <th className="px-6 py-4">Billing Reference</th>
                <th className="px-6 py-4 text-right">Audit Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors font-medium">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {evt.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        evt.type === 'Check-In' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {evt.type === 'Check-In' ? <UserPlus className="w-3 h-3" /> : <UserMinus className="w-3 h-3" />}
                        {evt.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono font-bold">
                      {evt.billingCode}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${evt.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold text-xs">
                    No patient check-in or check-out activities match the search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Record Flow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">
                Record Patient Flow Event
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 uppercase tracking-wide">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wanda Maximoff"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wide">Flow Action</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="Check-In">Check-In</option>
                    <option value="Check-Out">Check-Out</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wide">Room Allocation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 204"
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 uppercase tracking-wide">Audit billing Charge ($)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 p-4 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit Flow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
