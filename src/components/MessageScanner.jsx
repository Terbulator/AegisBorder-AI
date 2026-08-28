import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  UserX, 
  UserCheck, 
  Lock, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { analyzeMessage } from '../engine/codeMixedNlp';
import RiskResultCard from './RiskResultCard';
import VoiceAssistant from './VoiceAssistant';

export default function MessageScanner({ 
  currentLang = 'hi', 
  onOpenReport, 
  onMintBlock,
  initialText = ''
}) {
  const [inputText, setInputText] = useState(initialText);
  const [isKnownContact, setIsKnownContact] = useState(false);
  const [senderInfo, setSenderInfo] = useState('+91 98765 43210 (Unknown Number)');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      snippet: "Dear customer aapka bijli bill update nahi hai...",
      sender: "Unknown Number",
      risk: "High Risk",
      time: "10 mins ago"
    }
  ]);

  const sampleMessages = [
    {
      title: "Electricity Bill Scam",
      text: "Dear customer aapka bijli bill update nahi hai, aaj raat 9 baje connection cut jayega. Call electricity nodal officer 9876543210 immediately to avoid disconnection.",
      sender: "+91 98765 43210 (Unknown Number)",
      known: false
    },
    {
      title: "SBI Bank KYC Scam",
      text: "Dear SBI User, your YONO NetBanking will be blocked today due to pending KYC update. Click http://sbi-bank-kyc-update.top to reactivate account.",
      sender: "+91 87654 32109 (Unknown SMS)",
      known: false
    },
    {
      title: "Safe Friend's Message",
      text: "Hey, check this photo link http://trip-photos-share.top from yesterday's family picnic!",
      sender: "Rahul (Saved in Phonebook)",
      known: true
    }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAnalyze = (
    textToAnalyze = inputText, 
    known = isKnownContact, 
    sender = senderInfo
  ) => {
    if (!textToAnalyze.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 300);

    setTimeout(() => {
      const res = analyzeMessage(textToAnalyze, currentLang, {
        isKnownContact: known,
        senderInfo: sender
      });
      setResult(res);
      setIsScanning(false);
      setScanStep(0);

      // Save to recent scans history
      const newHistoryItem = {
        id: Date.now(),
        snippet: textToAnalyze.slice(0, 45) + (textToAnalyze.length > 45 ? "..." : ""),
        sender: known ? "Saved Contact" : "Unknown Number",
        risk: res.riskScore >= 80 ? "High Risk" : res.riskScore >= 40 ? "Caution" : "Safe",
        time: "Just now",
        fullText: textToAnalyze,
        known,
        senderInfo: sender
      };
      setScanHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);
    }, 650);
  };

  const handleCopyMessage = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    showToast("✓ Message copied to clipboard!");
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    showToast("Message cleared.");
  };

  return (
    <div className="space-y-6">

      {/* Temporary Feedback Toast */}
      {toastMessage && (
        <div className="p-3 bg-[var(--text-primary)] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}
      
      {/* Input Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Check Message Safety (मैसेज की जांच करें)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Paste any suspicious SMS or WhatsApp message to verify if it is safe
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

        {/* Reassuring Privacy & Sender Toggle */}
        <div className="mb-4 p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Who sent this message? (संदेश किसने भेजा?)
            </span>
          </div>
          
          {/* Plain Sender Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)] shrink-0">
            <button
              onClick={() => {
                setIsKnownContact(false);
                setSenderInfo('+91 98765 43210 (Unknown Number)');
                if (inputText) handleAnalyze(inputText, false, '+91 98765 43210 (Unknown Number)');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                !isKnownContact 
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Unknown Number (अज्ञात नंबर)</span>
            </button>
            <button
              onClick={() => {
                setIsKnownContact(true);
                setSenderInfo('Mom / Friend (Saved in Phonebook)');
                if (inputText) handleAnalyze(inputText, true, 'Mom / Friend (Saved in Phonebook)');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isKnownContact 
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Saved Contact (सहेजा गया नंबर)</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious SMS or WhatsApp text here... (यहाँ संदेश पेस्ट करें)"
            className="w-full p-4 input-clean resize-none text-sm sm:text-base leading-relaxed"
          />
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold text-[var(--text-muted)]">Try an example:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                setIsKnownContact(sample.known);
                setSenderInfo(sample.sender);
                handleAnalyze(sample.text, sample.known, sample.sender);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                sample.known 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            {inputText && (
              <>
                <button
                  onClick={handleCopyMessage}
                  className="btn-secondary text-xs py-2 px-3"
                  title="Copy message"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={handleClear}
                  className="btn-secondary text-xs py-2 px-3"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim() || isScanning}
            className="btn-primary text-sm sm:text-base px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Message...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Check If It's Safe (सुरक्षा जांचें)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Realistic Scanning Loader State */}
      {isScanning && (
        <div className="card p-6 border-[var(--primary-border)] bg-[var(--primary-subtle)] space-y-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Checking message with Rakshak AI Safety Shield...
            </h4>
          </div>
          <div className="space-y-1.5 text-xs text-[var(--text-secondary)] pl-8">
            <p className={scanStep >= 1 ? 'font-bold text-[var(--primary)]' : 'opacity-60'}>
              ✓ 1. Comparing against 50,000+ known Indian scam patterns...
            </p>
            <p className={scanStep >= 2 ? 'font-bold text-[var(--primary)]' : 'opacity-60'}>
              {scanStep >= 2 ? '✓' : '•'} 2. Checking Hindi, English & Romanized vernacular words...
            </p>
          </div>
        </div>
      )}

      {/* Result Card State */}
      {result && !isScanning && (
        <RiskResultCard
          result={result}
          currentLang={currentLang}
          onOpenReport={onOpenReport}
          onMintBlock={onMintBlock}
        />
      )}

      {/* Empty State with 3-Second Rule Guide */}
      {!result && !isScanning && (
        <div className="card p-6 bg-[var(--bg-surface)] text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-[var(--primary)]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[var(--text-primary)]">
            How Rakshak AI Protects You (रक्षक AI कैसे मदद करता है):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto pt-2">
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-[var(--primary)] block mb-1">1. Paste Message</span>
              <p className="text-xs text-[var(--text-secondary)]">Copy and paste any SMS or WhatsApp message asking for money or KYC.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-[var(--primary)] block mb-1">2. Instant Scan</span>
              <p className="text-xs text-[var(--text-secondary)]">Rakshak inspects urgent threats and fake links in Hindi and English.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-[var(--primary)] block mb-1">3. Clear Next Steps</span>
              <p className="text-xs text-[var(--text-secondary)]">Get plain advice on what to do and report fraud directly to 1930.</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Scans History Section */}
      {scanHistory.length > 0 && (
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--text-muted)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Recent Scans (हाल ही में की गई जांच)
              </h4>
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Session History</span>
          </div>

          <div className="space-y-2">
            {scanHistory.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <p className="font-semibold text-[var(--text-primary)] truncate">{item.snippet}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{item.sender} • {item.time}</p>
                </div>
                <span className={item.risk === "High Risk" ? "badge-danger" : item.risk === "Caution" ? "badge-warning" : "badge-safe"}>
                  {item.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
