import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import { AlertTriangle, Tag, MapPin, Clock, CheckCircle, Megaphone } from 'lucide-react';
import '../shared.css';

const statusColors = {
  CR: { bg: '#fde8e8', color: '#8e1111', label: 'Critically Endangered' },
  EN: { bg: '#fde8e8', color: '#c0392b', label: 'Endangered' },
  VU: { bg: '#fef3e2', color: '#d4820a', label: 'Vulnerable' },
  NT: { bg: '#e8f0fe', color: '#2471a3', label: 'Near Threatened' },
  LC: { bg: '#e8f5e9', color: '#1e8449', label: 'Least Concern' },
};

export default function DetectionFeed() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertSent, setAlertSent] = useState({});

  useEffect(() => {
    client.get('/species').then(r => setSpecies(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const sendAlert = async (id) => {
    try {
      await client.patch(`/species/${id}/alert`);
      setAlertSent(prev => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Detection Feed"
        subtitle="Live wildlife species detections — sorted by most recent sighting"
        badge={<span className="count-badge">{species.filter(s => s.isEndangered).length} endangered</span>}
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="species-feed-grid">
            {species.map(sp => {
              const cs = statusColors[sp.conservationStatus] || statusColors.LC;
              return (
                <div key={sp._id} className={`species-card ${sp.isEndangered ? 'species-card--endangered' : ''}`}>
                  {sp.isEndangered && <div className="endangered-ribbon"><AlertTriangle size={14} style={{ marginRight: 4 }} /> ENDANGERED</div>}
                  <div className="species-image-wrapper">
                    <img
                      src={sp.imageUrl || 'https://placehold.co/300x180/e8f0e8/4a7a4a?text=No+Image'}
                      alt={sp.name}
                      className="species-image"
                      onError={e => { e.target.src = 'https://placehold.co/300x180/e8f0e8/4a7a4a?text=No+Image'; }}
                    />
                  </div>
                  <div className="species-info">
                    <div className="species-name-row">
                      <div>
                        <h3 className="species-name">{sp.name}</h3>
                        <p className="species-scientific">{sp.scientificName}</p>
                      </div>
                      <span style={{ background: cs.bg, color: cs.color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {sp.conservationStatus}
                      </span>
                    </div>
                    <div className="species-meta">
                      <span title="Category"><Tag size={14} /> {sp.category}</span>
                      <span title="Location"><MapPin size={14} /> {sp.location}</span>
                    </div>
                    <div className="species-meta">
                      <span title="Time"><Clock size={14} /> {new Date(sp.detectedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="species-status-row">
                      <span style={{ background: cs.bg, color: cs.color, fontSize: 11.5, padding: '2px 8px', borderRadius: 4 }}>
                        {cs.label}
                      </span>
                      <button
                        className={`send-alert-btn ${alertSent[sp._id] || sp.alertSent ? 'sent' : ''}`}
                        onClick={() => sendAlert(sp._id)}
                        disabled={alertSent[sp._id] || sp.alertSent}
                      >
                        {alertSent[sp._id] || sp.alertSent ? <><CheckCircle size={14} /> Alert Sent</> : <><Megaphone size={14} /> Send Alert</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
