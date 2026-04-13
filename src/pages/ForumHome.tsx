import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';
import { CATEGORIES, HOT_TOPICS, ONLINE_USERS } from '@/lib/forum-data';

interface Props { go: (p: Page) => void }

const tagClass: Record<string, string> = {
  hot: 'tag-hot',
  new: 'tag-new',
  trending: 'tag-trending',
  pinned: 'tag-pinned',
};
const tagLabel: Record<string, string> = { hot: '🔥 Горячее', new: '✨ Новое', trending: '📈 Тренд', pinned: '📌 Закреплено' };

export default function ForumHome({ go }: Props) {
  return (
    <div className="animate-fade-in">
      <ForumNav go={go} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="font-montserrat text-4xl sm:text-5xl font-900 gradient-text mb-3 text-glow-purple">
            Добро пожаловать
          </h1>
          <p className="text-muted-foreground text-lg">Обсуждай всё что интересно — вместе веселее</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block"></span>
            {ONLINE_USERS.length} онлайн прямо сейчас
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in-up animate-delay-100">
          {[
            { label: 'Тем', value: '1 240', icon: 'MessageSquare' },
            { label: 'Участников', value: '8 491', icon: 'Users' },
            { label: 'Сообщений', value: '48 302', icon: 'Zap' },
          ].map(s => (
            <div key={s.label} className="gradient-border rounded-2xl p-4 text-center">
              <Icon name={s.icon as any} size={20} className="mx-auto mb-1 text-purple-400" />
              <div className="font-montserrat font-900 text-2xl gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: categories + hot */}
          <div className="lg:col-span-2 space-y-6">

            {/* Categories */}
            <section>
              <h2 className="font-montserrat font-800 text-xl mb-4 flex items-center gap-2">
                <Icon name="LayoutGrid" size={20} className="text-purple-400" />
                Разделы
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => go({ name: 'category', id: cat.id, title: cat.title, emoji: cat.emoji })}
                    className={`forum-card rounded-2xl p-4 text-left flex items-center gap-4 animate-fade-in-up animate-delay-${Math.min((i + 2) * 100, 500)}`}
                  >
                    <div className={`cat-icon bg-gradient-to-br ${cat.color} shrink-0`}>
                      {cat.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-600 text-sm">{cat.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{cat.desc}</div>
                      <div className="text-xs text-purple-400 mt-0.5">{cat.topics} тем</div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </section>

            {/* Hot topics */}
            <section>
              <h2 className="font-montserrat font-800 text-xl mb-4 flex items-center gap-2">
                <Icon name="Flame" size={20} className="text-orange-400" />
                Горячие темы
              </h2>
              <div className="space-y-2">
                {HOT_TOPICS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: t.category })}
                    className={`forum-card w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 animate-fade-in-up animate-delay-${Math.min((i + 2) * 100, 500)}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${tagClass[t.tag]} text-xs px-2 py-0.5 rounded-full font-600`}>
                          {tagLabel[t.tag]}
                        </span>
                      </div>
                      <div className="font-500 text-sm leading-snug">{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t.author} · {t.time}</div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1 justify-end"><Icon name="MessageCircle" size={12} />{t.replies}</div>
                      <div className="flex items-center gap-1 justify-end"><Icon name="Eye" size={12} />{t.views}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Online users */}
            <div className="gradient-border rounded-2xl p-4">
              <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block"></span>
                Онлайн ({ONLINE_USERS.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {ONLINE_USERS.map(u => (
                  <button
                    key={u}
                    onClick={() => go({ name: 'profile', username: u })}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-500 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="gradient-border rounded-2xl p-4 space-y-2">
              <h3 className="font-600 text-sm mb-3">Быстрые действия</h3>
              {[
                { icon: 'PlusCircle', label: 'Создать тему', page: { name: 'new' } as Page, color: 'text-purple-400' },
                { icon: 'Bell', label: 'Уведомления', page: { name: 'profile', username: 'Вы' } as Page, color: 'text-cyan-400' },
                { icon: 'Bookmark', label: 'Избранное', page: { name: 'profile', username: 'Вы' } as Page, color: 'text-pink-400' },
                { icon: 'Settings', label: 'Настройки', page: { name: 'profile', username: 'Вы' } as Page, color: 'text-orange-400' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => go(a.page)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm"
                >
                  <Icon name={a.icon as any} size={16} className={a.color} />
                  {a.label}
                  <Icon name="ChevronRight" size={14} className="ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Rules */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <h3 className="font-600 text-sm mb-2 flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-purple-400" />
                Правила форума
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Уважай других участников</li>
                <li>✓ Без спама и рекламы</li>
                <li>✓ Пиши по теме раздела</li>
                <li>✓ Модерация работает 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
