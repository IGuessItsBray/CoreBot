import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { config } from '../config';
import Navbar from '../components/Navbar';
import { marked } from 'marked';

Modal.setAppElement('#root');

function Proxies() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProxy, setNewProxy] = useState({});

  const fetchProxies = async () => {
    try {
      const userToken = localStorage.getItem('token');
      const meRes = await fetch(`${config.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const me = await meRes.json();

      const proxyRes = await fetch(`${config.apiBaseUrl}/system/${me.systemId}/proxies`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` },
      });

      const proxyList = await proxyRes.json();
      const sortedList = proxyList.sort((a, b) =>
        (a.display_name || a.name).localeCompare(b.display_name || b.name)
      );
      setProxies(sortedList);
    } catch (err) {
      console.error('[Proxies Error]', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxies();
  }, []);

  const handleEditClick = (proxy) => {
    setEditForm({ ...proxy, systemId: proxy.systemId || proxy.system || 'UNKNOWN' });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const url = `${config.apiBaseUrl}/system/${editForm.systemId}/proxies/${editForm.id}`;
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Update failed');

      setEditModalOpen(false);
      fetchProxies();
    } catch (err) {
      console.error('[Edit Failed]', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('token');
      const meRes = await fetch(`${config.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const me = await meRes.json();

      const payload = {
        ...newProxy,
        proxyTags: {
          prefix: newProxy.prefixTags || [],
          suffix: newProxy.suffixTags || [],
        },
      };

      const res = await fetch(`${config.apiBaseUrl}/system/${me.systemId}/proxies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create proxy');

      setAddModalOpen(false);
      setNewProxy({});
      fetchProxies();
    } catch (err) {
      console.error('[Add Failed]', err);
    }
  };

  const filteredProxies = proxies.filter((p) => {
    const query = search.toLowerCase();
    return (
      (p.display_name || p.name).toLowerCase().includes(query) ||
      (p.pronouns || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Your Proxies</h1>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', width: '60%' }}
          />
          <button onClick={() => setAddModalOpen(true)} style={{ marginLeft: '1rem' }}>Add Member</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {filteredProxies.map((proxy) => {
            const expanded = expandedId === proxy.id;
            const tags = (proxy.proxyTags?.prefix || []).concat(proxy.proxyTags?.suffix || []).join(', ') || 'None';
            const display = proxy.display_name || proxy.name;

            return (
              <div
                key={proxy.id}
                onClick={() => setExpandedId(expanded ? null : proxy.id)}
                style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: '0.2s ease-in-out',
                }}
              >
                <img
                  src={proxy.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                  }}
                  alt="avatar"
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                    border: '2px solid #999',
                    marginBottom: '0.75rem',
                  }}
                />
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>{display}</div>

                {expanded && (
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    background: '#fafafa',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                  }}>
                    <p><b>ID:</b> {proxy.id}</p>
                    <p><b>Display Name:</b> {proxy.display_name || '—'}</p>
                    {proxy.description && (
                      <div><b>Description:</b><div dangerouslySetInnerHTML={{ __html: marked(proxy.description) }} /></div>
                    )}
                    {proxy.pronouns && <p><b>Pronouns:</b> {proxy.pronouns}</p>}
                    <p><b>Tags:</b> {tags}</p>
                    <p><b>Messages:</b> {proxy.messageCount ?? 0} · <b>Chars:</b> {proxy.characterCount ?? 0}</p>
                    <button onClick={() => handleEditClick(proxy)} style={{ marginTop: '1rem' }}>Edit</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Modal isOpen={editModalOpen} onRequestClose={() => setEditModalOpen(false)} contentLabel="Edit Member" style={{ content: { maxWidth: '500px', margin: 'auto' } }}>
          <h2>Edit Member</h2>
          <form onSubmit={handleEditSubmit}>
            <input placeholder="Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /><br />
            <input placeholder="Display Name" value={editForm.display_name || ''} onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })} /><br />
            <input placeholder="Avatar URL" value={editForm.avatar || ''} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })} /><br />
            <input placeholder="Banner URL" value={editForm.banner || ''} onChange={(e) => setEditForm({ ...editForm, banner: e.target.value })} /><br />
            <input placeholder="Pronouns" value={editForm.pronouns || ''} onChange={(e) => setEditForm({ ...editForm, pronouns: e.target.value })} /><br />
            <textarea placeholder="Description" value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /><br />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
          </form>
        </Modal>

        <Modal isOpen={addModalOpen} onRequestClose={() => setAddModalOpen(false)} contentLabel="Add Member" style={{ content: { maxWidth: '500px', margin: 'auto' } }}>
          <h2>Add Member</h2>
          <form onSubmit={handleAddSubmit}>
            <input placeholder="Name" value={newProxy.name || ''} onChange={(e) => setNewProxy({ ...newProxy, name: e.target.value })} /><br />
            <input placeholder="Avatar URL" value={newProxy.avatar || ''} onChange={(e) => setNewProxy({ ...newProxy, avatar: e.target.value })} /><br />
            <input placeholder="Pronouns" value={newProxy.pronouns || ''} onChange={(e) => setNewProxy({ ...newProxy, pronouns: e.target.value })} /><br />
            <input placeholder="Prefix Tags (comma-separated)" value={newProxy.prefixTags || ''} onChange={(e) => setNewProxy({ ...newProxy, prefixTags: e.target.value.split(',').map(t => t.trim()) })} /><br />
            <input placeholder="Suffix Tags (comma-separated)" value={newProxy.suffixTags || ''} onChange={(e) => setNewProxy({ ...newProxy, suffixTags: e.target.value.split(',').map(t => t.trim()) })} /><br />
            <textarea placeholder="Description" value={newProxy.description || ''} onChange={(e) => setNewProxy({ ...newProxy, description: e.target.value })} /><br />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setAddModalOpen(false)}>Cancel</button>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default Proxies;
