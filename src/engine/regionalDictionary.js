// Multi-Lingual Explanations & Voice Synthesis Dictionary (6 Languages)

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳', speechLang: 'hi-IN' },
  { code: 'en', name: 'English', flag: '🇬🇧', speechLang: 'en-IN' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳', speechLang: 'ta-IN' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳', speechLang: 'te-IN' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳', speechLang: 'bn-IN' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳', speechLang: 'mr-IN' },
];

export const REGIONAL_STRINGS = {
  // Common UI labels
  appName: {
    en: "Rakshak AI",
    hi: "रक्षक एआई",
    ta: "ரக்ஷக் AI",
    te: "రక్షక్ AI",
    bn: "রক্ষক এআই",
    mr: "रक्षक एआय"
  },
  tagline: {
    en: "On-Device Phishing & Fraud Defence Assistant for First-Time Digital Users",
    hi: "नए डिजिटल उपयोगकर्ताओं के लिए ऑन-डिवाइस फ्रॉड एवं साइबर सुरक्षा सहायक",
    ta: "புதிய டிஜிட்டல் பயனர்களுக்கான மோசடி தடுப்பு உதவியாளர்",
    te: "కొత్త డిజిటల్ వినియోగదారుల కోసం మోసాల రక్షణ సహాయకుడు",
    bn: "নতুন ডিজিটাল ব্যবহারকারীদের জন্য অন-ডিভাইস জালিয়াতি প্রতিরোধ সহায়ক",
    mr: "नवीन डिजिटल वापरकर्त्यांसाठी सायबर फसवणूक संरक्षण सहाय्यक"
  },
  offlineMode: {
    en: "Offline Mode Active (Bloom Filter Ready)",
    hi: "ऑफलाइन मोड सक्रिय (ब्लूम फ़िल्टर तैयार)",
    ta: "ஆஃப்லைன் பயன்முறை செயலில் உள்ளது",
    te: "ఆఫ్‌లైన్ మోడ్ సక్రియంగా ఉంది",
    bn: "অফলাইন মোড সক্রিয়",
    mr: "ऑफलाइन मोड सक्रिय"
  },
  onlineMode: {
    en: "Online (Consortium Sync On)",
    hi: "ऑनलाइन (कंसोर्टियम सिंक चालू)",
    ta: "ஆன்லைன்",
    te: "ఆన్‌లైన్",
    bn: "অনলাইন",
    mr: "ऑनलाइन"
  },
  // Severity alerts
  alertCritical: {
    en: "CRITICAL DANGER: DO NOT CLICK OR PROCEED!",
    hi: "गंभीर खतरा: कृपया आगे न बढ़ें और कोई पिन या लिंक न खोलें!",
    ta: "மிகப் பெரிய ஆபத்து: தொடர வேண்டாம் அல்லது கிளிக் செய்ய வேண்டாம்!",
    te: "తీవ్రమైన ప్రమాదం: దయచేసి ముందుకు వెళ్లవద్దు లేదా క్లిక్ చేయవద్దు!",
    bn: "মারাত্মক বিপদ: অনুগ্রহ করে এগিয়ে যাবেন না বা ক্লিক করবেন না!",
    mr: "गंभीर धोका: कृपया पुढे जाऊ नका किंवा क्लिक करू नका!"
  },
  alertSafe: {
    en: "VERIFIED SAFE: Legitimate Institutional Source",
    hi: "सुरक्षित: सत्यापित आधिकारिक संस्थान",
    ta: "பாதுகாப்பானது: சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ நிறுவனம்",
    te: "సురక్షితం: ధృవీకరించబడిన అధికారిక మూలం",
    bn: "নিরাপদ: যাচাইকৃত প্রাতিষ্ঠানিক উৎস",
    mr: "सुरक्षित: पडताळणी केलेली अधिकृत संस्था"
  },
  // Micro friction strings
  microFrictionTitle: {
    en: "STOP! You are SENDING money, NOT receiving it!",
    hi: "रुकिए! आप पैसे भेज रहे हैं, आपको पैसे मिल नहीं रहे हैं!",
    ta: "நில்லுங்கள்! நீங்கள் பணம் அனுப்புகிறீர்கள், பெறவில்லை!",
    te: "ఆగండి! మీరు డబ్బులు పంపుతున్నారు, అందుకోవడం లేదు!",
    bn: "থামুন! আপনি টাকা পাঠাচ্ছেন, গ্রহণ করছেন না!",
    mr: "थांबा! तुम्ही पैसे पाठवत आहात, मिळवत नाही आहात!"
  },
  microFrictionDesc: {
    en: "UPI PIN is only required to SEND money. You NEVER need to enter your PIN or scan a QR to receive rewards, cashback, or refunds.",
    hi: "यूपीआई पिन केवल पैसे भेजने के लिए दर्ज किया जाता है। पैसे, कैशबैक या इनाम प्राप्त करने के लिए कभी भी पिन दर्ज करने की आवश्यकता नहीं होती।",
    ta: "பணம் அனுப்ப மட்டுமே UPI PIN தேவை. கேஷ்பேக் அல்லது பரிசு பெற PIN தேவையில்லை.",
    te: "డబ్బు పంపడానికి మాత్రమే UPI PIN అవసరం. క్యాష్‌బ్యాక్ లేదా రివార్డ్‌లు పొందడానికి PIN అవసరం లేదు.",
    bn: "টাকা পাঠানোর জন্যই কেবল UPI PIN প্রয়োজন। টাকা বা ক্যাশব্যাক পেতে কখনও PIN লাগে না।",
    mr: "UPI PIN फक्त पैसे पाठवण्यासाठी वापरला जातो. कॅशबॅक किंवा बक्षीस मिळवण्यासाठी PIN ची गरज नसते."
  }
};
