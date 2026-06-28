import React from 'react';
import * as Icons from 'lucide-react';

export default function StatCard({ id, title, value, change, isPositive, timeframe, color }) {
  const getIcon = () => {
    switch (id) {
      case 'total-patients':
        return <Icons.Users className="w-6 h-6" />;
      case 'active-emergencies':
        return <Icons.ShieldAlert className="w-6 h-6" />;
      case 'doctors-available':
        return <Icons.Stethoscope className="w-6 h-6" />;
      case 'reports-uploaded':
        return <Icons.FileText className="w-6 h-6" />;
      default:
        return <Icons.Activity className="w-6 h-6" />;
    }
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      glow: 'shadow-blue-500/5',
      accent: 'bg-blue-500'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100',
      glow: 'shadow-red-500/5',
      accent: 'bg-red-500'
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-500/5',
      accent: 'bg-emerald-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'shadow-purple-500/5',
      accent: 'bg-purple-500'
    }
  };

  const currentTheme = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`relative bg-white p-6 rounded-2xl border border-slate-100 shadow-premium ${currentTheme.glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200 overflow-hidden group`}>
      <div className={`absolute top-0 left-0 w-1.5 h-full ${currentTheme.accent}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.text} transition-transform duration-300 group-hover:scale-110`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg 
          ${isPositive 
            ? 'bg-emerald-50 text-emerald-700' 
            : 'bg-red-50 text-red-600'
          }`}
        >
          {isPositive ? (
            <Icons.TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <Icons.TrendingDown className="w-3.5 h-3.5" />
          )}
          {change}
        </span>
        <span className="text-slate-400 font-medium">{timeframe}</span>
      </div>
    </div>
  );
}
