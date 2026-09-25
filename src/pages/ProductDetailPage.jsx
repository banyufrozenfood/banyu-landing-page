import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import { dummyProducts, dummyReviews } from '../data/products.js'
import './ProductDetailPage.css'

const WHATSAPP_NUMBER = '6281234567890'

function StarRating({ rating, size = 16 }) {
  return (
    <span className="star-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.round(rating) ? '#FFD700' : '#E2E8F0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="rating-bar">
      <span className="rating-bar__label">{star}★</span>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar__count">{count}</span>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = dummyProducts.find((p) => p.id === Number(id))
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  const reviews = useMemo(
    () => dummyReviews.filter((r) => r.product_id === Number(id)),
    [id]
  )

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => { breakdown[r.rating]++ })
    return breakdown
  }, [reviews])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return dummyProducts
      .filter((p) => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4)
  }, [product])

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

  const waMessage = `Halo Banyu, saya tertarik dengan produk *${product.name}* (Rp ${product.price.toLocaleString('id-ID')}). Apakah masih tersedia?`
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`

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
              src={product.images[selectedImage]}
              alt={`${product.name} - Foto ${selectedImage + 1}`}
            />
            {product.is_featured && (
              <span className="product-gallery__badge">⭐ Unggulan</span>
            )}
          </div>
          <div className="product-gallery__thumbs">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`product-gallery__thumb${idx === selectedImage ? ' product-gallery__thumb--active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Produk */}
        <div className="product-info">
          <span className="product-info__category">{product.category}</span>
          <h1 className="product-info__name">{product.name}</h1>

          <div className="product-info__rating">
            <StarRating rating={product.rating} size={18} />
            <span className="product-info__rating-num">{product.rating}</span>
            <span className="product-info__review-count">({product.review_count} ulasan)</span>
          </div>

          <div className="product-info__price">
            Rp {product.price.toLocaleString('id-ID')}
          </div>

          <div className="product-info__stock">
            {product.stock > 0 ? (
              <span className="product-info__stock--available">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Stok tersedia ({product.stock} pcs)
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
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp product-cta__btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pesan via WhatsApp
            </a>
            <a href={product.tokopedia_url} target="_blank" rel="noopener noreferrer" className="btn product-cta__btn product-cta__btn--tokped">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm3 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
              </svg>
              Beli di Tokopedia
            </a>
            <a href={product.shopee_url} target="_blank" rel="noopener noreferrer" className="btn product-cta__btn product-cta__btn--shopee">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm4 4a4 4 0 018 0v1H8V8zm-1 3h10v7H7v-7zm2 2v3h6v-3H9z"/>
              </svg>
              Beli di Shopee
            </a>
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
                <table>
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ulasan Pelanggan */}
      <section className="product-reviews-section">
        <div className="container">
          <h2 className="product-reviews__title">Ulasan Pelanggan</h2>

          <div className="product-reviews">
            <div className="product-reviews__summary">
              <div className="product-reviews__avg">
                <span className="product-reviews__avg-num">{product.rating}</span>
                <span className="product-reviews__avg-max">/ 5</span>
              </div>
              <StarRating rating={product.rating} size={20} />
              <p className="product-reviews__total">{product.review_count} ulasan</p>

              <div className="product-reviews__breakdown">
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingBar
                    key={star}
                    star={star}
                    count={ratingBreakdown[star]}
                    total={reviews.length}
                  />
                ))}
              </div>
            </div>

            <div className="product-reviews__list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card__header">
                      <div className="review-card__avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="review-card__meta">
                        <strong className="review-card__name">{review.name}</strong>
                        <span className="review-card__date">
                          {new Date(review.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="review-card__comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="reviews-empty">
                  <p>Belum ada ulasan untuk produk ini.</p>
                </div>
              )}
            </div>
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
