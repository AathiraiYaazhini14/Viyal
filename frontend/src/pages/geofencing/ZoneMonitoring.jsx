import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import { MapPin, Activity } from 'lucide-react';
import '../shared.css';

const riskColors = { High: '#c0392b', Medium: '#d4820a', Low: '#27ae60' };
const typeColors = { Restricted: '#fde8e8', Buffer: '#fef3e2', Safe: '#e8f5e9' };
const typeTextColors = { Restricted: '#c0392b', Buffer: '#d4820a', Safe: '#1e8449' };

export default function ZoneMonitoring() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/zones').then(r => setZones(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Zone Monitoring"
        subtitle="Geo-fencing status and zone activity across the forest area"
        badge={<span className="count-badge">{zones.length} zones</span>}
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="zones-grid">
            {zones.map(zone => (
              <div key={zone._id} className="zone-card">
                <div className="zone-card-header">
                  <div>
                    <h3 className="zone-name">{zone.name}</h3>
                    <p className="zone-area">{zone.area}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                      background: typeColors[zone.type],
                      color: typeTextColors[zone.type],
                      padding: '2px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>{zone.type}</span>
                    <span style={{
                      color: riskColors[zone.riskLevel],
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}><Activity size={12} /> {zone.riskLevel} Risk</span>
                  </div>
                </div>

                <div className="zone-coords">
                  <MapPin size={14} /> {zone.coordinates?.lat?.toFixed(4)}°N, {zone.coordinates?.lng?.toFixed(4)}°E
                </div>

                <div className="zone-activity-preview">
                  <p className="zone-activity-title">Recent Activity ({zone.activityLogs?.length || 0} events)</p>
                  {zone.activityLogs?.slice(0, 2).map((log, i) => (
                    <div key={i} className="zone-log-item">
                      <span className="zone-log-event">{log.event}</span>
                      <span className="zone-log-time">{new Date(log.time).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  ))}
                  {zone.activityLogs?.length === 0 && <p className="zone-no-activity">No recent activity logged</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
