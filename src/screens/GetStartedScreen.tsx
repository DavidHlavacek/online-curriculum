import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GetStartedScreenProps {
  onLogin: (role: 'admin' | 'guest') => void;
}

const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    onLogin('admin');
    navigate('/home');
  };

  const handleGuestContinue = () => {
    onLogin('guest');
    navigate('/home');
  };

  return (
    <div className="flex flex-column align-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header text-center">
          <h1 className="card-title">Welcome to Curriculum Online</h1>
          <p>Choose how you'd like to access the platform</p>
        </div>
        
        <div className="flex flex-column gap-3">
          <button 
            className="btn btn-primary"
            onClick={handleAdminLogin}
          >
            Login as Admin
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={handleGuestContinue}
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="text-center mt-3">
          <p style={{ fontSize: '14px', color: '#666' }}>
            Admin access allows you to edit and manage curriculum content.
            Guest access provides read-only access to view curriculum information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedScreen; 