import { useEffect, useRef, useState } from 'react'
import './Gallery.css'

const SHOTS = [
  { tag: 'Bumper respray', tone: '#ff5a1f', beforeImage: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=900', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85' },
  { tag: 'Frame pull', tone: '#35c0d8', beforeImage: 'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=900', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85' },
  { tag: 'Full repaint', tone: '#f5c518', beforeImage: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=900', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85' },
  { tag: 'Ceramic coat', tone: '#ff8a3d', beforeImage: 'https://images.pexels.com/photos/6870307/pexels-photo-6870307.jpeg?auto=compress&cs=tinysrgb&w=900', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85' },
  { tag: 'Dent removal', tone: '#9aa0ab', beforeImage: 'https://images.pexels.com/photos/4489730/pexels-photo-4489730.jpeg?auto=compress&cs=tinysrgb&w=900', image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=85' },
]

export default function Gallery() {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.25 }
    )
    trackRef.current?.querySelectorAll('.shot').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <section className="gallery" id="gallery">
      <div className="gallery__bg">
        <img src="/car1.jpg" alt="Auto body repair work" />
        <div className="gallery__bg-scrim" />
      </div>

      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">The proof</span>
          <h2 className="section-title">Work that speaks<br />for itself.</h2>
          <p className="section-lead">
            A look at recent jobs off our shop floor — from first inspection to the finished result.
          </p>
        </div>

        <div className="gallery__track" ref={trackRef}>
          {SHOTS.map((s, i) => (
            <figure
              key={i}
              className={`shot clickable ${active === i ? 'shot--active' : ''}`}
              style={{ '--tone': s.tone }}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <div className="shot__before">
                <img
                  className="shot__image shot__image--before"
                  src={s.beforeImage}
                  alt={`${s.tag} before repair`}
                  onError={(e) => { e.currentTarget.src = '/car1.jpg' }}
                />
                <span className="shot__label">Before</span>
              </div>
              <div className="shot__after">
                <img
                  className="shot__image"
                  src={s.image}
                  alt={`${s.tag} repair result`}
                  onError={(e) => { e.currentTarget.src = '/car1.jpg' }}
                />
                <span className="shot__label shot__label--after">After</span>
                <span className="shot__gloss" />
              </div>
              <figcaption className="shot__cap">{s.tag}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
