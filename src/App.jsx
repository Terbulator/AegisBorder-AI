import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MessageSquare, 
  Globe, 
  QrCode, 
  ShieldAlert, 
  Database, 
  Zap, 
  Lock, 
  Activity, 
  Layers,
  Sparkles,
  PhoneCall,
  Info
} from 'lucide-react';

import Header from './components/Header';
import JudgePresetBar from './components/JudgePresetBar';
import NotificationSimulator from './components/NotificationSimulator';
import MicroFrictionModal from './components/MicroFrictionModal';
import SafeSandboxModal from './components/SafeSandboxModal';
import IncidentReportModal from './components/IncidentReportModal';
import BlockchainLedger from './components/BlockchainLedger';
import PhoneSimulator from './components/PhoneSimulator';

import MessageScanner from './components/MessageScanner';
import UrlScanner from './components/UrlScanner';
import QrScanner from './components/QrScanner';
import ApkPermScanner from './components/ApkPermScanner';

import { globalBloomFilter } from './engine/bloomFilter';
import { globalPoaBlockchain } from './engine/poaBlockchainSim';
import { speakText } from './components/VoiceAssistant';
import { REGIONAL_STRINGS } from './engine/regionalDictionary';

export default function App() {
  const [currentLang, setCurrentLang] = useState('hi');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [activeTab, setActiveTab] = useState('message');
  const [activePresetId, setActivePresetId] = useState(null);

  // Modals & Popups State
  const [activeNotification, setActiveNotification] = useState(null);
  const [microFrictionUpi, setMicroFrictionUpi] = useState(null);
  const [sandboxThreat, setSandboxThreat] = useState(null);
  const [reportThreat, setReportThreat] = useState(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  // Bloom Filter Stats State
  const [bloomStats, setBloomStats] = useState(() => globalBloomFilter.getStats());

  // Input states for tabs
  const [messageInitialText, setMessageInitialText] = useState('');
  const [urlInitialText, setUrlInitialText] = useState('');
  const [qrInitialPayload, setQrInitialPayload] = useState('');
  const [apkInitialUrl, setApkInitialUrl] = useState('');

  // Handle 1-Click Judge Evaluation Presets
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setActiveTab(preset.targetTab);

    if (preset.id === 'preset-hinglish-sms') {
      setMessageInitialText(preset.data.message);
      // Simulate OS Background Interception Notification Banner
      setActiveNotification({
        app: 'WhatsApp / SMS Message Intercepted',
        sender: '+91 98765 43210 (Unknown Number - Triggered Deep Scan)',
        title: 'High Urgency Utility Disconnection Threat',
        message: preset.data.message,
        category: 'URGENCY_UTILITY_FRAUD'
      });
      // Speak audio warning in selected language
      speakText("सावधान! बिजली कनेक्शन काटने का फर्जी संदेश आया है। दिए गए नंबर पर कॉल न करें।", currentLang);
    } 
    else if (preset.id === 'preset-typosquat-url') {
      setUrlInitialText(preset.data.url);
    } 
    else if (preset.id === 'preset-upi-trap') {
      setQrInitialPayload(preset.data.qrPayload);
      // Automatically trigger Micro-Friction Gate
      setMicroFrictionUpi({
        amount: 4999,
        payeeName: "PaytmReward (cashback-claim@ybl)",
        vpa: "cashback-claim@ybl",
        hasDeceptiveIntent: true
      });
      speakText("रुकिए! आप 4999 रुपये भेज रहे हैं। कैशबैक पाने के लिए कभी पिन न डालें।", currentLang);
    } 
    else if (preset.id === 'preset-malicious-apk') {
      setApkInitialUrl(preset.data.apkUrl);
    } 
    else if (preset.id === 'preset-poa-block') {
      setIsLedgerOpen(true);
    }
  };

  const handleMintFromThreat = (threat) => {
    const target = threat.domain || threat.vpa || threat.appName || threat.fullUrl || "Unknown Target";
    const type = threat.category || (threat.isApk ? "RAT_MALWARE_APK" : threat.vpa ? "DECEPTIVE_UPI_VPA" : "PHISHING_DOMAIN");
    
    globalPoaBlockchain.addVerifiedBlock(
      target,
      type,
      `Reported via Rakshak AI Client Engine. Forensic score: ${threat.riskScore}/100.`
    );
    globalBloomFilter.add(target);
    setBloomStats(globalBloomFilter.getStats());
    setIsLedgerOpen(true);
  };

  const tabs = [
    { id: 'phone', label: 'Zero-Copy Phone Simulator', icon: Shield, badge: 'Android OS UX' },
    { id: 'message', label: 'SMS & WhatsApp (Indic NLP)', icon: MessageSquare, badge: 'Hinglish/Tanglish' },
    { id: 'url', label: 'Banking & URLs (Levenshtein)', icon: Globe, badge: 'Typosquatting' },
    { id: 'qr', label: 'UPI QR & Pay (Micro-Gate)', icon: QrCode, badge: 'Debit Trap' },
    { id: 'apk', label: 'APK & RAT Auditor', icon: ShieldAlert, badge: 'Permissions' },
    { id: 'blockchain', label: 'PoA Consortium Explorer', icon: Database, badge: 'Sybil Immune' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOfflineMode={isOfflineMode}
        onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
        bloomStats={bloomStats}
        onOpenLedger={() => setIsLedgerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Hackathon Judge 1-Click Preset Evaluation Bench */}
        <JudgePresetBar
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'blockchain') {
                    setIsLedgerOpen(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div className="animate-fade-in">
          {activeTab === 'phone' && (
            <PhoneSimulator
              currentLang={currentLang}
              onTriggerMicroFriction={(upi) => setMicroFrictionUpi(upi)}
              onOpenSandbox={(t) => setSandboxThreat(t)}
              onOpenReport={(t) => setReportThreat(t)}
            />
          )}

          {activeTab === 'message' && (
            <MessageScanner
              currentLang={currentLang}
              onOpenReport={(t) => setReportThreat(t)}
              onMintBlock={handleMintFromThreat}
              initialText={messageInitialText}
            />
          )}

          {activeTab === 'url' && (
            <UrlScanner
              currentLang={currentLang}
              onOpenSandbox={(t) => setSandboxThreat(t)}
              onOpenReport={(t) => setReportThreat(t)}
              onMintBlock={handleMintFromThreat}
              initialUrl={urlInitialText}
            />
          )}

          {activeTab === 'qr' && (
            <QrScanner
              currentLang={currentLang}
              onTriggerMicroFriction={(upi) => setMicroFrictionUpi(upi)}
              onOpenReport={(t) => setReportThreat(t)}
              onMintBlock={handleMintFromThreat}
              initialPayload={qrInitialPayload}
            />
          )}

          {activeTab === 'apk' && (
            <ApkPermScanner
              currentLang={currentLang}
              onOpenReport={(t) => setReportThreat(t)}
              onMintBlock={handleMintFromThreat}
              initialApk={apkInitialUrl}
            />
          )}

          {activeTab === 'blockchain' && (
            <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Proof-of-Authority Consortium Blockchain Explorer
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Decentralized, Sybil-immune threat ledger verified by National Cyber Crime Cell, RBI Partner Banks, and Telecom authorities.
              </p>
              <button
                onClick={() => setIsLedgerOpen(true)}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Open Full Screen Explorer & Mint Blocks
              </button>
            </div>
          )}
        </div>

        {/* 5 Blind Spots Architecture Summary Card */}
        <section className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              The 5 Critical Domain Blind Spots Solved
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
              <div className="font-bold text-cyan-300 mb-1">1. UX Reality Check</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Passive OS notification interception simulator — zero manual copy-paste burden.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
              <div className="font-bold text-cyan-300 mb-1">2. Code-Mixed NLP</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Phonetic N-gram engine for Hinglish, Tanglish & Telglish urgency scams.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
              <div className="font-bold text-cyan-300 mb-1">3. APK & RAT Auditor</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Audits Accessibility & SMS reading rights before malicious sideloading.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
              <div className="font-bold text-cyan-300 mb-1">4. Offline Resilience</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sub-2ms compressed Bloom filter storing 50k+ threat hashes with zero network.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
              <div className="font-bold text-cyan-300 mb-1">5. PoA Anti-Poisoning</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Multi-sig consortium consensus stops scammers from poisoning merchant trust.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-cyber-dark px-4 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <div>
            Rakshak AI • BC-01 Cybersecurity & Blockchain Solution
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              On-Device Privacy Preserving
            </span>
            <span>National Cyber Helpline: <strong>1930</strong></span>
          </div>
        </div>
      </footer>

      {/* OS Notification Interceptor Pop-up */}
      <NotificationSimulator
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onInspect={() => {
          setActiveTab('message');
          setActiveNotification(null);
        }}
        onPlayVoice={() => {
          if (activeNotification) {
            speakText(activeNotification.message, currentLang);
          }
        }}
      />

      {/* Micro-Friction Active Gate Modal */}
      <MicroFrictionModal
        isOpen={!!microFrictionUpi}
        onClose={() => setMicroFrictionUpi(null)}
        upiDetails={microFrictionUpi}
        currentLang={currentLang}
        onPlayVoice={() => {
          speakText("रुकिए! आप पैसे भेज रहे हैं। यूपीआई पिन केवल पैसे भेजने के लिए होता है, कैशबैक पाने के लिए नहीं।", currentLang);
        }}
      />

      {/* Safe Sandbox Modal */}
      <SafeSandboxModal
        isOpen={!!sandboxThreat}
        onClose={() => setSandboxThreat(null)}
        threatData={sandboxThreat}
      />

      {/* Incident Report 1930 Modal */}
      <IncidentReportModal
        isOpen={!!reportThreat}
        onClose={() => setReportThreat(null)}
        threatData={reportThreat}
      />

      {/* PoA Blockchain Explorer Modal */}
      <BlockchainLedger
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />

    </div>
  );
}
