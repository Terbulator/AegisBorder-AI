import React from 'react';
import {
  Shield,
  ShieldCheck,
  Activity,
  MessageSquare,
  Globe,
  QrCode,
  AppWindow,
  ChevronRight,
  Smartphone,
  Plus,
  FileText,
  Phone,
  Eye,
} from 'lucide-react';
import { speakText } from './VoiceAssistant';

/* ----- Greeting based on local time ----- */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { en: 'Good morning', hi: 'सुप्रभात' };
  if (h < 17) return { en: 'Good afternoon', hi: 'नमस्कार' };
  return { en: 'Good evening', hi: 'शुभ संध्या' };
}

/* ----- Demo security metrics (clearly demo values) ----- */
const METRICS = [
  { key: 'messages',  label: 'Messages scanned',  value: '1,248', sub: 'this device' },
  { key: 'threats',   label: 'Threats detected',  value: '238',   sub: 'blocked automatically' },
  { key: 'links',     label: 'Links checked',     value: '982',   sub: 'this device' },
  { key: 'reported',  label: 'Scams reported',    value: '174',   sub: 'helped protect others' },
];

/* ----- Protection modules ----- */
const PROTECTION_MODULES = [
  { label: 'Message protection', icon: MessageSquare, status: 'ACTIVE' },
  { label: 'Link protection',    icon: Globe,         status: 'ACTIVE' },
  { label: 'UPI protection',     icon: QrCode,        status: 'ACTIVE' },
  { label: 'App protection',     icon: AppWindow,     status: 'ACTIVE' },
];

/* ----- Quick actions ----- */
const QUICK_ACTIONS = [
  { id: 'message',  title: 'Scan a message',  sub: 'Check SMS or WhatsApp', icon: MessageSquare },
  { id: 'url',      title: 'Check a website', sub: 'Verify a suspicious URL', icon: Globe },
  { id: 'qr',       title: 'Check QR / UPI',  sub: 'Check before you pay', icon: QrCode },
  { id: 'apk',      title: 'Check an app',    sub: 'Review app permissions', icon: AppWindow },
];

/* ----- Common scams ----- */
const COMMON_SCAMS = [
  { id: 'electricity', title: 'Electricity Bill Scam',      cat: 'URGENCY',      desc: 'Fake disconnection threats sent via WhatsApp from personal numbers.', risk: 'CRITICAL' },
  { id: 'kyc',         title: 'Fake Bank KYC',              cat: 'IMPERSONATION', desc: 'Bogus SMS that your YONO / NetBanking will be blocked unless you click a link.', risk: 'CRITICAL' },
  { id: 'cashback',    title: 'UPI Cashback Scam',          cat: 'DECEPTION',    desc: 'QR codes or "collect" requests that ask for UPI PIN to claim a fake reward.', risk: 'HIGH' },
  { id: 'parcel',      title: 'Parcel Delivery Scam',       cat: 'PHISHING',     desc: 'Fake courier SMS asking you to pay a small "customs fee" via a link.', risk: 'HIGH' },
  { id: 'job',         title: 'Fake Job Offer',             cat: 'LURE',         desc: 'WhatsApp recruiters asking for an "interview fee" or APK install.', risk: 'MEDIUM' },
];

const DEVICE_ROWS = [
  { name: 'Your phone',     status: 'protected' },
  { name: 'Parent’s phone', status: 'protected' },
  { name: 'Child’s phone',  status: 'protected' },
];

/* ----- Activity log ----- */
const ACTIVITY = [
  { time: '10:30 AM', icon: MessageSquare, label: 'Suspicious message detected',          risk: 'HIGH' },
  { time: '09:45 AM', icon: Globe,         label: 'Website checked',                       risk: 'SAFE' },
  { time: '09:20 AM', icon: QrCode,        label: 'UPI ID verified',                       risk: 'SAFE' },
  { time: 'Yesterday', icon: AppWindow,    label: 'App scanned — 2 risks found',           risk: 'CAUTION' },
  { time: '2 days ago', icon: FileText,    label: 'Scam reported — thank you',             risk: 'REPORT' },
];

const riskBadge = (risk) => {
  if (risk === 'CRITICAL' || risk === 'HIGH')  return 'badge-danger';
  if (risk === 'CAUTION' || risk === 'MEDIUM') return 'badge-warning';
  if (risk === 'SAFE') return 'badge-success';
  if (risk === 'REPORT') return 'badge-info';
  return 'badge-neutral';
};

export default function HomeDashboard({ onTabChange, onOpenScamExample, currentLang }) {
  const greet = currentLang === 'hi' ? getGreeting().hi : getGreeting().en;

  return (
    <div className="space-y-5">
      {/* ---- Greeting + protection overview panel ---- */}
      <section className="panel-elevated p-5 sm:p-6">
        <div className="flex items-center gap-1.5 mb-1">
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
            {greet} <span aria-hidden>👋</span>
          </h1>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] mb-5">
          Rakshak AI is actively protecting you from digital scams and fraud.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left — shield + status */}
          <div className="lg:col-span-4 flex items-start gap-3 p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div className="w-12 h-12 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center shrink-0 border border-[var(--primary-border)]">
              <Shield className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="status-dot status-dot-success" />
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--success-text)]">Protected</p>
              </div>
              <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mt-1 leading-tight">You’re protected</h2>
              <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5 leading-snug">
                Rakshak AI is actively checking suspicious messages, links, and payments.
              </p>
            </div>
          </div>

          {/* Center — protection modules */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            {PROTECTION_MODULES.map(({ label, icon: Icon, status }) => (
              <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <Icon className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)] leading-tight">{label}</p>
                  <p className="text-[10.5px] text-[var(--success-text)] font-semibold leading-tight">{status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — last checked + view activity */}
          <div className="lg:col-span-3 flex flex-col justify-between p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Last checked</p>
              <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">Just now</p>
            </div>
            <button
              onClick={() => onTabChange && onTabChange('message')}
              className="btn btn-secondary btn-sm w-full mt-3"
            >
              <Activity className="w-3.5 h-3.5" />
              View activity
            </button>
          </div>
        </div>
      </section>

      {/* ---- Metrics row ---- */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map(m => (
          <div key={m.key} className="panel p-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{m.label}</p>
            <p className="text-[20px] font-semibold text-[var(--text-primary)] mt-1 tabular-nums leading-tight">{m.value}</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{m.sub}</p>
          </div>
        ))}
      </section>

      <p className="text-[11px] text-[var(--text-muted)] -mt-2 px-1">
        Demo values for this device — clear when you reset the app.
      </p>

      {/* ---- Quick actions ---- */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">What do you want to check?</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ id, title, sub, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="panel p-4 text-left hover:border-[var(--border-medium)] transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-[var(--primary-subtle)] flex items-center justify-center mb-2.5">
                <Icon className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <p className="text-[13.5px] font-semibold text-[var(--text-primary)] leading-tight">{title}</p>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-snug">{sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Common scams ---- */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">Common scams people are seeing</h2>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Recognise these patterns and you’ll spot most scams instantly.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_SCAMS.map(s => (
            <article key={s.id} className="panel p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="badge badge-neutral">{s.cat}</span>
                <span className={`badge ${riskBadge(s.risk)}`}>{s.risk}</span>
              </div>
              <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)] leading-tight">{s.title}</h3>
              <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-snug flex-1">{s.desc}</p>
              <button
                onClick={() => onOpenScamExample && onOpenScamExample(s)}
                className="text-[12px] font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 mt-2 self-start"
              >
                See example <ChevronRight className="w-3 h-3" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Two-column: activity + family protection ---- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4 sm:p-5">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">Recent activity</h2>
          <p className="text-[11.5px] text-[var(--text-muted)] mb-3">Latest events on this device.</p>
          <div>
            {ACTIVITY.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="activity-row">
                  <div className="w-7 h-7 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[var(--text-primary)] leading-tight truncate">{a.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{a.time}</p>
                  </div>
                  <span className={`badge ${riskBadge(a.risk)}`}>{a.risk}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">Family protection</h2>
            <span className="text-[11.5px] text-[var(--text-muted)]">{DEVICE_ROWS.length} devices</span>
          </div>
          <p className="text-[11.5px] text-[var(--text-muted)] mb-3">All linked devices are protected.</p>
          <div className="space-y-2">
            {DEVICE_ROWS.map(d => (
              <div key={d.name} className="device-row">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                    <Smartphone className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{d.name}</p>
                </div>
                <span className="badge badge-success">
                  <ShieldCheck className="w-3 h-3" />
                  Protected
                </span>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm w-full">
              <Plus className="w-3.5 h-3.5" /> Add device
            </button>
          </div>
        </div>
      </section>

      {/* ---- Privacy + Help ---- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="panel p-4 sm:p-5">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1.5">Your privacy matters</h2>
          <ul className="space-y-1.5 text-[12.5px] text-[var(--text-secondary)]">
            <li>✓ On-device processing where supported</li>
            <li>✓ Messages aren’t unnecessarily stored</li>
            <li>✓ Personal conversations aren’t sold</li>
            <li>✓ Security analysis minimises data exposure</li>
          </ul>
        </div>

        <div className="panel p-4 sm:p-5 flex flex-col">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1.5">Found a scam?</h2>
          <p className="text-[12.5px] text-[var(--text-secondary)] leading-snug flex-1">
            Report suspicious activity and help protect others in your community.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button className="btn btn-primary btn-sm">
              <FileText className="w-3.5 h-3.5" /> Report scam
            </button>
            <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-muted)]">
              <Phone className="w-3.5 h-3.5" />
              Cyber helpline <strong className="text-[var(--text-primary)]">1930</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
