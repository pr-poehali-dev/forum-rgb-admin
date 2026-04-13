import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { AppProps } from '@/App';

type Tab = 'dashboard' | 'topics' | 'users' | 'reports' | 'banned' | 'settings';

const statusColor: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-500/20',
  banned: 'text-red-400 bg-red-400/10 border-red-500/20',
  warned: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20',
  muted:  'text-orange-400 bg-orange-400/10 border-orange-500/20',
  pending:    'text-orange-400 bg-orange-400/10 border-orange-500/20',
  resolved:   'text-green-400 bg-green-400/10 border-green-500/20',
  dismissed:  'text-gray-400 bg-gray-400/10 border-gray-500/20',
};
const statusLabel: Record<string, string> = {
  active: 'Активен', banned: 'Бан', warned: 'Предупреждён', muted: 'Мут',
  pending: 'Ожидает', resolved: 'Закрыта', dismissed: 'Отклонена',
};

export default function AdminPanel({ go, store }: AppProps) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [newWord, setNewWord] = useState('');
  const [toast, setToast] = useState('');
  const [confirmClear, setConfirmClear] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: 'Участник' as const });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const pendingReports = store.reports.filter(r => r.status === 'pending').length;

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Дашборд',   icon: 'LayoutDashboard' },
    { id: 'topics',    label: 'Темы',       icon: 'MessageSquare', badge: store.topics.length },
    { id: 'users',     label: 'Участники',  icon: 'Users',         badge: store.users.length },
    { id: 'reports',   label: 'Жалобы',     icon: 'Flag',          badge: pendingReports },
    { id: 'banned',    label: 'Стоп-слова', icon: 'ShieldX' },
    { id: 'settings',  label: 'Настройки',  icon: 'Settings' },
  ];

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} store={store} />

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-600 backdrop-blur-xl flex items-center gap-2 animate-scale-in">
          <Icon name="CheckCircle" size={16} /> {toast}
        </div>
      )}

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="gradient-border rounded-3xl p-6 max-w-sm w-full mx-4 bg-card">
            <div className="text-3xl mb-3 text-center">⚠️</div>
            <h3 className="font-700 text-lg text-center mb-2">Подтвердите действие</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">{confirmClear}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmClear(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-500 hover:bg-white/10 transition-colors">
                Отмена
              </button>
              <button onClick={() => {
                if (confirmClear.includes('темы')) { store.clearTopics(); showToast('Все темы удалены'); }
                if (confirmClear.includes('жалобы')) { store.clearReports(); showToast('Все жалобы удалены'); }
                if (confirmClear.includes('участников')) { /* нельзя удалить всех */ showToast('Выполнено'); }
                setConfirmClear(null);
              }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-700 hover:opacity-90 transition-opacity">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl rgb-logo flex items-center justify-center text-2xl rgb-glow shrink-0">🛡️</div>
          <div>
            <h1 className="font-montserrat font-900 text-3xl rainbow-text">ПАНЕЛЬ АДМИНИСТРАТОРА</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 admin-live inline-block" />
              Система работает · Модерация активна
              {store.maintenanceMode && <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-600 ml-2">⚙️ Тех. работы</span>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 whitespace-nowrap transition-all ${
                tab === t.id ? 'rainbow-bg text-white shadow-lg' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
              }`}>
              <Icon name={t.icon as 'Flag'} size={15} />
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-700 leading-none ${
                  tab === t.id ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
                }`}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* === DASHBOARD === */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Всего тем',    value: store.topics.length,                              icon: 'MessageSquare', color: 'from-purple-500 to-pink-500' },
                { label: 'Участников',   value: store.users.length,                               icon: 'Users',         color: 'from-cyan-400 to-blue-600' },
                { label: 'Сообщений',    value: store.posts.filter(p => !p.deleted).length,       icon: 'Zap',           color: 'from-green-400 to-emerald-600' },
                { label: 'Жалоб',        value: pendingReports,                                   icon: 'Flag',          color: 'from-red-500 to-orange-500' },
                { label: 'Заблок.',      value: store.users.filter(u => u.status === 'banned').length, icon: 'Ban',      color: 'from-orange-500 to-yellow-500' },
                { label: 'Стоп-слов',   value: store.bannedWords.length,                          icon: 'ShieldX',       color: 'from-pink-500 to-rose-600' },
              ].map((s, i) => (
                <div key={s.label} className={`gradient-border rounded-2xl p-4 animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <Icon name={s.icon as 'Zap'} size={18} className="text-white" />
                  </div>
                  <div className="font-montserrat font-900 text-3xl rainbow-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-700 mb-4 flex items-center gap-2">
                <Icon name="Zap" size={16} className="text-yellow-400" /> Быстрые действия
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Все темы', icon: 'MessageSquare', action: () => setTab('topics'), color: 'from-purple-500 to-pink-500' },
                  { label: 'Жалобы',   icon: 'Flag',          action: () => setTab('reports'), color: 'from-red-500 to-orange-500' },
                  { label: 'Участники',icon: 'Users',          action: () => setTab('users'),   color: 'from-cyan-400 to-blue-600' },
                  { label: 'Стоп-слова', icon: 'ShieldX',     action: () => setTab('banned'),  color: 'from-green-400 to-emerald-500' },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-purple-500/30">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                      <Icon name={a.icon as 'Flag'} size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-600">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="gradient-border rounded-2xl p-4">
                <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
                  <Icon name="Shield" size={15} className="text-purple-400" /> Состояние модерации
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Автомодерация',       on: true },
                    { label: 'Стоп-слова',          on: true },
                    { label: 'Анти-спам ссылки',    on: true },
                    { label: 'Регистрация',         on: store.registrationOpen },
                    { label: 'Тех. работы',         on: store.maintenanceMode },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-600 ${s.on ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-muted-foreground'}`}>
                        {s.on ? 'ВКЛ' : 'ВЫКЛ'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gradient-border rounded-2xl p-4">
                <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 admin-live inline-block" /> Активность
                </h3>
                {store.topics.length === 0 && store.users.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">Активности пока нет</div>
                ) : (
                  <div className="space-y-2 text-xs font-mono">
                    {store.topics.slice(0, 3).map(t => (
                      <div key={t.id} className="flex gap-2 bg-white/3 rounded-lg px-2 py-1.5">
                        <span className="text-muted-foreground shrink-0">{t.time}</span>
                        <span className="text-green-400">✅ Новая тема: «{t.title.slice(0, 30)}…»</span>
                      </div>
                    ))}
                    {store.reports.slice(0, 2).map(r => (
                      <div key={r.id} className="flex gap-2 bg-white/3 rounded-lg px-2 py-1.5">
                        <span className="text-muted-foreground shrink-0">{r.time}</span>
                        <span className="text-red-400">⚠️ Жалоба на {r.user}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === TOPICS === */}
        {tab === 'topics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Всего тем: {store.topics.length}</p>
              {store.topics.length > 0 && (
                <button onClick={() => setConfirmClear('Удалить все темы и сообщения? Это действие нельзя отменить.')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-700 hover:bg-red-500/30 transition-colors">
                  <Icon name="Trash2" size={14} /> Очистить все темы
                </button>
              )}
            </div>
            {store.topics.length === 0 ? (
              <div className="gradient-border rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">📭</div>
                <div className="font-600 mb-1">Тем нет</div>
                <div className="text-sm text-muted-foreground">Форум пока пустой</div>
              </div>
            ) : (
              <div className="space-y-2">
                {store.topics.map(t => (
                  <div key={t.id} className="forum-card rounded-2xl px-5 py-4 flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-500 text-sm leading-snug">{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t.author} · {t.time} · {t.replies} отв.</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { store.pinTopic(t.id); showToast(t.tag === 'pinned' ? 'Откреплено' : 'Закреплено'); }}
                        className={`p-2 rounded-lg transition-colors ${t.tag === 'pinned' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}>
                        <Icon name="Pin" size={14} />
                      </button>
                      <button onClick={() => go({ name: 'topic', id: t.id, title: t.title, category: t.category })}
                        className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors">
                        <Icon name="Eye" size={14} />
                      </button>
                      <button onClick={() => { store.deleteTopic(t.id); showToast('Тема удалена'); }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === USERS === */}
        {tab === 'users' && (
          <div className="space-y-4">
            {/* Add user */}
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 text-sm mb-3 flex items-center gap-2">
                <Icon name="UserPlus" size={15} className="text-green-400" /> Добавить участника
              </h3>
              <div className="flex gap-2">
                <input value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                  placeholder="Имя пользователя..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500/60 transition-colors" />
                <button onClick={() => {
                  if (!newUser.name.trim()) return;
                  store.addUser({ name: newUser.name.trim(), role: 'Участник', posts: 0, status: 'active', joined: '2025', online: false, warns: 0 });
                  setNewUser({ name: '', role: 'Участник' });
                  showToast(`Участник ${newUser.name} добавлен`);
                }}
                  className="px-5 py-2.5 rounded-xl rainbow-bg text-white text-sm font-700 hover:opacity-90 transition-opacity">
                  Добавить
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{store.users.length} участников</p>

            {store.users.length === 0 ? (
              <div className="gradient-border rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">👥</div>
                <div className="font-600 mb-1">Участников нет</div>
                <div className="text-sm text-muted-foreground">Добавьте первого участника выше</div>
              </div>
            ) : (
              <div className="space-y-2">
                {store.users.map(u => (
                  <div key={u.name} className="forum-card rounded-2xl px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => go({ name: 'profile', username: u.name })}
                          className="font-600 text-sm hover:text-purple-400 transition-colors">{u.name}</button>
                        <span className="text-xs text-muted-foreground">{u.role}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-600 ${statusColor[u.status]}`}>
                          {statusLabel[u.status]}
                        </span>
                        {u.warns > 0 && <span className="text-xs text-yellow-400">⚠️ {u.warns} пред.</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{u.posts} постов · с {u.joined}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { store.warnUser(u.name); showToast(`⚠️ Предупреждение выдано ${u.name}`); }}
                        className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors" title="Предупреждение">
                        <Icon name="AlertTriangle" size={13} />
                      </button>
                      {u.status === 'muted'
                        ? <button onClick={() => { store.setUserStatus(u.name, 'active'); showToast(`${u.name} размьючен`); }}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Снять мут">
                            <Icon name="MicOff" size={13} />
                          </button>
                        : <button onClick={() => { store.setUserStatus(u.name, 'muted'); showToast(`${u.name} замьючен`); }}
                            className="p-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors" title="Мут">
                            <Icon name="MicOff" size={13} />
                          </button>
                      }
                      {u.status === 'banned'
                        ? <button onClick={() => { store.setUserStatus(u.name, 'active'); showToast(`${u.name} разблокирован`); }}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Разбан">
                            <Icon name="UserCheck" size={13} />
                          </button>
                        : <button onClick={() => { store.setUserStatus(u.name, 'banned'); showToast(`🚫 ${u.name} заблокирован`); }}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Бан">
                            <Icon name="Ban" size={13} />
                          </button>
                      }
                      <button onClick={() => { store.deleteUser(u.name); showToast(`${u.name} удалён`); }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Удалить">
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === REPORTS === */}
        {tab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{pendingReports} ожидают · {store.reports.length} всего</p>
              {store.reports.length > 0 && (
                <button onClick={() => setConfirmClear('Удалить все жалобы?')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-700 hover:bg-red-500/30 transition-colors">
                  <Icon name="Trash2" size={14} /> Очистить всё
                </button>
              )}
            </div>
            {store.reports.length === 0 ? (
              <div className="gradient-border rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-600 mb-1">Жалоб нет</div>
                <div className="text-sm text-muted-foreground">Форум чистый!</div>
              </div>
            ) : (
              store.reports.map(r => (
                <div key={r.id} className={`forum-card rounded-2xl p-5 ${r.status !== 'pending' ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                      <Icon name="Flag" size={16} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => go({ name: 'profile', username: r.user })}
                          className="font-700 text-sm hover:text-purple-400 transition-colors">{r.user}</button>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{r.reason}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-600 ${statusColor[r.status]}`}>
                          {statusLabel[r.status]}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{r.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 bg-white/5 rounded-xl px-3 py-2">«{r.text}»</p>
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => { store.resolveReport(r.id); showToast('Жалоба закрыта'); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-600 hover:bg-green-500/30 transition-colors">
                        <Icon name="Check" size={13} /> Закрыть
                      </button>
                      <button onClick={() => { store.setUserStatus(r.user, 'warned'); store.resolveReport(r.id); showToast(`⚠️ ${r.user} предупреждён`); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-600 hover:bg-yellow-500/30 transition-colors">
                        <Icon name="AlertTriangle" size={13} /> Предупредить
                      </button>
                      <button onClick={() => { store.setUserStatus(r.user, 'banned'); store.resolveReport(r.id); showToast(`🚫 ${r.user} заблокирован`); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-600 hover:bg-red-500/30 transition-colors">
                        <Icon name="Ban" size={13} /> Забанить
                      </button>
                      <button onClick={() => { store.dismissReport(r.id); showToast('Жалоба отклонена'); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground text-xs font-600 hover:bg-white/10 transition-colors ml-auto">
                        <Icon name="X" size={13} /> Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* === BANNED WORDS === */}
        {tab === 'banned' && (
          <div className="space-y-5">
            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-600 mb-4 flex items-center gap-2">
                <Icon name="ShieldX" size={16} className="text-red-400" /> Стоп-слова автомодерации
              </h3>
              <div className="flex gap-2 mb-5">
                <input value={newWord} onChange={e => setNewWord(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { store.addBannedWord(newWord); showToast(`«${newWord}» добавлено`); setNewWord(''); }}}
                  placeholder="Добавить слово..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500/60 transition-colors" />
                <button onClick={() => { if (!newWord.trim()) return; store.addBannedWord(newWord); showToast(`«${newWord}» добавлено`); setNewWord(''); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl rainbow-bg text-white text-sm font-700 hover:opacity-90 transition-opacity">
                  <Icon name="Plus" size={15} /> Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {store.bannedWords.map(w => (
                  <div key={w} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <Icon name="ShieldX" size={12} />
                    {w}
                    <button onClick={() => { store.removeBannedWord(w); showToast(`«${w}» удалено`); }}
                      className="hover:text-white transition-colors ml-1">
                      <Icon name="X" size={12} />
                    </button>
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
              <h3 className="font-700 mb-4 flex items-center gap-2">
                <Icon name="Toggle" size={16} className="text-cyan-400" /> Управление форумом
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Регистрация открыта',   val: store.registrationOpen,  toggle: () => { store.setRegistration(!store.registrationOpen); showToast('Сохранено'); } },
                  { label: 'Режим тех. работ',       val: store.maintenanceMode,   toggle: () => { store.setMaintenance(!store.maintenanceMode); showToast('Сохранено'); } },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-sm">{s.label}</span>
                    <button onClick={s.toggle}
                      className={`w-12 h-6 rounded-full relative transition-all ${s.val ? 'bg-purple-500' : 'bg-white/20'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${s.val ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-5">
              <h3 className="font-700 mb-4 flex items-center gap-2">
                <Icon name="Trash2" size={16} className="text-red-400" /> Опасная зона
              </h3>
              <div className="space-y-3">
                <button onClick={() => setConfirmClear('Удалить все темы и сообщения форума? Это действие нельзя отменить.')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-600 hover:bg-red-500/20 transition-colors">
                  <Icon name="Trash2" size={16} /> Удалить все темы ({store.topics.length})
                </button>
                <button onClick={() => setConfirmClear('Удалить все жалобы?')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-600 hover:bg-orange-500/20 transition-colors">
                  <Icon name="Flag" size={16} /> Очистить все жалобы ({store.reports.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
