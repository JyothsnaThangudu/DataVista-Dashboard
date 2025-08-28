import React, { useState } from 'react';
import StatusModal from './StatusModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState(null); // {type, message, subMessage}
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 8) {
      setStatus({ type: 'failure', message: 'Registration Failed', subMessage: 'Password must be at least 8 characters.' });
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, password });
      setStatus({ type: 'success', message: 'Registration Successful', subMessage: '' });
      setTimeout(() => {
        setStatus(null);
        navigate('/login');
      }, 1500);
    } catch (err) {
      setStatus({ type: 'failure', message: 'Registration Failed', subMessage: err.response?.data?.error || 'Registration failed.' });
    }
  };

  return (
    <div className="register-bg">
      <div className="register-card">
        <div className="register-title">Register</div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="register-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              className="register-eye"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
      {status && (
        <StatusModal
          type={status.type}
          message={status.message}
          subMessage={status.subMessage}
          onClose={() => setStatus(null)}
        />
      )}
    </div>
  );
}

export default Register;
// ...existing code...