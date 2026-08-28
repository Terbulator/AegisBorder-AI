import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Volume2,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
  Hash,
} from 'lucide-react';
import { speakText } from './VoiceAssistant';

/* ============================================================
   Animated risk score bar (0 → target over 600ms)
   ============================================================ */
function RiskScoreBar({ targetScore }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 600;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * targetScore));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetScore]);

  const isSafe = targetScore < 40;
  const isCritical = targetScore >= 75;
  const color = isSafe ? 'var(--success)' : isCritical ? 'var(--danger)' : 'var(--warning)';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Risk score</span>
        <span className="text-[13px] font-semibold tabular-nums text-[var(--text-primary)]">{displayed}/100</span>
      </div>
      <div className="risk-bar-track">
        <div className="risk-bar-fill" style={{ width: `${displayed}%`, background: color }} />
      </div>
    </div>
  );
}

/* ============================================================
   Map engine severities → our 3-state model
   ============================================================ */
function normalizeSeverity(result) {
  if (!result) return 'safe';
  if (result.severity === 'SAFE' || result.status === 'SAFE' || (result.riskScore ?? 0) < 40) return 'safe';
  if (result.severity === 'CRITICAL' || (result.riskScore ?? 0) >= 75) return 'danger';
  return 'caution';
}

/* ============================================================
   Result card
   ============================================================ */
export default function RiskResultCard({
  result,
  currentLang = 'hi',
  onOpenReport,
  onMintBlock,
}) {
  if (!result) return null;

  const state = normalizeSeverity(result);
  const isSafe = state === 'safe';
  const isCaution = state === 'caution';
  const isDanger = state === 'danger';

  const verdictText = isSafe
    ? (currentLang === 'hi' ? 'Looks safe' : 'Looks safe')
    : isDanger
    ? (currentLang === 'hi' ? 'High risk' : 'High risk')
    : (currentLang === 'hi' ? 'Be careful' : 'Be careful');

  const verdictSub = isSafe
    ? 'Rakshak AI did not find strong scam indicators.'
    : isDanger
    ? 'Strong scam indicators detected. Avoid interacting.'
    : 'Some suspicious indicators were detected.';

  const palette = isSafe
    ? { border: 'var(--success-border)', bg: 'var(--success-bg)', text: 'var(--success-text)', solid: 'var(--success)' }
    : isCaution
    ? { border: 'var(--warning-border)', bg: 'var(--warning-bg)', text: 'var(--warning-text)', solid: 'var(--warning)' }
    : { border: 'var(--danger-border)', bg: 'var(--danger-bg)', text: 'var(--danger-text)', solid: 'var(--danger)' };

  const StatusIcon = isSafe ? ShieldCheck : isDanger ? ShieldAlert : AlertTriangle;
  const StatusTextIcon = isSafe ? CheckCircle2 : isDanger ? XCircle : Info;

  /* Reasons list (from matches if present) */
  const reasons = (() => {
    if (result.reasons && result.reasons.length) return result.reasons;
    if (result.matches && result.matches.length) {
      return result.matches.flatMap(m => m.matchedKeywords || []).slice(0, 6);
    }
    if (isDanger) {
      return [
        'Creates urgency or fear',
        'Requests money or sensitive information',
        'Contains a suspicious link',
        'Uses KYC / account-threat language',
      ];
    }
    if (isCaution) {
      return [
        'Contains an unfamiliar link',
        'Asks for personal or financial information',
        'Tone suggests urgency',
      ];
    }
    return [];
  })();

  /* Detected signals (chips) */
  const signals = (() => {
    if (result.signals && result.signals.length) return result.signals;
    if (result.matches && result.matches.length) {
      const seen = new Set();
      return result.matches
        .map(m => (m.category || '').replace(/_/g, ' ').toLowerCase())
        .filter(s => s && !seen.has(s) && seen.add(s))
        .slice(0, 4);
    }
    if (isDanger) return ['Urgency', 'Payment request', 'Suspicious URL', 'Impersonation'];
    if (isCaution) return ['Suspicious link', 'Urgency tone'];
    return [];
  })();

  const explanationText = typeof result.explanation === 'object'
    ? (result.explanation[currentLang] || result.explanation.en)
    : (result.explanation || '');

  const recommendationText = typeof result.recommendation === 'object'
    ? (result.recommendation[currentLang] || result.recommendation.en)
    : (result.recommendation || '');

  const handleSpeak = () => {
    let txt = result.title ? result.title + '. ' : '';
    if (explanationText) txt += explanationText + '. ';
    if (recommendationText) txt += recommendationText;
    speakText(txt, currentLang);
  };

  return (
    <section
      className="panel-elevated overflow-hidden animate-slide-up"
      style={{ borderColor: palette.border }}
    >
      {/* Status header */}
      <div className="px-5 pt-5 pb-4" style={{ background: palette.bg }}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--bg-surface)', border: `1px solid ${palette.border}` }}
          >
            <StatusIcon
              className={`w-5 h-5 ${isSafe ? 'animate-check-pop' : 'animate-attention'}`}
              style={{ color: palette.solid }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge" style={{ background: 'var(--bg-surface)', color: palette.text, borderColor: palette.border }}>
                {verdictText}
              </span>
              {!isSafe && result.severity && (
                <span className="badge badge-neutral">{result.severity}</span>
              )}
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug">
              {result.title || (isSafe ? 'No scam patterns detected' : 'Suspicious message')}
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{verdictSub}</p>
          </div>
        </div>

        <div className="mt-4">
          <RiskScoreBar targetScore={result.riskScore ?? 0} />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-5">
        {explanationText && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Why we flagged it
            </h4>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
              {explanationText}
            </p>
          </div>
        )}

        {reasons.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              What we noticed
            </h4>
            <ul className="space-y-1.5">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)]">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}
                  >
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {signals.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Detected signals
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {signals.map((s, i) => (
                <span key={i} className="chip capitalize">
                  <Hash className="w-3 h-3" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {recommendationText && (
          <div
            className="rounded-lg p-3.5"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <StatusTextIcon className="w-3.5 h-3.5" style={{ color: palette.text }} />
              <h4 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: palette.text }}>
                What to do next
              </h4>
            </div>
            <p className="text-[13.5px] text-[var(--text-primary)] font-medium leading-relaxed">
              {recommendationText}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-1 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)]">
        <button onClick={handleSpeak} className="btn btn-secondary btn-sm">
          <Volume2 className="w-3.5 h-3.5" />
          Listen
        </button>

        {!isSafe && onOpenReport && (
          <button onClick={() => onOpenReport(result)} className="btn btn-danger btn-sm">
            <FileText className="w-3.5 h-3.5" />
            Report scam
          </button>
        )}

        {!isSafe && onMintBlock && (
          <button onClick={() => onMintBlock(result)} className="btn btn-secondary btn-sm">
            Block
          </button>
        )}
      </div>
    </section>
  );
}
