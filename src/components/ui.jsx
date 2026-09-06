import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, Info, AlertTriangle, XCircle, X, Loader2 } from 'lucide-react';

export function cx(...parts) {
  return twMerge(clsx(parts));
}

const PALETTE = {
  green:  { bg: 'bg-emerald-50',  text: 'text-emerald-800',  border: 'border-emerald-200',  dot: 'bg-emerald-500' },
  amber:  { bg: 'bg-amber-50',    text: 'text-amber-900',    border: 'border-amber-200',    dot: 'bg-amber-500' },
  orange: { bg: 'bg-orange-50',   text: 'text-orange-900',   border: 'border-orange-200',   dot: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',      text: 'text-red-900',      border: 'border-red-200',      dot: 'bg-red-500' },
  rose:   { bg: 'bg-rose-50',     text: 'text-rose-900',     border: 'border-rose-200',     dot: 'bg-rose-600' },
  blue:   { bg: 'bg-blue-50',     text: 'text-blue-900',     border: 'border-blue-200',     dot: 'bg-blue-600' },
  lime:   { bg: 'bg-lime-50',     text: 'text-lime-800',     border: 'border-lime-200',     dot: 'bg-lime-500' },
  yellow: { bg: 'bg-yellow-50',   text: 'text-yellow-800',   border: 'border-yellow-200',   dot: 'bg-yellow-500' },
  slate:  { bg: 'bg-slate-50',    text: 'text-slate-700',    border: 'border-slate-200',    dot: 'bg-slate-400' },
};

export const SEVERITY_STEPS = [
  { step: 1, name: 'No risk', color: 'green' },
  { step: 2, name: 'Minimal', color: 'lime' },
  { step: 3, name: 'Low', color: 'yellow' },
  { step: 4, name: 'Moderate', color: 'amber' },
  { step: 5, name: 'High', color: 'orange' },
  { step: 6, name: 'Severe', color: 'red' },
  { step: 7, name: 'Critical', color: 'rose' },
];

export function tierSeverityColor(tier) {
  const map = { LOW: 'green', MODERATE: 'amber', HIGH: 'orange', CRITICAL: 'rose' };
  return map[tier] || 'slate';
}

export function Badge({ color = 'slate', children, className, icon }) {
  const c = PALETTE[color] || PALETTE.slate;
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', c.bg, c.text, c.border, className)}>
      {icon}
      {children}
    </span>
  );
}

export function StatusDot({ color = 'slate', className }) {
  const c = PALETTE[color] || PALETTE.slate;
  return <span className={cx('inline-block h-2 w-2 rounded-full', c.dot, className)} aria-hidden="true" />;
}

export function Card({ className, children }) {
  return (
    <div className={cx('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm',
  secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50',
  danger: 'bg-red-700 text-white hover:bg-red-800 shadow-sm',
  ghost: 'text-slate-700 hover:bg-slate-100',
  success: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm',
};

export function Button({ variant = 'primary', className, loading, disabled, children, ...rest }) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1',
        BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({ label, children, className, ...rest }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx('inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40', className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, wide, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-slate-900/50" aria-label="Close dialog" onClick={onClose} />
      <div className={cx('relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl', wide ? 'max-w-4xl' : 'max-w-lg')}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3 bg-slate-50">{footer}</div>}
      </div>
    </div>
  );
}

export function verifyIcon(kind) {
  if (kind === 'pass') return <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />;
  if (kind === 'warn') return <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />;
  if (kind === 'fail') return <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />;
  return <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />;
}

export function ProgressSteps({ steps, current }) {
  return (
    <ol className="flex w-full items-center" aria-label="Workflow progress">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className={cx('flex flex-1 items-center', i > 0 && '')}>
            {i > 0 && <span className={cx('mx-2 h-0.5 flex-1 rounded', done || active ? 'bg-blue-600' : 'bg-slate-200')} aria-hidden="true" />}
            <div className={cx('flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold',
              active ? 'bg-blue-700 text-white shadow-sm' : done ? 'text-blue-800' : 'text-slate-400')}>
              <span className={cx('flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                active ? 'bg-white/25' : done ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400')}>
                {done ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function EmptyState({ icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      {icon}
      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function SeverityScale({ currentTier, labels }) {
  const current = (() => {
    const map = { LOW: 1, MODERATE: 4, HIGH: 5, CRITICAL: 7 };
    return map[currentTier] || 0;
  })();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{labels?.title || 'Risk severity scale'}</span>
        <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
          GOV 7-STEP
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {SEVERITY_STEPS.map((s) => {
          const c = PALETTE[s.color];
          const active = current === s.step;
          return (
            <div key={s.step} title={s.name}
              className={cx('flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center',
                active ? cx('border-slate-800 ring-2 ring-slate-800/20', c.bg) : cx('border-slate-200', c.bg))}>
              <span className={cx('text-[10px] font-bold', c.text)}>{s.step}</span>
              <span className="w-full text-[9px] font-semibold leading-tight text-slate-500">{s.name}</span>
              <span className={cx('h-1.5 w-full rounded-full', c.dot)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}