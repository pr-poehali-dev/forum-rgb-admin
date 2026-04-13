import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps } from '@/App';
import { CATEGORIES, moderateText } from '@/lib/forum-data';
import type { Topic } from '@/lib/forum-data';

export default function ForumNew({ go, store }: AppProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    let hasError = false;
    const tc = moderateText(title, store.bannedWords);
    if (!tc.ok) { setTitleError(tc.reason || ''); hasError = true; }
    else if (title.trim().length < 5) { setTitleError('Заголовок слишком короткий'); hasError = true; }
    else setTitleError('');

    const bc = moderateText(body, store.bannedWords);
    if (!bc.ok) { setBodyError(bc.reason || ''); hasError = true; }
    else if (body.trim().length < 10) { setBodyError('Текст слишком короткий'); hasError = true; }
    else setBodyError('');

    if (!category) hasError = true;
    if (hasError) { setShake(true); setTimeout(() => setShake(false), 400); return; }

    const id = store.addTopic({
      title: title.trim(),
      category,
      author: 'Администратор',
      tag: 'new' as Topic['tag'],
    });
    const cat = CATEGORIES.find(c => c.id === category)!;
    go({ name: 'topic', id, title: title.trim(), category: cat.id });
  };

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => go({ name: 'home' })} className="hover:text-foreground transition-colors">Главная</button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Новая тема</span>
        </div>

        <div className="gradient-border rounded-3xl p-6">
          <h1 className="font-montserrat font-900 text-2xl rainbow-text mb-6">Создать тему</h1>

          <div className="flex items-start gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 mb-6">
            <Icon name="Shield" size={18} className="text-purple-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-600 text-sm text-purple-300">Автоматическая модерация</div>
              <div className="text-xs text-muted-foreground mt-1">Спам и запрещённые слова блокируются до публикации</div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-600 mb-2">Раздел *</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${
                    category === cat.id
                      ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                      : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10'
                  }`}>
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-500">{cat.title}</span>
                  {category === cat.id && <Icon name="Check" size={14} className="ml-auto text-purple-400" />}
                </button>
              ))}
            </div>
            {!category && shake && <p className="text-xs text-red-400 mt-2">Выберите раздел</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-600 mb-2">Заголовок *</label>
            <input value={title} onChange={e => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="Введите заголовок темы..."
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all ${
                shake && titleError ? 'animate-shake border-red-500/60' : 'border-white/10 focus:border-purple-500/60'
              }`} />
            {titleError && <div className="flex items-center gap-2 text-xs text-red-400 mt-2"><Icon name="AlertCircle" size={13} />{titleError}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-600 mb-2">Текст темы *</label>
            <textarea value={body} onChange={e => { setBody(e.target.value); setBodyError(''); }}
              placeholder="Опишите тему подробнее..." rows={6}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none transition-all ${
                shake && bodyError ? 'animate-shake border-red-500/60' : 'border-white/10 focus:border-purple-500/60'
              }`} />
            {bodyError && <div className="flex items-center gap-2 text-xs text-red-400 mt-2"><Icon name="AlertCircle" size={13} />{bodyError}</div>}
            <div className="text-xs text-muted-foreground mt-1 text-right">{body.length} символов</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => go({ name: 'home' })}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-500 hover:bg-white/10 transition-colors">
              Отмена
            </button>
            <button onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl rainbow-bg text-white text-sm font-700 hover:opacity-90 transition-opacity">
              <Icon name="Send" size={15} /> Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
