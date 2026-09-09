import ReportTemplate from './ReportTemplate';

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({ k, v, mono }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <span className="text-xs font-medium text-slate-500">{k}</span>
      <span className={`text-sm font-semibold text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}>{v || '—'}</span>
    </div>
  );
}

export default function AuditReport({ screening, onClose }) {
  const audit = screening?.audit_report || {};
  const risk = screening?.risk_assessment || {};
  const mrz = screening?.extracted_data?.mrz || {};
  const viz = screening?.extracted_data?.viz || {};
  const forensics = screening?.forensics?.summary || {};
  const docVal = screening?.document_validation || {};
  const meta = screening ? { color: 'slate', label: '—' } : { color: 'slate', label: '—' };
  const tier = risk.risk_tier;
  const colorMap = { LOW: 'green', MODERATE: 'amber', HIGH: 'orange', CRITICAL: 'red' };
  const actualMeta = { color: colorMap[tier] || 'slate', label: tier || '—' };

  const classificationFields = [
    { k: 'Case', v: audit.audit_id, mono: true },
    { k: 'Issued', v: audit.timestamp ? new Date(audit.timestamp).toLocaleString() : '—' },
    { k: 'Full name', v: mrz.full_name || viz.full_name },
    { k: 'Document number', v: mrz.document_number || viz.document_number, mono: true },
    { k: 'Document type', v: `${mrz.document_type || ''} (${mrz.format || ''})`.trim() },
    { k: 'Nationality', v: mrz.nationality || viz.nationality },
    { k: 'Date of birth', v: mrz.date_of_birth || viz.date_of_birth },
    { k: 'Date of expiry', v: mrz.date_of_expiry || viz.date_of_expiry },
    { k: 'Sex', v: mrz.sex || viz.sex },
    { k: 'Document valid', v: docVal.is_valid ? 'Yes' : 'No' },
    { k: 'Expired', v: docVal.is_expired ? 'Yes' : 'No' },
    { k: 'Validation score', v: docVal.validation_score != null ? `${docVal.validation_score}%` : '—' },
    { k: 'Photo tampering', v: forensics.is_photo_tampered ? 'Detected' : 'None detected' },
    { k: 'ELA score', v: `${Number(forensics.ela_score ?? 0).toFixed(1)}%` },
    { k: 'Noise discrepancy', v: `${Number(forensics.noise_discrepancy_score ?? 0).toFixed(1)}%` },
    { k: 'Metadata tampering', v: `${Number(forensics.metadata_tamper_score ?? 0).toFixed(1)}%` },
    { k: 'Noise anomaly blocks', v: forensics.noise_anomalies_count != null ? String(forensics.noise_anomalies_count) : '—' },
  ];

  const indicators = screening?.watchlist_screening?.alerts?.map((a) => a.reason) || [];
  const evidence = screening?.forensics?.summary?.detected_software?.map((s) => `Editing software: ${s}`) || [];

  return (
    <ReportTemplate
      record={screening}
      onClose={onClose}
      title="Border Inspection Audit Certificate"
      badgeLabel={actualMeta.label}
      riskTier={tier}
      riskScore={risk.overall_risk_score}
      opLabel="Border Inspection Audit Certificate"
      classificationFields={classificationFields}
      indicators={indicators.length ? indicators : undefined}
      evidence={evidence.length ? evidence : undefined}
      jsonName="screening_report"
    />
  );
}