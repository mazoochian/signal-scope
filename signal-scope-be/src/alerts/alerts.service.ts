import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

@Injectable()
export class AlertsService {
  constructor(private readonly db: DbService) {}

  async getAlerts() {
    const { rows } = await this.db.query<{
      id: string; severity: string; kind: string; title: string;
      device_name: string | null; iface: string | null; rule: string | null;
      acknowledged: boolean; root_cause: string; child_count: number;
      fired_at: Date;
    }>(`
      SELECT id, severity, kind, title, device_name, iface, rule,
             acknowledged, root_cause, child_count, fired_at
      FROM alerts
      WHERE cleared_at IS NULL
      ORDER BY
        CASE severity
          WHEN 'Critical' THEN 1 WHEN 'Major' THEN 2
          WHEN 'Minor'    THEN 3 WHEN 'Warning' THEN 4
          ELSE 5
        END,
        fired_at DESC
    `);

    return rows.map((r) => ({
      id:       r.id,
      sev:      r.severity,
      kind:     r.kind,
      title:    r.title,
      device:   r.device_name ?? '—',
      iface:    r.iface       ?? '—',
      rule:     r.rule        ?? '—',
      ack:      r.acknowledged,
      age:      formatAge(r.fired_at),
      rc:       r.root_cause,
      children: r.child_count,
    }));
  }

  async getSummary() {
    const { rows } = await this.db.query<{ severity: string; n: string }>(`
      SELECT severity, COUNT(*) AS n
      FROM alerts WHERE cleared_at IS NULL
      GROUP BY severity
    `);

    const colorMap: Record<string, string> = {
      Critical: 'text-critical', Major: 'text-warning',
      Minor: 'text-info', Warning: 'text-warning', Info: 'text-muted-foreground',
    };
    const order = ['Critical', 'Major', 'Minor', 'Warning', 'Info'];
    const countMap = Object.fromEntries(rows.map((r) => [r.severity, Number(r.n)]));

    return {
      severityCounts: order.map((label) => ({
        label,
        n:     countMap[label] ?? 0,
        color: colorMap[label] ?? 'text-muted-foreground',
      })),
      volumeChart: series(60, 88, 30, 22),
      rootCauseChain: [
        'BGP::Neighbor down · AS65001',
        'ICMP::Loss 100%',
        'Service::Internet-Access degraded',
        'Tunnel::VPN-Site-A down',
        'SLA::ISP-A breach 13s',
      ],
    };
  }

  async getAll() {
    const [alerts, summary] = await Promise.all([
      this.getAlerts(),
      this.getSummary(),
    ]);
    return { alerts, ...summary };
  }
}

function formatAge(firedAt: Date): string {
  const secs = Math.floor((Date.now() - firedAt.getTime()) / 1000);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
}
