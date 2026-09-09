import { Eye, EyeOff, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { Card, Badge, Button, verifyIcon, cx } from '../../components/ui';
import { FadeIn, RiskReveal } from '../../components/motion';
import { useT } from '../../i18n';

export default function StepAnalysis({ result, setShowTechnical, showTechnical, setStep }) {
  const { t } = useT();
  if (!result) {
    return (
      <FadeIn y={10}>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">4</div>
            <div><h2 className="text-sm font-bold text-slate-900">Analysis</h2><p className="text-xs text-slate-500">Module-by-module screening summary.</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-400">Run the screening to view the analysis.</div>
        </Card>
      </FadeIn>
    );
  }

  const checks = [
    { name: t('chk_ocr'), state: result?.extracted_data ? 'pass' : 'fail', desc: t('chk_ocr_desc') },
    { name: t('chk_mrz'), state: result?.extracted_data?.mrz?.checksums?.overall_valid ? 'pass' : 'fail', desc: t('chk_mrz_desc') },
    { name: t('chk_doc_valid'), state: result?.document_validation?.is_valid ? 'pass' : 'fail', desc: result?.document_validation?.is_valid ? t('chk_no_discrep') : (result?.document_validation?.discrepancies || []).map((d) => d.description).join('; ') },
    { name: t('chk_forensics'), state: result?.forensics?.summary?.is_photo_tampered === false ? 'pass' : 'fail', desc: result?.forensics?.summary?.is_photo_tampered ? t('chk_tamper_detected') : t('chk_no_tamper') },
    { name: t('chk_metadata'), state: result?.forensics?.summary?.detected_software ? 'warn' : 'pass', desc: result?.forensics?.summary?.detected_software ? `${t('editing_software')}: ${result.forensics.summary.detected_software.join(', ')}` : t('no_editing_traces') },
    { name: t('chk_face'), state: result?.biometrics?.biometric_available === false ? 'warn' : (result?.biometrics?.is_matched ? 'pass' : 'fail'), desc: result?.biometrics?.biometric_available === false ? t('no_live_capture') : (result?.biometrics?.is_matched ? `${t('match')} ${result.biometrics.match_score}% · ${t('liveness')} ${result.biometrics.liveness?.is_live ? t('liveness_ok') : t('liveness_failed')}` : `${t('match')} ${result.biometrics.match_score}% — ${result.biometrics.confidence || 'MISMATCH'}`) },
    { name: t('chk_watchlist'), state: result?.watchlist_screening?.flagged ? 'fail' : 'pass', desc: result?.watchlist_screening?.flagged ? (result.watchlist_screening.alerts || []).map((a) => a.reason).join('; ') : t('no_watchlist_match') },
  ];

  const compKeys = [
    { label: t('comp_mrz'), key: 'integrity_risk' },
    { label: t('comp_forensics'), key: 'forensic_tamper_risk' },
    { label: t('comp_face'), key: 'biometric_mismatch_risk' },
    { label: t('comp_watchlist'), key: 'watchlist_risk' },
  ];

  const risk = result.risk_assessment || {};
  const forensics = result.forensics?.summary || {};

  return (
    <FadeIn y={10}>
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">4</div>
          <div><h2 className="text-sm font-bold text-slate-900">Analysis</h2><p className="text-xs text-slate-500">Module-by-module screening summary. Technical evidence is available in the details view.</p></div>
        </div>

        <ul className="space-y-2">
          {checks.map((c) => (
            <li key={c.name} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              {verifyIcon(c.state)}
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                <div className="text-xs text-slate-500">{c.desc}</div>
              </div>
              <Badge color={c.state === 'pass' ? 'green' : c.state === 'warn' ? 'amber' : 'red'}>
                {c.state === 'pass' ? 'Passed' : c.state === 'warn' ? 'Review' : 'Failed'}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {compKeys.map(({ label, key }) => (
            <div key={key} className="rounded-lg border border-slate-200 px-3 py-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{label}</span><span>{risk.component_scores?.[key] ?? 0}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-navy-700" style={{ width: `${risk.component_scores?.[key] ?? 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowTechnical(!showTechnical)} className="mt-4 flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:underline">
          {showTechnical ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showTechnical ? t('hide') : t('view')} technical forensics detail
        </button>

        <RiskReveal show={showTechnical && !!result?.forensics?.visuals}>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(result.forensics.visuals).filter(([k]) => k !== 'original' && result.forensics.visuals[k]).slice(0, 4).map(([k, v]) => (
              <figure key={k} className="rounded-lg border border-slate-200 p-2">
                <img src={v} alt={k} className="w-full rounded object-contain" />
                <figcaption className="mt-1 text-center text-[10px] font-semibold uppercase text-slate-400">{k.replace(/_/g, ' ')}</figcaption>
              </figure>
            ))}
          </div>
        </RiskReveal>

        <RiskReveal show={showTechnical}>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">ELA score</span><span className="font-mono text-slate-700">{Number(forensics.ela_score ?? 0).toFixed(1)}%</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Noise discrepancy</span><span className="font-mono text-slate-700">{Number(forensics.noise_discrepancy_score ?? 0).toFixed(1)}%</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Photo tamper score</span><span className="font-mono text-slate-700">{Number(forensics.photo_tamper_score ?? 0).toFixed(1)}%</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Metadata tamper</span><span className="font-mono text-slate-700">{Number(forensics.metadata_tamper_score ?? 0).toFixed(1)}%</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Noise anomaly blocks</span><span className="font-mono text-slate-700">{forensics.noise_anomalies_count != null ? String(forensics.noise_anomalies_count) : '—'}</span></div>
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Suspicious splicing regions</span><span className="font-mono text-slate-700">{forensics.suspicious_bboxes?.length != null ? String(forensics.suspicious_bboxes.length) : '—'}</span></div>
            {forensics.detected_software?.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                Editing software detected: {forensics.detected_software.join(', ')}
              </div>
            )}
          </div>
        </RiskReveal>

        <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
          <Button onClick={() => setStep(4)}>Continue to result <ShieldCheck className="h-4 w-4" /></Button>
        </div>
      </Card>
    </FadeIn>
  );
}