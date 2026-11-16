import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { sortByOrder, nextOrder, normalizeOrderInput } from '../../lib/ordering.js';
import ImagePicker from '../../components/ui/ImagePicker.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import './AdminBrandPartners.css';

export default function AdminBrandPartners() {
  const toast = useToast();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    logo: '',
    website_url: '',
    order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brand_partners')
        .select('*')
        .order('order', { ascending: true });

      if (error) console.error(error);
      else setPartners(sortByOrder(data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!(formData.name || '').trim()) newErrors.name = 'Nama brand wajib diisi';
    if (!(formData.logo || '').trim()) newErrors.logo = 'Logo wajib dipilih atau diupload';
    else if (!isValidHttpUrl(formData.logo)) newErrors.logo = 'Gunakan URL http(s) yang valid';
    if ((formData.website_url || '').trim() && !isValidHttpUrl(formData.website_url)) {
      newErrors.website_url = 'Gunakan URL http(s) yang valid';
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
    if (!window.confirm('Yakin ingin menghapus brand partner ini?')) return;
    try {
      const { error } = await supabase.from('brand_partners').delete().eq('id', id);
      if (error) throw error;
      toast.success('Brand partner berhasil dihapus.');
      await fetchPartners();
    } catch (err) {
      console.error('Gagal menghapus brand partner:', err);
      toast.error('Gagal menghapus brand partner. Silakan coba lagi.');
    }
  };

  const handleToggleActive = async (partner) => {
    if (togglingId) return
    setTogglingId(partner.id)
    try {
      const { error } = await supabase
        .from('brand_partners')
        .update({ is_active: !partner.is_active })
        .eq('id', partner.id);
      if (error) throw error;
      await fetchPartners();
    } catch (err) {
      console.error('Gagal mengubah status brand partner:', err);
      toast.error('Gagal mengubah status brand partner. Silakan coba lagi.');
    } finally {
      setTogglingId(null)
    }
  };

  const handleEdit = (partner) => {
    setFormData({
      id: partner.id ?? null,
      name: partner.name || '',
      logo: partner.logo || '',
      website_url: partner.website_url || '',
      order: partner.order ?? 0,
      is_active: partner.is_active ?? true,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: '',
      logo: '',
      website_url: '',
      order: nextOrder(partners),
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
      name: (formData.name || '').trim(),
      logo: (formData.logo || '').trim(),
      website_url: (formData.website_url || '').trim() || null,
      order: normalizeOrderInput(formData.order),
      is_active: formData.is_active,
    };

    try {
      const res = formData.id
        ? await supabase.from('brand_partners').update(payload).eq('id', formData.id)
        : await supabase.from('brand_partners').insert([payload]);
      if (res.error) throw res.error;
      setShowForm(false);
      toast.success(formData.id ? 'Brand partner berhasil diperbarui.' : 'Brand partner berhasil ditambahkan.');
      await fetchPartners();
    } catch (err) {
      console.error('Gagal menyimpan brand partner:', err);
      toast.error('Gagal menyimpan brand partner. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header with Help Info */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Brand Partner</h1>
          <p className="admin-page-subtitle">
            Kelola logo brand partner yang ditampilkan di halaman beranda
          </p>
        </div>
        {!showForm && (
          <button className="btn-admin-primary" onClick={handleAdd}>
            +Tambah Brand Partner
          </button>
        )}
      </div>

      {/* Visual Guide Card */}
      <div className="admin-guide-card">
        <div className="guide-header">
          <span className="guide-icon">ðŸ“</span>
          <div>
            <h3>Panduan Visual: Di Mana Logo Ini Tampil?</h3>
            <p>Logo akan muncul di <strong>Section Brand Partner (Bagian Tengah Halaman Beranda)</strong> — area bawah judul "Brand Partner Kami" dan di atas footer.</p>
          </div>
        </div>
        <div className="guide-preview">
          <div className="preview-frame">
            <div className="preview-label">TAMPILAN DI WEBSITE (Desktop)</div>
            <div className="preview-brand-section">
              <div className="preview-brand-item">
                <img src="https://placehold.co/160x80/F8FAFC/6B7280?text=Brand+Name" alt="Brand" loading="lazy" />
                <span className="preview-brand-name">Nama Brand</span>
              </div>
              <div className="preview-brand-item">
                <img src="https://placehold.co/160x80/F8FAFC/6B7280?text=Brand+Name" alt="Brand" loading="lazy" />
                <span className="preview-brand-name">Nama Brand</span>
              </div>
              <div className="preview-brand-item">
                <img src="https://placehold.co/160x80/F8FAFC/6B7280?text=Brand+Name" alt="Brand" loading="lazy" />
                <span className="preview-brand-name">Nama Brand</span>
              </div>
            </div>
            <div className="preview-notes">
              <span>ðŸ“ Rasio: 2:1 (Lebar x Tinggi)</span>
              <span>ðŸ“± Mobile: Otomatis di-resize, nama tetap terbaca</span>
              <span>ðŸ”— Website URL: akan muncul saat diklik (opsional)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        {showForm ? (
          <BrandPartnerForm
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
          <BrandPartnersTable
            partners={partners}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onAdd={handleAdd}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Form with Live Preview
// ============================================
function BrandPartnerForm({ formData, setFormData, errors, setErrors, saving, onSave, onCancel, isEdit }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">{isEdit ? 'Edit Brand Partner' : 'Tambah Brand Partner Baru'}</h2>

      <div className="brand-partner-form-layout">
        {/* Left: Form Fields */}
        <div className="form-panel">
          <form onSubmit={onSave} className="admin-form">

            <div className="form-group">
              <label>Nama Brand <span className="required">*</span></label>
              <input
                type="text"
                required
                maxLength={80}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Contoh: Fiesta, So Good, Bernardi"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
              <span className="help-text">Maks 80 karakter. Nama brand akan muncul di bawah logo.</span>
            </div>

            <div className="form-group">
              <label>Logo Brand <span className="required">*</span></label>
              <ImagePicker
                value={formData.logo}
                category="logo"
                onChange={(url) => handleChange('logo', url)}
              />
              {errors.logo && <span className="error-text">{errors.logo}</span>}
              <span className="help-text">
                Pilih dari Media Library, upload dari HP/komputer, atau pakai link.
                <br />Disarankan PNG transparan rasio 2:1 (mis. 160×80px).
              </span>
            </div>

            <div className="form-group">
              <label>Website URL (Opsional)</label>
              <input
                type="text"
                value={formData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                placeholder="https://brand-name.co.id"
              />
              {errors.website_url && <span className="error-text">{errors.website_url}</span>}
              <span className="help-text">URL yang akan muncul saat logo diklik. Kosongkan jika tidak ada.</span>
            </div>

            <div className="form-group">
              <label>Urutan <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                required
                value={formData.order}
                onChange={(e) => handleChange('order', e.target.value)}
                placeholder="1, 2, 3... (Brand dengan urutan 1 tampil pertama)"
              />
              <span className="help-text">Brand diurutkan dari angka terkecil ke terbesar</span>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="brand-partner-is-active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                <label htmlFor="brand-partner-is-active" className="toggle-label">
                  <span className={formData.is_active ? 'on' : 'off'}>
                    {formData.is_active ? 'Aktif (Tampil di Website)' : 'Nonaktif (Disembunyikan)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={onCancel}>Batal</button>
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : (isEdit ? 'Update Brand' : 'Simpan Brand')}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Visual Reference */}
        <div className="reference-panel">
          <div className="reference-card">
            <h4>ðŸ“‹ Referensi Cepat</h4>
            <div className="ref-item">
              <strong>Ukuran Ideal:</strong> 160 × 80 px (rasio 2:1)
            </div>
            <div className="ref-item">
              <strong>Format:</strong> PNG (disarankan untuk bg transparan), JPG, WebP
            </div>
            <div className="ref-item">
              <strong>Ukuran File:</strong> kurang dari 200 KB untuk loading cepat
            </div>
            <div className="ref-item">
              <strong>Area Aman (Safe Zone):</strong> Logo/icon di tengah, biarkan margin di sisi
            </div>
            <div className="ref-item warning">
              <strong>⚠️ Hindari:</strong> Gambar teks penuh, resolusi rendah, file &gt; 500KB
            </div>
          </div>

          <div className="reference-card example">
            <h4>ðŸ’¡ Contoh Logo yang Baik</h4>
            <div className="example-logo">
              <img src="https://placehold.co/160x80/E5E7EB/9CA3AF?text=Brand" alt="Example Logo" loading="lazy" />
              <p className="example-logo-name">Nama Brand</p>
            </div>
            <p className="example-caption">Rasio 2:1, transparan background, teks rapi di tengah</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Table with Logos
// ============================================
function BrandPartnersTable({ partners, loading, onEdit, onDelete, onToggleActive, onAdd }) {
  if (loading) return <div className="loading-state">Memuat data brand partner...</div>;

  return (
    <div className="admin-table-container">
      <table className="admin-table brand-partners-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Urutan</th>
            <th style={{ width: '160px' }}>Pratinjau</th>
            <th>Konten</th>
            <th style={{ width: '100px' }}>Status</th>
            <th style={{ width: '140px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {partners.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="empty-state">
                  <span className="empty-icon">🏷️</span>
                  <p>Belum ada brand partner</p>
                  <button className="btn-admin-primary" onClick={onAdd}>Tambah Brand Partner Pertama</button>
                </div>
              </td>
            </tr>
          ) : (
            partners.map(partner => (
              <tr key={partner.id}>
                <td data-label="Urutan">
                  <span className="order-circle">{partner.order}</span>
                </td>
                <td data-label="Pratinjau">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="partner-thumb"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Error'; }}
                  />
                </td>
                <td data-label="Konten">
                  <strong>{partner.name}</strong>
                  {partner.website_url && <p className="partner-website">Website: <a href={partner.website_url} target="_blank" rel="noopener noreferrer">{partner.website_url}</a></p>}
                  <p className="partner-meta">Order: {partner.order}</p>
                </td>
                <td data-label="Status">
                  <button
                    className={`status-toggle ${partner.is_active ? 'active' : 'inactive'}`}
                    onClick={() => onToggleActive(partner)}
                    title={partner.is_active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <span className="status-dot" />
                    {partner.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td data-label="Aksi">
                  <div className="action-buttons">
                    <button className="btn-action edit" onClick={() => onEdit(partner)} title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="btn-action delete" onClick={() => onDelete(partner.id)} title="Hapus">
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