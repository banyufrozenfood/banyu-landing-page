import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useMediaLibrary } from '../../cms/useMedia.js'
import { getHomeLocation } from '../../cms/homeContent.js'
import { trackChannelClick } from '../../lib/analytics.js'
import './LocationSection.css'
import '../../pages/LocationPage.css'

const defaultStorePhotos = [
  { src: 'https://placehold.co/600x400/0099FF/white?text=Tampak+Depan+Toko', alt: 'Tampak depan toko Banyu' },
  { src: 'https://placehold.co/600x400/66CCFF/white?text=Interior+Toko', alt: 'Interior toko Banyu' },
  { src: 'https://placehold.co/600x400/0077CC/white?text=Rak+Produk', alt: 'Rak produk frozen food' },
  { src: 'https://placehold.co/600x400/0099FF/FFFFFF?text=Area+Freezer', alt: 'Area freezer toko' },
]

export default function LocationSection() {
  const { settings } = useSiteSettings()
  const { items: mediaItems } = useMediaLibrary()
  const storeInfo = settings?.contact || {}
  const gallery = settings?.locationGallery || {}
  const location = getHomeLocation(settings?.home || {})

  const configuredPhotos = Array.isArray(gallery?.items)
    ? gallery.items.filter((item) => item?.image).map((item) => ({ src: item.image, alt: item.label || 'Galeri toko' }))
    : []
  const mediaPhotos = (Array.isArray(mediaItems) ? mediaItems : [])
    .filter((item) => item?.category === 'toko' && item?.url)
    .map((item) => ({ src: item.url, alt: item.name || 'Foto toko' }))
  const storePhotos = configuredPhotos.length > 0
    ? configuredPhotos
    : mediaPhotos.length > 0 ? mediaPhotos : defaultStorePhotos

  const waNumber = (storeInfo.whatsapp || '').replace(/\D/g, '')
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(storeInfo.whatsappMessage || 'Halo Banyu Frozen Food, saya mau tanya stok dan cara pesan.')}`
    : null
  const hours = Array.isArray(storeInfo.hours) ? storeInfo.hours.filter(Boolean) : []

  return (
    <section id="lokasi" className="location-section">
      <div className="location-section__intro">
        <div className="container">
          <div className="section-title">
            <span className="location-section__eyebrow">{location.eyebrow}</span>
            <h2>{location.title}</h2>
            <p>Kunjungi Banyu Frozen Food di Cigugur Tengah, Cimahi Tengah — dekat perbatasan Kota Bandung.</p>
          </div>
        </div>
      </div>

      <div className="location-content">
        <div className="container">
          <div className="location-grid">
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
                  <div className="location-section__empty">Peta belum diatur.</div>
                )}
              </div>
              {storeInfo.mapsUrl && (
                <a href={storeInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary location-map__open">
                  Buka di Google Maps
                </a>
              )}
            </div>

            <div className="location-info">
              <div className="location-info__card">
                <div className="location-info__icon" aria-hidden="true">⌖</div>
                <div>
                  <h3>Alamat</h3>
                  <p>{storeInfo.addressFull || storeInfo.address || '-'}</p>
                </div>
              </div>

              <div className="location-info__card">
                <div className="location-info__icon" aria-hidden="true">◷</div>
                <div>
                  <h3>Jam Operasional</h3>
                  <div className="location-hours">
                    {hours.length > 0 ? hours.map((item, index) => (
                      <div key={item.id || index} className="location-hours__row">
                        <span className="location-hours__day">{item.day || '-'}</span>
                        <span className="location-hours__time">{item.time || '-'}</span>
                      </div>
                    )) : <p className="location-section__muted">Jam operasional belum diatur.</p>}
                  </div>
                </div>
              </div>

              {storeInfo.email && (
                <div className="location-info__card">
                  <div className="location-info__icon" aria-hidden="true">✉</div>
                  <div>
                    <h3>Email</h3>
                    <p>{storeInfo.email}</p>
                  </div>
                </div>
              )}

              <div className="location-service-area">
                <h3>{location.serviceAreaTitle}</h3>
                <p>{location.serviceAreaDescription}</p>
                <ul>
                  {location.serviceAreas.map((area) => <li key={area}>{area}</li>)}
                </ul>
              </div>

              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp location-cta__btn" onClick={() => trackChannelClick('whatsapp', window.location.pathname)}>
                  Hubungi via WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {(gallery?.visible ?? true) && (
        <div className="store-gallery">
          <div className="container">
            <div className="section-title">
              <h2>{gallery?.title || 'Galeri Toko Kami'}</h2>
              <p>{gallery?.subtitle || 'Lihat suasana toko Banyu Frozen Food'}</p>
            </div>
            <div className="store-gallery__grid">
              {storePhotos.filter(Boolean).map((photo, index) => (
                <div key={photo.src || index} className="store-gallery__item">
                  <img src={photo.src} alt={photo.alt || 'Foto toko'} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=Foto' }} />
                  <div className="store-gallery__overlay"><span>{photo.alt || 'Foto toko'}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
