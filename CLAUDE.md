# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CK48 30th Reunion website for Taipei First High School (建國高中), Class of 1996. Static frontend that connects to a separate Fastify/Prisma/PostgreSQL backend repo (`reunion30-node`).

## Development

**No build step.** This is a pure static site — open HTML files directly in a browser, or use any static file server:

```bash
# Serve locally (any of these work)
npx serve .
python3 -m http.server 8080
```

**Backend:** The API backend lives in a separate `reunion30-node` repository. The helper script `apply-reunion30-node.sh` generates backend config files when run from that repo.

## Deployment

Push to `main` → auto-deploys to `ck48.reunion30.tw` via GitHub Actions (rsync to VPS at `159.223.40.36`).
Push to `staging` → auto-deploys to `test-ck48.reunion30.tw`.

Workflow file: `.github/workflows/deploy.yml`

## Architecture

### Frontend (`/js/`)

| File | Role |
|------|------|
| `api.js` | API client (IIFE module). All backend calls go through here. |
| `main.js` | Page initialization, event listeners, countdown timer |
| `components.js` | Reusable DOM component renderers (news cards, FAQ items, etc.) |
| `data.js` | Static fallback data for when API is unavailable |

**API client** auto-detects environment:
```js
const BASE = location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.reunion30.tw';
const HEADERS = { 'X-Tenant-Slug': 'ck48' };
```

All API calls send `X-Tenant-Slug: ck48` for multi-tenant routing.

### Pages with API Dependencies

- `index.html` — calls `/api/stats`
- `news.html` / `news-detail.html` — calls `/api/news` and `/api/news/{slug}`
- `faq.html` — calls `/api/faq`
- `find-classmates.html` — calls `/api/classes`, POSTs to `/api/checkin` (includes Google reCAPTCHA token)

Pages without API dependencies (`about.html`, `event.html`, `event-photos.html`, etc.) are fully static.

### Data

`/data/alumni.json` — 1,520 alumni across 33 classes (301–333), used client-side for the find-classmates search feature. Not fetched from API.

### Styling

Single file: `/css/main.css` (~1,438 LOC). Uses CSS custom properties (design tokens), `clamp()` for fluid sizing, mobile-first layout.

### Backend API (reunion30-node)

Relevant endpoints consumed by this frontend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Total alumni + found count |
| `/api/news` | GET | News list (supports category filter) |
| `/api/news/:slug` | GET | Single news article |
| `/api/faq` | GET | FAQ items |
| `/api/classes` | GET | Class list for check-in dropdown |
| `/api/checkin` | POST | Submit check-in record |

Database schema (Prisma): `ReunionTenant`, `ReunionClass`, `ReunionAlumni`, `ReunionCheckinRecord`, `ReunionNews`, `ReunionFaq`.
