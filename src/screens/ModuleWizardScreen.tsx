import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ModuleWizardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isEditing = id && id !== 'new';
  const isNewModule = id === 'new';

  const handleBack = () => {
    navigate('/home');
  };

  const handleSave = () => {
    // TODO: Implement save logic
    alert('Save functionality will be implemented later');
    navigate('/home');
  };

  return (
    <div className="wizard-screen">
      <div className="wizard-header">
        <button className="btn btn-outline" onClick={handleBack}>
          ← Back
        </button>
        <h1>{isEditing ? 'Edit Module' : 'Create New Module'}</h1>
      </div>

      <div className="card">
        <div className="wizard-content">
          <div className="form-group">
            <label className="form-label">Module Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter module name..."
              defaultValue={isEditing ? 'Human Anatomy' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Module Code</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., ANAT101"
              defaultValue={isEditing ? 'ANAT101' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Credits</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="6"
              defaultValue={isEditing ? '6' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="1"
              defaultValue={isEditing ? '1' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Period</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="1"
              defaultValue={isEditing ? '1' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows={4}
              placeholder="Enter module description..."
              defaultValue={isEditing ? 'Introduction to human anatomy covering all major body systems.' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Learning Objectives</label>
            <textarea 
              className="form-input" 
              rows={3}
              placeholder="Enter learning objectives (one per line)..."
              defaultValue={isEditing ? 'Understand basic anatomical terminology\nIdentify major organ systems\nAnalyze anatomical relationships' : ''}
            />
          </div>

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={handleBack}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {isEditing ? 'Update Module' : 'Create Module'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleWizardScreen; 