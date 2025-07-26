import React from 'react';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Loader from './components/Loader';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900">
        <Loader />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
};

export default App;
