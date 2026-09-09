import { useEffect, useState } from 'react'
import './Admin.css'
import { subscribeToBookingEvents } from '../utils/bookingSocket.js'
import { playNotificationSound } from '../utils/notificationSound.js'
import Cursor from './Cursor.jsx'

const statuses = ['New', 'Contacted', 'Confirmed', 'Completed']
const API_BASE = import.meta.env.VITE_API_URL || 'https://auto-repair-website.onrender.com'

function displayStatus(status) {
  return status === 'New' ? 'Requested' : status
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('abr_admin_token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [bookings, setBookings] = useState([])
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')

  const loadBookings = async (authToken = token) => {
    const response = await fetch(`${API_BASE}/api/admin/bookings`, { headers: { Authorization: `Bearer ${authToken}` } })
    if (!response.ok) throw new Error('Could not load bookings.')
    const data = await response.json()
    setBookings(data.bookings)
    setSelected((current) => current ? data.bookings.find((booking) => booking.id === current.id) || null : null)
  }

  useEffect(() => {
    if (!token) return
    loadBookings().catch(() => { sessionStorage.removeItem('abr_admin_token'); setToken('') })
  }, [token])

  useEffect(() => {
    if (!token) return undefined
    return subscribeToBookingEvents((event) => {
      if (event.type === 'booking.created') {
        playNotificationSound('request')
        setNotice(`New booking requested by ${event.booking.name}.`)
        loadBookings().catch(() => {})
      } else if (event.type === 'booking.updated') {
        if (event.booking.status === 'Confirmed') {
          playNotificationSound('confirmed')
          setNotice(`Booking confirmed for ${event.booking.name}.`)
        }
        loadBookings().catch(() => {})
      } else if (event.type === 'booking.deleted') {
        loadBookings().catch(() => {})
      }
    })
  }, [token])

  const login = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoggingIn(true)
    try {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 8000)
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      })
      window.clearTimeout(timeout)
      if (!response.ok) return setError(response.status === 401 ? 'Incorrect password.' : 'Admin service is unavailable.')
      const data = await response.json()
      sessionStorage.setItem('abr_admin_token', data.token)
      setToken(data.token)
      setPassword('')
    } catch {
      setError('Could not connect to the admin service. Please try again shortly.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}/api/admin/bookings/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    loadBookings()
  }

  const removeBooking = async (id) => {
    await fetch(`${API_BASE}/api/admin/bookings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setSelected(null)
    loadBookings()
  }

  const exportBookings = async () => {
    const response = await fetch(`${API_BASE}/api/admin/bookings/export.csv`, { headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) return setNotice('Could not export booking history.')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `auto-body-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!token) return (
    <><Cursor /><main className="admin-page admin-page--login">
      <form className="admin-login" onSubmit={login}>
        <a href="/" className="admin-login__brand">AUTO BODY REPAIR <em>INC.</em></a>
        <span className="eyebrow">Private access</span>
        <h1>Admin panel</h1>
        <p>Sign in to review incoming session requests.</p>
        <label className="admin-password">Password<div><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
        {error && <span className="admin-error">{error}</span>}
        <button className="btn btn--primary" type="submit" disabled={isLoggingIn}>{isLoggingIn ? 'Connecting...' : 'Open bookings'}</button>
        <a href="/" className="admin-back">Back to website</a>
      </form>
    </main></>
  )

  return (
    <><Cursor /><main className="admin-page">
      <header className="admin-topbar"><a href="/" className="admin-login__brand">AUTO BODY REPAIR <em>INC.</em></a><div><span>Admin panel</span><button onClick={() => { sessionStorage.removeItem('abr_admin_token'); setToken('') }}>Sign out</button></div></header>
      <div className="admin-shell">
        <div className="admin-heading"><div><span className="eyebrow">Operations desk</span><h1>Session bookings</h1><p>Incoming customer requests and appointment details.</p></div><div className="admin-heading__actions"><button className="admin-export" onClick={exportBookings}>Download Excel</button><button className="admin-refresh" onClick={() => loadBookings()}>Refresh</button></div></div>
        {notice && <div className="admin-notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
        <div className="admin-stats"><div><strong>{bookings.length}</strong><span>Total requests</span></div><div><strong>{bookings.filter((booking) => booking.status === 'New').length}</strong><span>Needs follow-up</span></div><div><strong>{bookings.filter((booking) => booking.status === 'Confirmed').length}</strong><span>Confirmed</span></div></div>
        <div className="admin-content">
          <section className="admin-list">{bookings.length === 0 ? <div className="admin-empty"><strong>No bookings yet</strong><span>New requests will appear here.</span></div> : bookings.map((booking) => <button className={`admin-row ${selected?.id === booking.id ? 'is-selected' : ''}`} key={booking.id} onClick={() => setSelected(booking)}><span className="admin-avatar">{booking.name.charAt(0).toUpperCase()}</span><span className="admin-row__main"><strong>{booking.name}</strong><small>{booking.service} · {booking.vehicle}</small></span><span className="admin-row__date"><strong>{booking.date}</strong><small>{booking.time}</small></span><span className={`admin-status admin-status--${booking.status.toLowerCase()}`}>{displayStatus(booking.status)}</span></button>)}</section>
          {selected && <aside className="admin-detail"><div className="admin-detail__top"><span>Request details</span><button onClick={() => setSelected(null)}>×</button></div><h2>{selected.name}</h2><a href={`tel:${selected.phone}`}>{selected.phone}</a><dl><div><dt>Service</dt><dd>{selected.service}</dd></div><div><dt>Appointment</dt><dd>{selected.date} at {selected.time}</dd></div><div><dt>Vehicle</dt><dd>{selected.vehicle}</dd></div><div><dt>Notes</dt><dd>{selected.notes || 'No notes provided'}</dd></div></dl><label>Status<select value={selected.status} onChange={(event) => updateStatus(selected.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><button className="admin-delete" onClick={() => removeBooking(selected.id)}>Delete request</button></aside>}
        </div>
      </div>
    </main></>
  )
}
