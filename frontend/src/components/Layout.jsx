import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="layout-body">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
