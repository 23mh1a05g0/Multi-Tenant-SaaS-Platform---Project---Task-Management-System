import { useState } from 'react';
import api from '../services/api';
import '../styles/modal.css';

const ProjectModal = ({ project, onClose }) => {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active'
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name) return alert('Project name required');

    if (project) {
      await api.put(`/projects/${project.id}`, form);
    } else {
      await api.post('/projects', form);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{project ? 'Edit Project' : 'Create Project'}</h3>

        <form onSubmit={submit}>
          <input
            placeholder="Project name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
