import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import './project-details.css';

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
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      loadData();
    } catch {
      alert('Failed to update task status');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      loadData();
    } catch {
      alert('Failed to delete task');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="project-details">
        <div className="project-header">
          <div>
            <h2>{project?.name}</h2>
            <p className="project-desc">{project?.description}</p>
          </div>
          <span className={`badge ${project?.status}`}>{project?.status}</span>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h3>Tasks</h3>
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              + Add Task
            </button>
          </div>

          {tasks.length === 0 && (
            <p className="empty">No tasks found.</p>
          )}

          {tasks.map(t => (
            <div key={t.id} className="task-card">
              <div>
                <strong>{t.title}</strong>
                <p className="muted">{t.description}</p>
                <p className="muted">
                  Priority: <span className="highlight">{t.priority}</span>
                </p>
                <p className="muted">
                  Assigned: {t.assignedTo?.fullName || 'Unassigned'}
                </p>
              </div>

              <div className="task-actions">
                <span className={`badge ${t.status}`}>{t.status}</span>
                <button
                  className="btn-success"
                  onClick={() => updateStatus(t.id, 'completed')}
                >
                  Complete
                </button>
                <button
                  className="btn-danger"
                  onClick={() => deleteTask(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
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
