import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import './Services.css'

const SERVICES = [
  {
    id: 'collision',
    title: 'Collision Repair',
    desc: 'Frame straightening, panel replacement, and structural repair back to factory tolerances using laser-measured alignment.',
    icon: (
      <svg viewBox="0 0 40 40"><path d="M6 26 L11 15 Q13 11 18 11 L26 11 Q31 11 33 15 L37 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M6 26 h31" stroke="currentColor" strokeWidth="2"/><circle cx="13" cy="28" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="28" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 5 l3 4 h-6z" fill="currentColor"/></svg>
    ),
  },
  {
    id: 'paint',
    title: 'Paint & Refinish',
    desc: 'Computer color-matched paint in a downdraft booth. Basecoat, clearcoat, and cut-and-buff for a mirror finish.',
    icon: (
      <svg viewBox="0 0 40 40"><rect x="10" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M26 10 h6 v6 a3 3 0 01-3 3 h-2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M18 18 v6 a3 3 0 01-3 3 h-1 a2 2 0 00-2 2 v5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="36" r="2" fill="currentColor"/></svg>
    ),
  },
  {
    id: 'dent',
    title: 'Dent & Scratch',
    desc: 'Paintless dent removal and precision scratch repair. Fast turnaround that keeps your original factory paint intact.',
    icon: (
      <svg viewBox="0 0 40 40"><path d="M8 20 Q20 8 32 20 Q20 32 8 20z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 20 l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    id: 'detail',
    title: 'Detailing & Ceramic',
    desc: 'Full interior and exterior detail with ceramic coating for lasting gloss, hydrophobic protection, and UV defense.',
    icon: (
      <svg viewBox="0 0 40 40"><path d="M20 5 C24 12 30 14 30 22 a10 10 0 01-20 0 C10 14 16 12 20 5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M20 16 v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    id: 'glass',
    title: 'Glass Replacement',
    desc: 'OEM-grade windshield and window replacement with ADAS recalibration so your safety sensors stay accurate.',
    icon: (
      <svg viewBox="0 0 40 40"><path d="M8 24 L12 12 h16 l4 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M20 12 v12M8 24 h24" stroke="currentColor" strokeWidth="2"/></svg>
    ),
  },
  {
    id: 'estimate',
    title: 'Free Estimates',
    desc: 'Transparent, no-obligation written estimates. We work directly with all major insurance carriers on your claim.',
    icon: (
      <svg viewBox="0 0 40 40"><rect x="10" y="6" width="20" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M15 14 h10M15 20 h10M15 26 h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
]

export default function Services() {
  const gridRef = useRef(null)
  const [lit, setLit] = useState({})

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.service')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            anime({
              targets: e.target,
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 700,
              easing: 'easeOutExpo',
              delay: e.target.dataset.i * 80,
            })
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    cards?.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  const toggleLight = (id) => setLit((s) => ({ ...s, [id]: !s[id] }))

  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">What we do</span>
          <h2 className="section-title">Everything your car needs<br />under one roof.</h2>
          <p className="section-lead">
            Click a headlight to light it up. Every job runs through the same disciplined
            process — from teardown to final polish.
          </p>
        </div>

        <div className="services__grid" ref={gridRef}>
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className={`service clickable ${lit[s.id] ? 'service--lit' : ''}`}
              data-i={i}
              onClick={() => toggleLight(s.id)}
            >
              <div className="service__beam" />
              <div className="service__icon">{s.icon}</div>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__desc">{s.desc}</p>
              <div className="service__foot">
                <span className="service__hint">{lit[s.id] ? 'Lights on' : 'Tap to light'}</span>
                <span className="service__lamp" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
