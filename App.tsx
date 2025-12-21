import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import HelpRequestForm from './pages/HelpRequestForm';
import RequestStatusDetail from './pages/RequestStatusDetail';

// Simple Router implementation since standard Router libs are restricted in some environments or strictly configured
// We will use a simple state-based view switcher for this SPA
type View = 
  | { name: 'LOGIN' }
  | { name: 'DASHBOARD' }
  | { name: 'NEW_REQUEST' }
  | { name: 'REQUEST_DETAIL'; id: string };

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ name: 'LOGIN' });

  // Handle mock persistence of session
  useEffect(() => {
      const savedUser = localStorage.getItem('nchp_session');
      if (savedUser) {
          setUser(JSON.parse(savedUser));
          setView({ name: 'DASHBOARD' });
      }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('nchp_session', JSON.stringify(loggedInUser));
    setView({ name: 'DASHBOARD' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nchp_session');
    setView({ name: 'LOGIN' });
  };

  const navigate = (path: string) => {
      // Mapping path strings to views for the Layout links
      if (path === '/') setView(user ? { name: 'DASHBOARD' } : { name: 'LOGIN' });
      else if (path === '/dashboard') setView({ name: 'DASHBOARD' });
      else if (path === '/requests/new') setView({ name: 'NEW_REQUEST' });
  };

  // Guard: if no user, show login
  if (!user && view.name !== 'LOGIN') {
      setView({ name: 'LOGIN' });
  }

  const renderContent = () => {
    switch (view.name) {
      case 'LOGIN':
        return <Registration onLogin={handleLogin} />;
      
      case 'DASHBOARD':
        return user ? (
            <Dashboard 
                user={user} 
                onSelectRequest={(id) => setView({ name: 'REQUEST_DETAIL', id })} 
            />
        ) : null;
      
      case 'NEW_REQUEST':
        return user && user.role === UserRole.RESIDENT ? (
            <div className="max-w-2xl mx-auto">
                 <HelpRequestForm 
                    user={user} 
                    onSuccess={() => setView({ name: 'DASHBOARD' })}
                    onCancel={() => setView({ name: 'DASHBOARD' })}
                />
            </div>
        ) : (
            <div className="text-center text-red-500">Access Denied</div>
        );

      case 'REQUEST_DETAIL':
        return user ? (
            <RequestStatusDetail 
                requestId={view.id} 
                user={user} 
                onBack={() => setView({ name: 'DASHBOARD' })}
            />
        ) : null;

      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={navigate}
        currentPath={view.name === 'NEW_REQUEST' ? '/requests/new' : '/dashboard'}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;