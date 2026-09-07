import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3001
const adminPassword = process.env.ADMIN_PASSWORD || 'repair-admin-2026'
const frontendOrigin = process.env.FRONTEND_ORIGIN || '*'
const sessions = new Map()
const bookings = []

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontendOrigin)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.static(path.join(__dirname, 'dist')))

function isAuthorized(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  return token && sessions.has(token)
}

app.post('/api/bookings', (req, res) => {
  const { service, date, time, name, phone, vehicle, notes = '' } = req.body || {}
  if (!service || !date || !time || !name || !phone || !vehicle) {
    return res.status(400).json({ message: 'Required booking details are missing.' })
  }
  const booking = {
    id: crypto.randomUUID(), service, date, time, name, phone, vehicle, notes,
    status: 'New', createdAt: new Date().toISOString(),
  }
  bookings.unshift(booking)
  res.status(201).json({ booking: { id: booking.id, status: booking.status } })
})

app.get('/api/bookings/:id/status', (req, res) => {
  const booking = bookings.find((item) => item.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  res.json({ id: booking.id, status: booking.status })
})

app.post('/api/admin/login', (req, res) => {
  if (req.body?.password !== adminPassword) return res.status(401).json({ message: 'Incorrect password.' })
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, Date.now())
  res.json({ token })
})

app.get('/api/admin/bookings', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ message: 'Admin login required.' })
  res.json({ bookings })
})

app.patch('/api/admin/bookings/:id', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ message: 'Admin login required.' })
  const booking = bookings.find((item) => item.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  if (['New', 'Contacted', 'Confirmed', 'Completed'].includes(req.body?.status)) booking.status = req.body.status
  res.json({ booking })
})

app.delete('/api/admin/bookings/:id', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ message: 'Admin login required.' })
  const index = bookings.findIndex((item) => item.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Booking not found.' })
  bookings.splice(index, 1)
  res.status(204).end()
})

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))

app.listen(port, () => console.log(`Auto Body Repair server running on http://localhost:${port}`))
