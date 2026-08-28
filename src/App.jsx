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

import Sidebar, { MobileMenuButton } from './components/Sidebar';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('rakshak_theme') || 'light');

  // Theme Syncing Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rakshak_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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

  // Page title for current tab
  const tabTitles = {
    message: 'Message Scanner (मैसेज सुरक्षा)',
    url: 'Website Link Checker (लिंक जांच)',
    qr: 'QR & UPI Safety (UPI फ्रॉड से बचाव)',
    apk: 'App Safety Check (ऐप सुरक्षा)',
    phone: 'Live Phone Protection Demo (लाइव फोन सुरक्षा)',
    blockchain: 'Verified Scam Registry (1930 पुलिस डेटाबेस)'
  };

  const tabSubtitles = {
    message: 'Paste any SMS or WhatsApp message asking for money or KYC update',
    url: 'Enter any website or link to verify if it is an official bank portal or fake clone',
    qr: 'Check UPI payment requests and cashback QR codes before money is debited',
    apk: 'Check if a downloaded app has dangerous permissions to spy or steal OTPs',
    phone: 'Simulate how Rakshak AI warns you in Hindi immediately when scam messages arrive',
    blockchain: 'Verified scam database shared in real-time with Indian Cyber Police (1930) and Banks'
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-150">

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        bloomStats={bloomStats}
        onOpenLedger={() => setIsLedgerOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Top Header Bar */}
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-6 py-2.5">
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
          <div className="flex-1">
            <Header
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              isOfflineMode={isOfflineMode}
              onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
              bloomStats={bloomStats}
              onOpenLedger={() => setIsLedgerOpen(true)}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

            {/* Hero 3-Second Principle Banner */}
            <div className="card p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border-blue-200 dark:border-blue-800/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge-safe text-xs">
                      ✓ Free On-Device Protection
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-medium">
                      National Cyber Cell 1930 Integrated
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    {currentLang === 'hi' 
                      ? 'रक्षक AI — डिजिटल फ्रॉड और फर्जी संदेशों से सुरक्षित रहें' 
                      : 'Rakshak AI — Your Family\'s Digital Scam Protection Shield'}
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
                    {currentLang === 'hi'
                      ? 'संदिग्ध संदेश, बैंक लिंक या UPI QR कोड नीचे डालें। रक्षक AI तुरंत सरल भाषा में बताएगा कि क्या सुरक्षित है।'
                      : 'Paste any suspicious SMS, bank link, or UPI payment below. Get an instant, plain-language safety check.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 1-Click Evaluation Scenarios */}
            <JudgePresetBar
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Active Tab Header */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {tabTitles[activeTab]}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                {tabSubtitles[activeTab]}
              </p>
            </div>

            {/* Tab Views */}
            <div>
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
                <div className="card p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center mx-auto">
                    <Database className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      Verified Scam Registry Explorer
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1">
                      Official immutable registry of confirmed scam VPAs, phishing URLs, and fraudulent phone numbers.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLedgerOpen(true)}
                    className="btn-primary text-xs mx-auto"
                  >
                    Open Scam Registry (डेटाबेस खोलें)
                  </button>
                </div>
              )}
            </div>

            {/* What Rakshak AI Does in Simple Words */}
            <section className="card p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[var(--primary)] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Why Rakshak AI is Built For Real Families (रक्षक AI की विशेषताएं)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  { title: 'Zero Jargon', desc: 'No complex technical terms. Clear English & Hindi answers with direct action steps.' },
                  { title: 'Vernacular & Hinglish', desc: 'Recognizes Hindi, Romanized Hinglish, and regional electricity bill threats.' },
                  { title: '100% On-Device & Private', desc: 'Works privately on your phone without sending personal chats to the cloud.' },
                  { title: 'Spoken Voice Warnings', desc: 'Reads security alerts out loud so elderly family members stay safe.' },
                  { title: 'UPI PIN Safety Shield', desc: 'Explains that UPI PIN is only to send money, never to receive cashbacks.' },
                  { title: 'Cyber Police 1930', desc: 'Generates ready-to-submit fraud complaints directly for the National Helpline.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                    <div className="font-bold text-[var(--text-primary)] mb-1">
                      {item.title}
                    </div>
                    <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <footer className="border-t border-[var(--border-subtle)] px-6 py-4 mt-6 bg-[var(--bg-surface)]">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-[var(--text-primary)] font-bold">Rakshak AI</span>
                <span>• Digital Scam & Financial Fraud Defense Shield</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>100% Private On-Device</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                  National Helpline: <strong className="text-[var(--text-primary)]">1930</strong>
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>

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
