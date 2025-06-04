import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  console.log('[Callback] token:', token);

  if (token) {
    localStorage.setItem('token', token);
    console.log('[Callback] token saved to localStorage');
    navigate('/dashboard');
  } else {
    console.log('[Callback] no token, redirecting to login');
    navigate('/');
  }
}, [navigate]);

  return <p>Logging in...</p>;
}

export default Callback;