import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chapter, Competency, Appendix } from '../types';
import { mockModuleDetails, addModule, updateModule } from '../data/mockData';
import { useHboiCompetencies } from '../hooks/useHboiCompetencies';

type WizardStep = 'basics' | 'chapters' | 'competencies' | 'appendices';

interface FormData {
  name: string;
  code: string;
  credits: string;
  curriculumType: string;
  description: string;
  chapters: Chapter[];
  competencies: Competency[];
  appendices: Appendix[];
}

const ModuleWizardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competencyLanguage, setCompetencyLanguage] = useState<'en' | 'nl'>('en');
  const { competencies: hboiCompetencies, loading: competenciesLoading, error: competenciesError } = useHboiCompetencies(competencyLanguage);
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [visitedSteps, setVisitedSteps] = useState<Set<WizardStep>>(new Set<WizardStep>(['basics']));
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    credits: '',
    curriculumType: '',
    description: '',
    chapters: [],
    competencies: [],
    appendices: []
  });

  const [chapterForm, setChapterForm] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (id) {
      const module = mockModuleDetails[id];
      if (module) {
        setFormData({
          name: module.name,
          code: module.code,
          credits: module.credits.toString(),
          curriculumType: module.curriculumType || '',
          description: module.description || '',
          chapters: module.chapters || [],
          competencies: module.competencies || [],
          appendices: module.appendices || []
        });
      }
    }
  }, [id]);

  // expand categories and activities when searching
  useEffect(() => {
    if (searchTerm && hboiCompetencies) {
      const newExpandedCategories: Record<string, boolean> = {};
      const newExpandedActivities: Record<string, boolean> = {};
      
      // check each domain for matching competencies
      Object.entries(hboiCompetencies).forEach(([domain, domainCompetencies]) => {
        // group by activity
        const activitiesByDomain = domainCompetencies.reduce((acc, comp) => {
          if (!acc[comp.category]) {
            acc[comp.category] = [];
          }
          acc[comp.category].push(comp);
          return acc;
        }, {} as Record<string, Competency[]>);
        
        // check each activity for matches
        Object.entries(activitiesByDomain).forEach(([activity, activityCompetencies]) => {
          const hasMatch = activityCompetencies.some(c => 
            c.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !formData.competencies.find(selected => selected.id === c.id)
          );
          
          if (hasMatch) {
            newExpandedCategories[domain] = true;
            newExpandedActivities[`${domain}-${activity}`] = true;
          }
        });
      });
      
      setExpandedCategories(newExpandedCategories);
      setExpandedActivities(newExpandedActivities);
    }
  }, [searchTerm, hboiCompetencies, formData.competencies]);

  const steps: WizardStep[] = ['basics', 'chapters', 'competencies', 'appendices'];
  const stepTitles = {
    basics: 'Basics',
    chapters: 'Chapters',
    competencies: 'Competencies',
    appendices: 'Appendices'
  };

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set(Array.from(prev).concat(nextStep)));
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleStepClick = (step: WizardStep) => {
    // allow navigation to any step
    const stepIndex = steps.indexOf(step);
    setCurrentStep(step);
    // mark all steps up to this one as visited
    const stepsToMark = steps.slice(0, stepIndex + 1);
    setVisitedSteps(new Set(stepsToMark));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddChapter = () => {
    if (chapterForm.title && chapterForm.content) {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        number: formData.chapters.length + 1,
        title: chapterForm.title,
        content: chapterForm.content
      };
      setFormData(prev => ({
        ...prev,
        chapters: [...prev.chapters, newChapter]
      }));
      setChapterForm({ title: '', content: '' });
      setShowChapterModal(false);
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterForm({
      title: chapter.title,
      content: chapter.content
    });
    setShowChapterModal(true);
  };

  const handleUpdateChapter = () => {
    if (editingChapter && chapterForm.title && chapterForm.content) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.id === editingChapter.id
            ? { ...ch, title: chapterForm.title, content: chapterForm.content }
            : ch
        )
      }));
      setChapterForm({ title: '', content: '' });
      setEditingChapter(null);
      setShowChapterModal(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters
        .filter(ch => ch.id !== chapterId)
        .map((ch, index) => ({ ...ch, number: index + 1 }))
    }));
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...formData.chapters];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newChapters.length) {
      [newChapters[index], newChapters[newIndex]] = [newChapters[newIndex], newChapters[index]];
      // Update chapter numbers
      newChapters.forEach((ch, idx) => {
        ch.number = idx + 1;
      });
      setFormData(prev => ({ ...prev, chapters: newChapters }));
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleActivity = (activityKey: string) => {
    setExpandedActivities(prev => ({
      ...prev,
      [activityKey]: !prev[activityKey]
    }));
  };

  const handleAddCompetency = (competency: Competency) => {
    if (!formData.competencies.find(c => c.id === competency.id)) {
      setFormData(prev => ({
        ...prev,
        competencies: [...prev.competencies, competency]
      }));
    }
  };

  const handleRemoveCompetency = (competencyId: string) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.filter(c => c.id !== competencyId)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAppendices: Appendix[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        fileName: file.name,
        fileType: file.type.split('/')[1] || 'unknown',
        fileSize: file.size,
        url: URL.createObjectURL(file) 
      }));
      setFormData(prev => ({
        ...prev,
        appendices: [...prev.appendices, ...newAppendices]
      }));
    }
  };

  const handleRemoveAppendix = (appendixId: string) => {
    setFormData(prev => ({
      ...prev,
      appendices: prev.appendices.filter(a => a.id !== appendixId)
    }));
  };

  const handleSubmit = () => {
    const moduleData = {
      name: formData.name,
      code: formData.code,
      credits: parseInt(formData.credits) || 0,
      creditType: 'EC' as const,
      curriculumType: formData.curriculumType,
      description: formData.description,
      chapters: formData.chapters,
      competencies: formData.competencies,
      appendices: formData.appendices,
      period: 1,
      year: 1,
      curriculumId: '1',
      learningObjectives: [],
      assessmentMethods: [],
      prerequisites: []
    };
    
    if (id) {
      updateModule(id, moduleData);
    } else {
      addModule(moduleData);
    }
    
    alert(`Module ${id ? 'updated' : 'created'} successfully!`);
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <div className="wizard-step-content">
            <div className="form-group">
              <label>Module Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>Module Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>ECs</label>
              <input
                type="text"
                className="form-control"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>Curriculum/Type</label>
              <input
                type="text"
                className="form-control"
                value={formData.curriculumType}
                onChange={(e) => handleInputChange('curriculumType', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter module description..."
              />
            </div>
          </div>
        );

      case 'chapters':
        return (
          <div className="wizard-step-content">
            <div className="chapters-section">
              <div className="section-header">
                <h3>Chapters</h3>
                <button className="btn btn-primary" onClick={() => setShowChapterModal(true)}>
                  Add Chapter
                </button>
              </div>
              
              <div className="chapters-list">
                {formData.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="chapter-item">
                    <div className="drag-handle">☰</div>
                    <div className="chapter-info">
                      <span className="chapter-title">Chapter {chapter.number}: {chapter.title}</span>
                    </div>
                    <div className="chapter-actions">
                      {index > 0 && (
                        <button
                          className="move-btn"
                          onClick={() => moveChapter(index, 'up')}
                          title="Move up"
                        >
                          ↑
                        </button>
                      )}
                      {index < formData.chapters.length - 1 && (
                        <button
                          className="move-btn"
                          onClick={() => moveChapter(index, 'down')}
                          title="Move down"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        className="icon-btn"
                        onClick={() => handleEditChapter(chapter)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteChapter(chapter.id)}
                        title="Delete"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
                {formData.chapters.length === 0 && (
                  <p className="empty-message">No chapters added yet.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'competencies':
        if (competenciesLoading) {
          return (
            <div className="wizard-step-content competencies-step">
              <div className="loading-message">
                <div className="spinner"></div>
                <p>Loading competencies from HBO-i API...</p>
                <p style={{ fontSize: '14px', color: '#6c757d' }}>This may take a few seconds</p>
              </div>
            </div>
          );
        }
        
        if (competenciesError) {
          return (
            <div className="wizard-step-content competencies-step">
              <div className="error-message">
                <p>Error loading competencies: {competenciesError}</p>
                <p>Using fallback data...</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="wizard-step-content competencies-step">
            <div className="competencies-layout">
              <div className="competencies-selection">
                <div className="competencies-header">
                  <h3>Available Competencies (HBO-i)</h3>
                  <div className="language-toggle">
                    <button
                      className={`lang-btn ${competencyLanguage === 'en' ? 'active' : ''}`}
                      onClick={() => setCompetencyLanguage('en')}
                    >
                      EN
                    </button>
                    <button
                      className={`lang-btn ${competencyLanguage === 'nl' ? 'active' : ''}`}
                      onClick={() => setCompetencyLanguage('nl')}
                    >
                      NL
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search competencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="competencies-tree">
                  {Object.entries(hboiCompetencies).map(([domain, domainCompetencies]) => {
                    // group competencies by activity within this domain
                    const activitiesByDomain = domainCompetencies.reduce((acc, comp) => {
                      if (!acc[comp.category]) {
                        acc[comp.category] = [];
                      }
                      acc[comp.category].push(comp);
                      return acc;
                    }, {} as Record<string, Competency[]>);

                    return (
                      <div key={domain} className="domain-group">
                        <div
                          className="domain-header"
                          onClick={() => toggleCategory(domain)}
                        >
                          <span className="toggle-icon">
                            {expandedCategories[domain] ? '▼' : '▶'}
                          </span>
                          <span className="domain-name">{domain.toUpperCase()}</span>
                        </div>
                        
                        {expandedCategories[domain] && (
                          <div className="domain-content">
                            {Object.entries(activitiesByDomain).map(([activity, activityCompetencies]) => {
                              const activityKey = `${domain}-${activity}`;
                              const filteredCompetencies = activityCompetencies.filter(c => 
                                c.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                !formData.competencies.find(selected => selected.id === c.id)
                              );
                              
                              // only show activity if it has matching competencies
                              if (filteredCompetencies.length === 0) return null;
                              
                              return (
                                <div key={activityKey} className="activity-group">
                                  <div
                                    className="activity-header"
                                    onClick={() => toggleActivity(activityKey)}
                                  >
                                    <span className="toggle-icon">
                                      {expandedActivities[activityKey] ? '▼' : '▶'}
                                    </span>
                                    <span className="activity-name">{activity}</span>
                                    <span className="competency-count">({filteredCompetencies.length})</span>
                                  </div>
                                  
                                  {expandedActivities[activityKey] && (
                                    <div className="competency-list">
                                      {filteredCompetencies.map(competency => (
                                        <div
                                          key={competency.id}
                                          className="competency-card"
                                          onClick={() => handleAddCompetency(competency)}
                                        >
                                          <div className="competency-content">
                                            <span className="competency-text">{competency.text}</span>
                                            <span className="competency-meta">
                                              Level {competency.level}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="competencies-selected">
                <h3>Selected Competencies</h3>
                <div className="selected-list">
                  {formData.competencies.map(competency => (
                    <div key={competency.id} className="selected-competency">
                      <div className="competency-info">
                        <span className="competency-text">{competency.text}</span>
                        <span className="competency-meta">
                          {competency.domain} - {competency.category} - Level {competency.level}
                        </span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveCompetency(competency.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.competencies.length === 0 && (
                    <p className="empty-message">No competencies selected yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'appendices':
        return (
          <div className="wizard-step-content">
            <div className="appendices-section">
              <h3>Appendices</h3>
              
              <div className="upload-area">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <span>Click to upload files</span>
                </label>
              </div>
              
              <div className="appendices-list">
                {formData.appendices.map(appendix => (
                  <div key={appendix.id} className="appendix-item-wizard">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{appendix.fileName}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveAppendix(appendix.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.appendices.length === 0 && (
                  <p className="empty-message">No files uploaded yet.</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>Module Wizard (Step {steps.indexOf(currentStep) + 1} - {stepTitles[currentStep]})</h2>
      </div>
      
      <div className="wizard-body">
        <h1 className="wizard-title">Module Creation Wizard</h1>
        
        <div className="wizard-progress">
          {steps.map((step, index) => {
            const isVisited = visitedSteps.has(step);
            const isCurrent = currentStep === step;
            
            return (
              <div
                key={step}
                className={`progress-step ${
                  isVisited || index <= steps.indexOf(currentStep) ? 'active' : ''
                } ${isCurrent ? 'current' : ''} clickable`}
                onClick={() => handleStepClick(step)}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{stepTitles[step]}</div>
              </div>
            );
          })}
        </div>
        
        <div className="wizard-content">
          {renderStepContent()}
        </div>
        
        <div className="wizard-actions">
          {currentStep !== 'basics' && (
            <button className="btn btn-secondary" onClick={handlePreviousStep}>
              Previous
            </button>
          )}
          {currentStep !== 'appendices' ? (
            <button className="btn btn-primary" onClick={handleNextStep}>
              Next
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              {id ? 'Update Module' : 'Create Module'}
            </button>
          )}
        </div>
      </div>
      
      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="modal-overlay" onClick={() => setShowChapterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingChapter ? 'Edit Chapter' : 'New Chapter'}</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Chapter Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={`Chapter ${formData.chapters.length + 1}:...`}
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  className="form-control"
                  rows={8}
                  value={chapterForm.content}
                  onChange={(e) => setChapterForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter chapter content..."
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-warning"
                onClick={() => {
                  setShowChapterModal(false);
                  setEditingChapter(null);
                  setChapterForm({ title: '', content: '' });
                }}
              >
                Discard
              </button>
              <button
                className="btn btn-primary"
                onClick={editingChapter ? handleUpdateChapter : handleAddChapter}
              >
                {editingChapter ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleWizardScreen;