# SignalScope NMS — Application Report

**Version**: 4.2  
**Stack**: Next.js 16 (App Router) + NestJS 10  
**Date**: 2026-06-23

---

## Architecture Overview

SignalScope NMS is a Network Operations Center (NOC) dashboard that monitors, simulates, and visualises network infrastructure.

- **Frontend** (`signal-scope/`): Next.js 16, React 19, Tailwind v4. Runs on `:3000`.
- **Backend** (`signal-scope-be/`): NestJS 10, global `/api` prefix. Runs on `:4000`.

Server components fetch initial page data; client components use `usePoller` hook for live polling. Poll interval stored in `localStorage` via `PollingProvider`.

---

## Pages

### Overview (`/`)
Central NOC dashboard. Fetches `/api/overview` (alerts, sites, talkers, services, syslog), `/api/simulation/wan` (80-pt WAN chart), `/api/simulation/kpis` (6 KPI cards), `/api/host-metrics` (real server stats).

**KpiStripLive**: 6 cards — Devices Up, Critical Alerts, WAN Throughput, Mean Latency, Packet Loss, SLA (24h). Each has delta and sparkline. Polls `/simulation/kpis`.

**WanChartLive**: Dual-line ingress/egress throughput, 4 stat chips (Peak In, Peak Out, Drops, 95th %ile). Polls `/simulation/wan`.

**ResourceLive**: 4 bars — CPU, Memory, Storage, Load Avg. Real server metrics from `/host-metrics`. Shows CPU model string.

Other panels: Active Alerts (5 items), Site Health (6 sites + heat strips), Top Talkers (NetFlow table), Service Assurance (4 service cards with MOS/Loss/Jitter), Live Syslog.

**PollIntervalPicker** in TopBar: Off/5s/10s/30s/1m/5m — drives all polling globally.

### Alerts (`/alerts`)
Correlated alert management. 5 severity count chips (Critical/Major/Minor/Warning/Info). Alert table with ROOT-cause highlighted rows. Root cause chain panel. Alert volume sparkline. Action buttons (Acknowledge, Suppress, Open runbook) are present but non-functional (TODO).

### Devices (`/devices`)
Device inventory. 5 vendor count chips. Device table: icon+name, IP, vendor/model, role chip, site, status pill, CPU bar (>85% red, >70% orange), mem bar, uptime, trend sparkline. **Add Device Dialog** is fully functional — POST to `/api/devices` with validation. Search input and "Saved views" button are UI-only (not wired).

### Topology (`/topology`)
SVG network map (viewBox 1320×540). Circle nodes with abbreviations (CR/AG/AC/FW/RT/AP/WAN), coloured by status. Lines coloured by utilisation. Layer/site filter selects, zoom buttons (not wired). Selected device detail panel (hardcoded core-sw-01). Path trace panel with hop list.

### Interfaces (`/interfaces`)
Port monitoring. 4 summary chips. 48-port visual matrix (12-col grid). Top-6 utilised list. Interface table with util%, error counts (warning />0, critical />50), mini trend bars. Filter input (not wired).

### Wireless (`/wireless`)
Wi-Fi management. 4 summary chips (Clients, Channel Util, Avg RSSI, Roams/min). AP table with SSID chips, client counts, channel info, RSSI, util%. Clients 24h sparkline. SSID distribution bars.

### Flow & Telemetry (`/telemetry`)
NetFlow analysis. Aggregate throughput sparkline. 4 flow stat chips. Top apps horizontal bar chart. Conversations table (Src/Dst/App/Bytes/Packets/Duration). Streaming telemetry subscription health list.

### Service Assurance (`/services`)
Business service monitoring. One card per service: status pill, large health %, owner, 60-pt trend sparkline, dependency chain chips, MTTR/Incidents/Error Budget metrics.

### Discovery (`/discovery`)
Network discovery. Active jobs with progress bars (%), found count, new devices count. Recently discovered table with hostname/IP/vendor/status/ago. "Run discovery" button (not wired).

### Configuration Management (`/configuration`)
Static page. Diff viewer with green (+) / red (-) / muted (ctx) line highlighting, line numbers. Backup status list (7 devices; some with "drift" badge). Approve & push, Request review, Reject buttons (all TODO). Version history and Backup all (TODO).

### Inventory (`/inventory`)
Asset register. Summary chips. Table: Serial, Hostname, Model, Vendor, Site, Rack, OS, Purchased, Warranty, EoS.

### Reports (`/reports`)
Static page. 6 report template cards: Executive NOC Summary, WAN SLA Report, Capacity Planning, Configuration Compliance, Inventory Lifecycle, Incident Postmortem. Each has frequency, next run, format. Buttons: Edit, Recipients, Run now (all TODO).

### Settings (`/settings`)
Static page. Authentication panel (Azure AD, LDAP, MFA). RBAC table (5 roles). Distributed Collectors panel (4 collectors, 1 degraded). Integrations panel (Slack, Teams, PagerDuty, ServiceNow, SMTP).

---

## Cross-Cutting Components

**TopBar**: breadcrumb, search, LiveStatus (up/warn/down counts), PollIntervalPicker, NotificationCenter, AddDeviceDialog shortcut.

**NotificationCenter**: Fetches `/api/notifications` on mount (9 items). Per-item mark-read (PATCH), mark-all-read (POST). Unread badge on bell.

**Sidebar**: Fixed nav. Active state: `border-l-2 border-primary`. Alerts item has "37" badge. User: j.ramirez, NOC Engineer L2.

---

## Backend Engine

**SimulationEngine**: 10 emulated devices. Ornstein-Uhlenbeck random walk per metric. 300 warm-up ticks. 2s tick interval.

**HostMetricsService**: Reads `/proc/stat`, `/proc/meminfo`, `df -P /`, `os.loadavg()`. 2s refresh.

---

## API Surface

| Endpoint | Method | Description |
|---|---|---|
| `/api/overview` | GET | Static NOC dashboard data |
| `/api/simulation/wan` | GET | 80-pt WAN throughput chart |
| `/api/simulation/kpis` | GET | 6 live KPI cards |
| `/api/simulation/snapshot` | GET | All device current metrics |
| `/api/simulation/device/:id` | GET | Single device history |
| `/api/host-metrics` | GET | Real server CPU/mem/storage/load |
| `/api/alerts` | GET | Correlated alerts + severity counts |
| `/api/devices` | GET/POST | Device inventory |
| `/api/topology` | GET | Network topology graph |
| `/api/interfaces` | GET | Interface stats |
| `/api/wireless` | GET | AP and client data |
| `/api/telemetry` | GET | Flow and telemetry data |
| `/api/services` | GET | Business service health |
| `/api/discovery` | GET | Discovery jobs + discovered devices |
| `/api/inventory` | GET | Asset register |
| `/api/notifications` | GET/PATCH/POST | Notification management |
