import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, Briefcase, FileText, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const demoStats = [
  { name: 'Jan', compliance: 72 },
  { name: 'Feb', compliance: 78 },
  { name: 'Mar', compliance: 84 },
  { name: 'Apr', compliance: 88 },
  { name: 'May', compliance: 91 },
  { name: 'Jun', compliance: 94 }
];

const deptData = [
  { name: 'Finance', value: 92 },
  { name: 'HR', value: 87 },
  { name: 'IT', value: 95 },
  { name: 'Ops', value: 83 }
];

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rules', label: 'Create Rule', icon: FileText },
  { to: '/assignments', label: 'Assign Rule', icon: Briefcase },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings }
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/15 p-3">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-semibold">GovernanceOS</p>
            <p className="text-sm text-slate-400">Enterprise Compliance Suite</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2">Login</Link>
          <Link to="/register" className="rounded-full bg-blue-600 px-4 py-2 text-white">Register</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              Modern governance for regulated teams
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Governance & Compliance Management System</h1>
              <p className="max-w-2xl text-lg text-slate-400">Automate policy enforcement, track compliance evidence, and monitor department performance in one secure control center.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-600/20">Get Started</Link>
              <Link to="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-200">View Demo</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {['94% Avg Compliance', '24/7 Audit Readiness', 'Role-Based Workflows'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 p-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Compliance Overview</p>
                    <p className="text-3xl font-semibold text-white">92.4%</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">On Track</div>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Line type="monotone" dataKey="compliance" stroke="#38bdf8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Everything needed for modern compliance operations</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Rule Management', 'Create, review, and publish governance rules with deadlines and evidence requirements.'],
              ['Task Assignment', 'Assign policies to departments and users with automated status tracking.'],
              ['Compliance Tracking', 'Monitor progress with live scorecards, charts, and audit-ready metrics.'],
              ['Audit Monitoring', 'Capture activity logs and respond to findings with confidence.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-4 h-10 w-10 rounded-2xl bg-blue-500/15" />
                <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 GovernanceOS</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthLayout({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/15 p-3"><ShieldCheck className="h-6 w-6 text-blue-400" /></div>
          <div>
            <p className="text-lg font-semibold">GovernanceOS</p>
            <p className="text-sm text-slate-400">{title}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const token = localStorage.getItem('jwt_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('jwt_token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Secure sign in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button disabled={loading} className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <a href="#" className="hover:text-white">Forgot password?</a>
          <Link to="/register" className="hover:text-white">Create account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', department: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        department: form.department,
        password: form.password,
        role: 'user'
      });
      localStorage.setItem('jwt_token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="confirmPassword" placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={handleChange} />
        <button disabled={loading} className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-60">{loading ? 'Creating account...' : 'Register'}</button>
        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
      </form>
    </AuthLayout>
  );
}

function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur transition md:static md:translate-x-0`}>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/15 p-3"><ShieldCheck className="h-6 w-6 text-blue-400" /></div>
            <div>
              <p className="font-semibold">GovernanceOS</p>
              <p className="text-sm text-slate-400">Admin Center</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={label} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-400">
            <p className="font-medium text-white">Need a compliance review?</p>
            <p className="mt-1">Use the dashboard to monitor status, route tasks, and export reports.</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-white/10 p-2 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu className="h-5 w-5" /></button>
              <div>
                <p className="text-sm text-slate-400">Good morning</p>
                <h2 className="text-lg font-semibold">Compliance Control Center</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-white/10 bg-slate-800 px-3 py-2 text-sm">Admin • Alex</div>
              <button className="rounded-full border border-white/10 p-2" onClick={handleLogout}><LogOut className="h-5 w-5" /></button>
            </div>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [rules, setRules] = useState([]);
  const [reports, setReports] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [rulesResponse, reportsResponse, analyticsResponse, notificationsResponse, auditResponse] = await Promise.all([
          api.get('/rules'),
          api.get('/reports'),
          api.get('/reports/analytics'),
          api.get('/notifications'),
          api.get('/audit-logs')
        ]);
        setRules(rulesResponse.data || []);
        setReports(reportsResponse.data || null);
        setAnalytics(analyticsResponse.data || null);
        setNotifications(notificationsResponse.data || []);
        setLogs(auditResponse.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const overview = useMemo(() => [
    { label: 'Total Rules', value: String(rules.length), accent: 'from-blue-500 to-cyan-500' },
    { label: 'Notifications', value: String(notifications.length), accent: 'from-violet-500 to-fuchsia-500' },
    { label: 'Audit Logs', value: String(logs.length), accent: 'from-amber-500 to-orange-500' },
    { label: 'Compliance Trend', value: analytics?.trend?.[analytics.trend.length - 1]?.compliance ? `${analytics.trend[analytics.trend.length - 1].compliance}%` : 'Live', accent: 'from-emerald-500 to-lime-500' }
  ], [analytics, logs.length, notifications.length, rules.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.map((card) => (
          <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40">
            <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Compliance Trend</h3>
              <p className="text-sm text-slate-400">Month over month performance</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trend || demoStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="compliance" stroke="#60a5fa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Department Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reports?.departments || deptData} dataKey="compliance" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  <Cell fill="#38bdf8" />
                  <Cell fill="#818cf8" />
                  <Cell fill="#34d399" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Activities</h3>
          <div className="space-y-3">
            {logs.slice(0, 4).map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-3 text-sm text-slate-300">{entry.action} • {entry.performed_by}</div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Weekly Notifications</h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-3 text-sm text-slate-300">{notification.message}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RulesPage() {
  const [form, setForm] = useState({ title: '', description: '', department: '', priority: '', deadline: '', attachment: '' });
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRules = async () => {
    try {
      const response = await api.get('/rules');
      setRules(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/rules/create', form);
      setMessage('Rule created successfully');
      setForm({ title: '', description: '', department: '', priority: '', deadline: '', attachment: '' });
      fetchRules();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Unable to create rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="text-2xl font-semibold text-white">Create Rule</h2>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="title" placeholder="Rule Title" value={form.title} onChange={handleChange} />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="priority" placeholder="Priority" value={form.priority} onChange={handleChange} />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="deadline" placeholder="Deadline" type="date" value={form.deadline} onChange={handleChange} />
        <textarea className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="description" placeholder="Description" rows="4" value={form.description} onChange={handleChange} />
        <input className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="attachment" placeholder="Attachment" value={form.attachment} onChange={handleChange} />
        <div className="md:col-span-2 flex gap-4">
          <button disabled={loading} className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-60">{loading ? 'Saving...' : 'Save Rule'}</button>
          <button type="button" className="rounded-2xl border border-slate-700 px-5 py-3 text-slate-300">Cancel</button>
        </div>
        {message ? <p className="md:col-span-2 text-sm text-emerald-300">{message}</p> : null}
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800 text-left text-slate-300">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Department</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-t border-white/10 bg-slate-900/70">
                <td className="p-3">{rule.title}</td>
                <td className="p-3">{rule.department}</td>
                <td className="p-3">{rule.priority}</td>
                <td className="p-3">{rule.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssignmentsPage() {
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ rule_id: '', user_id: '', status: 'pending' });
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [rulesResponse, tasksResponse] = await Promise.all([api.get('/rules'), api.get('/assignments/my-tasks')]);
      setRules(rulesResponse.data || []);
      setTasks(tasksResponse.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/assignments/assign', {
        rule_id: Number(form.rule_id),
        user_id: Number(form.user_id),
        status: form.status
      });
      setMessage('Rule assigned successfully');
      setForm({ rule_id: '', user_id: '', status: 'pending' });
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Unable to assign rule');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (assignmentId) => {
    if (!proof) {
      setMessage('Select a proof file first');
      return;
    }
    const formData = new FormData();
    formData.append('assignment_id', String(assignmentId));
    formData.append('proof_file', proof);
    try {
      await api.post('/assignments/upload-proof', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Proof uploaded successfully');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Unable to upload proof');
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="text-2xl font-semibold text-white">Assign Rule</h2>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <select className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="rule_id" value={form.rule_id} onChange={handleChange}>
          <option value="">Choose Rule</option>
          {rules.map((rule) => <option key={rule.id} value={rule.id}>{rule.title}</option>)}
        </select>
        <select className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" name="user_id" value={form.user_id} onChange={handleChange}>
          <option value="">Select User</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
        </select>
        <select className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 md:col-span-2" name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="completed">Completed</option>
        </select>
        <button disabled={loading} className="md:col-span-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-60">{loading ? 'Assigning...' : 'Assign Rule'}</button>
        {message ? <p className="md:col-span-2 text-sm text-emerald-300">{message}</p> : null}
      </form>

      <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
        <h3 className="mb-4 text-lg font-semibold text-white">My Tasks</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">Rule #{task.rule_id}</p>
                  <p className="text-sm text-slate-400">Status: {task.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="file" onChange={(event) => setProof(event.target.files[0])} />
                  <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => handleUpload(task.id)}>Upload Proof</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">Users Management</h2>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800 text-left text-slate-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Compliance</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ava Chen', 'Finance', 'Admin', '96%'],
              ['Luis Gomez', 'IT', 'User', '92%'],
              ['Noor Ali', 'HR', 'User', '89%']
            ].map(([name, department, role, compliance]) => (
              <tr key={name} className="border-t border-white/10 bg-slate-900/70">
                <td className="p-3">{name}</td>
                <td className="p-3">{department}</td>
                <td className="p-3">{role}</td>
                <td className="p-3">{compliance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 p-4">
            <p className="text-slate-300">{notification.message}</p>
            <span className={`rounded-full px-3 py-1 text-xs ${notification.read_status ? 'bg-slate-700 text-slate-300' : 'bg-blue-500/15 text-blue-300'}`}>{notification.read_status ? 'read' : 'unread'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile Settings</h2>
      <form className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Name" />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Email" />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Department" />
        <input className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" placeholder="Password" type="password" />
        <button className="md:col-span-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white">Update Profile</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardShell><DashboardPage /></DashboardShell>} />
        <Route path="/rules" element={<DashboardShell><RulesPage /></DashboardShell>} />
        <Route path="/assignments" element={<DashboardShell><AssignmentsPage /></DashboardShell>} />
        <Route path="/users" element={<DashboardShell><UsersPage /></DashboardShell>} />
        <Route path="/notifications" element={<DashboardShell><NotificationsPage /></DashboardShell>} />
        <Route path="/settings" element={<DashboardShell><SettingsPage /></DashboardShell>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
