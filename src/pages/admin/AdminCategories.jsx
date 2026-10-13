import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './AdminShared.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) console.error(error);
      else setCategories(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    let usedCount = 0;
    try {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', id);
      usedCount = count || 0;
    } catch {
      usedCount = 0;
    }
    const msg = usedCount > 0
      ? `Kategori ini dipakai ${usedCount} produk. Yakin hapus? (Produk terkait akan kehilangan kategori)`
      : 'Yakin ingin menghapus kategori ini? (Produk yang terhubung mungkin kehilangan kategori)';
    if (window.confirm(msg)) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) {
        fetchCategories();
      } else {
        alert('Gagal menghapus kategori: ' + error.message);
      }
    }
  };

  const handleEdit = (cat) => {
    setFormData({ id: cat.id ?? null, name: cat.name || '', description: cat.description || '' });
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: null, name: '', description: '' });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = (formData.name || '').trim();
    if (!name) {
      alert('Nama kategori wajib diisi.');
      return;
    }
    const duplicate = categories.some(
      (c) => c.id !== formData.id && (c.name || '').trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      alert('Nama kategori sudah ada.');
      return;
    }
    setSaving(true);

    const payload = {
      name,
      description: (formData.description || '').trim()
    };

    let error;
    if (formData.id) {
      // Update
      const res = await supabase.from('categories').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from('categories').insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setShowForm(false);
      fetchCategories();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Kategori</h1>
          <p className="admin-page-subtitle">Kelola kategori produk untuk filter halaman</p>
        </div>
        {!showForm && (
          <button className="btn-admin-primary" onClick={handleAdd}>
            +Tambah Kategori
          </button>
        )}
      </div>

      <div className="admin-card">
        {showForm ? (
          <div className="admin-form-container">
            <h2 className="admin-form-title">{formData.id ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-group">
                <label>Nama Kategori *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Misal: Daging Ayam"
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea 
                  rows="3" 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Opsional"
                ></textarea>
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
                  <th>ID</th>
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center">Memuat data...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">Belum ada kategori.</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action edit" onClick={() => handleEdit(cat)} title="Edit">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="btn-action delete" onClick={() => handleDelete(cat.id)} title="Hapus">
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
        )}
      </div>
    </div>
  );
}
