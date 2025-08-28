import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PAGE_SIZE_OPTIONS = [5, 10, 15];

function formatExactDateTime(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

const DashboardHome = ({ username, data, recentUploads, recentCharts, recentDownloads, categories, lastLogin }) => {
  // Calculate stats dynamically
  const datasets = recentUploads.length;
  const downloads = recentDownloads.length;
  const indicators = categories.length;

  // Merge recent activity
  const recentActivity = [
    ...recentUploads.map(u => ({ type: 'upload', text: `${u.name} uploaded`, date: u.date })),
    ...recentDownloads.map(d => ({ type: 'download', text: `${d.name} downloaded`, date: d.date })),
    ...recentCharts.map(c => ({ type: 'chart', text: `Viewed ${c.name} chart`, date: c.date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const totalPages = Math.ceil(recentActivity.length / pageSize);
  const paginatedActivity = recentActivity.slice((page - 1) * pageSize, page * pageSize);

  // Reset to first page when pageSize changes
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  return (
    <div style={{ marginLeft: '240px', padding: '80px 0 40px 0' }}>
      {/* Welcome Section */}
      <div style={{ textAlign: 'left', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '2.2rem', color: '#3a3a3a', letterSpacing: '1px', textAlign: 'left', marginBottom: 0 }}>
              Welcome back, {username} 👋
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#555', marginTop: '8px', textAlign: 'left', marginBottom: 0 }}>
              Your personal data insights hub
            </p>
          </div>
          <div style={{ display: 'flex', gap: '22px', marginLeft: '32px' }}>
            <Link
              to="/dashboard/upload"
              style={shortcutStyle}
              onMouseOver={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #a3bffa 0%, #e0eafc 100%)';
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,38,135,0.13)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(31,38,135,0.10)';
              }}
            >
              <span role="img" aria-label="Upload" style={{ fontSize: '1.35rem', marginRight: '8px' }}>➕</span> Upload New Data
            </Link>
            <Link
              to="/dashboard/charts"
              style={shortcutStyle}
              onMouseOver={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #b2f7ef 0%, #a3bffa 100%)';
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,38,135,0.13)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(31,38,135,0.10)';
              }}
            >
              <span role="img" aria-label="Charts" style={{ fontSize: '1.35rem', marginRight: '8px' }}>📈</span> View Charts
            </Link>
            <Link
              to="/dashboard/profile"
              style={shortcutStyle}
              onMouseOver={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #cfdef3 0%, #e0eafc 100%)';
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,38,135,0.13)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(31,38,135,0.10)';
              }}
            >
              <span role="img" aria-label="Profile" style={{ fontSize: '1.35rem', marginRight: '8px' }}>⚙️</span> Update Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats / Cards */}
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ ...cardStyle, background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)' }}>
          <span role="img" aria-label="Datasets" style={iconStyle}>📂</span>
          <div style={cardTextStyle}>{datasets} datasets uploaded</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(120deg, #f7fafd 0%, #a3bffa 100%)' }}>
          <span role="img" aria-label="Downloads" style={iconStyle}>⬇️</span>
          <div style={cardTextStyle}>{downloads} visualizations downloaded</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(120deg, #e0eafc 0%, #b2f7ef 100%)' }}>
          <span role="img" aria-label="Indicators" style={iconStyle}>🌍</span>
          <div style={cardTextStyle}>{indicators} World Bank indicators</div>
        </div>
        <div style={{ ...cardStyle, background: 'linear-gradient(120deg, #f7fafd 0%, #cfdef3 100%)' }}>
          <span role="img" aria-label="Last Login" style={iconStyle}>🕒</span>
          <div style={cardTextStyle}>Last login: {lastLogin}</div>
        </div>
      </div>

      {/* Recent Activity */}
  <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '32px', background: 'linear-gradient(120deg, #f7fafd 0%, #e0eafc 100%)', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(31,38,135,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#3a3a3a', fontWeight: 600, marginBottom: 0 }}>Recent Activity</h3>
          <div>
            <label htmlFor="pageSize" style={{ marginRight: '8px', fontWeight: 500, color: '#555' }}>Show</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #b0c4de', background: '#fff', fontWeight: 500 }}
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span style={{ marginLeft: '8px', color: '#555' }}>entries</span>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {paginatedActivity.length === 0 ? (
            <li style={{ color: '#888' }}>No recent activity yet.</li>
          ) : (
            paginatedActivity.map((item, idx) => {
              let icon = '📝', color = '#8884d8';
              if (item.type === 'upload') { icon = '📤'; color = '#82ca9d'; }
              else if (item.type === 'download') { icon = '⬇️'; color = '#8884d8'; }
              else if (item.type === 'chart') { icon = '📈'; color = '#ffc658'; }
              return (
                <li key={idx} style={{ marginBottom: '14px', color: '#444', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.08rem' }}>
                  <span style={{ fontSize: '1.25rem', color }}>{icon}</span>
                  <span>{item.text}</span>
                  <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 'auto' }}>({formatExactDateTime(item.date)})</span>
                </li>
              );
            })
          )}
        </ul>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '18px' }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: page === 1 ? '#e0e7ef' : 'linear-gradient(90deg, #8884d8 0%, #a3bffa 100%)', color: page === 1 ? '#888' : 'white', fontWeight: 600, fontSize: '1rem', cursor: page === 1 ? 'not-allowed' : 'pointer', boxShadow: '0 1px 4px rgba(31,38,135,0.07)' }}>Prev</button>
            <span style={{ fontWeight: 600, color: '#8884d8', fontSize: '1.08rem' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: page === totalPages ? '#e0e7ef' : 'linear-gradient(90deg, #8884d8 0%, #a3bffa 100%)', color: page === totalPages ? '#888' : 'white', fontWeight: 600, fontSize: '1rem', cursor: page === totalPages ? 'not-allowed' : 'pointer', boxShadow: '0 1px 4px rgba(31,38,135,0.07)' }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(31,38,135,0.10)',
  padding: '28px',
  minWidth: '170px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'box-shadow 0.2s',
};
const iconStyle = {
  fontSize: '2.2rem',
  marginBottom: '8px',
};
const cardTextStyle = {
  fontWeight: 600,
  fontSize: '1.1rem',
  color: '#3a3a3a',
};
const shortcutStyle = {
  background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
  borderRadius: '10px',
  padding: '10px 18px',
  fontWeight: 600,
  color: '#3a3a3a',
  textDecoration: 'none',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(31,38,135,0.07)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
  cursor: 'pointer',
  border: 'none',
};

export default DashboardHome;
