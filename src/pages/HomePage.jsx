import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import HeroCarousel from '../components/HeroCarousel/HeroCarousel.jsx'
import Footer from '../components/Footer/Footer.jsx'
import LocationSection from '../components/LocationSection/LocationSection.jsx'
import { supabase } from '../lib/supabase.js'
import { sortByOrder } from '../lib/ordering.js'
import { useSiteSettings } from '../cms/SiteSettingsContext.jsx'
import { getAboutTags, getMarketplaceCards, DEFAULT_HERO_SLIDES, normalizeHeroSlide } from '../cms/homeContent.js'
import { trackChannelClick } from '../lib/analytics.js'
import { ArrowRightIcon } from '../components/ui/Icons.jsx'
import './HomePage.css'

// Menampilkan logo resmi kanal (public/logos/<channel>.svg). Kalau file logo
// belum tersedia atau gagal dimuat, otomatis kembali ke emoji dari CMS supaya
// kartu tidak pernah tampil kosong.
function ChannelLogo({ logo, icon }) {
  const [failed, setFailed] = useState(false)
  const glyph = icon || '↗'

  if (!logo || failed) {
    return <span className="marketplace-card__glyph">{glyph}</span>
  }

  return (
    <img
      className="marketplace-card__logo"
      src={logo}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export default function HomePage() {
  const { settings } = useSiteSettings()
  const [heroSlides, setHeroSlides] = useState([])
  const [brandPartners, setBrandPartners] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: slides, error: slidesError } = await supabase
          .from('hero_slides')
          .select('*')
          .order('order', { ascending: true })

        if (slidesError) console.error('Gagal memuat slide beranda:', slidesError)
        else {
          setHeroSlides(
            sortByOrder((slides || []).filter((s) => s.is_active !== false)).map((s) => ({
              id: s.id,
              title: s.title,
              subtitle: s.subtitle,
              description: s.description,
              image: s.image,
              cta: { text: s.cta_text, link: s.cta_link },
            }))
          )
        }

        const { data: partners, error: partnersError } = await supabase
          .from('brand_partners')
          .select('*')
          .order('order', { ascending: true })

        if (partnersError) console.error('Gagal memuat brand partner:', partnersError)
        else setBrandPartners(sortByOrder((partners || []).filter((p) => p.is_active !== false)))
      } catch (err) {
        console.error('Gagal memuat data beranda:', err)
      }
    }

    fetchData()
  }, [])

  const home = settings?.home || {}
  const sections = home.sections || {}
  const about = home.about || {}
  const contact = settings?.contact || {}
  const marketplace = home.marketplace || {}
  const socials = (settings?.socials || []).filter((s) => s?.url)

  const waNumber = (contact.whatsapp || '').replace(/\D/g, '')
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(contact.whatsappMessage || 'Halo Banyu Frozen Food, saya mau tanya stok dan cara pesan.')}`
    : null

  const fallbackSlides = DEFAULT_HERO_SLIDES.map((slide) => ({
    ...slide,
    cta: slide.id === 'default-3'
      ? { ...slide.cta, text: 'Chat WhatsApp', link: waUrl || slide.cta.link }
      : slide.cta,
  }))

  const effectiveHeroSlides = (heroSlides.length > 0 ? heroSlides : fallbackSlides).map(normalizeHeroSlide)

  const marketplaceCards = getMarketplaceCards(home)
    .filter((card) => card.enabled !== false)
    .map((card) => ({ ...card, url: card.channel === 'whatsapp' ? waUrl : card.url }))
    .filter((card) => card.url)
  const hasChannels = marketplaceCards.length > 0
  const highlights = (about.highlights || []).filter(Boolean)
  const channelLinkProps = (channel) => ({
    onClick: () => {
      if (['whatsapp', 'gofood', 'grabmart'].includes(channel)) trackChannelClick(channel, window.location.pathname)
    },
  })

  return (
    <div className="home-page">
      <Navbar />
      <main id="main-content">
      <HeroCarousel slides={effectiveHeroSlides} />

      {sections.advantages && (
        <section className="advantages">
          <div className="container">
            <div className="section-title">
              <h2>{home.advantagesTitle || 'Kenapa Belanja di Banyu?'}</h2>
              <p>{home.advantagesSubtitle || ''}</p>
            </div>
            <div className="advantages__grid">
              {(home.advantages || []).filter(Boolean).map((item, idx) => (
                <div key={item.id || idx} className="advantage-card">
                  {item.icon && <span className="advantage-card__icon" aria-hidden="true">{item.icon}</span>}
                  <h3 className="advantage-card__title">{item.title || ''}</h3>
                  <p className="advantage-card__desc">{item.desc || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.about && (
        <section id="tentang" className="about-store">
          <div className="container about-store__grid">
            <div className="about-store__content">
              <span className="about-store__eyebrow">Tentang Banyu</span>
              <h2 className="about-store__title">{about.title || 'Toko Frozen Food Praktis di Cigugur Tengah'}</h2>
              <p className="about-store__lead">{about.subtitle || ''}</p>
              <p className="about-store__text">{about.text || ''}</p>
              <div className="about-store__tags">
                {getAboutTags(home).map((tag) => (
                  <span key={tag.id} className="about-store__tag">{tag.label}</span>
                ))}
              </div>
            </div>
            <div className="about-store__facts">
              {highlights.map((item, idx) => (
                <div key={item.id || idx} className="about-fact">
                  <span className="about-fact__label">{item.label || ''}</span>
                  <strong className="about-fact__value">{item.value || ''}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.marketplace && hasChannels && (
        <section id="cara-pesan" className="marketplace">
          <div className="container">
            <div className="section-title">
              <h2>{home.marketplaceTitle || 'Pesan Lewat Kanal Favorit'}</h2>
              <p>{home.marketplaceSubtitle || ''}</p>
            </div>
            <div className="marketplace__grid">
              {marketplaceCards.map((card, idx) => (
                <a
                  {...channelLinkProps(card.channel)}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={card.id || `${card.channel}-${idx}`}
                  className={`marketplace-card marketplace-card--${card.channel || 'custom'}`}
                >
                  <span className="marketplace-card__icon" aria-hidden="true">
                    <ChannelLogo logo={card.logo} icon={card.icon} />
                  </span>
                  <div className="marketplace-card__info">
                    <h3>{card.label}</h3>
                    <p>{card.description || ''}</p>
                  </div>
                  <span className="marketplace-card__arrow" aria-hidden="true">
                    <ArrowRightIcon size={24} strokeWidth={2} />
                  </span>
                </a>
              ))}
            </div>
            {socials.length > 0 && (
              <div className="marketplace__socials">
                <p>{marketplace.socialNote || 'Update stok & promo juga dibagikan di:'}</p>
                {socials.map((social) => (
                  <a key={social.id || social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="marketplace__social-link">
                    {social.label || 'Sosial Media'}
                  </a>
                ))}
              </div>
            )}
            <p className="marketplace__note">{marketplace.availabilityNote || 'Stok dan ketersediaan produk bisa berubah. Beberapa item bisa habis terjual atau toko tutup sementara di aplikasi — konfirmasi lewat WhatsApp.'}</p>
          </div>
        </section>
      )}

      {sections.brandPartners && (
        <section className="brand-partners">
          <div className="container">
            <div className="section-title">
              <h2>{home.brandPartnersTitle || 'Brand yang Kami Jual'}</h2>
              <p>{home.brandPartnersSubtitle || ''}</p>
            </div>
            {brandPartners.length > 0 ? (
              <div className="brand-partners__grid">
                {brandPartners.map((brand, idx) => {
                  const logo = (
                    <img
                      src={brand.logo || 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Brand'}
                      alt={brand.name || 'Brand'}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Brand' }}
                    />
                  )
                  return brand.website_url ? (
                    <a key={brand.id || idx} href={brand.website_url} target="_blank" rel="noopener noreferrer" className="brand-partner-card">
                      {logo}
                    </a>
                  ) : (
                    <div key={brand.id || idx} className="brand-partner-card">{logo}</div>
                  )
                })}
              </div>
            ) : (
              <div className="brand-partners__fallback">
                {['Cedea', 'So Good', 'Kanzler', 'Pronas', 'Karwati', 'Tapokki', 'Rabokki'].map((brand) => (
                  <span key={brand}>{brand}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {sections.location && <LocationSection />}
      </main>

      <Footer />
    </div>
  )
}
