import { useEffect, useState } from 'react';
import api from '../lib/api';
import { MetricCard } from '../components/MetricCard';
import { Skeleton } from '../components/Skeleton';
import type { DashboardSummary } from '../types';

export function DashboardPage({ role }: { role: 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' }) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.get<DashboardSummary>(`/api/dashboard/${role.toLowerCase()}`).then((response) => setSummary(response.data)).catch(() => setSummary(null));
  }, [role]);

  const title = role === 'ADMIN' ? 'Admin Dashboard' : role === 'MANAGER' ? 'Manager Dashboard' : 'Accountant Dashboard';
  const highlights = role === 'ADMIN'
    ? ['Total users', 'Expenses overview', 'Pending approvals', 'Audit trail']
    : role === 'MANAGER'
      ? ['Pending approvals', 'Budget utilization', 'Department analytics', 'Expense review']
      : ['Submitted expenses', 'Pending expenses', 'Approved expenses', 'Recent activity'];

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">{title}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Operational visibility for finance teams</h2>
        <p className="mt-3 max-w-3xl text-muted">Use the seeded data and live API endpoints to monitor expenses, approvals, and AI-powered insights.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {highlights.map((item) => (
            <span key={item} className="rounded-full border border-line bg-panel px-4 py-2 text-sm">{item}</span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary ? (
          <>
            <MetricCard label="Users" value={String(summary.totalUsers)} hint="Active members" />
            <MetricCard label="Expenses" value={String(summary.totalExpenses)} hint="All tracked records" />
            <MetricCard label="Pending" value={String(summary.pendingApprovals)} hint="Awaiting review" />
            <MetricCard label="Budget Utilization" value={`${summary.budgetUtilizationPercent.toFixed(1)}%`} hint="Current spend vs allocation" />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Recent activity</h3>
          <div className="mt-4 space-y-3">
            {(summary?.recentItems ?? ['Loading audit trail...']).map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-slate-500/5 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold">AI-ready summary</h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            This area can show monthly summaries, budget utilization warnings, and department spending insights powered by the backend chat and reporting services.
          </p>
        </div>
      </section>
    </div>
  );
}
