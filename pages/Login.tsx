import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { SparklesIcon } from '../components/icons';

const Login: React.FC = () => {
  const { authError, setAuthError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setAuthError(null); // Clear previous errors before starting
    setIsSigningIn(true);
    try {
      // Use signInWithPopup for a self-contained auth flow.
      await auth.signInWithPopup(googleProvider);
      // onAuthStateChanged in AuthContext will handle the user state update.
    } catch (err: any) {
      console.error("Firebase sign-in error:", err);
      if (err.code === 'auth/operation-not-supported-in-this-environment') {
        setAuthError('Sign-in with Google is not supported in this environment. Try opening the app in a new tab.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please try again.');
      } else {
        setAuthError("An error occurred during sign-in. Please try again.");
      }
    } finally {
        setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-zinc-200">
      <div className="text-center p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold text-zinc-100 mb-2">Welcome to the AI Dashboard</h1>
        <p className="text-zinc-400 mb-8">Sign in to access your suite of AI-powered tools.</p>
        
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors disabled:bg-emerald-800 disabled:cursor-wait"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.012,35.19,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          {isSigningIn ? 'Signing In...' : 'Sign in with Google'}
        </button>
        
        {authError && <p className="text-red-400 mt-4">{authError}</p>}
      </div>
    </div>
  );
};

export default Login;