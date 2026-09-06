import { useMemo, useState } from 'react';
import { BellRing, ShieldAlert, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
import { Card, Badge, Button, EmptyState, cx } from '../components/ui';
import { resolveAlert, syncAlertsFromHistory } from '../lib/store';

const SEVERITY_COLOR = { Critical: 'red', High: 'orange', Moderate: 'amber', Low: 'slate' };

export default function Alerts() {
  const [alerts, setAlerts] = useState(() => syncAlertsFromHistory());
  const [filter, setFilter] = useState('open');

  const rows = useMemo(() => {
    return alerts.filter((a) => (filter === 'open' ? !a.resolution : filter === 'resolved' ? !!a.resolution : true));
  }, [alerts, filter]);

  const openCount = alerts.filter((a) => !a.resolution).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700">{openCount} open</span>
          <div className="flex rounded-full border border-slate-300 bg-white p-0.5 text-sm">
            {['open', 'resolved', 'all'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cx('rounded-full px-4 py-1 font-semibold capitalize', filter === f ? 'bg-blue-700 text-white' : 'text-slate-600')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400">Alerts are derived from real High-risk, Critical and watchlist-flagged screenings in this session.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<ShieldCheck className="h-8 w-8 text-slate-300" />} title="No alerts"
          hint={openCount === 0 ? 'All flagged screenings have been handled. Great work.' : 'No alerts match this filter.'} />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rows.map((a) => {
            const color = SEVERITY_COLOR[a.severity] || 'slate';
            const resolved = !!a.resolution;
            return (
              <Card key={a.id} className={cx('p-4', resolved && 'opacity-70')}>
                <div className="flex items-start gap-3">
                  <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    resolved ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                    {resolved ? <CheckCircle2 className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                      <Badge color={color}>{a.severity}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{a.person} · {a.documentNumber} · {a.id}</p>
                    {a.factors?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {a.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-red-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        Score {a.riskScore}% · Recommended: <strong>{a.recommended}</strong>
                      </span>
                      {!resolved ? (
                        <div className="flex gap-2">
                          <Button variant="secondary" className="!px-3 !py-1 text-xs" onClick={() => setAlerts(resolveAlert(a.id, 'watching'))}>
                            Mark watching
                          </Button>
                          <Button variant="success" className="!px-3 !py-1 text-xs" onClick={() => setAlerts(resolveAlert(a.id, 'handled'))}>
                            <Shield className="h-3.5 w-3.5" /> Mark handled
                          </Button>
                        </div>
                      ) : (
                        <Badge color="green">Handled — {a.resolution}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}