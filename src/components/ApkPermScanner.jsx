import React, { useState } from 'react';
import { ShieldAlert, ShieldX, Sparkles, AlertTriangle, CheckCircle, FileCode, Lock } from 'lucide-react';
import { inspectApk } from '../engine/apkInspector';
import RiskResultCard from './RiskResultCard';

export default function ApkPermScanner({ 
  currentLang, 
  onOpenReport, 
  onMintBlock,
  initialApk = '' 
}) {
  const [apkInput, setApkInput] = useState(initialApk);
  const [result, setResult] = useState(null);

  const sampleApks = [
    { label: "AnyDesk Support RAT", url: "http://customer-support-app.net/AnyDesk_Support.apk" },
    { label: "Fake Bijli Bill APK", url: "http://bijli-bill-payment-portal.cc/Bijli_Update.apk" },
    { label: "SBI KYC Helper", url: "com.sbi.kyc.verification.doc" }
  ];

  const handleAudit = (apkToAudit = apkInput) => {
    if (!apkToAudit.trim()) return;
    const res = inspectApk(apkToAudit);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/12 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              App Safety Check
            </h3>
            <p className="text-xs text-slate-400">
              Check if an APK or app has dangerous permissions before installing
            </p>
          </div>
        </div>

        {/* APK Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={apkInput}
            onChange={(e) => setApkInput(e.target.value)}
            placeholder="Enter APK download link or package name..."
            className="w-full p-4 pl-11 rounded-xl bg-black/30 border border-white/[0.08] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20 transition-all font-mono"
          />
          <FileCode className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400">Try a sample:</span>
          {sampleApks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setApkInput(s.url);
                handleAudit(s.url);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-rose-300 border border-white/[0.08] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Audit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setApkInput('');
              setResult(null);
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleAudit()}
            disabled={!apkInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check App</span>
          </button>
        </div>
      </div>

      {/* Result Card & Dangerous Permission Breakdown */}
      {result && (
        <div className="space-y-4">
          <RiskResultCard
            result={{
              riskScore: result.riskScore,
              title: `${result.appName} (${result.packageName})`,
              explanation: result.warning,
              recommendation: "Do NOT install this app. Delete it from your Downloads folder immediately.",
              reasons: [
                `${result.permissionCount} dangerous permissions found`,
                result.isRatThreat ? "Contains remote screen control capabilities" : "Unverified third-party app"
              ]
            }}
            currentLang={currentLang}
            onOpenReport={onOpenReport}
            onMintBlock={onMintBlock}
          />

          {/* Permission Badges Grid */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldX className="w-3.5 h-3.5 text-rose-400" />
              <span>Dangerous Permissions ({result.permissions.length})</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.permissions.map((perm, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-rose-300">
                      {perm.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20">
                      {perm.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {perm.userExplanation[currentLang] || perm.userExplanation.en}
                  </p>
                  <div className="mt-1 text-[10px] font-mono text-slate-500 truncate">
                    {perm.permission}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
