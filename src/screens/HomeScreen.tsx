import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { mockCurricula, mockModules } from '../data/mockData';

interface HomeScreenProps {
  user: User | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
  const [curriculaSearch, setCurriculaSearch] = useState('');
  const [modulesSearch, setModulesSearch] = useState('');

  const filteredCurricula = mockCurricula.filter(curriculum =>
    curriculum.name.toLowerCase().includes(curriculaSearch.toLowerCase())
  );

  const filteredModules = mockModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(modulesSearch.toLowerCase());
    const matchesCurriculum = selectedCurriculumId ? module.curriculumId === selectedCurriculumId : true;
    return matchesSearch && matchesCurriculum;
  });

  const handleCurriculumClick = (curriculumId: string) => {
    setSelectedCurriculumId(curriculumId === selectedCurriculumId ? null : curriculumId);
  };

  const handleCurriculumDetails = (curriculumId: string) => {
    navigate(`/curriculum/${curriculumId}`);
  };

  const handleModuleClick = (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };

  const handleNewCurriculum = () => {
    navigate('/curriculum/new');
  };

  const handleNewModule = () => {
    navigate('/module/new');
  };

  return (
    <div className="home-container">
      {/* Two Column Layout */}
      <div className="two-column-layout">
        {/* Left Column - Curricula */}
        <div className="column curricula-column">
          <div className="column-header-with-button">
            <div className="column-header-content">
              <h2>Curricula</h2>
              {user?.role === 'admin' && (
                <button className="btn btn-admin-add" onClick={handleNewCurriculum}>
                  + New Curriculum
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search curricula..."
              className="form-input"
              value={curriculaSearch}
              onChange={(e) => setCurriculaSearch(e.target.value)}
            />
          </div>
          
          <div className="items-list">
            {filteredCurricula.map((curriculum) => (
              <div
                key={curriculum.id}
                className={`item-card ${selectedCurriculumId === curriculum.id ? 'selected' : ''}`}
                onClick={() => handleCurriculumClick(curriculum.id)}
              >
                <h3>{curriculum.name}</h3>
                <p>Year: {curriculum.year}</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCurriculumDetails(curriculum.id);
                  }}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Modules */}
        <div className="column modules-column">
          <div className="column-header-with-button">
            <div className="column-header-content">
              <h2>Modules</h2>
              {user?.role === 'admin' && (
                <button className="btn btn-admin-add" onClick={handleNewModule}>
                  + New Module
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search modules..."
              className="form-input"
              value={modulesSearch}
              onChange={(e) => setModulesSearch(e.target.value)}
            />
            {selectedCurriculumId && (
              <p className="filter-info">
                Filtered by: {mockCurricula.find(c => c.id === selectedCurriculumId)?.name}
                <button 
                  className="btn btn-sm btn-outline ml-2"
                  onClick={() => setSelectedCurriculumId(null)}
                >
                  Clear Filter
                </button>
              </p>
            )}
          </div>
          
          <div className="items-list">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="item-card clickable"
                onClick={() => handleModuleClick(module.id)}
              >
                <h3>{module.name}</h3>
                <p>{module.credits} EC</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 