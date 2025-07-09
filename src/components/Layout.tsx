import React from 'react';
import Header from './Header';
import { User } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    user: User | null;
    onLogout?: () => void;
    onAdminLogin?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, user, onLogout, onAdminLogin }) => {
    return (
        <div className="app-container">
            <Header
                isAuthenticated={isAuthenticated}
                userRole={user?.role}
                userName={user?.name}
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