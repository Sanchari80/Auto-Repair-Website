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
    const onDown = () => {
      ring.classList.remove('clicking')
      requestAnimationFrame(() => ring.classList.add('clicking'))
    }
    const onUp = () => ring.classList.remove('clicking')
    const over = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .clickable')) setHover(true)
    }
    const out = (e) => {
      if (e.target.closest('a, button, input, textarea, select, .clickable')) setHover(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M38 8a16 16 0 0 0-7 28L12 55a5 5 0 0 0 7 7l19-19a16 16 0 0 0 19-22l-10 10-7-2-2-7L48 12a16 16 0 0 0-10-4Z" fill="#708995" stroke="#b8c6ca" strokeWidth="2" strokeLinejoin="round"/>
          <path d="m17 55 22-22" stroke="#435b66" strokeWidth="4" strokeLinecap="round"/>
          <path d="m35 13 7 7" stroke="#435b66" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </>
  )
}
