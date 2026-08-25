import React from 'react';
import { Shield, Wifi, WifiOff, Globe, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { SUPPORTED_LANGUAGES, REGIONAL_STRINGS } from '../engine/regionalDictionary';

export default function Header({ 
  currentLang, 
  onLanguageChange, 
  isOfflineMode, 
  onToggleOffline,
  bloomStats,
  onOpenLedger
}) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-cyber-dark/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Shield className="w-6 h-6 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-cyber-dark animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="cyber-gradient-text">RAKSHAK AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono uppercase tracking-wider">
                  BC-01 ON-DEVICE
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {REGIONAL_STRINGS.tagline[currentLang] || REGIONAL_STRINGS.tagline.en}
            </p>
          </div>
        </div>

        {/* Right Controls: Offline Mode, Bloom Stats, Language Switcher, Consortium Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Offline / Online Network Toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isOfflineMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            }`}
            title="Toggle between Zero-Network Local Bloom Filter and Live Consortium Node sync"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline (Local Sub-2ms Filter)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consortium Live Sync</span>
              </>
            )}
          </button>

          {/* Bloom Filter Micro Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bloom: <strong>{(bloomStats.sizeBytes / 1024).toFixed(1)} KB</strong></span>
            <span className="text-slate-600">|</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>&lt;2ms Hash</span>
          </div>

          {/* PoA Consortium Button */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all hover:border-cyan-500/40"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PoA Ledger</span>
          </button>

          {/* Regional Language Switcher */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:ring-0 focus:outline-none cursor-pointer pr-1 font-medium"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
