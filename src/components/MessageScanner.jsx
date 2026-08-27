import React, { useState } from 'react';
import { MessageSquare, AlertCircle, Sparkles, Send, RefreshCw, Volume2, UserX, UserCheck, ShieldCheck, Lock } from 'lucide-react';
import { analyzeMessage } from '../engine/codeMixedNlp';
import RiskResultCard from './RiskResultCard';
import VoiceAssistant from './VoiceAssistant';

export default function MessageScanner({ 
  currentLang, 
  onOpenReport, 
  onMintBlock,
  initialText = ''
}) {
  const [inputText, setInputText] = useState(initialText);
  const [isKnownContact, setIsKnownContact] = useState(false);
  const [senderInfo, setSenderInfo] = useState('+91 98765 43210 (Unknown Number)');
  const [result, setResult] = useState(null);

  const sampleMessages = [
    {
      title: "Hinglish Electricity Scam",
      text: "Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity officer 9876543210 immediately.",
      sender: "+91 98765 43210 (Unknown Sender)",
      known: false
    },
    {
      title: "SBI Bank KYC Phishing",
      text: "Dear SBI User, your YONO account is blocked today due to pending KYC update. Click http://sbi-bank-kyc-update.top to reactivate.",
      sender: "+91 87654 32109 (Unknown SMS)",
      known: false
    },
    {
      title: "Safe Friend's Link",
      text: "Hey check this photo link http://trip-photos-share.top from yesterday's picnic!",
      sender: "Rahul (Saved Contact / Phonebook)",
      known: true
    }
  ];

  const handleAnalyze = (
    textToAnalyze = inputText, 
    known = isKnownContact, 
    sender = senderInfo
  ) => {
    if (!textToAnalyze.trim()) return;
    const res = analyzeMessage(textToAnalyze, currentLang, {
      isKnownContact: known,
      senderInfo: sender
    });
    setResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/12 text-sky-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Message Safety Check
              </h3>
              <p className="text-xs text-slate-400">
                Paste any suspicious message to check if it's safe
              </p>
            </div>
          </div>

          <VoiceAssistant 
            currentLang={currentLang}
            onVoiceInput={(spokenText) => {
              setInputText(spokenText);
              handleAnalyze(spokenText);
            }}
          />
        </div>

        {/* Privacy Banner */}
        <div className="mb-4 p-3 rounded-xl bg-sky-950/30 border border-sky-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-sky-200/80">
              Messages from <strong>saved contacts</strong> are not scanned for privacy.
            </span>
          </div>
          
          {/* Sender Toggle */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.06] shrink-0">
            <button
              onClick={() => {
                setIsKnownContact(false);
                setSenderInfo('+91 98765 43210 (Unknown Number)');
                if (inputText) handleAnalyze(inputText, false, '+91 98765 43210 (Unknown Number)');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                !isKnownContact 
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserX className="w-3 h-3 text-rose-400" />
              <span>Unknown</span>
            </button>
            <button
              onClick={() => {
                setIsKnownContact(true);
                setSenderInfo('Mom / Friend (Saved Contact)');
                if (inputText) handleAnalyze(inputText, true, 'Mom / Friend (Saved Contact)');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                isKnownContact 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>Saved Contact</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a suspicious SMS or WhatsApp message here..."
            className="w-full p-4 rounded-xl bg-black/30 border border-white/[0.08] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-accent/40 focus:ring-1 focus:ring-cyber-accent/20 transition-all"
          />
        </div>

        {/* Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400">Try a sample:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                setIsKnownContact(sample.known);
                setSenderInfo(sample.sender);
                handleAnalyze(sample.text, sample.known, sample.sender);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                sample.known 
                  ? 'bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-300 border-emerald-500/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 border-white/[0.08]'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Analyze Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setInputText('');
              setResult(null);
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check Message</span>
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}

    </div>
  );
}
