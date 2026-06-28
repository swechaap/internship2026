import React, { useState, useEffect } from 'react';
import UserManagementTable from '../components/tables/UserManagementTable';
import StatCard from '../components/cards/StatCard';

const defaultUsers = [
  { id: 'usr-1', name: 'Sarah Connor', role: 'Admin', email: 's.connor@careportal.org', status: 'Active' },
  { id: 'usr-2', name: 'Michael Chen', role: 'Admin', email: 'm.chen@careportal.org', status: 'Active' },
  { id: 'usr-3', name: 'John Doe', role: 'Patient', email: 'j.doe@gmail.com', status: 'Active' },
  { id: 'usr-4', name: 'Christine Palmer', role: 'Manager', email: 'c.palmer@careportal.org', status: 'Active' },
  { id: 'usr-5', name: 'Robert Downey', role: 'Patient', email: 'r.downey@stark.com', status: 'Active' },
  { id: 'usr-6', name: 'Alice Smith', role: 'Patient', email: 'a.smith@yahoo.com', status: 'Suspended' },
  { id: 'usr-7', name: 'Stephen Strange', role: 'Accountant', email: 's.strange@careportal.org', status: 'Active' }
];

export default function Users() {
  const API_URL = 'http://localhost:5000/api';
  const [users, setUsers] = useState([]);

  // Fetch users on mount
  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        if (data) setUsers(data);
      })
      .catch(err => console.error('Failed to fetch users from backend', err));
  }, []);

  // Handle CRUD callbacks using backend APIs
  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prev => [data, ...prev]);
      } else {
        alert(data.message || 'Failed to add user.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? data : u));
      } else {
        alert(data.message || 'Failed to update user.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  const handleDeleteUser = async (id) => {
    const user = users.find((u) => u.id === id);
    if (user && window.confirm(`Revoke all clinical credentials and system access for ${user.name}?`)) {
      try {
        const response = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(prev => prev.filter(u => u.id !== id));
        } else {
          alert(data.message || 'Failed to delete user.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend.');
      }
    }
  };

  // Derive stats
  const totalAdmins = users.filter((u) => u.role === 'Admin').length + 1;
  const totalManagers = users.filter((u) => u.role === 'Manager').length;
  const totalAccountants = users.filter((u) => u.role === 'Accountant').length;
  const totalPatients = users.filter((u) => u.role === 'Patient').length;

  const stats = [
    { id: 'total-users', title: 'Total Members', value: (users.length + 1).toString(), change: 'Sync active', isPositive: true, timeframe: 'system roster', color: 'blue' },
    { id: 'total-admins', title: 'System Admins', value: totalAdmins.toString(), change: 'Administrators', isPositive: true, timeframe: 'active staff', color: 'green' },
    { id: 'total-managers', title: 'Managers & Accounts', value: `${totalManagers} / ${totalAccountants}`, change: 'Auditing staff', isPositive: true, timeframe: 'active staff', color: 'purple' },
    { id: 'total-patients', title: 'Registered Patients', value: totalPatients.toString(), change: 'Registered', isPositive: true, timeframe: 'active logs', color: 'blue' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
          System Directories
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage system administrators, emergency dispatchers, and registered patient credentials.
        </p>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* User management Table component */}
      <div className="pt-2">
        <UserManagementTable 
          users={users}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
}
