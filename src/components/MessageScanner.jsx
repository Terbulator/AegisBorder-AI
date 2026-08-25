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
      title: "Hinglish Electricity Disconnection",
      text: "Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity officer 9876543210 immediately.",
      sender: "+91 98765 43210 (Unknown Sender)",
      known: false
    },
    {
      title: "SBI Bank KYC Suspension",
      text: "Dear SBI User, your YONO account is blocked today due to pending KYC update. Click http://sbi-bank-kyc-update.top to reactivate.",
      sender: "+91 87654 32109 (Unknown SMS)",
      known: false
    },
    {
      title: "Trusted Friend WhatsApp Link (Known Contact)",
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
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SMS & WhatsApp Message Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Phonetic N-gram NLP for Hinglish, Tanglish, and Regional Urgency Scams
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

        {/* Privacy Rule Highlight Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-cyan-200">
              <strong>Unknown Sender Protocol:</strong> Links & messages are <em>ONLY</em> scanned when sent by unknown/unsaved numbers. Trusted contacts are never intrusively checked.
            </span>
          </div>
          
          {/* Sender Toggle */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                setIsKnownContact(false);
                setSenderInfo('+91 98765 43210 (Unknown Number)');
                if (inputText) handleAnalyze(inputText, false, '+91 98765 43210 (Unknown Number)');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                !isKnownContact 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserX className="w-3 h-3 text-red-400" />
              <span>Unknown Number ⚠️</span>
            </button>
            <button
              onClick={() => {
                setIsKnownContact(true);
                setSenderInfo('Mom / Friend (Saved Contact)');
                if (inputText) handleAnalyze(inputText, true, 'Mom / Friend (Saved Contact)');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                isKnownContact 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>Saved Contact 👤</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp forward, or Hinglish threat message here (e.g. 'Aapka bijli connection aaj raat kat jayega...')"
            className="w-full p-4 rounded-2xl bg-black/40 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-sans"
          />
        </div>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400 font-mono">Sample Attacks:</span>
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
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border-slate-700'
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Code-Mixed Threat</span>
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
