import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import LocationPage from './pages/LocationPage.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminBanners from './pages/admin/AdminBanners.jsx'
import AdminHeroSlides from './pages/admin/AdminHeroSlides.jsx'
import AdminBrandPartners from './pages/admin/AdminBrandPartners.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminMedia from './pages/admin/AdminMedia.jsx'
import AdminLayout from './components/AdminLayout/AdminLayout.jsx'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/produk" element={<ProductsPage />} />
        <Route path="/produk/:id" element={<ProductDetailPage />} />
        <Route path="/lokasi" element={<LocationPage />} />
        
        {/* Admin Public Route */}
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/hero-slides" element={<AdminHeroSlides />} />
          <Route path="/admin/brand-partners" element={<AdminBrandPartners />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
