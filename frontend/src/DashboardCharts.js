// ...existing code...
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Accept all props needed for chart logic
const DashboardCharts = ({
  data,
  countries,
  categories,
  years,
  selectedCountry,
  setSelectedCountry,
  selectedCategory,
  setSelectedCategory,
  yearRange,
  setYearRange,
  selectedYear,
  setSelectedYear,
  formatYAxis
}) => {
  // Chart refs
  const lineChartRef = useRef(null);
  const areaChartRef = useRef(null);
  const barChartRef = useRef(null);
  const groupedBarChartRef = useRef(null);

    // Ref for all charts container
    const allChartsRef = useRef(null);

  // Download handler
  const handleDownload = async (ref, chartType) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement('a');
    link.download = `${selectedCategory}_${selectedCountry}_${chartType}.png`;
    link.href = canvas.toDataURL();
    link.click();
    // Log download activity to backend
    try {
      await axios.post('/api/dashboard/download_chart/', {
        chart_type: chartType,
        country: selectedCountry,
        category: selectedCategory,
        year_range: yearRange,
        selected_year: selectedYear
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div style={{ marginLeft: '240px', padding: '40px 0' }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '18px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      padding: '32px',
      position: 'relative'
    }}>
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7fafd',
        borderRadius: '12px',
        padding: '18px 0'
      }}>
        <label style={{ fontWeight: 500, color: '#3a3a3a' }}>
          Country:
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            style={{
              marginLeft: '8px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #b0c4de',
              fontSize: '1rem',
              background: '#f7fafd'
            }}>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '20px', fontWeight: 500, color: '#3a3a3a' }}>
          Category:
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              marginLeft: '8px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #b0c4de',
              fontSize: '1rem',
              background: '#f7fafd'
            }}>
            {categories.filter(category => category !== 'GDP(Current US$)').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '20px', fontWeight: 500, color: '#3a3a3a' }}>
          Year Range:
          <input
            type="range"
            min={years[0]}
            max={years[years.length - 1]}
            value={yearRange[0]}
            onChange={e => setYearRange([Number(e.target.value), yearRange[1]])}
            style={{ width: '120px', margin: '0 10px', accentColor: '#8884d8' }}
          />
          <input
            type="range"
            min={years[0]}
            max={years[years.length - 1]}
            value={yearRange[1]}
            onChange={e => setYearRange([yearRange[0], Number(e.target.value)])}
            style={{ width: '120px', accentColor: '#8884d8' }}
          />
          <span style={{ marginLeft: '10px', fontWeight: 600, color: '#8884d8' }}>{yearRange[0]} - {yearRange[1]}</span>
        </label>
        <label style={{ marginLeft: '20px', fontWeight: 500, color: '#3a3a3a' }}>
          Grouped Chart Year:
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            style={{ marginLeft: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #b0c4de', fontSize: '1rem', background: '#f7fafd' }}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0 24px 0', gap: '16px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
          <h2 style={{ textAlign: 'center', color: '#3a3a3a', fontWeight: 600, fontSize: '1.5rem', margin: 0 }}>
            {selectedCategory} of {selectedCountry} Over Years
          </h2>
          <button
            style={{
              marginLeft: '12px',
              padding: '8px 18px',
              background: '#8884d8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(31,38,135,0.07)'
            }}
            onClick={async () => {
              if (!allChartsRef.current) return;
              const canvas = await html2canvas(allChartsRef.current);
              const link = document.createElement('a');
              link.download = `${selectedCategory}_${selectedCountry}_all_charts.png`;
              link.href = canvas.toDataURL();
              link.click();
              try {
                await axios.post('/api/dashboard/download_chart/', {
                  chart_type: 'all',
                  country: selectedCountry,
                  category: selectedCategory,
                  year_range: yearRange,
                  selected_year: selectedYear
                });
              } catch (err) {}
            }}
          >Download All Charts</button>
        </div>
        {selectedCategory === 'Unemployment' && (
          <div style={{ textAlign: 'center', color: '#8884d8', fontWeight: 500, fontSize: '1rem', marginTop: '8px' }}>
            Y-axis: % of total labor force
          </div>
        )}
      </div>
  <div ref={allChartsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
        <div style={{ flex: 1, minWidth: '400px' }}>
          <h3>Line Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.filter(item =>
              item.country === selectedCountry &&
              item.category === selectedCategory &&
              item.year >= yearRange[0] &&
              item.year <= yearRange[1]
            ).sort((a, b) => a.year - b.year)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 14, fontWeight: 500, fill: '#3a3a3a' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name={selectedCategory} />
            </LineChart>
          </ResponsiveContainer>
          <h3>Area Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.filter(item =>
              item.country === selectedCountry &&
              item.category === selectedCategory &&
              item.year >= yearRange[0] &&
              item.year <= yearRange[1]
            ).sort((a, b) => a.year - b.year)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 14, fontWeight: 500, fill: '#3a3a3a' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" name={selectedCategory} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: '400px', background: '#f7fafd', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(31,38,135,0.07)' }}>
          <h3>Bar Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.filter(item =>
              item.country === selectedCountry &&
              item.category === selectedCategory &&
              item.year >= yearRange[0] &&
              item.year <= yearRange[1]
            ).sort((a, b) => a.year - b.year)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 14, fontWeight: 500, fill: '#3a3a3a' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name={selectedCategory} />
            </BarChart>
          </ResponsiveContainer>
          <h3>Grouped Bar Chart (GDP, Population, Unemployment by Country)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={countries.map(country => {
                const gdp = data.find(d => d.country === country && d.category === 'GDP' && d.year === selectedYear);
                const pop = data.find(d => d.country === country && d.category === 'Population' && d.year === selectedYear);
                const unemp = data.find(d => d.country === country && d.category === 'Unemployment' && d.year === selectedYear);
                return {
                  country,
                  GDP: gdp ? gdp.value : 0,
                  Population: pop ? pop.value : 0,
                  Unemployment: unemp ? unemp.value : 0
                };
              })}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 14, fontWeight: 500, fill: '#3a3a3a' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="GDP" fill="#8884d8" />
              <Bar dataKey="Population" fill="#82ca9d" />
              <Bar dataKey="Unemployment" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '10px' }}>
            <span>Year: {selectedYear}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DashboardCharts;
