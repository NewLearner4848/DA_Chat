import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../services/firebase';
import { ArrowLeftOnRectangleIcon } from '../icons';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Sign out error', error);
        }
    };

    return (
        <header className="flex-shrink-0 bg-zinc-900/70 backdrop-blur-sm border-b border-zinc-700/50">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold text-zinc-100">{title}</h1>
                
                {user && (
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
                             <img 
                                src={user.photoURL || undefined} 
                                alt="User menu" 
                                className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-offset-zinc-900 ring-emerald-500"
                            />
                        </button>
                        {isMenuOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-1 z-10"
                                onMouseLeave={() => setIsMenuOpen(false)}
                            >
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;