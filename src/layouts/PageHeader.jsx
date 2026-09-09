import { useT } from '../i18n';

export default function PageHeader({ title, subtitle, children }) {
  const { t } = useT();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-foreground/60 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  );
}
