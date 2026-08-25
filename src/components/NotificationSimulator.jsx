import React from 'react';
import { Bell, ShieldAlert, X, ExternalLink, Volume2, ArrowRight } from 'lucide-react';

export default function NotificationSimulator({ 
  notification, 
  onClose, 
  onInspect, 
  onPlayVoice 
}) {
  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-bounce-short">
      <div className="glass-danger-glow rounded-2xl p-4 text-white shadow-2xl border border-red-500/50 backdrop-blur-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-red-500/20 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/30 text-red-300 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-red-300 font-bold uppercase tracking-wider block">
                OS Notification Intercepted
              </span>
              <span className="text-xs text-slate-300">
                Simulating Android NotificationListenerService
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender & Body */}
        <div className="mb-3 bg-black/40 rounded-xl p-3 border border-red-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{notification.app || 'WhatsApp / SMS Interceptor'}</span>
            </span>
            <span className="text-[10px] font-mono text-red-400">Just Now</span>
          </div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Sender: <strong>{notification.sender || '+91 98765 43210 (Unknown Number)'}</strong></span>
          </div>
          <p className="text-xs text-slate-200 font-sans italic leading-relaxed line-clamp-3">
            "{notification.message}"
          </p>
        </div>

        {/* Threat Diagnosis Pill */}
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-200">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
          <span className="font-semibold truncate">{notification.title || 'Phishing / Fraud Threat Detected'}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onInspect}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <span>Inspect Threat Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onPlayVoice && (
            <button
              onClick={onPlayVoice}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              title="Play Voice Warning in Local Language"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
