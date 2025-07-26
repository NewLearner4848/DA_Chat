import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
    CodeBracketIcon, 
    ChatBubbleLeftEllipsisIcon, 
    PhotoIcon, 
    LightBulbIcon, 
    SparklesIcon 
} from '../icons';

interface SidebarProps {
    activePage: string;
}

const navItems = [
    { id: 'code-assistant', name: 'Code Assistant', icon: CodeBracketIcon },
    { id: 'chat', name: 'AI Chat', icon: ChatBubbleLeftEllipsisIcon },
    { id: 'image-generator', name: 'Image Generator', icon: PhotoIcon },
    { id: 'prompt-library', name: 'Prompt Library', icon: LightBulbIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
    const { user } = useAuth();
    
    return (
        <aside className="w-64 bg-zinc-800/50 border-r border-zinc-700/50 flex flex-col p-4">
            <div className="flex items-center gap-3 mb-8">
                <SparklesIcon className="w-8 h-8 text-emerald-400" />
                <h1 className="text-xl font-bold text-zinc-100">AI Dashboard</h1>
            </div>

            <nav className="flex-1">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a 
                                href={`#/${item.id}`}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    activePage === item.id 
                                    ? 'bg-emerald-500/10 text-emerald-300' 
                                    : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto">
                {user && (
                    <div className="flex items-center gap-3 p-2 rounded-md bg-zinc-700/30">
                        <img 
                            src={user.photoURL || undefined} 
                            alt={user.displayName || 'User'} 
                            className="w-9 h-9 rounded-full"
                        />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-zinc-200 truncate">{user.displayName}</p>
                            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
