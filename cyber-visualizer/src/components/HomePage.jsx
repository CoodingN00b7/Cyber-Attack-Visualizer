import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Search, AlertTriangle, Lock, Activity, Globe, 
  Terminal, CheckCircle, Smartphone, Mail, FileDigit, Server, X 
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA FOR CHART ---
const THREAT_DATA = Array.from({ length: 20 }, (_, i) => ({
  name: `T-${i}`,
  threats: Math.floor(Math.random() * 100) + 20,
}));

// --- COMPONENT: SEARCH SECTION WITH TABS ---
const HeroSection = ({ onSearch, isSearching }) => {
  const [input, setInput] = useState('');
  const [searchType, setSearchType] = useState('EMAIL'); 

  const searchOptions = [
    { id: 'EMAIL', label: 'Email', icon: <Mail size={16} /> },
    { id: 'PHONE', label: 'Phone', icon: <Smartphone size={16} /> },
    { id: 'AADHAAR', label: 'Aadhaar', icon: <FileDigit size={16} /> },
    { id: 'PAN', label: 'PAN', icon: <FileDigit size={16} /> },
    { id: 'IP', label: 'IP Addr', icon: <Server size={16} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input, searchType);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-12 text-center px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title Section */}
      <div className="mb-10">
        <div className="inline-flex items-center px-3 py-1 mb-6 border rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wider">
          <span className="w-2 h-2 mr-2 rounded-full bg-emerald-500 animate-pulse"></span>
          SYSTEM ONLINE • MONITORING MAHARASHTRA REGION
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
          CYBER ATTACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">VISUALIZER</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Real-Time Network Threat Mapping & Privacy-Preserving Breach Detection
        </p>
      </div>

      {/* Search Container */}
      <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl shadow-emerald-900/20">
        {/* TABS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {searchOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSearchType(opt.id)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                searchType === opt.id 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500'
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-500 w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder={`Enter target ${searchOptions.find(o => o.id === searchType).label}...`} 
              className="w-full bg-slate-950 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSearching}
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isSearching ? 'SCANNING...' : 'RUN SCAN'}
          </button>
        </form>
      </div>
      
      <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
        <Lock size={12} /> Privacy Protected: SHA-256 k-anonymity enabled. Data remains local.
      </p>
    </div>
  );
};

// --- COMPONENT: STATS GRID ---
const StatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards">
    {/* Card 1 */}
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Activity size={20} /> <span className="font-bold tracking-wide">LIVE THREATS</span>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">REAL-TIME</span>
      </div>
      <div className="h-24 w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={THREAT_DATA}>
              <defs>
                <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff'}} itemStyle={{color: '#10b981'}} />
              <Area type="monotone" dataKey="threats" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorThreat)" />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-colors flex flex-col justify-center">
      <div className="flex items-center gap-2 text-blue-400 mb-2">
        <Globe size={20} /> <span className="font-bold tracking-wide">GLOBAL INDEX</span>
      </div>
      <div className="text-4xl font-mono font-bold text-white mt-2">
        14,205,892
      </div>
      <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full w-[70%] animate-pulse"></div>
      </div>
      <p className="text-xs text-slate-500 mt-2">Records updated: Just now</p>
    </div>

    {/* Card 3 */}
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-colors flex flex-col justify-center">
      <div className="flex items-center gap-2 text-amber-500 mb-2">
        <Terminal size={20} /> <span className="font-bold tracking-wide">LATEST INTELLIGENCE</span>
      </div>
      <div className="p-3 bg-black/40 rounded border border-slate-800 font-mono text-sm text-slate-300 mb-2">
        <div className="flex items-center gap-2 text-emerald-500 mb-1">
          <Terminal size={12} /> <span>Source detected:</span>
        </div>
        <div className="text-white pl-5">Leaked_DB_Maharashtra_Retail.sql</div>
      </div>
      <div className="flex items-center gap-2 mt-1">
         <span className="text-xs text-slate-400">Severity Level:</span>
         <span className="text-xs bg-red-500/20 text-red-500 font-bold px-2 py-0.5 rounded border border-red-500/20">HIGH</span>
      </div>
    </div>
  </div>
);

// --- COMPONENT: RESULTS DISPLAY ---
const ResultCard = ({ result, reset }) => {
  const isSafe = result.status === 'Safe';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className={`relative border-l-4 ${isSafe ? 'border-emerald-500' : 'border-red-500'} bg-slate-900 shadow-2xl rounded-r-xl overflow-hidden`}>
        <button onClick={reset} className="absolute top-4 right-4 text-slate-500 hover:text-white p-2">
          <X size={24} />
        </button>

        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-full ${isSafe ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {isSafe ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {isSafe ? 'No Exposure Found' : 'DATA BREACH DETECTED'}
              </h2>
              <p className="text-slate-400 font-mono text-sm">Target ID: {result.identifier} ({result.type})</p>
            </div>
          </div>
          {!isSafe && (
             <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center min-w-[120px]">
               <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Risk Score</div>
               <div className="text-4xl font-black text-white">{result.severityScore}</div>
             </div>
          )}
        </div>

        {!isSafe && (
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div>
               <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2"><Globe size={16}/> Breach Details</h3>
               <ul className="space-y-3 text-sm text-slate-400">
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                   <span>Source:</span> <span className="text-white font-mono">{result.source}</span>
                 </li>
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                   <span>Date:</span> <span className="text-white font-mono">{result.date}</span>
                 </li>
                 {result.breachedData && (
                   <li className="flex justify-between border-b border-slate-800 pb-2">
                     <span>Leaked Info:</span> <span className="text-red-400">{result.breachedData.join(', ')}</span>
                   </li>
                 )}
               </ul>
            </div>
            <div>
               <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2"><Shield size={16}/> Recommended Actions</h3>
               <div className="space-y-2">
                  <div className="bg-red-500/5 border-l-2 border-red-500 p-2 text-sm text-slate-300">Change password immediately</div>
                  <div className="bg-red-500/5 border-l-2 border-red-500 p-2 text-sm text-slate-300">Enable 2FA on all linked accounts</div>
                  <div className="bg-red-500/5 border-l-2 border-red-500 p-2 text-sm text-slate-300">Report to local cyber cell (Maharashtra)</div>
               </div>
            </div>
          </div>
        )}

        <div className="bg-slate-950 p-4 flex justify-center border-t border-slate-800">
          <button onClick={reset} className="text-emerald-500 hover:text-emerald-400 text-sm font-bold uppercase tracking-widest transition-colors">
            Start New Scan
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: SCANNING ANIMATION ---
const ScanningOverlay = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
    <div className="relative w-32 h-32 mb-8">
      <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping"></div>
      <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
      <Shield className="absolute inset-0 m-auto text-emerald-500 w-12 h-12" />
    </div>
    <div className="font-mono text-emerald-400 text-xl font-bold tracking-widest">INITIALIZING DEEP SCAN...</div>
    <div className="text-slate-500 text-sm mt-2 font-mono">Checking Dark Web Nodes & Public Dumps</div>
  </div>
);

// --- MAIN HOME PAGE COMPONENT ---
const HomePage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  // --- CONNECTED TO BACKEND ---
  const handleSearch = async (identifier, type) => {
    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.status === 'Exposed') {
        setResult({
          status: 'Exposed',
          type: data.type,
          identifier: data.identifier,
          severityScore: data.severityScore,
          source: data.source,
          date: data.date,
          breachedData: data.breachedData || []
        });
      } else {
        setResult({
          status: 'Safe',
          type: type,
          identifier: identifier
        });
      }

    } catch (error) {
      console.error("Scanning Error:", error);
      alert("Error connecting to server. Is the backend running on port 5000?");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSearching && <ScanningOverlay key="scan" />}
      
      {!isSearching && !result && (
        <main key="dashboard">
          <HeroSection onSearch={handleSearch} isSearching={isSearching} />
          <StatsGrid />
        </main>
      )}

      {!isSearching && result && (
        <main key="result" className="pt-20">
            <ResultCard result={result} reset={() => setResult(null)} />
        </main>
      )}
    </AnimatePresence>
  );
}

export default HomePage;