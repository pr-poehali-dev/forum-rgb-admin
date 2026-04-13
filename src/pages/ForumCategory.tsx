import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';
import { HOT_TOPICS } from '@/lib/forum-data';

interface Props {
  page: Extract<Page, { name: 'category' }>;
  go: (p: Page) => void;
}

const EXTRA_TOPICS = [
  { id: '10', title: 'Как вы начали этим увлекаться?', author: 'NewUser22', replies: 18, views: 340, tag: 'new', time: '30 мин назад' },
  { id: '11', title: 'Топ ресурсов для новичков', author: 'ProHelper', replies: 45, views: 920, tag: 'pinned', time: '1 день назад' },
  { id: '12', title: 'Что нового в этом месяце?', author: 'MonthlyBot', replies: 7, views: 120, tag: 'new', time: '2 часа назад' },
  { id: '13', title: 'Рекомендации от сообщества', author: 'CommunityMod', replies: 89, views: 1800, tag: 'trending', time: '4 часа назад' },
  { id: '14', title: 'Ваш любимый контент по теме', author: 'Fanatic2025', replies: 33, views: 670, tag: 'hot', time: '5 часов назад' },
];

const tagClass: Record<string, string> = {
  hot: 'tag-hot', new: 'tag-new', trending: 'tag-trending', pinned: 'tag-pinned',
};
const tagLabel: Record<string, string> = {
  hot: '🔥 Горячее', new: '✨ Новое', trending: '📈 Тренд', pinned: '📌 Закреплено',
};

export default function ForumCategory({ page, go }: Props) {
  const catTopics = [
    ...HOT_TOPICS.filter(t => t.category === page.id),
    ...EXTRA_TOPICS,
  ];

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">{page.title}</span>
        </div>

        {/* Header */}
        <div className="gradient-border rounded-3xl p-6 mb-8 flex items-center gap-5">
          <div className="text-5xl">{page.emoji}</div>
          <div>
            <h1 className="font-montserrat font-900 text-3xl gradient-text">{page.title}</h1>
            <p className="text-muted-foreground mt-1">{catTopics.length} тем · Активный раздел</p>
          </div>
          <button
            onClick={() => go({ name: 'new' })}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-600 hover:opacity-90 transition-opacity glow-purple shrink-0"
          >
            <Icon name="Plus" size={16} />
            Новая тема
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['Все темы', 'Горячие', 'Новые', 'Без ответов'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl text-sm font-500 whitespace-nowrap transition-all ${i === 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Topics list */}
        <div className="space-y-2">
          {catTopics.map((t, i) => (
            <button
              key={t.id}
              onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: page.id })}
              className={`forum-card w-full rounded-2xl px-5 py-4 text-left flex items-center gap-4 animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 500)}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`${tagClass[t.tag]} text-xs px-2 py-0.5 rounded-full font-600`}>
                    {tagLabel[t.tag]}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.time}</span>
                </div>
                <div className="font-500 leading-snug">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <button
                    className="hover:text-purple-400 transition-colors"
                    onClick={e => { e.stopPropagation(); go({ name: 'profile', username: t.author }); }}
                  >
                    {t.author}
                  </button>
                </div>
              </div>
              <div className="shrink-0 flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 flex-col items-center">
                  <Icon name="MessageCircle" size={14} />
                  <span>{t.replies}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-col items-center">
                  <Icon name="Eye" size={14} />
                  <span>{t.views}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
