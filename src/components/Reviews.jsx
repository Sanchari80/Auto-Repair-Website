import { useEffect, useState } from 'react'
import './Reviews.css'
import { readReviews, saveReviews } from '../utils/storage.js'

const DEMO_REVIEWS = [
  { id: 'demo-1', number: 1, name: 'Marcus T.', address: 'Everett, WA', text: 'They brought my rear bumper back to factory shape. The finish is flawless and the handoff was right on time.' },
  { id: 'demo-2', number: 2, name: 'Nina R.', address: 'Lynnwood, WA', text: 'Clear updates, honest pricing, and a paint match you cannot tell from the original panel.' },
  { id: 'demo-3', number: 3, name: 'Daniel K.', address: 'Mukilteo, WA', text: 'Professional from inspection to pickup. My car looks better than it did before the accident.' },
]

export default function Reviews() {
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [form, setForm] = useState({ name: '', address: '', text: '' })

  useEffect(() => {
    readReviews(DEMO_REVIEWS).then(setReviews)
  }, [])

  const submitReview = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const address = form.address.trim()
    const text = form.text.trim()
    if (!name || !address || !text) return

    const nextReview = {
      id: `review-${Date.now()}`,
      number: reviews.length + 1,
      name,
      address,
      text,
    }
    const nextReviews = [...reviews, nextReview]
    setReviews(nextReviews)
    saveReviews(nextReviews)
    setForm({ name: '', address: '', text: '' })
  }

  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="section-head reviews__head">
          <span className="eyebrow">Customer notes</span>
          <h2 className="section-title">Good work leaves<br />a mark.</h2>
          <p className="section-lead">Real words from people who trusted us with their cars.</p>
        </div>

        <div className="reviews__layout">
          <div className="reviews__list" aria-live="polite">
            {reviews.map((review) => (
              <article className="review-plate" key={review.id}>
                <div className="review-plate__top">
                  <span className="review-plate__number">#{String(review.number).padStart(2, '0')}</span>
                  <span className="review-plate__stars" aria-label="5 out of 5 stars">★★★★★</span>
                </div>
                <p className="review-plate__text">“{review.text}”</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.address}</span>
                </footer>
              </article>
            ))}
          </div>

          <form className="review-form" onSubmit={submitReview}>
            <span className="review-form__label">Leave a review</span>
            <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" required /></label>
            <label>Address<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="City, state" required /></label>
            <label>Your review<textarea value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} placeholder="Tell us about your experience" rows="4" required /></label>
            <button className="btn btn--primary" type="submit"><span className="btn__nut" />Post review</button>
          </form>
        </div>
      </div>
    </section>
  )
}
