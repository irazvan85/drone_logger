import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">Drone Photo GPS Visualizer</Link>
      </div>
      <nav className="header-nav">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
