import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { sortByOrder, nextOrder, normalizeOrderInput } from '../../lib/ordering.js';
import ImagePicker from '../../components/ui/ImagePicker.jsx';
import './AdminBrandPartners.css';

export default function AdminBrandPartners() {
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

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('brand_partners')
      .select('*')
      .order('order', { ascending: true });

    if (error) console.error(error);
    else setPartners(sortByOrder(data || []));
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama brand wajib diisi';
    if (!formData.logo.trim()) newErrors.logo = 'Logo wajib dipilih atau diupload';
    else if (!isValidUrl(formData.logo)) newErrors.logo = 'Format URL tidak valid';
    if (formData.website_url.trim() && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Format URL tidak valid';
    }
    if (formData.order < 0 || !Number.isFinite(Number(formData.order))) {
      newErrors.order = 'Urutan harus angka 0 atau lebih';
    }

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
    if (window.confirm('Yakin ingin menghapus brand partner ini?')) {
      const { error } = await supabase.from('brand_partners').delete().eq('id', id);
      if (!error) fetchPartners();
      else alert('Gagal menghapus: ' + error.message);
    }
  };

  const handleToggleActive = async (partner) => {
    const { error } = await supabase
      .from('brand_partners')
      .update({ is_active: !partner.is_active })
      .eq('id', partner.id);
    if (!error) fetchPartners();
    else alert('Gagal mengubah status: ' + error.message);
  };

  const handleEdit = (partner) => {
    setFormData(partner);
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
      name: formData.name.trim(),
      logo: formData.logo.trim(),
      website_url: formData.website_url.trim() || null,
      order: normalizeOrderInput(formData.order),
      is_active: formData.is_active,
    };

    let error;
    if (formData.id) {
      const res = await supabase.from('brand_partners').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      const res = await supabase.from('brand_partners').insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setShowForm(false);
      fetchPartners();
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
            + Tambah Brand Partner
          </button>
        )}
      </div>

      {/* Visual Guide Card */}
      <div className="admin-guide-card">
        <div className="guide-header">
          <span className="guide-icon">📍</span>
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
              <span>📐 Rasio: 2:1 (Lebar x Tinggi)</span>
              <span>📱 Mobile: Otomatis di-resize, nama tetap terbaca</span>
              <span>🔗 Website URL: akan muncul saat diklik (opsional)</span>
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
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Form with Live Preview
// ============================================
function BrandPartnerForm({ formData, setFormData, errors, saving, onSave, onCancel, isEdit }) {
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
            <h4>📋 Referensi Cepat</h4>
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
            <h4>💡 Contoh Logo yang Baik</h4>
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
function BrandPartnersTable({ partners, loading, onEdit, onDelete, onToggleActive }) {
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
                  <button className="btn-admin-primary" onClick={() => window.location.href = '#/admin/brand-partners'}>Tambah Brand Partner Pertama</button>
                </div>
              </td>
            </tr>
          ) : (
            partners.map(partner => (
              <tr key={partner.id}>
                <td>
                  <span className="order-badge">{partner.order}</span>
                </td>
                <td>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="partner-thumb"
                    onError={(e) => { e.target.src = 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Error'; }}
                  />
                </td>
                <td>
                  <strong>{partner.name}</strong>
                  {partner.website_url && <p className="partner-website">Website: <a href={partner.website_url} target="_blank" rel="noopener noreferrer">{partner.website_url}</a></p>}
                  <p className="partner-meta">Order: {partner.order}</p>
                </td>
                <td>
                  <button
                    className={`status-toggle ${partner.is_active ? 'active' : 'inactive'}`}
                    onClick={() => onToggleActive(partner)}
                    title={partner.is_active ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                  >
                    <span className="status-dot" />
                    {partner.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action edit" onClick={() => onEdit(partner)} title="Edit">✏️</button>
                    <button className="btn-action delete" onClick={() => onDelete(partner.id)} title="Hapus">🗑️</button>
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