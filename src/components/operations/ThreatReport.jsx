import ReportTemplate from '../ReportTemplate';

export default function ThreatReport({ record, onClose }) {
  const meta = record.riskTier ? { color: { LOW: 'green', MODERATE: 'amber', HIGH: 'orange', CRITICAL: 'red' }[record.riskTier] || 'slate', label: record.riskTier } : { color: 'slate', label: '—' };

  return (
    <ReportTemplate
      record={record}
      onClose={onClose}
      title="Threat Analysis Report"
      badgeLabel={meta.label}
      riskTier={record.riskTier}
      riskScore={record.riskScore}
      opLabel={record.operationType || record.person || 'Threat Analysis'}
      classificationFields={[
        { k: 'Operation', v: record.operationType || '—' },
        { k: 'Classification', v: record.classification },
        { k: 'Target / identifier', v: record.documentNumber, mono: true },
        { k: 'Decision', v: record.decision },
        { k: 'Watchlist flag', v: record.watchlistFlagged ? 'Yes' : 'No' },
        { k: 'Confidence', v: record.confidence != null ? `${record.confidence}%` : '—' },
      ]}
      jsonName="threat_report"
    />
  );
}