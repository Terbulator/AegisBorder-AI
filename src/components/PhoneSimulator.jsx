import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  ExternalLink, 
  Lock, 
  Send, 
  UserX, 
  UserCheck, 
  Sparkles, 
  Wifi, 
  Battery, 
  Signal, 
  Zap,
  ArrowRight,
  AlertTriangle,
  Play
} from 'lucide-react';
import { speakText } from './VoiceAssistant';
import { analyzeMessage } from '../engine/codeMixedNlp';

const SIMULATED_ATTACKS = [
  {
    id: 'sim-electricity',
    sender: '+91 98765 43210',
    senderName: 'Unknown Number (Unsaved)',
    isKnown: false,
    app: 'WhatsApp',
    time: 'Just now',
    text: 'Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity nodal officer 9876543210 immediately.',
    voiceAlert: 'सावधान! अज्ञात नंबर से बिजली काटने का फर्जी मैसेज आया है। किसी नंबर पर कॉल न करें।'
  },
  {
    id: 'sim-sbi-kyc',
    sender: '+91 87654 32109',
    senderName: 'Unknown SMS Gateway (Unsaved)',
    isKnown: false,
    app: 'SMS Messages',
    time: '2m ago',
    text: 'SBI Alert: Your YONO NetBanking will be suspended today due to pending KYC. Click http://sbi-bank-kyc-update.top to update PAN immediately.',
    voiceAlert: 'चेतावनी! फर्जी बैंक वेबसाइट का लिंक भेजा गया है। इसे न खोलें।'
  },
  {
    id: 'sim-upi-cashback',
    sender: '+91 70012 34567',
    senderName: 'Unknown WhatsApp Sender',
    isKnown: false,
    app: 'WhatsApp',
    time: '5m ago',
    text: 'Congratulations! ₹4,999 Cashback approved on Paytm. Scan QR code and enter UPI PIN to receive money into your bank.',
    voiceAlert: 'रुकिए! पैसे पाने के लिए कभी भी यूपीआई पिन दर्ज न करें।'
  },
  {
    id: 'sim-known-contact',
    sender: '+91 98111 22334',
    senderName: 'Mom (Saved in Phonebook)',
    isKnown: true,
    app: 'WhatsApp',
    time: '10m ago',
    text: 'Beta ghar aate waqt fruits le aana. Check this recipe: https://recipes.com/healthy-salad',
    voiceAlert: 'संदेश आपके सहेजे गए संपर्क से है। स्कैनिंग छोड़ दी गई है।'
  }
];

export default function PhoneSimulator({ 
  currentLang, 
  onTriggerMicroFriction, 
  onOpenSandbox,
  onOpenReport 
}) {
  const [selectedAttack, setSelectedAttack] = useState(SIMULATED_ATTACKS[0]);
  const [isSimulatingIncoming, setIsSimulatingIncoming] = useState(false);
  const [floatingOverlayActive, setFloatingOverlayActive] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(() => 
    analyzeMessage(SIMULATED_ATTACKS[0].text, currentLang, { 
      isKnownContact: SIMULATED_ATTACKS[0].isKnown,
      senderInfo: SIMULATED_ATTACKS[0].senderName
    })
  );

  const handleTriggerIncoming = (attack) => {
    setSelectedAttack(attack);
    setIsSimulatingIncoming(true);
    setFloatingOverlayActive(false);

    // Simulate network delay of incoming WhatsApp notification
    setTimeout(() => {
      setIsSimulatingIncoming(false);
      setFloatingOverlayActive(true);
      const res = analyzeMessage(attack.text, currentLang, {
        isKnownContact: attack.isKnown,
        senderInfo: attack.senderName
      });
      setAnalysisResult(res);

      // Proactively speak audio alert without any user interaction if threat from unknown number
      if (!attack.isKnown && res.isThreat) {
        speakText(attack.voiceAlert, currentLang);
      }
    }, 600);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Top Banner explaining Zero-Copy-Paste */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Zero-Copy-Paste OS Interception Simulator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Android Service Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrates automatic on-device interception without forcing first-time users to copy-paste or switch apps
            </p>
          </div>
        </div>

        {/* Live Scenario Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">Incoming Scenarios:</span>
          {SIMULATED_ATTACKS.map((atk) => (
            <button
              key={atk.id}
              onClick={() => handleTriggerIncoming(atk)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border flex items-center gap-1.5 ${
                selectedAttack.id === atk.id
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span>{atk.senderName.split(' ')[0]} {atk.isKnown ? '👤' : '⚠️'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Phone Mockup & Real-Time Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Android Mobile Mockup (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] rounded-[38px] bg-slate-950 border-[6px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative font-sans">
            
            {/* Mobile Top Bezel & Camera */}
            <div className="h-6 bg-black flex items-center justify-between px-5 text-[10px] text-slate-400 font-mono select-none">
              <span>09:41</span>
              <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 text-slate-300" />
                <Wifi className="w-3 h-3 text-cyan-400" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* WhatsApp / SMS In-App Header */}
            <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedAttack.isKnown ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white animate-pulse'
                }`}>
                  {selectedAttack.isKnown ? '👤' : '⚠️'}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight truncate max-w-[150px]">
                    {selectedAttack.sender}
                  </div>
                  <div className="text-[10px] text-emerald-200 opacity-90 flex items-center gap-1 font-mono">
                    {selectedAttack.isKnown ? (
                      <span className="text-emerald-300">✓ Saved Contact</span>
                    ) : (
                      <span className="text-amber-300 font-bold">⚠ Unsaved Number</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rakshak Background Indicator Pill */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Rakshak OS</span>
              </div>
            </div>

            {/* Simulated Chat Message Canvas */}
            <div className="h-[360px] bg-[#0b141a] p-3 flex flex-col justify-end space-y-3 overflow-y-auto relative">
              
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-slate-100 font-mono text-4xl font-black rotate-[-30deg]">
                WHATSAPP
              </div>

              {/* Incoming Message Bubble */}
              <div className={`max-w-[88%] p-3 rounded-2xl rounded-tl-sm text-xs leading-relaxed shadow-lg relative ${
                selectedAttack.isKnown
                  ? 'bg-[#1f2c34] text-slate-200 border border-slate-700/60'
                  : 'bg-[#2a1215] text-red-100 border border-red-500/40'
              }`}>
                {!selectedAttack.isKnown && (
                  <div className="text-[10px] text-red-400 font-bold mb-1 flex items-center gap-1">
                    <UserX className="w-3 h-3" />
                    <span>Unsaved Sender ({selectedAttack.sender})</span>
                  </div>
                )}

                <p className="font-sans text-[11px] leading-relaxed">
                  {selectedAttack.text}
                </p>

                <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                  {selectedAttack.time}
                </div>
              </div>

              {/* ZERO-CLICK FLOATING SYSTEM ALERT BUBBLE (SYSTEM_ALERT_WINDOW) */}
              {floatingOverlayActive && !selectedAttack.isKnown && analysisResult.isThreat && (
                <div className="p-3 rounded-2xl bg-red-950/95 border-2 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-bounce-short z-20 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-1.5 border-b border-red-500/40 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-red-300 font-mono uppercase">
                        Rakshak Alert
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-red-300 bg-red-900/80 px-1.5 py-0.5 rounded">
                      Zero-Click
                    </span>
                  </div>

                  <p className="text-[11px] text-white font-medium leading-snug mb-2">
                    {analysisResult.title}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakText(selectedAttack.voiceAlert, currentLang)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-md"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Warning</span>
                    </button>
                    
                    {selectedAttack.id === 'sim-upi-cashback' ? (
                      <button
                        onClick={() => onTriggerMicroFriction && onTriggerMicroFriction({
                          amount: 4999,
                          payeeName: "PaytmReward",
                          vpa: "cashback-claim@ybl",
                          hasDeceptiveIntent: true
                        })}
                        className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold"
                      >
                        Block Gate
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenSandbox && onOpenSandbox({
                          spoofedTarget: "State Bank of India",
                          officialDomain: "sbi.co.in",
                          officialHelpline: "1800 1234",
                          domain: "sbi-bank-kyc-update.top"
                        })}
                        className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold"
                      >
                        Sandbox
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PRIVACY BYPASS BANNER IF KNOWN CONTACT */}
              {floatingOverlayActive && selectedAttack.isKnown && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Privacy Guard:</strong> Known Contact from Phonebook. Deep scanning bypassed.
                  </span>
                </div>
              )}

            </div>

            {/* Mobile Bottom Home Bar */}
            <div className="h-5 bg-black flex items-center justify-center">
              <div className="w-24 h-1 bg-slate-700 rounded-full" />
            </div>

          </div>
        </div>

        {/* Right: How It Solves The First-Time User Problem (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>How Zero-Copy-Paste Works in 3 Automatic Steps</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-semibold text-slate-200">
                    Proactive OS Broadcast Interception
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Android <code className="text-cyan-300 font-mono">NotificationListenerService</code> captures incoming WhatsApp & SMS notifications before the user even unlocks the screen.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-semibold text-slate-200">
                    Contacts Whitelist & Sub-2ms Bloom Filtering
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Checks if the sender is in saved contacts. If <strong>Unknown</strong>, the sub-2ms on-device Bloom filter & Hinglish NLP inspect links and urgency patterns in memory.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-semibold text-slate-200">
                    Spoken Voice Alert & Truecaller-Style Floating Shield
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    An immediate Hindi/regional audio warning plays aloud (<code className="text-cyan-300 font-mono">Web Speech / TTS</code>) and a floating red shield pops over WhatsApp so non-literate users never have to read jargon.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Current Scenario Telemetry
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                selectedAttack.isKnown
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {selectedAttack.isKnown ? 'KNOWN SENDER' : 'UNKNOWN SENDER'}
              </span>
            </div>

            <div className="text-xs text-slate-200 font-semibold mb-1">
              {analysisResult.title}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {typeof analysisResult.explanation === 'object'
                ? (analysisResult.explanation[currentLang] || analysisResult.explanation.en)
                : analysisResult.explanation}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(selectedAttack.voiceAlert, currentLang)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Voice Warning (आवाज़ सुनें)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
