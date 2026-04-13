import { useState } from 'react';
import ForumNav from '@/components/ForumNav';
import Icon from '@/components/ui/icon';
import type { Page } from '@/App';

interface Props { go: (p: Page) => void }

const TAGS = [
  { tag: '[rainbow]текст[/rainbow]',   label: 'Радужный текст',    preview: 'rainbow-text font-700 text-lg',           demo: 'Радужный текст!' },
  { tag: '[rgb]текст[/rgb]',           label: 'RGB мигание',       preview: 'rgb-text font-700 text-lg',               demo: 'RGB мигание!' },
  { tag: '[glow]текст[/glow]',         label: 'Неоновое свечение', preview: 'text-purple-400 text-lg font-700',        demo: '✨ Неон ✨',       glow: true },
  { tag: '[wave]текст[/wave]',         label: 'Волна',             preview: 'rainbow-text font-700 text-lg',           demo: '〰 Волна 〰' },
  { tag: '[fire]текст[/fire]',         label: 'Огонь',             preview: 'text-orange-400 font-700 text-lg',        demo: '🔥 Огонь 🔥' },
  { tag: '[cyber]текст[/cyber]',       label: 'Киберпанк',         preview: 'text-cyan-400 font-mono font-700 text-lg', demo: 'C Y B E R' },
];

const ANIMATION_EXAMPLES = [
  {
    label: 'RGB рамка вокруг текста',
    code: '[rgb-border]Твой текст здесь[/rgb-border]',
    preview: <div className="rgb-border rounded-xl px-4 py-2 text-sm font-600 inline-block">Твой текст здесь</div>,
  },
  {
    label: 'Радужный фон блока',
    code: '[rainbow-bg]Выделенный блок[/rainbow-bg]',
    preview: <div className="rainbow-bg rounded-xl px-4 py-2 text-sm font-700 text-white inline-block">Выделенный блок</div>,
  },
  {
    label: 'Пульсирующий индикатор',
    code: '[live]LIVE[/live]',
    preview: (
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500 admin-live inline-block"></span>
        <span className="text-red-400 font-700 text-sm admin-live">LIVE</span>
      </div>
    ),
  },
  {
    label: 'Неоновое свечение',
    code: '[neon-purple]Светящийся текст[/neon-purple]',
    preview: <span className="text-purple-400 font-700 text-lg glow-purple px-3 py-1 rounded-lg border border-purple-500/30">Светящийся текст</span>,
  },
];

const EMOJI_GROUPS = [
  { label: '🔥 Реакции',     emojis: ['🔥', '💯', '😍', '🤩', '👏', '💪', '🎉', '🚀'] },
  { label: '🌈 Символы',     emojis: ['★', '♦', '♠', '♥', '◆', '▲', '●', '■'] },
  { label: '⚡ Энергия',     emojis: ['⚡', '💥', '✨', '🌟', '💫', '🎆', '🎇', '🌠'] },
  { label: '🎨 Искусство',   emojis: ['🎨', '🖌️', '✏️', '🎭', '🎬', '🎵', '🎸', '🎤'] },
];

type CopiedKey = string | null;

export default function Tutorial({ go }: Props) {
  const [copied, setCopied] = useState<CopiedKey>(null);
  const [activeTab, setActiveTab] = useState<'tags' | 'animations' | 'emoji' | 'tips'>('tags');

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'tags' as const,       label: '🎨 Теги',        },
    { id: 'animations' as const, label: '⚡ Анимации',    },
    { id: 'emoji' as const,      label: '😍 Эмодзи',      },
    { id: 'tips' as const,       label: '💡 Советы',      },
  ];

  return (
    <div className="animate-fade-in">
      <ForumNav go={go} />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="gradient-border rounded-3xl p-8 mb-8 text-center overflow-hidden relative">
          <div className="absolute inset-0 rainbow-bg opacity-10" />
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-float inline-block">🌈</div>
            <h1 className="font-montserrat font-900 text-4xl rainbow-text mb-3">RGB & Анимации</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Руководство по украшению сообщений на форуме — видят <strong className="text-foreground">все участники</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <span className="rainbow-bg text-white text-xs px-3 py-1.5 rounded-full font-600">✓ Работает в темах</span>
              <span className="rainbow-bg text-white text-xs px-3 py-1.5 rounded-full font-600">✓ Видно всем</span>
              <span className="rainbow-bg text-white text-xs px-3 py-1.5 rounded-full font-600">✓ Просто скопируй</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-600 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'rainbow-bg text-white'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* === TAGS === */}
        {activeTab === 'tags' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-5">
              Используй теги в сообщениях — просто скопируй и вставь в свой текст
            </p>
            {TAGS.map(t => (
              <div key={t.tag} className="forum-card rounded-2xl p-5 flex items-center gap-5">
                {/* Preview */}
                <div className="w-36 shrink-0 text-center">
                  <span className={t.preview} style={t.glow ? { textShadow: '0 0 20px rgba(168,85,247,0.8)' } : undefined}>
                    {t.demo}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-600 text-sm mb-1">{t.label}</div>
                  <code className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-cyan-300 block">
                    {t.tag}
                  </code>
                </div>

                <button onClick={() => copy(t.tag, t.tag)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-600 transition-all ${
                    copied === t.tag
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground'
                  }`}>
                  <Icon name={copied === t.tag ? 'Check' : 'Copy'} size={13} />
                  {copied === t.tag ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* === ANIMATIONS === */}
        {activeTab === 'animations' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-5">
              Готовые блоки для вставки — скопируй и измени текст на свой
            </p>
            {ANIMATION_EXAMPLES.map((ex, i) => (
              <div key={i} className="forum-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-600 text-sm">{ex.label}</div>
                  <button onClick={() => copy(ex.code, `anim-${i}`)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-600 transition-all ${
                      copied === `anim-${i}`
                        ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground'
                    }`}>
                    <Icon name={copied === `anim-${i}` ? 'Check' : 'Copy'} size={13} />
                    {copied === `anim-${i}` ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>

                {/* Live preview */}
                <div className="bg-black/30 rounded-xl px-4 py-4 border border-white/5 flex items-center justify-center min-h-[60px]">
                  {ex.preview}
                </div>

                {/* Code */}
                <code className="block text-xs bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl text-cyan-300">
                  {ex.code}
                </code>
              </div>
            ))}

            {/* Full example */}
            <div className="gradient-border rounded-2xl p-5">
              <div className="font-600 text-sm mb-3 flex items-center gap-2">
                <Icon name="Star" size={15} className="text-yellow-400" />
                Пример полного поста с эффектами
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 text-sm space-y-2">
                <div className="rainbow-text font-900 text-xl">🎉 ОБНОВЛЕНИЕ ВЫШЛО!</div>
                <div className="text-foreground/80">Друзья, только что вышел крупный апдейт игры!</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 admin-live inline-block"></span>
                  <span className="text-red-400 font-700 admin-live text-sm">ТОЛЬКО ЧТО</span>
                </div>
                <div className="rainbow-bg rounded-xl px-3 py-2 text-white font-600 text-sm inline-block mt-1">
                  🚀 Скорее обновляйтесь!
                </div>
              </div>
              <button onClick={() => copy('[rainbow]🎉 ОБНОВЛЕНИЕ ВЫШЛО![/rainbow]\nДрузья, только что вышел крупный апдейт!\n[live]ТОЛЬКО ЧТО[/live]\n[rainbow-bg]🚀 Скорее обновляйтесь![/rainbow-bg]', 'full')}
                className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-600 transition-all ${
                  copied === 'full'
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground'
                }`}>
                <Icon name={copied === 'full' ? 'Check' : 'Copy'} size={13} />
                {copied === 'full' ? 'Скопировано!' : 'Скопировать весь пример'}
              </button>
            </div>
          </div>
        )}

        {/* === EMOJI === */}
        {activeTab === 'emoji' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Клик — скопировать эмодзи</p>
            {EMOJI_GROUPS.map(g => (
              <div key={g.label} className="forum-card rounded-2xl p-5">
                <div className="font-600 text-sm mb-3">{g.label}</div>
                <div className="flex flex-wrap gap-2">
                  {g.emojis.map(e => (
                    <button key={e} onClick={() => copy(e, e)}
                      className={`w-12 h-12 text-2xl rounded-xl hover:bg-white/10 transition-all flex items-center justify-center ${
                        copied === e ? 'bg-green-500/20 border border-green-500/40 scale-110' : 'bg-white/5 border border-white/10'
                      }`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === TIPS === */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {[
              {
                icon: '🎯', title: 'Не перебарщивай',
                text: 'Один-два эффекта на пост — это стильно. Весь текст в радуге — сложно читать. Используй RGB для акцентов, заголовков, важных моментов.',
              },
              {
                icon: '👁️', title: 'Все видят твои эффекты',
                text: 'Эффекты отображаются у всех участников форума в реальном времени. Хочешь удивить — добавь rainbow или rgb-border в начало поста.',
              },
              {
                icon: '⚡', title: 'Горячие клавиши',
                text: 'При написании ответа нажми Ctrl+B для жирного, Ctrl+I для курсива. Теги можно вставлять прямо в текст в любом месте.',
              },
              {
                icon: '🚫', title: 'Автомодерация',
                text: 'Запрещённые слова и спам блокируются автоматически до публикации. Эффекты и анимации не нарушают правила — используй смело.',
              },
              {
                icon: '📱', title: 'Работает на телефоне',
                text: 'Все RGB-эффекты и анимации корректно отображаются на мобильных устройствах. Проверено на iOS и Android.',
              },
            ].map(tip => (
              <div key={tip.title} className="forum-card rounded-2xl p-5 flex gap-4">
                <div className="text-3xl shrink-0">{tip.icon}</div>
                <div>
                  <div className="font-700 text-sm mb-1">{tip.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <button onClick={() => go({ name: 'new' })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl rainbow-bg text-white font-700 text-base hover:opacity-90 transition-opacity">
            <Icon name="Sparkles" size={18} />
            Создать тему с эффектами
          </button>
        </div>
      </div>
    </div>
  );
}
