import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_MENU } from '../../cms/defaults.js'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { trackChannelClick } from '../../lib/analytics.js'
import './Navbar.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { settings } = useSiteSettings()

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 20)
        timeoutId = null;
      }, 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const menu = NAV_MENU
  const ctaLabel = settings?.navbar?.ctaLabel || 'Pesan Sekarang'
  const waNumber = (settings?.contact?.whatsapp || '').replace(/\D/g, '')
  const waMessage = settings?.contact?.whatsappMessage || 'Halo Banyu Frozen Food, saya mau tanya stok dan cara pesan.'
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}` : null

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <img src={settings?.identity?.logoUrl} alt={settings?.identity?.businessName || 'Banyu'} onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0.4'; }} />
        </Link>

        <ul id="navbar-menu" className={`navbar__menu${isOpen ? ' navbar__menu--open' : ''}`}>
          {menu.map((item) => (
            <li key={item.id}>
              {item.link.includes('#') ? (
                <Link to={item.link} className="navbar__link" onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  to={item.link}
                  end={item.link === '/'}
                  className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
          {waUrl && (
            <li className="navbar__cta-item">
              <a className="btn btn-primary navbar__cta" href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackChannelClick('whatsapp', window.location.pathname)}>
                {ctaLabel}
              </a>
            </li>
          )}
        </ul>

        <button
          className={`navbar__hamburger${isOpen ? ' navbar__hamburger--active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isOpen && <div className="navbar__overlay" onClick={() => setIsOpen(false)} />}
    </nav>
  )
}
