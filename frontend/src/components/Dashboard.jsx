import React, { useState, useEffect } from 'react';
import { getEmissions, getSummary, ingestData, seedDemoData } from '../services/api';
import EmissionsChart from './EmissionsChart';

const Dashboard = () => {
  const [emissions, setEmissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [source, setSource] = useState('electricity');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [emissionsRes, summaryRes] = await Promise.all([
        getEmissions(),
        getSummary(),
      ]);
      setEmissions(emissionsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to fetch data. Please make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!value) return;
    try {
      await ingestData({ source, value: parseFloat(value) });
      setValue('');
      fetchData();
    } catch (err) {
      setError('Failed to ingest data.');
      console.error(err);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      setError(null);
      await seedDemoData({ records: 120, reset: true });
      await fetchData();
    } catch (err) {
      setError('Failed to load demo dataset from backend.');
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>ESG Carbon Monitoring</h1>
      {error && <div className="error-banner">{error}</div>}
      <div className="dashboard">
        <div className="card summary-card">
          <h2>Total Emissions</h2>
          <p>{summary?.total_emissions?.toFixed(2) ?? '0.00'} kg CO₂</p>
        </div>
        <div className="card summary-card">
          <h2>Emissions by Source</h2>
          {summary?.by_source && Object.keys(summary.by_source).length > 0 ? (
            <ul>
              {Object.entries(summary.by_source).map(([src, val]) => (
                <li key={src}>{src}: {val?.toFixed(2) ?? '0.00'} kg CO₂</li>
              ))}
            </ul>
          ) : (
            <p>No data by source.</p>
          )}
        </div>
        <div className="card ingestion-form">
          <h2>Ingest Data</h2>
          <button type="button" onClick={handleSeedDemo} disabled={seeding}>
            {seeding ? 'Loading Demo Data...' : 'Load Demo Data (Dataset)'}
          </button>
          <form onSubmit={handleIngest}>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="electricity">Electricity (kWh)</option>
              <option value="fuel">Fuel (Liters)</option>
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              step="0.1"
            />
            <button type="submit">Ingest</button>
          </form>
        </div>
        <div className="card chart-card">
          <h2>Emissions Over Time</h2>
          <EmissionsChart emissions={emissions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
