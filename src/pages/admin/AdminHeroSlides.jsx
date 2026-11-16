import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { sortByOrder, nextOrder, normalizeOrderInput } from '../../lib/ordering.js';
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx';
import { uploadMediaFile } from '../../cms/store.js';
import ImageCropper from '../../components/ui/ImageCropper.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import './AdminShared.css';
import './AdminHeroSlides.css';

export default function AdminHeroSlides() {
  const toast = useToast();
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

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order', { ascending: true });

      if (error) console.error(error);
      else setSlides(sortByOrder(data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!(formData.title || '').trim()) newErrors.title = 'Judul wajib diisi';
    if (!(formData.image || '').trim()) newErrors.image = 'URL Gambar wajib diisi';
    else if (!isValidHttpUrl(formData.image)) newErrors.image = 'Gunakan URL http(s) yang valid (contoh: https://example.com/image.jpg)';
    if (!(formData.cta_text || '').trim()) newErrors.cta_text = 'Teks tombol wajib diisi';
    if (!(formData.cta_link || '').trim()) newErrors.cta_link = 'Link tujuan wajib diisi';
    else if (!isValidHttpUrl(formData.cta_link) && !(formData.cta_link || '').startsWith('/')) {
      newErrors.cta_link = 'Gunakan URL lengkap https://... atau path relatif (contoh: /#cara-pesan)';
    }
    if (formData.order === '' || formData.order == null || !Number.isFinite(Number(formData.order)) || Number(formData.order) < 0) {
      newErrors.order = 'Urutan harus angka 0 atau lebih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidHttpUrl = (string) => {
    try {
      const u = new URL((string || '').trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus slide ini?')) return;
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
      toast.success('Slide berhasil dihapus.');
      await fetchSlides();
    } catch (err) {
      console.error('Gagal menghapus slide:', err);
      toast.error('Gagal menghapus slide. Silakan coba lagi.');
    }
  };

  const handleEdit = (slide) => {
    setFormData({
      id: slide.id ?? null,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image || '',
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      order: slide.order ?? 0,
      is_active: slide.is_active ?? true,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      title: '',
      subtitle: '',
      description: '',
      image: '',
      cta_text: 'Cara Pesan',
      cta_link: '/#cara-pesan',
      order: nextOrder(slides),
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
      title: (formData.title || '').trim(),
      subtitle: (formData.subtitle || '').trim(),
      description: (formData.description || '').trim(),
      image: (formData.image || '').trim(),
      cta_text: (formData.cta_text || '').trim(),
      cta_link: (formData.cta_link || '').trim(),
      order: normalizeOrderInput(formData.order),
      is_active: formData.is_active,
    };

    try {
      const res = formData.id
        ? await supabase.from('hero_slides').update(payload).eq('id', formData.id)
        : await supabase.from('hero_slides').insert([payload]);
      if (res.error) throw res.error;
      setShowForm(false);
      toast.success(formData.id ? 'Slide berhasil diperbarui.' : 'Slide berhasil ditambahkan.');
      await fetchSlides();
    } catch (err) {
      console.error('Gagal menyimpan slide:', err);
      toast.error('Gagal menyimpan slide. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const [togglingId, setTogglingId] = useState(null);
  const toggleActive = async (slide) => {
    if (togglingId) return
    setTogglingId(slide.id)
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);
      if (error) throw error;
      await fetchSlides();
    } catch (err) {
      console.error('Gagal mengubah status slide:', err);
      toast.error('Gagal mengubah status slide. Silakan coba lagi.');
    } finally {
      setTogglingId(null)
    }
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
            +Tambah Slide Baru
          </button>
        )}
      </div>

      {/* Panduan visual ringkas: bandingkan tampilan laptop dan HP */}
      <div className="admin-guide-card">
        <div className="guide-header">
          <span className="guide-icon">🖥️</span>
          <div>
            <h3>Tampilan di Website (Laptop &amp; HP)</h3>
            <p>Slide muncul paling atas di halaman beranda. Di laptop teks berada di <strong>kiri tengah</strong>, sedangkan di HP teks pindah ke <strong>tengah bawah</strong> dengan tombol selebar layar.</p>
          </div>
        </div>
        <div className="guide-preview">
          <figure className="device-preview">
            <figcaption className="device-preview__label">Tampilan di Laptop</figcaption>
            <div className="laptop-frame">
              <div className="laptop-frame__screen">
                <div className="hero-preview hero-preview--desktop">
                  <img src="/hero-guide-bg.png" alt="" className="hero-preview__bg" aria-hidden="true" />
                  <div className="hero-preview__overlay" />
                  <div className="hero-preview__content">
                    <span className="hero-preview__subtitle">Subtitle</span>
                    <h2 className="hero-preview__title">Judul Utama</h2>
                    <p className="hero-preview__desc">Deskripsi singkat, 1–2 baris di bawah judul</p>
                    <span className="hero-preview__cta">Teks Tombol</span>
                  </div>
                  <div className="hero-preview__dots" aria-hidden="true">
                    <span className="hero-preview__dot hero-preview__dot--active" />
                    <span className="hero-preview__dot" />
                    <span className="hero-preview__dot" />
                  </div>
                </div>
              </div>
            </div>
            <div className="laptop-frame__base" aria-hidden="true" />
          </figure>

          <figure className="device-preview">
            <figcaption className="device-preview__label">Tampilan di HP</figcaption>
            <div className="phone-frame">
              <div className="phone-frame__screen">
                <div className="hero-preview hero-preview--mobile">
                  <img src="/hero-guide-bg.png" alt="" className="hero-preview__bg" aria-hidden="true" />
                  <div className="hero-preview__overlay" />
                  <div className="hero-preview__content">
                    <span className="hero-preview__subtitle">Subtitle</span>
                    <h2 className="hero-preview__title">Judul Utama</h2>
                    <p className="hero-preview__desc">Deskripsi singkat, 1–2 baris di bawah judul</p>
                    <span className="hero-preview__cta">Teks Tombol</span>
                  </div>
                  <div className="hero-preview__dots" aria-hidden="true">
                    <span className="hero-preview__dot hero-preview__dot--active" />
                    <span className="hero-preview__dot" />
                    <span className="hero-preview__dot" />
                  </div>
                </div>
              </div>
            </div>
          </figure>

          <ul className="guide-preview__notes">
            <li><strong>Laptop:</strong> tinggi hero <strong>600px</strong>, teks rata kiri di tengah vertikal, tombol tidak melebar penuh, panah kiri/kanan tampil.</li>
            <li><strong>HP:</strong> tinggi hero <strong>480px</strong> (460px di layar kecil), teks rata tengah didorong ke bawah, tombol melebar penuh, panah disembunyikan.</li>
            <li>Gambar dipotong otomatis (<code>object-fit: cover</code>) — letakkan bagian penting di tengah agar aman di kedua ukuran.</li>
          </ul>
        </div>
      </div>

      <div className="admin-card">
        {showForm ? (
          <HeroSlideForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
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
            onAdd={handleAdd}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Penghitung karakter
// ============================================
// Menampilkan sisa karakter dan berubah warna saat mendekati batas, supaya
// admin tahu teksnya masih muat di layar HP sebelum menyimpan.
function CharCount({ value = '', max, warnAt = 0.85 }) {
  const length = (value || '').length
  const ratio = max > 0 ? length / max : 0
  const state = length > max ? 'over' : ratio >= warnAt ? 'near' : 'ok'

  return (
    <span className={`char-count char-count--${state}`} aria-live="polite">
      {length}/{max}
      {state === 'over' && ' — terlalu panjang'}
      {state === 'near' && ' — hampir penuh'}
    </span>
  )
}

// ============================================
// SUB-COMPONENT: Form with Live Preview
// ============================================
function HeroSlideForm({ formData, setFormData, errors, setErrors, saving, onSave, onCancel, isEdit }) {
  const { storageMode } = useSiteSettings();
  const toast = useToast();
  const [cropOpen, setCropOpen] = useState(false);
  const [cropBusy, setCropBusy] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
  };

  const handleCropConfirm = async (file) => {
    setCropBusy(true);
    try {
      const item = await uploadMediaFile(storageMode, file, 'hero');
      handleChange('image', item.url);
      setCropOpen(false);
    } catch (err) {
      console.error('Gagal menyimpan hasil crop:', err);
      toast.error('Gagal menyimpan hasil crop. Silakan coba lagi.');
    } finally {
      setCropBusy(false);
    }
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
                  id="hero-slide-is-active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                <label htmlFor="hero-slide-is-active" className="toggle-label">
                  <span className={formData.is_active ? 'on' : 'off'}>
                    {formData.is_active ? 'Aktif (Tampil di Website)' : 'Nonaktif (Disembunyikan)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="form-separator">KONTEN TEKS</div>

            <div className="form-group">
              <div className="form-label-row">
                <label>Judul Utama <span className="required">*</span></label>
                <CharCount value={formData.title} max={60} />
              </div>
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
              {formData.title.length > 40 && (
                <span className="field-warning">Di HP judul panjang akan memakan 3 baris atau lebih. Sebaiknya di bawah 40 karakter.</span>
              )}
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label>Subtitle (Opsional)</label>
                <CharCount value={formData.subtitle} max={80} />
              </div>
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
              <div className="form-label-row">
                <label>Deskripsi (Opsional)</label>
                <CharCount value={formData.description} max={200} />
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Contoh: Produk beku pilihan dengan bahan terbaik..."
              />
              <span className="help-text">Maks 200 karakter. 1-2 baris di bawah judul.</span>
              {formData.description.length > 120 && (
                <span className="field-warning">Di HP deskripsi sepanjang ini bisa menjadi 4 baris atau lebih dan menutupi gambar.</span>
              )}
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

            {/* Pratinjau live: laptop dan HP supaya tata letak berbeda terlihat */}
            <div className="live-preview">
              <div className="form-label-row">
                <label>Pratinjau Slide (Live)</label>
                <span className="live-preview__hint">Laptop 1280px &amp; HP 390px</span>
              </div>

              <div className="live-preview__devices">
                <figure className="device-preview">
                  <figcaption className="device-preview__label">Laptop</figcaption>
                  <div className="laptop-frame">
                    <div className="laptop-frame__screen">
                      <div className="hero-preview hero-preview--desktop">
                        <img
                          src={previewImage}
                          alt="Pratinjau slide di laptop"
                          className="hero-preview__bg"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/E5E7EB/9CA3AF?text=Gambar+Tidak+Valid'; }}
                        />
                        <div className="hero-preview__overlay" />
                        <div className="hero-preview__content">
                          {formData.subtitle && <span className="hero-preview__subtitle">{formData.subtitle}</span>}
                          <h2 className="hero-preview__title">{formData.title || 'Judul Slide'}</h2>
                          {formData.description && <p className="hero-preview__desc">{formData.description}</p>}
                          {formData.cta_text && <span className="hero-preview__cta">{formData.cta_text}</span>}
                        </div>
                        <div className="hero-preview__dots" aria-hidden="true">
                          <span className="hero-preview__dot hero-preview__dot--active" />
                          <span className="hero-preview__dot" />
                          <span className="hero-preview__dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="laptop-frame__base" aria-hidden="true" />
                </figure>

                <figure className="device-preview device-preview--phone">
                  <figcaption className="device-preview__label">HP</figcaption>
                  <div className="phone-frame">
                    <div className="phone-frame__screen">
                      <div className="hero-preview hero-preview--mobile">
                        <img
                          src={previewImage}
                          alt="Pratinjau slide di HP"
                          className="hero-preview__bg"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/E5E7EB/9CA3AF?text=Gambar+Tidak+Valid'; }}
                        />
                        <div className="hero-preview__overlay" />
                        <div className="hero-preview__content">
                          {formData.subtitle && <span className="hero-preview__subtitle">{formData.subtitle}</span>}
                          <h2 className="hero-preview__title">{formData.title || 'Judul Slide'}</h2>
                          {formData.description && <p className="hero-preview__desc">{formData.description}</p>}
                          {formData.cta_text && <span className="hero-preview__cta">{formData.cta_text}</span>}
                        </div>
                        <div className="hero-preview__dots" aria-hidden="true">
                          <span className="hero-preview__dot hero-preview__dot--active" />
                          <span className="hero-preview__dot" />
                          <span className="hero-preview__dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                </figure>
              </div>

              {errors.image && <div className="preview-error">⚠️ URL gambar tidak valid</div>}
              {formData.image && (
                <button
                  type="button"
                  className="btn-admin-secondary"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => setCropOpen(true)}
                  disabled={cropBusy}
                >
                  ✂️ Sesuaikan Gambar (Crop / Geser)
                </button>
              )}
            </div>

            {cropOpen && formData.image && (
              <ImageCropper
                src={formData.image}
                aspect={2}
                title="Sesuaikan Gambar Slide (Crop / Geser)"
                onConfirm={handleCropConfirm}
                onClose={() => setCropOpen(false)}
              />
            )}

            <div className="form-group">
              <div className="form-label-row">
                <label>Teks Tombol (CTA) <span className="required">*</span></label>
                <CharCount value={formData.cta_text} max={25} />
              </div>
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
                placeholder="/#cara-pesan atau https://wa.me/628xxxx"
              />
              {errors.cta_link && <span className="error-text">{errors.cta_link}</span>}
              <span className="help-text">
                <strong>Path internal:</strong> <code>/#cara-pesan</code>, <code>/#lokasi</code><br />
                <strong>URL eksternal:</strong> <code>https://wa.me/628xxxx</code>, <code>https://gofood.co.id/...</code>
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
                <span className="example-subtitle">Subtitle: Banyu Frozen Food • Cigugur Tengah</span>
                <h2 className="example-title">Stok Makanan Praktis</h2>
                <p className="example-desc">Sosis, nugget, kornet, dan camilan Korea. Harga Rp10.000–Rp49.000.</p>
                <button className="example-btn">Cara Pesan</button>
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
function HeroSlidesTable({ slides, loading, onEdit, onDelete, onToggleActive, onAdd }) {
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
                  <button className="btn-admin-primary" onClick={onAdd}>Tambah Slide Pertama</button>
                </div>
              </td>
            </tr>
          ) : (
            slides.map(slide => (
              <tr key={slide.id}>
                <td data-label="Urutan">
                  <span className="order-circle">{slide.order}</span>
                </td>
                <td data-label="Pratinjau">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="slide-thumb"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/140x70/E5E7EB/9CA3AF?text=Error'; }}
                  />
                </td>
                <td data-label="Konten">
                  <strong>{slide.title}</strong>
                  {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
                  <p className="slide-meta">
                    CTA: <code>{slide.cta_text}</code> → <code>{slide.cta_link}</code>
                  </p>
                </td>
                <td data-label="Status">
                  <button
                    className={`status-toggle ${slide.is_active ? 'active' : 'inactive'}`}
                    onClick={() => onToggleActive(slide)}
                    title={slide.is_active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <span className="status-dot" />
                    {slide.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td data-label="Aksi">
                  <div className="action-buttons">
                    <button className="btn-action edit" onClick={() => onEdit(slide)} title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="btn-action delete" onClick={() => onDelete(slide.id)} title="Hapus">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
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
