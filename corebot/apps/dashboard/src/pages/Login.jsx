import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem('token');
  console.log('[Login] found token:', token);
  if (token) {
    navigate('/dashboard');
  }
}, [navigate]);

  const loginWithDiscord = () => {
  window.location.href = 'http://localhost:3341/auth/login';
};

  return (
    <div className="login-container">
      <h1>Welcome to CoreBot Dashboard</h1>
      <button onClick={loginWithDiscord}>Login with Discord</button>
    </div>
  );
}

export default Login;