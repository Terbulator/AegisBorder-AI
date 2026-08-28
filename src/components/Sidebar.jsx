import React from 'react';
import {
  Shield,
  Smartphone,
  MessageSquare,
  Globe,
  QrCode,
  ShieldAlert,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'message', label: 'Message Scanner', subtitle: 'SMS & WhatsApp', icon: MessageSquare },
  { id: 'url', label: 'Website Link Checker', subtitle: 'Phishing & Fake Sites', icon: Globe },
  { id: 'qr', label: 'QR & UPI Safety', subtitle: 'Deceptive Cashbacks', icon: QrCode },
  { id: 'apk', label: 'App Safety Check', subtitle: 'Dangerous Permissions', icon: ShieldAlert },
  { id: 'phone', label: 'Live Phone Demo', subtitle: 'Simulate Scam Alerts', icon: Smartphone },
  { id: 'blockchain', label: 'Scam Registry', subtitle: 'Cyber Police 1930', icon: Database },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
  bloomStats,
  onOpenLedger
}) {
  const handleNavClick = (id) => {
    onTabChange(id);
    if (id === 'blockchain') {
      onOpenLedger();
    }
    if (isMobileOpen) onMobileClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-surface-sidebar border-r border-surface-border
          flex flex-col transition-all duration-300 ease-out
          ${isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Brand Header */}
        <div className={`px-4 py-4 border-b border-[var(--border-subtle)] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 flex items-center justify-center text-[var(--primary)] font-bold">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                  Rakshak AI
                </h1>
                <p className="text-[11px] text-[var(--text-muted)] font-medium">Scam & Fraud Shield</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex absolute -right-3 top-5 items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Protection Tools
            </div>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`
                  sidebar-nav-item w-full
                  ${isActive ? 'active' : ''}
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0
                  ${isActive
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="text-left min-w-0">
                    <div className="truncate text-xs font-semibold leading-tight">{item.label}</div>
                    <div className="truncate text-[10px] text-[var(--text-muted)] font-normal">{item.subtitle}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`px-3 py-3 border-t border-[var(--border-subtle)] space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
          {/* Quick Database Access */}
          <button
            onClick={onOpenLedger}
            className={`w-full flex items-center gap-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-all
              ${isCollapsed ? 'justify-center p-2' : 'px-3 py-2'}
            `}
          >
            <Database className="w-3.5 h-3.5 text-[var(--primary)]" />
            {!isCollapsed && <span>Scam Registry (1930)</span>}
          </button>

          {/* Privacy & Safe Badge */}
          {!isCollapsed && (
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% On-Device & Private</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Export for mobile header
export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
      title="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
