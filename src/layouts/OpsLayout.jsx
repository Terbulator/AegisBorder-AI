import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, ShieldCheck, History, BarChart3, Settings, LogOut, Menu, X, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useT } from '../i18n';
import { Button } from '../components/ui';

export default function OpsLayout({ children }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const t = useT();

  const isPath = (p) => location === p;
  const isActive = (p) => location === p || (p !== '/dashboard' && location.startsWith(p));

  const nav = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { to: '/dashboard/screening/new', icon: ShieldCheck, label: t('new_operation') },
    { to: '/dashboard/history', icon: History, label: t('nav_history') },
    { to: '/dashboard/analytics', icon: BarChart3, label: t('analytics_title') },
    { to: '/dashboard/settings', icon: Settings, label: t('settings_title') },
  ];

  useEffect(() => { setSidebarOpen(false); }, [location]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — fixed on desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-surface-muted flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} role="navigation" aria-label="Main navigation">
        <div className="p-4 border-b border-surface-muted flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-bold text-sm tracking-tight">AEGISBORDER</div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.to === '/dashboard' ? isPath('/dashboard') : isActive(item.to);
            return (
              <Link key={item.to} href={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-foreground/60 hover:text-foreground hover:bg-surface-muted'}`}
                aria-current={active ? 'page' : undefined}>
                <Icon className={`w-5 h-5 ${active ? 'text-brand-primary' : 'text-foreground/40'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-surface-muted">
          <button onClick={() => setProfileOpen(!profileOpen)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-surface-muted transition-colors" aria-expanded={profileOpen} aria-haspopup="true">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold">
              {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-foreground truncate">{user?.name || t('user')}</div>
              <div className="text-xs text-foreground/50 truncate">{user?.role || 'analyst'}</div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="mt-2 space-y-1 bg-white border border-surface-muted rounded-lg shadow-elevated p-1">
              <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-surface-muted hover:text-foreground transition-colors" onClick={() => setProfileOpen(false)}>
                <User className="w-4 h-4" /> {t('nav_profile')}
              </Link>
              <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-danger hover:bg-danger/5 transition-colors">
                <LogOut className="w-4 h-4" /> {t('logout')}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-surface-muted h-14 flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-muted transition-colors" aria-label="Toggle sidebar">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">{t('nav_dashboard')}</Button>
            </Link>
            <Link href="/dashboard/profile">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold cursor-pointer hover:bg-brand-primary/20 transition-colors">
                {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </div>
            </Link>
          </div>
        </header>
        <main id="main-content" className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
