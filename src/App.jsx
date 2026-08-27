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
    { id: 'phone', label: 'Phone Simulator', icon: Shield },
    { id: 'message', label: 'Messages', icon: MessageSquare },
    { id: 'url', label: 'Link Checker', icon: Globe },
    { id: 'qr', label: 'QR & UPI', icon: QrCode },
    { id: 'apk', label: 'App Scanner', icon: ShieldAlert },
    { id: 'blockchain', label: 'Threat Ledger', icon: Database },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      
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
        
        {/* Quick Demo Bench */}
        <JudgePresetBar
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/[0.06] px-1 pt-2 animate-fade-in stagger-2">
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
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap border ${
                  isActive
                    ? 'bg-cyber-accent/10 border-cyber-accent/30 text-cyber-accent'
                    : 'bg-transparent hover:bg-white/[0.04] border-transparent hover:border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-cyber-accent' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div className="animate-fade-in stagger-3">
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
            <div className="glass-panel rounded-2xl p-8 border border-white/[0.06] text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-sky-500/12 text-sky-400 flex items-center justify-center mx-auto">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Threat Ledger Explorer
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Decentralized, tamper-proof threat ledger verified by National Cyber Crime Cell, RBI Partner Banks, and Telecom authorities.
              </p>
              <button
                onClick={() => setIsLedgerOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-cyber-accent/90 hover:bg-cyber-accent text-white font-semibold text-xs transition-all"
              >
                Open Explorer
              </button>
            </div>
          )}
        </div>

        {/* What We Protect Against */}
        <section className="mt-14 p-6 rounded-2xl glass-panel relative overflow-hidden animate-fade-in stagger-4">
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="p-2 rounded-lg bg-cyber-neon/12 border border-cyber-neon/20 text-cyber-neon">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              What We Protect Against
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs relative z-10">
            {[
              { id: 1, title: 'Real-World UX', desc: 'Automatic notification interception — no copy-paste needed from users.' },
              { id: 2, title: 'Regional Languages', desc: 'Understands Hinglish, Tanglish & Telglish urgency scam patterns.' },
              { id: 3, title: 'Malicious Apps', desc: 'Detects dangerous permissions before harmful apps can be installed.' },
              { id: 4, title: 'Offline Protection', desc: 'Works without internet using a compact on-device threat database.' },
              { id: 5, title: 'Community Shield', desc: 'Verified threat reports shared across a trusted consortium network.' }
            ].map((spot) => (
              <div key={spot.id} className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5">
                <div className="font-semibold text-cyber-accent mb-1.5 flex items-center gap-2">
                  <span className="text-[10px] bg-cyber-accent/12 px-1.5 py-0.5 rounded text-cyber-accent opacity-60">{spot.id}</span>
                  {spot.title}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed group-hover:text-slate-300 transition-colors">
                  {spot.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-cyber-dark/50 backdrop-blur-md px-4 py-5 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyber-accent" />
            <span className="text-slate-200 font-medium">Rakshak AI</span> 
            <span className="opacity-40">• Cybersecurity & Blockchain Solution</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">On-Device Privacy</span>
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              Helpline: <strong className="text-slate-200">1930</strong>
            </span>
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
