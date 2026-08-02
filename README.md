# signal-scope

Monorepo orchestration for **Signal Scope** — a network management system (NMS) dashboard built with Next.js, NestJS, PostgreSQL, and TimescaleDB.

This repo contains the Docker Compose file, build/deploy scripts, and the `.env.example` template. The three sub-projects live in their own repositories:

| Repo | Description |
|---|---|
| [`signal-scope-fe`](https://github.com/mazoochian/signal-scope-fe) | Next.js 15 frontend dashboard |
| [`signal-scope-be`](https://github.com/mazoochian/signal-scope-be) | NestJS REST API + simulation engine |
| [`signal-scope-db`](https://github.com/mazoochian/signal-scope-db) | PostgreSQL 16 + TimescaleDB Docker image & migrations |

---

## Architecture

```
Browser
  │
  ▼
signal-scope-fe  (Next.js · port 3000)
  │  SSR fetches use internal Docker hostname
  ▼
signal-scope-be  (NestJS · port 4000)
  │  pg connection pool
  ▼
signal-scope-db  (TimescaleDB · port 5432)
```

Services start in dependency order enforced by Docker Compose health checks:
`db` → (healthy) → `api` → (healthy) → `frontend`

---

## Quick start (Docker)

### 1. Prerequisites

- Docker 24+ and Docker Compose v2
- Ports 3000, 4000, and 5432 available on the host

### 2. Clone and configure

```bash
git clone https://github.com/mazoochian/signal-scope.git
cd signal-scope

cp .env.example .env
```

Edit `.env` — the only value you must change for a real deployment is:

```env
DB_PASS=changeme                         # strong password
NEXT_PUBLIC_API_URL=http://<server-ip>:4000   # public API URL
CORS_ORIGIN=http://<server-ip>:3000           # public frontend URL
```

### 3. Build images

```bash
./scripts/build.sh
```

This builds `signal-scope-db:latest`, `signal-scope-api:latest`, and `signal-scope-fe:latest` from the source directories.

### 4. Deploy

```bash
./scripts/deploy.sh
```

This runs `docker compose up -d`. On first boot, the database container initialises the full schema and seed data automatically. Subsequent deploys reuse the persisted `pg_data` volume.

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |
| Database | localhost:5432 (internal only by default) |

### 5. Stop

```bash
docker compose down
# To also remove the database volume:
docker compose down -v
```

---

## Development mode

To run both services locally with hot-reload (requires a local PostgreSQL + TimescaleDB — see [`signal-scope-db`](https://github.com/mazoochian/signal-scope-db)):

```bash
./scripts/dev.sh
```

Starts the backend (`npm run start:dev`) and frontend (`npm run dev`) in parallel with colour-coded log prefixes. Press `Ctrl+C` to stop both.

---

## Environment variables

Copy `.env.example` to `.env` and adjust as needed.

| Variable | Default | Description |
|---|---|---|
| `API_PORT` | `4000` | Host port for the API |
| `FE_PORT` | `3000` | Host port for the frontend |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Public URL of the API (baked into the frontend at build time) |
| `CORS_ORIGIN` | `http://localhost:3000` | Origin allowed by the API's CORS policy |
| `DB_PASS` | `signalscope` | Database password — change this in production |

---

## Rebuild after code changes

```bash
./scripts/build.sh --no-cache   # force full rebuild
./scripts/deploy.sh --build     # rebuild + restart in one step
```

---

## A note on authorship

Portions of this codebase (across this repo and its sub-projects) were written with assistance from Claude (Anthropic). Commits aren't individually tagged with co-author trailers; this note covers that instead.
