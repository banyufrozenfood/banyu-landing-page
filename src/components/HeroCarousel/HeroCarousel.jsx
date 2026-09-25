import { useState, useEffect, useCallback } from 'react'
import './HeroCarousel.css'

const defaultSlides = [
  {
    id: 1,
    title: 'Frozen Food Berkualitas',
    subtitle: 'Untuk Keluarga Indonesia',
    description: 'Produk beku pilihan dengan bahan terbaik, diproses higienis dan dikemas vakum untuk menjaga kesegaran.',
    image: 'https://placehold.co/1200x600/0099FF/white?text=Banyu+Frozen+Food',
    cta: { text: 'Lihat Produk', link: '/produk' },
  },
  {
    id: 2,
    title: 'Praktis & Lezat',
    subtitle: 'Siap Saji dalam Hitungan Menit',
    description: 'Nugget, sosis, dimsum, bakso — tinggal goreng atau kukus. Cocok untuk bekal sekolah dan menu harian.',
    image: 'https://placehold.co/1200x600/66CCFF/003366?text=Praktis+%26+Lezat',
    cta: { text: 'Pesan Sekarang', link: '/produk' },
  },
  {
    id: 3,
    title: 'Pesan Mudah',
    subtitle: 'Via Tokopedia, Shopee & WhatsApp',
    description: 'Pilih channel favorit kamu untuk memesan. Pengiriman cepat ke seluruh Indonesia.',
    image: 'https://placehold.co/1200x600/0077CC/white?text=Pesan+Mudah',
    cta: { text: 'Hubungi Kami', link: '/lokasi' },
  },
]

export default function HeroCarousel({ slides = defaultSlides }) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrent(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, nextSlide])

  const handleArrowClick = (direction) => {
    if (direction === 'next') nextSlide()
    else prevSlide()
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <section className="hero">
      <div className="hero__carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero__slide${index === current ? ' hero__slide--active' : ''}`}
          >
            <div className="hero__slide-bg">
              <img src={slide.image} alt={slide.title} loading={index === 0 ? 'eager' : 'lazy'} />
              <div className="hero__slide-overlay" />
            </div>
            <div className="hero__slide-content container">
              <span className="hero__label">{slide.subtitle}</span>
              <h1 className="hero__title">{slide.title}</h1>
              <p className="hero__desc">{slide.description}</p>
              <a href={slide.cta.link} className="btn btn-accent hero__cta">
                {slide.cta.text}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
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
          {slides.map((_, index) => (
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
