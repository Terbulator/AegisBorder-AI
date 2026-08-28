import React, { useState } from 'react';
import { QrCode, AlertOctagon, Sparkles, ShieldCheck, Zap, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { parseUpiPayload } from '../engine/upiQrDetector';
import RiskResultCard from './RiskResultCard';

export default function QrScanner({ 
  currentLang = 'hi', 
  onTriggerMicroFriction,
  onOpenReport, 
  onMintBlock,
  initialPayload = ''
}) {
  const [payload, setPayload] = useState(initialPayload);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQrs = [
    {
      title: "Fake ₹4,999 Cashback Trap",
      data: "upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Claim+Cashback+Reward",
      safe: false
    },
    {
      title: "Legitimate Store Payment (₹150)",
      data: "upi://pay?pa=kirana-store@sbi&am=150&pn=Ramesh+Kirana+Store&tn=Groceries",
      safe: true
    },
    {
      title: "Fake Electricity Officer VPA",
      data: "upi://pay?pa=electricity-nodal-officer@axl&am=2450&pn=Electricity+Bill+Desk",
      safe: false
    }
  ];

  const handleInspect = (dataToInspect = payload) => {
    if (!dataToInspect.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const res = parseUpiPayload(dataToInspect);
      setResult(res);
      setIsScanning(false);

      if (res && res.hasDeceptiveIntent && onTriggerMicroFriction) {
        onTriggerMicroFriction(res);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Important Golden Rule Banner */}
      <div className="p-4 rounded-xl card-warning border-amber-300 dark:border-amber-700/50 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-primary)]">
          <p className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-0.5">
            Golden Rule: UPI PIN is ONLY to SEND money! (गोल्डन नियम)
          </p>
          <p className="text-[var(--text-secondary)]">
            You NEVER need to enter your UPI PIN or scan a QR code to receive rewards, cashbacks, or lottery money. If anyone asks for your PIN to "receive" money, it is a 100% scam.
          </p>
        </div>
      </div>

      {/* Input & QR Payload Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Check UPI Payment & QR Code (UPI और QR की जांच)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Paste UPI payment link or QR text to verify if money will be debited from your account
            </p>
          </div>
        </div>

        {/* Payload Text Input */}
        <div className="relative mb-4">
          <textarea
            rows={3}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Paste UPI link or VPA here... (e.g. upi://pay?pa=cashback-claim@ybl&am=4999)"
            className="w-full p-4 input-clean resize-none text-sm font-mono"
          />
        </div>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold text-[var(--text-muted)]">Try an example:</span>
          {sampleQrs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPayload(s.data);
                handleInspect(s.data);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                s.safe
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => {
              setPayload('');
              setResult(null);
            }}
            className="btn-secondary text-xs"
          >
            Clear
          </button>
          <button
            onClick={() => handleInspect()}
            disabled={!payload.trim() || isScanning}
            className="btn-primary text-sm sm:text-base px-6 py-2.5 disabled:opacity-40"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Payment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Check UPI Safety (सुरक्षा जांचें)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && !isScanning && (
        <div className="space-y-4">
          <RiskResultCard
            result={{
              riskScore: result.riskScore,
              title: result.isThreat ? "Deceptive Money Deduction Trap!" : "Verified Standard Payment",
              explanation: result.frictionMessage || "This UPI request is formatted to deduct money from your account.",
              recommendation: result.isThreat 
                ? "DO NOT ENTER YOUR PIN! This request will DEDUCT money from your bank account, not credit money."
                : "Legitimate payment format.",
              reasons: result.riskReasons,
              bloomLookupMs: result.bloomLookupMs
            }}
            currentLang={currentLang}
            onOpenReport={onOpenReport}
            onMintBlock={onMintBlock}
          />

          {/* Micro-Friction Alert */}
          {result.isThreat && (
            <div className="p-4 rounded-xl card-danger flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-xs text-red-800 dark:text-red-300 font-semibold">
                  Caution: Authorizing this will debit ₹{result.amount || 4999} from your bank account!
                </span>
              </div>
              <button
                onClick={() => onTriggerMicroFriction && onTriggerMicroFriction(result)}
                className="btn-danger text-xs py-2 px-4 shrink-0"
              >
                View Safety Warning
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
