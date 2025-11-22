import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/">Map View</Link></li>
          <li><Link to="/import">Import Photos</Link></li>
          <li><Link to="/export">Export Data</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
