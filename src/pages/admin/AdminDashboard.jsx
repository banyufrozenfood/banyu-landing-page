import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx';
import './AdminDashboard.css';

const ONBOARDING_KEY = 'banyu_cms_onboarding_done';

const quickActions = [
  { to: '/admin/settings', icon: '⚙️', label: 'Edit Website', desc: 'Ubah teks, kontak, warna, dan SEO' },
  { to: '/admin/media', icon: '🖼️', label: 'Kelola Media', desc: 'Upload dan pakai ulang gambar' },
  { to: '/admin/products', icon: '📦', label: 'Kelola Produk', desc: 'Tambah, edit, hapus produk' },
  { to: '/admin/hero-slides', icon: '🎠', label: 'Slide Beranda', desc: 'Atur gambar dan teks slide utama' },
  { to: '/admin/brand-partners', icon: '🤝', label: 'Brand Partner', desc: 'Atur logo brand partner' },
  { to: '/', icon: '🌐', label: 'Lihat Website', desc: 'Buka website seperti pengunjung' },
];

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminDashboard() {
  const cms = useSiteSettings();
  const [stats, setStats] = useState({ products: 0, categories: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem(ONBOARDING_KEY));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: productCount },
          { count: categoryCount }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          products: productCount || 0,
          categories: categoryCount || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setShowOnboarding(false);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Selamat datang! 👋</h1>
      <p className="admin-page-subtitle">Kelola isi website Anda di sini — tanpa perlu coding.</p>

      {showOnboarding && (
        <div className="onboarding-card">
          <h2>Ini pertama kalinya Anda di sini?</h2>
          <p>Di dashboard ini Anda dapat mengelola isi website tanpa coding:</p>
          <ul>
            <li><strong>Mengubah informasi</strong> — nama bisnis, kontak, jam buka, sosial media.</li>
            <li><strong>Mengelola gambar</strong> — upload sekali di Media Library, pakai berulang kali.</li>
            <li><strong>Mengelola produk & slide</strong> — tambah, edit, urutkan, sembunyikan.</li>
            <li><strong>Melihat pratinjau</strong> — cek perubahan sebelum dilihat pengunjung.</li>
            <li><strong>Menerbitkan perubahan</strong> — satu klik untuk menampilkan ke publik.</li>
          </ul>
          <div className="onboarding-actions">
            <button className="btn-admin-primary" onClick={dismissOnboarding}>Mengerti, mulai kelola</button>
            <button className="btn-admin-secondary" onClick={dismissOnboarding}>Lewati</button>
          </div>
        </div>
      )}

      <div className="dashboard-status-card">
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Status Website</span>
          <span className={cms.hasUnpublished ? 'status-pill status-pill--draft' : 'status-pill status-pill--live'}>
            {cms.hasUnpublished ? '● Ada draft belum terbit' : '● Published'}
          </span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Terakhir diperbarui</span>
          <span>{formatDateTime(cms.updatedAt)}</span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Terakhir diterbitkan</span>
          <span>{formatDateTime(cms.publishedAt)}</span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Penyimpanan</span>
          <span>{cms.storageMode === 'supabase' ? 'Online (Supabase)' : 'Browser ini saja (database belum terhubung)'}</span>
        </div>
        <div className="dashboard-status__actions">
          <Link to="/admin/settings" className="btn-admin-primary">Edit Website</Link>
          <a href="/?preview=draft" target="_blank" rel="noopener noreferrer" className="btn-admin-secondary">Lihat Pratinjau</a>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon product-icon">📦</div>
          <div className="stat-card__info">
            <h3>Total Produk</h3>
            <p className="stat-value">{loading ? '...' : stats.products}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon category-icon">🏷️</div>
          <div className="stat-card__info">
            <h3>Kategori</h3>
            <p className="stat-value">{loading ? '...' : stats.categories}</p>
          </div>
        </div>
      </div>

      <h2 className="dashboard-section-title">Aksi Cepat</h2>
      <div className="quick-actions-grid">
        {quickActions.map((a) => (
          <Link key={a.label} to={a.to} className="quick-action-card">
            <span className="quick-action-card__icon">{a.icon}</span>
            <span className="quick-action-card__label">{a.label}</span>
            <span className="quick-action-card__desc">{a.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
