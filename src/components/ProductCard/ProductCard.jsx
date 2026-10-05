import { Link } from 'react-router-dom'
import { useCart } from '../CartContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  return (
    <Link to={`/produk/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/E2E8F0/6B7280?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        {product.is_featured && (
          <span className="product-card__badge">⭐ Unggulan</span>
        )}
        {product.stock === 0 && (
          <span className="product-card__badge product-card__badge--soldout">Habis</span>
        )}
      </div>
      <div className="product-card__info">
        <span className="product-card__category">{product.categories?.name || product.category || 'Umum'}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__price">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button className="product-card__cart-btn" onClick={handleAddToCart} disabled={product.stock === 0} aria-label="Tambah ke keranjang">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
