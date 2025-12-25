import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 1️⃣ Fetch all projects
      const projectRes = await api.get('/projects');
      const allProjects = projectRes.data.data.projects || [];

      let allTasks = [];

      // 2️⃣ Fetch tasks for EACH project
      for (const project of allProjects) {
        const taskRes = await api.get(`/projects/${project.id}/tasks`);
        allTasks = [...allTasks, ...(taskRes.data.data.tasks || [])];
      }

      // 3️⃣ My tasks (assigned to logged-in user)
      const assignedTasks = allTasks.filter(
        t => t.assignedTo && t.assignedTo.id === user.id
      );

      // 4️⃣ Set dashboard stats
      setStats({
        totalProjects: allProjects.length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        pendingTasks: allTasks.filter(t => t.status !== 'completed').length
      });

      // 5️⃣ Recent projects (top 5)
      setProjects(allProjects.slice(0, 5));
      setMyTasks(assignedTasks);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h2 className="dashboard-title">Dashboard</h2>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Projects</h4>
            <p>{stats.totalProjects}</p>
          </div>

          <div className="stat-card">
            <h4>Total Tasks</h4>
            <p>{stats.totalTasks}</p>
          </div>

          <div className="stat-card success">
            <h4>Completed Tasks</h4>
            <p>{stats.completedTasks}</p>
          </div>

          <div className="stat-card warning">
            <h4>Pending Tasks</h4>
            <p>{stats.pendingTasks}</p>
          </div>
        </div>

        {/* ================= RECENT PROJECTS ================= */}
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

        {/* ================= MY TASKS ================= */}
        <div className="section">
          <h3>My Tasks</h3>

          {myTasks.length === 0 ? (
            <p className="empty">No tasks assigned</p>
          ) : (
            <ul className="task-list">
              {myTasks.map(t => (
                <li key={t.id}>
                  <div>
                    <span className="task-title">{t.title}</span>
                    <div className="muted">
                      Priority: {t.priority} | Status: {t.status}
                    </div>
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
