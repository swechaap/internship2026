import { BarChart3, Bot, FileText, LayoutDashboard, LogOut, MoonStar, ReceiptText, SunMedium, Wallet } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/auth';
import { useEffect, useState } from 'react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText },
  { to: '/budgets', label: 'Budgets', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/chat', label: 'AI Assistant', icon: Bot },
  { to: '/audit', label: 'Audit Logs', icon: FileText },
];

export function Shell() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('financeflow_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const stored = localStorage.getItem('financeflow_theme');
    if (stored === 'dark') setDark(true);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-line bg-panel p-5 backdrop-blur xl:p-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold">FinanceFlow AI</p>
              <p className="text-sm text-muted">{user?.role} workspace</p>
            </div>
          </Link>

          <nav className="mt-8 space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-primary text-white shadow-glow' : 'text-text hover:bg-slate-500/5',
                  ].join(' ')
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-line bg-slate-500/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Signed in as</p>
            <p className="mt-2 font-semibold">{user?.fullName}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </aside>

        <main className="flex min-h-screen flex-col gap-5 p-4 sm:p-6 xl:p-8">
          <header className="glass-card flex flex-col gap-4 rounded-3xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">AI-powered finance operations</p>
              <h1 className="mt-1 text-2xl font-semibold">FinanceFlow AI</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="soft-button" onClick={() => setDark((value) => !value)} type="button">
                {dark ? <SunMedium size={16} className="mr-2" /> : <MoonStar size={16} className="mr-2" />}
                {dark ? 'Light' : 'Dark'} mode
              </button>
              <button className="soft-button" onClick={logout} type="button">
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
