import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import type { AuthResponse, Role } from '../types';

type AuthState = {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem('financeflow_user');
    return stored ? (JSON.parse(stored) as AuthResponse) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('financeflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('financeflow_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
      localStorage.setItem('financeflow_access_token', data.accessToken);
      localStorage.setItem('financeflow_refresh_token', data.refreshToken);
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore network issues during logout
    }
    localStorage.removeItem('financeflow_access_token');
    localStorage.removeItem('financeflow_refresh_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function hasRole(user: AuthResponse | null, roles: Role[]) {
  return !!user && roles.includes(user.role);
}
