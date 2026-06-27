import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Budget } from '../types';

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    api.get<Budget[]>('/api/budgets').then((response) => setBudgets(response.data)).catch(() => setBudgets([]));
  }, []);

  return (
    <div className="glass-card rounded-[2rem] p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Budget management</p>
      <h2 className="mt-2 text-2xl font-semibold">Budgets and utilization</h2>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {budgets.map((budget) => (
          <div key={budget.id} className="rounded-3xl border border-line bg-slate-500/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{budget.budgetName}</p>
                <p className="text-sm text-muted">{budget.department}</p>
              </div>
              <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-primary">
                ₹{budget.usedAmount.toLocaleString()} used
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-500/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (budget.usedAmount / budget.allocatedAmount) * 100)}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-muted">
              <div>Allocated<br /><span className="text-text">₹{budget.allocatedAmount.toLocaleString()}</span></div>
              <div>Used<br /><span className="text-text">₹{budget.usedAmount.toLocaleString()}</span></div>
              <div>Remaining<br /><span className="text-text">₹{budget.remainingAmount.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
