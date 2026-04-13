import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';
import { BANNED_WORDS } from '@/lib/forum-data';

interface Props { go: (p: Page) => void }

const REPORTS = [
  { id: '1', user: 'SpamBot99',   text: 'Купи казино онлайн! Лучшие ставки!', reason: 'Спам', time: '2 мин назад', status: 'pending' },
  { id: '2', user: 'AngryUser',   text: 'Ты идиот и твои слова ничего не стоят', reason: 'Оскорбление', time: '15 мин назад', status: 'pending' },
  { id: '3', user: 'AdBot2025',   text: 'Кредит под 0%! Жми сюда: http://spam.ru', reason: 'Реклама', time: '1 час назад', status: 'resolved' },
  { id: '4', user: 'FakeNews123', text: 'СРОЧНО! Раздача денег всем участникам!', reason: 'Мошенничество', time: '2 часа назад', status: 'pending' },
];

const USERS = [
  { name: 'GamerPro',    role: 'Модератор', posts: 432, status: 'active',  joined: '2022' },
  { name: 'TechNerd',    role: 'Старожил',  posts: 218, status: 'active',  joined: '2023' },
  { name: 'SpamBot99',   role: 'Участник',  posts: 12,  status: 'banned',  joined: '2025' },
  { name: 'PixelQueen',  role: 'Участник',  posts: 95,  status: 'active',  joined: '2024' },
  { name: 'AngryUser',   role: 'Участник',  posts: 7,   status: 'warned',  joined: '2025' },
];

const STATS = [
  { label: 'Жалоб сегодня',   value: '12',  icon: 'Flag',        color: 'from-red-500 to-orange-500' },
  { label: 'Заблокировано',   value: '3',   icon: 'Ban',         color: 'from-orange-500 to-yellow-500' },
  { label: 'Онлайн сейчас',   value: '47',  icon: 'Activity',    color: 'from-green-400 to-emerald-600' },
  { label: 'Новых сегодня',   value: '24',  icon: 'UserPlus',    color: 'from-purple-500 to-pink-500' },
  { label: 'Тем сегодня',     value: '38',  icon: 'MessageSquare', color: 'from-cyan-400 to-blue-600' },
  { label: 'Сообщений',       value: '291', icon: 'Zap',         color: 'from-pink-500 to-rose-600' },
];

type Tab = 'dashboard' | 'reports' | 'users' | 'banned' | 'settings';

export default function AdminPanel({ go }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [reports, setReports] = useState(REPORTS);
  const [users, setUsers] = useState(USERS);
  const [bannedWords, setBannedWords] = useState(BANNED_WORDS);
  const [newWord, setNewWord] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const resolveReport = (id: string) => {
    setReports(r => r.map(x => x.id === id ? { ...x, status: 'resolved' } : x));
    showToast('Жалоба закрыта');
  };

  const banUser = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, status: 'banned' } : x));
    showToast(`Пользователь ${name} заблокирован`);
  };

  const unbanUser = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, status: 'active' } : x));
    showToast(`Пользователь ${name} разблокирован`);
  };

  const addWord = () => {
    if (!newWord.trim()) return;
    setBannedWords(w => [...w, newWord.trim().toLowerCase()]);
    setNewWord('');
    showToast(`Слово «${newWord}» добавлено в стоп-лист`);
  };

  const removeWord = (w: string) => {
    setBannedWords(bw => bw.filter(x => x !== w));
    showToast(`Слово «${w}» удалено`);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Дашборд',   icon: 'LayoutDashboard' },
    { id: 'reports',   label: 'Жалобы',    icon: 'Flag' },
    { id: 'users',     label: 'Участники', icon: 'Users' },
    { id: 'banned',    label: 'Стоп-слова',icon: 'ShieldX' },
    { id: 'settings',  label: 'Настройки', icon: 'Settings' },
  ];

  const statusColor: Record<string, string> = {
    active:   'text-green-400 bg-green-400/10',
    banned:   'text-red-400 bg-red-400/10',
    warned:   'text-yellow-400 bg-yellow-400/10',
    pending:  'text-orange-400 bg-orange-400/10',
    resolved: 'text-green-400 bg-green-400/10',
  };
  const statusLabel: Record<string, string> = {
    active: 'Активен', banned: 'Бан', warned: 'Предупреждён',
    pending: 'Ожидает', resolved: 'Закрыта',
  };

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-600 backdrop-blur-xl animate-scale-in flex items-center gap-2">
          <Icon name="CheckCircle" size={16} /> {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl rgb-logo flex items-center justify-center text-2xl rgb-glow">
            🛡️
          </div>
          <div>
            <h1 className="font-montserrat font-900 text-3xl rainbow-text">ПАНЕЛЬ АДМИНИСТРАТОРА</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 admin-live inline-block"></span>
              Система работает · Модерация активна
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'rainbow-bg text-white shadow-lg'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
              }`}>
              <Icon name={t.icon as any} size={15} />
              {t.label}
              {t.id === 'reports' && reports.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs leading-none">
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* === DASHBOARD === */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <div key={s.label} className={`gradient-border rounded-2xl p-4 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <Icon name={s.icon as any} size={18} className="text-white" />
                  </div>
                  <div className="font-montserrat font-900 text-3xl rainbow-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Live log */}
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 admin-live inline-block"></span>
                Лог активности (live)
              </h3>
              <div className="space-y-2 text-sm font-mono">
                {[
                  { t: '00:47', msg: '✅ Пользователь TechNerd создал тему «ИИ уже заменяет программистов?»', c: 'text-green-400' },
                  { t: '00:45', msg: '🚫 Заблокировано сообщение SpamBot99 — обнаружен спам', c: 'text-red-400' },
                  { t: '00:43', msg: '👋 Новый участник FreshUser2025 зарегистрировался', c: 'text-cyan-400' },
                  { t: '00:41', msg: '⚠️ Жалоба на AngryUser — нарушение правил', c: 'text-yellow-400' },
                  { t: '00:38', msg: '✅ GamerPro добавил ответ в теме «Игры 2025»', c: 'text-green-400' },
                  { t: '00:35', msg: '🚫 Автомодерация: удалено слово «казино» из поста AdBot', c: 'text-red-400' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/3 rounded-xl px-3 py-2">
                    <span className="text-muted-foreground shrink-0">{log.t}</span>
                    <span className={log.c}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === REPORTS === */}
        {tab === 'reports' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Жалобы от участников — {reports.filter(r => r.status === 'pending').length} ожидают решения
            </p>
            {reports.map(r => (
              <div key={r.id} className={`forum-card rounded-2xl p-5 ${r.status === 'resolved' ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Icon name="Flag" size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <button onClick={() => go({ name: 'profile', username: r.user })}
                        className="font-700 text-sm hover:text-purple-400 transition-colors">{r.user}</button>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{r.reason}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-600 ${statusColor[r.status]}`}>
                        {statusLabel[r.status]}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">{r.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-white/5 rounded-xl px-3 py-2 mt-2">«{r.text}»</p>
                  </div>
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2 mt-3 ml-14">
                    <button onClick={() => resolveReport(r.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-600 hover:bg-green-500/30 transition-colors">
                      <Icon name="Check" size={13} /> Закрыть жалобу
                    </button>
                    <button onClick={() => banUser(r.user)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-600 hover:bg-red-500/30 transition-colors">
                      <Icon name="Ban" size={13} /> Заблокировать
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* === USERS === */}
        {tab === 'users' && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">{users.length} участников на форуме</p>
            {users.map(u => (
              <div key={u.name} className="forum-card rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => go({ name: 'profile', username: u.name })}
                      className="font-600 text-sm hover:text-purple-400 transition-colors">{u.name}</button>
                    <span className="text-xs text-muted-foreground">{u.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-600 ${statusColor[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{u.posts} постов · с {u.joined}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {u.status === 'banned' ? (
                    <button onClick={() => unbanUser(u.name)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-600 hover:bg-green-500/30 transition-colors">
                      <Icon name="UserCheck" size={12} /> Разбан
                    </button>
                  ) : (
                    <button onClick={() => banUser(u.name)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-600 hover:bg-red-500/30 transition-colors">
                      <Icon name="Ban" size={12} /> Бан
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === BANNED WORDS === */}
        {tab === 'banned' && (
          <div className="space-y-5">
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-4 flex items-center gap-2">
                <Icon name="ShieldX" size={16} className="text-red-400" />
                Стоп-слова автомодерации
              </h3>
              <div className="flex gap-2 mb-5">
                <input
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addWord()}
                  placeholder="Добавить слово..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500/60 transition-colors"
                />
                <button onClick={addWord}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-600 hover:opacity-90 transition-opacity">
                  <Icon name="Plus" size={15} /> Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {bannedWords.map(w => (
                  <div key={w} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <Icon name="X" size={12} className="text-red-500" />
                    {w}
                    <button onClick={() => removeWord(w)} className="ml-1 hover:text-white transition-colors">
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-3 flex items-center gap-2">
                <Icon name="Bot" size={16} className="text-purple-400" />
                Правила автомодерации
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { rule: 'Стоп-слова', desc: 'Блокирует посты с запрещёнными словами до публикации', active: true },
                  { rule: 'Анти-спам ссылки', desc: 'Блокирует >2 ссылок в одном сообщении', active: true },
                  { rule: 'Минимум символов', desc: 'Минимум 3 символа в сообщении', active: true },
                  { rule: 'Капслок', desc: 'Предупреждение при >50% заглавных букв', active: false },
                  { rule: 'Дубликаты', desc: 'Блокирует одинаковые сообщения подряд', active: false },
                ].map(item => (
                  <div key={item.rule} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${item.active ? 'bg-green-400' : 'bg-white/20'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-600 text-sm">{item.rule}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-muted-foreground'}`}>
                      {item.active ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === SETTINGS === */}
        {tab === 'settings' && (
          <div className="space-y-4">
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-4 flex items-center gap-2">
                <Icon name="Settings" size={16} className="text-purple-400" />
                Настройки форума
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Название форума', value: 'МегаФорум 2025', type: 'text' },
                  { label: 'Описание', value: 'Лучший форум рунета', type: 'text' },
                  { label: 'Email администратора', value: 'admin@forum.ru', type: 'email' },
                  { label: 'Макс. длина поста', value: '5000', type: 'number' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-muted-foreground mb-1.5">{f.label}</label>
                    <input defaultValue={f.value} type={f.type}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-purple-500/60 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-4 flex items-center gap-2">
                <Icon name="Toggle" size={16} className="text-cyan-400" />
                Переключатели
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Регистрация открыта',        on: true },
                  { label: 'Модерация перед публикацией', on: false },
                  { label: 'Разрешить гостевые просмотры', on: true },
                  { label: 'Email-уведомления',           on: true },
                  { label: 'Технические работы',          on: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-sm">{s.label}</span>
                    <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${s.on ? 'bg-purple-500' : 'bg-white/20'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${s.on ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => showToast('Настройки сохранены!')}
              className="w-full py-3 rounded-2xl rainbow-bg text-white font-700 text-sm hover:opacity-90 transition-opacity">
              Сохранить настройки
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
