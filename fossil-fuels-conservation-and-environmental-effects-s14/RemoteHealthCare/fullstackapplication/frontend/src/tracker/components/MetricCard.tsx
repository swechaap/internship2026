import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.24)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-white">{value}</h3>
          <p className="mt-2 text-sm text-slate-300">{detail}</p>
        </div>
        <div className="rounded-2xl bg-red-500/10 p-3 text-red-300 ring-1 ring-red-400/20">{icon}</div>
      </div>
    </article>
  );
}
