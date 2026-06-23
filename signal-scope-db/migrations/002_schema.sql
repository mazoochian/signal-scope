-- ─────────────────────────────────────────────────────────────────────────────
-- SITES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE sites (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,          -- 'HQ-NYC', 'LAX', 'DCA'
  display_name TEXT NOT NULL,                  -- 'HQ — New York'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- DEVICES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE devices (
  id         SERIAL PRIMARY KEY,
  name       CITEXT NOT NULL UNIQUE,           -- 'core-sw-01'
  ip         INET NOT NULL,
  vendor     TEXT,
  model      TEXT,
  role       TEXT,                             -- 'core-switch', 'edge-router', …
  site_id    INTEGER REFERENCES sites(id),
  status     TEXT NOT NULL DEFAULT 'unknown',  -- 'up', 'down', 'warn', 'unknown'
  icon       TEXT NOT NULL DEFAULT 'server',   -- 'server', 'router', 'wifi', 'shield'
  up_since   TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_devices_site    ON devices(site_id);
CREATE INDEX idx_devices_status  ON devices(status);
CREATE INDEX idx_devices_role    ON devices(role);

-- ─────────────────────────────────────────────────────────────────────────────
-- INTERFACES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE interfaces (
  id          SERIAL PRIMARY KEY,
  device_id   INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                  -- 'Te1/0/1', 'Gi0/3'
  description TEXT,
  speed       TEXT,                           -- '10G', '1G'
  duplex      TEXT NOT NULL DEFAULT 'full',
  vlan        TEXT,
  status      TEXT NOT NULL DEFAULT 'unknown',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(device_id, name)
);

CREATE INDEX idx_interfaces_device ON interfaces(device_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ALERTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE alerts (
  id           TEXT PRIMARY KEY,              -- 'ALR-90213'
  severity     TEXT NOT NULL,                 -- 'Critical', 'Major', 'Minor', 'Warning', 'Info'
  kind         TEXT NOT NULL,                 -- 'down', 'warn', 'info'
  title        TEXT NOT NULL,
  device_name  TEXT,
  device_id    INTEGER REFERENCES devices(id),
  iface        TEXT,
  rule         TEXT,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  root_cause   TEXT NOT NULL DEFAULT '—',     -- 'ROOT', 'CHILD', '—'
  child_count  INTEGER NOT NULL DEFAULT 0,
  fired_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  cleared_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_device    ON alerts(device_id);
CREATE INDEX idx_alerts_severity  ON alerts(severity);
CREATE INDEX idx_alerts_cleared   ON alerts(cleared_at) WHERE cleared_at IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- SERVICES  (business / application services)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  owner       TEXT,
  sla_pct     NUMERIC(6,3) NOT NULL DEFAULT 99.9,
  health_pct  NUMERIC(6,3) NOT NULL DEFAULT 100.0,
  status      TEXT NOT NULL DEFAULT 'up',    -- 'up', 'warn', 'down'
  path        TEXT,                           -- human-readable hop description
  mos         TEXT,
  loss_pct    TEXT,
  jitter      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE service_dependencies (
  id          SERIAL PRIMARY KEY,
  service_id  INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  dependency  TEXT NOT NULL                   -- device name or link
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TOPOLOGY
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE topology_nodes (
  id        TEXT PRIMARY KEY,                 -- 'core1', 'fw1'
  label     TEXT NOT NULL,
  kind      TEXT NOT NULL,                    -- 'wan', 'fw', 'router', 'core', 'agg', 'access', 'ap'
  status    TEXT NOT NULL DEFAULT 'up',
  x         INTEGER,
  y         INTEGER,
  device_id INTEGER REFERENCES devices(id)
);

CREATE TABLE topology_edges (
  id            SERIAL PRIMARY KEY,
  from_node     TEXT NOT NULL REFERENCES topology_nodes(id),
  to_node       TEXT NOT NULL REFERENCES topology_nodes(id),
  utilization   INTEGER NOT NULL DEFAULT 0,  -- percent 0-100
  status        TEXT NOT NULL DEFAULT 'up',
  UNIQUE(from_node, to_node)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- INVENTORY / ASSETS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE inventory_assets (
  id                   SERIAL PRIMARY KEY,
  serial_number        TEXT NOT NULL UNIQUE,
  device_id            INTEGER REFERENCES devices(id),
  host_name            TEXT,
  model                TEXT,
  vendor               TEXT,
  site_id              INTEGER REFERENCES sites(id),
  rack                 TEXT,
  os_version           TEXT,
  purchased_at         DATE,
  warranty_expires_at  DATE,
  end_of_support_at    DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  level      TEXT NOT NULL,                  -- 'crit', 'maj', 'warn', 'info'
  source     TEXT NOT NULL,                  -- 'device', 'app'
  title      TEXT NOT NULL,
  detail     TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ─────────────────────────────────────────────────────────────────────────────
-- WIRELESS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE wireless_ssids (
  id    SERIAL PRIMARY KEY,
  ssid  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT 'primary'       -- display color token
);

CREATE TABLE wireless_access_points (
  id           SERIAL PRIMARY KEY,
  name         CITEXT NOT NULL UNIQUE,        -- 'ap-hq-fl1-11'
  device_id    INTEGER REFERENCES devices(id),
  site_id      INTEGER REFERENCES sites(id),
  ssid_id      INTEGER REFERENCES wireless_ssids(id),
  channel_24   INTEGER,
  channel_5    INTEGER,
  rssi_dbm     INTEGER,
  utilization  INTEGER NOT NULL DEFAULT 0,   -- percent 0-100
  client_count INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'up',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ap_site   ON wireless_access_points(site_id);
CREATE INDEX idx_ap_status ON wireless_access_points(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- DISCOVERY
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE discovery_jobs (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  method       TEXT,                          -- 'SNMP+LLDP', 'ICMP sweep + SNMPv3'
  subnet       CIDR,
  status       TEXT NOT NULL DEFAULT 'running',
  progress_pct INTEGER NOT NULL DEFAULT 0,
  devices_found INTEGER NOT NULL DEFAULT 0,
  new_devices  INTEGER NOT NULL DEFAULT 0,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE discovered_devices (
  id            SERIAL PRIMARY KEY,
  ip            INET NOT NULL,
  hostname      TEXT,
  vendor        TEXT,
  status        TEXT NOT NULL DEFAULT 'up',
  job_id        INTEGER REFERENCES discovery_jobs(id),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TELEMETRY
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE telemetry_apps (
  id         SERIAL PRIMARY KEY,
  app        TEXT NOT NULL UNIQUE,
  bps        TEXT,
  flows      BIGINT NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE telemetry_subscriptions (
  id          SERIAL PRIMARY KEY,
  device_id   INTEGER REFERENCES devices(id),
  device_name TEXT,
  subscription TEXT NOT NULL,
  sample_rate TEXT,
  lag         TEXT,
  is_ok       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
