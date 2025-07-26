import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import CodeAssistant from './CodeAssistant';
import Chat from './Chat';
import ImageGenerator from './ImageGenerator';
import PromptLibrary from './PromptLibrary';

const pages: Record<string, { component: React.FC, title: string }> = {
  'code-assistant': { component: CodeAssistant, title: 'Code Assistant' },
  'chat': { component: Chat, title: 'AI Chat' },
  'image-generator': { component: ImageGenerator, title: 'Image Generator' },
  'prompt-library': { component: PromptLibrary, title: 'Prompt Library' },
};

const getActivePage = () => {
    const hash = window.location.hash.replace('#/', '');
    return pages[hash] ? hash : 'code-assistant';
}

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState(getActivePage());

  useEffect(() => {
    const handleHashChange = () => {
        setActivePage(getActivePage());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const ActivePageComponent = pages[activePage].component;

  return (
    <div className="h-screen flex bg-zinc-900 text-zinc-300">
      <Sidebar activePage={activePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pages[activePage].title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ActivePageComponent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
