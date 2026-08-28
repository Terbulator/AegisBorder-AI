import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Lock, Trash2, Search, UserX, UserCheck, Loader2 } from 'lucide-react';
import { analyzeMessage } from '../engine/codeMixedNlp';
import RiskResultCard from './RiskResultCard';
import VoiceAssistant from './VoiceAssistant';

const SCAN_STEPS = [
  'Reading message',
  'Checking suspicious patterns',
  'Checking links',
  'Detecting social-engineering signals',
  'Calculating risk',
];

const SAMPLE_MESSAGES = [
  {
    title: 'Electricity Bill Scam',
    text:
      'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Pay ₹20 immediately using this link electricity-nodal-officer.in/pay',
    known: false,
  },
  {
    title: 'SBI Bank KYC Scam',
    text:
      'Dear SBI User, your YONO NetBanking will be blocked today due to pending KYC update. Click http://sbi-bank-kyc-update.top to reactivate account.',
    known: false,
  },
  {
    title: 'Friend’s Photo Link',
    text: 'Hey, check this photo link http://trip-photos-share.top from yesterday’s family picnic!',
    known: true,
  },
];

export default function MessageScanner({
  currentLang = 'hi',
  onOpenReport,
  onMintBlock,
  initialText = '',
  onResult,
}) {
  const [inputText, setInputText] = useState(initialText);
  const [isKnownContact, setIsKnownContact] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const stepTimers = useRef([]);

  useEffect(() => {
    if (initialText && initialText !== inputText) setInputText(initialText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText]);

  useEffect(() => () => stepTimers.current.forEach(clearTimeout), []);

  const runScan = (text = inputText, known = isKnownContact) => {
    if (!text.trim()) return;
    setResult(null);
    setIsScanning(true);
    setScanStep(1);

    // 5 steps, ~250ms each → 1.25s total
    for (let i = 2; i <= SCAN_STEPS.length; i++) {
      const t = setTimeout(() => setScanStep(i), 250 * (i - 1));
      stepTimers.current.push(t);
    }

    const final = setTimeout(() => {
      const res = analyzeMessage(text, currentLang, {
        isKnownContact: known,
        senderInfo: known ? 'Saved contact' : '+91 98765 43210 (Unknown)',
      });
      setResult(res);
      setIsScanning(false);
      setScanStep(0);
      if (onResult) onResult(res);
    }, 250 * SCAN_STEPS.length + 200);
    stepTimers.current.push(final);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Main scanner panel */}
      <section className="panel-elevated">
        <div className="p-5 sm:p-6">
          {/* Title row */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Check a suspicious message</h2>
                <p className="text-[12.5px] text-[var(--text-muted)]">
                  Paste an SMS or WhatsApp message and we’ll explain whether it looks safe.
                </p>
              </div>
            </div>
            <VoiceAssistant
              currentLang={currentLang}
              onVoiceInput={(spoken) => { setInputText(spoken); runScan(spoken, isKnownContact); }}
            />
          </div>

          {/* Sender toggle */}
          <div className="mt-4 flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] w-full sm:w-fit">
            <button
              onClick={() => setIsKnownContact(false)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium transition-colors ${
                !isKnownContact
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-medium)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              Unknown number
            </button>
            <button
              onClick={() => setIsKnownContact(true)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium transition-colors ${
                isKnownContact
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-medium)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Saved contact
            </button>
          </div>

          {/* Textarea */}
          <div className="mt-4 relative">
            <textarea
              rows={5}
              maxLength={2000}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the suspicious message here…"
              className="input input-textarea"
            />
            <div className="absolute bottom-2 right-3 text-[11px] text-[var(--text-muted)] tabular-nums pointer-events-none">
              {inputText.length} / 2000
            </div>
          </div>

          {/* Examples */}
          <div className="mt-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Try an example</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_MESSAGES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInputText(s.text); setIsKnownContact(s.known); runScan(s.text, s.known); }}
                  className="text-left p-2.5 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <p className="text-[12.5px] font-medium text-[var(--text-primary)] leading-tight">{s.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5">{s.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy note */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <p className="text-[11.5px] text-[var(--text-muted)]">
              Processed on-device where supported. Your message stays private.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={handleClear}
              disabled={!inputText}
              className="btn btn-ghost btn-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>

            <button
              onClick={() => runScan()}
              disabled={!inputText.trim() || isScanning}
              className="btn btn-primary"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin-slow" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Scan message
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Scanning state */}
      {isScanning && (
        <section className="panel-elevated p-5 animate-fade-in" aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-3.5 h-3.5 text-[var(--primary)] animate-spin-slow" />
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Analyzing message</h3>
          </div>
          <div className="space-y-0.5">
            {SCAN_STEPS.map((label, i) => {
              const stepNum = i + 1;
              const done = scanStep > stepNum;
              const active = scanStep === stepNum;
              return (
                <div
                  key={label}
                  className={`scan-step ${done ? 'done' : active ? 'active' : ''}`}
                >
                  <span className="step-icon">
                    {done ? '✓' : active ? '' : ''}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Result */}
      {result && !isScanning && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}

      {/* Empty state */}
      {!result && !isScanning && (
        <section className="panel p-5">
          <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">Is this message safe?</h3>
          <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">
            Paste any SMS or WhatsApp message above. Rakshak AI will tell you in plain language
            whether it is safe, suspicious, or a scam — and what to do next.
          </p>
        </section>
      )}
    </div>
  );
}
