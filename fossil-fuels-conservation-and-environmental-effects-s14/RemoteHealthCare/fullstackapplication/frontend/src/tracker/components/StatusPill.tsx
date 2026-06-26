import type { AmbulanceStatus, EventTone, RequestStatus } from '../types';

interface StatusPillProps {
  status: AmbulanceStatus | RequestStatus | EventTone;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Available: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  Busy: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
  Offline: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30',
  Requested: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30',
  Assigned: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30',
  'On The Way': 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30',
  'Near Patient': 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30',
  'Patient Picked Up': 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30',
  'Heading To Hospital': 'bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-400/30',
  'Reached Hospital': 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  Completed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  critical: 'bg-red-500/15 text-red-300 ring-1 ring-red-400/30',
  warning: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
  info: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30',
  success: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
};

export function StatusPill({ status, className = '' }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles[status] ?? 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30'} ${className}`.trim()}>
      {status}
    </span>
  );
}
