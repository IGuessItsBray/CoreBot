import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { config } from '../config';

const getRole = (guild) => {
  if (guild.owner) return 'Owner';
  if (guild.permissions & 0x20) return 'Manage Server';
  if (guild.permissions & 0x8) return 'Admin';
  return 'Member';
};

const getBorderColor = (guild) => {
  if (guild.features?.includes('PARTNERED') || guild.features?.includes('VERIFIED')) return '#7289DA'; // Discord blurple
  if (guild.owner) return '#22c55e'; // vibrant green
  if (guild.permissions & 0x20 || guild.permissions & 0x8) return '#facc15'; // bright yellow
  return '#999'; // default
};

function Servers() {
  const [guilds, setGuilds] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [retryDelay, setRetryDelay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${config.apiBaseUrl}/auth/me/guilds`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || 15;
          setRetryDelay(parseInt(retryAfter, 10));
          setTimeout(() => fetchGuilds(), retryAfter * 1000);
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${text}`);
        }

        const data = await res.json();
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setGuilds(sorted);
      } catch (err) {
        console.error('[Load Guilds Failed]', err);
        setError(err.message || 'Failed to load guilds');
      }
    };

    fetchGuilds();
  }, []);

  const filtered = guilds.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', position: 'relative' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Your Servers
        </h1>

        <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '0.9rem' }}>
          <div><span style={{ color: '#7289DA' }}>●</span> Partnered/Verified</div>
          <div><span style={{ color: '#22c55e' }}>●</span> Owner</div>
          <div><span style={{ color: '#facc15' }}>●</span> Admin/Manager</div>
          <div><span style={{ color: 'purple' }}>●</span> Bot In Server</div>
        </div>

        <input
          type="text"
          placeholder="Search servers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginBottom: '2rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '400px',
          }}
        />

        {retryDelay && <p>Rate limited. Retrying in {retryDelay} seconds...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filtered.map((g) => {
            const baseColor = getBorderColor(g);
            const split = g.botIn && baseColor !== '#999';
            const fullBorder = g.botIn && !split;

            return (
              <div
                key={g.id}
                onClick={() => navigate(`/servers/${g.id}`)}
                title={getRole(g)}
                style={{
                  borderRadius: '9999px',
                  height: '96px',
                  padding: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  background: '#1a1a1a',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  border: fullBorder
                    ? `3px solid purple`
                    : `3px solid ${split ? 'transparent' : baseColor}`,
                  borderImage: split
                    ? `linear-gradient(to right, ${baseColor} 50%, purple 50%) 1`
                    : 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {g.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
                    alt={g.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      marginRight: '1rem',
                      border: '2px solid #333',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '9999px',
                      backgroundColor: '#555',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      marginRight: '1rem',
                    }}
                  >
                    {g.name.charAt(0)}
                  </div>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{g.id}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Servers;