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
    { label: "Fake Bijli Bill Pay APK", url: "http://bijli-bill-payment-portal.cc/Bijli_Update.apk" },
    { label: "SBI KYC Verification Helper", url: "com.sbi.kyc.verification.doc" }
  ];

  const handleAudit = (apkToAudit = apkInput) => {
    if (!apkToAudit.trim()) return;
    const res = inspectApk(apkToAudit);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              APK Download & Remote Access Trojan (RAT) Auditor
            </h3>
            <p className="text-xs text-slate-400">
              Detects Sideloaded APKs, Screen Recording & OTP-Stealing Accessibility Rights
            </p>
          </div>
        </div>

        {/* APK Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={apkInput}
            onChange={(e) => setApkInput(e.target.value)}
            placeholder="Enter APK download link or package name (e.g. AnyDesk_Support.apk or KycUpdate.apk)"
            className="w-full p-4 pl-11 rounded-2xl bg-black/40 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 transition-all font-mono"
          />
          <FileCode className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400 font-mono">Sample Malware APKs:</span>
          {sampleApks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setApkInput(s.url);
                handleAudit(s.url);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-red-300 border border-slate-700 transition-colors"
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleAudit()}
            disabled={!apkInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audit Android Permissions</span>
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
              recommendation: "Do NOT sideload or open this APK file. Delete it from your Downloads folder immediately.",
              reasons: [
                `${result.permissionCount} dangerous permissions identified in manifest`,
                result.isRatThreat ? "CRITICAL: Contains Remote Access Screen Control hooks" : "Unverified third-party signature"
              ]
            }}
            currentLang={currentLang}
            onOpenReport={onOpenReport}
            onMintBlock={onMintBlock}
          />

          {/* Dangerous Permission Badges Grid */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-red-400" />
              <span>Audited Android Permissions ({result.permissions.length})</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.permissions.map((perm, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-300">
                      {perm.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
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
