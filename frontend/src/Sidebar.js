import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarStyle = {
  height: '100vh',
  width: '220px',
  position: 'fixed',
  top: 0,
  left: 0,
  background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
  boxShadow: '2px 0 8px rgba(31,38,135,0.07)',
  display: 'flex',
  flexDirection: 'column',
  padding: '32px 0',
  zIndex: 100,
};

const linkStyle = {
  color: '#3a3a3a',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1.13rem',
  padding: '14px 28px',
  margin: '4px 0',
  borderRadius: '8px',
  transition: 'background 0.2s, color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

const activeLinkStyle = {
  background: 'linear-gradient(90deg, #8884d8 0%, #a3bffa 100%)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
};

const hoverLinkStyle = {
  background: '#e0e7ef',
  color: '#8884d8',
};

function Sidebar() {
  // Helper to merge styles for active tab
  const [hovered, setHovered] = React.useState(null);
  const getNavStyle = ({ isActive }, idx) => {
    let style = { ...linkStyle };
    if (isActive) style = { ...style, ...activeLinkStyle };
    if (hovered === idx) style = { ...style, ...hoverLinkStyle };
    return style;
  };
  const menuItems = [
    { to: '/dashboard', label: 'Home', icon: '🏠', exact: true },
    { to: '/dashboard/charts', label: 'Charts', icon: '📈' },
    { to: '/dashboard/upload', label: 'File Upload', icon: '📤' },
    { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { to: '/dashboard/settings', label: 'Settings', icon: '⚙️', disabled: true },
  ];

  return (
    <nav style={sidebarStyle}>
      <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#8884d8', marginBottom: '32px', textAlign: 'center', letterSpacing: '1px' }}>
        Dashboard
      </div>
      {menuItems.map((item, idx) => (
        <NavLink
          key={item.label}
          to={item.to}
          style={navProps => {
            let style = getNavStyle(navProps, idx);
            if (item.disabled) {
              style = {
                ...style,
                background: '#f7f7f7',
                color: '#b0b0b0',
                cursor: 'not-allowed',
                fontStyle: 'italic',
                border: '1.5px dashed #e0e7ef',
                opacity: 0.7,
              };
            }
            return style;
          }}
          end={item.exact}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
      {/* Logout option after menu items */}
      <NavLink
        to="/"
        style={navProps => ({
          ...linkStyle,
          color: '#8884d8',
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          ...(navProps.isActive ? activeLinkStyle : {}),
          ...(hovered === 'logout' ? hoverLinkStyle : {}),
        })}
        onMouseEnter={() => setHovered('logout')}
        onMouseLeave={() => setHovered(null)}
      >
        <span style={{ fontSize: '1.3rem' }}>🚪</span>
        <span style={{ fontWeight: 600, fontSize: '1.13rem' }}>Logout</span>
      </NavLink>
      <div style={{ flex: 1 }} />
      <div style={{ height: '1px', background: '#e0e7ef', margin: '18px 0 8px 0', width: '80%', alignSelf: 'center' }} />
    </nav>
  );
}

export default Sidebar;
