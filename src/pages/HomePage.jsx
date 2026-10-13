import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import HeroCarousel from '../components/HeroCarousel/HeroCarousel.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { supabase } from '../lib/supabase.js'
import { sortByOrder } from '../lib/ordering.js'
import { useSiteSettings } from '../cms/SiteSettingsContext.jsx'
import './HomePage.css'

export default function HomePage() {
  const { settings } = useSiteSettings();
  const [heroSlides, setHeroSlides] = useState([]);
  const [brandPartners, setBrandPartners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch hero slides
        const { data: slides, error: slidesError } = await supabase
          .from('hero_slides')
          .select('*')
          .order('order', { ascending: true });

        if (slidesError) console.error('Error fetching hero slides:', slidesError);
        else setHeroSlides(sortByOrder((slides || []).filter((s) => s.is_active !== false))
          .map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            image: s.image,
            cta: { text: s.cta_text, link: s.cta_link },
          })));

        // Fetch brand partners
        const { data: partners, error: partnersError } = await supabase
          .from('brand_partners')
          .select('*')
          .order('order', { ascending: true });

        if (partnersError) console.error('Error fetching brand partners:', partnersError);
        else setBrandPartners(sortByOrder((partners || []).filter((p) => p.is_active !== false)));
        
        // Fetch featured products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_featured', true)
          .limit(4);
          
        if (productsError) console.error('Error fetching products:', productsError);
        else setFeaturedProducts(products || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const effectiveHeroSlides = heroSlides.length > 0 ? heroSlides : [
    { id: 1, title: 'Frozen Food Berkualitas', subtitle: 'Untuk Keluarga Indonesia', description: 'Produk beku pilihan dengan bahan terbaik, diproses higienis dan dikemas vakum untuk menjaga kesegaran.', image: 'https://placehold.co/1200x600/0099FF/white?text=Banyu+Frozen+Food', cta: { text: 'Lihat Produk', link: '/produk' } },
    { id: 2, title: 'Praktis & Lezat', subtitle: 'Siap Saji dalam Hitungan Menit', description: 'Nugget, sosis, dimsum, bakso — tinggal goreng atau kukus. Cocok untuk bekal sekolah dan menu harian.', image: 'https://placehold.co/1200x600/66CCFF/003366?text=Praktis+%26+Lezat', cta: { text: 'Pesan Sekarang', link: '/produk' } },
    { id: 3, title: 'Pesan Mudah', subtitle: 'Via Tokopedia, Shopee & WhatsApp', description: 'Pilih channel favorit kamu untuk memesan. Pengiriman cepat ke seluruh Indonesia.', image: 'https://placehold.co/1200x600/0077CC/white?text=Pesan+Mudah', cta: { text: 'Hubungi Kami', link: '/lokasi' } },
  ];

  if (loading) return <div>Memuat halaman beranda...</div>;

  const sections = settings?.home?.sections || {};
  const marketplace = settings?.home?.marketplace || {};
  const tokopediaUrl = marketplace.tokopediaUrl || '';
  const shopeeUrl = marketplace.shopeeUrl || '';
  const hasTokopedia = marketplace.tokopediaEnabled !== false && !!tokopediaUrl && tokopediaUrl !== '#';
  const hasShopee = marketplace.shopeeEnabled !== false && !!shopeeUrl && shopeeUrl !== '#';

  return (
    <div className="home-page">
      <Navbar />
      <HeroCarousel slides={effectiveHeroSlides} defaultSlides={[
        { id: 1, title: 'Frozen Food Berkualitas', subtitle: 'Untuk Keluarga Indonesia', description: 'Produk beku pilihan dengan bahan terbaik, diproses higienis dan dikemas vakum untuk menjaga kesegaran.', image: 'https://placehold.co/1200x600/0099FF/white?text=Banyu+Frozen+Food', cta: { text: 'Lihat Produk', link: '/produk' } },
        { id: 2, title: 'Praktis & Lezat', subtitle: 'Siap Saji dalam Hitungan Menit', description: 'Nugget, sosis, dimsum, bakso — tinggal goreng atau kukus. Cocok untuk bekal sekolah dan menu harian.', image: 'https://placehold.co/1200x600/66CCFF/003366?text=Praktis+%26+Lezat', cta: { text: 'Pesan Sekarang', link: '/produk' } },
        { id: 3, title: 'Pesan Mudah', subtitle: 'Via Tokopedia, Shopee & WhatsApp', description: 'Pilih channel favorit kamu untuk memesan. Pengiriman cepat ke seluruh Indonesia.', image: 'https://placehold.co/1200x600/0077CC/white?text=Pesan+Mudah', cta: { text: 'Hubungi Kami', link: '/lokasi' } },
      ]} />

      {/* Keunggulan Toko */}
      {sections.advantages && (
        <section className="advantages">
          <div className="container">
            <div className="section-title">
              <h2>{settings.home?.advantagesTitle || 'Keunggulan Kami'}</h2>
              <p>{settings.home?.advantagesSubtitle || ''}</p>
            </div>
            <div className="advantages__grid">
              {(settings?.home?.advantages || []).filter(Boolean).map((item, idx) => (
                <div key={item.id || idx} className="advantage-card">
                  <h3 className="advantage-card__title">{item.title || ''}</h3>
                  <p className="advantage-card__desc">{item.desc || ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produk Unggulan */}
      {sections.featured && (
        <section className="featured-products">
          <div className="container">
            <div className="section-title">
              <h2>Produk Unggulan</h2>
              <p>Pilihan terbaik yang paling disukai pelanggan kami</p>
            </div>
            <div className="featured-products__grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="featured-products__cta">
              <Link to="/produk" className="btn btn-secondary">
                Lihat Semua Produk
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Integrasi Marketplace */}
      {sections.marketplace && (hasTokopedia || hasShopee) && (
        <section className="marketplace">
        <div className="container">
          <div className="section-title">
            <h2>Belanja di Marketplace Favorit</h2>
            <p>Kunjungi toko kami di marketplace pilihan Anda</p>
          </div>
          <div className="marketplace__grid">
            {hasTokopedia && (
            <a
              href={tokopediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="marketplace-card marketplace-card--tokopedia"
            >
              <div className="marketplace-card__icon">
                <img src="/tokopedia.svg" alt="Logo Tokopedia" />
              </div>
              <div className="marketplace-card__info">
                <h3>Tokopedia</h3>
                <p>Kunjungi toko kami di Tokopedia untuk promo eksklusif dan gratis ongkir</p>
              </div>
              <span className="marketplace-card__arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
            )}
            {hasShopee && (
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="marketplace-card marketplace-card--shopee"
            >
              <div className="marketplace-card__icon">
                <img src="/shopee.svg" alt="Logo Shopee" />
              </div>
              <div className="marketplace-card__info">
                <h3>Shopee</h3>
                <p>Temukan produk kami di Shopee dengan cashback dan voucher menarik</p>
              </div>
              <span className="marketplace-card__arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Brand Partner */}
      {sections.brandPartners && brandPartners.length > 0 && (
        <section className="brand-partners">
          <div className="container">
            <div className="section-title">
              <h2>Brand Partner Kami</h2>
              <p>Kami bekerja sama dengan brand frozen food ternama di Indonesia</p>
            </div>
            <div className="brand-partners__grid">
              {brandPartners.map((brand, idx) => {
                const logo = <img src={brand.logo || 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Brand'} alt={brand.name || 'Brand'} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x80/E5E7EB/9CA3AF?text=Brand'; }} />;
                return brand.website_url ? (
                  <a
                    key={brand.id || idx}
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-partner-card"
                  >
                    {logo}
                  </a>
                ) : (
                  <div key={brand.id || idx} className="brand-partner-card">
                    {logo}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
