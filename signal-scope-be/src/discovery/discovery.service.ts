import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly db: DbService) {}

  async getJobs() {
    const { rows } = await this.db.query<{
      name: string; method: string | null; progress_pct: number;
      devices_found: number; new_devices: number; status: string;
    }>(`
      SELECT name, method, progress_pct, devices_found, new_devices, status
      FROM discovery_jobs
      ORDER BY started_at DESC
    `);

    return rows.map((r) => ({
      name:       r.name,
      method:     r.method ?? '—',
      progress:   r.progress_pct,
      found:      r.devices_found,
      newDevices: r.new_devices,
    }));
  }

  async getRecentlyDiscovered() {
    const { rows } = await this.db.query<{
      ip: string; hostname: string | null; vendor: string | null;
      status: string; discovered_at: Date;
    }>(`
      SELECT ip::text, hostname, vendor, status, discovered_at
      FROM discovered_devices
      ORDER BY discovered_at DESC
      LIMIT 20
    `);

    return rows.map((r) => ({
      ip:     r.ip,
      host:   r.hostname ?? '—',
      vendor: r.vendor   ?? '—',
      status: r.status,
      ago:    formatAgo(r.discovered_at),
    }));
  }

  async getAll() {
    const [jobs, recentlyDiscovered] = await Promise.all([
      this.getJobs(),
      this.getRecentlyDiscovered(),
    ]);
    return { jobs, recentlyDiscovered };
  }
}

function formatAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  return `${Math.floor(secs / 3600)}h`;
}
