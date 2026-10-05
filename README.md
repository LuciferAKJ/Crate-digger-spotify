# Crate Digger

A premium, non-clone music discovery application built on the Spotify Web API. See `crate-digger-design-spec` (shared separately) for the full product/design source of truth.

**Status:** Phase 1 — Foundation & Architecture complete. No search, catalog, or player features yet — those begin in Phase 2.

## Structure

```
crate-digger/
  packages/shared/   # Framework-agnostic domain entities used by both client and server
  server/             # Express + TypeScript API (Clean Architecture: domain/infrastructure/presentation)
  client/             # React 19 + Vite + TypeScript SPA (same layering)
```

## Setup

Requires Node.js ≥ 20.

```bash
npm install

# Server
cp server/.env.example server/.env
# then fill in SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET from
# https://developer.spotify.com/dashboard
#
# Note: as of Feb 2026, Spotify Development Mode apps require the app
# owner to have an active Premium subscription, and /search is capped
# at limit=10 (default 5) — already reflected in this codebase.

# Client
cp client/.env.example client/.env
```

## Running

```bash
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

Visit `http://localhost:5173`. The full route shell (Home, Discover, Artist/Album/Track, My Crate, History, Settings) renders with placeholder content until Phase 2+ wires up real catalog data.

## Building

```bash
npm run build
```

## Typecheck, test, lint

```bash
npm run typecheck   # all workspaces
npm run test        # server + client (Vitest)
npm run lint         # whole monorepo (ESLint flat config)
```

Tests are deterministic and never call the real Spotify API — server tests use a fake `IMusicProvider`; nothing hits the network.

## Architecture

Both `client` and `server` follow the same four-layer split:

- **`domain/`** — entities and repository interfaces. No framework, no HTTP, no provider SDK. `IMusicProvider` (server) lives here.
- **`infrastructure/`** — concrete implementations: Express app + middleware, the Spotify auth client, the client's fetch-based API client. This is the only layer allowed to know Spotify exists.
- **`presentation/`** — routes/controllers (server), pages/components/layouts (client).
- **`application/`** (client) — cross-cutting state (Zustand) and providers (TanStack Query) that orchestrate domain + infrastructure for the presentation layer.

This means the Spotify integration can be replaced or supplemented (e.g. a Deezer adapter for preview-audio fallback) by writing a new class that implements `IMusicProvider`, without touching routes, components, or the client at all.
