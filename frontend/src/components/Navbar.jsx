import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <div className="breadcrumb">
          <span className="bc-root">Viyal</span>
          <span className="bc-sep">/</span>
          <span className="bc-current">Admin Dashboard</span>
        </div>
        <div className="navbar-date">{today}</div>
      </div>

      <div className="navbar-right">
        <div className="nav-search">
          <Search size={18} className="search-icon-svg" />
          <input type="text" placeholder="Search alerts, zones..." />
        </div>
        
        <div className="nav-divider"></div>

        <div className="nav-user-badge">
          <div className="user-details">
            <span className="user-name">Officer {user?.officeName?.split(' ')[0]}</span>
            <span className="user-role">ID: TN-FD-{String(user?.id).slice(-4)}</span>
          </div>
          <div className="user-initials">{user?.officeName?.[0]}</div>
        </div>
      </div>
    </nav>
  );
}
