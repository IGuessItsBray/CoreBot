import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3341/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('[Navbar] Loaded user:', data);
        setUser(data);
      })
      .catch(err => {
        console.error('[Navbar] Failed to load user:', err);
        setUser(null);
      });
  }, []);

  const userId = user?.discordId || user?.id;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo}>CoreBot</span>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/proxies" style={styles.link}>Proxies</Link>
        <Link to="/groups" style={styles.link}>Groups</Link>
        <Link to="/servers" style={styles.link}>Servers</Link>
        <Link to="/settings" style={styles.link}>Settings</Link>
        <Link to="/status" style={styles.link}>Status</Link>
        <Link to="/docs" style={styles.link}>Docs</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <img
              src={
                user.avatar
                  ? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png`
                  : `https://cdn.discordapp.com/embed/avatars/0.png`
              }
              alt="avatar"
              style={styles.avatar}
            />
            <span>{user.username}</span>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1e1e2f',
    color: 'white'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%'
  }
};

export default Navbar;