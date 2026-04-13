import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps } from '@/App';
import { CATEGORIES } from '@/lib/forum-data';

const tagClass: Record<string, string> = { hot: 'tag-hot', new: 'tag-new', trending: 'tag-trending', pinned: 'tag-pinned' };
const tagLabel: Record<string, string> = { hot: '🔥 Горячее', new: '✨ Новое', trending: '📈 Тренд', pinned: '📌 Закреплено' };

export default function ForumHome({ go, store }: AppProps) {
  const { topics, posts, users } = store;
  const online = users.filter(u => u.online && u.status === 'active');

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="font-montserrat text-5xl font-900 rainbow-text mb-3">Добро пожаловать!</h1>
          <p className="text-muted-foreground text-lg">Форум только открылся — стань первым!</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block" />
            {online.length > 0 ? `${online.length} онлайн` : 'Пока никого — заходи первым!'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in-up animate-delay-100">
          {[
            { label: 'Тем',        value: topics.length,                              icon: 'MessageSquare' },
            { label: 'Участников', value: users.length,                               icon: 'Users' },
            { label: 'Сообщений',  value: posts.filter(p => !p.deleted).length,       icon: 'Zap' },
          ].map(s => (
            <div key={s.label} className="gradient-border rounded-2xl p-4 text-center">
              <Icon name={s.icon as 'Zap'} size={20} className="mx-auto mb-1 text-purple-400" />
              <div className="font-montserrat font-900 text-3xl rainbow-text">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <section>
              <h2 className="font-montserrat font-800 text-xl mb-4 flex items-center gap-2">
                <Icon name="LayoutGrid" size={20} className="text-purple-400" /> Разделы
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat, i) => {
                  const count = topics.filter(t => t.category === cat.id).length;
                  return (
                    <button key={cat.id}
                      onClick={() => go({ name: 'category', id: cat.id, title: cat.title, emoji: cat.emoji })}
                      className={`forum-card rounded-2xl p-4 text-left flex items-center gap-4 animate-fade-in-up animate-delay-${Math.min((i + 2) * 100, 500)}`}>
                      <div className={`cat-icon bg-gradient-to-br ${cat.color} shrink-0`}>{cat.emoji}</div>
                      <div className="min-w-0">
                        <div className="font-600 text-sm">{cat.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{cat.desc}</div>
                        <div className="text-xs text-purple-400 mt-0.5">{count} тем</div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-montserrat font-800 text-xl mb-4 flex items-center gap-2">
                <Icon name="Flame" size={20} className="text-orange-400" /> Последние темы
              </h2>
              {topics.length === 0 ? (
                <div className="gradient-border rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-3">🌱</div>
                  <div className="font-600 text-lg mb-1">Тем пока нет</div>
                  <div className="text-sm text-muted-foreground mb-5">Стань первым — создай тему!</div>
                  <button onClick={() => go({ name: 'new' })}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl rainbow-bg text-white font-700 text-sm hover:opacity-90 transition-opacity">
                    <Icon name="Plus" size={16} /> Создать первую тему
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {topics.slice(0, 10).map((t, i) => (
                    <button key={t.id}
                      onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: t.category })}
                      className={`forum-card w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 500)}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${tagClass[t.tag]} text-xs px-2 py-0.5 rounded-full font-600`}>{tagLabel[t.tag]}</span>
                        </div>
                        <div className="font-500 text-sm leading-snug">{t.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t.author} · {t.time}</div>
                      </div>
                      <div className="shrink-0 text-right text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1 justify-end"><Icon name="MessageCircle" size={12} />{t.replies}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-4">
            <div className="gradient-border rounded-2xl p-4">
              <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block" /> Онлайн ({online.length})
              </h3>
              {online.length === 0
                ? <div className="text-xs text-muted-foreground">Никого нет онлайн</div>
                : <div className="flex flex-wrap gap-2">
                    {online.map(u => (
                      <button key={u.name} onClick={() => go({ name: 'profile', username: u.name })}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg px-2.5 py-1.5 text-xs font-500 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{u.name}
                      </button>
                    ))}
                  </div>
              }
            </div>

            <div className="gradient-border rounded-2xl p-4 space-y-1">
              <h3 className="font-600 text-sm mb-3">Быстрые действия</h3>
              {([
                { icon: 'PlusCircle',  label: 'Создать тему',  action: () => go({ name: 'new' }),                                  color: 'text-purple-400' },
                { icon: 'Sparkles',    label: 'RGB тутор',     action: () => go({ name: 'tutorial' }),                             color: 'text-pink-400' },
                { icon: 'ShieldCheck', label: 'Админ панель',  action: () => go({ name: 'admin' }),                                color: 'text-red-400' },
                { icon: 'User',        label: 'Мой профиль',   action: () => go({ name: 'profile', username: 'Администратор' }),   color: 'text-cyan-400' },
              ] as { icon: string; label: string; action: () => void; color: string }[]).map(a => (
                <button key={a.label} onClick={a.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm">
                  <Icon name={a.icon as 'User'} size={16} className={a.color} />
                  {a.label}
                  <Icon name="ChevronRight" size={14} className="ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>

            <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <h3 className="font-600 text-sm mb-2 flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-purple-400" /> Правила
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Уважай других</li>
                <li>✓ Без спама и рекламы</li>
                <li>✓ Пиши по теме</li>
                <li>✓ Модерация 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
