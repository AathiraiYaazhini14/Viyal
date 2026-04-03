import './LoadingSpinner.css';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}
