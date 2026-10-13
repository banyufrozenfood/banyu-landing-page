import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx';
import './AdminDashboard.css';

const quickActions = [
  {
    to: '/admin/settings', label: 'Pengaturan Website',
    desc: 'Kontak, Sosial Media, SEO, Navbar & Footer, Isi Beranda'
  },
  {
    to: '/admin/media', label: 'Media Library',
    desc: 'Upload dan kelola gambar: produk, logo, banner, foto toko'
  },
  {
    to: '/admin/products', label: 'Kelola Produk',
    desc: 'Tambah, ubah, atau hapus produk; atur harga, stok, kategori'
  },
  {
    to: '/admin/categories', label: 'Kelola Kategori',
    desc: 'Buat dan kelola kategori produk yang tampil di website'
  },
  {
    to: '/admin/hero-slides', label: 'Slide Beranda',
    desc: 'Gambar dan teks banner utama paling atas halaman beranda'
  },
  {
    to: '/admin/brand-partners', label: 'Brand Partner',
    desc: 'Logo mitra bisnis yang tampil di bagian bawah beranda'
  },
  {
    to: '/admin/orders', label: 'Pesanan WhatsApp',
    desc: 'Konfirmasi pesanan masuk dan kelola stok otomatis'
  },
  {
    to: '/', label: 'Lihat Website',
    desc: 'Buka tampilan website versi pengunjung di tab baru'
  },
];

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul ${time}`;
}

export default function AdminDashboard() {
  const cms = useSiteSettings();
  const [stats, setStats] = useState({ products: 0, categories: 0, pendingOrders: 0 });
  const [statsError, setStatsError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          prodRes,
          catRes,
          orderRes
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('whatsapp_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        if (prodRes.error || catRes.error) {
          setStatsError(prodRes.error?.message || catRes.error?.message || 'Gagal memuat statistik.');
        }
        setStats({
          products: prodRes.count ?? 0,
          categories: catRes.count ?? 0,
          pendingOrders: orderRes.count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStatsError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-intro">
        <h1 className="admin-page-title">Ringkasan</h1>
        <p className="admin-page-subtitle">Perbarui Konten, Cek status, Terbitkan saat siap</p>
      </div>

      {/* Website Status Card */}
      <div className="dashboard-status-card">
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Status Website</span>
          <span className={cms.hasUnpublished ? 'status-pill status-pill--draft' : 'status-pill status-pill--live'}>
            {cms.hasUnpublished ? '(Ada Draft Belum Terbit)' : '(Published)'}
          </span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Terakhir Diperbarui</span>
          <span className="dashboard-status__value">{formatDateTime(cms.updatedAt)}</span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Terakhir Diterbitkan</span>
          <span className="dashboard-status__value">{formatDateTime(cms.publishedAt)}</span>
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Penyimpanan</span>
          <span className="dashboard-status__value">
            {cms.storageMode === 'supabase' ? 'Online (Supabase)' : 'Browser ini saja (database belum terhubung)'}
          </span>
        </div>
        <div className="dashboard-status__actions">
          <Link to="/admin/settings" className="btn-admin-primary">Edit Website</Link>
          <a href="/?preview=draft" target="_blank" rel="noopener noreferrer" className="btn-admin-secondary">Lihat Pratinjau</a>
        </div>
      </div>

      {/* 3 Stats Grid */}
      <div className="dashboard-stats-grid">
        {statsError && (
          <p style={{ color: '#DC2626', gridColumn: '1 / -1' }}>Gagal memuat statistik: {statsError}</p>
        )}
        <div className="stat-card">
          <div className="stat-card__info">
            <h3>Total Produk</h3>
            <p className="stat-value">{loading ? '...' : stats.products}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__info">
            <h3>Kategori</h3>
            <p className="stat-value">{loading ? '...' : stats.categories}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__info">
            <h3>Pesanan Menunggu</h3>
            <p className="stat-value">{loading ? '...' : stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <h2 className="dashboard-section-title">Aksi Cepat</h2>
      <div className="quick-actions-grid">
        {quickActions.map((a, idx) => (
          <Link key={a.label} to={a.to} className="quick-action-card">
            <div className="quick-action-card__header">
              <span className="quick-action-card__num">{idx + 1}. </span>
              <span className="quick-action-card__label">{a.label}</span>
            </div>
            <span className="quick-action-card__desc">{a.desc}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Information Cards */}
      <div className="dashboard-bottom-grid">
        <div className="info-guide-card">
          <h3>Cara Pakai :</h3>
          <ol>
            <li>Ubah Isi</li>
            <li>Pratinjau (lihat dulu di tab baru)</li>
            <li>Simpan Draft (Simpan, belum tampil ke pengunjung)</li>
            <li>Terbitkan (baru tampil ke pengunjung)</li>
            <li>Batalkan perubahan (mengembalikan semua isian draft terakhir yang kamu simpan)</li>
          </ol>
        </div>

        <div className="info-guide-card">
          <h3>Informasi Pengaturan Website:</h3>
          <ul className="info-guide-list">
            <li>
              <strong>Kontak &amp; Jam Buka</strong>
              <p>Nomor WhatsApp, pesan otomatis, email, alamat, jadwal buka. Otomatis dipakai di halaman Lokasi, tombol chat, dan footer.</p>
            </li>
            <li>
              <strong>Sosial Media</strong>
              <p>Link Instagram, TikTok, Facebook toko. Ikon muncul di footer hanya jika link diisi.</p>
            </li>
            <li>
              <strong>Navbar &amp; Footer</strong>
              <p>Ringkasan profil toko dan hak cipta. Menu navigasi &amp; kategori footer terisi otomatis.</p>
            </li>
            <li>
              <strong>Isi Beranda</strong>
              <p>Sakelar on/off untuk Keunggulan, Produk Unggulan, Marketplace, Partner, link Tokopedia/Shopee, dan daftar keunggulan.</p>
            </li>
            <li>
              <strong>SEO</strong>
              <p>Judul, deskripsi, dan gambar pratinjau saat link dibagikan ke WhatsApp atau media sosial.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
