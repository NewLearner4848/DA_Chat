import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  authError: null,
  setAuthError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // The onAuthStateChanged listener is the primary source of truth for auth state.
    // It fires when the user signs in, signs out, or when the token is refreshed.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthError(null); // Clear errors on successful login
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};