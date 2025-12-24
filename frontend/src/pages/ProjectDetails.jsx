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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const projectRes = await api.get(`/projects/${projectId}`);
      const tasksRes = await api.get(`/projects/${projectId}/tasks`);

      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data.tasks);
    } catch (err) {
      alert('Failed to load project or tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>{project?.name}</h2>
        <p>{project?.description}</p>
        <strong>Status:</strong> {project?.status}

        <hr />

        <h3>Tasks</h3>
        <button onClick={() => setShowTaskModal(true)}>Add Task</button>

        {tasks.length === 0 && <p>No tasks found.</p>}

        {tasks.map(t => (
          <div key={t.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <strong>{t.title}</strong>
            <p>{t.description}</p>

            <div>Status: {t.status}</div>
            <div>Priority: {t.priority}</div>
            <div>Assigned: {t.assignedTo?.fullName || 'Unassigned'}</div>

            <button onClick={() => updateStatus(t.id, 'completed')}>
              Mark Completed
            </button>
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
