import { useState } from 'react';
import api from '../services/api';
import '../styles/modal.css';

const UserModal = ({ user, onClose }) => {
  const isEdit = Boolean(user);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const tenantId = currentUser?.tenantId;

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    isActive: user?.isActive ?? true
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email) {
      return alert('Full name and email are required');
    }

    try {
      if (isEdit) {
        // 🔵 UPDATE USER
        await api.put(`/users/${user.id}`, {
          fullName: form.fullName,
          role: form.role,
          isActive: form.isActive
        });
      } else {
        // 🟢 CREATE USER (CORRECT ENDPOINT)
        if (!form.password) {
          return alert('Password is required');
        }

        await api.post(`/tenants/${tenantId}/users`, {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role
        });
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save user');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="modal-title">
          {isEdit ? 'Edit User' : 'Add User'}
        </h3>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={form.email}
              disabled={isEdit}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="tenant_admin">Tenant Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
