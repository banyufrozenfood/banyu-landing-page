import { lazy, Suspense, Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import AnalyticsTracker from './components/AnalyticsTracker/AnalyticsTracker.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'))
const AdminLayout = lazy(() => import('./components/AdminLayout/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminHeroSlides = lazy(() => import('./pages/admin/AdminHeroSlides.jsx'))
const AdminBrandPartners = lazy(() => import('./pages/admin/AdminBrandPartners.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia.jsx'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics.jsx'))

function RouteFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
      Memuat...
    </div>
  )
}

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.error(`${this.props.label || 'Halaman'} gagal dimuat:`, err)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '40vh' }}>
          <h2>Gagal memuat halaman</h2>
          <p style={{ marginBottom: '2rem' }}>Terjadi gangguan jaringan. Silakan muat ulang.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px' }}>
            Muat Ulang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Satu boundary per halaman admin supaya kegagalan di satu halaman tidak
// merobohkan seluruh panel, dan pesan error menyebut halaman yang gagal.
function AdminPage({ label, children }) {
  return (
    <RouteErrorBoundary label={label}>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </RouteErrorBoundary>
  )
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', color: '#0099FF', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ marginBottom: '2rem' }}>Halaman yang Anda cari mungkin telah dihapus atau URL salah.</p>
      <a href="/" style={{ padding: '10px 20px', background: '#0099FF', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
        Kembali ke Beranda
      </a>
    </div>
  )
}

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Lewati ke konten utama</a>
      <ScrollToTop />
      <AnalyticsTracker />
      <RouteErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Admin Public Route */}
          <Route path="/admin" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminPage label="Ringkasan"><AdminDashboard /></AdminPage>} />
            <Route path="/admin/analytics" element={<AdminPage label="Analytics"><AdminAnalytics /></AdminPage>} />
            <Route path="/admin/hero-slides" element={<AdminPage label="Slide Beranda"><AdminHeroSlides /></AdminPage>} />
            <Route path="/admin/brand-partners" element={<AdminPage label="Brand Partner"><AdminBrandPartners /></AdminPage>} />
            <Route path="/admin/media" element={<AdminPage label="Media Library"><AdminMedia /></AdminPage>} />
            <Route path="/admin/settings" element={<AdminPage label="Pengaturan Website"><AdminSettings /></AdminPage>} />
          </Route>

          {/* Fallback untuk halaman yang tidak ditemukan */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </RouteErrorBoundary>
    </>
  )
}

export default App
