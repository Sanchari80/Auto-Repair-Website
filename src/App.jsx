import { useEffect, useState } from 'react'
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

const HISTORY_KEY = 'abr_session_history'

const isCompleted = (item) => String(item.status).toLowerCase() === 'completed'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [booking, setBooking] = useState(false)
  const [activeBooking, setActiveBooking] = useState(null)

  useEffect(() => {
    const readHistory = () => {
      try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
        setActiveBooking(history.find((item) => !isCompleted(item)) || null)
      } catch { setActiveBooking(null) }
    }
    readHistory()
    window.addEventListener('booking-history-changed', readHistory)
    window.addEventListener('storage', readHistory)
    const unsubscribe = subscribeToBookingEvents((event) => {
      if (event.type !== 'booking.updated') return
      const current = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      const next = current.map((item) => item.id === event.booking.id ? { ...item, status: event.booking.status } : item)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      setActiveBooking(next.find((item) => !isCompleted(item)) || null)
    })
    return () => {
      unsubscribe()
      window.removeEventListener('booking-history-changed', readHistory)
      window.removeEventListener('storage', readHistory)
    }
  }, [])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar onBook={() => setBooking(true)} />
      <Cursor />
      {activeBooking && <div className={`user-status user-status--${activeBooking.status.toLowerCase()}`}><span className="user-status__pulse" /><span><strong>Session {activeBooking.status === 'New' ? 'booked' : activeBooking.status.toLowerCase()}</strong><small>{activeBooking.service} · {activeBooking.date} at {activeBooking.time}</small></span><button onClick={() => setBooking(true)}>View</button></div>}
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
