import React, { useState, useEffect } from 'react';

const navbarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '64px',
  background: 'linear-gradient(90deg, #8884d8 0%, #cfdef3 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 40px',
  zIndex: 101,
  boxShadow: '0 4px 16px 0 rgba(31,38,135,0.10)',
  borderBottom: '1.5px solid #e0e7ef',
};

const titleStyle = {
  color: 'white',
  fontWeight: 700,
  fontSize: '1.7rem',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const userStyle = {
  color: '#3a3a3a',
  fontWeight: 500,
  fontSize: '1.1rem',
  background: 'white',
  borderRadius: '8px',
  padding: '8px 16px',
  boxShadow: '0 1px 4px rgba(31,38,135,0.07)',
  marginRight: '8px',
};

const dateTimeStyle = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: '8px',
  padding: '8px 24px',
  fontWeight: 600,
  fontSize: '1.15rem',
  color: '#3a3a3a',
  boxShadow: '0 1px 4px rgba(31,38,135,0.07)',
  margin: '0 auto',
  minWidth: '260px',
  textAlign: 'center',
  letterSpacing: '1px',
};

const logoutBtnStyle = {
  marginLeft: '12px',
  padding: '8px 24px',
  borderRadius: '8px',
  border: 'none',
  background: 'linear-gradient(90deg, #8884d8 0%, #a3bffa 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.08rem',
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(31,38,135,0.10)',
  transition: 'background 0.2s',
};

function Navbar({ username, onLogout }) {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default: clear localStorage and reload
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <header style={navbarStyle}>
      <div style={titleStyle}>
        <span role="img" aria-label="data">📊</span> DataVista
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {username && <div style={userStyle}>Logged in as: {username}</div>}
        {username && (
          <button
            onClick={handleLogout}
            style={logoutBtnStyle}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6c63ff 0%, #8884d8 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #8884d8 0%, #a3bffa 100%)'}
          >
            Logout
          </button>
        )}
      </div>
      <div style={{ ...dateTimeStyle, margin: 0, marginLeft: 'auto' }}>
        {dateTime.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </div>
    </header>
  );
}

export default Navbar;
