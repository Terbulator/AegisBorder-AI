import React, { useEffect, useRef, useState } from 'react';
import { QrCode, Loader2, Search, Trash2, AlertTriangle } from 'lucide-react';
import { parseUpiPayload } from '../engine/upiQrDetector';
import RiskResultCard from './RiskResultCard';

const SCAN_STEPS = [
  'Reading QR / VPA',
  'Checking against fraud registry',
  'Looking for deceptive intent',
  'Calculating risk',
];

const SAMPLE_QRS = [
  { label: 'Fake ₹4,999 cashback trap',     data: 'upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Claim+Cashback+Reward' },
  { label: 'Legitimate ₹150 grocery store', data: 'upi://pay?pa=kirana-store@sbi&am=150&pn=Ramesh+Kirana+Store&tn=Groceries' },
  { label: 'Fake electricity officer VPA',  data: 'upi://pay?pa=electricity-nodal-officer@axl&am=2450&pn=Electricity+Bill+Desk' },
];

export default function QrScanner({ currentLang = 'hi', onOpenReport, onMintBlock, onTriggerMicroFriction, initialPayload = '', onResult }) {
  const [input, setInput] = useState(initialPayload);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    if (initialPayload && initialPayload !== input) setInput(initialPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPayload]);
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
      const res = parseUpiPayload(data);
      setResult(res);
      setIsScanning(false);
      setScanStep(0);
      if (onResult) onResult(res);
      if (res && res.hasDeceptiveIntent && onTriggerMicroFriction) onTriggerMicroFriction(res);
    }, 250 * SCAN_STEPS.length + 200));
  };

  return (
    <div className="space-y-4">
      {/* Golden rule */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-[var(--warning-border)] bg-[var(--warning-bg)]">
        <AlertTriangle className="w-4 h-4 text-[var(--warning-text)] shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-[var(--text-primary)] leading-relaxed">
          <span className="font-semibold">Golden rule:</span> UPI PIN is only to <em>send</em> money. You never need a PIN to receive money or cashback.
        </p>
      </div>

      <section className="panel-elevated p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Check QR code or UPI ID</h2>
            <p className="text-[12.5px] text-[var(--text-muted)]">Paste a UPI deep link or VPA before you pay.</p>
          </div>
        </div>

        <div className="mt-4">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste UPI deep link (upi://pay?…) or a VPA (example@upi)"
            className="input input-textarea"
          />
        </div>

        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Try an example</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_QRS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s.data); runScan(s.data); }}
                className="text-left p-2.5 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <p className="text-[12.5px] font-medium text-[var(--text-primary)] leading-tight">{s.label}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-mono">{s.data}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button onClick={() => setInput('')} disabled={!input} className="btn btn-ghost btn-sm">
            <Trash2 className="w-3.5 h-3.5" />Clear
          </button>
          <button onClick={() => runScan()} disabled={!input.trim() || isScanning} className="btn btn-primary">
            {isScanning ? (<><Loader2 className="w-4 h-4 animate-spin-slow" />Analyzing…</>) : (<><Search className="w-4 h-4" />Check payment</>)}
          </button>
        </div>
      </section>

      {isScanning && (
        <section className="panel-elevated p-5 animate-fade-in" aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-3.5 h-3.5 text-[var(--primary)] animate-spin-slow" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Checking payment</h3>
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
