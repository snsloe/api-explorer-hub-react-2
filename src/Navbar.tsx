import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/github-repos': return 'GitHub Explorer';
      case '/anime-facts': return 'Anime Facts';
      case '/dota-rankings': return 'Dota 2 Rankings';
      default: return 'API Explorer';
    }
  };

  const isActive = (path: string) => location.pathname.replace(/^#\/?/, '') === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">{getPageTitle()}</h1>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/github-repos" className={`nav-link ${isActive('/github-repos')}`}>GitHub Repos</Link>
          </li>
          <li className="nav-item">
            <Link to="/anime-facts" className={`nav-link ${isActive('/anime-facts')}`}>Anime Facts</Link>
          </li>
          <li className="nav-item">
            <Link to="/dota-rankings" className={`nav-link ${isActive('/dota-rankings')}`}>Dota 2 Rankings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;