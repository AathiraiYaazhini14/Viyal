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
  AlertTriangle 
} from 'lucide-react';
import '../shared.css';

const typeLabel = (type) => type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const typeIcon = (type) => ({
  human_intrusion: <UserSearch size={16} />,
  vehicle: <Car size={16} />,
  chainsaw: <Axe size={16} />,
  gunshot: <Target size={16} />,
  fire: <Flame size={16} />,
  landslide: <Mountain size={16} />
}[type] || <AlertTriangle size={16} />);

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/alerts').then(res => setAlerts(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const grouped = alerts.reduce((acc, alert) => {
    const date = new Date(alert.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(alert);
    return acc;
  }, {});

  return (
    <Layout>
      <PageHeader
        title="Alert History"
        subtitle="Complete log of all threat detection events"
        badge={<span className="count-badge">{alerts.length} total</span>}
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          Object.keys(grouped).length === 0 ? (
            <div className="empty-panel">No alert history found.</div>
          ) : (
            Object.entries(grouped).map(([date, dayAlerts]) => (
              <div key={date} className="history-group">
                <div className="history-date-header">
                  <span>{date}</span>
                  <span className="history-count">{dayAlerts.length} events</span>
                </div>
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
                    {dayAlerts.map(alert => (
                      <tr key={alert._id}>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{typeIcon(alert.type)}</span>
                            <span>{typeLabel(alert.type)}</span>
                          </span>
                        </td>
                        <td><AlertBadge severity={alert.severity} /></td>
                        <td>{alert.location}</td>
                        <td><AlertBadge status={alert.status} /></td>
                        <td>{new Date(alert.createdAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )
        )}
      </div>
    </Layout>
  );
}
