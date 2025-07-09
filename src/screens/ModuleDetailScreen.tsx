import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { mockModuleDetails, deleteModule } from '../data/mockData';

interface ModuleDetailScreenProps {
  user: User | null;
}

type TabType = 'overview' | 'competencies' | 'appendices';

const ModuleDetailScreen: React.FC<ModuleDetailScreenProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const module = id ? mockModuleDetails[id] : null;

  if (!module) {
    return (
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <div className="detail-card">
          <p>Module not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      deleteModule(id!);
      alert('Module deleted successfully!');
      navigate('/');
    }
  };

  const handleDownload = (appendix: { fileName: string; url: string }) => {
    // create temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = appendix.url;
    link.download = appendix.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content overview-tab">
            <div className="module-header-info">
              <h1>{module.name}</h1>
              <span className="credits-badge">{module.credits} {module.creditType || 'EC'}</span>
            </div>
            
            <div className="module-description">
              <p>{module.description}</p>
            </div>

            {module.chapters && module.chapters.length > 0 && (
              <>
                <div className="contents-box">
                  <h3>Contents</h3>
                  <ol>
                    {module.chapters.map((chapter) => (
                      <li key={chapter.id}>
                        {chapter.title}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="chapters-content">
                  {module.chapters.map((chapter) => (
                    <div key={chapter.id} className="chapter-section">
                      <h3>{chapter.number}. {chapter.title}</h3>
                      <p>{chapter.content}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      
      case 'competencies':
        return (
          <div className="tab-content competencies-tab">
            <div className="competencies-matrix">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Analysis</th>
                    <th>Advise</th>
                    <th>Design</th>
                    <th>Realise</th>
                    <th>Manage & Control</th>
                  </tr>
                </thead>
                <tbody>
                  {['User Interaction', 'Organisational processes', 'Infrastructure', 'Software', 'Hardware-interfacing'].map((domain) => (
                    <tr key={domain}>
                      <td className="domain-label">{domain}</td>
                      {['Analysis', 'Advise', 'Design', 'Realise', 'Manage & Control'].map((category) => {
                        const competencies = module.competencies?.filter(
                          (c) => c.domain === domain && c.category === category
                        ) || [];
                        
                        return (
                          <td key={category} className="competency-cell">
                            {competencies.map((comp) => (
                              <div key={comp.id} className="competency-item">
                                <span className="competency-text">{comp.text}</span>
                                <span className="competency-level">(Level {comp.level})</span>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'appendices':
        return (
          <div className="tab-content appendices-tab">
            <div className="appendices-list">
              {module.appendices && module.appendices.length > 0 ? (
                module.appendices.map((appendix) => (
                  <div key={appendix.id} className="appendix-item" onClick={() => handleDownload(appendix)}>
                    <div className="file-icon">📄</div>
                    <span className="file-name">{appendix.fileName}</span>
                  </div>
                ))
              ) : (
                <p className="no-appendices">No appendices available for this module.</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        ← Back
      </button>
      
      <div className="detail-card">
        <div className="detail-header">
          <h2>Module Detail: {module.name}</h2>
          <div className="header-actions">
            {user?.role === 'admin' && (
              <>
                <button 
                  onClick={() => navigate(`/module/edit/${module.id}`)}
                  className="btn btn-primary"
                >
                  Edit Module
                </button>
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete Module
                </button>
              </>
            )}
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs-nav">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'competencies' ? 'active' : ''}`}
              onClick={() => setActiveTab('competencies')}
            >
              Competencies
            </button>
            <button
              className={`tab-button ${activeTab === 'appendices' ? 'active' : ''}`}
              onClick={() => setActiveTab('appendices')}
            >
              Appendices
            </button>
          </div>
          
          <div className="tab-panel">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailScreen;