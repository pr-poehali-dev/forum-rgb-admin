import { useState } from 'react';
import { useForumStore } from './lib/store';
import type { ForumStore } from './lib/store';
import ForumHome from './pages/ForumHome';
import ForumCategory from './pages/ForumCategory';
import ForumTopic from './pages/ForumTopic';
import ForumProfile from './pages/ForumProfile';
import ForumNew from './pages/ForumNew';
import AdminPanel from './pages/AdminPanel';
import Tutorial from './pages/Tutorial';

export type Page =
  | { name: 'home' }
  | { name: 'category'; id: string; title: string; emoji: string }
  | { name: 'topic'; id: string; title: string; category: string }
  | { name: 'profile'; username: string }
  | { name: 'new' }
  | { name: 'admin' }
  | { name: 'tutorial' };

export interface AppProps {
  go: (p: Page) => void;
  store: ForumStore;
}

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'home' });
  const store = useForumStore();
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };
  const props: AppProps = { go, store };

  return (
    <div className="min-h-screen mesh-bg font-golos">
      {page.name === 'home'     && <ForumHome     {...props} />}
      {page.name === 'category' && <ForumCategory  page={page} {...props} />}
      {page.name === 'topic'    && <ForumTopic     page={page} {...props} />}
      {page.name === 'profile'  && <ForumProfile   page={page} {...props} />}
      {page.name === 'new'      && <ForumNew       {...props} />}
      {page.name === 'admin'    && <AdminPanel      {...props} />}
      {page.name === 'tutorial' && <Tutorial        {...props} />}
    </div>
  );
}
