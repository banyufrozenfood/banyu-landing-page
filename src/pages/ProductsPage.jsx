import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import { dummyProducts, dummyCategories } from '../data/products.js'
import './ProductsPage.css'

const PRODUCTS_PER_PAGE = 6

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? Number(searchParams.get('category')) : null
  )
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  })
  const [minRating, setMinRating] = useState(
    searchParams.get('rating') ? Number(searchParams.get('rating')) : 0
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...dummyProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory)
    }

    if (priceRange.min) {
      result = result.filter((p) => p.price >= Number(priceRange.min))
    }
    if (priceRange.max) {
      result = result.filter((p) => p.price <= Number(priceRange.max))
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    switch (sortBy) {
      case 'cheapest':
        result.sort((a, b) => a.price - b.price)
        break
      case 'expensive':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }

    return result
  }, [search, selectedCategory, priceRange, minRating, sortBy])

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const handleCategoryClick = (catId) => {
    const newCat = selectedCategory === catId ? null : catId
    setSelectedCategory(newCat)
    setCurrentPage(1)
    updateParams({ category: newCat })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    updateParams({ search: search.trim() || null })
  }

  const handleSortChange = (val) => {
    setSortBy(val)
    setCurrentPage(1)
    updateParams({ sort: val })
  }

  const handlePriceApply = () => {
    setCurrentPage(1)
    updateParams({
      minPrice: priceRange.min || null,
      maxPrice: priceRange.max || null,
    })
  }

  const handleRatingClick = (rating) => {
    const newRating = minRating === rating ? 0 : rating
    setMinRating(newRating)
    setCurrentPage(1)
    updateParams({ rating: newRating || null })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory(null)
    setPriceRange({ min: '', max: '' })
    setMinRating(0)
    setSortBy('newest')
    setCurrentPage(1)
    setSearchParams({})
  }

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    setSearchParams(params)
  }

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || minRating > 0 || search

  return (
    <div className="products-page">
      <Navbar />

      <div className="products-page__header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Produk</span>
          </nav>
          <h1>Semua Produk</h1>
          <p>Temukan berbagai pilihan frozen food berkualitas untuk keluarga Anda</p>
        </div>
      </div>

      <div className="products-page__content container">
        {/* Mobile filter toggle */}
        <div className="products-mobile-toolbar">
          <button
            className="products-page__filter-toggle btn btn-secondary"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter {hasActiveFilters && '•'}
          </button>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`products-sidebar${mobileFilterOpen ? ' products-sidebar--open' : ''}`}>
            <div className="products-sidebar__header">
              <h3>Filter</h3>
              {hasActiveFilters && (
                <button className="products-sidebar__clear" onClick={clearFilters}>
                  Reset
                </button>
              )}
              <button
                className="products-sidebar__close"
                onClick={() => setMobileFilterOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Search */}
            <form className="filter-group" onSubmit={handleSearchSubmit}>
              <label className="filter-group__label">Cari Produk</label>
              <div className="filter-search">
                <input
                  type="text"
                  placeholder="Ketik nama produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" aria-label="Cari">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Kategori */}
            <div className="filter-group">
              <label className="filter-group__label">Kategori</label>
              <div className="filter-categories">
                {dummyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-category-btn${selectedCategory === cat.id ? ' filter-category-btn--active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className="filter-category-btn__icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Harga */}
            <div className="filter-group">
              <label className="filter-group__label">Rentang Harga</label>
              <div className="filter-price">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                />
              </div>
              <button className="filter-price__apply btn btn-primary" onClick={handlePriceApply}>
                Terapkan
              </button>
            </div>

            {/* Rating */}
            <div className="filter-group">
              <label className="filter-group__label">Rating Minimum</label>
              <div className="filter-ratings">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    className={`filter-rating-btn${minRating === r ? ' filter-rating-btn--active' : ''}`}
                    onClick={() => handleRatingClick(r)}
                  >
                    <span className="filter-rating-btn__stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < r ? '#FFD700' : '#E2E8F0'}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </span>
                    <span>{r}+ ke atas</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="products-sidebar__apply-mobile btn btn-primary"
              onClick={() => setMobileFilterOpen(false)}
            >
              Tampilkan {filtered.length} Produk
            </button>
          </aside>

          {mobileFilterOpen && (
            <div className="products-sidebar__overlay" onClick={() => setMobileFilterOpen(false)} />
          )}

          {/* Main Content */}
          <main className="products-main">
            <div className="products-toolbar">
              <p className="products-toolbar__count">
                Menampilkan <strong>{filtered.length}</strong> produk
                {selectedCategory && (
                  <> dalam kategori <strong>{dummyCategories.find(c => c.id === selectedCategory)?.name}</strong></>
                )}
              </p>
              <div className="products-toolbar__sort">
                <label>Urutkan:</label>
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="newest">Terbaru</option>
                  <option value="cheapest">Termurah</option>
                  <option value="expensive">Termahal</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="products-grid" key={`${search}-${selectedCategory}-${sortBy}-${currentPage}`}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <span className="products-empty__icon">🔍</span>
                <h3>Produk tidak ditemukan</h3>
                <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Reset Filter
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Full-width Pagination Below Layout */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination__btn pagination__num${page === currentPage ? ' pagination__num--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
