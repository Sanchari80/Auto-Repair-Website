const DB_NAME = 'abr-site-data'
const DB_VERSION = 1
const BOOKINGS_STORE = 'bookings'
const REVIEWS_STORE = 'reviews'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(BOOKINGS_STORE)) database.createObjectStore(BOOKINGS_STORE, { keyPath: 'id' })
      if (!database.objectStoreNames.contains(REVIEWS_STORE)) database.createObjectStore(REVIEWS_STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function readStore(storeName) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const request = database.transaction(storeName, 'readonly').objectStore(storeName).getAll()
    request.onsuccess = () => { database.close(); resolve(request.result) }
    request.onerror = () => { database.close(); reject(request.error) }
  }))
}

function replaceStore(storeName, items) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    store.clear()
    items.forEach((item) => store.put(item))
    transaction.oncomplete = () => { database.close(); resolve(items) }
    transaction.onerror = () => { database.close(); reject(transaction.error) }
  }))
}

function readLegacy(key, fallback = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(saved) ? saved : fallback
  } catch {
    return fallback
  }
}

export async function readBookings() {
  try {
    const saved = await readStore(BOOKINGS_STORE)
    if (saved.length) return saved
    const current = readLegacy('abr_session_history')
    const legacy = readLegacy('abr_bookings')
    const migrated = (current.length ? current : legacy).map((item, index) => ({ ...item, id: item.id || `legacy-${index}`, status: item.status || 'New' }))
    if (migrated.length) await replaceStore(BOOKINGS_STORE, migrated)
    return migrated
  } catch {
    return readLegacy('abr_session_history')
  }
}

export async function saveBookings(bookings) {
  try { await replaceStore(BOOKINGS_STORE, bookings) } catch { localStorage.setItem('abr_session_history', JSON.stringify(bookings)) }
  return bookings
}

export async function readReviews(fallback = []) {
  try {
    const saved = await readStore(REVIEWS_STORE)
    if (saved.length) return saved
    const legacy = readLegacy('abr_customer_reviews')
    const migrated = legacy.length ? legacy : fallback
    if (migrated.length) await replaceStore(REVIEWS_STORE, migrated)
    return migrated
  } catch {
    return readLegacy('abr_customer_reviews', fallback)
  }
}

export async function saveReviews(reviews) {
  try { await replaceStore(REVIEWS_STORE, reviews) } catch { localStorage.setItem('abr_customer_reviews', JSON.stringify(reviews)) }
  return reviews
}