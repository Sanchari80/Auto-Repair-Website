import './Contact.css'

export default function Contact({ onBook }) {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact__cta">
          <div>
            <span className="eyebrow">Ready when you are</span>
            <h2 className="section-title">Bring it in.<br />We'll take it from here.</h2>
          </div>
          <button className="btn btn--primary btn--lg" onClick={onBook}>
            <span className="btn__nut" />
            Book a session
          </button>
        </div>

        <div className="contact__grid">
          <div className="contact__card">
            <span className="contact__k">Visit the shop</span>
            <p className="contact__v">12902 Hwy 99, Ste 7<br />Everett, WA 98204</p>
            <a className="contact__link" href="https://maps.google.com/?q=12902+Hwy+99+Ste+7" target="_blank" rel="noreferrer">Get directions →</a>
          </div>
          <div className="contact__card">
            <span className="contact__k">Call us</span>
            <p className="contact__v"><a href="tel:+14257505164">(425) 750‑5164</a></p>
            <a className="contact__link" href="tel:+14257505164">Tap to call →</a>
          </div>
          <div className="contact__card">
            <span className="contact__k">Hours</span>
            <p className="contact__v">Mon–Fri · 8:00 – 6:00<br />Sat · 9:00 – 2:00 · Sun closed</p>
            <span className="contact__link contact__link--muted">By appointment welcome</span>
          </div>
        </div>

        <div className="contact__map">
          <iframe
            title="Auto Body Repair Inc. location"
            src="https://www.google.com/maps?q=12902%20Hwy%2099%20Ste%207%20Everett%20WA&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <span className="nav__logo-mark" style={{ width: 30, height: 30 }}>
              <svg viewBox="0 0 32 32"><path d="M4 22 L8 12 Q9 9 12 9 L20 9 Q23 9 24 12 L28 22 Z" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeLinejoin="round"/><circle cx="10" cy="23" r="2.6" fill="#ff5a1f"/><circle cx="22" cy="23" r="2.6" fill="#ff5a1f"/></svg>
            </span>
            <span>Auto Body Repair <em>Inc.</em></span>
          </div>
          <p className="footer__copy">© {new Date().getFullYear()} Auto Body Repair Inc. · Everett, WA · All rights reserved.</p>
        </div>
      </footer>
    </section>
  )
}
