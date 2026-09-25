import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { sortByOrder, nextOrder, normalizeOrderInput } from '../../lib/ordering.js';
import './AdminShared.css';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', subtitle: '', image: '', order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) console.error(error);
    else setBanners(sortByOrder(data || []));
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus banner ini?')) {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (!error) {
        fetchBanners();
      } else {
        alert('Gagal menghapus banner: ' + error.message);
      }
    }
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: null, title: '', subtitle: '', image: '', order: nextOrder(banners) });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      order: normalizeOrderInput(formData.order)
    };

    let error;
    if (formData.id) {
      // Update
      const res = await supabase.from('banners').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from('banners').insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setShowForm(false);
      fetchBanners();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Banner</h1>
          <p className="admin-page-subtitle">Atur gambar banner carousel di halaman beranda</p>
        </div>
        {!showForm && (
          <button className="btn-admin-primary" onClick={handleAdd}>
            + Tambah Banner
          </button>
        )}
      </div>

      <div className="admin-card">
        {showForm ? (
          <div className="admin-form-container">
            <h2 className="admin-form-title">{formData.id ? 'Edit Banner' : 'Tambah Banner Baru'}</h2>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-group">
                <label>Judul Banner *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Promo Spesial Banyu"
                />
              </div>
              <div className="form-group">
                <label>Subjudul (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.subtitle || ''} 
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="Diskon 20% untuk pembelian minggu ini"
                />
              </div>
              <div className="form-group">
                <label>URL Gambar Banner *</label>
                <input 
                  type="url" 
                  required 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280' }}>
                  Masukkan URL gambar secara langsung. Disarankan rasio 16:9 atau lebar minimal 1200px.
                </small>
              </div>
              <div className="form-group">
                <label>Urutan (Angka) *</label>
                <input 
                  type="number" 
                  required 
                  value={formData.order} 
                  onChange={(e) => setFormData({...formData, order: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-admin-secondary" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Urutan</th>
                  <th>Gambar Banner</th>
                  <th>Judul / Teks</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center">Memuat data...</td></tr>
                ) : banners.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">Belum ada banner aktif.</td></tr>
                ) : (
                  banners.map(banner => (
                    <tr key={banner.id}>
                      <td>{banner.order}</td>
                      <td>
                        <img 
                          src={banner.image} 
                          alt={banner.title} 
                          style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </td>
                      <td>
                        <strong>{banner.title}</strong>
                        {banner.subtitle && <p style={{ margin: '4px 0 0', color: '#666', fontSize: '12px' }}>{banner.subtitle}</p>}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action edit" onClick={() => handleEdit(banner)}>✏️</button>
                          <button className="btn-action delete" onClick={() => handleDelete(banner.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
