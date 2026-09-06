import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Suspense, lazy } from 'react';
import {
  LayoutDashboard, ScanLine, History as HistoryIcon, BellRing, BarChart3, FileText,
  Settings as SettingsIcon, Shield, Menu, X, MoreHorizontal, Wifi, AlertTriangle
} from 'lucide-react';
import { apiHealth } from './lib/api';
import { getAlerts, getHistory, tierMeta } from './lib/store';
import { cx } from './components/ui';
import { toast, ToastHost } from './components/Toast';

import Dashboard from './pages/Dashboard';
import NewOperation from './pages/NewOperation';
import History from './pages/History';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import ThreatDefense from './pages/ThreatDefense';
const Analytics = lazy(() => import('./pages/Analytics'));

const PRIMARY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'screening', label: 'New Screening', icon: ScanLine },
  { id: 'history', label: 'Screening History', icon: HistoryIcon },
  { id: 'alerts', label: 'Alerts', icon: BellRing },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const PAGE_TITLES = Object.fromEntries(PRIMARY_NAV.map((n) => [n.id, n.label]).concat([['cyber', 'Rakshak Threat Defense']]));

function useHealth() {
  const [health, setHealth] = useState({ state: 'checking', modules: [], version: null });
  const wasOnlineRef = useRef(null);
  const check = useCallback(async () => {
    try {
      const data = await apiHealth();
      setHealth({ state: 'online', modules: data.modules_active || [], version: data.version });
      if (wasOnlineRef.current === false) toast('Backend is back online.', { type: 'success', title: 'Connection restored' });
      wasOnlineRef.current = true;
    } catch {
      setHealth((h) => ({ ...h, state: 'offline' }));
      if (wasOnlineRef.current !== false) toast('Cannot reach the screening backend.', { type: 'error', title: 'Backend offline' });
      wasOnlineRef.current = false;
    }
  }, []);
  useEffect(() => {
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [check]);
  return { state: health.state, modules: health.modules, version: health.version, refresh: check };
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs text-slate-500">
      {now.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })} · {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export default function App() {
  const [route, setRoute] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreSheet, setMoreSheet] = useState(false);
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('rakshak_demo') === '1');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const health = useHealth();

  const officer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('rakshak_officer')) || { name: 'Officer A. Sharma', id: 'OFFICER-7419', checkpoint: 'DELHI-IGI-T3-COUNTER-14' };
    } catch {
      return { name: 'Officer A. Sharma', id: 'OFFICER-7419', checkpoint: 'DELHI-IGI-T3-COUNTER-14' };
    }
  }, []);

  const alertCount = useMemo(() => getAlerts().filter((a) => !a.resolution).length, [route]);

  const scanStats = useMemo(() => {
    const today = new Date().toDateString();
    const list = getHistory();
    const todayScans = list.filter((r) => new Date(r.ts).toDateString() === today);
    return {
      today: todayScans.length,
      clearedToday: todayScans.filter((r) => tierMeta(r.riskTier).order === 0).length,
      flaggedToday: todayScans.filter((r) => tierMeta(r.riskTier).order >= 2 || r.watchlistFlagged).length,
    };
  }, [route]);

  const critical = useMemo(() => {
    const latest = getHistory()[0];
    if (!latest || bannerDismissed) return null;
    if (latest.watchlistFlagged || latest.riskTier === 'CRITICAL') return latest;
    return null;
  }, [route, bannerDismissed]);

  const navigate = (id) => {
    setRoute(id);
    setSidebarOpen(false);
    setMoreSheet(false);
  };

  const healthDot = health.state === 'online' ? 'bg-emerald-500' : health.state === 'offline' ? 'bg-red-500' : 'bg-amber-400';
  const healthLabel = health.state === 'online' ? 'All systems operational' : health.state === 'offline' ? 'Backend offline' : 'Checking…';

  const MobileMoreSheet = moreSheet && (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label="More options">
      <button className="absolute inset-0 bg-slate-900/50" aria-label="Close" onClick={() => setMoreSheet(false)} />
      <div className="relative w-full rounded-t-2xl bg-white p-4 pb-8 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">More</h2>
          <button onClick={() => setMoreSheet(false)} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
            { id: 'cyber', label: 'Threat Defense', icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => navigate(id)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50">
              <Icon className="h-5 w-5 text-blue-700" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      <aside className={cx('fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight text-slate-900">Rakshak AI</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Integrated Screening Station</div>
            </div>
          </div>
          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Operations</p>
          <ul className="space-y-1">
            {PRIMARY_NAV.map(({ id, label, icon: Icon }) => {
              const active = route === id;
              return (
                <li key={id}>
                  <button onClick={() => navigate(id)}
                    className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                      active ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="flex-1 text-left">{label}</span>
                    {id === 'alerts' && alertCount > 0 && (
                      <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-bold', active ? 'bg-white text-blue-700' : 'bg-red-100 text-red-700')}>{alertCount}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Integrations</p>
          <ul className="space-y-1">
            <li>
              <button onClick={() => navigate('cyber')}
                className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  route === 'cyber' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100')}>
                <Shield className="h-[18px] w-[18px]" />
                <span className="flex-1 text-left">Rakshak Threat Defense</span>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">ADD-ON</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-slate-200 px-4 py-3">
          <div className="text-xs font-semibold text-slate-800">{officer.name}</div>
          <div className="text-[10px] font-mono text-slate-400">{officer.id}</div>
          <div className="mt-1 text-[10px] text-slate-400">{officer.checkpoint}</div>
        </div>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 sm:text-lg">{PAGE_TITLES[route]}</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className={cx('h-2 w-2 rounded-full', healthDot)} aria-hidden="true" />
                {healthLabel}
                {demoMode && <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">DEMO MODE</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock />
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <Wifi className={cx('h-3.5 w-3.5', health.state === 'offline' ? 'text-red-500' : 'text-emerald-600')} aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-700">{officer.name}</span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5" title="Scans today">
                <ScanLine className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" />
                <span className="text-xs font-bold text-slate-800">{scanStats.today}</span>
              </span>
              <span className={cx('flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5', scanStats.flaggedToday > 0 ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50')} title="Flagged today">
                <BellRing className={cx('h-3.5 w-3.5', scanStats.flaggedToday > 0 ? 'text-red-600' : 'text-slate-400')} aria-hidden="true" />
                <span className={cx('text-xs font-bold', scanStats.flaggedToday > 0 ? 'text-red-700' : 'text-slate-600')}>{scanStats.flaggedToday}</span>
              </span>
            </div>
          </div>
        </header>

        {critical && (
          <div className="critical-flicker flex items-center gap-3 px-4 py-2 text-sm font-bold text-white">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">
              CRITICAL ALERT — {critical.person || 'passenger'} · {critical.riskTier} risk ({critical.riskScore}%){critical.watchlistFlagged ? ' · WATCHLIST MATCH' : ''}
            </span>
            <button className="shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white/90 hover:bg-white/20" onClick={() => setBannerDismissed(true)}>DISMISS</button>
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 lg:pb-6">
          {route === 'dashboard' && <Dashboard onNavigate={navigate} officer={officer} demoMode={demoMode} />}
          {route === 'screening' && <NewOperation healthState={health} onRefresh={health.refresh} />}
          {route === 'history' && <History />}
          {route === 'alerts' && <Alerts />}
          {route === 'reports' && <Reports />}
          {route === 'settings' && <SettingsPage onNavigate={navigate} demoMode={demoMode} setDemoMode={setDemoMode} />}
          {route === 'cyber' && <ThreatDefense />}
          {route === 'analytics' && (
            <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading analytics…</div>}>
              <Analytics />
            </Suspense>
          )}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'screening', label: 'Screening', icon: ScanLine, primary: true },
              { id: 'history', label: 'History', icon: HistoryIcon },
              { id: 'alerts', label: 'Alerts', icon: BellRing, badge: alertCount },
              { id: 'more', label: 'More', icon: MoreHorizontal },
            ].map(({ id, label, icon: Icon, primary, badge }) => (
              <button key={id} onClick={() => (id === 'more' ? setMoreSheet(true) : navigate(id))}
                className={cx('flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold', route === id ? 'text-blue-700' : 'text-slate-500')}>
                {primary ? (
                  <span className="-mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {badge > 0 && <span className="absolute -right-2 -top-1.5 rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">{badge}</span>}
                  </span>
                )}
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {MobileMoreSheet}
      <ToastHost />
    </div>
  );
}
