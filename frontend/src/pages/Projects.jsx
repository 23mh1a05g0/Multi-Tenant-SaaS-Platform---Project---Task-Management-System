import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [status]);

  const loadProjects = async () => {
    const res = await api.get('/projects', { params: { status } });
    setProjects(res.data.data.projects);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    loadProjects();
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="projects-page">
        <div className="projects-header">
          <h2>Projects</h2>
          <button className="btn-create" onClick={() => setShowModal(true)}>
            + Create Project
          </button>
        </div>

        <div className="projects-filters">
          <select onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <input
            placeholder="Search project"
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 && (
          <p className="empty">No projects found.</p>
        )}

        <div className="projects-grid">
          {filtered.map(p => (
            <div key={p.id} className="project-card">
              <h4>{p.name}</h4>
              <p className="desc">{p.description || 'No description'}</p>

              <div className="meta">
                <span className={`badge ${p.status}`}>{p.status}</span>
                <span className="tasks">Tasks: {p.taskCount}</span>
              </div>

              <div className="actions">
                <button onClick={() => navigate(`/projects/${p.id}`)}>View</button>
                <button onClick={() => {
                  setEditProject(p);
                  setShowModal(true);
                }}>Edit</button>
                <button className="danger" onClick={() => deleteProject(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <ProjectModal
            project={editProject}
            onClose={() => {
              setShowModal(false);
              setEditProject(null);
              loadProjects();
            }}
          />
        )}
      </div>
    </>
  );
};

export default Projects;
