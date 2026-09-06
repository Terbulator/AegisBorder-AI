import { useMemo, useState } from 'react';
import { ScanLine, Users, CheckCircle2, AlertTriangle, BellRing, Radio, ArrowRight } from 'lucide-react';
import { Badge, Card, Button, EmptyState, StatusDot, cx } from '../components/ui';
import { getHistory, formatTime, kpisFromHistory, tierMeta } from '../lib/store';
import { apiHealth } from '../lib/api';

function Kpi({ icon, label, value, color, tone }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg', tone)}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
    </Card>
  );
}

export default function Dashboard({ onNavigate, officer, demoMode }) {
  const history = useMemo(() => getHistory(), []);
  const kpis = kpisFromHistory();
  const [health, setHealth] = useState('checking');

  useMemo(() => {
    apiHealth()
      .then(() => setHealth('online'))
      .catch(() => setHealth('offline'));
  }, []);

  const attention = getHistory()
    .filter((r) => tierMeta(r.riskTier).order >= 1 || r.watchlistFlagged)
    .slice(0, 5);

  const recent = history.slice(0, 6);

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span><strong>Demo mode is on.</strong> Built-in scenarios are simulated; IRL registration still uses the real pipeline.</span>
        </div>
      )}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Good day, {officer.name.split(' ')[0]}.</h2>
            <p className="mt-1 text-sm text-slate-500">Welcome to the Rakshak integrated border screening station.</p>
          </div>
          <Button onClick={() => onNavigate('screening')} className="md:px-6">
            <ScanLine className="h-4 w-4" /> START NEW SCREENING
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="People screened" value={kpis.screened} icon={<Users className="h-4 w-4" />} tone="bg-blue-50 text-blue-700" />
        <Kpi label="Cleared" value={kpis.cleared} icon={<CheckCircle2 className="h-4 w-4" />} tone="bg-emerald-50 text-emerald-700" />
        <Kpi label="Needs review" value={kpis.review} icon={<AlertTriangle className="h-4 w-4" />} tone="bg-amber-50 text-amber-700" />
        <Kpi label="Active alerts" value={kpis.alerts} icon={<BellRing className="h-4 w-4" />} tone="bg-red-50 text-red-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">Recent screening</h3>
            {history.length > 0 && (
              <button onClick={() => onNavigate('history')} className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={<ScanLine className="h-8 w-8 text-slate-300" />} title="No screenings yet"
              hint="Run your first screening from New Screening to begin." />
          ) : (
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2 font-semibold">Person</th>
                    <th className="px-4 py-2 font-semibold">Doc no.</th>
                    <th className="px-4 py-2 font-semibold">Risk</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => {
                    const meta = tierMeta(r.riskTier);
                    return (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <div className="font-semibold text-slate-900">{r.person}</div>
                          <div className="text-xs text-slate-400">{r.documentType} · {r.nationality || '—'}</div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{r.documentNumber}</td>
                        <td className="px-4 py-2.5">
                          <Badge color={meta.color}>{meta.label}</Badge>
                          <span className="ml-1.5 text-xs font-semibold text-slate-400">{r.riskScore}%</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{r.decision}</td>
                        <td className="px-4 py-2.5 text-right text-xs text-slate-400">{formatTime(r.ts)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="divide-y divide-slate-100 md:hidden">
            {recent.map((r) => {
              const meta = tierMeta(r.riskTier);
              return (
                <button key={r.id} onClick={() => onNavigate('history')} className="block w-full px-4 py-3 text-left hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{r.person}</span>
                    <Badge color={meta.color}>{meta.label}</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">{r.documentNumber} · {formatTime(r.ts)}</div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Needs your attention</h3>
              <button onClick={() => onNavigate('alerts')} className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
                Alerts <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {attention.length === 0 ? (
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No pending flags
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {attention.map((r) => {
                  const meta = tierMeta(r.riskTier);
                  return (
                    <Card key={r.id} className="flex items-center gap-3 p-3">
                      <StatusDot color={meta.color} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{r.person}</div>
                        <div className="text-xs text-slate-400">{r.riskScore}% {r.riskTier} · {r.decision}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-900">System health</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600"><Radio className="h-4 w-4 text-slate-400" /> Screening engine</span>
                <Badge color={health === 'online' ? 'green' : health === 'offline' ? 'red' : 'amber'}>
                  {health === 'online' ? 'Online' : health === 'offline' ? 'Offline' : 'Checking'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Watchlist & verification</span>
                <Badge color={health === 'online' ? 'green' : 'red'}>{health === 'online' ? 'Loaded' : 'Unavailable'}</Badge>
              </div>
              <p className="pt-1 text-xs text-slate-400">History and analytics are stored per the current session using real screening results.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}