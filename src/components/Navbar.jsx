import { useEffect, useState } from 'react'
import './Navbar.css'

const NavIcon = ({ type }) => {
  if (type === 'gear')
    return (
      <svg viewBox="0 0 24 24" className="nav-ic">
        <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
  if (type === 'nut')
    return (
      <svg viewBox="0 0 24 24" className="nav-ic">
        <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    )
  if (type === 'wheel')
    return (
      <svg viewBox="0 0 24 24" className="nav-ic">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 9V3M9.5 14.5L4.6 18.5M14.5 14.5l4.9 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
  // screw
  return (
    <svg viewBox="0 0 24 24" className="nav-ic">
      <path d="M12 2l3 3-1.5 1.5L15 8l-3 12-3-12 1.5-1.5L9 5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

const links = [
  { label: 'Services', href: '#services', icon: 'gear' },
  { label: 'Process', href: '#process', icon: 'nut' },
  { label: 'Gallery', href: '#gallery', icon: 'wheel' },
  { label: 'Contact', href: '#contact', icon: 'screw' },
]

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__logo">
          <span className="nav__logo-mark">
            <svg viewBox="0 0 32 32"><path d="M4 22 L8 12 Q9 9 12 9 L20 9 Q23 9 24 12 L28 22 Z" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinejoin="round"/><circle cx="10" cy="23" r="2.6" fill="#ff5a1f"/><circle cx="22" cy="23" r="2.6" fill="#ff5a1f"/></svg>
          </span>
          <span className="nav__logo-text">Auto Body Repair<em>Inc.</em></span>
        </a>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              <NavIcon type={l.icon} />
              {l.label}
            </a>
          ))}
          <button className="nav__book nav__book--mobile" onClick={() => { setOpen(false); onBook() }}>Book now</button>
        </nav>

        <div className="nav__right">
          <a href="tel:+14257505164" className="nav__phone">
            <svg viewBox="0 0 24 24" width="16"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 006 6L15 14l5 2v4a2 2 0 01-2 2A16 16 0 012 6a2 2 0 012-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            <span>(425) 750‑5164</span>
          </a>
          <button className="nav__book" onClick={onBook}>Book a session</button>
          <button className={`nav__burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
