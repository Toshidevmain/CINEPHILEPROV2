# CinePhile (CineGeek 2.0)

A movie and series streaming/browsing website built with Next.js and the TMDB API.

## Tech Stack

- **Framework**: Next.js 13 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + TanStack Query
- **API Layer**: tRPC
- **Movie Data**: TMDB API (The Movie Database)
- **Package Manager**: npm

## Project Structure

- `src/app` or `src/pages` - Next.js pages/routing
- `src/components` - Reusable UI components
- `src/server` - tRPC server routers
- `src/hooks` - Custom React hooks
- `src/stores` - Zustand state stores
- `src/lib` - Shared utilities
- `src/configs` - App configuration (site metadata)
- `src/env.mjs` - Type-safe environment variable validation (@t3-oss/env-nextjs)

## Running the App

```bash
npm run dev     # starts on port 5000 (Replit-compatible)
npm run build   # production build
npm run start   # production server on port 5000
```

## Replit Configuration

- Dev server runs on port **5000** bound to `0.0.0.0` (required by Replit webview)
- Workflow: "Start application" → `npm run dev`
- Environment variables are managed via Replit Secrets and env vars (not .env file)

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Full URL of the app (set as Replit secret) |
| `NEXT_PUBLIC_TMDB_TOKEN` | TMDB Bearer token for movie API |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | GA4 tracking ID |
| `NEXT_PUBLIC_SITE_NAME` | Site display name |
| `NEXT_PUBLIC_TWITTER` | Twitter profile URL |
| `NEXT_PUBLIC_FACEBOOK` | Facebook profile URL |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram profile URL |
| `NEXT_PUBLIC_YOUTUBE` | YouTube channel URL |

## Migration Notes (Vercel → Replit)

- Updated `dev` and `start` scripts to use `-p 5000 -H 0.0.0.0`
- Set all env vars in Replit's secrets/env system (removed reliance on `.env` file)
- `NEXT_PUBLIC_APP_URL` already stored as a Replit secret
