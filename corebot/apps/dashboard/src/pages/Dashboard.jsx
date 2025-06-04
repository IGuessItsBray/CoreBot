import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>🎉 Welcome to CoreBot</h1>
        <p>This is your dashboard home.</p>
      </div>
    </>
  );
}

export default Dashboard;