import React, { useState } from 'react';
import { QrCode, AlertOctagon, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { parseUpiPayload } from '../engine/upiQrDetector';
import RiskResultCard from './RiskResultCard';

export default function QrScanner({ 
  currentLang, 
  onTriggerMicroFriction,
  onOpenReport, 
  onMintBlock,
  initialPayload = ''
}) {
  const [payload, setPayload] = useState(initialPayload);
  const [result, setResult] = useState(null);

  const sampleQrs = [
    {
      title: "Cashback Trap (₹4,999)",
      data: "upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Claim+Cashback+Reward"
    },
    {
      title: "Legitimate Store Payment",
      data: "upi://pay?pa=kirana-store@sbi&am=150&pn=Ramesh+Kirana+Store&tn=Groceries"
    },
    {
      title: "Fake Electricity VPA",
      data: "upi://pay?pa=electricity-nodal-officer@axl&am=2450&pn=Electricity+Bill+Desk"
    }
  ];

  const handleInspect = (dataToInspect = payload) => {
    if (!dataToInspect.trim()) return;
    const res = parseUpiPayload(dataToInspect);
    setResult(res);

    // If fraudulent receive trap detected, automatically trigger micro-friction modal
    if (res && res.hasDeceptiveIntent && onTriggerMicroFriction) {
      onTriggerMicroFriction(res);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Input & QR Payload Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-violet-500/12 text-violet-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              UPI & QR Safety Check
            </h3>
            <p className="text-xs text-slate-400">
              Paste any UPI link or QR data to detect payment traps
            </p>
          </div>
        </div>

        {/* Payload Text Input */}
        <div className="relative mb-4">
          <textarea
            rows={3}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Paste UPI deep link or VPA (e.g. upi://pay?pa=cashback-claim@ybl&am=4999)"
            className="w-full p-4 rounded-xl bg-black/30 border border-white/[0.08] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all font-mono"
          />
        </div>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400">Try a sample:</span>
          {sampleQrs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPayload(s.data);
                handleInspect(s.data);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-violet-300 border border-white/[0.08] transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setPayload('');
              setResult(null);
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleInspect()}
            disabled={!payload.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check Payment</span>
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="space-y-4">
          <RiskResultCard
            result={{
              riskScore: result.riskScore,
              title: result.isThreat ? "Payment Trap Detected" : "Valid Payment",
              explanation: result.frictionMessage,
              recommendation: result.isThreat 
                ? "Never enter UPI PIN to receive money. UPI PIN always DEDUCTS money from your bank."
                : "Legitimate payment payload format.",
              reasons: result.riskReasons,
              bloomLookupMs: result.bloomLookupMs
            }}
            currentLang={currentLang}
            onOpenReport={onOpenReport}
            onMintBlock={onMintBlock}
          />

          {/* Micro-Friction Quick Action if Threat */}
          {result.isThreat && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs text-rose-200 font-medium">
                  Payment blocked — this would debit ₹{result.amount || 4999} from your account.
                </span>
              </div>
              <button
                onClick={() => onTriggerMicroFriction && onTriggerMicroFriction(result)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
