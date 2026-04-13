import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps, Page } from '@/App';

interface Props extends AppProps { page: Extract<Page, { name: 'profile' }> }

export default function ForumProfile({ page, go, store }: Props) {
  const { topics, posts } = store;
  const userTopics = topics.filter(t => t.author === page.username);
  const userPosts = posts.filter(p => p.author === page.username && !p.deleted);

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Профиль</span>
        </div>

        <div className="relative rounded-3xl overflow-hidden mb-6">
          <div className="h-32 rainbow-bg" />
          <div className="gradient-border rounded-b-3xl p-6 pt-0 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl rgb-logo border-4 border-card flex items-center justify-center text-3xl rgb-glow shrink-0">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-montserrat font-900 text-2xl">{page.username}</h1>
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-600">
                    Участник
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{userTopics.length} тем · {userPosts.length} сообщений</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Тем',       value: userTopics.length },
                { label: 'Ответов',   value: userPosts.length  },
                { label: 'Лайков',    value: userPosts.reduce((s, p) => s + p.likes, 0) },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="font-montserrat font-800 text-2xl rainbow-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-600 text-sm mb-3 text-muted-foreground">Темы пользователя</h3>
          {userTopics.length === 0 ? (
            <div className="gradient-border rounded-2xl p-8 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-sm text-muted-foreground">Тем пока нет</div>
            </div>
          ) : (
            <div className="space-y-2">
              {userTopics.map(t => (
                <button key={t.id}
                  onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: t.category })}
                  className="forum-card w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3">
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
          )}
        </div>
      </div>
    </div>
  );
}
