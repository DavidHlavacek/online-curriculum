import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface ModuleDetailScreenProps {
  user: User | null;
}

// Mock module data
const mockModuleDetails = {
  '1': {
    id: '1',
    name: 'Human Anatomy',
    code: 'ANAT101',
    credits: 6,
    period: 1,
    year: 1,
    description: 'Introduction to human anatomy covering all major body systems.',
    learningObjectives: [
      'Understand basic anatomical terminology',
      'Identify major organ systems',
      'Analyze anatomical relationships'
    ],
    assessmentMethods: ['Written Exam (60%)', 'Practical Exam (40%)'],
    prerequisites: ['None'],
    competencies: ['Scientific Knowledge', 'Critical Analysis']
  },
  '2': {
    id: '2',
    name: 'Software Engineering',
    code: 'SE201',
    credits: 7,
    period: 2,
    year: 2,
    description: 'Comprehensive course on software development methodologies and practices.',
    learningObjectives: [
      'Master software development lifecycle',
      'Apply design patterns',
      'Implement testing strategies'
    ],
    assessmentMethods: ['Project (70%)', 'Written Exam (30%)'],
    prerequisites: ['Programming Fundamentals'],
    competencies: ['Technical Skills', 'Problem Solving', 'Project Management']
  }
};

const ModuleDetailScreen: React.FC<ModuleDetailScreenProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const module = id ? mockModuleDetails[id as keyof typeof mockModuleDetails] : null;

  const handleEdit = () => {
    navigate(`/module/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (!module) {
    return (
      <div className="card">
        <h1>Module Not Found</h1>
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
            Edit Module
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{module.name}</h1>
          <p>Code: {module.code} | {module.credits} EC | Year {module.year}, Period {module.period}</p>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{module.description}</p>
          </div>

          <div className="detail-section">
            <h3>Learning Objectives</h3>
            <ul className="objectives-list">
              {module.learningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Assessment Methods</h3>
            <div className="assessment-list">
              {module.assessmentMethods.map((method, index) => (
                <div key={index} className="assessment-item">
                  {method}
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Prerequisites</h3>
            <div className="prerequisites-list">
              {module.prerequisites.map((prerequisite, index) => (
                <span key={index} className="prerequisite-tag">
                  {prerequisite}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Competencies</h3>
            <div className="competencies-list">
              {module.competencies.map((competency, index) => (
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

export default ModuleDetailScreen; 