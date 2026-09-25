import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import './AdminShared.css';

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
    is_featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

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
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, name: val, slug: generateSlug(val) });
  };

  const handleEdit = (prod) => {
    setFormData({
      ...prod,
      images: prod.images ? prod.images.join(', ') : '',
      category_id: prod.category_id || ''
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
      is_featured: false
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Convert comma-separated images to array
    const imageArray = formData.images
      ? formData.images.split(',').map(url => url.trim()).filter(url => url)
      : [];

    const payload = {
      name: formData.name,
      slug: formData.slug,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      price: parseInt(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      description: formData.description,
      tokopedia_url: formData.tokopedia_url,
      shopee_url: formData.shopee_url,
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
    p.name.toLowerCase().includes(search.toLowerCase())
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
            + Tambah Produk
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

              <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label>URL Tokopedia</label>
                  <input 
                    type="url" 
                    value={formData.tokopedia_url || ''} 
                    onChange={(e) => setFormData({...formData, tokopedia_url: e.target.value})}
                    placeholder="https://tokopedia.com/..."
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>URL Shopee</label>
                  <input 
                    type="url" 
                    value={formData.shopee_url || ''} 
                    onChange={(e) => setFormData({...formData, shopee_url: e.target.value})}
                    placeholder="https://shopee.co.id/..."
                  />
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
                              alt={product.name} 
                              className="td-product-img"
                            />
                            <span className="td-product-name">{product.name}</span>
                          </div>
                        </td>
                        <td>{product.categories?.name || '-'}</td>
                        <td>Rp {product.price.toLocaleString('id-ID')}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action edit" onClick={() => handleEdit(product)}>✏️</button>
                            <button className="btn-action delete" onClick={() => handleDelete(product.id)}>🗑️</button>
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
