import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../engine/regionalDictionary';

export function speakText(text, langCode = 'hi') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
  
  if (langObj) {
    utterance.lang = langObj.speechLang;
  }

  utterance.rate = 0.95; // Slightly slower for clear comprehension for rural / first-time users
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export default function VoiceAssistant({ currentLang, onVoiceInput }) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleToggleListening = () => {
    if (!speechSupported) {
      alert("Voice input is not supported in this browser. Please type or use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);
    recognition.lang = langObj ? langObj.speechLang : 'hi-IN';
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onVoiceInput) {
          onVoiceInput(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleListening}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
          isListening
            ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
            : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
        }`}
        title="Speak suspicious message or URL (Voice Input)"
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice Input (बोलकर पूछें)</span>
          </>
        )}
      </button>
    </div>
  );
}
