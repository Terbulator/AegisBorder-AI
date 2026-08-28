import React from 'react';
import { Home, MessageSquare, Globe, Database, MoreHorizontal } from 'lucide-react';

const ITEMS = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'message',  label: 'Scan',     icon: MessageSquare },
  { id: 'url',      label: 'Check',    icon: Globe },
  { id: 'registry', label: 'Registry', icon: Database },
  { id: 'more',     label: 'More',     icon: MoreHorizontal },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] h-16 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Primary navigation"
    >
      {ITEMS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon
              className={`w-5 h-5 transition-colors ${active ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
              strokeWidth={active ? 2 : 1.75}
            />
            <span className={`text-[10.5px] font-medium transition-colors ${active ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
