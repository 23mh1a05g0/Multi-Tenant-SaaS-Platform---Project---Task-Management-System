import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await api.get(`/projects/${projectId}`);
    const t = await api.get(`/projects/${projectId}/tasks`);
    setProject(p.data.data);
    setTasks(t.data.data.tasks);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    loadData();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;
    await api.delete(`/tasks/${id}`);
    loadData();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>{project?.name}</h2>
        <p>{project?.description}</p>
        <span>Status: {project?.status}</span>

        <h3>Tasks</h3>
        <button onClick={() => setShowTaskModal(true)}>Add Task</button>

        {tasks.map(t => (
          <div key={t.id} style={{ border: '1px solid #ccc', margin: 10 }}>
            <strong>{t.title}</strong>
            <br />
            Status: {t.status}
            <br />
            Priority: {t.priority}
            <br />
            Assigned: {t.assignedTo?.fullName || 'Unassigned'}
            <br />

            <button onClick={() => updateStatus(t.id, 'completed')}>Complete</button>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          projectId={projectId}
          onClose={() => {
            setShowTaskModal(false);
            loadData();
          }}
        />
      )}
    </>
  );
};

export default ProjectDetails;
