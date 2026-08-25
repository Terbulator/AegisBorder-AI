import React from 'react';
import { Lock, Phone, Globe, ExternalLink, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import legitimateData from '../data/legitimateInstitutions.json';

export default function SafeSandboxModal({ isOpen, onClose, threatData }) {
  if (!isOpen || !threatData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-2xl w-full rounded-3xl p-6 text-white border border-cyan-500/40 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Isolated Safe Sandbox & Official Directory
              </h3>
              <p className="text-xs text-slate-400">
                Zero-Risk Inspection & Verified Contact Information
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spoofing Comparison Banner */}
        {threatData.spoofedTarget && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Target Impersonation Identified</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/30">
                <span className="text-[10px] font-mono text-red-400 block uppercase">Fake Phishing Domain:</span>
                <span className="font-mono text-red-300 font-bold truncate block">{threatData.domain || threatData.fullUrl}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-emerald-400 block uppercase">Official Verified Domain:</span>
                <span className="font-mono text-emerald-300 font-bold truncate block">{threatData.officialDomain || 'sbi.co.in'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Official Helpline Direct Contact */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Official Verified Helplines</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">National Cyber Crime Reporting Portal</div>
                <div className="text-[11px] text-slate-400">Available 24x7 for immediate financial freeze</div>
              </div>
              <a 
                href="tel:1930" 
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors"
              >
                Call 1930
              </a>
            </div>

            {threatData.officialHelpline && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">{threatData.spoofedTarget || 'Official Bank'} Helpline</div>
                  <div className="text-[11px] text-slate-400">Official toll-free customer support</div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {threatData.officialHelpline}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legitimate Banks Directory */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Banking Portals Whitelist</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {legitimateData.banks.map((bank, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="font-semibold text-slate-200">{bank.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 truncate">{bank.officialDomains[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
        >
          Exit Safe Sandbox
        </button>

      </div>
    </div>
  );
}
