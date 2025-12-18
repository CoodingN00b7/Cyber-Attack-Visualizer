import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, AlertTriangle, Server, ShieldAlert, 
  Landmark, CreditCard, Database, Zap
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';

// --- MOCK DATA: INDIAN CYBER THREAT LANDSCAPE ---
const INDIA_REGIONAL_DATA = [
  { name: 'MH', attacks: 4500 }, { name: 'DL', attacks: 3200 },
  { name: 'KA', attacks: 2800 }, { name: 'TN', attacks: 2100 },
  { name: 'UP', attacks: 1900 }, { name: 'GJ', attacks: 1500 },
];

const ATTACK_VECTORS = [
  {
    id: 1,
    title: "Ransomware (Targeting Critical Infra)",
    severity: "CRITICAL",
    impact: "High operational disruption in Power & Healthcare sectors. Data encryption and extortion.",
    icon: <Database size={24} className="text-red-500" />,
    trendColor: "#ef4444", // red
    trendData: [10, 25, 40, 35, 50, 65, 80]
  },
  {
    id: 2,
    title: "Financial Phishing & UPI Fraud",
    severity: "HIGH",
    impact: "Widespread financial loss among citizens. SMS/Email lures targeting banking credentials.",
    icon: <CreditCard size={24} className="text-amber-500" />,
    trendColor: "#f59e0b", // amber
    trendData: [60, 55, 70, 65, 80, 75, 90]
  },
  {
    id: 3,
    title: "State-Sponsored Espionage (APT)",
    severity: "CRITICAL",
    impact: "Data theft from government and defense sectors. Long-term stealth network infiltration.",
    icon: <Landmark size={24} className="text-emerald-500" />,
    trendColor: "#10b981", // emerald
    trendData: [20, 20, 25, 25, 30, 35, 40]
  },
  {
    id: 4,
    title: "DDoS Attacks (Volumetric)",
    severity: "MEDIUM",
    impact: "Service outages for e-governance portals and telecom providers during peak times.",
    icon: <Server size={24} className="text-blue-500" />,
    trendColor: "#3b82f6", // blue
    trendData: [30, 80, 20, 90, 40, 70, 50]
  },
  {
    id: 5,
    title: "IoT Botnet Activity",
    severity: "RISING",
    impact: "Compromise of smart devices (cameras, routers) used to launch secondary attacks.",
    icon: <Zap size={24} className="text-purple-500" />,
    trendColor: "#a855f7", // purple
    trendData: [15, 25, 35, 45, 55, 65, 75]
  },
  {
    id: 6,
    title: "Supply Chain Compromise",
    severity: "HIGH",
    impact: "Malware introduced via third-party software vendors affecting multiple downstream organizations.",
    icon: <ShieldAlert size={24} className="text-red-400" />,
    trendColor: "#f87171", // light red
    trendData: [5, 10, 8, 20, 15, 30, 45]
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const DashboardPage = () => {
  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="pt-24 pb-12 px-4 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 mb-2">
            <Activity className="text-emerald-500" />
            INDIA THREAT LANDSCAPE
          </h1>
          <p className="text-slate-400 text-lg">Real-time analysis of cyber vectors affecting the Indian subcontinent.</p>
        </div>
        <div className="mt-6 md:mt-0 inline-flex items-center px-4 py-2 border rounded-xl border-red-500/30 bg-red-500/10 text-red-400 text-sm font-mono tracking-wider animate-pulse">
          <AlertTriangle size={16} className="mr-2" /> NATIONAL ALERT LEVEL: ELEVATED
        </div>
      </motion.div>

      {/* Top Summary Section (Regional Heatmap Simulation) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
         <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Server size={18} className="text-blue-400"/> Attacks by Region (Last 24h)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={INDIA_REGIONAL_DATA}>
                 <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff'}} cursor={{fill: '#1e293b'}} />
                 <Bar dataKey="attacks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center">
            <h3 className="text-slate-400 font-medium mb-2">Total Incidents Reported (YTD)</h3>
            <div className="text-5xl font-mono font-black text-white mb-4">1,240,592</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1">
              <Activity size={14} /> +12% increase from previous quarter
            </div>
         </div>
      </motion.div>


      {/* Main Attack Vector Grid (The requested UI style) */}
      <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-emerald-500">Active Threat Vectors & Severity</h2>
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ATTACK_VECTORS.map((attack) => (
          <motion.div 
            key={attack.id} 
            variants={itemVariants}
            className={`bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-${attack.severity === 'CRITICAL' ? 'red' : attack.severity === 'HIGH' ? 'amber' : 'emerald'}-500/30 transition-all group relative overflow-hidden`}
          >
            {/* Cyber Grid Background Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${attack.trendColor} 1px, transparent 0)`, backgroundSize: '20px 20px' }}>
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-${attack.severity === 'CRITICAL' ? 'red' : 'amber'}-500/50 transition-colors`}>
                  {attack.icon}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{attack.title}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                attack.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                attack.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                attack.severity === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                'bg-purple-500/10 text-purple-500 border-purple-500/20'
              }`}>
                {attack.severity}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-6 h-16 relative z-10">{attack.impact}</p>

            {/* Mini Trend Chart within Card */}
            <div className="h-20 relative z-10">
               <div className="text-xs text-slate-500 mb-1 flex justify-between">
                 <span>7-Day Trend</span>
                 <span style={{ color: attack.trendColor }}>Live Activity</span>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attack.trendData.map((val, i) => ({ name: i, value: val }))}>
                    <defs>
                      <linearGradient id={`color-${attack.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={attack.trendColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={attack.trendColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={attack.trendColor} strokeWidth={2} fillOpacity={1} fill={`url(#color-${attack.id})`} dot={false} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;