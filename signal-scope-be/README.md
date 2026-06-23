# signal-scope-be

NestJS backend API for **Signal Scope** — a network management system (NMS) dashboard.

Serves device metrics, alerts, topology, wireless, telemetry, discovery, inventory, and service-health data from a PostgreSQL + TimescaleDB database. Includes an Ornstein-Uhlenbeck simulation engine that generates realistic time-series device metrics and writes them to the database every 10 seconds.

---

## Features

- REST API under `/api/*` covering all NMS domains
- PostgreSQL connection pool via `pg` (node-postgres)
- TimescaleDB hypertable writes — device metrics persisted every 10 s
- Real-time simulation engine (CPU, memory, throughput, latency, packet loss)
- CORS and port configurable via environment variables
- Standalone Docker image (~120 MB)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript 5 |
| Database client | `pg` (node-postgres) |
| Runtime | Node.js 22 |

---

## Prerequisites

- Node.js 22+
- PostgreSQL 16 with TimescaleDB 2.x  
  → Use [`signal-scope-db`](https://github.com/mazoochian/signal-scope-db) which provides a pre-configured Docker image with migrations

---

## Local development

```bash
# 1. Start the database (via Docker or a local install)
#    See signal-scope-db for setup instructions

# 2. Install dependencies
npm install

# 3. Copy environment file and edit if needed
cp .env .env.local   # .env has localhost defaults — edit if your DB differs

# 4. Start in watch mode
npm run start:dev
```

API available at **http://localhost:4000/api**.

---

## Environment variables

All variables are loaded from `.env` (development) or `.env.production` (when `NODE_ENV=production`) via `dotenv`. Variables already set in the environment (e.g. by Docker Compose) always take precedence.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | HTTP port the API listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `signalscope` | Database name |
| `DB_USER` | `signalscope` | Database user |
| `DB_PASS` | `signalscope` | Database password |

---

## API routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/overview` | KPI stats, WAN chart, alerts, sites, services, syslog |
| GET | `/api/devices` | Device list with live CPU/mem from latest metric row |
| POST | `/api/devices` | Add a device |
| DELETE | `/api/devices/:id` | Remove a device |
| GET | `/api/alerts` | Active alerts and severity counts |
| GET | `/api/interfaces` | Interface list for core-sw-01 |
| GET | `/api/topology` | Topology nodes, edges, and path trace |
| GET | `/api/wireless` | Access points, SSID distribution, summary |
| GET | `/api/telemetry` | Application breakdown, subscriptions, flow stats |
| GET | `/api/inventory` | Hardware assets with warranty dates |
| GET | `/api/discovery` | Discovery jobs and recently-found devices |
| GET | `/api/services` | Business service health with dependencies |
| GET | `/api/notifications` | All notifications |
| PATCH | `/api/notifications/:id/read` | Mark one notification read |
| POST | `/api/notifications/mark-all-read` | Mark all notifications read |
| GET | `/api/simulation/wan` | Live WAN series from simulation engine |
| GET | `/api/simulation/kpis` | Live KPI values |
| GET | `/api/simulation/snapshot` | Current per-device metrics snapshot |
| GET | `/api/simulation/device/:id` | Per-device history (up to 100 points) |

---

## Docker

### Build the image

```bash
docker build -t signal-scope-api:latest .
```

### Run standalone

Requires a reachable PostgreSQL + TimescaleDB instance:

```bash
docker run -p 4000:4000 \
  -e DB_HOST=<db-host> \
  -e DB_PASS=<password> \
  -e CORS_ORIGIN=http://<frontend-host>:3000 \
  signal-scope-api:latest
```

### Docker Compose (recommended)

Use the root [`signal-scope`](https://github.com/mazoochian/signal-scope) compose file which starts the database, API, and frontend together with proper health-check ordering:

```bash
git clone https://github.com/mazoochian/signal-scope.git
cd signal-scope

cp .env.example .env        # edit DB_PASS and CORS_ORIGIN
./scripts/build.sh          # build all three Docker images
./scripts/deploy.sh         # docker compose up -d
```

The API will be available at **http://localhost:4000/api**.

---

## Project structure

```
src/
  main.ts                  # Bootstrap — loads dotenv, configures CORS
  app.module.ts            # Root module
  db/
    db.module.ts           # Global pg Pool module
    db.service.ts          # query() wrapper
  simulation/
    simulation.engine.ts   # Ornstein-Uhlenbeck stochastic engine
    simulation.service.ts  # Tick loop, writes device_metrics to DB
  alerts/                  # Alerts service + controller
  devices/                 # Devices service + controller
  interfaces/              # Interfaces service + controller
  topology/                # Topology nodes/edges service + controller
  wireless/                # Access points + SSID service + controller
  telemetry/               # App breakdown + subscriptions + controller
  inventory/               # Hardware assets service + controller
  discovery/               # Jobs + discovered devices service + controller
  services/                # Business service health + controller
  notifications/           # Notifications service + controller
  overview/                # Aggregated overview service + controller
  host-metrics/            # Host-level metrics (CPU/mem of the server)
  common/
    chart-utils.ts         # Deterministic series generator (seed-based)
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Watch mode (ts-node, hot-reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled output |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests |
