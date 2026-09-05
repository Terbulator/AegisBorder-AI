import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard,
  ScanSearch,
  FileCheck2,
  BrainCircuit,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Search,
  Menu,
  X,
  Clock3,
  Eye,
  EyeOff,
  ChevronDown,
  Send,
  Users,
  User,
  Activity,
  Server,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Bot,
  LogOut,
  Database,
  ArrowUpRight,
} from 'lucide-react'

/* ───────────────────────────  MOCK DATA  ─────────────────────────── */

const CASES = [
  { id: 'C-10294', name: 'SARAH HELENA SCHMIDT', docType: 'Passport', docNumber: 'C44L28901', nationality: 'DEU', dob: '1991-04-18', expiry: '2031-04-17', sex: 'F', status: 'VERIFIED', risk: 12, faceMatch: 96.4, anomalies: [], checkpoint: 'Alpha', time: '14:32:05', origin: 'Frankfurt', decision: 'APPROVED' },
  { id: 'C-10293', name: 'ALEXANDER CROSS', docType: 'Passport', docNumber: 'P90812455', nationality: 'GBR', dob: '1988-09-12', expiry: '2029-09-11', sex: 'M', status: 'FLAGGED', risk: 88, faceMatch: 42.0, anomalies: ['Spliced portrait sticker detected (ELA 78%)', 'Photo boundary gradient jump 88.5%', 'Face match confidence below threshold'], checkpoint: 'Beta', time: '14:30:41', origin: 'London', decision: 'DETAIN' },
  { id: 'C-10292', name: 'DMITRI VOLKOV', docType: 'Passport', docNumber: 'N77109234', nationality: 'RUS', dob: '1985-03-14', expiry: '2030-03-13', sex: 'M', status: 'REVIEW', risk: 58, faceMatch: 83.1, anomalies: ['VIZ DOB (01.01.1999) vs MRZ DOB (1985-03-14) mismatch', 'Cross-field inconsistency flagged'], checkpoint: 'Alpha', time: '14:29:12', origin: 'Moscow', decision: 'SECONDARY INSPECTION' },
  { id: 'C-10291', name: 'TARIQ MANSUR', docType: 'Visa', docNumber: 'V33918204', nationality: 'EGY', dob: '1994-06-25', expiry: '2027-12-31', sex: 'M', status: 'REVIEW', risk: 66, faceMatch: 74.6, anomalies: ['ICAO 9303 check digit failure on document number', 'Tampered stay duration'], checkpoint: 'Gamma', time: '14:27:55', origin: 'Cairo', decision: 'REFUSE ENTRY' },
  { id: 'C-10290', name: 'VIKTOR KORSHIKOV', docType: 'Passport', docNumber: 'L898902C3', nationality: 'RUS', dob: '1974-08-12', expiry: '2032-04-15', sex: 'M', status: 'FLAGGED', risk: 96, faceMatch: 88.9, anomalies: ['Interpol Red Notice match — transnational document fraud', 'Watchlist match: confirmed fugitive'], checkpoint: 'Alpha', time: '14:26:30', origin: 'Unknown', decision: 'DETAIN' },
  { id: 'C-10289', name: 'LI WEI', docType: 'Passport', docNumber: 'E61233458', nationality: 'CHN', dob: '1994-01-22', expiry: '2028-01-21', sex: 'M', status: 'VERIFIED', risk: 9, faceMatch: 97.2, anomalies: [], checkpoint: 'Beta', time: '14:25:18', origin: 'Shanghai', decision: 'APPROVED' },
  { id: 'C-10288', name: 'AMARA OKAFOR', docType: 'National ID', docNumber: 'NGA77000421', nationality: 'NGA', dob: '1998-11-03', expiry: '2029-11-02', sex: 'F', status: 'VERIFIED', risk: 15, faceMatch: 94.8, anomalies: [], checkpoint: 'Gamma', time: '14:24:02', origin: 'Lagos', decision: 'APPROVED' },
  { id: 'C-10287', name: 'PEDRO ALVAREZ', docType: 'Passport', docNumber: 'M71129903', nationality: 'MEX', dob: '1987-07-19', expiry: '2026-10-14', sex: 'M', status: 'REVIEW', risk: 52, faceMatch: 71.3, anomalies: ['Expiry within 60 days', 'Face liveliness score borderline (61%)'], checkpoint: 'Beta', time: '14:22:47', origin: 'Mexico City', decision: 'SECONDARY INSPECTION' },
  { id: 'C-10286', name: 'JOSEF NAGY', docType: 'Visa', docNumber: 'H99022145', nationality: 'HUN', dob: '1990-02-28', expiry: '2026-06-30', sex: 'M', status: 'FLAGGED', risk: 91, faceMatch: 38.5, anomalies: ['Liveness detection failed — possible screen replay', 'Moiré artifact detected on live capture', 'Wireframe edge traces in live stream'], checkpoint: 'Gamma', time: '14:20:33', origin: 'Budapest', decision: 'BLOCK' },
  { id: 'C-10285', name: 'ISABELLE DUBOIS', docType: 'Passport', docNumber: 'F51087331', nationality: 'FRA', dob: '1993-09-05', expiry: '2033-09-04', sex: 'F', status: 'VERIFIED', risk: 8, faceMatch: 98.0, anomalies: [], checkpoint: 'Alpha', time: '14:18:22', origin: 'Paris', decision: 'APPROVED' },
]

const ALERTS = [
  { id: 'A-221', severity: 'CRITICAL', title: 'Face mismatch between MRZ photo and live capture', checkpoint: 'Alpha', time: '14:20:40', confidence: 94, subject: 'JOSEF NAGY', reasoning: 'Cosine landmark similarity is asymmetric between captured frames and the encoded MRZ portrait. Liveness probes also flagged moiré patterning consistent with a screen replay. The combined presentation-attack score crosses the hard detention threshold.' },
  { id: 'A-222', severity: 'CRITICAL', title: 'Interpol Red Notice match on presented document', checkpoint: 'Alpha', time: '14:26:35', confidence: 99, subject: 'VIKTOR KORSHIKOV', reasoning: 'Document number, surname and DOB triple-match an active Interpol Red Notice for transnational document fraud. Match confidence is at the maximum lookup tier; no further biometric weight is required for escalation.' },
  { id: 'A-223', severity: 'CRITICAL', title: 'Portrait splicing detected via ELA forensics', checkpoint: 'Beta', time: '14:30:48', confidence: 88, subject: 'ALEXANDER CROSS', reasoning: 'Error Level Analysis shows a quantization discontinuity localized to the portrait box. Edge-gradient jump at the photo boundary is 88.5%, well above the 55% tamper threshold, indicating the portrait was replaced after printing.' },
  { id: 'A-224', severity: 'HIGH', title: 'VIZ and MRZ date-of-birth divergence', checkpoint: 'Alpha', time: '14:29:20', confidence: 91, subject: 'DMITRI VOLKOV', reasoning: 'Visual Inspection Zone prints 01.01.1999 while the encoded MRZ resolves to 1985-03-14. The two fields fail cross-validation; inconsistency is consistent with age concealment rather than OCR noise.' },
  { id: 'A-225', severity: 'HIGH', title: 'ICAO 9303 check-digit forgery on visa', checkpoint: 'Gamma', time: '14:28:02', confidence: 100, subject: 'TARIQ MANSUR', reasoning: 'The document number and composite MRZ check digits are mathematically invalid under the 7-3-1 weighting scheme. This is a deterministic failure, not a heuristic estimate.' },
  { id: 'A-226', severity: 'MEDIUM', title: 'Document expiry proximity + borderline liveness', checkpoint: 'Beta', time: '14:23:15', confidence: 67, subject: 'PEDRO ALVAREZ', reasoning: 'Expiry is inside the 60-day warning window and the liveliness score of 61% is marginally above the spoof floor. No single rule trips, but the combined profile warrants supervisory review.' },
  { id: 'A-227', severity: 'MEDIUM', title: 'Repeated doc-number hits across checkpoints', checkpoint: 'Watchlist Rule', time: '14:10:55', confidence: 73, subject: 'Pattern', reasoning: 'The same document number pattern was presented three times in 24 hours across different checkpoints with different holder photos. Cluster rule flagged for manual adjudication.' },
]

const CHECKPOINTS = [
  { id: 'CP-A', name: 'Checkpoint Alpha', status: 'Online', throughput: 142, queue: 3, uptime: 99.98, gate: 'Terminal 1' },
  { id: 'CP-B', name: 'Checkpoint Beta', status: 'Online', throughput: 118, queue: 7, uptime: 99.91, gate: 'Terminal 2' },
  { id: 'CP-C', name: 'Checkpoint Gamma', status: 'Degraded', throughput: 61, queue: 12, uptime: 97.34, gate: 'Terminal 3' },
  { id: 'CP-D', name: 'Checkpoint Delta', status: 'Online', throughput: 95, queue: 5, uptime: 99.87, gate: 'Terminal 4' },
  { id: 'CP-E', name: 'Checkpoint Epsilon', status: 'Offline', throughput: 0, queue: 0, uptime: 94.12, gate: 'Terminal 5 / Maint' },
]

const PERSONNEL = [
  { name: 'T. Osei', role: 'Command Supervisor', clearance: 5, scope: 'All checkpoints', since: 2016, access: 'Full adjudication, override, audit export' },
  { name: 'M. Reyes', role: 'Senior Review Officer', clearance: 4, scope: 'All checkpoints', since: 2019, access: 'Secondary inspection, escalation, unblock' },
  { name: 'A. Kovacs', role: 'Screening Officer', clearance: 3, scope: 'Alpha / Beta', since: 2021, access: 'Approve / escalate, PII reveal scoped' },
  { name: 'S. Iyer', role: 'Risk Intelligence Analyst', clearance: 2, scope: 'Watchlist & Analytics', since: 2022, access: 'Alert triage, read-only case access' },
  { name: 'J. Lindqvist', role: 'Intake Operator', clearance: 1, scope: 'Entry gate only', since: 2024, access: 'Document ingest, no decision rights' },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'screening', label: 'Live Screening', icon: ScanSearch },
  { id: 'document_verification', label: 'Document Verification', icon: FileCheck2 },
  { id: 'ai_alerts', label: 'AI Analysis & Alerts', icon: BrainCircuit },
  { id: 'management', label: 'Management', icon: Settings },
]

const KPIS = [
  { label: 'Screened Today', value: '4,912', delta: '+8.2% vs yesterday', tone: 'emerald', icon: Activity },
  { label: 'High Risk', value: '37', delta: '3 awaiting adjudication', tone: 'rose', icon: ShieldAlert },
  { label: 'Pending Review', value: '14', delta: 'Avg review time 2.4m', tone: 'amber', icon: Clock3 },
  { label: 'Avg Screen Time', value: '0.8s', delta: 'Target < 1.2s', tone: 'cyan', icon: Fingerprint },
]

/* ───────────────────────────  HELPERS  ─────────────────────────── */

const maskDoc = (d) => (d.length > 4 ? '•••• ' + d.slice(-4) : '••••')
const maskName = (n) => {
  const parts = n.split(' ')
  return parts.length > 1 ? parts[0][0] + '. ' + parts[parts.length - 1] : n[0] + '.'
}
const hide = (value, type, reveal) => {
  if (reveal) return value
  if (type === 'doc') return maskDoc(value)
  if (type === 'name') return maskName(value)
  if (type === 'dob') return '••••-••-••'
  return value
}

const STATUS_TONE = {
  VERIFIED: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2, label: 'Verified' },
  REVIEW: { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: AlertTriangle, label: 'Pending Review' },
  FLAGGED: { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', icon: XCircle, label: 'Flagged' },
}

const riskTone = (r) => (r >= 80 ? 'text-rose-400' : r >= 50 ? 'text-amber-400' : 'text-emerald-400')
const barTone = (r) => (r >= 80 ? 'bg-rose-500' : r >= 50 ? 'bg-amber-500' : 'bg-emerald-500')
const faceTone = (f) => (f >= 85 ? 'text-emerald-400' : f >= 60 ? 'text-amber-400' : 'text-rose-400')
const faceBar = (f) => (f >= 85 ? 'bg-emerald-500' : f >= 60 ? 'bg-amber-500' : 'bg-rose-500')

function Stat({ label, value, delta, tone, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-100 tabular-nums">{value}</div>
      <div className={`mt-1 text-[11px] ${tone === 'rose' ? 'text-rose-400' : tone === 'amber' ? 'text-amber-400' : tone === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'}`}>{delta}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const t = STATUS_TONE[status]
  const Icon = t.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${t.bg} ${t.text}`}>
      <Icon className="h-3 w-3" /> {t.label}
    </span>
  )
}

/* ───────────────────────────  VIEWS  ─────────────────────────── */

function DashboardView({ cases, reveal, onJump, onApprove, onBlock, onEscalate }) {
  const flagged = cases.filter((c) => c.status !== 'VERIFIED')
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {KPIS.map((k) => <Stat key={k.label} {...k} />)}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Live Screening Feed</h2>
            <p className="text-[11px] text-slate-500">{flagged.length} cases needing attention right now</p>
          </div>
          <button onClick={() => onJump('screening')} className="inline-flex items-center gap-1 rounded border border-slate-700 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
            Open Terminal <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="px-4 py-2.5 font-medium">Case ID</th>
                <th className="px-4 py-2.5 font-medium">Person</th>
                <th className="px-4 py-2.5 font-medium">Doc Type</th>
                <th className="px-4 py-2.5 font-medium">Checkpoint</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Risk Score</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{c.id}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => onJump('screening')} className="font-medium text-slate-200 hover:text-cyan-300 hover:underline" title="Open in Live Screening">
                      {hide(c.name, 'name', reveal)}
                    </button>
                    <div className="text-[10px] text-slate-500">{c.nationality} · {hide(c.docNumber, 'doc', reveal)}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">{c.docType}</td>
                  <td className="px-4 py-2.5 text-slate-400">{c.checkpoint}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold ${riskTone(c.risk)}`}>{c.risk}</span>
                      <span className={`h-1.5 w-12 rounded-full ${barTone(c.risk)}`} style={{ width: `${Math.max(4, c.risk)}%`, maxWidth: 48 }} />
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => onApprove(c.id)} disabled={c.status === 'VERIFIED'} className="rounded border border-emerald-500/40 px-2 py-1 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40">Approve</button>
                      <button onClick={() => onEscalate(c.id)} disabled={c.status !== 'VERIFIED'} className="rounded border border-amber-500/40 px-2 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/10 disabled:opacity-40">Review</button>
                      <button onClick={() => onBlock(c.id)} disabled={c.status === 'FLAGGED'} className="rounded border border-rose-500/40 px-2 py-1 text-[10px] font-medium text-rose-400 hover:bg-rose-500/10 disabled:opacity-40">Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ScreeningView({ cases, reveal, selectedId, setSelectedId, onApprove, onBlock, onEscalate }) {
  const selected = cases.find((c) => c.id === selectedId) || cases[0]
  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">Incoming Scans</h2>
          <p className="text-[11px] text-slate-500">{cases.length} queued · newest first</p>
        </div>
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto divide-y divide-slate-800/60">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left ${selected?.id === c.id ? 'bg-slate-800/60 border-l-2 border-cyan-400' : 'border-l-2 border-transparent hover:bg-slate-800/30'}`}
            >
              <StatusBadge status={c.status} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-slate-200">{hide(c.name, 'name', reveal)}</div>
                <div className="mt-0.5 font-mono text-[10px] text-slate-500">{c.id} · {c.checkpoint} · {c.time}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`font-mono text-[11px] font-semibold ${riskTone(c.risk)}`}>{c.risk}%</span>
                  <span className={`h-1 flex-1 rounded-full ${barTone(c.risk)}`} style={{ width: `${c.risk}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-100">{hide(selected.name, 'name', reveal)}</h2>
              <StatusBadge status={selected.status} />
            </div>
            <p className="font-mono text-[11px] text-slate-500">{selected.id} · {selected.checkpoint} · scanned {selected.time}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onApprove(selected.id)} className="rounded border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10">Approve</button>
            <button onClick={() => onEscalate(selected.id)} className="rounded border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10">Escalate</button>
            <button onClick={() => onBlock(selected.id)} className="rounded border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10">Block</button>
          </div>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-800">
            <div className="border-b border-slate-800 px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">OCR / MRZ Extraction</span>
            </div>
            <dl className="space-y-1.5 p-3 text-xs">
              {[['Full Name', hide(selected.name, 'name', reveal)], ['Doc Number', hide(selected.docNumber, 'doc', reveal)], ['Date of Birth', hide(selected.dob, 'dob', reveal)], ['Expiry', hide(selected.expiry, 'dob', reveal)], ['Nationality', selected.nationality], ['Doc Type', selected.docType], ['Sex', selected.sex], ['Origin', selected.origin]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-mono text-right text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-md border border-slate-800">
            <div className="border-b border-slate-800 px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Biometric Face Match</span>
            </div>
            <div className="p-3">
              <div className="flex items-end justify-between">
                <span className={`font-mono text-2xl font-bold ${faceTone(selected.faceMatch)}`}>{selected.faceMatch}%</span>
                <span className="text-[11px] text-slate-500">MRZ portrait vs live capture</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full ${faceBar(selected.faceMatch)}`} style={{ width: `${selected.faceMatch}%` }} />
              </div>
              <p className={`mt-2 text-[11px] ${selected.faceMatch >= 85 ? 'text-emerald-400' : selected.faceMatch >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {selected.faceMatch >= 85 ? '1:1 match above acceptance threshold' : selected.faceMatch >= 60 ? 'Match below threshold — requires manual adjudication' : 'Severe mismatch — presentation attack suspected'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-md border border-slate-800">
            <div className="border-b border-slate-800 px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">AI Risk Anomalies</span>
            </div>
            <ul className="divide-y divide-slate-800/60">
              {selected.anomalies.length === 0 && <li className="px-3 py-2.5 text-xs text-emerald-400">No anomalies detected. All checks passed.</li>}
              {selected.anomalies.map((a, i) => (
                <li key={i} className="flex items-start gap-2 px-3 py-2.5 text-xs text-slate-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentVerificationView({ reveal }) {
  const checks = [
    { label: 'OCR Field Extraction', ok: true, note: 'All VIZ fields extracted', meta: 'Signed: 87%' },
    { label: 'ICAO 9303 Check Digits', ok: true, note: 'TD3 passport — all checksums valid', meta: '7-3-1 weighting' },
    { label: 'VIZ ⇄ MRZ Cross-Validation', ok: true, note: 'Fields consistent across zones', meta: 'Match 100%' },
    { label: 'Tampering / ELA Forensics', ok: false, note: 'Compression discontinuity in portrait area', meta: 'Signal 78%' },
    { label: 'Photo Boundary Integrity', ok: false, note: 'Gradient jump above tamper threshold', meta: 'Jump 88.5%' },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">Document Workspace</h2>
          <p className="text-[11px] text-slate-500">C-10293 · ALEXANDER CROSS · Passport GBR</p>
        </div>
        <div className="p-6">
          <div className="mx-auto max-w-xl overflow-hidden rounded-md border border-slate-700 bg-slate-800/40">
            <div className="flex items-center justify-between bg-[#152238] px-4 py-2">
              <span className="text-[10px] font-bold tracking-widest text-slate-300">FEDERAL REPUBLIC OF GREAT BRITAIN</span>
              <span className="flex items-center gap-1 text-[9px] text-slate-400"><Fingerprint className="h-3 w-3" /> BIOMETRIC PASSPORT</span>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-4 p-4">
              <div className="flex h-36 items-center justify-center rounded border border-slate-600 bg-slate-700/40">
                <User className="h-16 w-16 text-slate-500" />
              </div>
              <dl className="space-y-1 text-[11px]">
                <div><dt className="text-slate-500">Surname</dt><dd className="font-mono text-slate-200">{reveal ? 'CROSS' : '••••••'}</dd></div>
                <div><dt className="text-slate-500">Given names</dt><dd className="font-mono text-slate-200">{reveal ? 'ALEXANDER JOHN' : '•••••••••'}</dd></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><dt className="text-slate-500">Doc No.</dt><dd className="font-mono text-slate-200">{reveal ? 'P90812455' : '•••• 2455'}</dd></div>
                  <div><dt className="text-slate-500">Nationality</dt><dd className="font-mono text-slate-200">GBR</dd></div>
                  <div><dt className="text-slate-500">DOB</dt><dd className="font-mono text-slate-200">{reveal ? '12.09.1988' : '••. ••.1988'}</dd></div>
                  <div><dt className="text-slate-500">Expiry</dt><dd className="font-mono text-slate-200">{reveal ? '11.09.2029' : '••. ••.2029'}</dd></div>
                </div>
              </dl>
            </div>
            <div className="space-y-1 bg-slate-950/70 px-4 py-3 font-mono text-[10px] leading-tight text-cyan-300/80">
              <div>P&lt;GBRCROSS&lt;&lt;ALEXANDER&lt;&lt;JOHN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div>P908124552GBR8809121M2909117&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8</div>
            </div>
            <div className="flex items-center justify-between bg-slate-950/70 px-4 py-1.5">
              <span className="text-[9px] text-slate-500">MRZ verification: {''}
                <span className="text-emerald-400">checksums OK</span>
              </span>
              <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-rose-400">ELA FLAG</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-600">Synthetic reference document rendered for inspection. Detection analytic overlay active.</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">Verification Checklist</h2>
          <p className="text-[11px] text-slate-500">4 of 5 checks passed · overall VERDICT: HIGH RISK</p>
        </div>
        <ul className="divide-y divide-slate-800/60">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3 px-4 py-3">
              {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />}
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-200">{c.label}</div>
                <div className="text-[11px] text-slate-500">{c.note}</div>
              </div>
              <span className="font-mono text-[10px] text-slate-500">{c.meta}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500">Composite Risk</span>
            <span className="font-mono text-lg font-bold text-rose-400">88</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[88%] rounded-full bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertsView({ onJumpScreening }) {
  const [active, setActive] = useState(ALERTS[0])
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 }
  const seg = [...ALERTS].sort((a, b) => order[a.severity] - order[b.severity])
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      <div className="space-y-2">
        {['CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => {
          const items = seg.filter((a) => a.severity === sev)
          const tone = sev === 'CRITICAL' ? 'border-rose-500/40 text-rose-400' : sev === 'HIGH' ? 'border-amber-500/40 text-amber-400' : 'border-sky-500/40 text-sky-400'
          const head = sev === 'CRITICAL' ? 'text-rose-400' : sev === 'HIGH' ? 'text-amber-400' : 'text-sky-400'
          return (
            <div key={sev}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${head}`}>{sev}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActive(a)}
                    className={`w-full rounded-lg border bg-slate-900/60 px-4 py-3 text-left transition-colors ${active.id === a.id ? 'border-cyan-400/60' : tone}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-100">{a.title}</span>
                      <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{a.id}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{a.subject}</span>·<span>{a.checkpoint}</span>·<span className="font-mono">{a.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-fit rounded-lg border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-100">Explainable AI Output</h2>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500">{active.id} · {active.severity} · {active.confidence}% confidence</p>
        </div>
        <div className="space-y-3 p-4">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Flagged subject</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-100">{active.subject}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${active.severity === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400' : active.severity === 'HIGH' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'}`}>{active.severity}</span>
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">AI reasoning chain</div>
            <p className="text-[13px] leading-relaxed text-slate-300">{active.reasoning}</p>
          </div>
          <div className="rounded-md border border-slate-800 p-3">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Confidence</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-slate-800">
                <div className={`h-2 rounded-full ${active.confidence >= 80 ? 'bg-rose-500' : active.confidence >= 70 ? 'bg-amber-500' : 'bg-sky-500'}`} style={{ width: `${active.confidence}%` }} />
              </div>
              <span className="font-mono text-xs text-slate-200">{active.confidence}%</span>
            </div>
          </div>
          <button onClick={() => onJumpScreening()} className="w-full rounded border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">
            Open case in Live Screening
          </button>
        </div>
      </div>
    </div>
  )
}

function ManagementView({ reveal }) {
  const [tab, setTab] = useState('cases')
  const tabs = [
    { id: 'cases', label: 'Cases', icon: Database },
    { id: 'checkpoints', label: 'Checkpoints', icon: Server },
    { id: 'personnel', label: 'Personnel', icon: Users },
  ]
  const cpTone = (s) => (s === 'Online' ? 'text-emerald-400' : s === 'Degraded' ? 'text-amber-400' : 'text-rose-400')
  const cpBg = (s) => (s === 'Online' ? 'bg-emerald-500/10 border-emerald-500/30' : s === 'Degraded' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-rose-500/10 border-rose-500/30')
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-1.5">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium ${tab === tb.id ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <tb.icon className="h-3.5 w-3.5" /> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'cases' && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-100">Case Ledger</h2>
            <p className="text-[11px] text-slate-500">All screening transactions, most recent first</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500">
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-2.5 font-medium">Case ID</th>
                  <th className="px-4 py-2.5 font-medium">Person</th>
                  <th className="px-4 py-2.5 font-medium">Checkpoint</th>
                  <th className="px-4 py-2.5 font-medium">Time</th>
                  <th className="px-4 py-2.5 font-medium">Risk</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CASES.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-mono text-slate-400">{c.id}</td>
                    <td className="px-4 py-2.5">{hide(c.name, 'name', reveal)}</td>
                    <td className="px-4 py-2.5 text-slate-400">{c.checkpoint}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{c.time}</td>
                    <td className={`px-4 py-2.5 font-mono ${riskTone(c.risk)}`}>{c.risk}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{c.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'checkpoints' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CHECKPOINTS.map((cp) => (
            <div key={cp.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-semibold text-slate-100">{cp.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{cp.id} · {cp.gate}</div>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-medium ${cpBg(cp.status)} ${cpTone(cp.status)}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cp.status === 'Online' ? 'bg-emerald-400 animate-pulse' : cp.status === 'Degraded' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`} />
                  {cp.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded border border-slate-800 p-2"><div className="font-mono text-sm font-bold text-slate-100">{cp.uptime}%</div><div className="text-[9px] uppercase tracking-wider text-slate-500">Uptime</div></div>
                <div className="rounded border border-slate-800 p-2"><div className="font-mono text-sm font-bold text-slate-100">{cp.throughput}/m</div><div className="text-[9px] uppercase tracking-wider text-slate-500">Throughput</div></div>
                <div className="rounded border border-slate-800 p-2"><div className="font-mono text-sm font-bold text-slate-100">{cp.queue}</div><div className="text-[9px] uppercase tracking-wider text-slate-500">Queue</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'personnel' && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-100">Personnel & Access Control</h2>
            <p className="text-[11px] text-slate-500">Role-based access matrix · clearance 1–5</p>
          </div>
          <ul className="divide-y divide-slate-800/60">
            {PERSONNEL.map((p) => (
              <li key={p.name} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-mono text-[11px] font-semibold text-cyan-300">{p.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-slate-100">{p.name} <span className="font-normal text-slate-500">· {p.role}</span></div>
                  <div className="text-[10px] text-slate-500">Scope: {p.scope} · {p.access}</div>
                </div>
                <span className="rounded border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-slate-400">since {p.since}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`h-1.5 w-3 rounded-sm ${n <= p.clearance ? 'bg-cyan-500' : 'bg-slate-800'}`} />
                  ))}
                  <span className="ml-1.5 font-mono text-[10px] text-cyan-300">L{p.clearance}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────  AI ASSISTANT OVERLAY  ─────────────────────── */

function AssistantOverlay({ cases }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const timer = useRef(null)
  const flagged = cases.filter((c) => c.status !== 'VERIFIED').length
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Security Ops AI online. Ask me about screening status, risk cases, or checkpoint health.' },
    { from: 'user', text: 'Show high risk cases' },
    { from: 'ai', text: 'There are currently 3 flagged cases pending adjudication at Checkpoint Alpha and Checkpoint Beta. Highest risk: C-10290 Viktor Korshikov (96%).' },
  ])

  useEffect(() => () => clearTimeout(timer.current), [])

  const answer = (q) => {
    const t = q.toLowerCase()
    if (t.includes('high risk') || t.includes('flagged') || t.includes('alert'))
      return `There are currently ${flagged} high-risk cases pending review across the network. Critical: ${cases.filter((c) => c.risk >= 80).length} immediately actionable at Checkpoint Alpha.`
    if (t.includes('checkpoint'))
      return `3 of 5 checkpoints are online. Checkpoint Gamma is degraded (61/min throughput), Checkpoint Epsilon offline for maintenance. Alpha has the deepest queue at ${cases.filter((c) => c.checkpoint === 'Alpha').length} live cases.`
    if (t.includes('block') || t.includes('detain'))
      return 'Blocking requires level-4 clearance. I can prepare the detention packet, but the decision is held for the shift supervisor. Escalate from the Live Screening terminal.'
    if (t.includes('doc') || t.includes('verify'))
      return 'Document verification runs ICAO 9303 check-digits, ELA tamper forensics, and VIZ ⇄ MRZ cross-validation per passport or visa. All routines are available in the Document Verification workspace.'
    return `I can report on live risk cases, checkpoint node health, alert details, and document forensics. Try "show high risk cases" or "checkpoint status".`
  }

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { from: 'ai', text: answer(text) }])
      setTyping(false)
    }, 700)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[340px] flex-col items-end">
      {open && (
        <div className="mb-2 flex h-[420px] w-full flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2.5">
            <Bot className="h-4 w-4 text-cyan-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-100">Security Ops AI</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Model online · demo</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-200"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-md px-3 py-2 text-xs ${m.from === 'ai' ? 'border border-slate-800 bg-slate-800/50 text-slate-300' : 'self-start ml-auto border border-cyan-500/30 bg-cyan-500/10 text-cyan-100'}`}>
                {m.text}
              </div>
            ))}
            {typing && <div className="w-fit rounded-md border border-slate-800 bg-slate-800/50 px-3 py-2 text-[11px] text-slate-500">Security Ops AI is analyzing…</div>}
          </div>
          <div className="flex gap-2 border-t border-slate-800 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask the ops AI…"
              className="flex-1 rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/60 focus:outline-none"
            />
            <button onClick={send} className="rounded border border-cyan-500/40 px-2.5 text-cyan-300 hover:bg-cyan-500/10"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-200 shadow-lg shadow-black/50 hover:border-cyan-500/50 hover:text-cyan-300"
      >
        <Bot className="h-4 w-4 text-cyan-400" /> Security Ops AI {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}

/* ───────────────────────  APP SHELL  ─────────────────────── */

export default function CommandCenter() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [search, setSearch] = useState('')
  const [cases, setCases] = useState(CASES)
  const [selectedId, setSelectedId] = useState(CASES[0].id)
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const setStatus = (id, status) =>
    setCases((list) => list.map((c) => {
      if (c.id !== id) return c
      if (status === 'VERIFIED') return { ...c, status, risk: Math.max(5, Math.round(c.risk * 0.25)), decision: 'APPROVED', anomalies: [] }
      if (status === 'REVIEW') return { ...c, status, decision: 'SECONDARY INSPECTION' }
      return { ...c, status: 'FLAGGED', decision: 'DETAIN & CONFISCATE' }
    }))

  const query = search.trim().toLowerCase()
  const filtered = query
    ? cases.filter((c) => (c.id + ' ' + c.name + ' ' + c.nationality + ' ' + c.docType + ' ' + c.checkpoint).toLowerCase().includes(query))
    : cases

  const renderView = () => {
    switch (activeView) {
      case 'screening': return <ScreeningView cases={filtered} reveal={reveal} selectedId={selectedId} setSelectedId={setSelectedId} onApprove={(id) => setStatus(id, 'VERIFIED')} onBlock={(id) => setStatus(id, 'FLAGGED')} onEscalate={(id) => setStatus(id, 'REVIEW')} />
      case 'document_verification': return <DocumentVerificationView reveal={reveal} />
      case 'ai_alerts': return <AlertsView onJumpScreening={() => setActiveView('screening')} />
      case 'management': return <ManagementView reveal={reveal} />
      default: return <DashboardView cases={filtered} reveal={reveal} onJump={setActiveView} onApprove={(id) => setStatus(id, 'VERIFIED')} onBlock={(id) => setStatus(id, 'FLAGGED')} onEscalate={(id) => setStatus(id, 'REVIEW')} />
    }
  }

  const side = 'w-60 shrink-0 border-r border-slate-800 bg-slate-950 flex-col'
  const mobileSide = `${side} ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} md:static md:flex`

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:hidden" />}

      <aside className={mobileSide}>
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500/15 text-cyan-400"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <div className="text-sm font-bold tracking-wide text-slate-100">RAKSHAK AI</div>
            <div className="text-[9px] uppercase tracking-widest text-slate-500">AegisBorder Command</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-500 hover:text-slate-200 md:hidden"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false) }}
              className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs font-medium ${activeView === item.id ? 'bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-400 border-l-2 border-transparent hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <div className="rounded border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300"><User className="h-3.5 w-3.5 text-cyan-400" /> T. Osei</div>
            <div className="mt-0.5 text-[10px] text-slate-500">Command Supervisor · L5</div>
            <button className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-rose-400"><LogOut className="h-3 w-3" /> Sign out</button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-200 md:hidden"><Menu className="h-5 w-5" /></button>

            <div className="relative hidden w-72 sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case, name, nationality…"
                className="w-full rounded border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:ml-4 sm:gap-3">
              <span className="hidden items-center gap-1.5 rounded border border-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-400 sm:inline-flex">
                <span className="text-slate-500">Checkpoint</span>
                <span className="flex items-center gap-1 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded border border-rose-500/50 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> DEMO DATA MODE
              </span>
              <button onClick={() => setReveal((r) => !r)} title={reveal ? 'Hide PII' : 'Reveal PII'} className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] font-medium ${reveal ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-slate-800 text-slate-400 hover:text-slate-200'}`}>
                {reveal ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />} PII
              </button>
              <button className="relative rounded border border-slate-800 p-1.5 text-slate-400 hover:text-slate-200">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
              </button>
              <div className="hidden items-center gap-2 border-l border-slate-800 pl-3 md:flex">
                <span className="font-mono text-xs text-slate-300">{clock.toLocaleTimeString('en-GB', { hour12: false })}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="mb-4">
            <h1 className="text-base font-bold uppercase tracking-wide text-slate-100">{NAV_ITEMS.find((n) => n.id === activeView)?.label}</h1>
            <p className="text-[11px] text-slate-500">Border Identity & Document Screening · Command Center</p>
          </div>
          {renderView()}
        </main>
        <footer className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-600">
          Rakshak AI / AegisBorder Command Center · Monolithic SPA · state-switched views · all data synthetic
        </footer>
      </div>

      <AssistantOverlay cases={cases} />
    </div>
  )
}