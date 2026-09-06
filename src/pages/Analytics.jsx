import { useMemo } from 'react';
import { BarChart3, Users, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, EmptyState } from '../components/ui';
import { analyticsFromHistory, tierMeta } from '../lib/store';

const OP_LABELS = {
  message: 'Message Scanner', website: 'Website Checker', qr: 'QR & UPI Safety', app: 'App Safety',
  registry: 'Scam Registry', document: 'Document & Identity Screening', ai: 'AI Threat Analysis',
};

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-right text-xs font-semibold text-slate-500">{label}</span>
      <div className="h-5 flex-1 overflow-hidden rounded-md bg-slate-100">
        <div className={cxBar(color)} style={{ width: `${Math.max(4, pct)}%` }} title={`${value}`} />
      </div>
      <span className="w-8 shrink-0 text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

function cxBar(color) {
  const map = { blue: 'bg-blue-600', green: 'bg-emerald-500', amber: 'bg-amber-500', orange: 'bg-orange-500', red: 'bg-red-600' };
  return `h-full rounded-md ${map[color] || map.blue}`;
}

export default function Analytics() {
  const data = useMemo(() => analyticsFromHistory(), []);
  const maxTier = Math.max(1, ...Object.values(data.byTier));
  const maxHour = Math.max(1, ...Object.values(data.byHour));

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400">Aggregates of the {data.total} screenings recorded in this session.</p>

      {data.total === 0 ? (
        <EmptyState icon={<BarChart3 className="h-8 w-8 text-slate-300" />} title="No data yet"
          hint="Run a few screenings to populate analytics, or load the demo scenarios from New Screening." />
      ) : (
        <>
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-bold text-slate-900">Screening outcomes by risk level</h2>
            <div className="space-y-2">
              {Object.entries(data.byTier).map(([tier, count]) => (
                <Bar key={tier} label={tierMeta(tier).short} value={count} max={maxTier} color={tierMeta(tier).color} />
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-bold text-slate-900">Screenings by hour of day</h2>
              {data.total === 0 ? <p className="text-sm text-slate-400">No data.</p> : (
                <div className="flex items-end gap-1" style={{ height: 120 }}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="group relative flex-1">
                      <div className="mx-0.5 rounded-t bg-blue-200 transition-colors hover:bg-blue-500" title={`${h}:00 — ${data.byHour[h] || 0}`}
                        style={{ height: `${((data.byHour[h] || 0) / maxHour) * 100}%`, minHeight: 2 }} />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-sm font-bold text-slate-900">Module flags detected</h2>
              <div className="space-y-3">
                <FlagRow icon={<ShieldAlert className="h-4 w-4" />} label="Face / liveness failed" count={data.failures.faceFail} color="red" />
                <FlagRow icon={<BarChart3 className="h-4 w-4" />} label="Photo tampering detected" count={data.failures.tamperFail} color="orange" />
                <FlagRow icon={<AlertTriangle className="h-4 w-4" />} label="Document validation failed" count={data.failures.validFail} color="amber" />
                <FlagRow icon={<AlertTriangle className="h-4 w-4" />} label="Watchlist matches" count={data.failures.watchlistFail} color="red" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-bold text-slate-900">Scans by operation</h2>
              <div className="space-y-2">
                {Object.entries(data.byOperation).map(([op, count]) => (
                  <Bar key={op} label={OP_LABELS[op] || op} value={count} max={Math.max(1, ...Object.values(data.byOperation))} color="blue" />
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-sm font-bold text-slate-900">Threat distribution</h2>
              <div className="space-y-2">
                {Object.entries(data.byCategory).map(([cat, count]) => (
                  <Bar key={cat} label={cat} value={count} max={Math.max(1, ...Object.values(data.byCategory))} color="orange" />
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<Users className="h-4 w-4" />} label="Total screened" value={data.total} />
            <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Verified (LOW)" value={data.byTier.LOW} />
            <Stat icon={<AlertTriangle className="h-4 w-4" />} label="Reviewed (MODERATE)" value={data.byTier.MODERATE} />
          </div>
        </>
      )}
    </div>
  );
}

function FlagRow({ icon, label, count, color }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-700">{icon} {label}</span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${color === 'red' ? 'bg-red-100 text-red-700' : color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>{count}</span>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <Card className="p-4">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">{icon} {label}</div>
    </Card>
  );
}