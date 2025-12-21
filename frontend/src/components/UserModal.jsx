import { useState } from 'react';
import api from '../services/api';

const UserModal = ({ user, onClose }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    password: '',
    role: user?.role || 'user',
    isActive: user?.isActive ?? true
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.fullName) {
      return alert('Email and Full Name are required');
    }

    if (!user && !form.password) {
      return alert('Password required for new user');
    }

    if (user) {
      await api.put(`/users/${user.id}`, {
        fullName: form.fullName,
        role: form.role,
        isActive: form.isActive
      });
    } else {
      await api.post(`/tenants/${currentUser.tenantId}/users`, {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: form.role
      });
    }

    onClose();
  };

  return (
    <div style={{ background: '#eee', padding: 20 }}>
      <h3>{user ? 'Edit User' : 'Add User'}</h3>

      <form onSubmit={submit}>
        {!user && (
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        )}

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />

        {!user && (
          <input
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        )}

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={e => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>

        <br />

        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UserModal;
