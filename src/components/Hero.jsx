import { useEffect, useRef } from 'react'
import anime from 'animejs'
import './Hero.css'

// Local hero video first, with remote fallbacks if it cannot be loaded.
const VIDEO_SOURCES = [
  '/256062_medium.mp4',
  'https://cdn.coverr.co/videos/coverr-a-sports-car-on-the-road-1080p/1080p.mp4',
  'https://cdn.pixabay.com/video/2024/03/15/204306-923909574_large.mp4',
]

export default function Hero({ onBook, ready }) {
  const titleRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!ready) return
    const chars = titleRef.current?.querySelectorAll('.char')
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: chars,
        translateY: [80, 0],
        opacity: [0, 1],
        rotateZ: [8, 0],
        duration: 900,
        delay: anime.stagger(28),
      })
      .add({
        targets: '.hero__sub, .hero__cta, .hero__stats',
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 700,
        delay: anime.stagger(120),
      }, '-=500')
  }, [ready])

  // Try to autoplay first working source
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let idx = 0
    const tryNext = () => {
      if (idx >= VIDEO_SOURCES.length) { v.style.opacity = '0'; return }
      v.src = VIDEO_SOURCES[idx++]
      v.load()
      v.play().catch(() => {})
    }
    v.onerror = tryNext
    v.oncanplay = () => { v.style.opacity = '1' }
    v.style.opacity = '0'
    tryNext()
  }, [])

  const title = 'Straight lines.\nFlawless finish.'
  const renderTitle = () =>
    title.split('\n').map((line, li) => (
      <span className="hero__line" key={li}>
        {line.split('').map((c, i) => (
          <span className="char" key={i}>{c === ' ' ? '\u00A0' : c}</span>
        ))}
      </span>
    ))

  return (
    <section className="hero" id="top">
      <div className="hero__media">
        <div className="hero__fallback" aria-hidden="true">
          <span className="streak s1" /><span className="streak s2" /><span className="streak s3" />
          <span className="streak s4" /><span className="streak s5" />
        </div>
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay muted loop playsInline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%230a0a0c'/%3E%3C/svg%3E"
        />
        <div className="hero__scrim" />
        <div className="hero__grid-overlay" />
      </div>

      <div className="wrap hero__content">
        <span className="eyebrow">Collision · Refinishing · Detailing</span>
        <h1 className="hero__title" ref={titleRef}>{renderTitle()}</h1>
        <p className="hero__sub">
          Factory‑grade collision repair and paintwork in Everett. We bring damaged
          panels back to spec — color‑matched, corrosion‑protected, and delivered on time.
        </p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={onBook}>
            <span className="btn__nut" />
            Book a session
          </button>
          <a className="btn btn--ghost" href="#gallery">See our work</a>
        </div>
        <div className="hero__stats">
          <div className="stat"><strong>18k+</strong><span>panels restored</span></div>
          <div className="stat"><strong>3‑day</strong><span>average turnaround</span></div>
          <div className="stat"><strong>Lifetime</strong><span>paint warranty</span></div>
        </div>
      </div>

      <a href="#services" className="hero__scroll">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" width="18"><path d="M12 4v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </a>
    </section>
  )
}
