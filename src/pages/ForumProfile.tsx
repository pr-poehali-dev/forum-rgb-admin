import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';
import { HOT_TOPICS } from '@/lib/forum-data';

interface Props {
  page: Extract<Page, { name: 'profile' }>;
  go: (p: Page) => void;
}

const ACHIEVEMENTS = [
  { icon: '🔥', label: 'Горячая голова', desc: '10 горячих тем' },
  { icon: '💬', label: 'Болтун', desc: '100 ответов' },
  { icon: '⭐', label: 'Старожил', desc: '1 год на форуме' },
  { icon: '🛡️', label: 'Страж порядка', desc: '50 жалоб' },
];

export default function ForumProfile({ page, go }: Props) {
  const isMe = page.username === 'Вы';
  const username = isMe ? 'GamerPro' : page.username;
  const topics = HOT_TOPICS.slice(0, 3);

  const tabs = ['Темы', 'Ответы', 'Достижения', 'Настройки'];
  const activeTab = 'Темы';

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Профиль</span>
        </div>

        {/* Profile card */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500"></div>

          <div className="gradient-border rounded-b-3xl p-6 pt-0 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 border-4 border-card flex items-center justify-center text-3xl glow-purple shrink-0">
                🎮
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-montserrat font-900 text-2xl">{username}</h1>
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-600">
                    Модератор
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block" title="Онлайн"></span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">На форуме с 2022 года · 432 сообщения</p>
              </div>

              {isMe ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-500 hover:bg-white/10 transition-colors">
                  <Icon name="Edit" size={15} />
                  Редактировать
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-600 hover:opacity-90 transition-opacity">
                  <Icon name="UserPlus" size={15} />
                  Подписаться
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Тем', value: '47' },
                { label: 'Ответов', value: '385' },
                { label: 'Лайков', value: '1 204' },
                { label: 'Подписчиков', value: '89' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="font-montserrat font-800 text-xl gradient-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground border-l-2 border-purple-500 pl-3">
              Люблю игры, технологии и хорошие дискуссии. Модератор с 2023 года. Пишите в лс!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl text-sm font-500 whitespace-nowrap transition-all ${tab === activeTab
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} className="gradient-border rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="font-600 text-sm">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
            </div>
          ))}
        </div>

        {/* Recent topics */}
        <div>
          <h3 className="font-600 text-sm mb-3 text-muted-foreground">Последние темы пользователя</h3>
          <div className="space-y-2">
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: t.category })}
                className="forum-card w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-500 text-sm">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.time}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Icon name="MessageCircle" size={13} />{t.replies}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
