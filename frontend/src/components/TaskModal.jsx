import { useState } from 'react';
import api from '../services/api';

const TaskModal = ({ projectId, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return alert('Title required');

    await api.post(`/projects/${projectId}/tasks`, form);
    onClose();
  };

  return (
    <div style={{ background: '#eee', padding: 20 }}>
      <h3>Add Task</h3>

      <form onSubmit={submit}>
        <input
          placeholder="Title"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <select
          onChange={e => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Save</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskModal;
