import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useEffect, useState } from 'react';
import './AdminLayout.css';
import '../../pages/admin/AdminShared.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authed' | 'unauthed' | 'forbidden'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Opsional: batasi email admin via VITE_ADMIN_EMAILS="a@x.com,b@y.com".
  // Jika tidak diset, semua user terautentikasi diizinkan (perilaku lama) dan
  // keamanan data tetap mengandalkan RLS Supabase.
  const isEmailAllowed = (email) => {
    const raw = (import.meta.env.VITE_ADMIN_EMAILS || '').trim();
    if (!raw) return true;
    const allow = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    return allow.includes((email || '').toLowerCase());
  };

  useEffect(() => {
    // Check if user is logged in
    let mounted = true
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return
        if (error || !session) {
          setStatus('unauthed');
          navigate('/admin', { replace: true });
        } else if (!isEmailAllowed(session.user?.email)) {
          await supabase.auth.signOut();
          setStatus('forbidden');
          navigate('/admin', { replace: true });
        } else {
          setStatus('authed');
        }
      } catch {
        if (!mounted) return
        setStatus('unauthed');
        navigate('/admin', { replace: true });
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT' || !session) {
        setStatus('unauthed');
        navigate('/admin', { replace: true });
      } else if (!isEmailAllowed(session.user?.email)) {
        await supabase.auth.signOut();
        setStatus('forbidden');
        navigate('/admin', { replace: true });
      } else {
        setStatus('authed');
      }
    });
    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [navigate]);

  // Close sidebar on route change in mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('admin-drawer-open', isSidebarOpen)
    return () => document.body.classList.remove('admin-drawer-open')
  }, [isSidebarOpen])

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

  const menuGroups = [
    {
      label: 'Workspace',
      items: [
        { path: '/admin/dashboard', label: 'Ringkasan', icon: '⌂' },
        { path: '/admin/analytics', label: 'Analytics', icon: '◔' },
      ],
    },
    {
      label: 'Konten Website',
      items: [
        { path: '/admin/settings', label: 'Pengaturan Website', icon: '⚙' },
        { path: '/admin/media', label: 'Media Library', icon: '▧' },
        { path: '/admin/hero-slides', label: 'Slide Beranda', icon: '▤' },
        { path: '/admin/brand-partners', label: 'Brand Partner', icon: '✦' },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside id="admin-navigation" className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__logo">BANYU</span>
            <span className="admin-sidebar__workspace">Admin Panel</span>
          </div>
          <button aria-label="Tutup navigasi" className="btn-close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>
        <nav className="admin-sidebar__nav">
          {menuGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <span className="admin-nav-group__label">{group.label}</span>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span className="admin-nav-item__icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="btn-logout">
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button aria-expanded={isSidebarOpen} aria-controls="admin-navigation" className="btn-menu-toggle" onClick={toggleSidebar}>
              <span aria-hidden="true">☰</span><span className="sr-only">Buka navigasi</span>
            </button>
            <div className="admin-header__title">
              <span>ADMIN</span>
              <h3>Admin Panel</h3>
            </div>
          </div>
          <div className="admin-header__user">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-view-site">
              Buka Website
            </a>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
