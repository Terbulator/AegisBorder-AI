import { useMemo, useState } from 'react';
import { FileText, ArrowDownToLine } from 'lucide-react';
import { Card, Badge, Button, EmptyState } from '../components/ui';
import { getHistory, formatTime, tierMeta } from '../lib/store';
import AuditReport from '../components/AuditReport';

export default function Reports() {
  const records = useMemo(() => getHistory(), []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400">Every screening creates an audit report. Open one to preview, download as PDF, print, or export the JSON package.</p>

      {records.length === 0 ? (
        <EmptyState icon={<FileText className="h-8 w-8 text-slate-300" />} title="No reports available"
          hint="Reports are generated from screenings in this session. Run a screening first." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => {
            const meta = tierMeta(r.riskTier);
            const audit = r.full?.audit_report || {};
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs font-bold text-blue-700">{audit.audit_id || r.id}</div>
                    <div className="mt-0.5 text-sm font-semibold text-slate-900">{r.person}</div>
                    <div className="text-xs text-slate-400">{r.documentNumber} · {formatTime(r.ts)}</div>
                  </div>
                  <Badge color={meta.color}>{meta.label}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">{r.decision} · <strong>{r.riskScore}%</strong></span>
                  <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => setSelected(r)}>
                    <ArrowDownToLine className="h-3.5 w-3.5" /> Open report
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selected?.full && <AuditReport screening={selected.full} onClose={() => setSelected(null)} />}
    </div>
  );
}