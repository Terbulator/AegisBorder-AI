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
      title: "Cashback Reward QR Trap (₹4,999)",
      data: "upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Claim+Cashback+Reward"
    },
    {
      title: "Legitimate Merchant Pay",
      data: "upi://pay?pa=kirana-store@sbi&am=150&pn=Ramesh+Kirana+Store&tn=Groceries"
    },
    {
      title: "Fraudulent Electricity Officer VPA",
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
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              UPI QR Code & Deep-Link Inspector
            </h3>
            <p className="text-xs text-slate-400">
              Active Micro-Friction Gate: Prevents "Receive Money via PIN" Traps
            </p>
          </div>
        </div>

        {/* Payload Text Input */}
        <div className="relative mb-4">
          <textarea
            rows={3}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Paste UPI deep link or VPA (e.g. upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward)"
            className="w-full p-4 rounded-2xl bg-black/40 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all font-mono"
          />
        </div>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400 font-mono">Sample QR Payloads:</span>
          {sampleQrs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPayload(s.data);
                handleInspect(s.data);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-purple-300 border border-slate-700 transition-colors"
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleInspect()}
            disabled={!payload.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audit UPI Intent Payload</span>
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="space-y-4">
          <RiskResultCard
            result={{
              riskScore: result.riskScore,
              title: result.isThreat ? "High-Risk UPI Debit Trap Detected" : "Valid UPI Payment Structure",
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
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-xs text-red-200 font-medium">
                  Micro-Friction Gate Armed: Protects against deceptive ₹{result.amount || 4999} debit.
                </span>
              </div>
              <button
                onClick={() => onTriggerMicroFriction && onTriggerMicroFriction(result)}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
              >
                Launch Micro-Friction Modal
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
