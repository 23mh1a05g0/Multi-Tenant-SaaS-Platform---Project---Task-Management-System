import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import UserModal from '../components/UserModal';

const Users = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (user?.role === 'tenant_admin') {
      loadUsers();
    }
  }, [role]);

  const loadUsers = async () => {
    const res = await api.get(`/tenants/${user.tenantId}/users`, {
      params: { search, role }
    });
    setUsers(res.data.data.users);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  if (user?.role !== 'tenant_admin') {
    return (
      <>
        <Navbar />
        <p style={{ padding: 20 }}>Access denied</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>Users</h2>

        <button onClick={() => setShowModal(true)}>Add User</button>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Search by name or email"
            onChange={e => setSearch(e.target.value)}
          />

          <select onChange={e => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="tenant_admin">Tenant Admin</option>
          </select>

          <button onClick={loadUsers}>Apply</button>
        </div>

        {users.length === 0 && <p>No users found</p>}

        <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => {
                    setEditUser(u);
                    setShowModal(true);
                  }}>Edit</button>

                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
            loadUsers();
          }}
        />
      )}
    </>
  );
};

export default Users;
