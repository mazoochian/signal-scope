import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

@Injectable()
export class WirelessService {
  constructor(private readonly db: DbService) {}

  async getAccessPoints() {
    const { rows } = await this.db.query<{
      name: string; ssid: string | null; client_count: number;
      channel_24: number | null; channel_5: number | null;
      rssi_dbm: number | null; utilization: number; status: string;
    }>(`
      SELECT
        ap.name, ws.ssid, ap.client_count, ap.channel_24, ap.channel_5,
        ap.rssi_dbm, ap.utilization, ap.status
      FROM wireless_access_points ap
      LEFT JOIN wireless_ssids ws ON ws.id = ap.ssid_id
      ORDER BY ap.id
    `);

    return rows.map((r) => ({
      name:    r.name,
      ssid:    r.ssid    ?? '—',
      clients: r.client_count,
      ch24:    r.channel_24  ?? 1,
      ch5:     r.channel_5   ?? 36,
      rssi:    r.rssi_dbm    ?? -65,
      util:    r.utilization,
      status:  r.status,
    }));
  }

  async getSsidDistribution() {
    const { rows } = await this.db.query<{
      ssid: string; n: string; color: string;
    }>(`
      SELECT ws.ssid, COUNT(ap.id) AS n, ws.color
      FROM wireless_ssids ws
      LEFT JOIN wireless_access_points ap ON ap.ssid_id = ws.id
      GROUP BY ws.id, ws.ssid, ws.color
      ORDER BY ws.id
    `);

    // Scale AP counts to plausible client totals
    const multipliers: Record<string, number> = {
      corp: 1200, 'corp-iot': 350, guest: 200, voice: 40,
    };
    return rows.map((r) => ({
      ssid:  r.ssid,
      n:     Number(r.n) * (multipliers[r.ssid] ?? 100),
      color: r.color,
    }));
  }

  getSummary() {
    return { clients: '7,214', channelUtil: '42% avg', avgRssi: '-61 dBm', roamsPerMin: '184' };
  }

  async getAll() {
    const [accessPoints, ssidDistribution] = await Promise.all([
      this.getAccessPoints(),
      this.getSsidDistribution(),
    ]);
    return {
      accessPoints,
      ssidDistribution,
      summary: this.getSummary(),
      clientsChart: series(60, 42, 6500, 1200),
    };
  }
}
