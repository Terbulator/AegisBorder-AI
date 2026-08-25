import React, { useState } from 'react';
import { FileText, Copy, Check, ShieldAlert, Phone, ExternalLink, X } from 'lucide-react';

export default function IncidentReportModal({ isOpen, onClose, threatData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !threatData) return null;

  const incidentId = "CYBER-" + Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().toLocaleString();

  const formattedReport = `=====================================================
NATIONAL CYBER CRIME REPORTING PORTAL (1930 / I4C)
INCIDENT FORENSIC REPORT - RAKSHAK AI DEFENCE
=====================================================
Incident ID: ${incidentId}
Date & Time: ${timestamp}
Threat Classification: ${threatData.category || threatData.title || 'PHISHING_FRAUD'}
Severity Level: ${threatData.riskScore >= 80 ? 'CRITICAL' : 'HIGH'} (Risk Score: ${threatData.riskScore}/100)

SUSPICIOUS ENTITY DETAILS:
Target / Domain / VPA: ${threatData.domain || threatData.vpa || threatData.appName || threatData.fullUrl || 'N/A'}
Phone / Contact: ${threatData.extractedPhones ? threatData.extractedPhones.join(', ') : 'N/A'}
Direct URLs: ${threatData.extractedUrls ? threatData.extractedUrls.join(', ') : (threatData.fullUrl || 'N/A')}

TECHNICAL DIAGNOSTICS:
${(threatData.reasons || []).map(r => "- " + r).join('\n') || '- Code-mixed social engineering threat pattern detected'}

PLAIN LANGUAGE SUMMARY:
${typeof threatData.explanation === 'object' ? (threatData.explanation.en || '') : (threatData.explanation || '')}

REPORTING JURISDICTION:
Ministry of Home Affairs (MHA) - Indian Cyber Crime Coordination Centre (I4C)
National Helpline: 1930 | Portal: https://cybercrime.gov.in
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-danger-glow max-w-2xl w-full rounded-3xl p-6 text-white border border-red-500/50 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                1-Click National Cyber Cell Incident Generator
              </h3>
              <p className="text-xs text-slate-400">
                Ready for National Cyber Crime Portal (cybercrime.gov.in / 1930)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="relative mb-4">
          <pre className="p-4 rounded-2xl bg-black/70 border border-slate-800 text-slate-300 font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {formattedReport}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>National Helpline: <strong className="text-white">1930</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Incident Report'}</span>
            </button>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Open Portal</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
