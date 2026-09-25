import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
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
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__price">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <span className="product-card__rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {product.rating}
          </span>
        </div>
      </div>
    </Link>
  )
}
