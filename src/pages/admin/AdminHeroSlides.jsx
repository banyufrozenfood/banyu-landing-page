import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './AdminShared.css';
import './AdminHeroSlides.css';

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    description: '',
    image: '',
    cta_text: '',
    cta_link: '',
    order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true });

    if (error) console.error(error);
    else setSlides(data || []);
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.image.trim()) newErrors.image = 'URL Gambar wajib diisi';
    else if (!isValidUrl(formData.image)) newErrors.image = 'Format URL tidak valid (contoh: https://example.com/image.jpg)';
    if (!formData.cta_text.trim()) newErrors.cta_text = 'Teks tombol wajib diisi';
    if (!formData.cta_link.trim()) newErrors.cta_link = 'Link tujuan wajib diisi';
    else if (!isValidUrl(formData.cta_link) && !formData.cta_link.startsWith('/')) {
      newErrors.cta_link = 'Gunakan URL lengkap (https://...) atau path relatif (contoh: /produk)';
    }
    if (formData.order < 0) newErrors.order = 'Urutan minimal 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus slide ini?')) {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (!error) fetchSlides();
      else alert('Gagal menghapus: ' + error.message);
    }
  };

  const handleEdit = (slide) => {
    setFormData(slide);
    setErrors({});
    setShowForm(true);
  };

  const handleAdd = () => {
    const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) : 0;
    setFormData({
      id: null,
      title: '',
      subtitle: '',
      description: '',
      image: '',
      cta_text: 'Lihat Produk',
      cta_link: '/produk',
      order: maxOrder + 1,
      is_active: true,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      cta_text: formData.cta_text.trim(),
      cta_link: formData.cta_link.trim(),
      order: parseInt(formData.order) || 0,
      is_active: formData.is_active,
    };

    let error;
    if (formData.id) {
      const res = await supabase.from('hero_slides').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      const res = await supabase.from('hero_slides').insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setShowForm(false);
      fetchSlides();
    }
  };

  const toggleActive = async (slide) => {
    const { error } = await supabase
      .from('hero_slides')
      .update({ is_active: !slide.is_active })
      .eq('id', slide.id);
    if (!error) fetchSlides();
    else alert('Gagal mengubah status: ' + error.message);
  };

  return (
    <div className="admin-page">
      {/* Header with Help Info */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Hero Carousel</h1>
          <p className="admin-page-subtitle">
            Kelola slide gambar utama di halaman beranda (Hero Section)
          </p>
        </div>
        {!showForm && (
          <button className="btn-admin-primary" onClick={handleAdd}>
            + Tambah Slide Baru
          </button>
        )}
      </div>

      {/* Visual Guide Card */}
      <div className="admin-guide-card">
        <div className="guide-header">
          <span className="guide-icon">📍</span>
          <div>
            <h3>Panduan Visual: Di Mana Slide Ini Tampil?</h3>
            <p>Slide akan muncul di <strong>Hero Carousel (Bagian Paling Atas Halaman Beranda)</strong> — area pertama yang dilihat pengunjung saat buka website.</p>
          </div>
        </div>
        <div className="guide-preview">
          <div className="preview-frame">
            <div className="preview-label">TAMPILAN DI WEBSITE (Desktop)</div>
            <div className="preview-hero">
              <div className="preview-slide">
                <div className="preview-overlay" />
                <div className="preview-content">
                  <span className="preview-subtitle">Subtitle (Teks kecil di atas judul)</span>
                  <h1 className="preview-title">Judul Utama (Heading Besar)</h1>
                  <p className="preview-desc">Deskripsi (Penjelasan 1-2 baris)</p>
                  <button className="preview-cta">Teks Tombol (CTA)</button>
                </div>
              </div>
              <div className="preview-indicators">
                <span className="preview-dot active" />
                <span className="preview-dot" />
                <span className="preview-dot" />
              </div>
            </div>
            <div className="preview-notes">
              <span>🖼️ Gambar: Full width, aspect ratio <strong>2:1 (1200×600px)</strong></span>
              <span>📱 Mobile: Gambar akan di-crop otomatis, teks tetap terbaca</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        {showForm ? (
          <HeroSlideForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setErrors({}); }}
            isEdit={!!formData.id}
          />
        ) : (
          <HeroSlidesTable
            slides={slides}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={toggleActive}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Form with Live Preview
// ============================================
function HeroSlideForm({ formData, setFormData, errors, saving, onSave, onCancel, isEdit }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
  };

  // Live preview image
  const previewImage = formData.image || 'https://placehold.co/1200x600/E5E7EB/9CA3AF?text=Masukkan+URL+Gambar';

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">{isEdit ? 'Edit Slide' : 'Tambah Slide Baru'}</h2>

      <div className="hero-form-layout">
        {/* Left: Form Fields */}
        <div className="form-panel">
          <form onSubmit={onSave} className="admin-form">

            <div className="form-group">
              <label>Urutan <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                required
                value={formData.order}
                onChange={(e) => handleChange('order', e.target.value)}
                placeholder="1, 2, 3... (Slide dengan urutan 1 tampil pertama)"
              />
              <span className="help-text">Slide diurutkan dari angka terkecil ke terbesar</span>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                <label htmlFor="is_active" className="toggle-label">
                  <span className={formData.is_active ? 'on' : 'off'}>
                    {formData.is_active ? 'Aktif (Tampil di Website)' : 'Nonaktif (Disembunyikan)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="form-separator">KONTEN TEKS</div>

            <div className="form-group">
              <label>Judul Utama <span className="required">*</span></label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Contoh: Frozen Food Berkualitas"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
              <span className="help-text">Maks 60 karakter. Tampil besar di tengah slide.</span>
            </div>

            <div className="form-group">
              <label>Subtitle (Opsional)</label>
              <input
                type="text"
                maxLength={80}
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Contoh: Untuk Keluarga Indonesia"
              />
              <span className="help-text">Teks kecil di atas judul. Maks 80 karakter.</span>
            </div>

            <div className="form-group">
              <label>Deskripsi (Opsional)</label>
              <textarea
                rows={3}
                maxLength={200}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Contoh: Produk beku pilihan dengan bahan terbaik..."
              />
              <span className="help-text">Maks 200 karakter. 1-2 baris di bawah judul.</span>
            </div>

            <div className="form-separator">GAMBAR & TOMBOL (CTA)</div>

            <div className="form-group">
              <label>URL Gambar Slide <span className="required">*</span></label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://example.com/gambar.jpg"
              />
              {errors.image && <span className="error-text">{errors.image}</span>}
              <span className="help-text">
                <strong>Rekomendasi:</strong> 1200×600px (rasio 2:1), format JPG/WebP, &lt; 500KB.
                <br />Gunakan link langsung (bukan Google Drive). Hosting gambar: Supabase Storage, ImgBB, Cloudinary, dll.
              </span>
            </div>

            {/* Live Preview */}
            <div className="live-preview">
              <label>Pratinjau Gambar (Live)</label>
              <div className="preview-box">
                <img src={previewImage} alt="Preview" onError={(e) => { e.target.src = 'https://placehold.co/1200x600/E5E7EB/9CA3AF?text=Gambar+Tidak+Valid'; }} />
                {errors.image && <div className="preview-error">⚠️ URL gambar tidak valid</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Teks Tombol (CTA) <span className="required">*</span></label>
              <input
                type="text"
                required
                maxLength={25}
                value={formData.cta_text}
                onChange={(e) => handleChange('cta_text', e.target.value)}
                placeholder="Contoh: Lihat Produk, Pesan Sekarang"
              />
              {errors.cta_text && <span className="error-text">{errors.cta_text}</span>}
              <span className="help-text">Maks 25 karakter. Jangan terlalu panjang.</span>
            </div>

            <div className="form-group">
              <label>Link Tujuan Tombol <span className="required">*</span></label>
              <input
                type="text"
                required
                value={formData.cta_link}
                onChange={(e) => handleChange('cta_link', e.target.value)}
                placeholder="/produk atau https://tokopedia.com/toko-anda"
              />
              {errors.cta_link && <span className="error-text">{errors.cta_link}</span>}
              <span className="help-text">
                <strong>Path internal:</strong> <code>/produk</code>, <code>/lokasi</code>, <code>/produk/123</code><br />
                <strong>URL eksternal:</strong> <code>https://tokopedia.com/...</code>, <code>https://wa.me/628xxxx</code>
              </span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={onCancel}>Batal</button>
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : (isEdit ? 'Update Slide' : 'Simpan Slide')}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Visual Reference */}
        <div className="reference-panel">
          <div className="reference-card">
            <h4>📋 Referensi Cepat</h4>
            <div className="ref-item">
              <strong>Ukuran Ideal:</strong> 1200 × 600 px (rasio 2:1)
            </div>
            <div className="ref-item">
              <strong>Format:</strong> JPG, WebP (disarankan), PNG
            </div>
            <div className="ref-item">
              <strong>Ukuran File:</strong> &lt; 500 KB untuk loading cepat
            </div>
            <div className="ref-item">
              <strong>Area Aman (Safe Zone):</strong> Teks/logo penting di tengah 60% gambar
            </div>
            <div className="ref-item">
              <strong>Maks Slide:</strong> 5-6 slide (lebih banyak = loading lambat)
            </div>
            <div className="ref-item warning">
              <strong>⚠️ Hindari:</strong> Gambar teks penuh, kontras rendah, file &gt; 1MB
            </div>
          </div>

          <div className="reference-card example">
            <h4>💡 Contoh Slide yang Baik</h4>
            <div className="example-slide">
              <div className="example-content">
                <span className="example-subtitle">Subtitle: Promo Akhir Tahun</span>
                <h2 className="example-title">Diskon Hingga 50%</h2>
                <p className="example-desc">Semua produk frozen food favorit. Berlaku hingga 31 Desember.</p>
                <button className="example-btn">Beli Sekarang</button>
              </div>
            </div>
            <p className="example-caption">Gambar: Produk tersusun rapi + ruang kosong untuk teks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Table with Thumbnails
// ============================================
function HeroSlidesTable({ slides, loading, onEdit, onDelete, onToggleActive }) {
  if (loading) return <div className="loading-state">Memuat data slide...</div>;

  return (
    <div className="admin-table-container">
      <table className="admin-table hero-slides-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>Urutan</th>
            <th style={{ width: '140px' }}>Pratinjau</th>
            <th>Konten</th>
            <th style={{ width: '100px' }}>Status</th>
            <th style={{ width: '140px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {slides.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="empty-state">
                  <span className="empty-icon">🎞️</span>
                  <p>Belum ada slide Hero Carousel</p>
                  <button className="btn-admin-primary" onClick={() => window.location.href = '#/admin/hero-slides'}>Tambah Slide Pertama</button>
                </div>
              </td>
            </tr>
          ) : (
            slides.map(slide => (
              <tr key={slide.id}>
                <td>
                  <span className="order-badge">{slide.order}</span>
                </td>
                <td>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="slide-thumb"
                    onError={(e) => { e.target.src = 'https://placehold.co/140x70/E5E7EB/9CA3AF?text=Error'; }}
                  />
                </td>
                <td>
                  <strong>{slide.title}</strong>
                  {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
                  <p className="slide-meta">
                    CTA: <code>{slide.cta_text}</code> → <code>{slide.cta_link}</code>
                  </p>
                </td>
                <td>
                  <button
                    className={`status-toggle ${slide.is_active ? 'active' : 'inactive'}`}
                    onClick={() => onToggleActive(slide)}
                    title={slide.is_active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <span className="status-dot" />
                    {slide.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action edit" onClick={() => onEdit(slide)} title="Edit">✏️</button>
                    <button className="btn-action delete" onClick={() => onDelete(slide.id)} title="Hapus">🗑️</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}