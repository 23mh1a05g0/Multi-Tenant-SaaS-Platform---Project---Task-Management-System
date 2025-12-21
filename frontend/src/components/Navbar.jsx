import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <strong>Multi-Tenant SaaS</strong>

      <span style={{ marginLeft: 20 }}>
        <Link to="/dashboard">Dashboard</Link>{' | '}
        <Link to="/projects">Projects</Link>

        {(user?.role === 'tenant_admin' || user?.role === 'super_admin') && (
          <> | <Link to="/tasks">Tasks</Link></>
        )}

        {user?.role === 'tenant_admin' && (
          <> | <Link to="/users">Users</Link></>
        )}

        {user?.role === 'super_admin' && (
          <> | <Link to="/tenants">Tenants</Link></>
        )}
      </span>

      <span style={{ float: 'right' }}>
        {user?.fullName} ({user?.role}) {' '}
        <button onClick={logout}>Logout</button>
      </span>
    </nav>
  );
};

export default Navbar;
