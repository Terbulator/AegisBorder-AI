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
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-cyber-dark/60 backdrop-blur-2xl px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-accent/15 to-cyber-neon/20 border border-cyber-accent/25 text-cyber-accent transition-all duration-500 group-hover:border-cyber-accent/40">
            <Shield className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-cyber-dark" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              <span className="cyber-gradient-text">Rakshak AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
              {REGIONAL_STRINGS.tagline[currentLang] || REGIONAL_STRINGS.tagline.en}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Offline / Online Toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border ${
              isOfflineMode
                ? 'bg-amber-500/8 border-amber-500/25 text-amber-300 hover:bg-amber-500/15'
                : 'bg-emerald-500/8 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/15'
            }`}
            title="Toggle between offline protection and live sync"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Protection</span>
              </>
            )}
          </button>

          {/* Bloom Filter Micro Pill — simplified */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-400">
            <Cpu className="w-3 h-3 text-cyber-accent" />
            <span><strong className="text-slate-200">{(bloomStats.sizeBytes / 1024).toFixed(1)} KB</strong> protected</span>
          </div>

          {/* PoA Ledger Button */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-all duration-300 hover:border-cyber-neon/30 hover:text-white"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-accent opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-accent"></span>
            </span>
            <span>Threat Ledger</span>
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white transition-all duration-300 group-hover:border-cyber-accent/30">
              <Globe className="w-3.5 h-3.5 text-cyber-accent" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:ring-0 focus:outline-none cursor-pointer pr-1 font-medium appearance-none"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-cyber-dark text-white">
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
