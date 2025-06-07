import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-title">Cross Sums</div>
        <nav className="header-nav">
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            Profile
          </Link>
          <Link 
            to="/scores" 
            className={`nav-link ${location.pathname === '/scores' ? 'active' : ''}`}
          >
            All-Time Scores
          </Link>
          <button 
            onClick={handleLogout}
            className="nav-link logout"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
