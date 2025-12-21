import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

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
      const userRes = await api.get('/auth/me');
      const projectRes = await api.get('/projects');

      const taskRes = await api.get(
        `/projects/${projectRes.data.data.projects[0]?.id}/tasks`,
        { params: { assignedTo: user.id } }
      );

      const allProjects = projectRes.data.data.projects;
      const allTasks = taskRes.data.data.tasks;

      setStats({
        totalProjects: allProjects.length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        pendingTasks: allTasks.filter(t => t.status !== 'completed').length
      });

      setProjects(allProjects.slice(0, 5));
      setTasks(allTasks);
    } catch (err) {
      console.error('Dashboard load error', err);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div>Projects: {stats.totalProjects}</div>
          <div>Total Tasks: {stats.totalTasks}</div>
          <div>Completed: {stats.completedTasks}</div>
          <div>Pending: {stats.pendingTasks}</div>
        </div>

        {/* Recent Projects */}
        <h3>Recent Projects</h3>
        <ul>
          {projects.map(p => (
            <li key={p.id}>
              {p.name} – {p.status} (Tasks: {p.taskCount})
            </li>
          ))}
        </ul>

        {/* My Tasks */}
        <h3>My Tasks</h3>
        <ul>
          {tasks.map(t => (
            <li key={t.id}>
              {t.title} | {t.priority} | {t.dueDate || 'No due date'}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
