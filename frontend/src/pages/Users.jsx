import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import UserModal from '../components/UserModal';
import '../styles/user.css';

const Users = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (currentUser?.role === 'tenant_admin') loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get(`/tenants/${currentUser.tenantId}/users`);
    setUsers(res.data.data.users);
  };

  if (currentUser?.role !== 'tenant_admin') {
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

      <div className="users-page">
        <h2 className="users-title">Users</h2>

        <button className="btn-primary" onClick={() => {
          setSelectedUser(null);
          setShowModal(true);
        }}>
          Add User
        </button>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            loadUsers();
          }}
        />
      )}
    </>
  );
};

export default Users;
