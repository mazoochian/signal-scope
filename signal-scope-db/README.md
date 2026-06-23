# signal-scope-db

PostgreSQL 16 + TimescaleDB database for **Signal Scope** — a network management system (NMS) dashboard.

Provides a Docker image that bootstraps the full schema, hypertables, and seed data on first start. Also includes a standalone migration script for running against an existing PostgreSQL instance.

---

## What's inside

| Migration | Contents |
|---|---|
| `001_extensions.sql` | Enables `timescaledb`, `uuid-ossp`, and `citext` |
| `002_schema.sql` | 17 relational tables — sites, devices, interfaces, alerts, services, topology, inventory, notifications, wireless, discovery, telemetry |
| `003_hypertables.sql` | 6 TimescaleDB hypertables — `device_metrics`, `interface_metrics`, `wan_metrics`, `syslog_messages`, `flow_stats`, `alert_history` |
| `004_seed.sql` | Seed data — 10 devices across 7 sites, 9 alerts, 18 topology nodes/edges, 12 APs, 6 services, 4 discovery jobs, and more |

---

## Docker (recommended)

The image is based on `timescale/timescaledb:latest-pg16`. Migrations run automatically on the very first container start via `/docker-entrypoint-initdb.d/`. Subsequent starts skip init and use the persisted volume.

### Build

```bash
docker build -t signal-scope-db:latest .
```

### Run standalone

```bash
docker run -d \
  --name signal-scope-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=changeme \
  -v signal_scope_pg:/var/lib/postgresql/data \
  signal-scope-db:latest
```

The database, user, and all tables will be created automatically on first boot.

### Docker Compose (recommended)

Use the root [`signal-scope`](https://github.com/mazoochian/signal-scope) compose file which starts the database, API, and frontend together with health-check ordering:

```bash
git clone https://github.com/mazoochian/signal-scope.git
cd signal-scope

cp .env.example .env        # set DB_PASS to something strong
./scripts/build.sh          # builds all three images
./scripts/deploy.sh         # docker compose up -d
```

The database will be reachable inside the Docker network at `db:5432`.

---

## Local PostgreSQL (without Docker)

Use `migrate.sh` to apply migrations against a local PostgreSQL instance:

### Prerequisites

- PostgreSQL 16
- TimescaleDB 2.x ([install guide](https://docs.timescale.com/self-hosted/latest/install/))
- `psql` in your `$PATH`

### Setup (Fedora / RHEL)

```bash
# Install TimescaleDB
sudo dnf install timescaledb

# Enable timescaledb in shared_preload_libraries
echo "shared_preload_libraries = 'timescaledb'" | \
  sudo tee -a /var/lib/pgsql/data/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql

# Create user and database
sudo -u postgres psql -c "CREATE USER signalscope WITH PASSWORD 'signalscope';"
sudo -u postgres psql -c "CREATE DATABASE signalscope OWNER signalscope;"
sudo -u postgres psql -d signalscope -c "GRANT ALL ON SCHEMA public TO signalscope;"
```

### Setup (Ubuntu / Debian)

```bash
# Follow https://docs.timescale.com/self-hosted/latest/install/installation-linux/
# Then:
sudo -u postgres psql -c "CREATE USER signalscope WITH PASSWORD 'signalscope';"
sudo -u postgres psql -c "CREATE DATABASE signalscope OWNER signalscope;"
sudo -u postgres psql -d signalscope -c "GRANT ALL ON SCHEMA public TO signalscope;"
```

### Run migrations

```bash
chmod +x migrate.sh
./migrate.sh
```

The script is idempotent — it tracks applied migrations in a `schema_migrations` table and skips any already applied.

Override connection settings via environment variables:

```bash
DB_HOST=myserver DB_USER=myuser DB_PASS=secret ./migrate.sh
```

| Variable | Default |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `signalscope` |
| `DB_USER` | `signalscope` |
| `DB_PASS` | `signalscope` |

---

## Schema overview

```
sites                    — geographic sites (HQ-NYC, DCA, LAX …)
devices                  — network devices with status, role, icon
interfaces               — physical/logical interfaces per device
alerts                   — active alerts (cleared_at IS NULL = active)
alert_history            — hypertable: state-change audit log
services                 — business / application services
service_dependencies     — hop list per service
topology_nodes           — SVG canvas nodes (wan, fw, router, core …)
topology_edges           — links between nodes with utilization %
inventory_assets         — hardware with serial, warranty, EoS dates
notifications            — UI notification feed with read state
wireless_ssids           — SSID definitions with display colour
wireless_access_points   — AP stats (channel, RSSI, utilization, clients)
discovery_jobs           — active/completed discovery scans
discovered_devices       — devices found by discovery jobs
telemetry_apps           — per-application flow breakdown
telemetry_subscriptions  — gRPC/gNMI streaming subscription status

device_metrics    (hypertable) — CPU, mem, ingress/egress, latency, loss (per device, 10 s)
interface_metrics (hypertable) — in/out Mbps, utilization, errors (per interface)
wan_metrics       (hypertable) — aggregate edge-router ingress/egress
syslog_messages   (hypertable) — syslog/event stream from devices
flow_stats        (hypertable) — NetFlow aggregate stats
```

---

## Files

```
Dockerfile                 # Based on timescale/timescaledb:latest-pg16
.dockerignore
migrate.sh                 # Idempotent CLI migration runner
migrations/
  001_extensions.sql
  002_schema.sql
  003_hypertables.sql
  004_seed.sql
```
