const API_BASE = import.meta.env.VITE_API_URL || ''

function socketUrl() {
  if (API_BASE) return API_BASE.replace(/^http/, 'ws') + '/ws'
  return `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
}

export function subscribeToBookingEvents(onEvent) {
  if (!('WebSocket' in window)) return () => {}

  let socket
  let reconnectTimer
  let closed = false

  const connect = () => {
    if (closed) return
    socket = new WebSocket(socketUrl())
    socket.onmessage = (event) => {
      try { onEvent(JSON.parse(event.data)) } catch { /* Ignore malformed events. */ }
    }
    socket.onclose = () => {
      if (!closed) reconnectTimer = window.setTimeout(connect, 3000)
    }
  }

  connect()
  return () => {
    closed = true
    window.clearTimeout(reconnectTimer)
    socket?.close()
  }
}
