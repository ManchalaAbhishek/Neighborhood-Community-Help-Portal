import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentPath }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer justify-start" onClick={() => onNavigate('/')}>
            <span className="material-icons mr-2">handshake</span>
            <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">Community Help</h1>
          </div>
          
          <nav className="flex items-center space-x-4 ml-auto">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4 mr-4">
                    {user.role === UserRole.RESIDENT && (
                        <>
                            <button 
                                onClick={() => onNavigate('/requests/new')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPath === '/requests/new' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                            >
                                Request Help
                            </button>
                            <button 
                                onClick={() => onNavigate('/dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPath === '/dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                            >
                                My Requests
                            </button>
                        </>
                    )}
                    {user.role === UserRole.HELPER && (
                         <button 
                            onClick={() => onNavigate('/dashboard')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${currentPath === '/dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                        >
                            Browse Requests
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-2 border-l border-indigo-500 pl-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-indigo-200 uppercase">{user.role}</p>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="p-2 text-indigo-100 hover:text-white"
                        title="Logout"
                    >
                        <span className="material-icons">logout</span>
                    </button>
                </div>
              </>
            ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span className="text-sm text-indigo-100">Welcome, Guest</span>
                </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Neighborhood Community Help Portal
          </div>
      </footer>
    </div>
  );
};

export default Layout;