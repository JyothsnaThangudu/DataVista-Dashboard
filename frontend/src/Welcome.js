import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(31,38,135,0.10)',
        padding: '48px 56px',
        textAlign: 'center',
        minWidth: '380px',
      }}>
        <h1 style={{
          fontWeight: 800,
          fontSize: '2.2rem',
          marginBottom: '32px',
          color: '#222',
          letterSpacing: '1px',
        }}>
          Explore World Data with DataVista
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '12px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 38px',
              fontSize: '1.18rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #8884d8 0%, #cfdef3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6c63ff 0%, #8884d8 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #8884d8 0%, #cfdef3 100%)'}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 38px',
              fontSize: '1.18rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #cfdef3 0%, #8884d8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #8884d8 0%, #cfdef3 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #cfdef3 0%, #8884d8 100%)'}
          >
            Register
          </button>
        </div>
        <div style={{ color: '#8884d8', fontWeight: 500, fontSize: '1.08rem', marginTop: '18px' }}>
          Your gateway to world data visualization and analytics
        </div>
      </div>
    </div>
  );
}

export default Welcome;
