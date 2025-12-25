import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    totalTasks: 0,
    completed: 0,
    pending: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get('/dashboard');

      setStats(res.data.data.stats);
      setRecentProjects(res.data.data.recentProjects);
      setMyTasks(res.data.data.myTasks);
    } catch (err) {
      console.error('Dashboard load error', err);
      alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20 }}>Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 30, marginBottom: 20 }}>
          <div>Projects: <strong>{stats.projects}</strong></div>
          <div>Total Tasks: <strong>{stats.totalTasks}</strong></div>
          <div>Completed: <strong>{stats.completed}</strong></div>
          <div>Pending: <strong>{stats.pending}</strong></div>
        </div>

        {/* Recent Projects */}
        <h3>Recent Projects</h3>
        {recentProjects.length === 0 && <p>No projects found.</p>}
        <ul>
          {recentProjects.map(p => (
            <li key={p.id}>
              {p.name} — {p.status} (Tasks: {p.taskCount})
            </li>
          ))}
        </ul>

        {/* My Tasks */}
        <h3>My Tasks</h3>
        {myTasks.length === 0 && <p>No tasks assigned to you.</p>}
        <ul>
          {myTasks.map(t => (
            <li key={t.id}>
              {t.title} | {t.priority} | {t.status} | {t.project_name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
