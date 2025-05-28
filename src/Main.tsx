import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AuthStack from './navigation/AuthStack';
import HomeStack from './navigation/HomeStack';
import { User } from './types';

const Main: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: 'admin' | 'guest') => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: role === 'admin' ? 'admin@nhlstenden.com' : 'guest@example.com',
      role: role,
      name: role === 'admin' ? 'Admin User' : 'Guest User'
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAdminLogin = () => {
    const adminUser: User = {
      id: `admin_${Date.now()}`,
      email: 'admin@nhlstenden.com',
      role: 'admin',
      name: 'Admin User'
    };
    
    setUser(adminUser);
    setIsAuthenticated(true);
  };

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