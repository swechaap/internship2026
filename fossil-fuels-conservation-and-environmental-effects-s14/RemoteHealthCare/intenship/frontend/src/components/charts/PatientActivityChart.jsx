import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function PatientActivityChart({ data }) {
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
          <h3 className="font-bold text-slate-800 text-sm">Patient Activity Trend</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Monthly hospital admissions (Inpatient vs Outpatient)</p>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200">
          <span className="bg-white px-2 py-1 rounded shadow-sm text-blue-600">7 Months</span>
          <span className="px-2 py-1 cursor-pointer hover:text-slate-800">1 Year</span>
        </div>
      </div>
      
      <div className="h-72 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
            <Line 
              type="monotone" 
              dataKey="outpatient" 
              name="Outpatients" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              activeDot={{ r: 6 }} 
              dot={{ strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="inpatient" 
              name="Inpatients" 
              stroke="#10b981" 
              strokeWidth={3} 
              activeDot={{ r: 6 }} 
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
