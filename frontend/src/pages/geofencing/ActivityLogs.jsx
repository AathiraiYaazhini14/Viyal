import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import { 
  Repeat, 
  Timer, 
  Moon, 
  PawPrint, 
  Axe, 
  Flame, 
  CheckCircle, 
  FileText 
} from 'lucide-react';
import '../shared.css';

const eventIcon = (event) => ({
  'Repeated Entry': <Repeat size={16} />,
  'Loitering': <Timer size={16} />,
  'Night Movement': <Moon size={16} />,
  'Cattle Grazing': <PawPrint size={16} />,
  'Chainsaw Sound': <Axe size={16} />,
  'Fire Smoke Detected': <Flame size={16} />,
  'Routine Patrol': <CheckCircle size={16} />,
}[event] || <FileText size={16} />);

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/zones/logs').then(r => setLogs(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Activity Logs"
        subtitle="All zone activity events including intrusions, loitering and patrol records"
        badge={<span className="count-badge">{logs.length} events</span>}
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="panel-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Zone</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#8a9bb0', padding: 30 }}>No activity logs found</td></tr>
                ) : logs.map((log, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{eventIcon(log.event)}</span>
                        <span style={{ fontWeight: 600 }}>{log.event}</span>
                      </span>
                    </td>
                    <td><span className="zone-name-tag">{log.zoneName}</span></td>
                    <td style={{ color: '#4a6b82', fontSize: 12.5 }}>{log.details}</td>
                    <td style={{ color: '#6b7a8d', fontSize: 12 }}>{new Date(log.time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
