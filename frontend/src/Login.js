import React, { useState } from 'react';
import StatusModal from './StatusModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null); // {type, message, subMessage}
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access', response.data.access); // Store token for later use
      setToken(response.data.access);
  setStatus({ type: 'success', message: 'Login Successful', subMessage: '' });
      setTimeout(() => {
        setStatus(null);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setStatus({ type: 'failure', message: 'Login Failed', subMessage: 'Please check your credentials.' });
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-title">Login</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ width: '100%' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ width: '100%' }}
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          <button
            type="submit"
            className="login-btn"
            style={{ width: '180px', margin: '0 auto', display: 'block' }}
          >
            Login
          </button>
          {error && <div className="login-error">{error}</div>}
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

export default Login;
