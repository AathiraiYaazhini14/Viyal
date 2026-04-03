import './PageHeader.css';

export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {badge && <div className="page-header-badge">{badge}</div>}
    </div>
  );
}
