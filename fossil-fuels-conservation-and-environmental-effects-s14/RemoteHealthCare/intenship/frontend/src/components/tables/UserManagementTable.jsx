import React, { useState } from 'react';
import { User, Shield, Stethoscope, UserCheck, Plus, Search, Edit2, Trash2, X, Check, ClipboardList, CreditCard } from 'lucide-react';

export default function UserManagementTable({ users, onAddUser, onEditUser, onDeleteUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Patient',
    email: '',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', role: 'Patient', email: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email || '',
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingUser) {
      onEditUser({
        ...editingUser,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        status: formData.status
      });
    } else {
      onAddUser({
        id: `usr-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@careportal.org`,
        status: formData.status
      });
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-3.5 h-3.5 text-red-500" />;
      case 'Manager':
        return <ClipboardList className="w-3.5 h-3.5 text-blue-500" />;
      case 'Accountant':
        return <CreditCard className="w-3.5 h-3.5 text-violet-500" />;
      case 'Patient':
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Accountant':
        return 'bg-violet-50 text-violet-750 border-violet-100';
      case 'Patient':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-base">User Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">Control clinical privileges, system access, and patient directories</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filters Area */}
      <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 inset-y-0 my-auto text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>
        <div className="flex gap-1.5 w-full sm:w-auto">
          {['All', 'Admin', 'Manager', 'Accountant', 'Patient'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-blue-50 text-blue-600 border border-blue-100/50'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role}s
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Portal Email</th>
              <th className="px-6 py-4">Access Role</th>
              <th className="px-6 py-4">Security Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs uppercase font-extrabold">
                        {u.name.substring(0, 2)}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {u.email}
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadge(u.role)}`}>
                      {getRoleIcon(u.role)}
                      {u.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xxs font-extrabold uppercase border ${
                      u.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {u.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Edit User Role"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Revoke Credentials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                  No portal users match your search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingUser ? 'Edit System Privileges' : 'Grant New System Credentials'}
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
                <label className="text-slate-500 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stephen Strange"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 uppercase tracking-wide">Portal Email</label>
                <input
                  type="email"
                  placeholder="e.g. s.strange@careportal.org (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wide">Privilege Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Manager">Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wide">Security Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 p-4 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Privileges</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
