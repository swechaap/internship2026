import React, { useState } from 'react';
import StatCard from '../components/cards/StatCard';
import { CreditCard, Plus, Receipt, Landmark, FileText, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

const initialInvoices = [
  { id: 'INV-2026-001', patientName: 'John Doe', date: '2026-06-15', service: 'Cardiac Ultrasound / Echocardiogram', amount: '$420.00', status: 'Paid' },
  { id: 'INV-2026-002', patientName: 'Alice Smith', date: '2026-06-14', service: 'Acute Bronchitis Clinic Visit', amount: '$150.00', status: 'Paid' },
  { id: 'INV-2026-003', patientName: 'Robert Downey', date: '2026-06-12', service: 'Comprehensive Metabolic Panel', amount: '$280.00', status: 'Pending' },
  { id: 'INV-2026-004', patientName: 'Emma Watson', date: '2026-06-08', service: 'Right Knee ACL MRI Diagnostic Scan', amount: '$850.00', status: 'Overdue' },
  { id: 'INV-2026-005', patientName: 'David Miller', date: '2026-06-05', service: 'Endocrinology Consultation', amount: '$120.00', status: 'Paid' },
  { id: 'INV-2026-006', patientName: 'Bruce Wayne', date: '2026-05-24', service: 'Cervical Spine CT radiology study', amount: '$600.00', status: 'Pending' },
  { id: 'INV-2026-007', patientName: 'Tony Stark', date: '2026-04-28', service: 'Thoracic Surgical Calibration consultation', amount: '$950.00', status: 'Paid' }
];

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    service: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setFormData({
      patientName: '',
      service: '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.amount) return;

    const newInvoice = {
      id: `INV-2026-0${invoices.length + 1}`,
      patientName: formData.patientName,
      date: formData.date,
      service: formData.service || 'Routine General Consultation',
      amount: formData.amount.startsWith('$') ? formData.amount : `$${parseFloat(formData.amount).toFixed(2)}`,
      status: formData.status
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
  };

  // Derive stats
  const parseAmount = (str) => parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  const totalInvoiced = invoices.reduce((acc, inv) => acc + parseAmount(inv.amount), 0);
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((acc, inv) => acc + parseAmount(inv.amount), 0);
  const totalPending = invoices.filter(inv => inv.status === 'Pending').reduce((acc, inv) => acc + parseAmount(inv.amount), 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((acc, inv) => acc + parseAmount(inv.amount), 0);

  const stats = [
    { id: 'total-invoiced', title: 'Total Volume', value: `$${totalInvoiced.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: '+12%', isPositive: true, timeframe: 'credit notes ledger', color: 'blue' },
    { id: 'total-paid', title: 'Collected Receipts', value: `$${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: '84% rate', isPositive: true, timeframe: 'settled accounts', color: 'green' },
    { id: 'total-pending', title: 'Pending Claims', value: `$${totalPending.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: 'In progress', isPositive: true, timeframe: 'awaiting clearance', color: 'amber' },
    { id: 'total-overdue', title: 'Outstanding Balance', value: `$${totalOverdue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: 'Alert', isPositive: false, timeframe: 'overdue statements', color: 'red' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" /> Settled
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3.5 h-3.5" /> Awaiting
          </span>
        );
      case 'Overdue':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Overdue
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Billing & Credit Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access patient statements, process billing invoices, record co-payments, and review outstanding insurance claims.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Statement</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Statement Transaction Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological list of all medical insurance statements and payments</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-100 uppercase tracking-wider">
            HIPAA Compliant Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                <th className="px-6 py-4">Statement ID</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Service Details</th>
                <th className="px-6 py-4">Invoice Date</th>
                <th className="px-6 py-4">Statement Fee</th>
                <th className="px-6 py-4 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold">
                    {inv.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {inv.patientName}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {inv.service}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-semibold text-xs">
                    {inv.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {inv.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {getStatusBadge(inv.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Statement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Record New Statement</h3>
                <p className="text-[10px] text-slate-450 font-semibold">Generate a new ledger invoice statement for services</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wide">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wide">Service Description</label>
                <input
                  type="text"
                  placeholder="e.g. Pulmonology Consultation Visit"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wide">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wide">Ledger Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-705"
                  >
                    <option value="Pending">Awaiting (Pending)</option>
                    <option value="Paid">Settled (Paid)</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wide">Posting Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-655 hover:bg-slate-50 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-650 hover:bg-blue-600 text-white rounded-xl shadow-md font-bold cursor-pointer"
                >
                  Post Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
