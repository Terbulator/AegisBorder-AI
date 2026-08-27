import React from 'react';
import { Play, Sparkles, MessageSquare, Globe, QrCode, ShieldAlert, Database } from 'lucide-react';

export const DEMO_PRESETS = [
  {
    id: 'preset-hinglish-sms',
    title: 'Hinglish Utility Scam',
    tag: 'Indic NLP',
    icon: MessageSquare,
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-500/30',
    description: 'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega...',
    targetTab: 'message',
    data: {
      message: 'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity nodal officer immediately 9876543210 to avoid penalty.'
    }
  },
  {
    id: 'preset-typosquat-url',
    title: 'SBI Bank Typosquatting',
    tag: 'Link Check',
    icon: Globe,
    badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-200 border-rose-500/30',
    description: 'http://sbi-bank-kyc-update.top/login.php (Spoofing sbi.co.in)',
    targetTab: 'url',
    data: {
      url: 'http://sbi-bank-kyc-update.top/login.php'
    }
  },
  {
    id: 'preset-upi-trap',
    title: 'UPI QR "Receive" Trap',
    tag: 'Payment Gate',
    icon: QrCode,
    badgeColor: 'from-violet-500/20 to-purple-500/20 text-purple-200 border-violet-500/30',
    description: 'upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward',
    targetTab: 'qr',
    data: {
      qrPayload: 'upi://pay?pa=cashback-claim@ybl&am=4999&pn=PaytmReward&tn=Congratulations+Claim+4999+Cashback'
    }
  },
  {
    id: 'preset-malicious-apk',
    title: 'Malicious APK RAT',
    tag: 'App Audit',
    icon: ShieldAlert,
    badgeColor: 'from-red-500/20 to-pink-500/20 text-red-200 border-red-500/30',
    description: 'http://customer-support-app.net/AnyDesk_Support.apk',
    targetTab: 'apk',
    data: {
      apkUrl: 'http://customer-support-app.net/AnyDesk_Support.apk'
    }
  },
  {
    id: 'preset-poa-block',
    title: 'Consortium Blockchain',
    tag: 'Blockchain',
    icon: Database,
    badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-200 border-sky-500/30',
    description: 'Report scam-paytm@ybl → Cyber Cell + RBI Bank Multi-Sig Minting',
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
    <section className="mb-8 p-5 rounded-2xl glass-panel relative overflow-hidden animate-fade-in stagger-1">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyber-accent/12 to-cyber-neon/15 border border-cyber-accent/20 text-cyber-accent">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-wide text-white flex items-center gap-3">
              <span>Try It Out</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20 font-medium tracking-wider">
                Interactive
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any scenario below to see Rakshak AI in action:
            </p>
          </div>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
        {DEMO_PRESETS.map((preset, index) => {
          const Icon = preset.icon;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              style={{ animationDelay: `${100 + index * 40}ms` }}
              className={`group text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between animate-fade-in ${
                isActive
                  ? 'glass-panel-glow -translate-y-0.5'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border bg-gradient-to-r ${preset.badgeColor}`}>
                    {preset.tag}
                  </span>
                  <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-cyber-accent/15' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'}`}>
                    <Play className={`w-3 h-3 transition-all ${isActive ? 'text-cyber-accent opacity-100' : 'text-slate-400 opacity-50 group-hover:opacity-80 group-hover:text-white'}`} />
                  </div>
                </div>
                <div className={`font-semibold text-sm mb-1.5 line-clamp-1 transition-colors ${isActive ? 'text-cyber-accent' : 'text-slate-200 group-hover:text-white'}`}>
                  {preset.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
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
