// ===== ТИПЫ =====

export interface Topic {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  tag: 'hot' | 'new' | 'trending' | 'pinned';
  time: string;
}

export interface Post {
  id: string;
  topicId: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  likes: number;
  text: string;
  deleted?: boolean;
}

export interface ForumUser {
  name: string;
  role: 'Администратор' | 'Модератор' | 'Старожил' | 'Участник';
  posts: number;
  status: 'active' | 'banned' | 'warned' | 'muted';
  joined: string;
  online: boolean;
  warns: number;
}

export interface Report {
  id: string;
  user: string;
  text: string;
  reason: string;
  time: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

// ===== РАЗДЕЛЫ =====

export const CATEGORIES = [
  { id: 'general', emoji: '💬', title: 'Общение',      desc: 'Обо всём на свете',        color: 'from-purple-500 to-pink-500' },
  { id: 'tech',    emoji: '⚡', title: 'Технологии',   desc: 'Гаджеты, ПО, IT',           color: 'from-cyan-400 to-blue-600' },
  { id: 'games',   emoji: '🎮', title: 'Игры',         desc: 'Обзоры, гайды, новости',    color: 'from-green-400 to-emerald-600' },
  { id: 'music',   emoji: '🎵', title: 'Музыка',       desc: 'Исполнители и треки',        color: 'from-orange-400 to-red-500' },
  { id: 'movies',  emoji: '🎬', title: 'Кино',         desc: 'Фильмы и сериалы',           color: 'from-yellow-400 to-orange-500' },
  { id: 'sport',   emoji: '⚽', title: 'Спорт',        desc: 'Матчи, команды, события',   color: 'from-pink-400 to-rose-600' },
  { id: 'travel',  emoji: '✈️', title: 'Путешествия', desc: 'Страны, маршруты, советы',  color: 'from-teal-400 to-cyan-600' },
  { id: 'food',    emoji: '🍕', title: 'Еда',          desc: 'Рецепты и рестораны',        color: 'from-amber-400 to-yellow-600' },
];

// ===== МОДЕРАЦИЯ =====

export const DEFAULT_BANNED_WORDS = ['спам', 'казино', 'заработок', 'кредит', 'виагра', 'xxx', 'порно'];

export function moderateText(text: string, banned = DEFAULT_BANNED_WORDS): { ok: boolean; reason?: string } {
  const lower = text.toLowerCase();
  for (const w of banned) {
    if (lower.includes(w)) return { ok: false, reason: `Запрещённое слово: «${w}»` };
  }
  if (text.trim().length < 3) return { ok: false, reason: 'Слишком короткое сообщение' };
  const links = (text.match(/https?:\/\//g) || []).length;
  if (links > 2) return { ok: false, reason: 'Слишком много ссылок — похоже на спам' };
  return { ok: true };
}
