import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useCart } from '../CartContext.jsx'
import './Navbar.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { settings } = useSiteSettings()
  const { cartCount, setIsCartOpen } = useCart()

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

  const menu = (settings?.navbar?.menu || []).filter((m) => m?.visible && m?.link && m?.label)

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <img src={settings?.identity?.logoUrl} alt={settings?.identity?.businessName || 'Banyu'} onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0.4'; }} />
        </Link>

        <ul className={`navbar__menu${isOpen ? ' navbar__menu--open' : ''}`}>
          {menu.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.link}
                end={item.link === '/'}
                className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="navbar__cart-item">
            <button className="navbar__cart-btn" onClick={() => setIsCartOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </button>
          </li>
        </ul>

        <button
          className={`navbar__hamburger${isOpen ? ' navbar__hamburger--active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
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
