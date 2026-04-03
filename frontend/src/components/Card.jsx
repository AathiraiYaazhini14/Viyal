import './Card.css';

export default function Card({ title, value, subtitle, icon, accent, className = '' }) {
  return (
    <div className={`stat-card ${className}`} style={accent ? { '--card-accent': accent } : {}}>
      <div className="stat-card-header">
        <div className="stat-card-icon">{icon}</div>
        <div>
          <p className="stat-card-title">{title}</p>
          <h2 className="stat-card-value">{value}</h2>
          {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
