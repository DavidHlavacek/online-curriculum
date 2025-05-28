import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import CurriculumDetailScreen from '../screens/CurriculumDetailScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import CurriculumWizardScreen from '../screens/CurriculumWizardScreen';
import ModuleWizardScreen from '../screens/ModuleWizardScreen';
import { User } from '../types';

interface HomeStackProps {
  user: User | null;
}

const HomeStack: React.FC<HomeStackProps> = ({ user }) => {
  return (
    <Routes>
      {/* Main Home Screen */}
      <Route path="/" element={<HomeScreen user={user} />} />
      <Route path="/home" element={<HomeScreen user={user} />} />
      
      {/* Detail Screens */}
      <Route path="/curriculum/:id" element={<CurriculumDetailScreen user={user} />} />
      <Route path="/module/:id" element={<ModuleDetailScreen user={user} />} />
      
      {/* Wizard Screens (Admin only) */}
      <Route path="/curriculum/new" element={<CurriculumWizardScreen />} />
      <Route path="/curriculum/edit/:id" element={<CurriculumWizardScreen />} />
      <Route path="/module/new" element={<ModuleWizardScreen />} />
      <Route path="/module/edit/:id" element={<ModuleWizardScreen />} />
    </Routes>
  );
};

export default HomeStack; 