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
    <div className={`rounded-3xl p-6 transition-all duration-300 ${
      isSafe
        ? 'glass-safe-glow border border-emerald-500/50'
        : isCritical
          ? 'glass-danger-glow border border-red-500/50'
          : 'glass-panel border border-amber-500/50'
    }`}>
      
      {/* Top Header with Status & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${
            isSafe 
              ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30' 
              : isCritical
                ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30 animate-pulse'
                : 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/30'
          }`}>
            {isSafe ? (
              <ShieldCheck className="w-7 h-7" />
            ) : isCritical ? (
              <ShieldAlert className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isSafe 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : isCritical
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isSafe ? 'VERIFIED SAFE' : isCritical ? 'CRITICAL DANGER' : 'SUSPICIOUS RISK'}
              </span>
              
              {result.bloomLookupMs !== undefined && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Sub-2ms Filter ({result.bloomLookupMs} ms)</span>
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-white mt-1">
              {result.title || (isSafe ? 'Legitimate Entity Verified' : 'Threat Intelligence Alert')}
            </h3>
          </div>
        </div>

        {/* Risk Score Dial */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Threat Index</span>
            <span className={`text-2xl font-black font-mono ${
              isSafe ? 'text-emerald-400' : isCritical ? 'text-red-400' : 'text-amber-400'
            }`}>
              {result.riskScore}/100
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <div 
              className={`w-full h-full rounded-full border-4 ${
                isSafe ? 'border-emerald-500' : isCritical ? 'border-red-500' : 'border-amber-500'
              }`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${result.riskScore}%, 0 ${result.riskScore}%)`
              }}
            />
            <span className="text-[10px] font-bold text-slate-300 absolute">
              {result.riskScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Plain Language Explanation */}
      <div className="bg-black/30 rounded-2xl p-4 border border-white/5 mb-5 space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Analysis (सरल भाषा में व्याख्या):
          </h4>
          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            {typeof result.explanation === 'object'
              ? (result.explanation[currentLang] || result.explanation.en)
              : (result.explanation || "Detailed analysis complete.")}
          </p>
        </div>

        {result.recommendation && (
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              Safety Advice (सुरक्षा निर्देश):
            </h4>
            <p className="text-xs text-slate-300">
              {typeof result.recommendation === 'object'
                ? (result.recommendation[currentLang] || result.recommendation.en)
                : result.recommendation}
            </p>
          </div>
        )}

        {/* Reasons breakdown list */}
        {result.reasons && result.reasons.length > 0 && (
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Diagnostic Indicators:
            </h4>
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen in Regional Voice (आवाज़ सुनें)</span>
        </button>

        {/* Safe Sandbox Button */}
        {result.spoofedTarget && onOpenSandbox && (
          <button
            onClick={() => onOpenSandbox(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:border-cyan-500/50"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Open Safe Sandbox</span>
          </button>
        )}

        {/* Report to Cyber Cell */}
        {!isSafe && onOpenReport && (
          <button
            onClick={() => onOpenReport(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-200 text-xs font-semibold border border-red-500/40 transition-all"
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span>Generate 1930 Complaint</span>
          </button>
        )}

        {/* Mint on PoA Blockchain */}
        {!isSafe && onMintBlock && (
          <button
            onClick={() => onMintBlock(result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/40 transition-all"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Mint to PoA Ledger</span>
          </button>
        )}

      </div>

    </div>
  );
}
