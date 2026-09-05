import React, { useState } from 'react';
import { Plane, ShieldAlert } from 'lucide-react';
import BorderSuite from './BorderSuite';
import CyberSuite from './cyber/App';

const SUITES = [
  { id: 'border', label: 'Border Screening', sub: 'Govt. Identity & Document Screening', Icon: Plane },
  { id: 'cyber', label: 'Cyber Defense', sub: 'Scan SMS · URLs · QR/UPI · APKs', Icon: ShieldAlert },
];

export default function App() {
  const [suite, setSuite] = useState(() => localStorage.getItem('aegis_suite') || 'border');

  const chooseSuite = (id) => {
    setSuite(id);
    localStorage.setItem('aegis_suite', id);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0E1A]/95 backdrop-blur-xl px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-cyan-500/20">
              A
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-100 tracking-wide">AEGISBORDER AI</div>
              <div className="text-[10px] text-slate-400 font-mono">Unified Border & Cyber Intelligence Suite</div>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-white/5 rounded-2xl p-1 border border-white/10">
            {SUITES.map(({ id, label, sub, Icon }) => (
              <button
                key={id}
                onClick={() => chooseSuite(id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2 text-left transition-all ${
                  suite === id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                    : 'border border-transparent hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${suite === id ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>
                  <span className={`block text-[12px] font-semibold leading-none ${suite === id ? 'text-cyan-200' : 'text-slate-300'}`}>
                    {label}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-1">{sub}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative">
        {suite === 'border' && <BorderSuite />}
        {suite === 'cyber' && <CyberSuite />}
      </main>
    </div>
  );
}