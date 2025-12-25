import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? 'active' : '';

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <div className="logo">Multi-Tenant SaaS</div>

        <nav className="nav-links">
          <Link className={isActive('/dashboard')} to="/dashboard">Dashboard</Link>
          <Link className={isActive('/projects')} to="/projects">Projects</Link>
          <Link className={isActive('/tasks')} to="/tasks">Tasks</Link>
          {user?.role === 'tenant_admin' && (
            <Link className={isActive('/users')} to="/users">Users</Link>
          )}
        </nav>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-name">{user?.fullName}</span>
          <span className={`role-badge ${user?.role}`}>
            {user?.role}
          </span>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
