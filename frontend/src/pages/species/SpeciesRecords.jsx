import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import '../shared.css';

export default function SpeciesRecords() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    client.get('/species').then(r => setSpecies(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'endangered' ? species.filter(s => s.isEndangered) : species;

  return (
    <Layout>
      <PageHeader
        title="Species Records"
        subtitle="Comprehensive database of detected wildlife species"
        badge={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`tab-btn ${filter === 'all' ? 'tab-btn--active' : ''}`} onClick={() => setFilter('all')}>All Species</button>
            <button className={`tab-btn ${filter === 'endangered' ? 'tab-btn--active' : ''}`} onClick={() => setFilter('endangered')}>Endangered Only</button>
          </div>
        }
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="panel-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Species</th>
                  <th>Scientific Name</th>
                  <th>Category</th>
                  <th>Conservation</th>
                  <th>Location</th>
                  <th>Last Detected</th>
                  <th>Alert</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sp => (
                  <tr key={sp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {sp.imageUrl && <img src={sp.imageUrl} alt={sp.name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                        <strong style={{ fontSize: 13 }}>{sp.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: '#6b7a8d', fontStyle: 'italic', fontSize: 12.5 }}>{sp.scientificName}</td>
                    <td>{sp.category}</td>
                    <td>
                      {sp.isEndangered && (
                        <span style={{ background: '#fde8e8', color: '#c0392b', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          {sp.conservationStatus}
                        </span>
                      )}
                      {!sp.isEndangered && (
                        <span style={{ background: '#e8f5e9', color: '#1e8449', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          {sp.conservationStatus}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5, color: '#4a6b82' }}>{sp.location}</td>
                    <td style={{ fontSize: 12, color: '#6b7a8d' }}>{new Date(sp.detectedAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span style={{ color: sp.alertSent ? '#27ae60' : '#8a9bb0', fontSize: 12, fontWeight: 500 }}>
                        {sp.alertSent ? '✓ Sent' : 'Pending'}
                      </span>
                    </td>
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
