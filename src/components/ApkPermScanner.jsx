import React, { useState } from 'react';
import { ShieldAlert, ShieldX, Sparkles, AlertTriangle, CheckCircle, FileCode, Lock, Loader2, AlertCircle } from 'lucide-react';
import { inspectApk } from '../engine/apkInspector';
import RiskResultCard from './RiskResultCard';

export default function ApkPermScanner({ 
  currentLang = 'hi', 
  onOpenReport, 
  onMintBlock,
  initialApk = '' 
}) {
  const [apkInput, setApkInput] = useState(initialApk);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const sampleApks = [
    { label: "Fake AnyDesk Remote Spy", url: "http://customer-support-app.net/AnyDesk_Support.apk" },
    { label: "Fake Bijli Bill Update App", url: "http://bijli-bill-payment-portal.cc/Bijli_Update.apk" },
    { label: "Fake SBI KYC Helper", url: "com.sbi.kyc.verification.doc" }
  ];

  const handleAudit = (apkToAudit = apkInput) => {
    if (!apkToAudit.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const res = inspectApk(apkToAudit);
      setResult(res);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Check App Safety (ऐप और APK की जांच करें)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Check if an APK or downloaded app has dangerous permissions to spy on your phone or steal bank OTPs
            </p>
          </div>
        </div>

        {/* APK Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={apkInput}
            onChange={(e) => setApkInput(e.target.value)}
            placeholder="Paste APK link or app file name (e.g. AnyDesk_Support.apk)..."
            className="w-full p-4 pl-11 input-clean text-sm sm:text-base font-mono"
          />
          <FileCode className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold text-[var(--text-muted)]">Try an example:</span>
          {sampleApks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setApkInput(s.url);
                handleAudit(s.url);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-all"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Audit Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => {
              setApkInput('');
              setResult(null);
            }}
            className="btn-secondary text-xs"
          >
            Clear
          </button>
          <button
            onClick={() => handleAudit()}
            disabled={!apkInput.trim() || isScanning}
            className="btn-primary text-sm sm:text-base px-6 py-2.5 disabled:opacity-40"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing App Permissions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Check App Safety (ऐप सुरक्षा जांचें)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scanning State */}
      {isScanning && (
        <div className="card p-6 border-[var(--primary-border)] bg-[var(--primary-subtle)] flex items-center gap-3 animate-fade-in">
          <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
          <div className="text-xs text-[var(--text-secondary)]">
            <p className="font-bold text-[var(--text-primary)]">Inspecting Android Manifest bytecode...</p>
            <p>Checking for hidden Remote Access Trojans (RATs), screen sniffers, and OTP reading permissions.</p>
          </div>
        </div>
      )}

      {/* Result Card & Dangerous Permission Breakdown */}
      {result && !isScanning && (
        <div className="space-y-4">
          <RiskResultCard
            result={{
              riskScore: result.riskScore,
              title: `${result.appName} (${result.packageName})`,
              explanation: result.warning,
              recommendation: "Do NOT install this app! Delete the downloaded APK file immediately to protect your banking apps.",
              reasons: [
                `${result.permissionCount} dangerous permissions found`,
                result.isRatThreat ? "Can remotely view your screen and record passwords" : "Unverified third-party app source"
              ]
            }}
            currentLang={currentLang}
            onOpenReport={onOpenReport}
            onMintBlock={onMintBlock}
          />

          {/* Plain-Language Permission Badges Grid */}
          <div className="card p-5 sm:p-6">
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-red-600" />
              <span>Dangerous Phone Permissions Requested ({result.permissions.length}):</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.permissions.map((perm, idx) => (
                <div key={idx} className="p-4 rounded-xl card-danger">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-red-800 dark:text-red-300">
                      {perm.name}
                    </span>
                    <span className="badge-danger text-[10px]">
                      {perm.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {perm.userExplanation[currentLang] || perm.userExplanation.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
