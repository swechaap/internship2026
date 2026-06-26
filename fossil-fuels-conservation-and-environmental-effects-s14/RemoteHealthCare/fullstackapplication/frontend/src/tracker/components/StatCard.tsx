import type { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: 'blue' | 'green' | 'gray' | 'red';
}

export function StatCard({ label, value, detail, icon, tone = 'blue' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <h3 className="stat-card__value">{value}</h3>
        <p className="stat-card__detail">{detail}</p>
      </div>
      <div className="stat-card__icon">{icon}</div>
    </article>
  );
}
