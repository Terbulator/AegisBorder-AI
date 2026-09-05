import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, HelpCircle, ChevronDown } from 'lucide-react';
import BorderSuite from './BorderSuite';
import CyberSuite from './cyber/App';
import { SUPPORTED_LANGUAGES, t } from './cyber/engine/regionalDictionary';

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
  guideToggle: {
    en: 'How to use',
    hi: 'कैसे इस्तेमाल करें',
    ta: 'எப்படி பயன்படுத்துவது',
    te: 'ఎలా ఉపయోగించాలి',
    bn: 'কীভাবে ব্যবহার করবেন',
    mr: 'कसे वापरावे',
  },
  guideTitle: {
    en: 'Quick Start Guide',
    hi: 'त्वरित शुरुआत गाइड',
    ta: 'விரைவு தொடக்க வழிகாட்டி',
    te: 'త్వరిత ప్రారంభ గైడ్',
    bn: 'দ্রুত শুরু গাইড',
    mr: 'द्रुत प्रारंभ मार्गदर्शक',
  },
  guideClose: {
    en: 'Close guide',
    hi: 'गाइड बंद करें',
    ta: 'வழிகாட்டியை மூடு',
    te: 'గైడ్ మూసివేయండి',
    bn: 'গাইড বন্ধ করুন',
    mr: 'मार्गदर्शक बंद करा',
  },
  primary: {
    en: 'Primary',
    hi: 'प्राथमिक',
    ta: 'முதன்மை',
    te: 'ప్రాథమిక',
    bn: 'প্রাথমিক',
    mr: 'प्राथमिक',
  },
  secondary: {
    en: 'Secondary',
    hi: 'द्वितीयक',
    ta: 'இரண்டாம் நிலை',
    te: 'ద్వితీయ',
    bn: 'দ্বিতীয়',
    mr: 'दुय्यम',
  },
  borderSteps: {
    en: [
      'Pick a passenger from the list below, or create a new one.',
      'The AI scans the passport, MRZ chip, face and fingerprint at once.',
      'Check the verdict at the bottom — APPROVED lets them pass, FLAGGED holds them.',
    ],
    hi: [
      'नीचे दी गई सूची में से यात्री चुनें, या नया यात्री बनाएँ।',
      'AI पासपोर्ट, MRZ चिप, चेहरा और फिंगरप्रिंट एक साथ स्कैन करता है।',
      'नीचे फ़ैसला देखें — APPROVED का मतलब जाने दें, FLAGGED का मतलब रोकें।',
    ],
    ta: [
      'கீழே உள்ள பட்டியலில் இருந்து பயணியைத் தேர்ந்தெடுக்கவும், அல்லது புதியவரை உருவாக்கவும்.',
      'AI பாஸ்போர்ட், MRZ சிப், முகம் மற்றும் கைரேகையை ஒரே நேரத்தில் ஸ்கேன் செய்கிறது.',
      'கீழே உள்ள முடிவைப் பார்க்கவும் — APPROVED என்பது அனுமதி, FLAGGED என்பது நிறுத்தம்.',
    ],
    te: [
      'క్రింద ఉన్న జాబితా నుండి ప్రయాణికుడిని ఎంచుకోండి, లేదా కొత్తదాన్ని సృష్టించండి.',
      'AI పాస్‌పోర్ట్, MRZ చిప్, ముఖం మరియు వేలిముద్రను ఒకేసారి స్కాన్ చేస్తుంది.',
      'క్రింద ఉన్న తీర్పు చూడండి — APPROVED అంటే వెళ్లనివ్వండి, FLAGGED అంటే ఆపండి.',
    ],
    bn: [
      'নিচের তালিকা থেকে যাত্রী বেছে নিন, অথবা নতুন যাত্রী তৈরি করুন।',
      'AI পাসপোর্ট, MRZ চিপ, মুখ এবং আঙুলের ছাপ একসাথে স্ক্যান করে।',
      'নিচের রায় দেখুন — APPROVED মানে অনুমতি, FLAGGED মানে আটকানো।',
    ],
    mr: [
      'खालील यादीतून प्रवासी निवडा, किंवा नवीन तयार करा.',
      'AI पासपोर्ट, MRZ चिप, चेहरा आणि बोटाचा ठसा एकत्र स्कॅन करतो.',
      'खाली निकाल पहा — APPROVED म्हणजे जाऊ द्या, FLAGGED म्हणजे थांबवा.',
    ],
  },
  cyberSteps: {
    en: [
      'Choose a module: SMS, Website, QR/UPI or App safety.',
      'Paste the suspicious message, link or scan the QR code.',
      'Read the risk verdict — if flagged, report it to the scam registry.',
    ],
    hi: [
      'कोई भी मॉड्यूल चुनें: SMS, वेबसाइट, QR/UPI या ऐप सुरक्षा।',
      'संदिग्ध संदेश, लिंक पेस्ट करें या QR कोड स्कैन करें।',
      'जोखिम फ़ैसला पढ़ें — अगर धोखाधड़ी लगे तो scam registry में रिपोर्ट करें।',
    ],
    ta: [
      'எந்த மாட்யூலை வேண்டுமானாலும் தேர்ந்தெடுக்கவும்: SMS, வலைத்தளம், QR/UPI அல்லது ஆப் பாதுகாப்பு.',
      'சந்தேகமான செய்தி, இணைப்பை ஒட்டவும் அல்லது QR குறியீட்டை ஸ்கேன் செய்யவும்.',
      'ஆபத்து தீர்ப்பைப் படிக்கவும் — மோசடி என்றால் scam registry-யில் புகாரளிக்கவும்.',
    ],
    te: [
      'మాడ్యూల్ ఎంచుకోండి: SMS, వెబ్‌సైట్, QR/UPI లేదా యాప్ భద్రత.',
      'అనుమానాస్పద సందేశం, లింక్ అతికించండి లేదా QR స్కాన్ చేయండి.',
      'రిస్క్ తీర్పు చదవండి — మోసం అయితే scam registry లో రిపోర్ట్ చేయండి.',
    ],
    bn: [
      'যে কোনো মডিউল বেছে নিন: SMS, ওয়েবসাইট, QR/UPI বা অ্যাপ নিরাপত্তা।',
      'সন্দেহজনক বার্তা, লিংক পেস্ট করুন বা QR কোড স্ক্যান করুন।',
      'ঝুঁকির রায় পড়ুন — প্রতারণা হলে scam registry-তে রিপোর্ট করুন।',
    ],
    mr: [
      'कोणताही मॉड्यूल निवडा: SMS, वेबसाइट, QR/UPI किंवा अ‍ॅप सुरक्षा.',
      'संशयास्पद संदेश, दुवा पेस्ट करा किंवा QR कोड स्कॅन करा.',
      'जोखीम निकाल वाचा — फसवणूक वाटल्यास scam registry मध्ये रिपोर्ट करा.',
    ],
  },
  borderHint: {
    en: 'Border Gate Screening — check passports & travellers first',
    hi: 'सीमा जाँच — पहले पासपोर्ट और यात्रियों की जाँच करें',
    ta: 'எல்லை சோதனை — முதலில் பாஸ்போர்ட் மற்றும் பயணிகளை சரிபார்க்கவும்',
    te: 'సరిహద్దు తనిఖీ — మొదట పాస్‌పోర్ట్ మరియు ప్రయాణికులను తనిఖీ చేయండి',
    bn: 'সীমান্ত পরীক্ষা — প্রথমে পাসপোর্ট এবং যাত্রীদের যাচাই করুন',
    mr: 'सीमा तपासणी — प्रथम पासपोर्ट आणि प्रवाशांची तपासणी करा',
  },
  cyberHint: {
    en: 'Scam Guard — extra protection for your phone & money',
    hi: 'धोखाधड़ी बचाव — फ़ोन और पैसों की अतिरिक्त सुरक्षा',
    ta: 'மோசடி காவல் — உங்கள் போன் மற்றும் பணத்திற்கு கூடுதல் பாதுகாப்பு',
    te: 'మోసాల రక్షణ — మీ ఫోన్ మరియు డబ్బుకు అదనపు రక్షణ',
    bn: 'প্রতারণা সুরক্ষা — আপনার ফোন ও টাকার জন্য অতিরিক্ত সুরক্ষা',
    mr: 'फसवणूक संरक्षण — तुमच्या फोन आणि पैशांचे अतिरिक्त संरक्षण',
  },
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('rakshak_lang') || 'hi');
  const [guideOpen, setGuideOpen] = useState(() => localStorage.getItem('aegis_guide') !== '0');

  const chooseLang = (code) => {
    setLang(code);
    localStorage.setItem('rakshak_lang', code);
  };

  const toggleGuide = () => {
    setGuideOpen((open) => {
      const next = !open;
      localStorage.setItem('aegis_guide', next ? '1' : '0');
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 font-sans">
      {/* ─── Global header: brand + language + guide ─── */}
      <header className="border-b border-white/10 bg-[#040810]/95 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="max-w-full flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2.5 mr-auto">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-cyan-500/30">
              A
            </span>
            <div className="leading-tight">
              <h1 className="text-sm font-black tracking-wide">AEGISBORDER AI</h1>
              <p className="text-[11px] text-slate-400">{t(lang, L10N.tagline)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => chooseLang(l.code)}
                title={l.name}
                className={`px-2.5 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  lang === l.code
                    ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 text-cyan-100'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {l.flag} {l.name.replace(/\s*\(.*\)/, '')}
              </button>
            ))}
            <button
              onClick={toggleGuide}
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-white/5 border border-white/10 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {t(lang, guideOpen ? L10N.guideClose : L10N.guideToggle)}
            </button>
          </div>
        </div>

        {/* Quick Start Guide */}
        {guideOpen && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl glass-card p-4 border-l-4 border-cyan-400/60">
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="w-4 h-4 text-cyan-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                  {t(lang, L10N.borderHint)}
                </span>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                  {t(lang, L10N.primary)}
                </span>
              </div>
              <ol className="text-[12px] text-slate-300 space-y-1 list-decimal list-inside marker:text-cyan-400">
                {t(lang, L10N.borderSteps).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl glass-card p-4 border-l-4 border-emerald-400/60">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                  {t(lang, L10N.cyberHint)}
                </span>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  {t(lang, L10N.secondary)}
                </span>
              </div>
              <ol className="text-[12px] text-slate-300 space-y-1 list-decimal list-inside marker:text-emerald-400">
                {t(lang, L10N.cyberSteps).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </header>

      {/* ─── Section 1: Border Gate Screening (PRIMARY) ─── */}
      <section aria-label="Border Gate Screening">
        <BorderSuite />
      </section>

      {/* ─── Divider ─── */}
      <div className="relative z-[70] flex items-center gap-3 px-4 sm:px-6 py-4 border-y border-white/10 bg-[#070b16]">
        <ChevronDown className="w-4 h-4 text-emerald-300" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-200">
            Scam Guard
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
            {t(lang, L10N.secondary)}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:block">— {t(lang, L10N.cyberHint)}</span>
      </div>

      {/* ─── Section 2: Scam Guard (SECONDARY) ─── */}
      <section aria-label="Scam Guard">
        <CyberSuite />
      </section>
    </div>
  );
}