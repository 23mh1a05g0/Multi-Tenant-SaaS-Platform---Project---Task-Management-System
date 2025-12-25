import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Register.css';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validate = () => {
    if (Object.values(form).some(v => v === '')) return 'All fields are required';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.terms) return 'Please accept Terms & Conditions';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      await api.post('/auth/register-tenant', {
        tenantName: form.tenantName,
        subdomain: form.subdomain,
        adminEmail: form.adminEmail,
        adminPassword: form.password,
        adminFullName: form.adminFullName
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Your Organization</h2>
        <p className="subtitle">Start managing projects in minutes</p>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="tenantName"
            placeholder="Organization Name"
            onChange={handleChange}
          />

          <input
            name="subdomain"
            placeholder="Subdomain"
            onChange={handleChange}
          />
          <small className="hint">{form.subdomain || 'yourname'}.yourapp.com</small>

          <input
            type="email"
            name="adminEmail"
            placeholder="Admin Email"
            onChange={handleChange}
          />

          <input
            name="adminFullName"
            placeholder="Admin Full Name"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <label className="checkbox">
            <input type="checkbox" name="terms" onChange={handleChange} />
            I agree to the Terms & Conditions
          </label>

          <button disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
