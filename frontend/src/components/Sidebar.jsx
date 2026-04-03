import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Map as MapIcon, 
  PawPrint, 
  Trees, 
  Leaf, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard',
  },
  {
    label: 'Threat Detection',
    icon: <ShieldAlert size={20} />,
    path: '/threat-detection',
    children: [
      { label: 'Live Alerts', path: '/threat-detection/live-alerts' },
      { label: 'Alert History', path: '/threat-detection/history' },
    ],
  },
  {
    label: 'Geo-Fencing',
    icon: <MapIcon size={20} />,
    path: '/geo-fencing',
    children: [
      { label: 'Zone Monitoring', path: '/geo-fencing/zones' },
      { label: 'Activity Logs', path: '/geo-fencing/logs' },
    ],
  },
  {
    label: 'Species Alerts',
    icon: <PawPrint size={20} />,
    path: '/species',
    children: [
      { label: 'Detection Feed', path: '/species/feed' },
      { label: 'Species Records', path: '/species/records' },
    ],
  },
  {
    label: 'Well-Being Insights',
    icon: <Leaf size={20} />,
    path: '/insights',
    children: [
      { label: 'Environmental Trends', path: '/insights/trends' },
      { label: 'Recommendations', path: '/insights/recommendations' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon-wrapper">
            <Trees size={28} className="logo-icon-svg" />
          </div>
          <div>
            <h1 className="logo-title">Viyal</h1>
            <p className="logo-sub">AI Forest Monitor</p>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.officeName?.[0] || 'F'}</div>
        <div className="user-info">
          <p className="user-office">{user?.officeName}</p>
          <p className="user-forest">{user?.forest}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.path} className="nav-group">
            <NavLink
              to={item.path}
              end={!item.children}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
            {item.children && (
              <div className="nav-children">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `nav-child ${isActive ? 'nav-child--active' : ''}`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <p className="sidebar-district">District: {user?.district}</p>
      </div>
    </aside>
  );
}
