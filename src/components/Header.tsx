import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/globals.css';

interface HeaderProps {
  isAuthenticated: boolean;
  userRole?: 'admin' | 'student' | 'guest';
  userName?: string;
  onLogout?: () => void;
  onAdminLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userRole, userName, onLogout, onAdminLogin }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo">
            Curriculum Online
          </Link>

          <nav>
            <ul className="nav-links">
              {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/home" className={isActive('/home') || isActive('/') ? 'active' : ''}>
                        Home
                      </Link>
                    </li>
                    {userRole === 'admin' && (
                        <li className="user-info">
                          <span className="user-name">Welcome, {userName || 'Admin'}</span>
                        </li>
                    )}
                    {userRole === 'admin' && onLogout && (
                        <li>
                          <button className="nav-btn btn-logout" onClick={onLogout}>
                            Logout
                          </button>
                        </li>
                    )}
                    {userRole === 'guest' && (
                        <li className="user-info">
                          <span className="user-name">Guest User</span>
                        </li>
                    )}
                    {userRole === 'guest' && onAdminLogin && (
                        <li>
                          <button className="nav-btn btn-admin-login" onClick={onAdminLogin}>
                            Admin Login
                          </button>
                        </li>
                    )}
                  </>
              ) : (
                  <li>
                    <Link to="/login" className={isActive('/login')}>
                      Login
                    </Link>
                  </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
  );
};

export default Header;