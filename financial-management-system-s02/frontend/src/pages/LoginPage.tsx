import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../state/auth';
import { useToast } from '../state/toast';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginPage() {
  const [email, setEmail] = useState('admin@financeflow.com');
  const [password, setPassword] = useState('Admin@123');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { push } = useToast();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      push({ title: 'Check credentials', message: parsed.error.issues[0]?.message, tone: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      push({ title: 'Signed in', message: 'Welcome to FinanceFlow AI', tone: 'success' });
    } catch (error) {
      push({ title: 'Login failed', message: 'Invalid credentials or backend unavailable', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="glass-card grid w-full max-w-6xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_30%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">FinanceFlow AI</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Manage expenses, budgets, approvals, and AI insights in one system.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">Built for accountants, managers, and admins with live dashboards, OCR-ready receipts, role-based access, and AI support.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Role-based', 'Secure access control'],
                ['OCR ready', 'Receipt extraction flow'],
                ['AI assistant', 'Gemini-connected chat'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-line bg-panel p-4">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-line bg-panel p-8 sm:p-10 lg:border-l lg:border-t-0">
          <div className="max-w-md">
            <p className="text-sm uppercase tracking-[0.25em] text-muted">Sign in</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted">Use the seeded demo accounts to explore the app.</p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <div>
              <label className="label-text" htmlFor="email">Email</label>
              <input id="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@financeflow.com" />
            </div>
            <div>
              <label className="label-text" htmlFor="password">Password</label>
              <input id="password" type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button className="primary-button w-full py-3" disabled={submitting} type="submit">
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 rounded-3xl border border-line bg-slate-500/5 p-5 text-sm">
            <p className="font-semibold">Demo accounts</p>
            <div className="mt-3 grid gap-3 text-muted">
              <p>Admin: admin@financeflow.com / Admin@123</p>
              <p>Manager: manager@financeflow.com / Manager@123</p>
              <p>Accountant: accountant@financeflow.com / Accountant@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
