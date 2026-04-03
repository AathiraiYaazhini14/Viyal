export default function AlertBadge({ severity, status }) {
  if (severity) {
    const colors = {
      High: { bg: '#fde8e8', color: '#c0392b', border: '#f5c6c6' },
      Medium: { bg: '#fef3e2', color: '#d4820a', border: '#fad7a0' },
      Low: { bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9' },
    };
    const style = colors[severity] || colors.Low;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11.5px',
        fontWeight: '600',
        letterSpacing: '0.3px',
      }}>
        {severity}
      </span>
    );
  }

  if (status) {
    const colors = {
      Active: { bg: '#fde8e8', color: '#c0392b', border: '#f5c6c6' },
      Investigating: { bg: '#fef3e2', color: '#d4820a', border: '#fad7a0' },
      Resolved: { bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9' },
    };
    const style = colors[status] || colors.Resolved;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11.5px',
        fontWeight: '600',
      }}>
        {status}
      </span>
    );
  }

  return null;
}
