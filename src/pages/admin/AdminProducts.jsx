import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './AdminShared.css';

function isValidHttpUrl(value) {
  try {
    const u = new URL((value || '').trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    slug: '',
    category_id: '',
    price: 0,
    stock: 0,
    description: '',
    images: '',
    tokopedia_url: '',
    shopee_url: '',
    tokopedia_enabled: false,
    shopee_enabled: false,
    is_featured: false
  });

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) console.error(error);
      else setCategories(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        fetchProducts();
      } else {
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  };

  const generateSlug = (name) => {
    return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, name: val, slug: generateSlug(val) });
  };

  const handleEdit = (prod) => {
    setFormData({
      ...prod,
      images: Array.isArray(prod.images) ? prod.images.join(', ') : (prod.images || ''),
      category_id: prod.category_id ?? ''
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: '',
      slug: '',
      category_id: '',
      price: 0,
      stock: 0,
      description: '',
      images: '',
      tokopedia_url: '',
      shopee_url: '',
      tokopedia_enabled: false,
      shopee_enabled: false,
      is_featured: false
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = (formData.name || '').trim();
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);
    if (!name) {
      alert('Nama produk wajib diisi.');
      return;
    }
    if (!formData.category_id && formData.category_id !== 0) {
      alert('Kategori wajib dipilih.');
      return;
    }
    if (formData.price === '' || !Number.isFinite(priceNum) || priceNum < 0) {
      alert('Harga harus angka 0 atau lebih.');
      return;
    }
    if (formData.stock === '' || !Number.isFinite(stockNum) || stockNum < 0) {
      alert('Stok harus angka 0 atau lebih.');
      return;
    }
    const slugRaw = (formData.slug || '').trim() || generateSlug(name);
    const slug = generateSlug(slugRaw);
    if (!slug) {
      alert('Slug URL tidak valid.');
      return;
    }
    const trimUrl = (v) => (v || '').trim();
    for (const [label, val] of [['Tokopedia', formData.tokopedia_url], ['Shopee', formData.shopee_url]]) {
      const t = trimUrl(val);
      if (t && !isValidHttpUrl(t)) {
        alert(`URL ${label} tidak valid (harus http/https).`);
        return;
      }
    }
    setSaving(true);

    // Convert comma-separated images to array
    const imageArray = formData.images
      ? String(formData.images).split(',').map(url => url.trim()).filter(url => url && isValidHttpUrl(url))
      : [];
    if (formData.images && String(formData.images).trim() && imageArray.length === 0) {
      setSaving(false);
      alert('URL gambar tidak valid (harus http/https).');
      return;
    }

    const payload = {
      name,
      slug,
      category_id: formData.category_id === '' || formData.category_id == null ? null : formData.category_id,
      price: priceNum,
      stock: stockNum,
      description: trimUrl(formData.description),
      tokopedia_url: trimUrl(formData.tokopedia_url) || null,
      shopee_url: trimUrl(formData.shopee_url) || null,
      tokopedia_enabled: !!formData.tokopedia_enabled,
      shopee_enabled: !!formData.shopee_enabled,
      is_featured: formData.is_featured,
      images: imageArray
    };

    let error;
    if (formData.id) {
      const res = await supabase.from('products').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      const res = await supabase.from('products').insert([payload]);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setShowForm(false);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Produk</h1>
          <p className="admin-page-subtitle">Kelola semua produk yang tampil di website</p>
        </div>
        {!showForm && (
          <button className="btn-admin-primary" onClick={handleAdd}>
            +Tambah Produk
          </button>
        )}
      </div>

      <div className="admin-card">
        {showForm ? (
          <div className="admin-form-container">
            <h2 className="admin-form-title">{formData.id ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSave} className="admin-form">
              
              <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Nama Produk *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={handleNameChange}
                    placeholder="Sosis Sapi Banyu"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Slug URL (Otomatis) *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Kategori *</label>
                  <select 
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Harga (Rp) *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Stok *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Produk</label>
                <textarea 
                  rows="4" 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Jelaskan detail produk ini..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>URL Gambar (Pisahkan dengan koma jika lebih dari satu)</label>
                <input 
                  type="text" 
                  value={formData.images} 
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>

              <div className="form-group">
                <label>Marketplace Produk</label>
                <p className="field-hint">Aktifkan marketplace yang menjual produk ini. Tombol hanya tampil bila aktif dan link diisi.</p>
                <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="tokopedia_enabled" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        id="tokopedia_enabled"
                        type="checkbox"
                        checked={!!formData.tokopedia_enabled}
                        onChange={(e) => setFormData({ ...formData, tokopedia_enabled: e.target.checked })}
                        style={{ width: 'auto' }}
                      />
                      Tampilkan Tokopedia
                    </label>
                    <input
                      type="url"
                      value={formData.tokopedia_url || ''}
                      onChange={(e) => setFormData({ ...formData, tokopedia_url: e.target.value })}
                      placeholder="https://www.tokopedia.com/..."
                      disabled={!formData.tokopedia_enabled}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="shopee_enabled" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        id="shopee_enabled"
                        type="checkbox"
                        checked={!!formData.shopee_enabled}
                        onChange={(e) => setFormData({ ...formData, shopee_enabled: e.target.checked })}
                        style={{ width: 'auto' }}
                      />
                      Tampilkan Shopee
                    </label>
                    <input
                      type="url"
                      value={formData.shopee_url || ''}
                      onChange={(e) => setFormData({ ...formData, shopee_url: e.target.value })}
                      placeholder="https://shopee.co.id/..."
                      disabled={!formData.shopee_enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="is_featured"
                  checked={formData.is_featured} 
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  style={{ width: 'auto', display: 'inline-block' }}
                />
                <label htmlFor="is_featured" style={{ display: 'inline', margin: 0, fontWeight: 'normal' }}>
                  Jadikan Produk Unggulan (Tampil di Homepage)
                </label>
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
          <>
            <div className="admin-card-header">
              <input 
                type="text" 
                placeholder="Cari nama produk..." 
                className="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center">Memuat data...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">Tidak ada produk ditemukan.</td></tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="td-product">
                            <img
                              src={(product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/50x50?text=No+Img'}
                              alt={product.name || 'Produk'}
                              className="td-product-img"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50?text=No+Img'; }}
                            />
                            <span className="td-product-name">{product.name || '-'}</span>
                          </div>
                        </td>
                        <td>{product.categories?.name || '-'}</td>
                        <td>Rp {(Number(product.price) || 0).toLocaleString('id-ID')}</td>
                        <td>{product.stock ?? '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action edit" onClick={() => handleEdit(product)} title="Edit">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="btn-action delete" onClick={() => handleDelete(product.id)} title="Hapus">
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
          </>
        )}
      </div>
    </div>
  );
}
