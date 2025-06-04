// src/pages/StatusHistory.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { config } from '../config';

function StatusHistory() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/status/incidents/all`, {
          headers: {
            Authorization: `Bearer ${config.botAPIToken}`,
          },
        });
        if (!res.ok) throw new Error('Failed to load incidents');
        const data = await res.json();
        setIncidents(data);
      } catch (err) {
        console.error('[Load History Failed]', err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchIncidents();
  }, []);

  const getColor = (sev) => {
    switch (sev) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      case 'critical': return 'darkred';
      default: return '#ccc';
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Incident History
        </h1>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {incidents.map((i) => (
          <div
            key={i._id}
            style={{
              border: `2px solid ${getColor(i.severity)}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              [{i.source?.toUpperCase() || 'UNKNOWN'}] {i.title}
            </h2>
            <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              ID: {i._id}
            </p>
            <p>Type: <b>{i.type}</b> | Severity: <b>{i.severity}</b></p>
            <p>Created: {new Date(i.createdAt).toLocaleString()}</p>
            <div style={{ marginTop: '0.75rem' }}>
              <b>Updates:</b>
              {i.updates?.length > 0 ? (
                i.updates.map((u, idx) => (
                  <pre
                    key={idx}
                    style={{
                      background: '#1e1e1e',
                      color: '#eee',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      overflowX: 'auto',
                      marginTop: '0.5rem',
                    }}
                  >
{`${u.message}\n(${new Date(u.timestamp).toLocaleString()})`}
                  </pre>
                ))
              ) : (
                <p>No updates.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StatusHistory;