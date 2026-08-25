import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, AlertOctagon, Sparkles, ExternalLink } from 'lucide-react';
import { inspectUrl } from '../engine/urlDetector';
import RiskResultCard from './RiskResultCard';

export default function UrlScanner({ 
  currentLang, 
  onOpenSandbox, 
  onOpenReport, 
  onMintBlock,
  initialUrl = '' 
}) {
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [result, setResult] = useState(null);

  const sampleUrls = [
    { label: "SBI Typosquat Phishing", url: "http://sbi-bank-kyc-update.top/login.php" },
    { label: "Legitimate SBI Portal", url: "https://onlinesbi.sbi" },
    { label: "Fake Jio 5G Recharge", url: "http://free-recharge-jio-5g.live" },
    { label: "Legitimate HDFC Bank", url: "https://hdfcbank.com" }
  ];

  const handleScan = (urlToScan = inputUrl) => {
    if (!urlToScan.trim()) return;
    const res = inspectUrl(urlToScan, currentLang);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Banking & Phishing URL Inspector
            </h3>
            <p className="text-xs text-slate-400">
              Levenshtein Distance against Indian Banks, Homograph / Punycode & Risky TLD Parser
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter web link (e.g. sbi-bank-kyc-update.top or onlinesbi.sbi)"
            className="w-full p-4 pl-11 rounded-2xl bg-black/40 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-mono"
          />
          <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400 font-mono">Test Links:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputUrl(s.url);
                handleScan(s.url);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Scan Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setInputUrl('');
              setResult(null);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleScan()}
            disabled={!inputUrl.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Search className="w-4 h-4" />
            <span>Verify Domain Security</span>
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenSandbox={onOpenSandbox}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}

    </div>
  );
}
