import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, Home } from 'lucide-react';
import BorderSuite from './BorderSuite';
import CyberSuite from './cyber/App';
import { SUPPORTED_LANGUAGES } from './cyber/engine/regionalDictionary';

const L10N = {
  tagline: {
    en: 'Border security & scam protection in one app.',
    hi: 'एक ही ऐप में — सीमा सुरक्षा और धोखाधड़ी से बचाव।',
    ta: 'ஒரே பயன்பாட்டில் — எல்லை பாதுகாப்பு மற்றும் மோசடி பாதுகாப்பு.',
    te: 'ఒకే యాప్‌లో — సరిహద్దు భద్రత మరియు మోసం నుండి రక్షణ.',
    bn: 'একটি অ্যাপেই — সীমান্ত নিরাপত্তা ও প্রতারণা সুরক্ষা।',
    mr: 'एकाच अ‍ॅपमध्ये — सीमा सुरक्षा आणि फसवणुकीपासून संरक्षण.',
  },
  chooseLang: {
    en: 'Choose your language',
    hi: 'अपनी भाषा चुनें',
    ta: 'உங்கள் மொழியை தேர்வு செய்க',
    te: 'మీ భాషను ఎంచుకోండి',
    bn: 'আপনার ভাষা বেছে নিন',
    mr: 'तुमची भाषा निवडा',
  },
  border: {
    title: {
      en: 'Border Gate Screening',
      hi: 'सीमा जाँच',
      ta: 'எல்லை சோதனை',
      te: 'సరిహద్దు తనిఖీ',
      bn: 'সীমান্ত পরীক্ষা',
      mr: 'सीमा तपासणी',
    },
    desc: {
      en: 'Spot fake passports, visas & IDs with AI.',
      hi: 'नकली पासपोर्ट, वीज़ा और पहचान पत्र पकड़ें।',
      ta: 'போலி பாஸ்போர்ட், விசா மற்றும் ID களை AI உதவியுடன் கண்டுபிடியுங்கள்.',
      te: 'AI సహాయంతో నకిలీ పాస్‌పోర్ట్, వీసా మరియు ID లను పట్టుకోండి.',
      bn: 'AI দিয়ে নকল পাসপোর্ট, ভিসা এবং আইডি চিহ্নিত করুন।',
      mr: 'AI ने बनावट पासपोर्ट, व्हिसा आणि ID शोधा.',
    },
    open: {
      en: 'Open Border Gate',
      hi: 'सीमा जाँच खोलें',
      ta: 'எல்லை சோதனையை திற',
      te: 'సరిహద్దు తనిఖీని తెరవండి',
      bn: 'সীমান্ত পরীক্ষা খুলুন',
      mr: 'सीमा तपासणी उघडा',
    },
    tags: {
      en: ['AI Scan', 'Face Match', 'Risk Check'],
      hi: ['एआई स्कैन', 'चेहरा मिलान', 'जोखिम जाँच'],
      ta: ['AI ஸ்கேன்', 'முக ஒப்பீடு', 'அபாய சோதனை'],
      te: ['AI స్కాన్', 'ముఖ సరిపోలిక', 'రిస్క్ చెక్'],
      bn: ['এআই স্ক্যান', 'মুখ মিল', 'ঝুঁকি পরীক্ষা'],
      mr: ['AI स्कॅन', 'चेहरा मिलान', 'जोखीम तपासणी'],
    },
  },
  cyber: {
    title: {
      en: 'Scam Guard',
      hi: 'धोखाधड़ी बचाव',
      ta: 'மோசடி காவல்',
      te: 'మోసాల రక్షణ',
      bn: 'প্রতারণা সুরক্ষা',
      mr: 'फसवणूक संरक्षण',
    },
    desc: {
      en: 'Check messages, links, QR payments & apps for fraud.',
      hi: 'संदेश, लिंक, QR भुगतान और ऐप में धोखाधड़ी जाँचें।',
      ta: 'செய்திகள், இணைப்புகள், QR கட்டணம் மற்றும் பயன்பாடுகளில் மோசடியைச் சரிபார்க்கவும்.',
      te: 'సందేశాలు, లింకులు, QR చెల్లింపులు మరియు యాప్‌లలో మోసాన్ని తనిఖీ చేయండి.',
      bn: 'বার্তা, লিংক, QR পেমেন্ট এবং অ্যাপে প্রতারণা যাচাই করুন।',
      mr: 'संदेश, दुवे, QR पेमेंट आणि अ‍ॅपमध्ये फसवणूक तपासा.',
    },
    open: {
      en: 'Open Scam Guard',
      hi: 'धोखाधड़ी बचाव खोलें',
      ta: 'மோசடி காவலை திற',
      te: 'మోసాల రక్షణను తెరవండి',
      bn: 'প্রতারণা সুরক্ষা খুলুন',
      mr: 'फसवणूक संरक्षण उघडा',
    },
    tags: {
      en: ['SMS', 'Link', 'QR / UPI', 'App'],
      hi: ['एसएमएस', 'लिंक', 'क्यूआर / यूपीआई', 'ऐप'],
      ta: ['SMS', 'இணைப்பு', 'QR / UPI', 'பயன்பாடு'],
      te: ['SMS', 'లింక్', 'QR / UPI', 'యాప్'],
      bn: ['এসএমএস', 'লিংক', 'কিউআর / ইউপিআই', 'অ্যাপ'],
      mr: ['SMS', 'दुवा', 'QR / UPI', 'अ‍ॅप'],
    },
  },
  home: {
    en: 'Home',
    hi: 'होम',
    ta: 'முகப்பு',
    te: 'హోమ్',
    bn: 'হোম',
    mr: 'होम',
  },
};

const L = (lang, obj) => obj[lang] || obj.en;

export default function App() {
  const [suite, setSuite] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('rakshak_lang') || 'hi');

  const chooseLang = (code) => {
    setLang(code);
    localStorage.setItem('rakshak_lang', code);
    localStorage.setItem('aegis_lang', code);
  };

  const openSuite = (id) => {
    setSuite(id);
    localStorage.setItem('aegis_suite', id);
  };

  if (suite === 'border') {
    return (
      <>
        <BorderSuite />
        <button
          onClick={() => setSuite(null)}
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 border border-white/15 text-slate-200 text-xs font-semibold shadow-2xl backdrop-blur-xl hover:border-cyan-400/50 hover:text-cyan-200 transition-all"
        >
          <Home className="w-4 h-4" />
          {L(lang, L10N.home)}
        </button>
      </>
    );
  }

  if (suite === 'cyber') {
    return (
      <>
        <CyberSuite />
        <button
          onClick={() => setSuite(null)}
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 border border-white/15 text-slate-200 text-xs font-semibold shadow-2xl backdrop-blur-xl hover:border-cyan-400/50 hover:text-cyan-200 transition-all"
        >
          <Home className="w-4 h-4" />
          {L(lang, L10N.home)}
        </button>
      </>
    );
  }

  const BorderIcon = Fingerprint;
  const CyberIcon = ShieldCheck;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="app-bg" aria-hidden="true">
        <div className="grid-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Brand + language picker */}
        <div className="flex flex-col items-center mb-10">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-black text-2xl shadow-2xl shadow-cyan-500/30 mb-4">
            A
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-100 text-center">AEGISBORDER AI</h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 text-center max-w-md">{L(lang, L10N.tagline)}</p>

          <div className="mt-5 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{L(lang, L10N.chooseLang)}</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white/5 rounded-full p-1.5 border border-white/10 max-w-md">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => chooseLang(l.code)}
                  title={l.name}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                    lang === l.code
                      ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 text-cyan-100 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  {l.flag} {l.name.replace(/\s*\(.*\)/, '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Suite cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          <button
            onClick={() => openSuite('border')}
            className="group glass-card glass-card-hover rounded-2xl p-6 text-left flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/25 to-cyan-500/5 border border-cyan-400/30 flex items-center justify-center">
                <BorderIcon className="w-6 h-6 text-cyan-300" />
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 border border-cyan-400/25 rounded-full px-2 py-0.5">GOVT</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{L(lang, L10N.border.title)}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{L(lang, L10N.border.desc)}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {L(lang, L10N.border.tags).map((t) => (
                <span key={t} className="text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-2 w-full text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-bold rounded-xl py-3 shadow-lg shadow-cyan-500/25 transition-all group-hover:shadow-cyan-500/40">
              {L(lang, L10N.border.open)} →
            </span>
          </button>

          <button
            onClick={() => openSuite('cyber')}
            className="group glass-card glass-card-hover rounded-2xl p-6 text-left flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 border border-emerald-400/30 flex items-center justify-center">
                <CyberIcon className="w-6 h-6 text-emerald-300" />
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 border border-emerald-400/25 rounded-full px-2 py-0.5">FOR ALL</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{L(lang, L10N.cyber.title)}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{L(lang, L10N.cyber.desc)}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {L(lang, L10N.cyber.tags).map((t) => (
                <span key={t} className="text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-2 w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold rounded-xl py-3 shadow-lg shadow-emerald-500/25 transition-all group-hover:shadow-emerald-500/40">
              {L(lang, L10N.cyber.open)} →
            </span>
          </button>
        </div>

        <p className="mt-8 text-[11px] text-slate-600 font-mono text-center">
          AegisBorder AI · Border Intelligence + Rakshak Cyber Shield
        </p>
      </div>
    </div>
  );
}