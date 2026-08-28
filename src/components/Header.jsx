import React from 'react';
import { Globe, ShieldCheck, Wifi, WifiOff, Database, Sun, Moon } from 'lucide-react';
import { SUPPORTED_LANGUAGES, REGIONAL_STRINGS } from '../engine/regionalDictionary';

export default function Header({
  currentLang,
  onLanguageChange,
  isOfflineMode,
  onToggleOffline,
  bloomStats,
  onOpenLedger,
  theme = 'light',
  onToggleTheme
}) {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3.5 transition-colors duration-150">
      <div className="flex items-center justify-between gap-4">

        {/* Left — Reassuring Plain Tagline */}
        <div className="hidden md:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            {currentLang === 'hi'
              ? 'रक्षक AI • डिजिटल फ्रॉड और फर्जी मैसेज से सुरक्षित रहें'
              : 'Rakshak AI • 24/7 Digital Scam Protection Shield'}
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 ml-auto">

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-medium)] transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Offline / Online Mode */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isOfflineMode
                ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
            }`}
            title="Switch between Offline On-Device Protection and Live Sync"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline Safe</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Protection</span>
              </>
            )}
          </button>

          {/* Protected Database Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <Database className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span><strong className="text-[var(--text-primary)] font-bold">50,000+</strong> Known Scams</span>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] font-medium">
              <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent border-none text-xs text-[var(--text-primary)] font-semibold focus:ring-0 focus:outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
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
