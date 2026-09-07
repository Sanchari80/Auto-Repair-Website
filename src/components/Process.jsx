import { useEffect, useRef } from 'react'
import anime from 'animejs'
import './Process.css'

const STEPS = [
  { day: 'Day 1', title: 'Teardown & assessment', desc: 'We disassemble the affected area, document hidden damage, and lock the repair plan with your insurer.' },
  { day: 'Day 2', title: 'Repair & refinish', desc: 'Panels are straightened or replaced, primed, and color-matched in our downdraft booth for an even coat.' },
  { day: 'Day 3', title: 'Reassembly & QC', desc: 'Everything goes back together, calibrated and road-tested. Final cut-and-buff, wash, and handover.' },
]

export default function Process() {
  const railRef = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            anime({ targets: '.process__line-fill', scaleY: [0, 1], duration: 1400, easing: 'easeInOutQuart' })
            anime({
              targets: '.pstep',
              translateX: [-30, 0],
              opacity: [0, 1],
              delay: anime.stagger(220),
              duration: 700,
              easing: 'easeOutExpo',
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    if (railRef.current) io.observe(railRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="process" id="process">
      <div className="wrap process__inner">
        <div className="process__aside">
          <span className="eyebrow">How it runs</span>
          <h2 className="section-title">Three days,<br />start to keys.</h2>
          <p className="section-lead">
            Most repairs are finished in three working days. You'll get status updates at
            every stage, and we don't hand back the car until it passes final QC.
          </p>
          <div className="process__badge">
            <strong>3</strong>
            <span>day average<br />turnaround</span>
          </div>
        </div>

        <div className="process__rail" ref={railRef}>
          <div className="process__line"><div className="process__line-fill" /></div>
          {STEPS.map((s, i) => (
            <div className="pstep" key={i}>
              <div className="pstep__node">{i + 1}</div>
              <div className="pstep__body">
                <span className="pstep__day">{s.day}</span>
                <h3 className="pstep__title">{s.title}</h3>
                <p className="pstep__desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
