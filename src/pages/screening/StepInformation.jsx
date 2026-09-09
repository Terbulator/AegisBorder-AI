import { Card, cx } from '../../components/ui';
import { FadeIn } from '../../components/motion';

function InfoRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className={cx('text-sm font-semibold', tone === 'warn' ? 'text-amber-700' : tone === 'fail' ? 'text-red-700' : 'text-slate-900', tone === 'mono' && 'font-mono')}>{value || '—'}</span>
    </div>
  );
}

export default function StepInformation({ result, documentImage }) {
  if (!result) {
    return (
      <FadeIn y={10}>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">2</div>
            <div><h2 className="text-sm font-bold text-slate-900">Information</h2><p className="text-xs text-slate-500">Extracted document fields from OCR and MRZ.</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-400">
            Run the screening to extract document information.
          </div>
        </Card>
      </FadeIn>
    );
  }

  const mrz = result.extracted_data?.mrz || {};
  const viz = result.extracted_data?.viz || {};
  const docVal = result.document_validation || {};

  return (
    <FadeIn y={10}>
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">2</div>
          <div><h2 className="text-sm font-bold text-slate-900">Information</h2><p className="text-xs text-slate-500">Extracted document fields from OCR and MRZ.</p></div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Full name" value={mrz.full_name || viz.full_name} />
          <InfoRow label="Document number" value={mrz.document_number || viz.document_number} tone="mono" />
          <InfoRow label="Document type" value={`${mrz.document_type || ''} (${mrz.format || ''})`.trim()} />
          <InfoRow label="Nationality" value={mrz.nationality || viz.nationality} />
          <InfoRow label="Date of birth" value={mrz.date_of_birth || viz.date_of_birth} />
          <InfoRow label="Date of expiry" value={mrz.date_of_expiry || viz.date_of_expiry} />
          <InfoRow label="Sex" value={mrz.sex || viz.sex} />
          <InfoRow label="MRZ checksums" value={mrz.checksums?.overall_valid ? 'Valid' : 'Invalid'} tone={mrz.checksums?.overall_valid ? undefined : 'fail'} />
          <InfoRow label="Document validity" value={docVal.is_valid ? 'Valid' : 'Discrepancies found'} tone={docVal.is_valid ? undefined : 'warn'} />
          <InfoRow label="Expiration" value={docVal.is_expired ? 'EXPIRED' : 'Valid'} tone={docVal.is_expired ? 'fail' : undefined} />
        </div>
        {mrz.checksums && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-xs font-bold text-slate-600">ICAO 9303 check digits</div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {Object.entries(mrz.checksums).filter(([k]) => k !== 'overall_valid').map(([ck, cv]) => (
                <div key={ck} className={cx('flex items-center justify-between rounded-md border px-3 py-1.5 text-xs', cv.valid ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50')}>
                  <span className="font-semibold text-slate-700">{ck.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-slate-600">extracted {cv.extracted} · calc {cv.calculated} {cv.valid ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {docVal.discrepancies?.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Discrepancies flagged:</strong>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {docVal.discrepancies.map((d, i) => <li key={i}>{d.description || `${d.field} (${d.category})`}</li>)}
            </ul>
          </div>
        )}
      </Card>
    </FadeIn>
  );
}
