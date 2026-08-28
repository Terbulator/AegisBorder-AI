import React, { useEffect, useRef, useState } from 'react';
import { Globe, Loader2, Search, Trash2 } from 'lucide-react';
import { inspectUrl } from '../engine/urlDetector';
import RiskResultCard from './RiskResultCard';

const SCAN_STEPS = [
  'Analyzing domain',
  'Checking reputation',
  'Looking for suspicious patterns',
  'Comparing against scam registry',
];

const SAMPLE_URLS = [
  { label: 'Fake SBI KYC link',  url: 'http://sbi-bank-kyc-update.top/login.php', safe: false },
  { label: 'Official SBI portal', url: 'https://onlinesbi.sbi',                   safe: true },
  { label: 'Fake Jio 5G offer',   url: 'http://free-recharge-jio-5g.live',         safe: false },
  { label: 'Official HDFC bank',  url: 'https://hdfcbank.com',                     safe: true },
];

export default function UrlScanner({ currentLang = 'hi', onOpenReport, onMintBlock, onOpenSandbox, initialUrl = '', onResult }) {
  const [input, setInput] = useState(initialUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    if (initialUrl && initialUrl !== input) setInput(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runScan = (url = input) => {
    if (!url.trim()) return;
    setResult(null);
    setIsScanning(true);
    setScanStep(1);
    for (let i = 2; i <= SCAN_STEPS.length; i++) {
      timers.current.push(setTimeout(() => setScanStep(i), 280 * (i - 1)));
    }
    timers.current.push(setTimeout(() => {
      const res = inspectUrl(url, currentLang);
      setResult(res);
      setIsScanning(false);
      setScanStep(0);
      if (onResult) onResult(res);
    }, 280 * SCAN_STEPS.length + 200));
  };

  return (
    <div className="space-y-4">
      <section className="panel-elevated p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Check a suspicious website</h2>
            <p className="text-[12.5px] text-[var(--text-muted)]">Paste any link to verify if it is the official site or a fake clone.</p>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the website link here…"
            className="input"
          />
        </div>

        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Try an example</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_URLS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s.url); runScan(s.url); }}
                className="text-left p-2.5 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <p className="text-[12.5px] font-medium text-[var(--text-primary)] leading-tight">{s.label}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-mono">{s.url}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button onClick={() => setInput('')} disabled={!input} className="btn btn-ghost btn-sm">
            <Trash2 className="w-3.5 h-3.5" />Clear
          </button>
          <button onClick={() => runScan()} disabled={!input.trim() || isScanning} className="btn btn-primary">
            {isScanning ? (<><Loader2 className="w-4 h-4 animate-spin-slow" />Analyzing…</>) : (<><Search className="w-4 h-4" />Check link</>)}
          </button>
        </div>
      </section>

      {isScanning && (
        <section className="panel-elevated p-5 animate-fade-in" aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-3.5 h-3.5 text-[var(--primary)] animate-spin-slow" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Checking link</h3>
          </div>
          <div className="space-y-0.5">
            {SCAN_STEPS.map((label, i) => {
              const stepNum = i + 1;
              const done = scanStep > stepNum;
              const active = scanStep === stepNum;
              return (
                <div key={label} className={`scan-step ${done ? 'done' : active ? 'active' : ''}`}>
                  <span className="step-icon">{done ? '✓' : ''}</span>{label}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {result && !isScanning && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}
    </div>
  );
}
