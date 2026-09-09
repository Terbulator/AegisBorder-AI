import { CheckCircle2, AlertTriangle, ShieldCheck, Lock, RefreshCw, KeyRound, X } from 'lucide-react';
import { Card, Badge, Button, cx } from '../../components/ui';
import { tierMeta } from '../../lib/store';
import { FadeIn, StatusTransition } from '../../components/motion';
import AuditReport from '../../components/AuditReport';
import { useT } from '../../i18n';

export default function StepResult({ result, recordId, officerStatus, setOfficerStatus, setShowReport, takeAction, resetWizard, setStep }) {
  const { t } = useT();
  if (!result) return null;

  const risk = result.risk_assessment || {};
  const watch = result.watchlist_screening || {};
  const meta = tierMeta(risk.risk_tier);

  const granted = risk.recommended_decision?.toUpperCase().includes('GRANT');

  return (
    <FadeIn y={12}>
      <Card className="overflow-hidden">
        <div className={cx('p-5', meta.color === 'green' && 'border-t-4 border-emerald-500', meta.color === 'amber' && 'border-t-4 border-amber-500', meta.color === 'orange' && 'border-t-4 border-orange-500', meta.color === 'red' && 'border-t-4 border-red-600')}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className={cx('flex h-16 w-16 items-center justify-center rounded-full text-white', meta.color === 'green' ? 'bg-emerald-600' : meta.color === 'amber' ? 'bg-amber-500' : meta.color === 'orange' ? 'bg-orange-500' : 'bg-red-600')}>
                {meta.color === 'green' ? <CheckCircle2 className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">{meta.label}</h2>
                  <Badge color={meta.color}>{risk.risk_tier} · {risk.overall_risk_score}%</Badge>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{risk.recommended_decision}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs font-semibold uppercase text-slate-400">Composite risk score</div>
              <div className="text-3xl font-black text-slate-900">{risk.overall_risk_score}<span className="text-lg text-slate-400">%</span></div>
            </div>
          </div>

          {risk.action_summary && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <strong className="text-slate-800">Recommendation:</strong> {risk.action_summary}
            </div>
          )}

          {risk.risk_factors?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Reasons for this decision</p>
              <ul className="space-y-1.5">
                {risk.risk_factors.map((f, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-700"><span className="font-bold text-slate-900">{f.module}:</span> {f.description}</span>
                    {f.impact && <span className="shrink-0 text-xs font-bold text-slate-500">{f.impact}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {watch.flagged && (
            <div className="critical-flicker mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-white">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>WATCHLIST ALERT — {watch.highest_severity} severity. {(watch.alerts || []).map((a) => a.reason).join(' ')}</span>
            </div>
          )}

          {risk.risk_tier === 'CRITICAL' && !watch.flagged && (
            <div className="critical-flicker mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-white">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>CRITICAL — {risk.overall_risk_score}% composite risk. {risk.recommended_decision}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <span className="mr-auto text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Officer action:
          </span>
          <Button variant="success" onClick={() => takeAction('approved')} disabled={!!officerStatus}>
            <CheckCircle2 className="h-4 w-4" /> Verify & clear
          </Button>
          <Button variant="secondary" onClick={() => takeAction('review')} disabled={!!officerStatus}>
            Send to secondary
          </Button>
          <Button variant="danger" onClick={() => takeAction('escalated')} disabled={!!officerStatus}>
            Escalate / detain
          </Button>
          <Button variant="secondary" onClick={() => setShowReport(true)}><KeyRound className="h-4 w-4" /> Audit report</Button>
        </div>
        {officerStatus && (
          <StatusTransition code={officerStatus}>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
              <span className="text-sm text-slate-600">
                Case recorded as <strong>{officerStatus === 'approved' ? 'Verified & cleared' : officerStatus === 'review' ? 'Sent to secondary inspection' : 'Escalated / detain'}</strong>.
              </span>
              <Button variant="secondary" onClick={resetWizard}>
                <RefreshCw className="h-4 w-4" /> New screening
              </Button>
            </div>
          </StatusTransition>
        )}
      </Card>
      {recordId && <AuditReport screening={result} onClose={() => setShowReport(false)} />}
    </FadeIn>
  );
}