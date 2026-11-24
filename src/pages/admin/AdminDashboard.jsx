import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx';
import { aggregateAnalyticsEvents, getAnalyticsPeriodStart } from '../../lib/analytics.js';
import './AdminDashboard.css';

const quickActions = [
  {
    to: '/admin/settings', label: 'Pengaturan Website',
    desc: 'Kontak, sosial media, isi beranda, dan SEO'
  },
  {
    to: '/admin/media', label: 'Media Library',
    desc: 'Upload dan kelola gambar: logo, banner, foto toko'
  },
  {
    to: '/admin/hero-slides', label: 'Slide Beranda',
    desc: 'Gambar dan teks banner utama paling atas halaman beranda'
  },
  {
    to: '/admin/brand-partners', label: 'Brand Partner',
    desc: 'Logo merek yang tampil di bagian bawah beranda'
  },
  {
    to: '/', label: 'Lihat Website',
    desc: 'Buka tampilan website versi pengunjung'
  },
];

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul ${time}`;
}

function startOfDays(days) {
  return getAnalyticsPeriodStart(days)
}

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export default function AdminDashboard() {
  const cms = useSiteSettings();
  const [stats, setStats] = useState({ slides: 0, partners: 0 });
  const [statsError, setStatsError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsPromise = Promise.all([
          supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
          supabase.from('brand_partners').select('*', { count: 'exact', head: true }),
        ]);
        const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 5000));
        const result = await Promise.race([statsPromise, timeout]);
        if (!result) {
          setStatsError('Statistik tidak dapat dimuat. Periksa koneksi database.');
          return;
        }
        const [slidesRes, partnersRes] = result;

        if (slidesRes.error || partnersRes.error) {
          setStatsError(slidesRes.error?.message || partnersRes.error?.message || 'Gagal memuat statistik.');
        }
        setStats({
          slides: slidesRes.count ?? 0,
          partners: partnersRes.count ?? 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStatsError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const fetchAnalytics = async () => {
      try {
        const query = supabase
          .from('analytics_events')
          .select('event_type, event_name, visitor_id, session_id, created_at')
          .gte('created_at', startOfDays(30).toISOString())
        const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 5000))
        const result = await Promise.race([query, timeout])
        if (!result) throw new Error('timeout')
        if (result.error) throw result.error
        const events = result.data || []
        const today = startOfDays(1)
        const week = startOfDays(7)
        setAnalytics({
          today: aggregateAnalyticsEvents(events, { start: today.toISOString() }).visitors,
          week: aggregateAnalyticsEvents(events, { start: week.toISOString() }).visitors,
          month: aggregateAnalyticsEvents(events).visitors,
          clicks: aggregateAnalyticsEvents(events).channelClicks,
        })
      } catch (error) {
        console.warn('Analytics dashboard tidak tersedia:', error?.message || error)
        setAnalyticsError(/analytics_events|relation/i.test(error?.message || '')
          ? 'Jalankan supabase-analytics.sql untuk mengaktifkan monitoring.'
          : 'Data analytics belum dapat dimuat.')
      }
    }

    fetchAnalytics()
  }, []);

  const marketplace = cms.settings?.home?.marketplace || {};
  const waNumber = (cms.settings?.contact?.whatsapp || '').replace(/\D/g, '');
  const channelCount = [
    marketplace.gofoodEnabled !== false,
    marketplace.grabmartEnabled !== false,
    !!waNumber,
  ].filter(Boolean).length;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-intro admin-page-header">
        <div>
          <p className="dashboard-eyebrow">WORKSPACE</p>
          <h1 className="admin-page-title">Selamat datang kembali</h1>
          <p className="admin-page-subtitle">Kelola isi website dan pantau minat pengunjung dari satu tempat.</p>
        </div>
        <Link to="/admin/analytics" className="dashboard-header-link">Lihat aktivitas</Link>
      </div>

      {/* Website Status Card */}
      <div className="dashboard-status-card admin-card">
        <div className="dashboard-status__heading">
          <div>
            <p className="dashboard-eyebrow">STATUS WEBSITE</p>
            <h2>Website siap dikelola</h2>
          </div>
          <span className="dashboard-status__dot" aria-hidden="true" />
        </div>
        <div className="dashboard-status__row">
          <span className="dashboard-status__label">Status Website</span>
          <span className={cms.hasUnpublished ? 'status-pill status-pill--draft' : 'status-pill status-pill--live'}>
            {cms.hasUnpublished ? 'Ada draft' : 'Terbit'}
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
            {cms.storageMode === 'supabase' ? 'Online (Supabase)' : 'Browser ini saja'}
          </span>
        </div>
        <div className="dashboard-status__actions">
          <Link to="/admin/settings" className="btn-admin-primary">Edit Website</Link>
          <a href="/?preview=draft" target="_blank" rel="noopener noreferrer" className="btn-admin-secondary">Lihat Pratinjau</a>
        </div>
      </div>

      {/* Content stats */}
      <div className="dashboard-section-heading dashboard-section-heading--content">
        <div>
          <p className="dashboard-eyebrow">KONTEN WEBSITE</p>
          <h2 className="dashboard-section-title">Konten yang dikelola</h2>
        </div>
      </div>
      <div className="dashboard-stats-grid">
        {statsError && (
          <p className="dashboard-inline-error">Gagal memuat statistik: {statsError}</p>
        )}
        <div className="stat-card">
          <span className="stat-card__icon" aria-hidden="true">▤</span>
          <div className="stat-card__info">
            <h3>Slide Beranda</h3>
            <p className="stat-value">{loading ? '...' : stats.slides}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon" aria-hidden="true">✦</span>
          <div className="stat-card__info">
            <h3>Brand Partner</h3>
            <p className="stat-value">{loading ? '...' : stats.partners}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon" aria-hidden="true">↗</span>
          <div className="stat-card__info">
            <h3>Kanal Pemesanan</h3>
            <p className="stat-value">{channelCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2 className="dashboard-section-title">Monitoring Website</h2>
          <p className="dashboard-section-subtitle">Data anonim dari pengunjung dan klik kanal dalam 30 hari terakhir.</p>
        </div>
        <Link to="/admin/analytics" className="dashboard-analytics-link">Buka Analytics Lengkap</Link>
      </div>
      {analyticsError && <div className="dashboard-analytics-alert">{analyticsError}</div>}
      <div className="dashboard-analytics-grid">
        <div className="dashboard-analytics-card"><span>Pengunjung hari ini</span><strong>{analytics ? formatNumber(analytics.today) : '—'}</strong><small>Visitor unik</small></div>
        <div className="dashboard-analytics-card"><span>Pengunjung 7 hari</span><strong>{analytics ? formatNumber(analytics.week) : '—'}</strong><small>Visitor unik</small></div>
        <div className="dashboard-analytics-card"><span>Pengunjung 30 hari</span><strong>{analytics ? formatNumber(analytics.month) : '—'}</strong><small>Visitor unik</small></div>
        <div className="dashboard-analytics-card dashboard-analytics-card--clicks"><span>Klik kanal 30 hari</span><strong>{analytics ? formatNumber(Object.values(analytics.clicks).reduce((total, count) => total + count, 0)) : '—'}</strong><small>WA {analytics?.clicks.whatsapp ?? '—'} · GoFood {analytics?.clicks.gofood ?? '—'} · GrabMart {analytics?.clicks.grabmart ?? '—'}</small></div>
      </div>

      <div className="dashboard-merchant-note">
        <div><h3>Pesanan aktual dipantau di aplikasi merchant</h3><p>Website mencatat klik, bukan detail pesanan. Cek order dan status transaksi langsung di WhatsApp Business, GoFood Merchant, atau GrabMerchant.</p></div>
        <Link to="/admin/analytics" className="dashboard-merchant-note__link">Lihat penjelasan</Link>
      </div>

      {/* Aksi Cepat */}
       <h2 className="dashboard-section-title">Aksi cepat</h2>
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
              <p>Link Instagram dan TikTok toko. Ikon muncul di footer dan bagian kanal pemesanan.</p>
            </li>
            <li>
              <strong>Navbar &amp; Footer</strong>
              <p>Ringkasan profil toko dan hak cipta. Menu navigasi sudah tetap: Beranda, Tentang, Cara Pesan, Lokasi.</p>
            </li>
            <li>
              <strong>Isi Beranda</strong>
              <p>Sakelar on/off untuk Keunggulan, Tentang Toko, Kanal Pemesanan, Brand Partner, dan Lokasi. Atur juga teks Tentang, daftar keunggulan, serta link GoFood/GrabMart.</p>
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
