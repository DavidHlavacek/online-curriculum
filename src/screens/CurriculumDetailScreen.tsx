import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Module } from '../types';
import { getCurriculumById, deleteCurriculum } from '../data/mockData';

interface CurriculumDetailScreenProps {
  user: User | null;
}

type TabType = 'basic' | 'overview';

const CurriculumDetailScreen: React.FC<CurriculumDetailScreenProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const curriculumData = getCurriculumById(id);
      setCurriculum(curriculumData);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Loading curriculum...</p>
        </div>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="detail-container">
        <button onClick={() => navigate('/home')} className="btn btn-secondary">
          ← Back
        </button>
        <div className="detail-card">
          <p>Curriculum not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this curriculum?')) {
      deleteCurriculum(id!);
      alert('Curriculum deleted successfully!');
      navigate('/home');
    }
  };

  // get scheduled modules
  const getScheduledModules = () => {
    const stored = localStorage.getItem(`curriculum-schedule-${id}`);
    if (stored) {
      return JSON.parse(stored);
    }
    // default to single period for existing modules
    return curriculum.modules.map((m: Module) => ({
      moduleId: m.id,
      module: m,
      year: m.year,
      startPeriod: m.period,
      endPeriod: m.period
    }));
  };

  const scheduledModules = getScheduledModules();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="tab-content basic-info-tab">
            <div className="info-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name:</label>
                  <span>{curriculum.name}</span>
                </div>
                <div className="info-item">
                  <label>Year:</label>
                  <span>{curriculum.year}</span>
                </div>
                <div className="info-item">
                  <label>Duration:</label>
                  <span>{curriculum.duration} years</span>
                </div>
                <div className="info-item">
                  <label>Total Credits:</label>
                  <span>{curriculum.totalCredits || 240} EC</span>
                </div>
              </div>
              
              {curriculum.description && (
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{curriculum.description}</p>
                </div>
              )}
              
              <div className="statistics-section">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{curriculum.modules.length}</div>
                    <div className="stat-label">Total Modules</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {curriculum.modules.reduce((sum: number, m: Module) => sum + m.credits, 0)}
                    </div>
                    <div className="stat-label">Allocated Credits</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {(curriculum.totalCredits || 240) - curriculum.modules.reduce((sum: number, m: Module) => sum + m.credits, 0)}
                    </div>
                    <div className="stat-label">Remaining Credits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="tab-content overview-tab">
            <div className="curriculum-grid-container">
              <div className="curriculum-grid">
                <div className="grid-header">
                  <div className="header-cell"></div>
                  <div className="header-cell">Period 1</div>
                  <div className="header-cell">Period 2</div>
                  <div className="header-cell">Period 3</div>
                  <div className="header-cell">Period 4</div>
                </div>
                
                {[1, 2, 3, 4].map(year => {
                  // group modules by year and create rows
                  const yearModules = scheduledModules.filter((s: any) => s.year === year);
                  
                  // create rows for modules that don't overlap
                  const rows: any[][] = [];
                  yearModules.forEach((scheduled: any) => {
                    let placed = false;
                    
                    // try to place in existing row
                    for (let row of rows) {
                      const canPlace = !row.some(existing => 
                        !(scheduled.endPeriod < existing.startPeriod || 
                          scheduled.startPeriod > existing.endPeriod)
                      );
                      if (canPlace) {
                        row.push(scheduled);
                        placed = true;
                        break;
                      }
                    }
                    
                    // create new row if needed
                    if (!placed) {
                      rows.push([scheduled]);
                    }
                  });
                  
                  // render at least one row even if empty
                  if (rows.length === 0) {
                    rows.push([]);
                  }
                  
                  return rows.map((row, rowIndex) => (
                    <div key={`${year}-${rowIndex}`} className="grid-row">
                      {rowIndex === 0 && (
                        <div className="year-label" style={{ gridRow: `span ${rows.length}` }}>
                          Year {year}
                        </div>
                      )}
                      {[1, 2, 3, 4].map(period => {
                        // find module that occupies this period
                        const scheduled = row.find((s: any) => 
                          period >= s.startPeriod && period <= s.endPeriod
                        );
                        
                        if (scheduled && period === scheduled.startPeriod) {
                          const colspan = scheduled.endPeriod - scheduled.startPeriod + 1;
                          return (
                            <div 
                              key={period} 
                              className="grid-cell-spanned"
                              style={{ gridColumn: `span ${colspan}` }}
                            >
                              <div 
                                className="module-block-spanned"
                                onClick={() => navigate(`/module/${scheduled.moduleId}`)}
                              >
                                <div className="module-name">{scheduled.module.name}</div>
                                <div className="module-credits">{scheduled.module.credits} EC</div>
                                {colspan > 1 && (
                                  <div className="module-periods">
                                    Period {scheduled.startPeriod} - {scheduled.endPeriod}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else if (!scheduled || period < scheduled.startPeriod || period > scheduled.endPeriod) {
                          return <div key={period} className="grid-cell"></div>;
                        }
                        // return null for cells that are part of a span
                        return null;
                      })}
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-header-nav">
        <h1>Curriculum Detail: {curriculum.name}</h1>
        <div className="header-actions">
          {user?.role === 'admin' && (
            <>
              <button 
                onClick={() => navigate(`/curriculum/edit/${curriculum.id}`)}
                className="btn btn-primary"
              >
                Edit Curriculum
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete Curriculum
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="tabs-container">
          <div className="tabs-nav">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
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

export default CurriculumDetailScreen;