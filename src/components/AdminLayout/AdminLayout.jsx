import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase, supabaseEnvMissing } from '../../lib/supabase.js';
import {
  ADMIN_STATUS,
  getAdminAllowList,
  getLocalSession,
  getVerifiedSession,
  resolveAdminStatus,
} from '../../lib/authGuard.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import './AdminLayout.css';
import '../../pages/admin/AdminShared.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(ADMIN_STATUS.loading);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Disimpan di ref supaya listener popstate/pageshow selalu memakai nilai
  // terbaru tanpa perlu dipasang ulang.
  const statusRef = useRef(ADMIN_STATUS.loading);
  // Waktu verifikasi sesi terakhir ke server (0 = belum pernah).
  const lastVerifiedRef = useRef(0);

  const applyStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const goToLogin = useCallback(() => {
    // replace: entri riwayat halaman admin dibuang supaya tombol back tidak
    // bisa mengembalikan panel setelah sesi hilang.
    navigate('/admin', { replace: true });
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    const allowList = getAdminAllowList();

    // Sesi diverifikasi ulang ke server setelah jeda ini agar token yang sudah
    // dicabut tidak bisa dipakai masuk lewat tombol back, tanpa memanggil
    // server pada setiap navigasi.
    const REVERIFY_AFTER_MS = 60_000;

    const markVerified = (verified) => {
      if (verified) lastVerifiedRef.current = Date.now();
    };

    const logoutAndGoToLogin = async () => {
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // Diabaikan: status lokal sudah dipaksa keluar di bawah.
      }
      if (!mounted) return;
      applyStatus(ADMIN_STATUS.unauthed);
      goToLogin();
    };

    // Ambil sesi yang sudah diverifikasi bila sudah lewat REVERIFY_AFTER_MS,
    // selain itu cukup baca penyimpanan lokal (instan).
    const getFreshSession = async () => {
      if (Date.now() - lastVerifiedRef.current <= REVERIFY_AFTER_MS) {
        return getLocalSession(supabase);
      }
      const { session, verified } = await getVerifiedSession(supabase);
      markVerified(verified);
      // Server tidak bisa dihubungi: pakai sesi lokal agar tidak memaksa
      // logout hanya karena jaringan bermasalah.
      return verified ? session : getLocalSession(supabase);
    };

    const checkUser = async () => {
      // Tanpa env Supabase, klien memakai URL placeholder: jangan pernah
      // menganggap pengguna masuk.
      if (supabaseEnvMissing) {
        applyStatus(ADMIN_STATUS.unauthed);
        return;
      }
      const verified = await getVerifiedSession(supabase);
      markVerified(verified.verified);
      if (!mounted) return;
      const effective = verified.verified ? verified.session : await getLocalSession(supabase);
      if (!mounted) return;
      const next = resolveAdminStatus(effective, allowList);
      if (next === ADMIN_STATUS.forbidden) {
        await logoutAndGoToLogin();
        return;
      }
      applyStatus(next);
      if (next === ADMIN_STATUS.unauthed) goToLogin();
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        applyStatus(ADMIN_STATUS.unauthed);
        goToLogin();
        return;
      }
      // Hanya event yang benar-benar menandakan sesi baru yang boleh membuka
      // panel. Event lain (mis. USER_UPDATED) tidak mengubah status.
      if (!['SIGNED_IN', 'INITIAL_SESSION', 'TOKEN_REFRESHED'].includes(event)) return;
      const next = resolveAdminStatus(session, allowList);
      if (next === ADMIN_STATUS.forbidden) {
        await logoutAndGoToLogin();
        return;
      }
      applyStatus(next);
    });

    // Tombol back/forward: pakai sesi yang masih segar (tanpa permintaan
    // jaringan) supaya navigasi tidak terasa lambat, tetapi sesi tetap
    // diverifikasi ulang ke server bila sudah lewat REVERIFY_AFTER_MS.
    const handlePopState = async () => {
      if (supabaseEnvMissing) return;
      if (statusRef.current === ADMIN_STATUS.loading) return;

      const session = await getFreshSession();
      if (!mounted) return;

      const next = resolveAdminStatus(session, allowList);
      if (next === ADMIN_STATUS.forbidden) {
        await logoutAndGoToLogin();
        return;
      }
      applyStatus(next);
      if (next === ADMIN_STATUS.unauthed) goToLogin();
    };

    // Halaman dipulihkan dari bfcache: status di memori bisa sudah basi.
    const handlePageShow = async (event) => {
      if (!event.persisted) return;
      if (supabaseEnvMissing) return;
      const { session, verified } = await getVerifiedSession(supabase);
      markVerified(verified);
      if (!mounted) return;
      const next = resolveAdminStatus(session, allowList);
      if (next === ADMIN_STATUS.forbidden) {
        await logoutAndGoToLogin();
        return;
      }
      applyStatus(next);
      if (next === ADMIN_STATUS.unauthed) goToLogin();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [navigate, applyStatus, goToLogin]);

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
    // Tutup panel lebih dulu supaya konten admin tidak sempat terlihat lagi,
    // lalu hapus entri riwayat halaman admin agar tombol back tidak
    // mengembalikan pengguna ke dashboard tanpa login ulang.
    applyStatus(ADMIN_STATUS.unauthed);
    try {
      await supabase.auth.signOut();
    } catch {
      // Jaringan gagal: paksa keluar dari sisi klien saja.
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        // Diabaikan: status sudah 'unauthed'.
      }
    }
    navigate('/admin', { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Never render protected content until a session is confirmed.
  if (status !== ADMIN_STATUS.authed) {
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

  // Judul di header ikut halaman aktif supaya pengguna tahu posisinya,
  // terutama di HP saat sidebar sedang tertutup.
  const activeMenu = menuGroups
    .flatMap((group) => group.items)
    .find((item) => location.pathname === item.path);

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
              <span className="admin-header__eyebrow">ADMIN</span>
              <h3>{activeMenu?.label || 'Admin Panel'}</h3>
            </div>
          </div>
          <div className="admin-header__user">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-view-site" aria-label="Buka website di tab baru">
              <svg className="btn-view-site__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
              <span className="btn-view-site__text">Buka Website</span>
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
