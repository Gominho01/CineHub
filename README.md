# CineHub — Movie & TV Explorer

**Status:** ✅ Phase 1 (MVP) implemented — run `npm run dev` locally to try it (needs a free TMDB API key in `.env`).

## Overview

CineHub is a movie and TV discovery app built on top of the TMDB (The Movie Database) API: browse what's in theaters, trending, and top-rated titles, search across movies and shows, view a full detail page per title (synopsis, cast, rating, trailer), and keep a personal watchlist behind login.

The app leans on TMDB for content and imagery — posters, carousels, high-res artwork — to give it visual weight from the first screen, while using Next.js server-side rendering and incremental static regeneration as the underlying architecture, without requiring any hand-written content.

## Features

### MVP

- **Home carousels** — "In theaters," "Trending," "Top rated," sourced from the TMDB API and rendered with ISR (revalidated every few hours).
- **Search** — movies and shows by title, with paginated results.
- **Title detail page** (`/movie/[id]`) — synopsis, cast, rating, high-resolution poster, embedded trailer (YouTube), statically generated with ISR.
- **Genre browsing** (`/genre/[genre]`) — category-based navigation.

### Roadmap / stretch goals

- **Personal watchlist** — login (NextAuth.js or JWT) plus add/remove titles, persisted in Postgres.
- **User ratings** — 1–5 rating for titles on the watchlist.
- **Basic recommendations** — "because you watched X," based on the most frequent genres in the watchlist.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | SSG/ISR for listing and detail pages |
| Styling | Tailwind CSS | Cards, carousels, responsive grid |
| External data | TMDB API (free tier) | Source for all content — movies, shows, posters, trailers |
| Auth (stretch) | NextAuth.js or JWT | Login for the watchlist |
| Database (stretch) | PostgreSQL + Prisma | Watchlist and ratings |
| Validation | Zod | Validates watchlist/rating route payloads |
| CI/CD | GitHub Actions | Lint + test + build on every push/PR |
| Deploy | Vercel | Native Next.js environment, ISR works with no extra config |
| Testing | Vitest + Testing Library | UI components (carousel, movie card, search bar) |
| Images | `next/image` | Automatic optimization for TMDB posters |

## Architecture

```
[Next.js App Router]
   |-- /app/page.tsx               — ISR, home carousels
   |-- /app/movie/[id]/page.tsx    — ISR, detail page
   |-- /app/genre/[genre]/page.tsx — ISR, genre listing
   |-- /app/api/watchlist/*        — Route Handlers (stretch) — Postgres via Prisma
   |-- lib/tmdb.ts                 — TMDB API client (caching/revalidation)
```

## Roadmap

1. **Phase 0** — setup: Next.js + TS + Tailwind, free TMDB API key, API client. ✅ done
2. **Phase 1** — MVP: home carousels, search, detail page, genre filtering. ✅ done
3. **Phase 2 — accounts & watchlist**
   - Auth (JWT or NextAuth.js) + personal watchlist (add/remove titles).
   - 1–5 rating for titles on the watchlist.
4. **Phase 3 — recommendations & content**
   - Basic recommendations ("because you watched X"), based on the most frequent genres in the watchlist.
   - TV show support (TMDB already exposes `/tv` endpoints), not just movies.
   - Cast/person detail pages, a "similar movies" section on the detail page.
5. **Phase 4 — search experience**
   - Filters on search (genre, year, minimum rating).
   - Infinite scroll / pagination on search results.
   - Watch providers ("where to stream," already available from the TMDB API).
6. **Phase 5 — polish & deploy**
   - Loading skeletons, light/dark theme.
   - Production deploy on Vercel (native Next.js environment, no extra infra needed).

## Project Structure (scaffold only, no logic yet)

```
cinehub/
├── .github/workflows/ci.yml   # lint + test + build
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── movie/[id]/page.tsx
│   │   ├── genre/[genre]/page.tsx
│   │   └── api/watchlist/route.ts   # stretch
│   ├── components/            # carousel, movie card, search bar
│   ├── lib/
│   │   └── tmdb.ts
│   └── types/
```

## Getting Started

```
npm run dev    # Next.js at http://localhost:3000
```

## Open Questions

- TMDB vs. OMDb as the data source — TMDB has richer metadata and higher-quality imagery.
- Whether the watchlist (Phase 2) is essential, or the MVP is visually strong enough on its own without it.
