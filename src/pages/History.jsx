import { useMemo, useState } from 'react';
import { Search, History as HistoryIcon, Trash2, FileText } from 'lucide-react';
import { Card, Badge, Button, EmptyState, cx, IconButton } from '../components/ui';
import { getHistory, deleteRecord, formatTime, secondsAgo, tierMeta } from '../lib/store';
import AuditReport from '../components/AuditReport';
import ThreatReport from '../components/operations/ThreatReport';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'verified', label: 'Verified' },
  { id: 'review', label: 'Needs review' },
  { id: 'flagged', label: 'Escalated' },
];

export default function History() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const all = useMemo(() => getHistory(), []);

  const rows = useMemo(() => {
    return all.filter((r) => {
      if (filter === 'verified' && tierMeta(r.riskTier).order !== 0) return false;
      if (filter === 'review' && tierMeta(r.riskTier).order !== 1) return false;
      if (filter === 'flagged' && tierMeta(r.riskTier).order < 2 && !r.watchlistFlagged) return false;
      const q = query.trim().toLowerCase();
      if (q && ![r.person, r.documentNumber, r.nationality, r.id].some((v) => String(v || '').toLowerCase().includes(q))) return false;
      return true;
    });
  }, [all, filter, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cx('rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                filter === f.id ? 'bg-blue-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50')}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, doc no., nationality…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Screening records from this session ({all.length}) — stored on this device, from real API results.
      </p>

      {rows.length === 0 ? (
        <EmptyState icon={<HistoryIcon className="h-8 w-8 text-slate-300" />} title={all.length === 0 ? 'No screenings recorded yet' : 'No results match'}
          hint={all.length === 0 ? 'Run your first screening from New Screening.' : 'Try a different search or filter.'} />
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full rounded-xl bg-white text-sm shadow-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-semibold">Case</th>
                  <th className="px-4 py-3 font-semibold">Person</th>
                  <th className="px-4 py-3 font-semibold">Document</th>
                  <th className="px-4 py-3 font-semibold">Risk</th>
                  <th className="px-4 py-3 font-semibold">Decision</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const meta = tierMeta(r.riskTier);
                  return (
                    <tr key={r.id} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50" onClick={() => setSelected(r)}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700">{r.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{r.person}</div>
                        <div className="text-xs text-slate-400">{secondsAgo(r.ts)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-slate-600">{r.documentNumber}</div>
                        <div className="text-xs text-slate-400">{r.documentType} · {r.nationality || '—'}</div>
                      </td>
                      <td className="px-4 py-3"><Badge color={meta.color}>{meta.label}</Badge><span className="ml-1 text-xs font-semibold text-slate-400">{r.riskScore}%</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{r.decision}</td>
                      <td className="px-4 py-3">
                        {r.source === 'scenario' ? <Badge color="amber">Demo</Badge> : <Badge color="blue">Live</Badge>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatTime(r.ts)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="secondary" className="!px-2 !py-1 text-xs" onClick={() => setSelected(r)}>
                            <FileText className="h-3.5 w-3.5" /> View
                          </Button>
                          <IconButton label="Delete record" onClick={() => deleteRecord(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 md:hidden">
            {rows.map((r) => {
              const meta = tierMeta(r.riskTier);
              return (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <button className="min-w-0 text-left" onClick={() => setSelected(r)}>
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="truncate">{r.person}</span>
                        <Badge color={meta.color}>{meta.label}</Badge>
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-slate-400">{r.documentNumber} · {secondsAgo(r.ts)}</div>
                    </button>
                    <Badge color={r.source === 'scenario' ? 'amber' : 'blue'}>{r.source === 'scenario' ? 'Demo' : 'Live'}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                    <div className="text-xs text-slate-500">{r.decision} · <span className="font-bold">{r.riskScore}%</span></div>
                    <div className="flex items-center gap-1">
                      <Button variant="secondary" className="!px-3 !py-1 text-xs" onClick={() => setSelected(r)}>View report</Button>
                      <IconButton label="Delete record" onClick={() => deleteRecord(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {selected && (selected.operationType
        ? <ThreatReport record={selected} onClose={() => setSelected(null)} />
        : selected.full && <AuditReport screening={selected.full} onClose={() => setSelected(null)} />)}
    </div>
  );
}