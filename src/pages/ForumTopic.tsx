import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps, Page } from '@/App';
import { CATEGORIES, moderateText } from '@/lib/forum-data';

interface Props extends AppProps { page: Extract<Page, { name: 'topic' }> }

export default function ForumTopic({ page, go, store }: Props) {
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  const cat = CATEGORIES.find(c => c.id === page.category);
  const topicPosts = store.posts.filter(p => p.topicId === page.id && !p.deleted);

  const handleSend = () => {
    const result = moderateText(replyText, store.bannedWords);
    if (!result.ok) {
      setError(result.reason || 'Ошибка');
      setShake(true); setTimeout(() => setShake(false), 400);
      return;
    }
    store.addPost({ topicId: page.id, author: 'Вы', avatar: '🙂', role: 'Участник', text: replyText });
    setReplyText(''); setError('');
    setSuccess('Ответ опубликован!'); setTimeout(() => setSuccess(''), 3000);
  };

  const toggleLike = (id: string) =>
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          {cat && <>
            <button onClick={() => go({ name: 'category', id: cat.id, title: cat.title, emoji: cat.emoji })}
              className="hover:text-foreground transition-colors">{cat.emoji} {cat.title}</button>
            <Icon name="ChevronRight" size={14} />
          </>}
          <span className="text-foreground line-clamp-1">{page.title}</span>
        </div>

        <div className="gradient-border rounded-3xl p-6 mb-6">
          <h1 className="font-montserrat font-800 text-2xl leading-tight mb-3">{page.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon name="MessageCircle" size={14} />{topicPosts.length} ответов</span>
            <span className="flex items-center gap-1"><Icon name="Clock" size={14} />Только что</span>
          </div>
        </div>

        {topicPosts.length === 0 ? (
          <div className="gradient-border rounded-2xl p-8 text-center mb-6">
            <div className="text-4xl mb-2">💬</div>
            <div className="font-600 mb-1">Ответов пока нет</div>
            <div className="text-sm text-muted-foreground">Стань первым кто ответит!</div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {topicPosts.map((post, i) => {
              const liked = likedIds.includes(post.id);
              return (
                <div key={post.id}
                  className={`forum-card rounded-2xl p-5 animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 500)}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/20 flex items-center justify-center text-xl shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <button onClick={() => go({ name: 'profile', username: post.author })}
                          className="font-600 hover:text-purple-400 transition-colors text-sm">{post.author}</button>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{post.role}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{post.time}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{post.text}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                            liked ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                          }`}>
                          <Icon name="Heart" size={13} />{post.likes + (liked ? 1 : 0)}
                        </button>
                        <button onClick={() => {
                          store.addReport({ user: post.author, text: post.text, reason: 'Жалоба пользователя', status: 'pending' });
                        }}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors ml-auto">
                          <Icon name="Flag" size={13} /> Жалоба
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="gradient-border rounded-3xl p-5">
          <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
            <Icon name="MessageSquarePlus" size={16} className="text-purple-400" /> Написать ответ
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2">
            <Icon name="Shield" size={13} className="text-purple-400 shrink-0" />
            Автомодерация активна — спам блокируется
          </div>
          <textarea value={replyText} onChange={e => { setReplyText(e.target.value); setError(''); }}
            placeholder="Поделитесь своим мнением..." rows={4}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none transition-all ${
              shake ? 'animate-shake border-red-500/60' : 'border-white/10 focus:border-purple-500/60'
            }`} />
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 mt-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <Icon name="AlertCircle" size={13} />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-xs text-green-400 mt-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
              <Icon name="CheckCircle" size={13} />{success}
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{replyText.length} символов</span>
            <button onClick={handleSend} disabled={!replyText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl rainbow-bg text-white text-sm font-700 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              <Icon name="Send" size={15} /> Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
