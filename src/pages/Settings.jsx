import { useState } from 'react';
import { User, MapPin, Languages, FlaskConical, Check, Save } from 'lucide-react';
import { Card, Button, Badge, cx } from '../components/ui';
import { useT, listLanguages } from '../i18n';

const fieldCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600';
const labelCls = 'mb-1 block text-xs font-semibold text-slate-600';

export default function SettingsPage({ demoMode, setDemoMode }) {
  const { lang, setLang } = useT();
  const [officer, setOfficer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rakshak_officer')) ||
        { name: 'Officer A. Sharma', id: 'OFFICER-7419', checkpoint: 'DELHI-IGI-T3-COUNTER-14' };
    } catch {
      return { name: 'Officer A. Sharma', id: 'OFFICER-7419', checkpoint: 'DELHI-IGI-T3-COUNTER-14' };
    }
  });
  const [saved, setSaved] = useState(false);

  const saveOfficer = () => {
    localStorage.setItem('rakshak_officer', JSON.stringify(officer));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDemo = () => {
    const next = !demoMode;
    localStorage.setItem('rakshak_demo', next ? '1' : '0');
    setDemoMode(next);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-700" />
          <h2 className="text-sm font-bold text-slate-900">Officer & station profile</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Officer name</label>
            <input value={officer.name} onChange={(e) => setOfficer({ ...officer, name: e.target.value })} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Officer ID</label>
            <input value={officer.id} onChange={(e) => setOfficer({ ...officer, id: e.target.value })} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Checkpoint / counter</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input value={officer.checkpoint} onChange={(e) => setOfficer({ ...officer, checkpoint: e.target.value })} className={cx(fieldCls, 'pl-9')} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          {saved && <Badge color="green"><Check className="h-3 w-3" /> Saved</Badge>}
          <Button onClick={saveOfficer}><Save className="h-4 w-4" /> Save profile</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-blue-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Demo mode</h2>
              <p className="text-xs text-slate-500">Display a reminder that built-in scenarios are simulated.</p>
            </div>
          </div>
          <button onClick={toggleDemo} role="switch" aria-checked={demoMode} aria-label="Toggle demo mode"
            className={cx('relative h-6 w-11 rounded-full transition-colors', demoMode ? 'bg-blue-700' : 'bg-slate-300')}>
            <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', demoMode ? 'translate-x-5' : 'translate-x-0.5')} />
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-blue-700" />
          <h2 className="text-sm font-bold text-slate-900">Language</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          The screening workstation is available in English, Hindi and all 22 Scheduled Languages of India. Untranslated strings fall back to English.
        </p>
        <div className="mt-3 grid max-h-80 grid-cols-1 overflow-y-auto gap-1 rounded-lg border border-slate-200 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {listLanguages().map(({ code, name, native }) => (
            <button key={code} onClick={() => setLang(code)}
              className={cx('flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100',
                lang === code ? 'bg-blue-50 font-bold text-blue-800' : 'text-slate-700')}>
              <span>{native}</span>
              <span className={cx('text-[11px]', lang === code ? 'text-blue-600' : 'text-slate-400')}>{name}</span>
              {lang === code && <Check className="h-4 w-4 text-blue-700" />}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-2 text-sm font-bold text-slate-900">Coming soon</h2>
        <ul className="space-y-1 text-sm text-slate-500">
          <li>• Persistent case database (server-side history with officer-signed audit trail)</li>
          <li>• Watchlist management and RFM (Red Flag Matrix) bulk import</li>
          <li>• Bulk/queue screening batches and shift handover reports</li>
        </ul>
      </Card>
    </div>
  );
}