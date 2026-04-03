import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveAlerts from './pages/threat/LiveAlerts';
import AlertHistory from './pages/threat/AlertHistory';
import ZoneMonitoring from './pages/geofencing/ZoneMonitoring';
import ActivityLogs from './pages/geofencing/ActivityLogs';
import DetectionFeed from './pages/species/DetectionFeed';
import SpeciesRecords from './pages/species/SpeciesRecords';
import EnvironmentalTrends from './pages/insights/EnvironmentalTrends';
import Recommendations from './pages/insights/Recommendations';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* Threat Detection */}
          <Route path="/threat-detection" element={<Navigate to="/threat-detection/live-alerts" replace />} />
          <Route path="/threat-detection/live-alerts" element={
            <ProtectedRoute><LiveAlerts /></ProtectedRoute>
          } />
          <Route path="/threat-detection/history" element={
            <ProtectedRoute><AlertHistory /></ProtectedRoute>
          } />

          {/* Geo-Fencing */}
          <Route path="/geo-fencing" element={<Navigate to="/geo-fencing/zones" replace />} />
          <Route path="/geo-fencing/zones" element={
            <ProtectedRoute><ZoneMonitoring /></ProtectedRoute>
          } />
          <Route path="/geo-fencing/logs" element={
            <ProtectedRoute><ActivityLogs /></ProtectedRoute>
          } />

          {/* Species */}
          <Route path="/species" element={<Navigate to="/species/feed" replace />} />
          <Route path="/species/feed" element={
            <ProtectedRoute><DetectionFeed /></ProtectedRoute>
          } />
          <Route path="/species/records" element={
            <ProtectedRoute><SpeciesRecords /></ProtectedRoute>
          } />

          {/* Insights */}
          <Route path="/insights" element={<Navigate to="/insights/trends" replace />} />
          <Route path="/insights/trends" element={
            <ProtectedRoute><EnvironmentalTrends /></ProtectedRoute>
          } />
          <Route path="/insights/recommendations" element={
            <ProtectedRoute><Recommendations /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
