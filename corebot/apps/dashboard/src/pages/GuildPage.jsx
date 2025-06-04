import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { config } from '../config';

function GuildPage() {
  const { id: guildId } = useParams();
  const [guild, setGuild] = useState(null);
  const [error, setError] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const fetchGuild = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${config.apiBaseUrl}/auth/me/guilds`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${text}`);
        }

        const data = await res.json();
        const found = data.find((g) => g.id === guildId);
        if (!found) throw new Error('Guild not found in user guilds');

        setGuild(found);
      } catch (err) {
        console.error('[Guild Load Failed]', err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchGuild();
  }, [guildId]);

  const getRole = (g) => {
    if (g.owner) return 'Owner';
    if (g.permissions & 0x8) return 'Admin';
    if (g.permissions & 0x20) return 'Manage Server';
    return 'Member';
  };

  const joinLink = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&guild_id=${guildId}&scope=bot+applications.commands&permissions=8`;

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>
      </>
    );
  }

  if (!guild) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '2rem' }}>Loading guild data...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Link to="/servers" style={{ color: '#7289DA', textDecoration: 'none' }}>
          ← Back to Servers
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
          {guild.icon && (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                marginRight: '1.5rem',
                border: '2px solid #ccc',
              }}
            />
          )}
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{guild.name}</h1>
            <p><strong>ID:</strong> {guild.id}</p>
            <p><strong>Role:</strong> {getRole(guild)}</p>
            <p><strong>Bot Present:</strong> {guild.botIn ? 'Yes' : 'No'}</p>
            {!guild.botIn && guild.owner && (
              <a
                href={joinLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#5865F2',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                Invite Bot to Server
              </a>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <div>
            <strong>Features:</strong>{' '}
            {guild.features?.length ? (
              <>
                <span>{guild.features.length}</span>{' '}
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  {showFeatures ? 'Hide' : 'Show'}
                </button>
                {showFeatures && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                    {guild.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              'None'
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GuildPage;