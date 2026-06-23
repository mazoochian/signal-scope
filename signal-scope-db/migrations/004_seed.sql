-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA  (mirrors current in-memory backend data)
-- ─────────────────────────────────────────────────────────────────────────────

-- Sites
INSERT INTO sites (name, display_name) VALUES
  ('HQ-NYC', 'HQ — New York'),
  ('DCA',    'DC — Ashburn'),
  ('LAX',    'Campus — Austin'),
  ('SEA',    'Edge — Seattle'),
  ('FRA',    'Edge — Frankfurt'),
  ('SIN',    'POP — Singapore'),
  ('LIM',    'Branch — Lima');

-- Devices
INSERT INTO devices (name, ip, vendor, model, role, site_id, status, icon, up_since) VALUES
  ('core-sw-01',      '10.0.10.2',  'Cisco',     'C9500-48Y4C',   'core-switch',        (SELECT id FROM sites WHERE name='HQ-NYC'), 'up',   'server', now() - INTERVAL '312 days'),
  ('core-sw-02',      '10.0.10.3',  'Cisco',     'C9500-48Y4C',   'core-switch',        (SELECT id FROM sites WHERE name='HQ-NYC'), 'up',   'server', now() - INTERVAL '188 days'),
  ('edge-rtr-nyc-01', '10.0.0.1',   'Juniper',   'MX204',         'edge-router',        (SELECT id FROM sites WHERE name='HQ-NYC'), 'down', 'router', NULL),
  ('edge-rtr-nyc-02', '10.0.0.2',   'Juniper',   'MX204',         'edge-router',        (SELECT id FROM sites WHERE name='HQ-NYC'), 'up',   'router', now() - INTERVAL '412 days'),
  ('agg-rtr-lax-01',  '10.1.0.1',   'Arista',    '7280SR3',       'aggregation-router', (SELECT id FROM sites WHERE name='LAX'),    'warn', 'router', now() - INTERVAL '94 days'),
  ('fw-edge-sea-01',  '10.2.0.1',   'Palo Alto', 'PA-5430',       'firewall',           (SELECT id FROM sites WHERE name='SEA'),    'warn', 'shield', now() - INTERVAL '61 days'),
  ('acc-sw-hq-09',    '10.0.21.9',  'Cisco',     'C9300-48UXM',   'access-switch',      (SELECT id FROM sites WHERE name='HQ-NYC'), 'warn', 'server', now() - INTERVAL '240 days'),
  ('acc-sw-dc-10',    '10.3.21.10', 'Arista',    '7050SX3',       'access-switch',      (SELECT id FROM sites WHERE name='DCA'),    'up',   'server', now() - INTERVAL '521 days'),
  ('wlc-hq-01',       '10.0.40.5',  'Cisco',     'C9800-CL',      'wlc',                (SELECT id FROM sites WHERE name='HQ-NYC'), 'up',   'wifi',   now() - INTERVAL '199 days'),
  ('core-sw-fra-01',  '10.5.10.2',  'Nokia',     '7750-SR-1',     'core-switch',        (SELECT id FROM sites WHERE name='FRA'),    'up',   'server', now() - INTERVAL '289 days');

-- Interfaces (for core-sw-01 as representative)
WITH d AS (SELECT id FROM devices WHERE name = 'core-sw-01')
INSERT INTO interfaces (device_id, name, description, speed, duplex, vlan, status) VALUES
  ((SELECT id FROM d), 'Te1/0/1',  'uplink agg-01',    '10G', 'full', 'trunk', 'up'),
  ((SELECT id FROM d), 'Te1/0/2',  'uplink agg-02',    '10G', 'full', 'trunk', 'up'),
  ((SELECT id FROM d), 'Gi0/3',    'mgmt OOB',         '1G',  'full', '99',    'up'),
  ((SELECT id FROM d), 'Te1/0/24', 'spine→leaf-09',    '10G', 'full', 'trunk', 'warn'),
  ((SELECT id FROM d), 'Gi0/5',    'trunk vlan100-300', '1G', 'full', 'trunk', 'up'),
  ((SELECT id FROM d), 'Te1/1/49', 'ISP-A handoff',    '10G', 'full', 'wan-100','up'),
  ((SELECT id FROM d), 'Gi0/7',    'unused',            '1G', 'full', '—',     'down'),
  ((SELECT id FROM d), 'Te1/0/12', 'leaf→leaf',        '10G', 'full', 'trunk', 'warn'),
  ((SELECT id FROM d), 'Gi0/9',    'reserved',          '1G', 'full', '—',     'down'),
  ((SELECT id FROM d), 'Te2/0/1',  'backup-cluster',   '10G', 'full', '30',    'up'),
  ((SELECT id FROM d), 'Gi0/11',   'mgmt',              '1G', 'full', '99',    'up'),
  ((SELECT id FROM d), 'Te2/0/2',  'peer-link',        '10G', 'full', 'trunk', 'up'),
  ((SELECT id FROM d), 'Gi0/13',   'unused',            '1G', 'full', '—',     'down'),
  ((SELECT id FROM d), 'Te1/1/50', 'leaf→spine',       '10G', 'full', 'trunk', 'up');

-- Alerts  (active, not cleared)
INSERT INTO alerts (id, severity, kind, title, device_name, device_id, iface, rule, acknowledged, root_cause, child_count, fired_at) VALUES
  ('ALR-90213', 'Critical', 'down', 'BGP session DOWN to AS65001',         'edge-rtr-nyc-01', (SELECT id FROM devices WHERE name='edge-rtr-nyc-01'), 'Gi0/2',    'BGP::Neighbor',   false, 'ROOT',  5, now() - INTERVAL '2 minutes'),
  ('ALR-90212', 'Critical', 'down', 'Device unreachable (ICMP + SNMP)',    'edge-rtr-nyc-01', (SELECT id FROM devices WHERE name='edge-rtr-nyc-01'), '—',        'ICMP::Loss>50%',  false, 'CHILD', 0, now() - INTERVAL '2 minutes 18 seconds'),
  ('ALR-90211', 'Critical', 'down', 'Interface flap storm',                'core-sw-dca-02',  NULL,                                                  'Te1/0/24', 'IF::Flap>5/min',  false, '—',     0, now() - INTERVAL '4 minutes 51 seconds'),
  ('ALR-90209', 'Major',    'warn', 'CPU sustained > 85% for 10m',         'agg-rtr-lax-01',  (SELECT id FROM devices WHERE name='agg-rtr-lax-01'),  '—',        'CPU::Sustained',  true,  '—',     0, now() - INTERVAL '11 minutes 2 seconds'),
  ('ALR-90207', 'Major',    'warn', 'PoE budget 92% on stack-3',           'acc-sw-hq-09',    (SELECT id FROM devices WHERE name='acc-sw-hq-09'),    'stack-3',  'POE::Budget',     false, '—',     0, now() - INTERVAL '17 minutes 44 seconds'),
  ('ALR-90205', 'Major',    'warn', 'Optic Rx low (-18.2 dBm)',            'core-sw-fra-01',  (SELECT id FROM devices WHERE name='core-sw-fra-01'),  'Te1/49',   'DOM::Rx',         false, '—',     0, now() - INTERVAL '44 minutes 1 second'),
  ('ALR-90202', 'Minor',    'info', 'Config drift vs baseline',            'fw-edge-sea-01',  (SELECT id FROM devices WHERE name='fw-edge-sea-01'),  '—',        'CFG::Drift',      true,  '—',     0, now() - INTERVAL '32 minutes 18 seconds'),
  ('ALR-90198', 'Warning',  'warn', 'OSPF adjacency flap x3 in 5m',       'agg-rtr-lax-01',  (SELECT id FROM devices WHERE name='agg-rtr-lax-01'),  'Gi0/1',    'OSPF::AdjFlap',   false, '—',     0, now() - INTERVAL '1 hour 2 minutes 33 seconds'),
  ('ALR-90194', 'Info',     'info', 'Maintenance window started',          'site:LAX',        NULL,                                                  '—',        'MW::Started',     true,  '—',     0, now() - INTERVAL '2 hours');

-- Alert history (initial fire events)
INSERT INTO alert_history (time, alert_id, severity, state, device_name) VALUES
  (now() - INTERVAL '2 minutes',          'ALR-90213', 'Critical', 'fired',        'edge-rtr-nyc-01'),
  (now() - INTERVAL '2 minutes 18 seconds','ALR-90212', 'Critical', 'fired',        'edge-rtr-nyc-01'),
  (now() - INTERVAL '4 minutes 51 seconds','ALR-90211', 'Critical', 'fired',        'core-sw-dca-02'),
  (now() - INTERVAL '11 minutes 2 seconds','ALR-90209', 'Major',    'fired',        'agg-rtr-lax-01'),
  (now() - INTERVAL '10 minutes',          'ALR-90209', 'Major',    'acknowledged', 'agg-rtr-lax-01'),
  (now() - INTERVAL '17 minutes 44 seconds','ALR-90207', 'Major',   'fired',        'acc-sw-hq-09'),
  (now() - INTERVAL '44 minutes 1 second', 'ALR-90205', 'Major',    'fired',        'core-sw-fra-01'),
  (now() - INTERVAL '32 minutes 18 seconds','ALR-90202', 'Minor',   'fired',        'fw-edge-sea-01'),
  (now() - INTERVAL '30 minutes',          'ALR-90202', 'Minor',    'acknowledged', 'fw-edge-sea-01'),
  (now() - INTERVAL '62 minutes 33 seconds','ALR-90198', 'Warning', 'fired',        'agg-rtr-lax-01'),
  (now() - INTERVAL '2 hours',             'ALR-90194', 'Info',     'fired',        'site:LAX'),
  (now() - INTERVAL '115 minutes',         'ALR-90194', 'Info',     'acknowledged', 'site:LAX');

-- Services
INSERT INTO services (name, owner, sla_pct, health_pct, status, path, mos, loss_pct, jitter) VALUES
  ('Corporate Internet',     'Network',       99.95, 99.99, 'up',   'core-rtr → fw-edge → ISP-A',    '—',   '0.01%', '1.2ms'),
  ('Voice (SIP/RTP)',        'Unified Comm',  99.90, 98.42, 'warn', 'sbc-01 → core-sw → carrier',    '4.1', '0.4%',  '9.8ms'),
  ('Datacenter East/West',   'DC Ops',        99.99, 100.0, 'up',   'spine ←→ leaf · VXLAN',         '—',   '0.00%', '0.3ms'),
  ('Guest Wi-Fi',            'Workplace',     99.50, 99.91, 'up',   'wlc → ap-fleet → fw-guest',     '—',   '0.02%', '2.1ms'),
  ('VPN — Remote Workforce', 'Security',      99.90, 99.74, 'up',   'fw-edge-01 → radius-01 → ad',   '—',   '0.01%', '4.2ms'),
  ('B2B EDI Link',           'Apps',          99.80, 96.21, 'down', 'mpls-link-NYC-ATL → sftp-edi',  '—',   '3.79%', '28ms');

INSERT INTO service_dependencies (service_id, dependency) VALUES
  ((SELECT id FROM services WHERE name='Corporate Internet'),     'core-rtr-01'),
  ((SELECT id FROM services WHERE name='Corporate Internet'),     'fw-edge-01'),
  ((SELECT id FROM services WHERE name='Corporate Internet'),     'ISP-A'),
  ((SELECT id FROM services WHERE name='Voice (SIP/RTP)'),       'sbc-01'),
  ((SELECT id FROM services WHERE name='Voice (SIP/RTP)'),       'core-sw-01'),
  ((SELECT id FROM services WHERE name='Voice (SIP/RTP)'),       'Carrier-Voice'),
  ((SELECT id FROM services WHERE name='Datacenter East/West'),  'spine-01'),
  ((SELECT id FROM services WHERE name='Datacenter East/West'),  'spine-02'),
  ((SELECT id FROM services WHERE name='Datacenter East/West'),  'leaf-fleet'),
  ((SELECT id FROM services WHERE name='Guest Wi-Fi'),           'wlc-hq-01'),
  ((SELECT id FROM services WHERE name='Guest Wi-Fi'),           'ap-fleet'),
  ((SELECT id FROM services WHERE name='Guest Wi-Fi'),           'fw-guest-01'),
  ((SELECT id FROM services WHERE name='VPN — Remote Workforce'),'fw-edge-01'),
  ((SELECT id FROM services WHERE name='VPN — Remote Workforce'),'radius-01'),
  ((SELECT id FROM services WHERE name='VPN — Remote Workforce'),'ad-prod'),
  ((SELECT id FROM services WHERE name='B2B EDI Link'),          'mpls-link-NYC-ATL'),
  ((SELECT id FROM services WHERE name='B2B EDI Link'),          'router-edi-01'),
  ((SELECT id FROM services WHERE name='B2B EDI Link'),          'sftp-edi-prod');

-- Topology nodes
INSERT INTO topology_nodes (id, label, kind, status, x, y, device_id) VALUES
  ('isp-a',  'ISP-A · AS65001',      'wan',    'up',   80,   80,  NULL),
  ('isp-b',  'ISP-B · AS65002',      'wan',    'warn', 80,   460, NULL),
  ('fw1',    'fw-edge-01',            'fw',     'up',   260,  80,  NULL),
  ('fw2',    'fw-edge-02',            'fw',     'up',   260,  460, NULL),
  ('er1',    'edge-rtr-nyc-01',       'router', 'down', 440,  80,  (SELECT id FROM devices WHERE name='edge-rtr-nyc-01')),
  ('er2',    'edge-rtr-nyc-02',       'router', 'up',   440,  460, (SELECT id FROM devices WHERE name='edge-rtr-nyc-02')),
  ('core1',  'core-sw-01',            'core',   'up',   640,  200, (SELECT id FROM devices WHERE name='core-sw-01')),
  ('core2',  'core-sw-02',            'core',   'up',   640,  340, (SELECT id FROM devices WHERE name='core-sw-02')),
  ('agg1',   'agg-sw-hq-01',          'agg',    'up',   860,  120, NULL),
  ('agg2',   'agg-sw-hq-02',          'agg',    'warn', 860,  270, NULL),
  ('agg3',   'agg-sw-dc-01',          'agg',    'up',   860,  420, NULL),
  ('acc1',   'acc-sw-fl3-01',         'access', 'up',   1060, 60,  NULL),
  ('acc2',   'acc-sw-fl3-02',         'access', 'up',   1060, 160, NULL),
  ('acc3',   'acc-sw-fl4-01',         'access', 'warn', 1060, 260, NULL),
  ('acc4',   'acc-sw-dc-09',          'access', 'up',   1060, 360, NULL),
  ('acc5',   'acc-sw-dc-10',          'access', 'up',   1060, 460, (SELECT id FROM devices WHERE name='acc-sw-dc-10')),
  ('ap1',    'ap-fleet · 184',        'ap',     'up',   1220, 110, NULL),
  ('ap2',    'ap-fleet · 96',         'ap',     'up',   1220, 410, NULL);

-- Topology edges
INSERT INTO topology_edges (from_node, to_node, utilization, status) VALUES
  ('isp-a',  'fw1',   62, 'up'),
  ('isp-b',  'fw2',   31, 'warn'),
  ('fw1',    'er1',   58, 'down'),
  ('fw2',    'er2',   27, 'up'),
  ('er1',    'core1', 72, 'up'),
  ('er2',    'core2', 41, 'up'),
  ('core1',  'core2', 18, 'up'),
  ('core1',  'agg1',  51, 'up'),
  ('core1',  'agg2',  67, 'up'),
  ('core2',  'agg2',  33, 'up'),
  ('core2',  'agg3',  44, 'up'),
  ('agg1',   'acc1',  22, 'up'),
  ('agg1',   'acc2',  35, 'up'),
  ('agg2',   'acc3',  81, 'warn'),
  ('agg3',   'acc4',  12, 'up'),
  ('agg3',   'acc5',  16, 'up'),
  ('acc2',   'ap1',   24, 'up'),
  ('acc4',   'ap2',   19, 'up');

-- Inventory assets
INSERT INTO inventory_assets (serial_number, device_id, host_name, model, vendor, site_id, rack, os_version, purchased_at, warranty_expires_at, end_of_support_at) VALUES
  ('FOC2412G1AB', (SELECT id FROM devices WHERE name='core-sw-01'),      'core-sw-01',      'C9500-48Y4C',    'Cisco',     (SELECT id FROM sites WHERE name='HQ-NYC'), 'R3-U18', 'IOS-XE 17.12.03a', '2022-08-14', '2027-08-14', '2032-01-31'),
  ('FOC2401G7XY', (SELECT id FROM devices WHERE name='core-sw-02'),      'core-sw-02',      'C9500-48Y4C',    'Cisco',     (SELECT id FROM sites WHERE name='HQ-NYC'), 'R3-U20', 'IOS-XE 17.12.03a', '2022-08-14', '2027-08-14', '2032-01-31'),
  ('JN12A1B3CDX', (SELECT id FROM devices WHERE name='edge-rtr-nyc-01'), 'edge-rtr-nyc-01', 'MX204',          'Juniper',   (SELECT id FROM sites WHERE name='HQ-NYC'), 'R2-U06', 'Junos 22.4R3-S2',  '2021-03-02', '2026-03-02', '2029-12-31'),
  ('AR9091872Q',  (SELECT id FROM devices WHERE name='acc-sw-dc-10'),    'acc-sw-dc-10',    '7050SX3-48YC8',  'Arista',    (SELECT id FROM sites WHERE name='DCA'),    'D4-U22', 'EOS 4.30.2F',      '2020-11-20', '2025-11-20', '2028-06-30'),
  ('PA-S540093',  (SELECT id FROM devices WHERE name='fw-edge-sea-01'),  'fw-edge-sea-01',  'PA-5430',        'Palo Alto', (SELECT id FROM sites WHERE name='SEA'),    'S1-U08', 'PAN-OS 11.1.2',    '2023-04-01', '2028-04-01', '2030-12-31'),
  ('NK77501192',  (SELECT id FROM devices WHERE name='core-sw-fra-01'),  'core-sw-fra-01',  '7750-SR-1',      'Nokia',     (SELECT id FROM sites WHERE name='FRA'),    'F2-U12', 'SR OS 23.10.R3',   '2019-06-12', '2024-06-12', '2026-12-31');

-- Notifications
INSERT INTO notifications (level, source, title, detail, is_read, created_at) VALUES
  ('crit', 'device', 'BGP session down to AS65001',              'edge-rtr-nyc-01 · Gi0/2',                           false, now() - INTERVAL '4 minutes'),
  ('crit', 'device', 'Interface flap storm detected',            'core-sw-dca-02',                                     false, now() - INTERVAL '4 minutes 4 seconds'),
  ('maj',  'device', 'CPU sustained > 85%',                     'agg-rtr-lax-01',                                     false, now() - INTERVAL '14 minutes 56 seconds'),
  ('maj',  'device', 'PoE budget at 92% on stack-3',            'acc-sw-hq-09',                                       false, now() - INTERVAL '20 minutes 42 seconds'),
  ('warn', 'device', 'Optic Rx power low (−18.2 dBm)',          'core-sw-fra-01 · Te1/49',                            false, now() - INTERVAL '47 minutes 53 seconds'),
  ('warn', 'device', 'Config drift detected vs baseline',        'fw-edge-sea-01',                                     false, now() - INTERVAL '35 minutes 38 seconds'),
  ('info', 'app',    'Discovery scan complete',                   '2 new neighbors via LLDP · acc-sw-hq-09',           true,  now() - INTERVAL '3 minutes 5 seconds'),
  ('info', 'app',    'Collector poll cycle finished',             '412 devices · 3.8 s · collector-eu-01',             true,  now() - INTERVAL '3 minutes 8 seconds'),
  ('info', 'app',    'Scheduled report generated',               'Weekly SLA summary · emailed to ops@corp',           true,  now() - INTERVAL '2 hours');

-- Wireless SSIDs
INSERT INTO wireless_ssids (ssid, color) VALUES
  ('corp',     'primary'),
  ('corp-iot', 'cyan'),
  ('guest',    'warning'),
  ('voice',    'success');

-- Wireless APs (12 HQ APs)
INSERT INTO wireless_access_points (name, site_id, ssid_id, channel_24, channel_5, rssi_dbm, utilization, client_count, status) VALUES
  ('ap-hq-fl1-11', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp'),     1,  36,  -52, 22, 12, 'up'),
  ('ap-hq-fl2-12', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp-iot'), 6,  40,  -61, 45, 28, 'up'),
  ('ap-hq-fl3-13', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='guest'),    11, 44,  -58, 18,  4, 'up'),
  ('ap-hq-fl4-14', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp'),     1,  48,  -49, 61, 33, 'up'),
  ('ap-hq-fl1-15', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp-iot'), 6,  149, -67, 12, 17, 'up'),
  ('ap-hq-fl2-16', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='guest'),    11, 153, -73, 82, 42, 'warn'),
  ('ap-hq-fl3-17', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp'),     1,  157, -55, 31,  9, 'up'),
  ('ap-hq-fl4-18', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp-iot'), 6,  36,  -60, 28, 21, 'up'),
  ('ap-hq-fl1-19', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='guest'),    11, 40,  -72,  9,  5, 'up'),
  ('ap-hq-fl2-20', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp'),     1,  44,  -51, 55, 38, 'up'),
  ('ap-hq-fl3-21', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='corp-iot'), 6,  48,  -64, 40, 11, 'up'),
  ('ap-hq-fl4-22', (SELECT id FROM sites WHERE name='HQ-NYC'), (SELECT id FROM wireless_ssids WHERE ssid='guest'),    11, 149, -69, 73, 29, 'warn');

-- Discovery jobs
INSERT INTO discovery_jobs (name, method, subnet, status, progress_pct, devices_found, new_devices, started_at) VALUES
  ('HQ-NYC · 10.0.0.0/16', 'SNMP+LLDP',            '10.0.0.0/16', 'running',  78,  412, 3,  now() - INTERVAL '12 minutes'),
  ('DCA · 10.3.0.0/16',    'SNMP+CDP',              '10.3.0.0/16', 'complete', 100, 318, 0,  now() - INTERVAL '2 hours'),
  ('LAX · 10.1.0.0/16',    'ICMP sweep + SNMPv3',   '10.1.0.0/16', 'running',  42,  88,  11, now() - INTERVAL '8 minutes'),
  ('FRA · 10.5.0.0/16',    'SNMP+LLDP',             '10.5.0.0/16', 'running',  21,  18,  18, now() - INTERVAL '3 minutes');

INSERT INTO discovered_devices (ip, hostname, vendor, status, job_id, discovered_at) VALUES
  ('10.5.21.18', 'acc-sw-fra-18', 'Arista',     'up',   (SELECT id FROM discovery_jobs WHERE name LIKE '%FRA%'), now() - INTERVAL '2 minutes'),
  ('10.5.21.19', 'acc-sw-fra-19', 'Arista',     'up',   (SELECT id FROM discovery_jobs WHERE name LIKE '%FRA%'), now() - INTERVAL '4 minutes'),
  ('10.1.40.4',  'ap-lax-fl2-04', 'Cisco',      'up',   (SELECT id FROM discovery_jobs WHERE name LIKE '%LAX%'), now() - INTERVAL '11 minutes'),
  ('10.0.50.9',  'sbc-prod-09',   'AudioCodes', 'warn', (SELECT id FROM discovery_jobs WHERE name LIKE '%HQ%'),  now() - INTERVAL '22 minutes'),
  ('10.3.21.41', 'acc-sw-dc-41',  'Arista',     'up',   (SELECT id FROM discovery_jobs WHERE name LIKE '%DCA%'), now() - INTERVAL '38 minutes');

-- Telemetry apps
INSERT INTO telemetry_apps (app, bps, flows, percentage) VALUES
  ('HTTPS',     '4.21 Gbps',  184213, 41),
  ('SMB/CIFS',  '1.84 Gbps',   9214,  18),
  ('RTP',       '1.12 Gbps',    612,  11),
  ('Backup',    '988 Mbps',      88,  10),
  ('Office365', '612 Mbps',   24112,   6),
  ('DNS',       '121 Mbps',   84221,   4),
  ('Other',     '942 Mbps',   41202,  10);

-- Telemetry subscriptions
INSERT INTO telemetry_subscriptions (device_id, device_name, subscription, sample_rate, lag, is_ok) VALUES
  ((SELECT id FROM devices WHERE name='core-sw-01'),      'core-sw-01',      'openconfig-interfaces', '1s',       '0.04s', true),
  ((SELECT id FROM devices WHERE name='core-sw-02'),      'core-sw-02',      'openconfig-platform',   '5s',       '0.12s', true),
  ((SELECT id FROM devices WHERE name='edge-rtr-nyc-02'), 'edge-rtr-nyc-02', 'openconfig-bgp',        'on-change','—',     true),
  ((SELECT id FROM devices WHERE name='agg-rtr-lax-01'),  'agg-rtr-lax-01',  'cisco-ios-xe-cpu',      '10s',      '2.4s',  false),
  ((SELECT id FROM devices WHERE name='acc-sw-dc-10'),    'acc-sw-dc-10',    'openconfig-system',     '30s',      '0.18s', true);

-- Syslog seed messages
INSERT INTO syslog_messages (time, device_id, device_name, severity, message) VALUES
  (now() - INTERVAL '4 minutes 3 seconds',  (SELECT id FROM devices WHERE name='edge-rtr-nyc-01'), 'edge-rtr-nyc-01', 'INFO', 'BGP neighbor 10.0.0.5 Established'),
  (now() - INTERVAL '4 minutes 6 seconds',  (SELECT id FROM devices WHERE name='core-sw-01'),      'core-sw-dca-02',  'WARN', '%LINEPROTO-5-UPDOWN Te1/0/24 down'),
  (now() - INTERVAL '4 minutes 9 seconds',  (SELECT id FROM devices WHERE name='agg-rtr-lax-01'),  'agg-rtr-lax-01',  'CRIT', '%SYS-2-CPU_HOG sustained > 85%'),
  (now() - INTERVAL '4 minutes 12 seconds', (SELECT id FROM devices WHERE name='wlc-hq-01'),       'wlc-hq-01',       'INFO', 'client e4:5f:01:.. joined SSID corp'),
  (now() - INTERVAL '4 minutes 15 seconds', (SELECT id FROM devices WHERE name='fw-edge-sea-01'),  'fw-edge-sea-01',  'INFO', 'SSL VPN session start user=t.young'),
  (now() - INTERVAL '4 minutes 19 seconds', (SELECT id FROM devices WHERE name='core-sw-fra-01'),  'core-sw-fra-01',  'WARN', 'optic Te1/49 rx_power=-18.2dBm'),
  (now() - INTERVAL '4 minutes 22 seconds', NULL,                                                   'collector-eu-01', 'INFO', 'poll cycle complete 412 devices 3.8s'),
  (now() - INTERVAL '4 minutes 25 seconds', (SELECT id FROM devices WHERE name='acc-sw-hq-09'),    'acc-sw-hq-09',    'INFO', 'discovery: 2 new neighbors via LLDP'),
  (now() - INTERVAL '4 minutes 28 seconds', (SELECT id FROM devices WHERE name='acc-sw-hq-09'),    'acc-sw-hq-09',    'MAJ',  'PoE budget at 92% (732W / 800W)');
