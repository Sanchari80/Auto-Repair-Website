import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    const setHover = (on) => ring.classList.toggle('hovering', on)
    const over = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .clickable')) setHover(true)
    }
    const out = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .clickable')) setHover(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <svg viewBox="0 0 32 96" fill="none">
          <path d="M8 7 L16 2 L24 7 V20 L16 25 L8 20 Z" fill="#15151a" stroke="#ff5a1f" strokeWidth="2"/>
          <path d="M16 25 V80" stroke="#9aa0ab" strokeWidth="4" strokeLinecap="round"/>
          <path d="M16 25 V80" stroke="#35c0d8" strokeWidth="1" strokeDasharray="3 4"/>
          <path d="M10 80 H22 L16 94 Z" fill="#f5c518" stroke="#ff8a3d" strokeWidth="1.5"/>
        </svg>
      </div>
    </>
  )
}
