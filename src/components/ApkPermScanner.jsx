import React, { useEffect, useRef, useState } from 'react';
import { AppWindow, Loader2, Search, Trash2 } from 'lucide-react';
import { inspectApk } from '../engine/apkInspector';
import RiskResultCard from './RiskResultCard';

const SCAN_STEPS = [
  'Identifying app',
  'Reviewing permissions',
  'Checking against known malware',
  'Calculating risk',
];

const SAMPLE_APKS = [
  { label: 'Fake AnyDesk support',  url: 'http://customer-support-app.net/AnyDesk_Support.apk' },
  { label: 'Fake bijli bill portal', url: 'http://bijli-bill-payment-portal.cc/Bijli_Update.apk' },
  { label: 'Fake SBI KYC helper',    url: 'com.sbi.kyc.verification.doc' },
];

export default function ApkPermScanner({ currentLang = 'hi', onOpenReport, onMintBlock, initialApk = '', onResult }) {
  const [input, setInput] = useState(initialApk);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    if (initialApk && initialApk !== input) setInput(initialApk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialApk]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runScan = (data = input) => {
    if (!data.trim()) return;
    setResult(null);
    setIsScanning(true);
    setScanStep(1);
    for (let i = 2; i <= SCAN_STEPS.length; i++) {
      timers.current.push(setTimeout(() => setScanStep(i), 250 * (i - 1)));
    }
    timers.current.push(setTimeout(() => {
      const res = inspectApk(data);
      setResult(res);
      setIsScanning(false);
      setScanStep(0);
      if (onResult) onResult(res);
    }, 250 * SCAN_STEPS.length + 200));
  };

  return (
    <div className="space-y-4">
      <section className="panel-elevated p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center shrink-0">
            <AppWindow className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Check app permissions</h2>
            <p className="text-[12.5px] text-[var(--text-muted)]">Paste an APK URL or package name to see if it has dangerous permissions.</p>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste APK URL or package name…"
            className="input"
          />
        </div>

        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Try an example</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_APKS.map((s, i) => (
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
            {isScanning ? (<><Loader2 className="w-4 h-4 animate-spin-slow" />Analyzing…</>) : (<><Search className="w-4 h-4" />Check app</>)}
          </button>
        </div>
      </section>

      {isScanning && (
        <section className="panel-elevated p-5 animate-fade-in" aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-3.5 h-3.5 text-[var(--primary)] animate-spin-slow" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Reviewing app</h3>
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
