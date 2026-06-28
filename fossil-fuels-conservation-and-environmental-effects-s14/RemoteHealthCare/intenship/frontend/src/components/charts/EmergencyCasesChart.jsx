import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ShieldAlert } from 'lucide-react';

export default function EmergencyCasesChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-850 text-xs font-medium space-y-1">
          <p className="font-bold text-slate-300">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || item.fill }}>
              {item.name}: {item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Emergency Dispatches</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Volume of daily emergency dispatches by type</p>
        </div>
        <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
      </div>

      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="cardiac" name="Cardiac" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="trauma" name="Trauma" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="stroke" name="Stroke" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
