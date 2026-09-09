import { Link } from 'wouter';
import { Button } from '../components/ui';
import { useT } from '../i18n';

export default function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-display font-bold text-brand-primary">404</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">{t('page_not_found')}</h1>
        <p className="text-foreground/60 mb-6">{t('page_not_found_desc')}</p>
        <Link href="/"><Button>{t('back_to_home')}</Button></Link>
      </div>
    </div>
  );
}
