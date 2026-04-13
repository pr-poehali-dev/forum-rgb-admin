import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';

interface Props {
  go: (p: Page) => void;
  current?: string;
}

export default function ForumNav({ go, current }: Props) {
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => go({ name: 'home' })}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white glow-purple">
            F
          </div>
          <span className="font-montserrat font-800 text-lg gradient-text hidden sm:block">ФОРУМ</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по форуму..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500/60 transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* New topic */}
          <button
            onClick={() => go({ name: 'new' })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-600 hover:opacity-90 transition-opacity glow-purple"
          >
            <Icon name="Plus" size={16} />
            <span className="hidden sm:block">Новая тема</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => go({ name: 'profile', username: 'Вы' })}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white text-sm font-700 hover:opacity-90 transition-opacity"
          >
            Я
          </button>
        </div>
      </div>
    </header>
  );
}
