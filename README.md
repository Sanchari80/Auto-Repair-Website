# Auto-Repair-Website

Auto Body Repair Inc. website and booking admin system.

A 3D-animated, video-driven marketing site for an auto body repair shop.
Built with **Vite + React + Three.js + anime.js**. Deploy-ready for Vercel.

## Features

- **3D loading screen** — rotating steering wheel, moving screws and nuts on a lit garage grid.
- **Cinematic video hero** with royalty-free automotive footage (graceful poster fallback if a clip fails to load).
- **Native browser cursor** with the site's orange theme used in the interface.
- **Interactive services** — click any card's headlight to light it up.
- **Nut / gear / wheel / screw icons** in the navbar.
- **Booking session** — a 3-step modal (service → date & time → details) connected to the Express booking API.
- **Protected admin panel** at `/admin` for viewing requests and confirming sessions.
- **3-day process timeline**, before/after gallery with a video background, embedded Google Map, and full contact details.
- Fully **responsive** (desktop, tablet, mobile) with reduced-motion support.

## Run locally

```bash
npm install
npm run dev
```

In a second terminal, run the backend:

```bash
npm run server
```

Open the printed local URL (default http://localhost:5173).

## Build

```bash
npm run build      # outputs static site to /dist
npm run preview    # preview the production build locally
```

## Deploy

The frontend is Vite and the booking/admin API is Express. They can be deployed separately, or the backend can be adapted to serverless functions for a single Vercel project.

**Option A — Dashboard**
1. Deploy the Vite frontend to Vercel with build command `npm run build` and output `dist`.
2. Deploy `server.js` to Render, Railway, or another Node host with `npm run server`.
3. Point frontend `/api` requests to the backend URL in production.
4. Set `ADMIN_PASSWORD` on the backend host.

For the current deployment, the frontend is `https://auto-repair-website-two.vercel.app/`
and the Express backend is `https://auto-repair-website.onrender.com`. The frontend
uses the Render URL as its production fallback. You can override it with the Vercel
environment variable `VITE_API_URL` if the backend URL changes. The booking WebSocket
automatically uses the same backend URL with `wss://` on HTTPS deployments.

**Vercel frontend CLI**
```bash
npm i -g vercel
vercel          # follow prompts (first deploy)
vercel --prod   # production deploy
```

## Notes

- Background videos are loaded from public royalty-free CDNs. If a network blocks them, the hero shows a dark poster and the rest of the site still works.
- Booking submissions are kept in the running Express process. Add a database before production use so data survives restarts.

**Shop:** 12902 Hwy 99, Ste 7, Everett, WA · (425) 750‑5164
