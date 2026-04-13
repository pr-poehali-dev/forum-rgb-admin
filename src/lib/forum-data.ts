export const BANNED_WORDS = ['спам', 'казино', 'заработок', 'кредит', 'виагра', 'xxx', 'порно'];

export function moderateText(text: string): { ok: boolean; reason?: string } {
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) return { ok: false, reason: `Запрещённое слово: «${word}»` };
  }
  if (text.length < 3) return { ok: false, reason: 'Слишком короткое сообщение' };
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) return { ok: false, reason: 'Слишком много ссылок — похоже на спам' };
  return { ok: true };
}

export const CATEGORIES = [
  { id: 'general', emoji: '💬', title: 'Общение', desc: 'Обо всём на свете', topics: 142, color: 'from-purple-500 to-pink-500' },
  { id: 'tech', emoji: '⚡', title: 'Технологии', desc: 'Гаджеты, ПО, IT', topics: 89, color: 'from-cyan-400 to-blue-600' },
  { id: 'games', emoji: '🎮', title: 'Игры', desc: 'Обзоры, гайды, новости', topics: 210, color: 'from-green-400 to-emerald-600' },
  { id: 'music', emoji: '🎵', title: 'Музыка', desc: 'Исполнители и треки', topics: 67, color: 'from-orange-400 to-red-500' },
  { id: 'movies', emoji: '🎬', title: 'Кино', desc: 'Фильмы и сериалы', topics: 95, color: 'from-yellow-400 to-orange-500' },
  { id: 'sport', emoji: '⚽', title: 'Спорт', desc: 'Матчи, команды, события', topics: 78, color: 'from-pink-400 to-rose-600' },
  { id: 'travel', emoji: '✈️', title: 'Путешествия', desc: 'Страны, маршруты, советы', topics: 53, color: 'from-teal-400 to-cyan-600' },
  { id: 'food', emoji: '🍕', title: 'Еда', desc: 'Рецепты и рестораны', topics: 44, color: 'from-amber-400 to-yellow-600' },
];

export const HOT_TOPICS = [
  { id: '1', title: 'Лучшие игры 2025 — итоги года', category: 'games', author: 'GamerPro', replies: 234, views: 5420, tag: 'hot', time: '5 мин назад' },
  { id: '2', title: 'ИИ уже заменяет программистов?', category: 'tech', author: 'TechNerd', replies: 189, views: 3810, tag: 'trending', time: '12 мин назад' },
  { id: '3', title: 'Куда поехать этим летом — топ-10 мест', category: 'travel', author: 'WanderlustK', replies: 97, views: 2100, tag: 'new', time: '1 час назад' },
  { id: '4', title: 'Обсуждаем новый альбом Би-2', category: 'music', author: 'MusicFan88', replies: 56, views: 890, tag: 'new', time: '2 часа назад' },
  { id: '5', title: 'Рецепт идеального рамена дома', category: 'food', author: 'ChefSerg', replies: 43, views: 650, tag: 'trending', time: '3 часа назад' },
];

export const TOPIC_POSTS = [
  {
    id: '1', author: 'GamerPro', avatar: '🎮', role: 'Модератор',
    time: '5 мин назад', likes: 47,
    text: 'Друзья, подводим итоги года! По-моему, лучшая игра 2025 — это однозначно Elden Ring 2. Открытый мир стал ещё больше, боёвка переработана, а история просто взрывает мозг. Что думаете?',
  },
  {
    id: '2', author: 'SkyWalker99', avatar: '🚀', role: 'Старожил',
    time: '8 мин назад', likes: 31,
    text: 'Не согласен! GTA VI уделывает всех по части открытого мира. Уже 400 часов в игре и конца не видно. Плюс мультиплеер на новом уровне.',
  },
  {
    id: '3', author: 'PixelQueen', avatar: '👾', role: 'Участник',
    time: '15 мин назад', likes: 22,
    text: 'Оба варианта топ, но я бы добавила Hollow Knight: Silksong — ждали несколько лет, и наконец-то вышло. Уровень арта просто нереальный.',
  },
  {
    id: '4', author: 'NightOwlDev', avatar: '🦉', role: 'Участник',
    time: '22 мин назад', likes: 15,
    text: 'Инди-сцена в 2025 невероятная. Balatro 2 затягивает похлеще любого ААА. Иногда маленькие команды делают лучше крупных студий.',
  },
];

export const ONLINE_USERS = ['GamerPro', 'TechNerd', 'PixelQueen', 'SkyWalker99', 'MusicFan88', 'WanderlustK'];

export const FORUM_VERSION = '1.0.1';