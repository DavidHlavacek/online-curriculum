import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/globals.css';

interface HeaderProps {
  isAuthenticated: boolean;
  userRole?: 'admin' | 'student' | 'guest';
  onLogout?: () => void;
  onAdminLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userRole, onLogout, onAdminLogin }) => {
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
                {userRole === 'admin' && onLogout && (
                  <li>
                    <button className="btn btn-outline" onClick={onLogout}>
                      Logout
                    </button>
                  </li>
                )}
                {userRole === 'guest' && onAdminLogin && (
                  <li>
                    <button className="btn btn-primary" onClick={onAdminLogin}>
                      Admin Login
                    </button>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/about" className={isActive('/about')}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={isActive('/login')}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 