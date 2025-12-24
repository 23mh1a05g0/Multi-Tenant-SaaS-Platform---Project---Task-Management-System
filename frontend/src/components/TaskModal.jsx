import { useState } from 'react';
import api from '../services/api';

const TaskModal = ({ projectId, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return alert('Title is required');
    }

    try {
      setLoading(true);

      await api.post(`/projects/${projectId}/tasks`, {
        title: form.title,
        description: form.description,
        priority: form.priority
      });

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#eee', padding: 20 }}>
      <h3>Add Task</h3>

      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
