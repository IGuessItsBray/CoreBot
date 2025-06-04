import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { config } from '../config';

function Status() {
  const [reports, setReports] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [expandedIncident, setExpandedIncident] = useState(null);
  const [newIncident, setNewIncident] = useState({
    title: '',
    severity: 'low',
    type: 'outage',
    source: '',
    updates: [{ message: '' }]
  });

  const isAdmin = user?.id === '530845321270657085';

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [meRes, reportRes, incidentRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${config.apiBaseUrl}/status/reports`, {
            headers: { Authorization: `Bearer ${config.botAPIToken}` },
          }),
          fetch(`${config.apiBaseUrl}/status/incidents/active`, {
            headers: { Authorization: `Bearer ${config.botAPIToken}` },
          }),
        ]);

        const me = await meRes.json();
        const reportData = await reportRes.json();
        const incidentData = await incidentRes.json();

        setUser(me);
        setReports(reportData);
        setIncidents(incidentData);
      } catch (err) {
        console.error('[Load Status Failed]', err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchData();
  }, []);

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${config.apiBaseUrl}/status/incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify(newIncident),
      });
      if (!res.ok) throw new Error('Failed to create incident');
      const created = await res.json();
      setIncidents(prev => [created, ...prev]);
      setNewIncident({
        title: '',
        severity: 'low',
        type: 'outage',
        source: '',
        updates: [{ message: '' }]
      });
    } catch (err) {
      console.error('[Create Incident Failed]', err);
    }
  };

  const resolveIncident = async (id) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/status/incident/${id}/resolve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to resolve incident');
      setIncidents(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('[Resolve Failed]', err);
    }
  };

  const getColor = (sev) => {
    switch (sev) {
      case 'high': return 'rgba(255, 0, 0, 0.2)';
      case 'medium': return 'rgba(255, 165, 0, 0.2)';
      case 'low': return 'rgba(255, 255, 0, 0.2)';
      case 'critical': return 'rgba(139, 0, 0, 0.2)';
      default: return 'rgba(200, 200, 200, 0.2)';
    }
  };

  const formatSource = (src) => src.charAt(0).toUpperCase() + src.slice(1);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>System Status</h1>
        <Link to="/status/history" style={{ fontSize: '0.9rem', color: '#007bff', textDecoration: 'underline', marginBottom: '1.5rem', display: 'inline-block' }}>
          View Incident History →
        </Link>

        {isAdmin && (
          <form onSubmit={handleIncidentSubmit} style={{ marginBottom: '2rem' }}>
            <input
              placeholder="Source"
              value={newIncident.source}
              onChange={(e) => setNewIncident({ ...newIncident, source: e.target.value })}
              required
            />
            <select
              value={newIncident.severity}
              onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={newIncident.type}
              onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
            >
              <option value="outage">Outage</option>
              <option value="degraded">Degraded</option>
              <option value="maintenance">Maintenance</option>
              <option value="notice">Notice</option>
            </select>
            <input
              placeholder="Title"
              value={newIncident.title}
              onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
              required
            />
            <input
              placeholder="Initial Update Message"
              value={newIncident.updates[0].message}
              onChange={(e) =>
                setNewIncident({
                  ...newIncident,
                  updates: [{ message: e.target.value }],
                })
              }
              required
            />
            <button type="submit">Create Incident</button>
          </form>
        )}

        {incidents.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>⚠️ Active Incidents</h2>
            {incidents.map((i) => (
              <div
                key={i._id}
                onClick={(e) => {
                  if (e.target.tagName !== 'TEXTAREA') {
                    setExpandedIncident(expandedIncident === i._id ? null : i._id);
                  }
                }}
                style={{
                  background: getColor(i.severity),
                  border: `1px solid ${getColor(i.severity).replace('0.2', '1')}`,
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {formatSource(i.source)} – {i.title}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  ID: {i._id}
                </div>
                {expandedIncident === i._id && (
                  <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                    <p><strong>Severity:</strong> {i.severity.toUpperCase()}</p>
                    <p><strong>Type:</strong> {i.type}</p>
                    {i.updates?.map((u, idx) => (
                      <div key={idx}>
                        <p><strong>Update:</strong></p>
                        <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '0.5rem', borderRadius: '0.3rem' }}>{u.message}</pre>
                        <p><strong>Time:</strong> {new Date(u.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                    {isAdmin && (
                      <button onClick={() => resolveIncident(i._id)}>Mark Resolved</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Source</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Latency (ms)</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.source}>
                <td>{r.source}</td>
                <td style={{ color: r.latency > 100 ? 'orange' : 'lightgreen' }}>{r.latency}</td>
                <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </>
  );
}

export default Status;