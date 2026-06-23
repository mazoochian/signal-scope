-- ─────────────────────────────────────────────────────────────────────────────
-- TIME-SERIES TABLES  (TimescaleDB hypertables, Apache-licensed features only)
-- Compression policies and continuous aggregates require the Timescale
-- community license; they are omitted here so migrations run on the free
-- open-source build shipped in distro packages.
-- ─────────────────────────────────────────────────────────────────────────────

-- Per-device telemetry (CPU, memory, throughput, latency, loss).
-- Written every 2 s by the simulation engine → ~86 400 rows/device/day.
CREATE TABLE device_metrics (
  time             TIMESTAMPTZ     NOT NULL,
  device_id        INTEGER         NOT NULL REFERENCES devices(id),
  cpu_pct          NUMERIC(5,2)    NOT NULL,
  mem_pct          NUMERIC(5,2)    NOT NULL,
  ingress_gbps     NUMERIC(8,4)    NOT NULL,
  egress_gbps      NUMERIC(8,4)    NOT NULL,
  latency_ms       NUMERIC(8,3)    NOT NULL,
  packet_loss_pct  NUMERIC(8,5)    NOT NULL
);

SELECT create_hypertable('device_metrics', 'time', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX ON device_metrics (device_id, time DESC);


-- Per-interface counters (utilization, in/out Mbps, errors).
CREATE TABLE interface_metrics (
  time            TIMESTAMPTZ   NOT NULL,
  interface_id    INTEGER       NOT NULL REFERENCES interfaces(id),
  in_mbps         NUMERIC(10,2) NOT NULL DEFAULT 0,
  out_mbps        NUMERIC(10,2) NOT NULL DEFAULT 0,
  utilization_pct NUMERIC(5,2)  NOT NULL DEFAULT 0,
  error_count     INTEGER       NOT NULL DEFAULT 0
);

SELECT create_hypertable('interface_metrics', 'time', chunk_time_interval => INTERVAL '7 days');
CREATE INDEX ON interface_metrics (interface_id, time DESC);


-- Aggregate WAN throughput series.
CREATE TABLE wan_metrics (
  time            TIMESTAMPTZ  NOT NULL,
  ingress_gbps    NUMERIC(8,4) NOT NULL,
  egress_gbps     NUMERIC(8,4) NOT NULL,
  packet_loss_pct NUMERIC(8,5) NOT NULL DEFAULT 0,
  latency_ms      NUMERIC(8,3) NOT NULL DEFAULT 0
);

SELECT create_hypertable('wan_metrics', 'time', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX ON wan_metrics (time DESC);


-- Syslog / event stream from devices.
CREATE TABLE syslog_messages (
  time        TIMESTAMPTZ NOT NULL DEFAULT now(),
  device_id   INTEGER     REFERENCES devices(id),
  device_name TEXT,
  severity    TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  raw         TEXT
);

SELECT create_hypertable('syslog_messages', 'time', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX ON syslog_messages (device_id, time DESC);
CREATE INDEX ON syslog_messages (severity, time DESC);


-- NetFlow / IPFIX aggregate statistics.
CREATE TABLE flow_stats (
  time                 TIMESTAMPTZ  NOT NULL DEFAULT now(),
  flows_per_sec        BIGINT       NOT NULL DEFAULT 0,
  active_conversations BIGINT       NOT NULL DEFAULT 0,
  bytes_per_sec        BIGINT       NOT NULL DEFAULT 0,
  drop_pct             NUMERIC(8,5) NOT NULL DEFAULT 0
);

SELECT create_hypertable('flow_stats', 'time', chunk_time_interval => INTERVAL '7 days');


-- Alert state-change audit log (for SLA reporting and MTTR analysis).
CREATE TABLE alert_history (
  time        TIMESTAMPTZ NOT NULL DEFAULT now(),
  alert_id    TEXT        NOT NULL,
  severity    TEXT        NOT NULL,
  state       TEXT        NOT NULL,
  device_name TEXT
);

SELECT create_hypertable('alert_history', 'time', chunk_time_interval => INTERVAL '30 days');
CREATE INDEX ON alert_history (alert_id, time DESC);
