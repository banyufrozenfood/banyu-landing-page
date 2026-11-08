import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'
import { trackChannelClick } from '../../lib/analytics.js'

const defaultSlides = [
  {
    id: 1,
    title: 'Stok Makanan Praktis',
    subtitle: 'Banyu Frozen Food • Cigugur Tengah',
    description: 'Sosis, nugget, kornet, camilan Korea, sampai abon khas Cianjur. Harga Rp10.000–Rp49.000 per item.',
    image: '',
    cta: { text: 'Cara Pesan', link: '/#cara-pesan' },
  },
  {
    id: 2,
    title: 'Pesan Antar GoFood & GrabMart',
    subtitle: 'Cari Banyu Frozen Food',
    description: 'GoFood area Bandung dan GrabMart dengan nama Banyu Frozen Food - Cigugur Tengah.',
    image: '',
    cta: { text: 'Cara Pesan', link: '/#cara-pesan' },
  },
  {
    id: 3,
    title: 'Oleh-oleh Khas Cianjur',
    subtitle: 'Abon & Gepuk Karwati',
    description: 'Abon sapi, abon pedas, dan gepuk kering — cocok untuk oleh-oleh atau stok lauk praktis.',
    image: '',
    cta: { text: 'Cara Pesan', link: '/#cara-pesan' },
  },
]

export default function HeroCarousel({ slides = defaultSlides }) {
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides.filter(Boolean) : defaultSlides
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % safeSlides.length)
  }, [safeSlides.length])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + safeSlides.length) % safeSlides.length)
  }, [safeSlides.length])

  const goToSlide = (index) => {
    setCurrent(index)
    setIsAutoPlaying(false)
  }

  useEffect(() => {
    let playTimeout
    if (!isAutoPlaying) {
      playTimeout = setTimeout(() => setIsAutoPlaying(true), 5000)
    }
    return () => {
      if (playTimeout) clearTimeout(playTimeout)
    }
  }, [isAutoPlaying])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, nextSlide])

  const handleArrowClick = (direction) => {
    if (direction === 'next') nextSlide()
    else prevSlide()
    setIsAutoPlaying(false)
  }

  const getChannelFromLink = (link) => {
    if (/wa\.me|whatsapp/i.test(link)) return 'whatsapp'
    if (/gofood/i.test(link)) return 'gofood'
    if (/grabmart|food\.grab/i.test(link)) return 'grabmart'
    return null
  }

  return (
    <section className="hero">
      <div className="hero__carousel">
        {safeSlides.map((slide, index) => (
          <div
            key={slide?.id ?? index}
            className={`hero__slide${index === current ? ' hero__slide--active' : ''}`}
          >
            <div className="hero__slide-bg">
              {slide?.image && (
                <img src={slide.image} alt={slide?.title || 'Slide'} loading={index === 0 ? 'eager' : 'lazy'} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
              )}
              <div className="hero__slide-overlay" />
            </div>
            <div className="hero__slide-content container">
              <span className="hero__label">{slide?.subtitle || ''}</span>
              <h1 className="hero__title">{slide?.title || ''}</h1>
              <p className="hero__desc">{slide?.description || ''}</p>
              {slide?.cta?.link && (
                slide.cta.link.startsWith('http') ? (
                  <a href={slide.cta.link} target="_blank" rel="noopener noreferrer" className="btn btn-accent hero__cta" onClick={() => { const channel = getChannelFromLink(slide.cta.link); if (channel) trackChannelClick(channel, window.location.pathname) }}>
                    {slide.cta.text || 'Lihat'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                ) : (
                <Link to={slide.cta.link} className="btn btn-accent hero__cta">
                  {slide.cta.text || 'Lihat'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                )
              )}
            </div>
          </div>
        ))}

        <button className="hero__arrow hero__arrow--prev" onClick={() => handleArrowClick('prev')} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="hero__arrow hero__arrow--next" onClick={() => handleArrowClick('next')} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <div className="hero__dots">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              className={`hero__dot${index === current ? ' hero__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hero__decoration">
        <div className="hero__deco-circle hero__deco-circle--1" />
        <div className="hero__deco-circle hero__deco-circle--2" />
        <div className="hero__deco-circle hero__deco-circle--3" />
      </div>
    </section>
  )
}
