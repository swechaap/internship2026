import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Expense } from '../types';

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    api.get<Expense[]>('/api/expenses').then((response) => setExpenses(response.data)).catch(() => setExpenses([]));
  }, []);

  return (
    <div className="glass-card rounded-[2rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Expense management</p>
          <h2 className="mt-2 text-2xl font-semibold">All expenses</h2>
        </div>
        <button className="primary-button" type="button">Create expense</button>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-line">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-500/5 text-left">
            <tr>
              {['Code', 'Title', 'Department', 'Amount', 'Status'].map((head) => (
                <th key={head} className="px-4 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-panel">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-4 py-3">{expense.expenseCode}</td>
                <td className="px-4 py-3">{expense.title}</td>
                <td className="px-4 py-3">{expense.department}</td>
                <td className="px-4 py-3">₹{expense.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{expense.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
