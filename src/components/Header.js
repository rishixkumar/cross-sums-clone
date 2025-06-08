/**
 * @fileoverview Header component for the Cross Sums application. Provides navigation links
 * and handles user authentication state. Includes the app title, GitHub link, and navigation menu.
 * 
 * @requires React
 * @requires react-router-dom
 * @requires lucide-react
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import './Header.css';

/**
 * Header component that renders the application header with navigation and authentication controls
 * 
 * @component
 * @returns {JSX.Element} Rendered header with navigation links and GitHub button
 * 
 * @example
 * <Header />
 */
export default function Header() {
  /** @type {Location} Current route location from react-router */
  const location = useLocation();
  
  /** @type {function} Navigation function from react-router */
  const navigate = useNavigate();

  /**
   * Handles user logout by removing the access token and redirecting to login
   * @function
   */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <header className="app-header" role="banner">
      <div className="header-container">
        {/* Left section with title and GitHub link */}
        <div className="header-left">
          <div className="header-title">Cross Sums</div>
          <a
            href="https://github.com/rishixkumar/cross-sums-clone"
            className="github-header-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <Github size={24} />
          </a>
        </div>

        {/* Navigation menu */}
        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            aria-current={location.pathname === '/profile' ? 'page' : undefined}
          >
            Profile
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
            aria-current={location.pathname === '/settings' ? 'page' : undefined}
          >
            Settings
          </Link>
          <Link 
            to="/scores" 
            className={`nav-link ${location.pathname === '/scores' ? 'active' : ''}`}
            aria-current={location.pathname === '/scores' ? 'page' : undefined}
          >
            All-Time Scores
          </Link>
          <button 
            onClick={handleLogout}
            className="nav-link logout"
            aria-label="Logout from account"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
