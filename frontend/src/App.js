import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Welcome';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardCharts from './DashboardCharts';
import DashboardUpload from './DashboardUpload';
import DashboardHome from './DashboardHome';
import DashboardProfile from './DashboardProfile';

function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Aruba');
  const [selectedCategory, setSelectedCategory] = useState('GDP');
  const [yearRange, setYearRange] = useState([1960, 2020]); // Default range, adjust as needed
  const [selectedYear, setSelectedYear] = useState(1960); // Default year
  const [token, setToken] = useState(() => localStorage.getItem('access'));
  const [username, setUsername] = useState('');
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentCharts, setRecentCharts] = useState([]);
  const [recentDownloads, setRecentDownloads] = useState([]);

  // Fetch data from Django API when authenticated
  useEffect(() => {
    if (!token) return;
    axios.get('http://127.0.0.1:8000/api/worldbank/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    // Fetch recent uploads
    axios.get('http://127.0.0.1:8000/api/recent-uploads/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setRecentUploads(response.data); // [{name, date}]
      })
      .catch(() => setRecentUploads([]));
    // Fetch recent charts
    axios.get('http://127.0.0.1:8000/api/recent-charts/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setRecentCharts(response.data); // [{name, date}]
      })
      .catch(() => setRecentCharts([]));
    // Fetch recent downloads
    axios.get('http://127.0.0.1:8000/api/recent-downloads/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setRecentDownloads(response.data); // [{name, date}]
      })
      .catch(() => setRecentDownloads([]));
  }, [token]);

  // Extract username from JWT (if available)
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.username || '');
    } catch {
      setUsername('');
    }
  }, [token]);

  // Get unique countries and categories for dropdowns
  const countries = Array.from(new Set(data.map(item => item.country))).sort();
  const categories = Array.from(new Set(data.map(item => item.category))).sort();

  // Get min and max year from data for slider and dropdown
  const years = Array.from(new Set(data.map(item => item.year))).sort((a, b) => a - b);
  const minYear = years.length ? years[0] : 1960;
  const maxYear = years.length ? years[years.length - 1] : 2020;

  // Filter data based on selected country, category, and year range
  const filteredData = data
    .filter(item =>
      item.country === selectedCountry &&
      item.category === selectedCategory &&
      item.year >= yearRange[0] &&
      item.year <= yearRange[1]
    )
    .sort((a, b) => a.year - b.year);

  // Format large numbers for Y-axis
  const formatYAxis = (tick) => {
    if (Math.abs(tick) >= 1e9) return (tick / 1e9).toFixed(1) + 'B';
    if (Math.abs(tick) >= 1e6) return (tick / 1e6).toFixed(1) + 'M';
    if (Math.abs(tick) >= 1e3) return (tick / 1e3).toFixed(1) + 'K';
    return tick;
  };

  // Settings page (placeholder)
  const DashboardSettings = () => (
    <div style={{ marginLeft: '240px', padding: '40px' }}>
      <h2>Settings</h2>
      <p>Adjust your dashboard settings. (Feature coming soon)</p>
    </div>
  );

  return (
    <Router>
      {/* Navbar always visible, but only shows logout if username is present */}
      <Routes>
        <Route path="/" element={<><Navbar username={null} /><Welcome /></>} />
        <Route path="/login" element={<><Navbar username={null} /><Login setToken={setToken} /></>} />
        <Route path="/register" element={<><Navbar username={null} /><Register /></>} />
        <Route path="/dashboard" element={token ? (
          <><Navbar username={username} onLogout={() => { setToken(null); localStorage.clear(); window.location.reload(); }} /><Sidebar />
            <DashboardHome
              username={username}
              data={data}
              recentUploads={recentUploads}
              recentCharts={recentCharts}
              recentDownloads={recentDownloads}
              categories={categories}
              lastLogin={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
          </>
        ) : <Navigate to="/login" />} />
        <Route path="/dashboard/charts" element={token ? (
          <><Navbar username={username} onLogout={() => { setToken(null); localStorage.clear(); window.location.reload(); }} /><Sidebar />
            <DashboardCharts
              data={data}
              countries={countries}
              categories={categories}
              years={years}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              yearRange={yearRange}
              setYearRange={setYearRange}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              formatYAxis={formatYAxis}
            />
          </>
        ) : <Navigate to="/login" />} />
        <Route path="/dashboard/upload" element={token ? (
          <><Navbar username={username} onLogout={() => { setToken(null); localStorage.clear(); window.location.reload(); }} /><Sidebar />
            <DashboardUpload token={token} formatYAxis={formatYAxis} />
          </>
        ) : <Navigate to="/login" />} />
        <Route path="/dashboard/profile" element={token ? (
          <><Navbar username={username} onLogout={() => { setToken(null); localStorage.clear(); window.location.reload(); }} /><Sidebar />
            <DashboardProfile />
          </>
        ) : <Navigate to="/login" />} />
        <Route path="/dashboard/settings" element={token ? (
          <><Navbar username={username} onLogout={() => { setToken(null); localStorage.clear(); window.location.reload(); }} /><Sidebar />
            <DashboardSettings />
          </>
        ) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
