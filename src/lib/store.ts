import { useState, useCallback } from 'react';
import type { Topic, Post, ForumUser, Report } from './forum-data';
import { DEFAULT_BANNED_WORDS } from './forum-data';

export interface ForumStore {
  topics: Topic[];
  posts: Post[];
  users: ForumUser[];
  reports: Report[];
  bannedWords: string[];
  maintenanceMode: boolean;
  registrationOpen: boolean;
  // actions
  addTopic: (t: Topic) => void;
  deleteTopic: (id: string) => void;
  pinTopic: (id: string) => void;
  addPost: (p: Post) => void;
  deletePost: (id: string) => void;
  addUser: (u: ForumUser) => void;
  banUser: (name: string) => void;
  unbanUser: (name: string) => void;
  warnUser: (name: string) => void;
  muteUser: (name: string) => void;
  deleteUser: (name: string) => void;
  addReport: (r: Report) => void;
  resolveReport: (id: string) => void;
  dismissReport: (id: string) => void;
  addBannedWord: (w: string) => void;
  removeBannedWord: (w: string) => void;
  clearAllTopics: () => void;
  clearAllPosts: () => void;
  setMaintenance: (v: boolean) => void;
  setRegistration: (v: boolean) => void;
}

export function useForumStore(): ForumStore {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<ForumUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedWords, setBannedWords] = useState<string[]>(DEFAULT_BANNED_WORDS);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [registrationOpen, setRegistrationOpenState] = useState(true);

  const addTopic = useCallback((t: Topic) => setTopics(p => [t, ...p]), []);
  const deleteTopic = useCallback((id: string) => setTopics(p => p.filter(t => t.id !== id)), []);
  const pinTopic = useCallback((id: string) => setTopics(p => p.map(t => t.id === id ? { ...t, pinned: !t.pinned, tag: t.pinned ? 'new' : 'pinned' } : t)), []);

  const addPost = useCallback((p: Post) => {
    setPosts(prev => [...prev, p]);
    setTopics(prev => prev.map(t => t.id === p.topicId ? { ...t, replies: t.replies + 1 } : t));
  }, []);
  const deletePost = useCallback((id: string) => setPosts(p => p.map(x => x.id === id ? { ...x, deleted: true } : x)), []);

  const addUser = useCallback((u: ForumUser) => setUsers(p => [u, ...p]), []);
  const banUser = useCallback((name: string) => setUsers(u => u.map(x => x.name === name ? { ...x, status: 'banned' } : x)), []);
  const unbanUser = useCallback((name: string) => setUsers(u => u.map(x => x.name === name ? { ...x, status: 'active' } : x)), []);
  const warnUser = useCallback((name: string) => setUsers(u => u.map(x => x.name === name ? { ...x, warns: x.warns + 1, status: x.warns + 1 >= 3 ? 'banned' : 'warned' } : x)), []);
  const muteUser = useCallback((name: string) => setUsers(u => u.map(x => x.name === name ? { ...x, status: 'muted' } : x)), []);
  const deleteUser = useCallback((name: string) => setUsers(u => u.filter(x => x.name !== name)), []);

  const addReport = useCallback((r: Report) => setReports(p => [r, ...p]), []);
  const resolveReport = useCallback((id: string) => setReports(r => r.map(x => x.id === id ? { ...x, status: 'resolved' } : x)), []);
  const dismissReport = useCallback((id: string) => setReports(r => r.map(x => x.id === id ? { ...x, status: 'dismissed' } : x)), []);

  const addBannedWord = useCallback((w: string) => setBannedWords(p => [...p, w.toLowerCase().trim()]), []);
  const removeBannedWord = useCallback((w: string) => setBannedWords(p => p.filter(x => x !== w)), []);

  const clearAllTopics = useCallback(() => { setTopics([]); setPosts([]); }, []);
  const clearAllPosts = useCallback(() => setPosts([]), []);

  const setMaintenance = useCallback((v: boolean) => setMaintenanceModeState(v), []);
  const setRegistration = useCallback((v: boolean) => setRegistrationOpenState(v), []);

  return {
    topics, posts, users, reports, bannedWords, maintenanceMode, registrationOpen,
    addTopic, deleteTopic, pinTopic,
    addPost, deletePost,
    addUser, banUser, unbanUser, warnUser, muteUser, deleteUser,
    addReport, resolveReport, dismissReport,
    addBannedWord, removeBannedWord,
    clearAllTopics, clearAllPosts,
    setMaintenance, setRegistration,
  };
}
