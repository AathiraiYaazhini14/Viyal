import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const districts = [
  'Coimbatore', 'Nilgiris', 'Erode', 'Salem', 'Dharmapuri',
  'Krishnagiri', 'Vellore', 'Tirunelveli', 'Theni', 'Dindigul',
];

const forestsByDistrict = {
  'Coimbatore': ['Anamalai Tiger Reserve', 'Coimbatore Forest Division'],
  'Nilgiris': ['Mudumalai Tiger Reserve', 'Nilgiris North Division', 'Nilgiris South Division'],
  'Erode': ['Sathyamangalam Tiger Reserve', 'Erode Forest Division'],
  'Salem': ['Yercaud Reserve Forest', 'Salem Forest Division'],
  'Dharmapuri': ['Hogenakal Forest', 'Dharmapuri Forest Division'],
  'Krishnagiri': ['Krishnagiri Reservoir Forest', 'Krishnagiri Division'],
  'Vellore': ['Vellore Forest Division', 'Javadi Hills Forest'],
  'Tirunelveli': ['Kalakad Mundanthurai Tiger Reserve', 'Tirunelveli Division'],
  'Theni': ['Megamalai Wildlife Sanctuary', 'Theni Forest Division'],
  'Dindigul': ['Kodaikanal Reserve Forest', 'Dindigul Division'],
};

const officesByForest = {
  'Anamalai Tiger Reserve': ['Pollachi Forest Division', 'Valparai Range Office', 'Topslip Check Post'],
  'Mudumalai Tiger Reserve': ['Gudalur Forest Division', 'Masinagudi Range Office', 'Theppakadu Elephant Camp Office'],
  'Sathyamangalam Tiger Reserve': ['Sathyamangalam Division', 'Hasanur Range Office'],
  'Coimbatore Forest Division': ['Coimbatore North Range', 'Coimbatore South Range'],
  'Nilgiris North Division': ['Ooty Range Office', 'Kotagiri Range Office'],
  'Nilgiris South Division': ['Coonoor Range Office', 'Kodanad Range Office'],
  'Erode Forest Division': ['Erode Range Office', 'Bhavani Range Office'],
  'Yercaud Reserve Forest': ['Yercaud Range Office', 'Shevaroy Hills Office'],
  'Salem Forest Division': ['Salem Range Office', 'Mecheri Range Office'],
  'Hogenakal Forest': ['Hogenakal Range Office', 'Palacode Range Office'],
  'Dharmapuri Forest Division': ['Dharmapuri Range Office'],
  'Krishnagiri Reservoir Forest': ['Krishnagiri Range Office'],
  'Krishnagiri Division': ['Hosur Range Office'],
  'Vellore Forest Division': ['Vellore Range Office'],
  'Javadi Hills Forest': ['Tiruvannamalai Range Office'],
  'Kalakad Mundanthurai Tiger Reserve': ['Tirunelveli Division HQ', 'Mundanthurai Range Office'],
  'Tirunelveli Division': ['Tirunelveli Range Office'],
  'Megamalai Wildlife Sanctuary': ['Megamalai Range Office'],
  'Theni Forest Division': ['Theni Range Office'],
  'Kodaikanal Reserve Forest': ['Kodaikanal Range Office'],
  'Dindigul Division': ['Dindigul Range Office'],
};

export default function Login() {
  const [form, setForm] = useState({ district: '', forest: '', officeName: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setForm({ district: value, forest: '', officeName: '', password: form.password });
    } else if (name === 'forest') {
      setForm({ ...form, forest: value, officeName: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.district || !form.forest || !form.officeName || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableForests = form.district ? forestsByDistrict[form.district] || [] : [];
  const availableOffices = form.forest ? officesByForest[form.forest] || [] : [];

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">🌲</span>
          <div>
            <h1>Viyal</h1>
            <p>AI-Powered Forest Monitoring System</p>
          </div>
        </div>
        <div className="login-features">
          <div className="feature-item">
            <span>⚠</span>
            <div>
              <strong>Threat Detection</strong>
              <p>Real-time alerts for intrusion, fire, and chainsaw activity</p>
            </div>
          </div>
          <div className="feature-item">
            <span>◉</span>
            <div>
              <strong>Geo-Fencing</strong>
              <p>Smart zone monitoring with activity tracking</p>
            </div>
          </div>
          <div className="feature-item">
            <span>🐾</span>
            <div>
              <strong>Species Alerts</strong>
              <p>Endangered wildlife detection and reporting</p>
            </div>
          </div>
          <div className="feature-item">
            <span>🌱</span>
            <div>
              <strong>Forest Insights</strong>
              <p>Environmental trends and AI-driven recommendations</p>
            </div>
          </div>
        </div>
        <div className="login-footer-note">
          <p>Tamil Nadu Forest Department — Government of Tamil Nadu</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-emblem">🏛️</div>
            <h2>Forest Officer Login</h2>
            <p>Sign in with your designated office credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select id="district" name="district" value={form.district} onChange={handleChange}>
                <option value="">— Select District —</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="forest">Forest / Reserve</label>
              <select id="forest" name="forest" value={form.forest} onChange={handleChange} disabled={!form.district}>
                <option value="">— Select Forest —</option>
                {availableForests.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="officeName">Forest Office</label>
              <select id="officeName" name="officeName" value={form.officeName} onChange={handleChange} disabled={!form.forest}>
                <option value="">— Select Office —</option>
                {availableOffices.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="login-hint">
            <p><strong>Demo:</strong> Coimbatore → Anamalai Tiger Reserve → Pollachi Forest Division → <code>forest123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
