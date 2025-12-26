import { useState } from 'react';
import api from '../services/api';
import '../styles/modal.css';

const TaskModal = ({ projectId, task, onClose }) => {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium'
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title) return alert('Title required');

    if (task) {
      await api.put(`/tasks/${task.id}`, form);
    } else {
      await api.post(`/projects/${projectId}/tasks`, form);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{task ? 'Edit Task' : 'Add Task'}</h3>

        <form onSubmit={submit}>
          <input
            placeholder="Task title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            rows="3"
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

export default TaskModal;