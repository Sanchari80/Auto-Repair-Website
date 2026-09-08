import { useEffect, useState } from 'react'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import Booking from './components/Booking.jsx'
import { subscribeToBookingEvents } from './utils/bookingSocket.js'

const HISTORY_KEY = 'abr_session_history'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [booking, setBooking] = useState(false)
  const [activeBooking, setActiveBooking] = useState(null)

  useEffect(() => {
    const readHistory = () => {
      try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
        setActiveBooking(history.find((item) => item.status !== 'Completed') || null)
      } catch { setActiveBooking(null) }
    }
    readHistory()
    return subscribeToBookingEvents((event) => {
      if (event.type !== 'booking.updated') return
      const current = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
      const next = current.map((item) => item.id === event.booking.id ? { ...item, status: event.booking.status } : item)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      setActiveBooking(next.find((item) => item.status !== 'Completed') || null)
    })
  }, [])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar onBook={() => setBooking(true)} />
      {activeBooking && <div className={`user-status user-status--${activeBooking.status.toLowerCase()}`}><span className="user-status__pulse" /><span><strong>Session {activeBooking.status === 'New' ? 'booked' : activeBooking.status.toLowerCase()}</strong><small>{activeBooking.service} · {activeBooking.date} at {activeBooking.time}</small></span><button onClick={() => setBooking(true)}>View</button></div>}
      <main>
        <Hero onBook={() => setBooking(true)} ready={loaded} />
        <Services />
        <Process />
        <Gallery />
        <Contact onBook={() => setBooking(true)} />
      </main>
      <Booking open={booking} onClose={() => setBooking(false)} />
    </>
  )
}
