import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Module, Curriculum } from '../types';
import { 
  getCurriculumById, 
  addCurriculum, 
  updateCurriculum, 
  getAvailableModules,
  updateModule 
} from '../data/mockData';

type WizardStep = 'basics' | 'scheduling' | 'review';

interface FormData {
  name: string;
  year: string;
  description: string;
  duration: string;
  totalCredits: string;
}

interface ModuleSchedule {
  moduleId: string;
  year: number;
  startPeriod: number;
  endPeriod: number;
}

interface SchedulingModalData {
  module: Module | null;
  year: number;
  startPeriod: number;
  endPeriod: number;
}

const CurriculumWizardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [visitedSteps, setVisitedSteps] = useState<Set<WizardStep>>(new Set<WizardStep>(['basics']));
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [scheduledModules, setScheduledModules] = useState<ModuleSchedule[]>([]);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingModalData, setSchedulingModalData] = useState<SchedulingModalData>({
    module: null,
    year: 1,
    startPeriod: 1,
    endPeriod: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedModule, setDraggedModule] = useState<Module | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    year: new Date().getFullYear().toString(),
    description: '',
    duration: '4',
    totalCredits: '240'
  });

  useEffect(() => {
    // load available modules
    const modules = getAvailableModules();
    setAvailableModules(modules);
    
    // load existing curriculum data if editing
    if (isEditing && id) {
      const curriculum = getCurriculumById(id);
      if (curriculum) {
        setFormData({
          name: curriculum.name,
          year: curriculum.year.toString(),
          description: curriculum.description || '',
          duration: curriculum.duration.toString(),
          totalCredits: (curriculum.totalCredits || 240).toString()
        });
        
        // load scheduled modules from localStorage if available
        const storedSchedule = localStorage.getItem(`curriculum-schedule-${id}`);
        if (storedSchedule) {
          const scheduleData = JSON.parse(storedSchedule);
          const scheduled: ModuleSchedule[] = scheduleData.map((s: any) => ({
            moduleId: s.moduleId,
            year: s.year,
            startPeriod: s.startPeriod,
            endPeriod: s.endPeriod
          }));
          setScheduledModules(scheduled);
        } else {
          // fallback to single period for existing modules
          const scheduled: ModuleSchedule[] = curriculum.modules.map(m => ({
            moduleId: m.id,
            year: m.year,
            startPeriod: m.period,
            endPeriod: m.period 
          }));
          setScheduledModules(scheduled);
        }
      }
    }
  }, [id, isEditing]);

  const steps: WizardStep[] = ['basics', 'scheduling', 'review'];
  const stepTitles = {
    basics: 'Basics',
    scheduling: 'Scheduling',
    review: 'Review & Publish'
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
    const stepIndex = steps.indexOf(step);
    setCurrentStep(step);
    const stepsToMark = steps.slice(0, stepIndex + 1);
    setVisitedSteps(new Set(stepsToMark));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleClick = (module: Module) => {
    setSchedulingModalData({
      module,
      year: 1,
      startPeriod: 1,
      endPeriod: 1
    });
    setShowSchedulingModal(true);
  };

  const handleScheduleModule = () => {
    if (schedulingModalData.module) {
      const newSchedule: ModuleSchedule = {
        moduleId: schedulingModalData.module.id,
        year: schedulingModalData.year,
        startPeriod: schedulingModalData.startPeriod,
        endPeriod: schedulingModalData.endPeriod
      };
      
      setScheduledModules(prev => [...prev, newSchedule]);
      setShowSchedulingModal(false);
      setSchedulingModalData({
        module: null,
        year: 1,
        startPeriod: 1,
        endPeriod: 1
      });
    }
  };

  const handleRemoveScheduledModule = (moduleId: string) => {
    setScheduledModules(prev => prev.filter(s => s.moduleId !== moduleId));
  };

  const handleDragStart = (e: React.DragEvent, module: Module) => {
    setDraggedModule(module);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, year: number, period: number) => {
    e.preventDefault();
    if (draggedModule) {
      setSchedulingModalData({
        module: draggedModule,
        year,
        startPeriod: period,
        endPeriod: period
      });
      setShowSchedulingModal(true);
      setDraggedModule(null);
    }
  };


  const calculateTotalCredits = () => {
    return scheduledModules.reduce((total, schedule) => {
      const module = availableModules.find(m => m.id === schedule.moduleId);
      return total + (module?.credits || 0);
    }, 0);
  };

  const handleSubmit = () => {
    const curriculumData: Omit<Curriculum, 'id'> = {
      name: formData.name,
      year: parseInt(formData.year),
      description: formData.description,
      duration: parseInt(formData.duration),
      totalCredits: parseInt(formData.totalCredits),
      modules: []
    };
    
    let curriculumId: string;
    
    if (isEditing && id) {
      updateCurriculum(id, curriculumData);
      curriculumId = id;
    } else {
      const newCurriculum = addCurriculum(curriculumData);
      curriculumId = newCurriculum.id;
    }
    
    // update modules with their scheduled positions
    scheduledModules.forEach(schedule => {
      const module = availableModules.find(m => m.id === schedule.moduleId);
      if (module) {
        updateModule(module.id, {
          curriculumId,
          year: schedule.year,
          period: schedule.startPeriod
        });
      }
    });
    
    // Save schedule data with period spans to localStorage
    const scheduleData = scheduledModules.map(schedule => {
      const module = availableModules.find(m => m.id === schedule.moduleId);
      return {
        ...schedule,
        module
      };
    });
    localStorage.setItem(`curriculum-schedule-${curriculumId}`, JSON.stringify(scheduleData));
    
    alert(`Curriculum ${isEditing ? 'updated' : 'created'} successfully!`);
    navigate(`/curriculum/${curriculumId}`);
  };

  const filteredModules = availableModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !scheduledModules.some(s => s.moduleId === module.id)
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <div className="wizard-step-content">
            <h2>1. Basics</h2>
            <div className="form-group">
              <label>Curriculum Name:</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <div className="form-group">
              <label>Duration (Years):</label>
              <input
                type="number"
                className="form-control"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </div>
        );

      case 'scheduling':
        return (
          <div className="wizard-step-content scheduling-step">
            <h2>2. Scheduling</h2>
            
            <div className="scheduling-container">
              <div className="modules-sidebar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="available-modules">
                  {filteredModules.map(module => (
                    <div
                      key={module.id}
                      className="module-card draggable"
                      onClick={() => handleModuleClick(module)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, module)}
                    >
                      <div className="module-card-name">{module.name}</div>
                      <div className="module-card-credits">{module.credits} EC</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="curriculum-grid-builder">
                <div className="curriculum-grid">
                  <div className="grid-header">
                    <div className="header-cell"></div>
                    <div className="header-cell">Period 1</div>
                    <div className="header-cell">Period 2</div>
                    <div className="header-cell">Period 3</div>
                    <div className="header-cell">Period 4</div>
                  </div>
                  
                  {Array.from({ length: parseInt(formData.duration) || 4 }, (_, i) => i + 1).map(year => {
                    // group modules by year and create rows
                    const yearModules = scheduledModules.filter(s => s.year === year);
                    
                    // create rows for modules that don't overlap
                    const rows: ModuleSchedule[][] = [];
                    yearModules.forEach(scheduled => {
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
                          const scheduled = row.find(s => 
                            period >= s.startPeriod && period <= s.endPeriod
                          );
                          
                          if (scheduled && period === scheduled.startPeriod) {
                            const module = availableModules.find(m => m.id === scheduled.moduleId);
                            const colspan = scheduled.endPeriod - scheduled.startPeriod + 1;
                            return (
                              <div 
                                key={period} 
                                className="grid-cell-spanned droppable"
                                style={{ gridColumn: `span ${colspan}` }}
                              >
                                {module && (
                                  <div className="module-block-spanned scheduled">
                                    <div className="module-name">{module.name}</div>
                                    <div className="module-credits">{module.credits} EC</div>
                                    {colspan > 1 && (
                                      <div className="module-periods">
                                        Period {scheduled.startPeriod} - {scheduled.endPeriod}
                                      </div>
                                    )}
                                    <button
                                      className="remove-module-btn"
                                      onClick={() => handleRemoveScheduledModule(module.id)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (!scheduled || period < scheduled.startPeriod || period > scheduled.endPeriod) {
                            return (
                              <div 
                                key={period} 
                                className="grid-cell droppable"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, year, period)}
                              ></div>
                            );
                          }
                          // return null for cells that are part of a span
                          return null;
                        })}
                      </div>
                    ));
                  })}
                </div>
                
                <div className="scheduling-info">
                  <p>Click on a module or drag it to a cell to schedule it.</p>
                  <p>Total Credits Scheduled: {calculateTotalCredits()} / {formData.totalCredits} EC</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="wizard-step-content">
            <h2>3. Review & Publish</h2>
            <div className="review-section">
              <h3>Curriculum Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Name:</label>
                  <span>{formData.name}</span>
                </div>
                <div className="summary-item">
                  <label>Year:</label>
                  <span>{formData.year}</span>
                </div>
                <div className="summary-item">
                  <label>Duration:</label>
                  <span>{formData.duration} years</span>
                </div>
                <div className="summary-item">
                  <label>Total Credits:</label>
                  <span>{formData.totalCredits} EC</span>
                </div>
                <div className="summary-item full-width">
                  <label>Description:</label>
                  <span>{formData.description}</span>
                </div>
              </div>
              
              <h3>Scheduled Modules</h3>
              <div className="scheduled-modules-list">
                <p>Total: {scheduledModules.length} modules ({calculateTotalCredits()} EC)</p>
                {scheduledModules.length === 0 ? (
                  <p className="warning-message">No modules scheduled yet. Please go back to the Scheduling step.</p>
                ) : (
                  <ul>
                    {scheduledModules.map(schedule => {
                      const module = availableModules.find(m => m.id === schedule.moduleId);
                      return module ? (
                        <li key={schedule.moduleId}>
                          {module.name} - Year {schedule.year}, Period {schedule.startPeriod}
                          {schedule.endPeriod > schedule.startPeriod && ` to ${schedule.endPeriod}`}
                          ({module.credits} EC)
                        </li>
                      ) : null;
                    })}
                  </ul>
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
        <h2>Curriculum Wizard (Step {steps.indexOf(currentStep) + 1} - {stepTitles[currentStep]})</h2>
      </div>
      
      <div className="wizard-body">
        <h1 className="wizard-title">Curriculum Creation Wizard</h1>
        
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
          {currentStep !== 'review' ? (
            <button className="btn btn-primary" onClick={handleNextStep}>
              Next
            </button>
          ) : (
            <button 
              className="btn btn-success" 
              onClick={handleSubmit}
              disabled={scheduledModules.length === 0}
            >
              {isEditing ? 'Update Curriculum' : 'Create Curriculum'}
            </button>
          )}
        </div>
      </div>
      
      {/* scheduling modal */}
      {showSchedulingModal && schedulingModalData.module && (
        <div className="modal-overlay" onClick={() => setShowSchedulingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Module: {schedulingModalData.module.name}</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Year:</label>
                <select
                  className="form-control"
                  value={schedulingModalData.year}
                  onChange={(e) => setSchedulingModalData(prev => ({
                    ...prev,
                    year: parseInt(e.target.value)
                  }))}
                >
                  {Array.from({ length: parseInt(formData.duration) || 4 }, (_, i) => i + 1).map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>From Period:</label>
                <select
                  className="form-control"
                  value={schedulingModalData.startPeriod}
                  onChange={(e) => {
                    const newStart = parseInt(e.target.value);
                    setSchedulingModalData(prev => ({
                      ...prev,
                      startPeriod: newStart,
                      endPeriod: Math.max(newStart, prev.endPeriod)
                    }));
                  }}
                >
                  {[1, 2, 3, 4].map(period => (
                    <option key={period} value={period}>Period {period}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>To Period:</label>
                <select
                  className="form-control"
                  value={schedulingModalData.endPeriod}
                  onChange={(e) => setSchedulingModalData(prev => ({
                    ...prev,
                    endPeriod: parseInt(e.target.value)
                  }))}
                >
                  {[1, 2, 3, 4]
                    .filter(period => period >= schedulingModalData.startPeriod)
                    .map(period => (
                      <option key={period} value={period}>Period {period}</option>
                    ))
                  }
                </select>
              </div>
              
              <p className="info-message">
                This module will span {schedulingModalData.endPeriod - schedulingModalData.startPeriod + 1} period(s).
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowSchedulingModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleScheduleModule}
              >
                Schedule Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumWizardScreen;