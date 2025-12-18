import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Home } from 'lucide-react';

// Import Page Components
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';

function App() {
  const location = useLocation();

  // Helper to highlight the active tab
  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500 selection:text-black flex flex-col">
      
      {/* Background Cyber Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Navbar */}
      <nav className="relative z-20 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Shield className="text-emerald-500 w-8 h-8 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div>
            <div className="font-black text-xl text-white tracking-widest flex items-center gap-2">
              ECEBIP <span className="text-emerald-500 text-xs border border-emerald-500 px-1 rounded">PRO</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              G.V. Acharya Institute of Eng. & Tech.
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
          <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive('/')}`}>
             <Home size={18} /> 
             <span>SCANNER HOME</span>
          </Link>
          
          <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive('/dashboard')}`}>
             <LayoutDashboard size={18} /> 
             <span>THREAT DASHBOARD</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area - Handles Page Switching */}
      <div className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#020617] py-8 text-center mt-auto">
        <div className="text-slate-500 text-sm mb-2 font-medium">
          Project Group: Fardeen Akmal, Jigisha Naidu, Sushil Nirmal, Suvajit Ghosh
        </div>
        <div className="text-xs text-slate-600 font-mono">
          Compliance: DPDP Act 2023 | ISO 27001 | SHA-256 Encryption Standard
        </div>
      </footer>
    </div>
  );
}

export default App;
