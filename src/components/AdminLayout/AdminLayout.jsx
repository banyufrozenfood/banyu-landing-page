import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useEffect, useState } from 'react';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authed' | 'unauthed'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('unauthed');
        navigate('/admin', { replace: true });
      } else {
        setStatus('authed');
      }
    };
    checkUser();
  }, [navigate]);

  // Close sidebar on route change in mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Never render protected content until a session is confirmed.
  if (status !== 'authed') {
    return <div className="admin-loading">Memuat...</div>;
  }

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/settings', label: 'Pengaturan Website', icon: '⚙️' },
    { path: '/admin/media', label: 'Media Library', icon: '🖼️' },
    { path: '/admin/products', label: 'Produk', icon: '📦' },
    { path: '/admin/categories', label: 'Kategori', icon: '🏷️' },
    { path: '/admin/banners', label: 'Banners', icon: '🖼️' },
    { path: '/admin/hero-slides', label: 'Slide Beranda', icon: '🎠' },
    { path: '/admin/brand-partners', label: 'Brand Partner', icon: '🤝' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <h2>Banyu Admin</h2>
          <button className="btn-close-sidebar" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <nav className="admin-sidebar__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button className="btn-menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="admin-header__title">
              <h3>Panel Admin</h3>
            </div>
          </div>
          <div className="admin-header__user">
            <a href="/" target="_blank" className="btn-view-site">Lihat Website</a>
            <span>Admin</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
