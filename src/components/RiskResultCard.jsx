import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Volume2, 
  ExternalLink, 
  FileText, 
  Database, 
  Zap, 
  CheckCircle2,
  Clock,
  Lock
} from 'lucide-react';
import { speakText } from './VoiceAssistant';

export default function RiskResultCard({ 
  result, 
  currentLang, 
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
    <div className={`rounded-2xl p-6 transition-all duration-300 ${
      isSafe
        ? 'glass-safe-glow border border-emerald-500/30'
        : isCritical
          ? 'glass-danger-glow border border-rose-500/30'
          : 'glass-panel border border-amber-500/30'
    }`}>
      
      {/* Top Header with Status & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isSafe 
              ? 'bg-emerald-500/15 text-emerald-400' 
              : isCritical
                ? 'bg-rose-500/15 text-rose-400'
                : 'bg-amber-500/15 text-amber-400'
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
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isSafe 
                  ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25' 
                  : isCritical
                    ? 'bg-rose-500/12 text-rose-300 border border-rose-500/25'
                    : 'bg-amber-500/12 text-amber-300 border border-amber-500/25'
              }`}>
                {isSafe ? 'Looks Safe' : isCritical ? 'High Risk' : 'Suspicious'}
              </span>
              
              {result.bloomLookupMs !== undefined && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded-full border border-sky-500/20">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{result.bloomLookupMs}ms</span>
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-white mt-1">
              {result.title || (isSafe ? 'Verified Legitimate' : 'Threat Detected')}
            </h3>
          </div>
        </div>

        {/* Risk Score */}
        <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Risk Level</span>
            <span className={`text-2xl font-bold font-mono ${
              isSafe ? 'text-emerald-400' : isCritical ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {result.riskScore}/100
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-[3px] border-white/[0.08] flex items-center justify-center relative">
            <div 
              className={`w-full h-full rounded-full border-[3px] ${
                isSafe ? 'border-emerald-500' : isCritical ? 'border-rose-500' : 'border-amber-500'
              }`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${result.riskScore}%, 0 ${result.riskScore}%)`
              }}
            />
            <span className="text-[9px] font-semibold text-slate-300 absolute">
              {result.riskScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/[0.04] mb-5 space-y-3">
        <div>
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            What we found:
          </h4>
          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            {typeof result.explanation === 'object'
              ? (result.explanation[currentLang] || result.explanation.en)
              : (result.explanation || "Analysis complete.")}
          </p>
        </div>

        {result.recommendation && (
          <div className="pt-2 border-t border-white/[0.06]">
            <h4 className="text-xs font-medium text-cyber-accent uppercase tracking-wider mb-1">
              What to do:
            </h4>
            <p className="text-xs text-slate-300">
              {typeof result.recommendation === 'object'
                ? (result.recommendation[currentLang] || result.recommendation.en)
                : result.recommendation}
            </p>
          </div>
        )}

        {/* Reasons breakdown */}
        {result.reasons && result.reasons.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Why we flagged this:
            </h4>
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Voice Readout Button */}
        <button
          onClick={playVoiceSummary}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyber-accent/90 hover:bg-cyber-accent text-white text-xs font-semibold transition-all"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Listen (आवाज़ सुनें)</span>
        </button>

        {/* Safe Sandbox Button */}
        {result.spoofedTarget && onOpenSandbox && (
          <button
            onClick={() => onOpenSandbox(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-medium border border-white/[0.08] transition-all hover:border-cyber-accent/30"
          >
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Safe Sandbox</span>
          </button>
        )}

        {/* Report to Cyber Cell */}
        {!isSafe && onOpenReport && (
          <button
            onClick={() => onOpenReport(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 text-rose-200 text-xs font-medium border border-rose-500/25 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Report to 1930</span>
          </button>
        )}

        {/* Mint on PoA Blockchain */}
        {!isSafe && onMintBlock && (
          <button
            onClick={() => onMintBlock(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 text-xs font-medium border border-white/[0.08] hover:border-sky-500/25 transition-all"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Add to Ledger</span>
          </button>
        )}

      </div>

    </div>
  );
}
