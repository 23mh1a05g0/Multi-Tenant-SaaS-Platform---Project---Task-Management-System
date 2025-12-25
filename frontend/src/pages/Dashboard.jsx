import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const projectRes = await api.get('/projects');

      const projectList = projectRes.data.data.projects || [];

      let allTasks = [];
      if (projectList.length > 0) {
        const taskRes = await api.get(
          `/projects/${projectList[0].id}/tasks`,
          { params: { assignedTo: user.id } }
        );
        allTasks = taskRes.data.data.tasks || [];
      }

      setStats({
        totalProjects: projectList.length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        pendingTasks: allTasks.filter(t => t.status !== 'completed').length
      });

      setProjects(projectList.slice(0, 5));
      setTasks(allTasks);
    } catch (err) {
      console.error('Dashboard load error', err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h2 className="dashboard-title">Dashboard</h2>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Projects</h4>
            <p>{stats.totalProjects || 0}</p>
          </div>

          <div className="stat-card">
            <h4>Total Tasks</h4>
            <p>{stats.totalTasks || 0}</p>
          </div>

          <div className="stat-card success">
            <h4>Completed Tasks</h4>
            <p>{stats.completedTasks || 0}</p>
          </div>

          <div className="stat-card warning">
            <h4>Pending Tasks</h4>
            <p>{stats.pendingTasks || 0}</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="section">
          <h3>Recent Projects</h3>

          {projects.length === 0 ? (
            <p className="empty">No projects found</p>
          ) : (
            <ul className="project-list">
              {projects.map(p => (
                <li key={p.id}>
                  <span className="project-name">{p.name}</span>

                  <div className="project-meta">
                    <span className={`badge ${p.status}`}>{p.status}</span>
                    <span className="task-count">Tasks: {p.taskCount}</span>
                  </div>
                </li>
              ))}
            </ul>

          )}
        </div>

        {/* My Tasks */}
        <div className="section">
          <h3>My Tasks</h3>

          {tasks.length === 0 ? (
            <p className="empty">No tasks assigned</p>
          ) : (
            <ul className="task-list">
              {tasks.map(t => (
                <li key={t.id}>
                  <div>
                    <strong>{t.title}</strong>
                    <div className="muted">{t.priority} priority</div>
                  </div>
                  <span className={`badge ${t.status}`}>{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
