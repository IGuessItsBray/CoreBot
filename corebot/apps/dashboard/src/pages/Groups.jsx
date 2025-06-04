import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { config } from '../config';
import Navbar from '../components/Navbar';

Modal.setAppElement('#root');

function Groups() {
  const [groups, setGroups] = useState([]);
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedProxy, setSelectedProxy] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', avatar: '', banner: '' });

  useEffect(() => {
    const fetchGroupsAndProxies = async () => {
      try {
        const userToken = localStorage.getItem('token');
        const meRes = await fetch(`${config.apiBaseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const me = await meRes.json();

        const [groupRes, proxyRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/system/${me.systemId}/groups`, {
            headers: { Authorization: `Bearer ${config.botAPIToken}` },
          }),
          fetch(`${config.apiBaseUrl}/system/${me.systemId}/proxies`, {
            headers: { Authorization: `Bearer ${config.botAPIToken}` },
          }),
        ]);

        const groupList = await groupRes.json();
        const proxyList = await proxyRes.json();

        setGroups(groupList);
        setProxies(proxyList);
      } catch (err) {
        console.error('[Groups Error]', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndProxies();
  }, []);

  const handleRemoveProxy = async (groupId, memberId) => {
    try {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;
      const updatedMembers = group.members.filter(id => id !== memberId);

      const userToken = localStorage.getItem('token');
      const meRes = await fetch(`${config.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const me = await meRes.json();

      await fetch(`${config.apiBaseUrl}/system/${me.systemId}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify({ members: updatedMembers }),
      });

      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: updatedMembers } : g));
    } catch (err) {
      console.error('[Remove Failed]', err);
    }
  };

  const handleAddProxy = async (groupId, proxyId) => {
    try {
      await fetch(`${config.apiBaseUrl}/group/${groupId}/add-member`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify({ proxyId })
      });
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: [...g.members, proxyId] } : g));
    } catch (err) {
      console.error('[Add Failed]', err);
    }
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('token');
      const meRes = await fetch(`${config.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const me = await meRes.json();

      const payload = { ...newGroup, systemId: me.systemId, members: [] };

      const res = await fetch(`${config.apiBaseUrl}/system/${me.systemId}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create group');

      setAddModalOpen(false);
      setNewGroup({ name: '', description: '', avatar: '', banner: '' });

      const newGroupData = await res.json();
      setGroups(prev => [...prev, newGroupData]);
    } catch (err) {
      console.error('[Add Group Failed]', err);
    }
  };

  const filteredGroups = groups
    .sort((a, b) => (a.display_name || a.name || '').localeCompare(b.display_name || b.name || ''))
    .filter((g) => (g.display_name || g.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Your Groups</h1>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', width: '60%' }}
          />
          <button onClick={() => setAddModalOpen(true)} style={{ marginLeft: '1rem' }}>Add Group</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {filteredGroups.map((group) => {
            const expanded = expandedId === group.id;

            return (
              <div
                key={group.id}
                onClick={() => setExpandedId(expanded ? null : group.id)}
                style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: '0.2s ease-in-out'
                }}
              >
                <img
                  src={group.avatar || 'https://cdn.discordapp.com/embed/avatars/1.png'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/1.png';
                  }}
                  alt="avatar"
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                    border: '2px solid #999',
                    marginBottom: '0.75rem'
                  }}
                />
                <div style={{ display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '9999px', backgroundColor: '#f3f3f3', fontSize: '0.9rem', fontWeight: 500 }}>
                  {group.display_name || group.name}
                </div>

                {expanded && (
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'left' }}>
                    {group.description && <p><b>Description:</b> {group.description}</p>}
                    <p><b>Members:</b></p>
                    <ul>
                      {(group.members || []).map(id => {
                        const p = proxies.find(x => x.id === id);
                        return (
                          <li key={id}>
                            {p?.display_name || p?.name || id}
                            <button
                              style={{ marginLeft: '0.5rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProxy(group.id, id);
                              }}
                            >Remove</button>
                          </li>
                        );
                      })}
                    </ul>
                    <select
                      value={selectedProxy}
                      onChange={(e) => setSelectedProxy(e.target.value)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      <option value="">Select Proxy</option>
                      {proxies.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.display_name || p.name || p.id}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedProxy) handleAddProxy(group.id, selectedProxy);
                      }}
                    >Add</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Modal isOpen={addModalOpen} onRequestClose={() => setAddModalOpen(false)} contentLabel="Add Group" style={{ content: { maxWidth: '500px', margin: 'auto' } }}>
          <h2>Add Group</h2>
          <form onSubmit={handleAddGroup}>
            <input placeholder="Name" value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} /><br />
            <input placeholder="Avatar URL" value={newGroup.avatar} onChange={(e) => setNewGroup({ ...newGroup, avatar: e.target.value })} /><br />
            <input placeholder="Banner URL" value={newGroup.banner} onChange={(e) => setNewGroup({ ...newGroup, banner: e.target.value })} /><br />
            <textarea placeholder="Description" value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} /><br />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setAddModalOpen(false)}>Cancel</button>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Groups;