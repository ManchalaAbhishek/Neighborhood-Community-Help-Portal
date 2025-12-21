import React, { useState } from 'react';
import { Api } from '../services/mockApi';
import { UserRole } from '../types';

interface RegistrationProps {
  onLogin: (user: any) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.RESIDENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Login Logic
        const user = await Api.login(contactInfo);
        onLogin(user);
      } else {
        // Registration Logic
        const user = await Api.register({
          name,
          contact_info: contactInfo,
          location,
          role
        });
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login for testing
  const quickLogin = async (role: UserRole) => {
      setLoading(true);
      setError('');
      try {
        const demoContact = role === UserRole.RESIDENT ? "resident@demo.com" : "helper@demo.com";
        // Try login first
        try {
             const user = await Api.login(demoContact);
             onLogin(user);
             return;
        } catch (e) {
            // If fails, register (first run)
             const demoUser = await Api.register({
                name: role === UserRole.RESIDENT ? "Alice Resident" : "Bob Helper",
                contact_info: demoContact,
                location: "Downtown",
                role: role
            });
            onLogin(demoUser);
        }
      } catch (err) {
          setError("Demo login failed");
          setLoading(false);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
            <span className="material-icons text-5xl text-indigo-600">handshake</span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {isLoginMode ? 'Sign in to Portal' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
                {isLoginMode ? 'Welcome back!' : 'Join the neighborhood network'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Login Mode uses Contact Info as ID */}
            
            {!isLoginMode && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
            )}

            {!isLoginMode && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I want to
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value={UserRole.RESIDENT}>Ask for Help (Resident)</option>
                      <option value={UserRole.HELPER}>Give Help (Helper)</option>
                    </select>
                  </div>
                </div>
            )}
            
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Contact Info {isLoginMode ? '(Email or Phone)' : '(Phone/Email)'}
              </label>
              <div className="mt-1">
                <input
                  id="contact"
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {!isLoginMode && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location (Neighborhood)
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
            )}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Register')}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError('');
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                  {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={() => quickLogin(UserRole.RESIDENT)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Demo Resident
                </button>
              </div>
              <div>
                <button
                   onClick={() => quickLogin(UserRole.HELPER)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Demo Helper
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
                (Demo accounts will be created if they don't exist)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;