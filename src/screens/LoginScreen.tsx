import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import '../styles/loginStyles.css';

interface LoginScreenProps {
  onLogin: (role: 'admin' | 'guest') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await AuthService.authenticate(username, password);
      
      if (result.success) {
        onLogin('admin');
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    onLogin('guest');
    navigate('/home');
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality to be implemented');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Welcome to Curriculum Online</h1>
        <p className="login-subtitle">Manage your curricula with ease.</p>
        
        <div className="login-card">
          <form onSubmit={handleAdminLogin}>
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              maxLength={50}
            />
            
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              maxLength={100}
            />
            
            {error && <div className="login-error">{error}</div>}
            
            <button 
              type="submit" 
              className="login-button login-admin"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
          
          <button 
            className="login-link"
            onClick={handleForgotPassword}
          >
            Forgot Password
          </button>
          
          <div className="login-divider"></div>
          
          <button 
            className="login-button login-guest"
            onClick={handleGuestContinue}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;