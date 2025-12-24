import { useState } from 'react';
import api from '../services/api';

const ProjectModal = ({ project, onClose }) => {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setLoading(true);

      if (project) {
        // EDIT project
        await api.put(`/projects/${project.id}`, form);
      } else {
        // CREATE project
        await api.post('/projects', {
          name: form.name,
          description: form.description,
          status: form.status
        });
      }

      // ✅ only close on success
      onClose();

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Failed to save project'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#eee', padding: 20 }}>
      <h3>{project ? 'Edit Project' : 'Create Project'}</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Project Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.status}
          onChange={e =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectModal;
