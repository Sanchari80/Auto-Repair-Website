import { useEffect, useRef, useState } from 'react'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import Booking from './components/Booking.jsx'
import Reviews from './components/Reviews.jsx'
import Cursor from './components/Cursor.jsx'
import { subscribeToBookingEvents } from './utils/bookingSocket.js'
import { readBookings, saveBookings } from './utils/storage.js'

const HISTORY_KEY = 'abr_session_history'

const isCompleted = (item) => String(item.status).toLowerCase() === 'completed'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [booking, setBooking] = useState(false)
  const [activeBooking, setActiveBooking] = useState(null)
  const [statusOffset, setStatusOffset] = useState({ x: 0, y: 0 })
  const statusDrag = useRef(null)

  useEffect(() => {
    const readHistory = async () => {
      try {
        const history = await readBookings()
        setActiveBooking(history.find((item) => !isCompleted(item)) || null)
      } catch { setActiveBooking(null) }
    }
    readHistory()
    window.addEventListener('booking-history-changed', readHistory)
    window.addEventListener('storage', readHistory)
    const unsubscribe = subscribeToBookingEvents(async (event) => {
      if (event.type !== 'booking.updated') return
      const current = await readBookings()
      const next = current.map((item) => item.id === event.booking.id ? { ...item, status: event.booking.status } : item)
      await saveBookings(next)
      setActiveBooking(next.find((item) => !isCompleted(item)) || null)
    })
    return () => {
      unsubscribe()
      window.removeEventListener('booking-history-changed', readHistory)
      window.removeEventListener('storage', readHistory)
    }
  }, [])

  const startStatusDrag = (event) => {
    statusDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: statusOffset.x,
      offsetY: statusOffset.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveStatusCard = (event) => {
    const drag = statusDrag.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setStatusOffset({
      x: drag.offsetX + event.clientX - drag.startX,
      y: drag.offsetY + event.clientY - drag.startY,
    })
  }

  const stopStatusDrag = () => {
    statusDrag.current = null
  }

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar onBook={() => setBooking(true)} />
      <Cursor />
      {activeBooking && <div className={`user-status user-status--${activeBooking.status.toLowerCase()}`} style={{ transform: `translate(${statusOffset.x}px, ${statusOffset.y}px)` }} onPointerDown={startStatusDrag} onPointerMove={moveStatusCard} onPointerUp={stopStatusDrag} onPointerCancel={stopStatusDrag}><span className="user-status__pulse" /><span><strong>Session {activeBooking.status === 'New' ? 'booked' : activeBooking.status.toLowerCase()}</strong><small>{activeBooking.service} · {activeBooking.date} at {activeBooking.time}</small></span><button onClick={() => setBooking(true)}>View</button></div>}
      <main>
        <Hero onBook={() => setBooking(true)} ready={loaded} />
        <Services />
        <Process />
        <Gallery />
        <Reviews />
        <Contact onBook={() => setBooking(true)} />
      </main>
      <Booking open={booking} onClose={() => setBooking(false)} />
    </>
  )
}
