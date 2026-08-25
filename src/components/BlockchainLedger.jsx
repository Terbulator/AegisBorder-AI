import React, { useState } from 'react';
import { Database, ShieldCheck, CheckCircle2, Lock, Plus, Sparkles, Hash, Layers, Users, X } from 'lucide-react';
import { CONSORTIUM_NODES, globalPoaBlockchain } from '../engine/poaBlockchainSim';
import confetti from 'canvas-confetti';

export default function BlockchainLedger({ isOpen, onClose }) {
  const [blocks, setBlocks] = useState(() => globalPoaBlockchain.getBlocks());
  const [targetInput, setTargetInput] = useState('');
  const [typeInput, setTypeInput] = useState('PHISHING_DOMAIN');
  const [detailsInput, setDetailsInput] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  if (!isOpen) return null;

  const handleMint = (e) => {
    e.preventDefault();
    if (!targetInput.trim()) return;

    setIsMinting(true);
    setTimeout(() => {
      globalPoaBlockchain.submitCommunityReport(
        targetInput,
        typeInput,
        detailsInput || 'Verified malicious pattern via consortium telemetry'
      );
      setBlocks([...globalPoaBlockchain.getBlocks()]);
      setIsMinting(false);
      setTargetInput('');
      setDetailsInput('');

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-4xl w-full rounded-3xl p-6 text-white border border-cyan-500/40 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Proof-of-Authority (PoA) Consortium Ledger</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Sybil Immune
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Multi-Signature Threat Blacklisting by Authorized State & Banking Nodes
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto space-y-6 pr-1">
          
          {/* Consortium Nodes Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>Authorized Validator Consortium Nodes (3/3 Active)</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Consensus Rule: &gt;= 2 Multi-Sigs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {CONSORTIUM_NODES.map((node) => (
                <div key={node.id} className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-xl">{node.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-100 truncate">{node.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{node.nodeType}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1 truncate">{node.pubKey}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mint New Threat Block Form */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/20">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Submit & Mint Threat Intelligence Block</span>
            </h4>

            <form onSubmit={handleMint} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="Target (e.g. scam-paytm@ybl or bad-domain.top)"
                  className="sm:col-span-2 p-2.5 rounded-xl bg-black/50 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="p-2.5 rounded-xl bg-black/50 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="PHISHING_DOMAIN">Phishing Domain</option>
                  <option value="DECEPTIVE_UPI_VPA">Deceptive UPI VPA</option>
                  <option value="RAT_MALWARE_APK">RAT Malware APK</option>
                  <option value="SMS_SPOOF_SOURCE">SMS Spoof Source</option>
                </select>
              </div>

              <input
                type="text"
                value={detailsInput}
                onChange={(e) => setDetailsInput(e.target.value)}
                placeholder="Forensic evidence or attack campaign details"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isMinting || !targetInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isMinting ? 'Minting Multi-Sig Block...' : 'Collect Multi-Sig & Mint Block'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Blocks List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Immutable Chain Explorer ({blocks.length} Blocks Minted)</span>
            </h4>

            <div className="space-y-3">
              {blocks.map((block) => (
                <div 
                  key={block.blockNumber} 
                  className="p-4 rounded-2xl bg-black/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all font-mono"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400">
                        Block #{block.blockNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        {block.threatType}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-semibold mb-1 truncate">
                    Target: <span className="text-red-300">{block.threatTarget}</span>
                  </div>

                  {block.evidenceDetails && (
                    <div className="text-[11px] text-slate-400 font-sans mb-2">
                      {block.evidenceDetails}
                    </div>
                  )}

                  {/* Hash & Multi-sig details */}
                  <div className="pt-2 border-t border-slate-800/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Block Hash: </span>
                      <span className="text-cyan-300">{block.blockHash.slice(0, 18)}...</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Signatures: </span>
                      <span className="text-emerald-400">✓ {block.signatures.length} Verified Signatures</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 mt-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
