import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './AdminShared.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', icon: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) console.error(error);
    else setCategories(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini? (Produk yang terhubung mungkin kehilangan kategori)')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) {
        fetchCategories();
      } else {
        alert('Gagal menghapus kategori: ' + error.message);
      }
    }
  };

  const handleEdit = (cat) => {
    setFormData(cat);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: null, name: '', icon: '📦', description: '' });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: formData.name,
      icon: formData.icon,
      description: formData.description
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
            + Tambah Kategori
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
                <label>Icon (Emoji/Teks) *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.icon} 
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="Misal: 🍗"
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
                  <th>Icon</th>
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center">Memuat data...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">Belum ada kategori.</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td style={{ fontSize: '1.5rem' }}>{cat.icon}</td>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action edit" onClick={() => handleEdit(cat)}>✏️</button>
                          <button className="btn-action delete" onClick={() => handleDelete(cat.id)}>🗑️</button>
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
