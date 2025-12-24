import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, [status]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.get('/projects', {
        params: { status }
      });

      setProjects(res.data.data.projects || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch {
      alert('Failed to delete project');
    }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Projects</h2>

        <button onClick={() => setShowModal(true)}>
          Create New Project
        </button>

        <div style={{ marginTop: 10 }}>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <input
            placeholder="Search project"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </div>

        {loading && <p>Loading projects...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && filtered.length === 0 && (
          <p>No projects found.</p>
        )}

        <div>
          {filtered.map(p => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ccc',
                margin: 10,
                padding: 10
              }}
            >
              <h4>{p.name}</h4>
              <p>{p.description || 'No description'}</p>

              <p>Status: <b>{p.status}</b></p>
              <p>Tasks: {p.taskCount || 0}</p>
              <p>
                Created by:{' '}
                {p.createdBy ? p.createdBy.fullName : 'N/A'}
              </p>

              <button onClick={() => navigate(`/projects/${p.id}`)}>
                View
              </button>

              <button
                onClick={() => {
                  setEditProject(p);
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => deleteProject(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
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
    </>
  );
};

export default Projects;
