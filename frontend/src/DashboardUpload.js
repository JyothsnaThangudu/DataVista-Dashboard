import React, { useState } from 'react';
import StatusModal from './StatusModal';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { loadHtml2Canvas } from './utils/loadHtml2Canvas';

const DashboardUpload = ({ token, formatYAxis }) => {
  const [chartZoom, setChartZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // {type, message, subMessage}
  const [customData, setCustomData] = useState([]);
  const [customCountry, setCustomCountry] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customYearRange, setCustomYearRange] = useState([1960, 2020]);
  const [customIndicator, setCustomIndicator] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatus({ type: 'failure', message: 'Upload Failed', subMessage: 'Please select a file to upload.' });
      return;
    }
  setUploading(true);
  setMessage('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token || localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });
      setStatus({ type: 'success', message: 'File Uploaded Successfully', subMessage: '' });
      setSelectedFile(null);
      // Fetch the uploaded data for custom visualisation
      const resp = await axios.get('http://127.0.0.1:8000/api/worldbank/', {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });
      setCustomData(resp.data);
      // Set defaults for dropdowns
      if (resp.data.length > 0) {
        setCustomCountry(resp.data[0].country);
        setCustomCategory(resp.data[0].category);
        setCustomIndicator(resp.data[0].indicator || '');
        const years = resp.data.map(item => item.year);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        setCustomYearRange([minYear, maxYear]);
      }
    } catch (err) {
      if (err.response?.data?.error?.includes('Year')) {
        setStatus({ type: 'failure', message: 'Upload Failed', subMessage: "Missing required column 'Year'." });
      } else {
        const errorMsg = err.response?.data?.error || 'Upload failed. Please try again.';
        setStatus({ type: 'failure', message: 'Upload Failed', subMessage: errorMsg });
      }
    }
    setUploading(false);
  };

  const downloadChartImage = async () => {
    const chartNode = document.getElementById('custom-chart-container');
    if (!chartNode) return;
    const html2canvas = await loadHtml2Canvas();
    html2canvas(chartNode).then(async canvas => {
      const link = document.createElement('a');
      link.download = 'custom_chart.png';
      link.href = canvas.toDataURL();
      link.click();
      // Record download activity
      try {
        await axios.post('http://127.0.0.1:8000/api/recent-downloads/', {
          name: `${customCountry} ${customCategory} ${customIndicator}`.trim() || 'Custom Chart',
        }, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });
      } catch (err) {
        // Silently ignore errors for activity logging
      }
    });
  };

  const customCountries = Array.from(new Set(customData.map(item => item.country))).sort();
  const customCategories = Array.from(new Set(customData.map(item => item.category))).sort();
  const customCategoriesFiltered = customCategories.filter(cat => cat !== 'GDP (current US$)');
  const customIndicators = Array.from(new Set(customData.map(item => item.indicator))).filter(Boolean).sort();
  const customYears = Array.from(new Set(customData.map(item => item.year))).sort((a, b) => a - b);
  const customMinYear = customYears.length ? customYears[0] : 1960;
  const customMaxYear = customYears.length ? customYears[customYears.length - 1] : 2020;
  const customFilteredData = customData
    .filter(item =>
      item.country === customCountry &&
      item.category === customCategory &&
      (customIndicator ? item.indicator === customIndicator : true) &&
      item.year >= customYearRange[0] &&
      item.year <= customYearRange[1]
    )
    .sort((a, b) => a.year - b.year);

  const exampleCsv = `country,year,value\nAruba,1960,405586592.2\nAruba,1961,487709497.2\n`;

  return (
  <div style={{ marginLeft: '240px', padding: '80px 0 0 0', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '18px', color: '#3a3a3a', fontWeight: 700 }}>File Upload</h2>
      <div style={{ background: '#f7fafd', borderRadius: '12px', padding: '24px 32px', marginBottom: '24px', border: '1.5px solid #b0c4de', boxShadow: '0 2px 8px rgba(31,38,135,0.07)', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
        <div style={{ fontSize: '2.1rem', color: '#8884d8', marginRight: '18px', marginTop: '2px' }}>📤</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: '8px', color: '#3a3a3a' }}>Instructions:</div>
          <ul style={{ marginTop: '8px', marginBottom: '8px', color: '#444', fontSize: '1.05rem' }}>
            <li>Upload a CSV/Excel file with columns: <b>Country</b>, <b>Year</b>, <b>Value</b>. Optionally, add <b>Indicator</b> for multiple metrics.</li>
            <li>Example available for download: <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(exampleCsv)}`} download="example.csv" style={{ color: '#8884d8', textDecoration: 'underline', fontWeight: 500 }}>Download Example CSV</a></li>
            <li>After upload, select country, indicator, and year range to view your custom visualisation.</li>
          </ul>
        </div>
      </div>
      <form onSubmit={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '520px', marginBottom: '8px' }}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ padding: '8px', fontSize: '1rem', borderRadius: '6px', border: '1.5px solid #b0c4de', background: '#f7fafd', width: '220px' }}
        />
        <button
          type="submit"
          disabled={uploading}
          style={{ padding: '10px 38px', fontSize: '1.08rem', background: 'linear-gradient(90deg, #8884d8 0%, #cfdef3 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: uploading ? 'none' : '0 2px 8px rgba(31,38,135,0.07)' }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <div style={{ color: '#555', fontSize: '1rem', marginBottom: '8px' }}>Supported formats: CSV, Excel (.xlsx, .xls)</div>
      {status && (
        <StatusModal
          type={status.type}
          message={status.message}
          subMessage={status.subMessage}
          onClose={() => setStatus(null)}
        />
      )}

      {customData.length > 0 && (
        <div style={{ marginTop: '40px', background: '#f7fafd', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ textAlign: 'center', color: '#3a3a3a', fontWeight: 600 }}>Custom Data Visualisation</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <label style={{ fontWeight: 500, color: '#3a3a3a' }}>
              Country:
              <select
                value={customCountry}
                onChange={e => setCustomCountry(e.target.value)}
                style={{ marginLeft: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #b0c4de', fontSize: '1rem', background: '#f7fafd' }}
              >
                {customCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </label>
            <label style={{ marginLeft: '20px', fontWeight: 500, color: '#3a3a3a' }}>
              {customIndicators.length > 0 ? 'Indicator:' : 'Category:'}
              <select
                value={customIndicators.length > 0 ? customIndicator : customCategory}
                onChange={e => customIndicators.length > 0 ? setCustomIndicator(e.target.value) : setCustomCategory(e.target.value)}
                style={{ marginLeft: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #b0c4de', fontSize: '1rem', background: '#f7fafd' }}
              >
                {(customIndicators.length > 0 ? customIndicators : customCategoriesFiltered).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </label>
            <label style={{ marginLeft: '20px', fontWeight: 500, color: '#3a3a3a' }}>
              Year Range:
              <input
                type="range"
                min={customMinYear}
                max={customMaxYear}
                value={customYearRange[0]}
                onChange={e => setCustomYearRange([Number(e.target.value), customYearRange[1]])}
                style={{ width: '120px', margin: '0 10px', accentColor: '#8884d8' }}
              />
              <input
                type="range"
                min={customMinYear}
                max={customMaxYear}
                value={customYearRange[1]}
                onChange={e => setCustomYearRange([customYearRange[0], Number(e.target.value)])}
                style={{ width: '120px', accentColor: '#8884d8' }}
              />
              <span style={{ marginLeft: '10px', fontWeight: 600, color: '#8884d8' }}>{customYearRange[0]} - {customYearRange[1]}</span>
            </label>
          </div>
          <div style={{ minWidth: '400px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <h4 style={{ textAlign: 'center', color: '#8884d8', margin: 0 }}>Line Chart</h4>
              {customCategory === 'Unemployment' && (
                <span style={{ color: '#8884d8', fontWeight: 500, fontSize: '1rem' }}>Y-axis: % of total labor force</span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '12px' }}>
              <button type="button" onClick={() => setChartZoom(prev => Math.min(prev + 0.2, 2))} title="Zoom In" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: '#8884d8' }}>
                <span role="img" aria-label="Zoom In">🔍+</span>
              </button>
              <button type="button" onClick={() => setChartZoom(prev => Math.max(prev - 0.2, 0.4))} title="Zoom Out" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: '#8884d8' }}>
                <span role="img" aria-label="Zoom Out">🔍-</span>
              </button>
              <button type="button" onClick={downloadChartImage} title="Download Chart" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: '#8884d8' }}>
                <span role="img" aria-label="Download">⬇️</span>
              </button>
            </div>
            <div id="custom-chart-container" style={{ background: '#fff', borderRadius: '8px', padding: '8px' }}>
              <ResponsiveContainer width="100%" height={Math.round(400 * chartZoom)}>
                <LineChart data={customFilteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 14, fontWeight: 500, fill: '#3a3a3a' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name={customIndicators.length > 0 ? customIndicator : customCategory} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUpload;
