import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import AlertBadge from '../../components/AlertBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import { 
  UserSearch, 
  Car, 
  Axe, 
  Target, 
  Flame, 
  Mountain, 
  AlertTriangle, 
  MapPin 
} from 'lucide-react';
import '../shared.css';

const ALERT_TYPES = ['human_intrusion', 'vehicle', 'chainsaw', 'gunshot', 'fire', 'landslide'];
const SEVERITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Active', 'Investigating', 'Resolved'];

const typeLabel = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const typeIcon = (type) => ({
  human_intrusion: <UserSearch size={22} />,
  vehicle: <Car size={22} />,
  chainsaw: <Axe size={22} />,
  gunshot: <Target size={22} />,
  fire: <Flame size={22} />,
  landslide: <Mountain size={22} />
}[type] || <AlertTriangle size={22} />);

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', severity: '', status: 'Active' });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.severity) params.severity = filters.severity;
      if (filters.status) params.status = filters.status;
      const res = await client.get('/alerts', { params });
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [filters]);

  const updateStatus = async (id, status) => {
    try {
      await client.patch(`/alerts/${id}/status`, { status });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Live Alerts"
        subtitle="Real-time threat detection alerts — Active incidents requiring attention"
        badge={<span className="count-badge">{alerts.length} alerts</span>}
      />
      <div className="feature-content">
        <div className="filter-bar">
          <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="">All Types</option>
            {ALERT_TYPES.map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
          <select value={filters.severity} onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}>
            <option value="">All Severities</option>
            {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-reset" onClick={() => setFilters({ type: '', severity: '', status: 'Active' })}>Reset</button>
        </div>

        {loading ? <LoadingSpinner text="Fetching alerts..." /> : (
          <div className="alerts-grid">
            {alerts.length === 0 ? (
              <div className="empty-panel">No alerts match the current filters.</div>
            ) : alerts.map(alert => (
              <div key={alert._id} className={`alert-card alert-card--${alert.severity.toLowerCase()}`}>
                <div className="alert-card-top">
                  <div className="alert-type-icon">{typeIcon(alert.type)}</div>
                  <div className="alert-main">
                    <span className="alert-type-label">{typeLabel(alert.type)}</span>
                    <p className="alert-location"><MapPin size={14} /> {alert.location}</p>
                  </div>
                  <div className="alert-badges">
                    <AlertBadge severity={alert.severity} />
                    <AlertBadge status={alert.status} />
                  </div>
                </div>
                <p className="alert-desc">{alert.description}</p>
                <div className="alert-card-footer">
                  <span className="alert-time">{new Date(alert.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  {alert.status !== 'Resolved' && (
                    <div className="alert-actions">
                      {alert.status === 'Active' && (
                        <button className="btn-action btn-investigate" onClick={() => updateStatus(alert._id, 'Investigating')}>
                          Investigate
                        </button>
                      )}
                      <button className="btn-action btn-resolve" onClick={() => updateStatus(alert._id, 'Resolved')}>
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
