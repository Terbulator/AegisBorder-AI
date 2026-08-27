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
    { label: "SBI Phishing Page", url: "http://sbi-bank-kyc-update.top/login.php" },
    { label: "Legitimate SBI", url: "https://onlinesbi.sbi" },
    { label: "Fake Jio 5G Recharge", url: "http://free-recharge-jio-5g.live" },
    { label: "Legitimate HDFC", url: "https://hdfcbank.com" }
  ];

  const handleScan = (urlToScan = inputUrl) => {
    if (!urlToScan.trim()) return;
    const res = inspectUrl(urlToScan, currentLang);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/12 text-sky-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Link Safety Check
            </h3>
            <p className="text-xs text-slate-400">
              Enter any website link to check if it's legitimate or a phishing attempt
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter a website link (e.g. sbi-bank-kyc-update.top)"
            className="w-full p-4 pl-11 rounded-xl bg-black/30 border border-white/[0.08] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-accent/40 focus:ring-1 focus:ring-cyber-accent/20 transition-all font-mono"
          />
          <Globe className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400">Try a sample:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputUrl(s.url);
                handleScan(s.url);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 border border-white/[0.08] transition-colors"
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
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleScan()}
            disabled={!inputUrl.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check Link</span>
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
