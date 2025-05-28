import React from 'react';
import Header from './Header';
import { User } from '../types';
import '../styles/globals.css';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  user: User | null;
  onLogout?: () => void;
  onAdminLogin?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, user, onLogout, onAdminLogin }) => {
  return (
    <div className="app-layout">
      <Header 
        isAuthenticated={isAuthenticated} 
        userRole={user?.role}
        onLogout={onLogout}
        onAdminLogin={onAdminLogin}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 