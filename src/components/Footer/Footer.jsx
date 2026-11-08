import { Link } from 'react-router-dom'
import { NAV_MENU } from '../../cms/defaults.js'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { trackChannelClick } from '../../lib/analytics.js'
import './Footer.css'

const socialIcons = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  other: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  ),
}

export default function Footer() {
  const { settings } = useSiteSettings()
  const identity = settings?.identity || {}
  const contact = settings?.contact || {}
  const socials = settings?.socials || []
  const footer = settings?.footer || {}

  const waNumber = (contact.whatsapp || '').replace(/\D/g, '')
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Link to="/">
              <img
                src={identity.logoWhiteUrl || identity.logoUrl}
                alt={identity.businessName || 'Banyu'}
                className="footer__logo"
                onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0.4' }}
              />
            </Link>
            <p className="footer__desc">{footer.description || ''}</p>
            <div className="footer__social">
              {(socials || []).filter((s) => s?.url).map((s) => (
                <a key={s.id || s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {socialIcons[s.icon] || socialIcons.other}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__links">
            <h4>Navigasi</h4>
            <ul>
              {NAV_MENU.map((l) => (
                <li key={l.id}><Link to={l.link}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__contact">
            <h4>Hubungi Kami</h4>
            <ul>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {contact.address || contact.addressFull || '-'}
              </li>
              {contact.email && (
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/>
                  </svg>
                  {contact.email}
                </li>
              )}
              {waUrl && (
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                   <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackChannelClick('whatsapp', window.location.pathname)}>Chat WhatsApp</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} {identity.businessName || 'Banyu'}. All rights reserved.</p>
          <p>{footer.creditNote || ''}</p>
        </div>
      </div>
    </footer>
  )
}
