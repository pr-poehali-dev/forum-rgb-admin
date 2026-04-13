import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';

interface Props {
  go: (p: Page) => void;
}

export default function ForumNav({ go }: Props) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/50">
      {/* RGB rainbow top stripe */}
      <div className="rainbow-bg h-1 w-full" />

      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg rgb-logo flex items-center justify-center text-sm font-bold text-white">
            F
          </div>
          <span className="font-montserrat font-900 text-lg rainbow-text hidden sm:block">ФОРУМ</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500/60 transition-colors"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <button onClick={() => go({ name: 'home' })}
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5">
            <Icon name="Home" size={14} /> Главная
          </button>

          <button onClick={() => go({ name: 'tutorial' })}
            className="px-3 py-1.5 rounded-lg text-sm font-600 flex items-center gap-1.5 hover:bg-white/5 transition-all">
            <Icon name="Sparkles" size={14} className="rgb-text" />
            <span className="rgb-text">RGB тутор</span>
          </button>

          <button onClick={() => go({ name: 'new' })}
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5">
            <Icon name="Plus" size={14} /> Тема
          </button>

          {/* Admin — RGB border */}
          <button onClick={() => go({ name: 'admin' })}
            className="ml-1 px-3 py-1.5 rounded-lg text-sm font-700 flex items-center gap-1.5 rgb-border bg-black/40 hover:bg-white/10 transition-all">
            <Icon name="ShieldCheck" size={14} className="rgb-text" />
            <span className="rgb-text">ADMIN</span>
          </button>

          {/* Profile */}
          <button onClick={() => go({ name: 'profile', username: 'GamerPro' })}
            className="ml-1 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-xs font-700 hover:opacity-90 transition-opacity glow-purple">
            Я
          </button>
        </nav>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(v => !v)} className="md:hidden ml-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Icon name={menuOpen ? 'X' : 'Menu'} size={18} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 space-y-1">
          {([
            { label: '🏠 Главная',      page: { name: 'home' } },
            { label: '✨ RGB тутор',    page: { name: 'tutorial' } },
            { label: '➕ Новая тема',   page: { name: 'new' } },
            { label: '🛡️ Админ панель', page: { name: 'admin' } },
            { label: '👤 Профиль',      page: { name: 'profile', username: 'GamerPro' } },
          ] as { label: string; page: Page }[]).map(item => (
            <button key={item.label} onClick={() => { go(item.page); setMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
