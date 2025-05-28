import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface CurriculumDetailScreenProps {
  user: User | null;
}

// Mock curriculum data
const mockCurriculumDetails = {
  '1': {
    id: '1',
    name: 'Bachelor of Computer Science',
    year: 2024,
    description: 'A comprehensive program covering fundamental and advanced topics in computer science.',
    duration: '4 years',
    credits: 240,
    modules: ['Human Anatomy', 'Software Engineering', 'Introduction to Psychology'],
    competencies: ['Programming', 'System Design', 'Problem Solving', 'Critical Thinking']
  },
  '2': {
    id: '2',
    name: 'Master of Business Administration',
    year: 2024,
    description: 'Advanced business education focusing on leadership and strategic management.',
    duration: '2 years',
    credits: 120,
    modules: ['Financial Accounting'],
    competencies: ['Leadership', 'Strategic Planning', 'Financial Analysis']
  }
};

const CurriculumDetailScreen: React.FC<CurriculumDetailScreenProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const curriculum = id ? mockCurriculumDetails[id as keyof typeof mockCurriculumDetails] : null;

  const handleEdit = () => {
    navigate(`/curriculum/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (!curriculum) {
    return (
      <div className="card">
        <h1>Curriculum Not Found</h1>
        <button className="btn btn-outline" onClick={handleBack}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="detail-screen">
      <div className="detail-header">
        <button className="btn btn-outline" onClick={handleBack}>
          ← Back to Home
        </button>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit Curriculum
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{curriculum.name}</h1>
          <p>Year: {curriculum.year}</p>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{curriculum.description}</p>
          </div>

          <div className="detail-section">
            <h3>Program Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Duration:</strong> {curriculum.duration}
              </div>
              <div className="info-item">
                <strong>Total Credits:</strong> {curriculum.credits} EC
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Modules ({curriculum.modules.length})</h3>
            <div className="modules-list">
              {curriculum.modules.map((module, index) => (
                <div key={index} className="module-item">
                  {module}
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Competencies</h3>
            <div className="competencies-list">
              {curriculum.competencies.map((competency, index) => (
                <span key={index} className="competency-tag">
                  {competency}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailScreen; 