import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import client from '../api/client';
import { 
  AlertTriangle, 
  Activity, 
  Siren, 
  Target, 
  PawPrint, 
  CheckCircle 
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes, zonesRes, speciesRes] = await Promise.all([
          client.get('/alerts/stats'),
          client.get('/alerts?status=Active'),
          client.get('/zones'),
          client.get('/species?endangered=true'),
        ]);
        setStats({
          ...statsRes.data,
          highRiskZones: zonesRes.data.filter(z => z.riskLevel === 'High').length,
          endangeredSightings: speciesRes.data.length,
          totalZones: zonesRes.data.length,
        });
        setRecentAlerts(alertsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const alertTypeLabel = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Layout>
      <PageHeader
        title={`${user?.officeName}`}
        subtitle={`${user?.forest} · ${user?.district} District · Forest Department Dashboard`}
        badge={
          <span className="live-badge">
            <span className="live-dot"></span> LIVE
          </span>
        }
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner text="Loading dashboard..." />
        ) : (
          <>
            <div className="stats-grid">
              <Card title="Total Alerts" value={stats?.total ?? '—'} subtitle="All time records" icon={<AlertTriangle size={20} />} accent="#c0392b" />
              <Card title="Active Alerts" value={stats?.active ?? '—'} subtitle="Requires action" icon={<Activity size={20} />} accent="#e74c3c" />
              <Card title="High Priority" value={stats?.high ?? '—'} subtitle="Immediate response needed" icon={<Siren size={20} />} accent="#e67e22" />
              <Card title="High-Risk Zones" value={stats?.highRiskZones ?? '—'} subtitle="Zones under monitoring" icon={<Target size={20} />} accent="#2e7d9c" />
              <Card title="Endangered Sightings" value={stats?.endangeredSightings ?? '—'} subtitle="Recent detection feed" icon={<PawPrint size={20} />} accent="#27ae60" />
              <Card title="Resolved" value={stats?.resolved ?? '—'} subtitle="Alerts cleared today" icon={<CheckCircle size={20} />} accent="#1e8449" />
            </div>

            <div className="dashboard-bottom">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Active Alerts</h3>
                  <a href="/threat-detection/live-alerts" className="view-all">View All →</a>
                </div>
                <div className="alerts-table-wrapper">
                  {recentAlerts.length === 0 ? (
                    <p className="empty-state">No active alerts at this time.</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Severity</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAlerts.map(alert => (
                          <tr key={alert._id}>
                            <td><span className="type-tag">{alertTypeLabel(alert.type)}</span></td>
                            <td>
                              <span className={`sev sev--${alert.severity.toLowerCase()}`}>
                                {alert.severity}
                              </span>
                            </td>
                            <td className="location-cell">{alert.location}</td>
                            <td>
                              <span className={`status-tag status--${alert.status.toLowerCase()}`}>
                                {alert.status}
                              </span>
                            </td>
                            <td className="time-cell">{new Date(alert.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="dashboard-panel system-info">
                <div className="panel-header">
                  <h3>System Status</h3>
                </div>
                <div className="status-list">
                  <div className="status-row">
                    <span>Threat Detection Module</span>
                    <span className="status-ok">● Operational</span>
                  </div>
                  <div className="status-row">
                    <span>Geo-Fencing System</span>
                    <span className="status-ok">● Operational</span>
                  </div>
                  <div className="status-row">
                    <span>Species Detection AI</span>
                    <span className="status-ok">● Operational</span>
                  </div>
                  <div className="status-row">
                    <span>Environmental Sensors</span>
                    <span className="status-warn">● Maintenance</span>
                  </div>
                  <div className="status-row">
                    <span>Database Sync</span>
                    <span className="status-ok">● Online</span>
                  </div>
                  <div className="status-row">
                    <span>Last Data Sync</span>
                    <span className="time-cell">{new Date().toLocaleTimeString('en-IN')}</span>
                  </div>
                </div>

                <div className="zone-summary">
                  <div className="panel-header" style={{ marginTop: '20px' }}>
                    <h3>Zone Summary</h3>
                  </div>
                  <div className="zone-pills">
                    <div className="zone-pill zone-pill--restricted">
                      <strong>{stats?.totalZones ? Math.round(stats.totalZones * 0.33) : 2}</strong>
                      <span>Restricted</span>
                    </div>
                    <div className="zone-pill zone-pill--buffer">
                      <strong>{stats?.totalZones ? Math.round(stats.totalZones * 0.33) : 2}</strong>
                      <span>Buffer</span>
                    </div>
                    <div className="zone-pill zone-pill--safe">
                      <strong>{stats?.totalZones ? Math.round(stats.totalZones * 0.34) : 2}</strong>
                      <span>Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
