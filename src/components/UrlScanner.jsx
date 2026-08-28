import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, Sparkles, Loader2, HelpCircle, AlertCircle } from 'lucide-react';
import { inspectUrl } from '../engine/urlDetector';
import RiskResultCard from './RiskResultCard';

export default function UrlScanner({ 
  currentLang = 'hi', 
  onOpenSandbox, 
  onOpenReport, 
  onMintBlock,
  initialUrl = '' 
}) {
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const sampleUrls = [
    { label: "Fake SBI Bank Link", url: "http://sbi-bank-kyc-update.top/login.php", safe: false },
    { label: "Official SBI Website", url: "https://onlinesbi.sbi", safe: true },
    { label: "Fake Jio 5G Offer", url: "http://free-recharge-jio-5g.live", safe: false },
    { label: "Official HDFC Bank", url: "https://hdfcbank.com", safe: true }
  ];

  const handleScan = (urlToScan = inputUrl) => {
    if (!urlToScan.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const res = inspectUrl(urlToScan, currentLang);
      setResult(res);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Check Website Link (वेबसाइट लिंक की जांच करें)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Enter any link or website to check if it's an official bank site or a fake clone
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste website link here (e.g. sbi-bank-kyc-update.top)"
            className="w-full p-4 pl-11 input-clean text-sm sm:text-base font-mono"
          />
          <Globe className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold text-[var(--text-muted)]">Try an example:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputUrl(s.url);
                handleScan(s.url);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                s.safe
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Scan Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => {
              setInputUrl('');
              setResult(null);
            }}
            className="btn-secondary text-xs"
          >
            Clear
          </button>
          <button
            onClick={() => handleScan()}
            disabled={!inputUrl.trim() || isScanning}
            className="btn-primary text-sm sm:text-base px-6 py-2.5 disabled:opacity-40"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Website...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Check Link (लिंक जांचें)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scanning Loader State */}
      {isScanning && (
        <div className="card p-6 border-[var(--primary-border)] bg-[var(--primary-subtle)] flex items-center gap-3 animate-fade-in">
          <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
          <div className="text-xs text-[var(--text-secondary)]">
            <p className="font-bold text-[var(--text-primary)]">Comparing domain against official Indian bank registries...</p>
            <p>Checking for fake spelling, lookalike characters, and deceptive subdomains.</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && !isScanning && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenSandbox={onOpenSandbox}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}

      {/* Empty State Educational Tip */}
      {!result && !isScanning && (
        <div className="card p-5 bg-[var(--bg-surface)] text-xs space-y-2 text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How scammers trick you with fake links:</span>
          </div>
          <p>
            Scammers create website names that look almost identical to real banks (e.g. <code>sbi-kyc.top</code> instead of official <code>onlinesbi.sbi</code>). Rakshak AI flags fake spelling and warns you before you enter your bank password.
          </p>
        </div>
      )}

    </div>
  );
}
