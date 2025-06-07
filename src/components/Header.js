import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ display: 'flex', gap: '2rem', padding: '1rem', background: '#e9f3fa' }}>
      <Link to="/profile">Profile</Link>
      <Link to="/scores">All-Time Scores</Link>
      <Link to="/login">Logout</Link>
    </header>
  );
}
