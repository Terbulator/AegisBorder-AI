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
import { useT } from '../i18n';

function buildGroups(t) {
  return [
  {
    title: t('identity_security'),
    description: t('identity_security_desc'),
    ops: [
      { id: 'document', title: t('op_document'), icon: IdCard, desc: t('op_document_desc'), inputs: t('op_document_inputs'), backend: true, focus: 'document' },
      { id: 'mrz', title: t('op_mrz'), icon: FileText, desc: t('op_mrz_desc'), inputs: t('op_mrz_inputs'), backend: true, focus: 'mrz' },
      { id: 'biometrics', title: t('op_biometrics'), icon: ScanFace, desc: t('op_biometrics_desc'), inputs: t('op_biometrics_inputs'), backend: true, focus: 'biometrics' },
      { id: 'forensics', title: t('op_forensics'), icon: Search, desc: t('op_forensics_desc'), inputs: t('op_forensics_inputs'), backend: true, focus: 'forensics' },
      { id: 'watchlist', title: t('op_watchlist'), icon: ShieldAlert, desc: t('op_watchlist_desc'), inputs: t('op_watchlist_inputs'), backend: true, focus: 'watchlist' },
      { id: 'audit', title: t('op_audit'), icon: FileCheck2, desc: t('op_audit_desc'), inputs: t('op_audit_inputs'), backend: true, focus: 'audit' },
    ],
  },
  {
    title: t('threat_detection'),
    description: t('threat_detection_desc'),
    ops: [
      { id: 'message', title: t('op_message'), icon: MessageSquare, desc: t('op_message_desc'), inputs: t('op_message_inputs'), Op: MessageOp },
      { id: 'website', title: t('op_website'), icon: Globe, desc: t('op_website_desc'), inputs: t('op_website_inputs'), Op: WebsiteOp },
      { id: 'qr-upi', title: t('op_qr_upi'), icon: QrCode, desc: t('op_qr_upi_desc'), inputs: t('op_qr_upi_inputs'), Op: QrUpIOp },
      { id: 'app', title: t('op_app'), icon: Smartphone, desc: t('op_app_desc'), inputs: t('op_app_inputs'), Op: AppOp },
      { id: 'scam-registry', title: t('op_registry'), icon: Database, desc: t('op_registry_desc'), inputs: t('op_registry_inputs'), Op: RegistryOp },
    ],
  },
  {
    title: t('ai_analysis'),
    description: t('ai_analysis_desc'),
    ops: [
      { id: 'ai-analysis', title: t('op_ai'), icon: BrainCircuit, desc: t('op_ai_desc'), inputs: t('op_ai_inputs'), Op: AiThreatOp },
    ],
  },
]; 
}

export default function NewOperation({ healthState, onRefresh }) {
  const { t } = useT();
  const GROUPS = buildGroups(t);
  const [op, setOp] = useState(null);
  const current = op ? GROUPS.flatMap((g) => g.ops).find((o) => o.id === op) : null;

  if (current?.focus) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setOp(null)}
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t('all_operations')}
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
          <h2 className="text-lg font-bold text-slate-900">{t('select_operation')}</h2>
          <p className="text-sm text-slate-500">{t('operation_subtitle')}</p>
        </div>
        <Badge color={healthState?.state === 'checking' ? 'amber' : offline ? 'red' : 'green'}>
          {healthState?.state === 'checking' ? t('checking_backend') : offline ? t('backend_offline_identity') : t('all_operational')}
        </Badge>
      </div>

      {offline && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <ServerOff className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-900">
              {t('backend_offline_note')}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> {t('retry_connection')}
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
        {t('privacy_note')}
      </p>
    </div>
  );
}