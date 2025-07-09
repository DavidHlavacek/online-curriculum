import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthStack from './navigation/AuthStack';
import HomeStack from './navigation/HomeStack';
import { User } from './types';
import { AuthService } from './services/authService';

const Main: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      if (AuthService.isAuthenticated()) {
        const adminUser: User = {
          id: `admin_session`,
          email: 'admin@nhlstenden.com',
          role: 'admin',
          name: 'Admin'
        };
        setUser(adminUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = (role: 'admin' | 'guest') => {
    const newUser: User = {
      id: role === 'admin' ? `admin_${Date.now()}` : `guest_${Date.now()}`,
      email: role === 'admin' ? 'admin@nhlstenden.com' : 'guest@example.com',
      role: role,
      name: role === 'admin' ? 'Admin' : 'Guest User'
    };

    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAdminLogin = () => {
    // Redirect to login screen
    window.location.href = '/login';
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
      <Router>
        <Layout
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onAdminLogin={handleAdminLogin}
        >
          {isAuthenticated ? (
              <HomeStack user={user} />
          ) : (
              <AuthStack onLogin={handleLogin} />
          )}
        </Layout>
      </Router>
  );
};

export default Main;