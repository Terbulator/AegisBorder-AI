import React from 'react';
import { AlertOctagon, ArrowUpRight, ArrowDownLeft, Lock, ShieldX, Volume2, X } from 'lucide-react';
import { REGIONAL_STRINGS } from '../engine/regionalDictionary';

export default function MicroFrictionModal({ 
  isOpen, 
  onClose, 
  upiDetails, 
  currentLang, 
  onPlayVoice 
}) {
  if (!isOpen || !upiDetails) return null;

  const amount = upiDetails.amount || 4999;
  const payee = upiDetails.payeeName || upiDetails.vpa || 'Unknown Receiver';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-danger-glow max-w-lg w-full rounded-3xl p-6 text-white border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/30 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide text-red-400 uppercase font-mono">
                Micro-Friction Payment Gate
              </h3>
              <p className="text-xs text-slate-300">
                Fraud Trap Protection: Stop & Verify
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Warning Banner */}
        <div className="bg-red-950/80 border border-red-500/40 rounded-2xl p-4 mb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/30 border border-red-400 text-red-200 text-xs font-bold uppercase mb-2">
            <ShieldX className="w-3.5 h-3.5" />
            <span>High Risk Collect Request</span>
          </div>
          <h2 className="text-lg font-black text-white mb-1.5 leading-snug">
            {REGIONAL_STRINGS.microFrictionTitle[currentLang] || REGIONAL_STRINGS.microFrictionTitle.en}
          </h2>
          <p className="text-xs text-red-200 leading-relaxed">
            {REGIONAL_STRINGS.microFrictionDesc[currentLang] || REGIONAL_STRINGS.microFrictionDesc.en}
          </p>
        </div>

        {/* Send vs Receive Visual Contrast Box */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          
          {/* What you thought */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 opacity-60">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <ArrowDownLeft className="w-4 h-4" />
              <span>Receiving Money</span>
            </div>
            <div className="text-slate-400 text-xs line-through">
              Enter UPI PIN
            </div>
            <div className="mt-2 text-[10px] text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20 font-medium">
              ✓ NEVER requires PIN or QR Scan
            </div>
          </div>

          {/* What is actually happening */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/60 ring-2 ring-red-500/40">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>Sending Money (DEBIT)</span>
            </div>
            <div className="text-white text-sm font-black font-mono">
              - ₹{amount}
            </div>
            <div className="mt-2 text-[10px] text-red-300 bg-red-950/80 px-2 py-1 rounded border border-red-500/40 font-medium">
              ⚠ Deducts money to: {payee}
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="space-y-2.5">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Cancel Transaction & Protect Account</span>
          </button>

          {onPlayVoice && (
            <button
              onClick={onPlayVoice}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Listen to Audio Explanation in Your Language</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
