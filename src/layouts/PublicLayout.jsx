import { Link, useLocation } from 'wouter';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useT } from '../i18n';
import { Button } from '../components/ui';

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useT();

  return (
    <div className="min-h-screen bg-surface-base text-foreground font-body">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-primary focus:text-white focus:px-3 focus:py-2 focus:rounded-lg">{t('skip_to_content')}</a>
      <header className="bg-white/80 backdrop-blur-md border-b border-surface-muted sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-bold text-lg tracking-tight">AEGISBORDER</div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/70">
            <Link href="/#features" className="hover:text-brand-primary transition-colors">{t('features')}</Link>
            <Link href="/#how-it-works" className="hover:text-brand-primary transition-colors">{t('how_it_works')}</Link>
            <Link href="/#use-cases" className="hover:text-brand-primary transition-colors">{t('use_cases')}</Link>
            <Link href="/#compliance" className="hover:text-brand-primary transition-colors">{t('compliance')}</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-brand-primary transition-colors">{t('nav_dashboard')}</Link>
                <Button onClick={logout} variant="outline" size="sm">{t('logout')}</Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-brand-primary transition-colors">{t('nav_login')}</Link>
                <Link href="/signup">
                  <Button size="sm">{t('nav_get_started')}</Button>
                </Link>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-white border-t border-surface-muted px-4 py-4 space-y-3">
            <Link href="/#features" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/70 hover:text-brand-primary">{t('features')}</Link>
            <Link href="/#how-it-works" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/70 hover:text-brand-primary">{t('how_it_works')}</Link>
            <Link href="/#use-cases" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/70 hover:text-brand-primary">{t('use_cases')}</Link>
            <Link href="/#compliance" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/70 hover:text-brand-primary">{t('compliance')}</Link>
            <div className="pt-2 border-t border-surface-muted space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block text-sm font-medium">{t('nav_dashboard')}</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="block text-sm font-medium text-danger">{t('logout')}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/70">{t('nav_login')}</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="block text-sm font-medium text-brand-primary">{t('nav_get_started')}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main id="main-content" className="flex-1">{children}</main>
      <footer className="bg-white border-t border-surface-muted mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold">AEGISBORDER</span>
              </div>
              <p className="text-foreground/60 leading-relaxed">{t('footer_tagline')}</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">{t('footer_platform')}</h3>
              <ul className="space-y-2 text-foreground/60">
                <li><Link href="/#features" className="hover:text-brand-primary transition-colors">{t('features')}</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-brand-primary transition-colors">{t('how_it_works')}</Link></li>
                <li><Link href="/#use-cases" className="hover:text-brand-primary transition-colors">{t('use_cases')}</Link></li>
                <li><Link href="/#compliance" className="hover:text-brand-primary transition-colors">{t('compliance')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">{t('footer_resources')}</h3>
              <ul className="space-y-2 text-foreground/60">
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('documentation')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('api_reference')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('support')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('status_page')}</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">{t('footer_legal')}</h3>
              <ul className="space-y-2 text-foreground/60">
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('privacy_policy')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('terms_of_service')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('data_processing')}</span></li>
                <li><span className="hover:text-brand-primary transition-colors cursor-pointer">{t('security')}</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-muted text-center text-foreground/50 text-sm">{t('footer_copyright')}</div>
        </div>
      </footer>
    </div>
  );
}
