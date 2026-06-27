import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import api from '../lib/api';
import type { ReportResponse } from '../types';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ReportsPage() {
  const [report, setReport] = useState<ReportResponse | null>(null);

  useEffect(() => {
    api.get<ReportResponse>('/api/reports').then((response) => setReport(response.data)).catch(() => setReport(null));
  }, []);

  const categoryLabels = Object.keys(report?.byCategory ?? {});
  const categoryValues = Object.values(report?.byCategory ?? {});
  const departmentLabels = Object.keys(report?.byDepartment ?? {});
  const departmentValues = Object.values(report?.byDepartment ?? {});

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Reports module</p>
        <h2 className="mt-2 text-2xl font-semibold">Expense, department, and budget reporting</h2>
        <p className="mt-3 text-sm text-muted">The charts below use live API data where available.</p>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-card rounded-[2rem] p-6">
          <h3 className="text-lg font-semibold">Category spending</h3>
          <div className="mt-4">
            <Pie data={{ labels: categoryLabels, datasets: [{ data: categoryValues, backgroundColor: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#0f172a'] }] }} />
          </div>
        </section>
        <section className="glass-card rounded-[2rem] p-6">
          <h3 className="text-lg font-semibold">Department spending</h3>
          <div className="mt-4">
            <Bar data={{ labels: departmentLabels, datasets: [{ label: 'Spend', data: departmentValues, backgroundColor: '#2563eb' }] }} />
          </div>
        </section>
      </div>
      <section className="glass-card rounded-[2rem] p-6">
        <h3 className="text-lg font-semibold">Export</h3>
        <p className="mt-2 text-sm text-muted">PDF and Excel export endpoints can be added to the backend report service when you are ready to integrate file generation.</p>
      </section>
    </div>
  );
}
