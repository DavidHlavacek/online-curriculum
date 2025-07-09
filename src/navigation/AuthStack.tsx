import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen';
import GetStartedScreen from '../screens/GetStartedScreen';

interface AuthStackProps {
    onLogin: (role: 'admin' | 'guest') => void;
}

const AuthStack: React.FC<AuthStackProps> = ({ onLogin }) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginScreen onLogin={onLogin} />} />
            <Route path="/get-started" element={<GetStartedScreen onLogin={onLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AuthStack;