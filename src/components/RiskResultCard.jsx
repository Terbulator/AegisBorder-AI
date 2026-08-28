import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Volume2, 
  FileText, 
  Database, 
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { speakText } from './VoiceAssistant';

export default function RiskResultCard({ 
  result, 
  currentLang = 'hi', 
  onOpenSandbox, 
  onOpenReport, 
  onMintBlock 
}) {
  if (!result) return null;

  const isSafe = result.riskScore < 40;
  const isCritical = result.riskScore >= 80;

  const playVoiceSummary = () => {
    let textToSpeak = "";
    if (result.title) textToSpeak += result.title + ". ";
    if (result.explanation) {
      if (typeof result.explanation === 'object') {
        textToSpeak += (result.explanation[currentLang] || result.explanation.en) + ". ";
      } else {
        textToSpeak += result.explanation + ". ";
      }
    }
    if (result.recommendation) {
      if (typeof result.recommendation === 'object') {
        textToSpeak += (result.recommendation[currentLang] || result.recommendation.en);
      } else {
        textToSpeak += result.recommendation;
      }
    }
    speakText(textToSpeak, currentLang);
  };

  return (
    <div className={`p-5 sm:p-6 transition-all duration-200 ${
      isSafe
        ? 'card-safe'
        : isCritical
          ? 'card-danger'
          : 'card-warning'
    }`}>
      
      {/* Top Header with Status & Plain Risk Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-5">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isSafe 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
              : isCritical
                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            {isSafe ? (
              <ShieldCheck className="w-6 h-6" />
            ) : isCritical ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={isSafe ? 'badge-safe' : isCritical ? 'badge-danger' : 'badge-warning'}>
                {isSafe 
                  ? '✓ Looks Safe (सुरक्षित है)' 
                  : isCritical 
                    ? '⚠️ High Risk Scam (धोखाधड़ी का खतरा)' 
                    : '⚡ Caution (सावधान रहें)'}
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {result.title || (isSafe ? 'Verified Safe to Proceed' : 'Potential Scam Warning')}
            </h3>
          </div>
        </div>

        {/* How Risky Is This Rating */}
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto shadow-sm">
          <div className="text-right">
            <span className="text-[11px] text-[var(--text-muted)] block font-semibold">How risky is this?</span>
            <span className={`text-xl font-bold font-mono ${
              isSafe ? 'text-emerald-600' : isCritical ? 'text-red-600' : 'text-amber-600'
            }`}>
              {isSafe ? 'Low Risk' : isCritical ? 'Very High Risk' : 'Medium Risk'}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            isSafe ? 'bg-emerald-100 text-emerald-800' : isCritical ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {result.riskScore}%
          </div>
        </div>
      </div>

      {/* Analysis Sections: Plain Explanations */}
      <div className="bg-[var(--bg-surface)] rounded-xl p-4 sm:p-5 border border-[var(--border-subtle)] mb-5 space-y-4 shadow-sm">
        <div>
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Why this looks suspicious (यह संदिग्ध क्यों है):</span>
          </h4>
          <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
            {typeof result.explanation === 'object'
              ? (result.explanation[currentLang] || result.explanation.en)
              : (result.explanation || "Analysis complete.")}
          </p>
        </div>

        {result.recommendation && (
          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What you should do (आपको क्या करना चाहिए):</span>
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              {typeof result.recommendation === 'object'
                ? (result.recommendation[currentLang] || result.recommendation.en)
                : result.recommendation}
            </p>
          </div>
        )}

        {/* Plain-Language Specific Warning Signs */}
        {result.reasons && result.reasons.length > 0 && (
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Specific Warning Signs:
            </h4>
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Voice Readout Button (आवाज़ में सुनें) */}
        <button
          onClick={playVoiceSummary}
          className="btn-primary text-xs"
          title="Listen to this warning in your language"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen (आवाज़ में सुनें)</span>
        </button>

        {/* Report to 1930 Cyber Cell */}
        {!isSafe && onOpenReport && (
          <button
            onClick={() => onOpenReport(result)}
            className="btn-danger text-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Report to 1930 Helpline</span>
          </button>
        )}

        {/* Safe Sandbox Preview */}
        {result.spoofedTarget && onOpenSandbox && (
          <button
            onClick={() => onOpenSandbox(result)}
            className="btn-secondary text-xs"
          >
            <Lock className="w-4 h-4 text-[var(--primary)]" />
            <span>Open in Safe Sandbox</span>
          </button>
        )}

        {/* Add to Community Registry */}
        {!isSafe && onMintBlock && (
          <button
            onClick={() => onMintBlock(result)}
            className="btn-secondary text-xs"
          >
            <Database className="w-4 h-4 text-[var(--primary)]" />
            <span>Save to Scam Registry</span>
          </button>
        )}

      </div>

    </div>
  );
}
