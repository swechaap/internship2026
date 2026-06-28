import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { FileSpreadsheet } from 'lucide-react';

export default function RecordTypesPieChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-850 text-xs font-medium space-y-1">
          <p className="font-bold text-slate-300">{item.name}</p>
          <p style={{ color: item.payload.color || item.fill }}>
            Files: {item.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalFiles = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Record Classification</h3>
          <p className="text-[10px] text-slate-400 font-semibold">Percentage distribution of document uploads</p>
        </div>
        <FileSpreadsheet className="w-4 h-4 text-slate-400" />
      </div>

      <div className="h-56 w-full flex items-center justify-center text-xs relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
          <span className="text-xl font-black text-slate-800">{totalFiles.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Files Total</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold">
        {data.map((type) => (
          <div key={type.name} className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: type.color }} />
            <span className="truncate">{type.name} ({Math.round((type.value / totalFiles) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
