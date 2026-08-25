import React from 'react';
import { Play, Sparkles, MessageSquare, Globe, QrCode, ShieldAlert, Database } from 'lucide-react';

export const DEMO_PRESETS = [
  {
    id: 'preset-hinglish-sms',
    title: 'Preset 1: Hinglish Utility Scam',
    tag: 'Code-Mixed Indic NLP',
    icon: MessageSquare,
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    description: 'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega...',
    targetTab: 'message',
    data: {
      message: 'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity nodal officer immediately 9876543210 to avoid penalty.'
    }
  },
  {
    id: 'preset-typosquat-url',
    title: 'Preset 2: SBI Bank Typosquatting',
    tag: 'Levenshtein & Sandbox',
    icon: Globe,
    badgeColor: 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30',
    description: 'http://sbi-bank-kyc-update.top/login.php (Spoofing sbi.co.in)',
    targetTab: 'url',
    data: {
      url: 'http://sbi-bank-kyc-update.top/login.php'
    }
  },
  {
    id: 'preset-upi-trap',
    title: 'Preset 3: UPI QR "Receive" Trap',
    tag: 'Micro-Friction Gate',
    icon: QrCode,
    badgeColor: 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30',
    description: 'upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward',
    targetTab: 'qr',
    data: {
      qrPayload: 'upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Congratulations+Claim+4999+Cashback'
    }
  },
  {
    id: 'preset-malicious-apk',
    title: 'Preset 4: Malicious APK RAT',
    tag: 'RAT Permission Auditor',
    icon: ShieldAlert,
    badgeColor: 'from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30',
    description: 'http://customer-support-app.net/AnyDesk_Support.apk',
    targetTab: 'apk',
    data: {
      apkUrl: 'http://customer-support-app.net/AnyDesk_Support.apk'
    }
  },
  {
    id: 'preset-poa-block',
    title: 'Preset 5: PoA Consortium Block',
    tag: 'Multi-Sig Blockchain',
    icon: Database,
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Report scam-paytm@ybl -> Cyber Cell + RBI Bank Multi-Sig Minting',
    targetTab: 'blockchain',
    data: {
      target: 'scam-paytm@ybl',
      type: 'DECEPTIVE_UPI_VPA',
      details: 'Active mass-phishing campaign in tier-3 districts'
    }
  }
];

export default function JudgePresetBar({ onSelectPreset, activePresetId }) {
  return (
    <section className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white uppercase flex items-center gap-2 font-mono">
              <span>Hackathon Judge Evaluation Bench</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-sans font-normal">
                1-Click Demo Triggers
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Instantly evaluate all 5 domain blind spots with pre-loaded real-world threat vectors:
            </p>
          </div>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {DEMO_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group text-left p-2.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border bg-gradient-to-r ${preset.badgeColor}`}>
                    {preset.tag}
                  </span>
                  <Play className={`w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${isActive ? 'opacity-100 text-cyan-300' : ''}`} />
                </div>
                <div className="font-semibold text-xs text-slate-100 mb-1 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
