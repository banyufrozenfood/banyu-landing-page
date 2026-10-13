import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import { useCart } from '../components/CartContext.jsx'
import { supabase } from '../lib/supabase.js'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { data: prodData, error: prodError } = await supabase.from('products').select('*, categories(name)').eq('id', id).single()
        if (prodError || !prodData) {
          setProduct(null)
          setRelatedProducts([])
          return
        }
        setProduct(prodData)
        setSelectedImage(0) // Reset image on product change
        try {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('category_id', prodData.category_id)
            .neq('id', prodData.id)
            .limit(4)
          setRelatedProducts(relatedData || [])
        } catch (e) {
          console.error('Gagal memuat produk terkait:', e)
          setRelatedProducts([])
        }
      } catch (e) {
        console.error('Gagal memuat produk:', e)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Memuat produk...</div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-notfound container">
          <span className="product-notfound__icon">😕</span>
          <h2>Produk Tidak Ditemukan</h2>
          <p>Produk yang Anda cari tidak tersedia atau sudah dihapus.</p>
          <Link to="/produk" className="btn btn-primary">Kembali ke Produk</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const tokopediaUrl = product.tokopedia_url || ''
  const shopeeUrl = product.shopee_url || ''
  const hasTokopedia = product.tokopedia_enabled !== false && !!tokopediaUrl && tokopediaUrl !== '#'
  const hasShopee = product.shopee_enabled !== false && !!shopeeUrl && shopeeUrl !== '#'

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail__header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/produk">Produk</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="product-detail container">
        {/* Galeri Foto */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={(Array.isArray(product.images) && product.images[selectedImage]) || 'https://placehold.co/600x600/E2E8F0/6B7280?text=No+Image'}
              alt={`${product.name || 'Produk'} - Foto ${selectedImage + 1}`}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/E2E8F0/6B7280?text=No+Image'; }}
            />
            {product.is_featured && (
              <span className="product-gallery__badge">⭐ Unggulan</span>
            )}
          </div>
          <div className="product-gallery__thumbs">
            {(Array.isArray(product.images) ? product.images : []).filter(Boolean).map((img, idx) => (
              <button
                key={idx}
                className={`product-gallery__thumb${idx === selectedImage ? ' product-gallery__thumb--active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${product.name || 'Produk'} thumbnail ${idx + 1}`} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/E2E8F0/6B7280?text=No+Image'; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info Produk */}
        <div className="product-info">
          <span className="product-info__category">{product.categories?.name || 'Umum'}</span>
          <h1 className="product-info__name">{product.name}</h1>

          <div className="product-info__price">
            Rp {(Number(product.price) || 0).toLocaleString('id-ID')}
          </div>

          <div className="product-info__stock">
            {product.stock != null && Number(product.stock) > 0 ? (
              <span className="product-info__stock--available">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Stok tersedia ({Number(product.stock)} pcs)
              </span>
            ) : (
              <span className="product-info__stock--empty">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Stok habis
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="product-cta">
            <button className="btn btn-primary product-cta__btn" onClick={() => addToCart(product, 1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Tambah ke Keranjang
            </button>
            {hasTokopedia && (
            <a href={tokopediaUrl} target="_blank" rel="noopener noreferrer" className="btn product-cta__btn product-cta__btn--tokped">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm3 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
              </svg>
              Beli di Tokopedia
            </a>
            )}
            {hasShopee && (
            <a href={shopeeUrl} target="_blank" rel="noopener noreferrer" className="btn product-cta__btn product-cta__btn--shopee">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm4 4a4 4 0 018 0v1H8V8zm-1 3h10v7H7v-7zm2 2v3h6v-3H9z"/>
              </svg>
              Beli di Shopee
            </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Deskripsi / Spesifikasi */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="product-tabs">
            <button
              className={`product-tabs__tab${activeTab === 'description' ? ' product-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Deskripsi
            </button>
            <button
              className={`product-tabs__tab${activeTab === 'specs' ? ' product-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Spesifikasi
            </button>
          </div>

          <div className="product-tabs__content">
            {activeTab === 'description' && (
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="product-specs">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <table>
                    <tbody>
                      {Object.entries(product.specs).map(([key, value]) => (
                        <tr key={key}>
                          <th>{key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' ')}</th>
                          <td>{value != null && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Belum ada spesifikasi untuk produk ini.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Produk Terkait */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <div className="section-title">
              <h2>Produk Terkait</h2>
              <p>Produk lain yang mungkin kamu suka</p>
            </div>
            <div className="related-products__grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
