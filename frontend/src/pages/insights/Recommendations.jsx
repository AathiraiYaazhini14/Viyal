import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import { Leaf, PawPrint, Droplets, CloudSun, Mountain, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import '../shared.css';

const categoryMeta = {
  vegetation: { icon: <Leaf size={20} />, label: 'Vegetation', color: '#1e8449', bg: '#e8f5e9' },
  animal_movement: { icon: <PawPrint size={20} />, label: 'Animal Movement', color: '#2e7d9c', bg: '#e8f0fe' },
  water: { icon: <Droplets size={20} />, label: 'Water Resources', color: '#2471a3', bg: '#d6eaf8' },
  climate: { icon: <CloudSun size={20} />, label: 'Climate', color: '#8e44ad', bg: '#f0e8fe' },
  soil: { icon: <Mountain size={20} />, label: 'Soil', color: '#784212', bg: '#fdebd0' },
};

const priorityFromTrend = (trend) => trend === 'decreasing' ? 'Urgent' : trend === 'increasing' ? 'Monitor' : 'Routine';
const priorityColor = { Urgent: '#c0392b', Monitor: '#d4820a', Routine: '#1e8449' };
const priorityBg = { Urgent: '#fde8e8', Monitor: '#fef3e2', Routine: '#e8f5e9' };

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/insights/recommendations').then(r => setRecs(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const defaults = [
    { category: 'water', metric: 'Water Availability', recommendation: 'Create artificial water holes in the core zone. Dry season conditions are reducing natural water sources.', trend: 'decreasing' },
    { category: 'vegetation', metric: 'Vegetation Cover', recommendation: 'Reforestation required in Sectors B and D. Increase patrol frequency in fire-prone zones.', trend: 'decreasing' },
    { category: 'animal_movement', metric: 'Wildlife Sightings', recommendation: 'Install additional camera traps near river corridor. Set up wildlife crossing zones on patrol roads.', trend: 'stable' },
    { category: 'vegetation', metric: 'Buffer Zone Greenery', recommendation: 'Improve vegetation density in buffer zones through native species planting programs.', trend: 'decreasing' },
    { category: 'water', metric: 'River Water Level', recommendation: 'Monitor river water levels weekly. Coordinate with irrigation dept for upstream dam management.', trend: 'stable' },
  ];

  const displayRecs = recs.length > 0 ? recs : defaults;

  return (
    <Layout>
      <PageHeader
        title="Recommendations"
        subtitle="AI-generated forest management recommendations based on environmental trend analysis"
        badge={<span className="count-badge">{displayRecs.length} recommendations</span>}
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="recs-grid">
            {displayRecs.map((rec, i) => {
              const meta = categoryMeta[rec.category] || categoryMeta.vegetation;
              const priority = priorityFromTrend(rec.trend);
              return (
                <div key={i} className="rec-card">
                  <div className="rec-card-top">
                    <div className="rec-icon" style={{ background: meta.bg, color: meta.color }}>{meta.icon}</div>
                    <div className="rec-header">
                      <span className="rec-category" style={{ color: meta.color }}>{meta.label}</span>
                      <span style={{
                        background: priorityBg[priority],
                        color: priorityColor[priority],
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>{priority}</span>
                    </div>
                  </div>
                  <h4 className="rec-metric">{rec.metric}</h4>
                  <p className="rec-text">{rec.recommendation}</p>
                  <div className="rec-footer">
                    <span style={{ fontSize: 11, color: '#8a9bb0' }}>
                      Trend: <span className={`trend--${rec.trend}`} style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {rec.trend === 'decreasing' ? <><TrendingDown size={14} /> Declining</> : rec.trend === 'increasing' ? <><TrendingUp size={14} /> Improving</> : <><Minus size={14} /> Stable</>}
                      </span>
                    </span>
                    <button className="btn-acknowledge">Acknowledge</button>
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
