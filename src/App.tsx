import { useState } from 'react';
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

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'home' });
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen mesh-bg font-golos">
      {page.name === 'home'     && <ForumHome go={go} />}
      {page.name === 'category' && <ForumCategory page={page} go={go} />}
      {page.name === 'topic'    && <ForumTopic page={page} go={go} />}
      {page.name === 'profile'  && <ForumProfile page={page} go={go} />}
      {page.name === 'new'      && <ForumNew go={go} />}
      {page.name === 'admin'    && <AdminPanel go={go} />}
      {page.name === 'tutorial' && <Tutorial go={go} />}
    </div>
  );
}
