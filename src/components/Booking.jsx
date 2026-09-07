import { useEffect, useState } from 'react'
import './Booking.css'

const SERVICES = ['Collision Repair', 'Paint & Refinish', 'Dent & Scratch', 'Detailing & Ceramic', 'Glass Replacement', 'Free Estimate']
const TIMES = ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM']
const HISTORY_KEY = 'abr_session_history'
const API_BASE = import.meta.env.VITE_API_URL || ''

function getSavedHistory() {
  try {
    const current = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    if (current.length) return current
    const legacy = JSON.parse(localStorage.getItem('abr_bookings') || '[]')
    return legacy.map((item, index) => ({ ...item, id: item.id || `legacy-${index}`, status: item.status || 'New' }))
  } catch {
    return []
  }
}

function nextDays(count) {
  const out = []
  const d = new Date()
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) out.push(new Date(d)) // skip Sundays
  }
  return out
}

function displayStatus(status) {
  return status === 'New' ? 'Booked' : status
}

export default function Booking({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ service: '', date: '', time: '', name: '', phone: '', vehicle: '', notes: '' })
  const [done, setDone] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [bookingStatus, setBookingStatus] = useState('New')
  const [history, setHistory] = useState([])
  const days = nextDays(6)

  useEffect(() => {
    if (open) {
      setStep(1); setDone(false)
      setBookingId(''); setBookingStatus('New')
      setHistory(getSavedHistory())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || history.length === 0) return undefined
    const checkStatus = async () => {
      const nextHistory = await Promise.all(history.map(async (item) => {
        try {
          const response = await fetch(`${API_BASE}/api/bookings/${item.id}/status`)
          if (!response.ok) return item
          const result = await response.json()
          return { ...item, status: result.status }
        } catch { return item }
      }))
      setHistory(nextHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
      const current = nextHistory.find((item) => item.id === bookingId)
      if (current) setBookingStatus(current.status)
    }
    checkStatus()
    const timer = setInterval(checkStatus, 3000)
    return () => clearInterval(timer)
  }, [open, history.length, bookingId])

  if (!open) return null

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const canNext =
    (step === 1 && data.service) ||
    (step === 2 && data.date && data.time) ||
    (step === 3 && data.name && data.phone && data.vehicle)

  const submit = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Booking request failed')
      const result = await response.json()
      setBookingId(result.booking.id)
      setBookingStatus(result.booking.status)
      const record = { ...data, id: result.booking.id, status: result.booking.status }
      const nextHistory = [record, ...history.filter((item) => item.id !== record.id)]
      setHistory(nextHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
      setDone(true)
    } catch {
      setDone(false)
      window.alert('We could not send the request. Please call us at (425) 750-5164.')
    }
  }

  const fmtDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="bk" role="dialog" aria-modal="true" aria-label="Book a session">
      <div className="bk__overlay" onClick={onClose} />
      <div className="bk__panel">
        <button className="bk__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="22"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div className="bk__side">
          <span className="eyebrow">Book a session</span>
          <h3 className="bk__side-title">Let's get your<br />car back to new.</h3>
          <p className="bk__side-sub">Pick a service, choose a slot, and we'll confirm by phone. Most bookings start within three business days.</p>
          <ul className="bk__side-list">
            <li><i /> No-obligation written estimate</li>
            <li><i /> We handle the insurance paperwork</li>
            <li><i /> Lifetime warranty on paintwork</li>
          </ul>
          <a href="tel:+14257505164" className="bk__side-call">
            <svg viewBox="0 0 24 24" width="16"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 006 6L15 14l5 2v4a2 2 0 01-2 2A16 16 0 012 6a2 2 0 012-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            (425) 750‑5164
          </a>
        </div>

        <div className="bk__main">
          {done ? (
            <div className="bk__done">
              <div className="bk__check">
                <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="#35c0d8" strokeWidth="2"/><path d="M16 27l7 7 14-15" fill="none" stroke="#35c0d8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3>{bookingStatus === 'Confirmed' ? 'Booking confirmed' : 'Session requested'}</h3>
              <p>Thanks, {data.name.split(' ')[0] || 'there'}. We've noted your <strong>{data.service}</strong> for <strong>{data.date}</strong> at <strong>{data.time}</strong>. We'll call {data.phone} shortly to confirm.</p>
              <span className={`bk__status bk__status--${bookingStatus.toLowerCase()}`}>{displayStatus(bookingStatus)}</span>
              <div className="bk__history"><strong>Session history</strong>{history.map((item) => <div className="bk__history-row" key={item.id}><span>{item.service}<small>{item.date} · {item.time}</small></span><b className={item.status === 'Confirmed' ? 'is-approved' : ''}>{displayStatus(item.status)}</b></div>)}</div>
              <button className="btn btn--primary" onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              <div className="bk__steps">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`bk__dot ${step >= n ? 'is-on' : ''}`}>{n}</div>
                ))}
              </div>

              {history.length > 0 && <div className="bk__history"><strong>Session history</strong>{history.map((item) => <div className="bk__history-row" key={item.id}><span>{item.service}<small>{item.date} · {item.time}</small></span><b className={item.status === 'Confirmed' ? 'is-approved' : ''}>{displayStatus(item.status)}</b></div>)}</div>}

              {step === 1 && (
                <div className="bk__step">
                  <h4 className="bk__q">What do you need done?</h4>
                  <div className="bk__chips">
                    {SERVICES.map((s) => (
                      <button
                        key={s}
                        className={`bk__chip clickable ${data.service === s ? 'is-sel' : ''}`}
                        onClick={() => set('service', s)}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bk__step">
                  <h4 className="bk__q">Choose a day</h4>
                  <div className="bk__days">
                    {days.map((d) => {
                      const label = fmtDate(d)
                      return (
                        <button
                          key={label}
                          className={`bk__day clickable ${data.date === label ? 'is-sel' : ''}`}
                          onClick={() => set('date', label)}
                        >
                          <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <strong>{d.getDate()}</strong>
                          <span>{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                      )
                    })}
                  </div>
                  <h4 className="bk__q">Pick a time</h4>
                  <div className="bk__chips">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        className={`bk__chip clickable ${data.time === t ? 'is-sel' : ''}`}
                        onClick={() => set('time', t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bk__step">
                  <h4 className="bk__q">Your details</h4>
                  <div className="bk__fields">
                    <label>Full name<input value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" /></label>
                    <label>Phone<input value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(425) 000‑0000" /></label>
                    <label>Vehicle<input value={data.vehicle} onChange={(e) => set('vehicle', e.target.value)} placeholder="2021 Honda Accord" /></label>
                    <label>Notes (optional)<textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Rear bumper scrape, insurance claim #..." rows={2} /></label>
                  </div>
                </div>
              )}

              <div className="bk__nav">
                {step > 1 ? (
                  <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>Back</button>
                ) : <span />}
                {step < 3 ? (
                  <button className="btn btn--primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue</button>
                ) : (
                  <button className="btn btn--primary" disabled={!canNext} onClick={submit}>Request session</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
