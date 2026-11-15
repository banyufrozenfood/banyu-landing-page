import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'
import { trackChannelClick } from '../../lib/analytics.js'
import { DEFAULT_HERO_SLIDES } from '../../cms/homeContent.js'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons.jsx'

export default function HeroCarousel({ slides }) {
  const safeSlides = Array.isArray(slides) && slides.length > 0
    ? slides.filter(Boolean)
    : DEFAULT_HERO_SLIDES
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

  // Dukungan papan ketik: panah kiri/kanan memindahkan slide saat fokus
  // berada di dalam area carousel.
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      handleArrowClick('next')
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      handleArrowClick('prev')
    }
  }

  const getChannelFromLink = (link) => {
    if (/wa\.me|whatsapp/i.test(link)) return 'whatsapp'
    if (/gofood/i.test(link)) return 'gofood'
    if (/grabmart|food\.grab/i.test(link)) return 'grabmart'
    return null
  }

  return (
    <section className="hero" onKeyDown={handleKeyDown}>
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
                    <ArrowRightIcon />
                  </a>
                ) : (
                <Link to={slide.cta.link} className="btn btn-accent hero__cta">
                  {slide.cta.text || 'Lihat'}
                  <ArrowRightIcon />
                </Link>
                )
              )}
            </div>
          </div>
        ))}

        <button className="hero__arrow hero__arrow--prev" onClick={() => handleArrowClick('prev')} aria-label="Slide sebelumnya">
          <ChevronLeftIcon />
        </button>
        <button className="hero__arrow hero__arrow--next" onClick={() => handleArrowClick('next')} aria-label="Slide berikutnya">
          <ChevronRightIcon />
        </button>

        <div className="hero__dots" role="tablist" aria-label="Pilih slide beranda">
          {safeSlides.map((slide, index) => (
            <button
              key={slide?.id ?? index}
              type="button"
              className={`hero__dot${index === current ? ' hero__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ke slide ${index + 1}${slide?.title ? `: ${slide.title}` : ''}`}
              aria-current={index === current ? 'true' : undefined}
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
