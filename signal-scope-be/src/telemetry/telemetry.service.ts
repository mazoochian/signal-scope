import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

@Injectable()
export class TelemetryService {
  constructor(private readonly db: DbService) {}

  async getApps() {
    const { rows } = await this.db.query<{
      app: string; bps: string | null; flows: string; percentage: number;
    }>('SELECT app, bps, flows, percentage FROM telemetry_apps ORDER BY percentage DESC');

    return rows.map((r) => ({
      app:   r.app,
      bps:   r.bps ?? '0 bps',
      flows: Number(r.flows),
      pct:   r.percentage,
    }));
  }

  async getSubscriptions() {
    const { rows } = await this.db.query<{
      device_name: string | null; subscription: string;
      sample_rate: string | null; lag: string | null; is_ok: boolean;
    }>(`
      SELECT ts.device_name, ts.subscription, ts.sample_rate, ts.lag, ts.is_ok
      FROM telemetry_subscriptions ts
      ORDER BY ts.id
    `);

    return rows.map((r) => ({
      device: r.device_name  ?? '—',
      sub:    r.subscription,
      rate:   r.sample_rate  ?? '—',
      lag:    r.lag          ?? '—',
      ok:     r.is_ok,
    }));
  }

  getConversations() {
    return [
      { src: '10.42.18.21',  dst: '52.96.165.244',   app: 'HTTPS',  bytes: '4.2 GB', packets: '3.1M', duration: '02:14:11' },
      { src: '10.42.19.105', dst: '10.3.5.10',        app: 'SMB',    bytes: '2.8 GB', packets: '2.0M', duration: '00:48:22' },
      { src: '172.16.4.88',  dst: 'carrier.voice.net',app: 'RTP',    bytes: '1.4 GB', packets: '1.8M', duration: '04:02:18' },
      { src: '10.99.0.4',    dst: '100.64.0.1',       app: 'BGP',    bytes: '912 MB', packets: '612K', duration: '12:18:42' },
      { src: '192.168.50.2', dst: 'vpn.corp.local',   app: 'IPsec',  bytes: '684 MB', packets: '412K', duration: '08:01:09' },
    ];
  }

  getFlowStats() {
    return [
      { label: 'Flows/sec',   value: '412,184' },
      { label: 'Active conv.', value: '3.4M' },
      { label: 'Bytes/sec',   value: '1.84 GB' },
      { label: 'Drops',       value: '0.002%' },
    ];
  }

  async getAll() {
    const [apps, subscriptions] = await Promise.all([
      this.getApps(),
      this.getSubscriptions(),
    ]);
    return {
      apps,
      conversations: this.getConversations(),
      subscriptions,
      flowStats:      this.getFlowStats(),
      throughputChart: series(120, 91, 8, 3),
    };
  }
}
