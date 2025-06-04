import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Proxies from './pages/Proxies';
import Groups from './pages/Groups';
import Settings from './pages/Settings';
import Servers from './pages/Servers';
import GuildPage from './pages/GuildPage';
import Status from './pages/Status';
import StatusHistory from './pages/StatusHistory';
import Docs from './pages/Docs';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/servers/:id" element={<GuildPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proxies" element={<Proxies />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/status" element={<Status />} />
        <Route path="/status/history" element={<StatusHistory />} />
      </Routes>
    </>
  );
}

export default App;