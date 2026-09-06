import { useState } from 'react';
import {
  MessageSquare, Globe, QrCode, Smartphone, Database, IdCard, FileText,
  Search, ScanFace, ShieldAlert, FileCheck2,
  BrainCircuit, RefreshCw, ArrowLeft, ShieldCheck, ServerOff
} from 'lucide-react';
import Screening from './Screening';
import OperationCard from '../components/operations/OperationCard';
import MessageOp from '../components/operations/MessageOp';
import WebsiteOp from '../components/operations/WebsiteOp';
import QrUpIOp from '../components/operations/QrUpIOp';
import AppOp from '../components/operations/AppOp';
import RegistryOp from '../components/operations/RegistryOp';
import AiThreatOp from '../components/operations/AiThreatOp';
import { Badge } from '../components/ui';

const GROUPS = [
  {
    title: 'Identity & document security',
    description: 'Backend-assisted inspection of passports and ID documents with fraud and watchlist checks.',
    ops: [
      { id: 'document', title: 'Document & Identity Screening', icon: IdCard, desc: 'Full MRZ, face-liveness, tampering and watchlist screening of a travel document.', inputs: 'Passport · VIZ · MRZ · Face', backend: true, focus: 'document' },
      { id: 'mrz', title: 'MRZ & Document Parsing', icon: FileText, desc: 'Run the pipeline and review the extracted MRZ/OCR fields with ICAO 9303 check digits.', inputs: 'Passport · MRZ · VIZ', backend: true, focus: 'mrz' },
      { id: 'biometrics', title: 'Face Verification & Liveness', icon: ScanFace, desc: 'Run the pipeline and review the live-face match, liveness and anti-spoofing checks.', inputs: 'Document · Face capture', backend: true, focus: 'biometrics' },
      { id: 'forensics', title: 'Tamper & Photo Forensics', icon: Search, desc: 'Run the pipeline and inspect ELA, noise and metadata tampering evidence.', inputs: 'Document image', backend: true, focus: 'forensics' },
      { id: 'watchlist', title: 'Watchlist & Risk Decision', icon: ShieldAlert, desc: 'Run the pipeline and review watchlist hits, risk factors and the recommended decision.', inputs: 'Document · MRZ', backend: true, focus: 'watchlist' },
      { id: 'audit', title: 'Audit Certification', icon: FileCheck2, desc: 'Run the pipeline and open the signed audit certificate for the case.', inputs: 'Document · MRZ', backend: true, focus: 'audit' },
    ],
  },
  {
    title: 'Threat detection',
    description: 'On-device engines that flag scams, phishing, payment fraud and malware without sending data to a server.',
    ops: [
      { id: 'message', title: 'Message Scanner', icon: MessageSquare, desc: 'Analyze SMS / WhatsApp messages & inboxes for scams and social-engineering patterns.', inputs: 'SMS · WhatsApp · Text', Op: MessageOp },
      { id: 'website', title: 'Website Checker', icon: Globe, desc: 'Spot typosquatted, homograph and flagged phishing domains before you click.', inputs: 'Domain · URL', Op: WebsiteOp },
      { id: 'qr-upi', title: 'QR & UPI Safety', icon: QrCode, desc: 'Inspect UPI deep-links and VPAs for cashback/refund lures and flagged payees.', inputs: 'upi://pay link · VPA', Op: QrUpIOp },
      { id: 'app', title: 'App Safety', icon: Smartphone, desc: 'Evaluate APK downloads for known malware signatures and dangerous permissions.', inputs: 'Package · .apk link', Op: AppOp },
      { id: 'scam-registry', title: 'Scam Registry', icon: Database, desc: 'Search a phone, domain, VPA or app against the on-device fraud registry.', inputs: 'Phone · Domain · VPA · APK', Op: RegistryOp },
    ],
  },
  {
    title: 'AI analysis',
    description: 'Remote-capable analyst services provided by the AegisBorder AI backend.',
    ops: [
      { id: 'ai-analysis', title: 'AI Threat Analysis', icon: BrainCircuit, desc: 'Upload a conversation, email or document for AI pattern analysis.', inputs: 'Conversation · Email · Document', Op: AiThreatOp },
    ],
  },
];

export default function NewOperation({ healthState, onRefresh }) {
  const [op, setOp] = useState(null);
  const current = op ? GROUPS.flatMap((g) => g.ops).find((o) => o.id === op) : null;

  if (current?.focus) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setOp(null)}
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All operations
        </button>
        <Screening focus={current.focus} />
      </div>
    );
  }

  if (current?.Op) {
    const Workbook = current.Op;
    return <Workbook onBack={() => setOp(null)} healthState={healthState} onRefresh={onRefresh} />;
  }

  const offline = healthState?.state === 'offline';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select a screening operation</h2>
          <p className="text-sm text-slate-500">AegisBorder AI unifies document identity verification and community threat detection in one console.</p>
        </div>
        <Badge color={healthState?.state === 'checking' ? 'amber' : offline ? 'red' : 'green'}>
          {healthState?.state === 'checking' ? 'Checking backend…' : offline ? 'Backend offline — identity services unavailable' : 'All systems operational'}
        </Badge>
      </div>

      {offline && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <ServerOff className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-900">
              The AegisBorder AI analysis service is currently unavailable. Document & Identity Screening will be disabled until the backend reconnects.
              On-device threat detection keeps working offline.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry connection
          </button>
        </div>
      )}

      {GROUPS.map((group) => (
        <section key={group.title} aria-labelledby={`group-${group.title}`}>
          <div className="mb-1 flex items-center gap-2">
            <h3 id={`group-${group.title}`} className="text-[13px] font-bold uppercase tracking-wider text-slate-500">{group.title}</h3>
          </div>
          <p className="mb-3 text-[11.5px] text-slate-400">{group.description}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.ops.map((o) => (
              <OperationCard
                key={o.id}
                icon={<o.icon className="h-5 w-5" aria-hidden="true" />}
                title={o.title}
                description={o.desc}
                inputs={o.inputs}
                badge={o.backend ? 'BACKEND' : undefined}
                disabled={o.backend && offline}
                onClick={() => setOp(o.id)}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="flex items-center gap-1.5 pt-2 text-[11.5px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Threat detection runs on this device. Nothing you paste is uploaded unless the operation requires the backend.
      </p>
    </div>
  );
}