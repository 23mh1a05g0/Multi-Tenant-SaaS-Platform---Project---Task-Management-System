import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: '',
    subdomain: '',
    adminEmail: '',
    adminFullName: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* -------------------- HANDLE INPUT -------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = () => {
    if (!form.tenantName.trim()) return 'Organization name is required';
    if (!form.subdomain.trim()) return 'Subdomain is required';
    if (!form.adminEmail.trim()) return 'Admin email is required';
    if (!form.adminFullName.trim()) return 'Admin full name is required';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.terms) return 'Please accept Terms & Conditions';
    return null;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      tenantName: form.tenantName,
      subdomain: form.subdomain,
      adminEmail: form.adminEmail,
      adminPassword: form.password,
      adminFullName: form.adminFullName
    };

    try {
      setLoading(true);

      await api.post('/auth/register-tenant', payload);

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      <h2>Register Organization</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="tenantName"
          placeholder="Organization Name"
          value={form.tenantName}
          onChange={handleChange}
        />

        <input
          name="subdomain"
          placeholder="Subdomain"
          value={form.subdomain}
          onChange={handleChange}
        />
        <small>{form.subdomain}.yourapp.com</small>

        <input
          type="email"
          name="adminEmail"
          placeholder="Admin Email"
          value={form.adminEmail}
          onChange={handleChange}
        />

        <input
          name="adminFullName"
          placeholder="Admin Full Name"
          value={form.adminFullName}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
          />
          Accept Terms & Conditions
        </label>

        <button disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
