import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

@Injectable()
export class OverviewService {
  constructor(private readonly db: DbService) {}

  // Stats and WAN chart still come from the SimulationService via the controller.
  // This service handles the DB-backed sections.

  async getAlerts() {
    const { rows } = await this.db.query<{
      id: string; severity: string; kind: string; title: string;
      device_name: string | null; root_cause: string; fired_at: Date;
    }>(`
      SELECT id, severity, kind, title, device_name, root_cause, fired_at
      FROM alerts
      WHERE cleared_at IS NULL
      ORDER BY
        CASE severity
          WHEN 'Critical' THEN 1 WHEN 'Major' THEN 2
          WHEN 'Minor'    THEN 3 WHEN 'Warning' THEN 4
          ELSE 5
        END,
        fired_at DESC
      LIMIT 6
    `);

    const sevAbbr: Record<string, string> = {
      Critical: 'CRIT', Major: 'MAJ', Minor: 'MIN', Warning: 'WARN', Info: 'INFO',
    };
    return rows.map((r, i) => ({
      id:     i + 1,
      sev:    sevAbbr[r.severity] ?? r.severity,
      kind:   r.kind,
      title:  r.title,
      device: r.device_name ?? '—',
      ago:    formatAgo(r.fired_at),
      rc:     r.root_cause,
    }));
  }

  async getSites() {
    const { rows } = await this.db.query<{ display_name: string }>(
      'SELECT display_name FROM sites ORDER BY id',
    );
    return rows.map((r, i) => ({
      name:  r.display_name,
      avail: [99.99, 99.97, 99.92, 99.84, 99.78, 98.42][i] ?? 99.9,
      heat:  series(40, 31 + i, 60 + i * 5, 25 - i * 2),
    }));
  }

  async getServices() {
    const { rows } = await this.db.query<{
      name: string; status: string; path: string | null;
      mos: string | null; loss_pct: string | null; jitter: string | null;
    }>(`
      SELECT name, status, path, mos, loss_pct, jitter
      FROM services
      ORDER BY id
      LIMIT 4
    `);

    return rows.map((s, i) => ({
      name:   s.name,
      kind:   s.status,
      status: s.status === 'up' ? 'Healthy' : s.status === 'down' ? 'Down' : 'Degraded',
      path:   s.path    ?? '—',
      mos:    s.mos     ?? '—',
      loss:   s.loss_pct ?? '—',
      jitter: s.jitter  ?? '—',
      trend:  series(30, 51 + i, 80, 15),
    }));
  }

  async getLogs() {
    const { rows } = await this.db.query<{
      time: Date; severity: string; message: string;
    }>(`
      SELECT time, severity, message
      FROM syslog_messages
      ORDER BY time DESC
      LIMIT 9
    `);

    const sevColor: Record<string, string> = {
      INFO: 'text-info', WARN: 'text-warning',
      CRIT: 'text-critical', MAJ: 'text-warning',
    };
    return rows.map((r) => ({
      t:        r.time.toTimeString().slice(0, 8),
      sev:      r.severity,
      sevColor: sevColor[r.severity] ?? 'text-muted-foreground',
      msg:      r.message,
    }));
  }

  getTalkers() {
    return [
      { src: '10.42.18.21',  app: 'HTTPS',  mbps: '842.1' },
      { src: '10.42.19.105', app: 'SMB',    mbps: '611.3' },
      { src: '172.16.4.88',  app: 'RTP',    mbps: '402.7' },
      { src: '10.42.7.13',   app: 'Backup', mbps: '318.9' },
      { src: '10.99.0.4',    app: 'BGP',    mbps: '212.5' },
      { src: '192.168.50.2', app: 'VPN',    mbps: '184.0' },
    ];
  }

  async getAll(simStats: unknown, simWan: unknown) {
    const [alerts, sites, services, logs] = await Promise.all([
      this.getAlerts(),
      this.getSites(),
      this.getServices(),
      this.getLogs(),
    ]);
    return {
      stats:    simStats,
      wanChart: simWan,
      alerts,
      sites,
      talkers:  this.getTalkers(),
      services,
      logs,
    };
  }
}

function formatAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  return `${Math.floor(secs / 3600)}h`;
}
