import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps, Page } from '@/App';
import { CATEGORIES } from '@/lib/forum-data';

interface Props extends AppProps { page: Extract<Page, { name: 'category' }> }

const tagClass: Record<string, string> = { hot: 'tag-hot', new: 'tag-new', trending: 'tag-trending', pinned: 'tag-pinned' };
const tagLabel: Record<string, string> = { hot: '🔥 Горячее', new: '✨ Новое', trending: '📈 Тренд', pinned: '📌 Закреплено' };
type Filter = 'all' | 'hot' | 'new' | 'noreplies';

export default function ForumCategory({ page, go, store }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const catTopics = store.topics.filter(t => t.category === page.id);
  const filtered = filter === 'all'      ? catTopics
                 : filter === 'hot'      ? catTopics.filter(t => t.tag === 'hot' || t.tag === 'trending')
                 : filter === 'new'      ? catTopics.filter(t => t.tag === 'new')
                 : catTopics.filter(t => t.replies === 0);

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">{page.title}</span>
        </div>

        <div className="gradient-border rounded-3xl p-6 mb-8 flex items-center gap-5">
          <div className="text-5xl">{page.emoji}</div>
          <div>
            <h1 className="font-montserrat font-900 text-3xl rainbow-text">{page.title}</h1>
            <p className="text-muted-foreground mt-1">{catTopics.length} тем · {CATEGORIES.find(c => c.id === page.id)?.desc}</p>
          </div>
          <button onClick={() => go({ name: 'new' })}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl rainbow-bg text-white text-sm font-700 hover:opacity-90 transition-opacity shrink-0">
            <Icon name="Plus" size={16} /> Новая тема
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {([['all','Все темы'],['hot','Горячие'],['new','Новые'],['noreplies','Без ответов']] as [Filter,string][]).map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-sm font-500 whitespace-nowrap transition-all ${
                filter === id ? 'rainbow-bg text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}>{label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="gradient-border rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="font-600 mb-1">Тем пока нет</div>
            <div className="text-sm text-muted-foreground mb-5">Создай первую тему в этом разделе!</div>
            <button onClick={() => go({ name: 'new' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl rainbow-bg text-white font-700 text-sm hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={16} /> Создать тему
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t, i) => (
              <button key={t.id}
                onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: page.id })}
                className={`forum-card w-full rounded-2xl px-5 py-4 text-left flex items-center gap-4 animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 500)}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`${tagClass[t.tag]} text-xs px-2 py-0.5 rounded-full font-600`}>{tagLabel[t.tag]}</span>
                    <span className="text-xs text-muted-foreground">{t.time}</span>
                  </div>
                  <div className="font-500 leading-snug">{t.title}</div>
                  <button className="text-xs text-muted-foreground mt-1 hover:text-purple-400 transition-colors"
                    onClick={e => { e.stopPropagation(); go({ name: 'profile', username: t.author }); }}>
                    {t.author}
                  </button>
                </div>
                <div className="shrink-0 flex gap-4 text-xs text-muted-foreground">
                  <div className="text-center"><Icon name="MessageCircle" size={14} className="mx-auto mb-0.5" />{t.replies}</div>
                  <div className="text-center"><Icon name="Eye" size={14} className="mx-auto mb-0.5" />{t.views}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
