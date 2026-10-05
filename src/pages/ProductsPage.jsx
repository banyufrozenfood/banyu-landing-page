import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import { supabase } from '../lib/supabase.js'
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
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*, categories(name)'),
        supabase.from('categories').select('*').order('name')
      ])
      
      if (prodRes.data) setProducts(prodRes.data)
      if (catRes.data) setCategories(catRes.data)
      
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Sinkronkan filter dari URL agar link kategori (mis. dari footer) tetap
  // memfilter walau halaman /produk sudah terbuka.
  useEffect(() => {
    const cat = searchParams.get('category')
    setSelectedCategory(cat ? Number(cat) : null)
    setSortBy(searchParams.get('sort') || 'newest')
    setCurrentPage(1)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.categories?.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
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

    switch (sortBy) {
      case 'cheapest':
        result.sort((a, b) => a.price - b.price)
        break
      case 'expensive':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return result
  }, [products, search, selectedCategory, priceRange, sortBy])

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

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory(null)
    setPriceRange({ min: '', max: '' })
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

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || search

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
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-category-btn${selectedCategory === cat.id ? ' filter-category-btn--active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
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
                  <> dalam kategori <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong></>
                )}
              </p>
              <div className="products-toolbar__sort">
                <label>Urutkan:</label>
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="newest">Terbaru</option>
                  <option value="cheapest">Termurah</option>
                  <option value="expensive">Termahal</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="products-empty">
                <span className="products-empty__icon">⏳</span>
                <h3>Memuat produk...</h3>
              </div>
            ) : paginatedProducts.length > 0 ? (
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
