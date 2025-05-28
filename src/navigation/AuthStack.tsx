import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GetStartedScreen from '../screens/GetStartedScreen';

interface AuthStackProps {
  onLogin: (role: 'admin' | 'guest') => void;
}

const AuthStack: React.FC<AuthStackProps> = ({ onLogin }) => {
  return (
    <Routes>
      <Route path="/" element={<GetStartedScreen onLogin={onLogin} />} />
      <Route path="/login" element={<GetStartedScreen onLogin={onLogin} />} />
      <Route path="/get-started" element={<GetStartedScreen onLogin={onLogin} />} />
    </Routes>
  );
};

export default AuthStack; 