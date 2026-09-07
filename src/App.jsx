import { useState } from 'react'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Gallery from './components/Gallery.jsx'
import Contact from './components/Contact.jsx'
import Booking from './components/Booking.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [booking, setBooking] = useState(false)

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar onBook={() => setBooking(true)} />
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
