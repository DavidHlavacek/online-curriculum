import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CurriculumWizardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isEditing = id && id !== 'new';
  const isNewCurriculum = id === 'new';

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
        <h1>{isEditing ? 'Edit Curriculum' : 'Create New Curriculum'}</h1>
      </div>

      <div className="card">
        <div className="wizard-content">
          <div className="form-group">
            <label className="form-label">Curriculum Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter curriculum name..."
              defaultValue={isEditing ? 'Bachelor of Computer Science' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="2024"
              defaultValue={isEditing ? '2024' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows={4}
              placeholder="Enter curriculum description..."
              defaultValue={isEditing ? 'A comprehensive program covering fundamental and advanced topics in computer science.' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., 4 years"
              defaultValue={isEditing ? '4 years' : ''}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Credits</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="240"
              defaultValue={isEditing ? '240' : ''}
            />
          </div>

          <div className="wizard-actions">
            <button className="btn btn-outline" onClick={handleBack}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {isEditing ? 'Update Curriculum' : 'Create Curriculum'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumWizardScreen; 