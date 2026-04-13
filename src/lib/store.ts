import { useState, useCallback } from 'react';
import type { Topic, Post, ForumUser, Report } from './forum-data';
import { DEFAULT_BANNED_WORDS } from './forum-data';

export interface ForumStore {
  topics: Topic[];
  posts: Post[];
  users: ForumUser[];
  reports: Report[];
  bannedWords: string[];
  registrationOpen: boolean;
  maintenanceMode: boolean;
  addTopic: (t: Omit<Topic, 'id' | 'time' | 'replies' | 'views'>) => string;
  deleteTopic: (id: string) => void;
  pinTopic: (id: string) => void;
  clearTopics: () => void;
  addPost: (p: Omit<Post, 'id' | 'time' | 'likes'>) => void;
  deletePost: (id: string) => void;
  clearPosts: () => void;
  addUser: (u: ForumUser) => void;
  setUserStatus: (name: string, status: ForumUser['status']) => void;
  warnUser: (name: string) => void;
  deleteUser: (name: string) => void;
  addReport: (r: Omit<Report, 'id' | 'time'>) => void;
  resolveReport: (id: string) => void;
  dismissReport: (id: string) => void;
  clearReports: () => void;
  addBannedWord: (w: string) => void;
  removeBannedWord: (w: string) => void;
  setRegistration: (v: boolean) => void;
  setMaintenance: (v: boolean) => void;
}

let nextId = 1;
const uid = () => String(nextId++);
const now = () => new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

export function useForumStore(): ForumStore {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<ForumUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedWords, setBannedWords] = useState<string[]>(DEFAULT_BANNED_WORDS);
  const [registrationOpen, setRegOpen] = useState(true);
  const [maintenanceMode, setMainMode] = useState(false);

  const addTopic = useCallback((t: Omit<Topic, 'id' | 'time' | 'replies' | 'views'>) => {
    const id = uid();
    setTopics(prev => [{ ...t, id, time: now(), replies: 0, views: 0 }, ...prev]);
    return id;
  }, []);
  const deleteTopic = useCallback((id: string) => {
    setTopics(p => p.filter(t => t.id !== id));
    setPosts(p => p.filter(x => x.topicId !== id));
  }, []);
  const pinTopic = useCallback((id: string) => {
    setTopics(p => p.map(t => t.id === id ? { ...t, tag: (t.tag === 'pinned' ? 'new' : 'pinned') as Topic['tag'] } : t));
  }, []);
  const clearTopics = useCallback(() => { setTopics([]); setPosts([]); }, []);

  const addPost = useCallback((p: Omit<Post, 'id' | 'time' | 'likes'>) => {
    const post: Post = { ...p, id: uid(), time: now(), likes: 0 };
    setPosts(prev => [...prev, post]);
    setTopics(prev => prev.map(t => t.id === p.topicId ? { ...t, replies: t.replies + 1 } : t));
  }, []);
  const deletePost = useCallback((id: string) => setPosts(p => p.map(x => x.id === id ? { ...x, deleted: true } : x)), []);
  const clearPosts = useCallback(() => setPosts([]), []);

  const addUser = useCallback((u: ForumUser) => setUsers(p => [u, ...p]), []);
  const setUserStatus = useCallback((name: string, status: ForumUser['status']) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, status } : x));
  }, []);
  const warnUser = useCallback((name: string) => {
    setUsers(u => u.map(x => x.name === name
      ? { ...x, warns: x.warns + 1, status: ((x.warns + 1) >= 3 ? 'banned' : 'warned') as ForumUser['status'] }
      : x
    ));
  }, []);
  const deleteUser = useCallback((name: string) => setUsers(u => u.filter(x => x.name !== name)), []);

  const addReport = useCallback((r: Omit<Report, 'id' | 'time'>) => {
    setReports(p => [{ ...r, id: uid(), time: now() }, ...p]);
  }, []);
  const resolveReport = useCallback((id: string) => setReports(r => r.map(x => x.id === id ? { ...x, status: 'resolved' as const } : x)), []);
  const dismissReport = useCallback((id: string) => setReports(r => r.map(x => x.id === id ? { ...x, status: 'dismissed' as const } : x)), []);
  const clearReports = useCallback(() => setReports([]), []);

  const addBannedWord = useCallback((w: string) => setBannedWords(p => [...p, w.toLowerCase().trim()]), []);
  const removeBannedWord = useCallback((w: string) => setBannedWords(p => p.filter(x => x !== w)), []);
  const setRegistration = useCallback((v: boolean) => setRegOpen(v), []);
  const setMaintenance = useCallback((v: boolean) => setMainMode(v), []);

  return {
    topics, posts, users, reports, bannedWords, registrationOpen, maintenanceMode,
    addTopic, deleteTopic, pinTopic, clearTopics,
    addPost, deletePost, clearPosts,
    addUser, setUserStatus, warnUser, deleteUser,
    addReport, resolveReport, dismissReport, clearReports,
    addBannedWord, removeBannedWord,
    setRegistration, setMaintenance,
  };
}
