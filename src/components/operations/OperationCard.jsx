import { ArrowRight, Loader2 } from 'lucide-react';
import { Badge, cx } from '../ui';

export default function OperationCard({ icon, title, description, inputs, badge, onClick, disabled, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className={cx(
        'group relative flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
        disabled && 'cursor-not-allowed opacity-60 hover:translate-y-0 hover:border-slate-200 hover:shadow-sm'
      )}
    >
      {busy && (
        <span className="absolute right-3 top-3" aria-hidden="true">
          <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
        </span>
      )}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {badge && <Badge color="slate" className="!px-1.5 !text-[10px]">{badge}</Badge>}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
        {inputs && (
          <p className="mt-2 text-[11px] font-mono text-slate-400" aria-label="Supported inputs">{inputs}</p>
        )}
      </div>
      <span
        className="absolute right-3 bottom-3 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors group-hover:bg-blue-700 group-hover:text-white"
        aria-hidden="true"
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}