# signal-scope-fe

Next.js 15 frontend for **Signal Scope** — a network management system (NMS) dashboard.

Displays real-time device health, alerts, topology maps, wireless coverage, telemetry, inventory, and service-level data sourced from the [`signal-scope-be`](https://github.com/mazoochian/signal-scope-be) API.

---

## Features

- Live KPI strip and WAN throughput chart (2 s polling via Ornstein-Uhlenbeck simulation)
- Device inventory with add/delete, per-device CPU and memory history
- Active alerts with severity breakdown and root-cause chaining
- Interactive topology map (SVG canvas, node/edge status colouring)
- Wireless AP grid, SSID distribution, and client trend chart
- NetFlow telemetry, application breakdown, and gRPC subscription table
- Hardware inventory with warranty and end-of-support tracking
- Network discovery job progress and recently-found devices
- Business service health with SLA percentages
- Notification centre with unread badge and mark-all-read
- Offline / backend-unavailable error boundary with retry
- Custom 404 page

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Data fetching | `fetch` with `cache: 'no-store'` + `usePoller` hook |

---

## Prerequisites

- Node.js 22+
- A running instance of [`signal-scope-be`](https://github.com/mazoochian/signal-scope-be) (defaults to `http://localhost:4000`)

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `NEXT_PUBLIC_API_URL` if the backend is not on `localhost:4000`:

```bash
NEXT_PUBLIC_API_URL=http://192.168.1.10:4000 npm run dev
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | URL the **browser** uses to reach the API. Baked in at build time. |
| `API_URL` | value of `NEXT_PUBLIC_API_URL` | URL the **server** uses for SSR fetches. Override to the internal Docker hostname (e.g. `http://api:4000`). |

---

## Docker

### Build the image

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://<your-server-ip>:4000 \
  -t signal-scope-fe:latest .
```

### Run standalone

```bash
docker run -p 3000:3000 \
  -e API_URL=http://<api-host>:4000 \
  signal-scope-fe:latest
```

### Docker Compose (recommended)

Use the root [`signal-scope`](https://github.com/mazoochian/signal-scope) compose file which starts the database, API, and frontend together:

```bash
git clone https://github.com/mazoochian/signal-scope.git
cd signal-scope

cp .env.example .env        # edit NEXT_PUBLIC_API_URL and DB_PASS
./scripts/build.sh          # build all three Docker images
./scripts/deploy.sh         # docker compose up -d
```

The frontend will be available at **http://localhost:3000**.

---

## Project structure

```
app/
  page.tsx         # Overview dashboard
  devices/         # Device inventory
  alerts/          # Active alerts
  topology/        # Network topology map
  wireless/        # Wireless overview
  telemetry/       # NetFlow / gRPC telemetry
  inventory/       # Hardware inventory
  discovery/       # Network discovery
  services/        # Business service health
  error.tsx        # Global error boundary (handles backend offline)
  not-found.tsx    # 404 page
components/
  layout/          # Sidebar, top-bar, page-header, poll-interval picker
  charts/          # Sparkline, heat-strip, mini-bars (custom SVG)
  overview/        # Live KPI strip, WAN chart, resource panels
  ui/              # Notification centre, status pill, panel wrapper
lib/
  api.ts           # apiFetch — error tagging, SSR/CSR URL split
  use-poller.ts    # Polling hook with configurable interval
  polling-context  # React context for the interval picker
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot-reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
