import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { Link } from 'react-router-dom'
import { useSiteSettings } from '../cms/SiteSettingsContext.jsx'
import { useMediaLibrary } from '../cms/useMedia.js'
import './LocationPage.css'

const defaultStorePhotos = [
  { src: 'https://placehold.co/600x400/0099FF/white?text=Tampak+Depan+Toko', alt: 'Tampak depan toko Banyu' },
  { src: 'https://placehold.co/600x400/66CCFF/white?text=Interior+Toko', alt: 'Interior toko Banyu' },
  { src: 'https://placehold.co/600x400/0077CC/white?text=Rak+Produk', alt: 'Rak produk frozen food' },
  { src: 'https://placehold.co/600x400/0099FF/FFFFFF?text=Area+Freezer', alt: 'Area freezer toko' },
]

export default function LocationPage() {
  const { settings } = useSiteSettings()
  const { items: mediaItems } = useMediaLibrary()
  const storeInfo = settings?.contact || {}
  const gallery = settings?.locationGallery || {}

  const storePhotos = gallery?.items?.length > 0
    ? gallery.items.filter((item) => item?.image).map((item) => ({ src: item.image, alt: item.label || 'Galeri toko' }))
    : (Array.isArray(mediaItems) ? mediaItems : []).filter((m) => m?.category === 'toko').length > 0
    ? mediaItems.filter((m) => m?.category === 'toko').map((m) => ({ src: m.url, alt: m.name || 'Foto toko' }))
    : defaultStorePhotos

  const waUrl = storeInfo.whatsapp
    ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent('Halo Banyu, saya ingin bertanya tentang lokasi toko.')}`
    : null

  return (
    <div className="location-page">
      <Navbar />

      <div className="location-page__header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Lokasi</span>
          </nav>
          <h1>Lokasi Toko Kami</h1>
          <p>Kunjungi toko kami langsung atau hubungi kami untuk informasi lebih lanjut</p>
        </div>
      </div>

      {/* Map + Info */}
      <section className="location-content">
        <div className="container">
          <div className="location-grid">
            {/* Google Maps */}
            <div className="location-map">
              <div className="location-map__wrapper">
                {storeInfo.mapsEmbed ? (
                <iframe
                  src={storeInfo.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Banyu Frozen Food"
                />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Peta belum diatur.</div>
                )}
              </div>
              {storeInfo.mapsUrl && (
              <a
                href={storeInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary location-map__open"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Buka di Google Maps
              </a>
              )}
            </div>

            {/* Detail Info */}
            <div className="location-info">
              {/* Alamat */}
              <div className="location-info__card">
                <div className="location-info__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h3>Alamat</h3>
                  <p>{storeInfo.addressFull || storeInfo.address || '-'}</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="location-info__card">
                <div className="location-info__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h3>Jam Operasional</h3>
                  <div className="location-hours">
                    {(storeInfo.hours || []).length > 0 ? (
                      (Array.isArray(storeInfo.hours) ? storeInfo.hours : []).filter(Boolean).map((h, idx) => (
                      <div key={idx} className="location-hours__row">
                        <span className="location-hours__day">{h.day || '-'}</span>
                        <span className="location-hours__time">{h.time || '-'}</span>
                      </div>
                      ))
                    ) : (
                      <p style={{ color: '#64748B' }}>Jam operasional belum diatur.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="location-info__card">
                <div className="location-info__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/>
                  </svg>
                </div>
                <div>
                  <h3>Email</h3>
                  <p>{storeInfo.email || '-'}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="location-cta">
                {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp location-cta__btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Hubungi via WhatsApp
                </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Foto Toko */}
      {(gallery?.visible ?? true) && <section className="store-gallery">
        <div className="container">
          <div className="section-title">
            <h2>{gallery?.title || 'Galeri Toko Kami'}</h2>
            <p>{gallery?.subtitle || 'Lihat suasana toko Banyu Frozen Food'}</p>
          </div>
          <div className="store-gallery__grid">
            {(storePhotos || []).filter(Boolean).map((photo, idx) => (
              <div key={idx} className="store-gallery__item">
                <img src={photo?.src} alt={photo?.alt || 'Foto toko'} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=Foto'; }} />
                <div className="store-gallery__overlay">
                  <span>{photo?.alt || 'Foto toko'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      }

      <Footer />
    </div>
  )
}
