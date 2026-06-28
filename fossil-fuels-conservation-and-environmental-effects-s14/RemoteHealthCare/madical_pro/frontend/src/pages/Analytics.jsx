import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const recoveryData = [
  { month: 'Jan', score: 60, recovery: 30 },
  { month: 'Feb', score: 65, recovery: 40 },
  { month: 'Mar', score: 75, recovery: 60 },
  { month: 'Apr', score: 85, recovery: 80 },
  { month: 'May', score: 90, recovery: 95 },
];

const diseaseDistribution = [
  { name: 'Diabetes', value: 400 },
  { name: 'Heart Disease', value: 300 },
  { name: 'Hypertension', value: 300 },
  { name: 'Asthma', value: 200 },
];

const COLORS = ['#00E5FF', '#3B82F6', '#10B981', '#F59E0B'];

const treatmentStatus = [
  { name: 'Completed', count: 12 },
  { name: 'Ongoing', count: 5 },
  { name: 'Pending', count: 3 },
];

export default function Analytics() {
  return (
    <div className="flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan/20 to-transparent p-8 rounded-2xl border border-cyan/20 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">Health Analytics</h1>
          <p className="text-gray-300 text-lg">Track your recovery progress and health metrics.</p>
        </div>
        <div className="text-center bg-black/40 p-6 rounded-2xl border border-cyan/30">
           <div className="text-5xl font-bold text-cyan mb-2">90/100</div>
           <div className="text-gray-400 uppercase tracking-widest text-sm">Overall Health Score</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recovery Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#00E5FF" strokeWidth={3} dot={{ r: 6, fill: '#00E5FF' }} />
                <Line type="monotone" dataKey="recovery" stroke="#10B981" strokeWidth={3} dot={{ r: 6, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Disease Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             {diseaseDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-400">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   {entry.name}
                </div>
             ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-2xl p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-white mb-6">Treatment Status</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                <RechartsTooltip cursor={{fill: '#374151', opacity: 0.4}} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#00E5FF" radius={[0, 4, 4, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
