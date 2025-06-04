// apps/dashboard/src/components/StatusReporter.jsx
import { useEffect } from 'react';
import config from '../config.js';

export default function StatusReporter() {
  useEffect(() => {
    const reportLatency = async () => {
      const start = Date.now();
      try {
        const res = await fetch(`${config.apiBaseUrl}/health`);
        await res.json();
        const latency = Date.now() - start;

        await fetch(`${config.apiBaseUrl}/status/report`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'dashboard',
            latency,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('[Latency] Dashboard status report failed:', err);
      }
    };

    const interval = setInterval(reportLatency, 30_000);
    reportLatency(); // do one immediately
    return () => clearInterval(interval);
  }, []);

  return null;
}