import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import client from '../../api/client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Leaf, PawPrint, Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import '../shared.css';

export default function EnvironmentalTrends() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vegetation');

  useEffect(() => {
    client.get('/insights').then(r => setInsights(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const byCategory = (cat) =>
    insights
      .filter(i => i.category === cat)
      .sort((a, b) => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });

  const vegData = byCategory('vegetation').map(i => ({ month: i.month, 'Vegetation Cover (%)': parseFloat(i.value.toFixed(1)) }));
  const animalData = byCategory('animal_movement').map(i => ({ month: i.month, 'Wildlife Sightings': Math.round(i.value) }));
  const waterData = byCategory('water').map(i => ({ month: i.month, 'Water Availability': parseFloat(i.value.toFixed(1)) }));

  const tabs = [
    { key: 'vegetation', label: <><Leaf size={16} /> Vegetation Cover</> },
    { key: 'animal_movement', label: <><PawPrint size={16} /> Animal Movement</> },
    { key: 'water', label: <><Droplets size={16} /> Water Availability</> },
  ];

  return (
    <Layout>
      <PageHeader
        title="Environmental Trends"
        subtitle="Monthly trends in vegetation, wildlife activity, and water resources"
      />
      <div className="feature-content">
        {loading ? <LoadingSpinner /> : (
          <div className="trends-container">
            <div className="tab-row">
              {tabs.map(t => (
                <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'tab-btn--active' : ''}`} onClick={() => setActiveTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="chart-card">
              {activeTab === 'vegetation' && (
                <>
                  <h3 className="chart-title">Vegetation Cover Index — Monthly Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vegData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#edf0f4" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7a8d' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7a8d' }} unit="%" />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend />
                      <Line type="monotone" dataKey="Vegetation Cover (%)" stroke="#1e8449" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
              {activeTab === 'animal_movement' && (
                <>
                  <h3 className="chart-title">Wildlife Sightings — Monthly Count</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={animalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#edf0f4" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7a8d' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7a8d' }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend />
                      <Bar dataKey="Wildlife Sightings" fill="#2e7d9c" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
              {activeTab === 'water' && (
                <>
                  <h3 className="chart-title">Water Availability Score — Monthly Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={waterData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#edf0f4" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7a8d' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7a8d' }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend />
                      <Line type="monotone" dataKey="Water Availability" stroke="#2471a3" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>

            <div className="trend-summary-grid">
              {byCategory(activeTab).map((item) => (
                <div key={item._id} className="trend-item">
                  <span className="trend-month">{item.month}</span>
                  <div className="trend-bar-wrapper">
                    <div className="trend-bar-fill" style={{ width: `${Math.min(item.value, 100)}%`, background: item.trend === 'increasing' ? '#27ae60' : item.trend === 'decreasing' ? '#c0392b' : '#2e7d9c' }}></div>
                  </div>
                  <span className="trend-value">{item.value.toFixed(1)} {item.unit}</span>
                  <span className={`trend-direction trend--${item.trend}`}>
                    {item.trend === 'increasing' ? <TrendingUp size={16} /> : item.trend === 'decreasing' ? <TrendingDown size={16} /> : <Minus size={16} />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
