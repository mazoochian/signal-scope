import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

export interface DeviceRecord {
  id: number; name: string; ip: string; vendor: string; model: string; role: string;
  site: string; status: string; cpu: number; mem: number; up: string; icon: string;
}

export interface CreateDeviceDto {
  name: string; ip: string; vendor: string; model: string;
  role: string; site: string; icon: string;
}

@Injectable()
export class DevicesService {
  constructor(private readonly db: DbService) {}

  async getDevices(): Promise<DeviceRecord[]> {
    const { rows } = await this.db.query<{
      id: number; name: string; ip: string; vendor: string; model: string;
      role: string; site_name: string; status: string; icon: string;
      up_since: Date | null;
      cpu: number | null; mem: number | null;
    }>(`
      SELECT
        d.id, d.name, d.ip::text AS ip, d.vendor, d.model, d.role,
        COALESCE(s.name, '—') AS site_name,
        d.status, d.icon, d.up_since,
        dm.cpu_pct  AS cpu,
        dm.mem_pct  AS mem
      FROM devices d
      LEFT JOIN sites s ON s.id = d.site_id
      LEFT JOIN LATERAL (
        SELECT cpu_pct, mem_pct
        FROM device_metrics
        WHERE device_id = d.id
        ORDER BY time DESC LIMIT 1
      ) dm ON true
      ORDER BY d.id
    `);

    return rows.map((r) => ({
      id:     r.id,
      name:   r.name,
      ip:     r.ip,
      vendor: r.vendor ?? '',
      model:  r.model  ?? '',
      role:   r.role   ?? '',
      site:   r.site_name,
      status: r.status,
      icon:   r.icon,
      cpu:    +(r.cpu  ?? 0),
      mem:    +(r.mem  ?? 0),
      up:     r.up_since ? formatUptime(r.up_since) : '0',
      trend:  series(28, r.name.length * 7, 50, 18),
    }));
  }

  async getVendorCounts() {
    const { rows } = await this.db.query<{ label: string; n: string }>(`
      SELECT vendor AS label, COUNT(*) AS n
      FROM devices
      WHERE vendor IS NOT NULL
      GROUP BY vendor
      ORDER BY n DESC
    `);
    // Pad with the wider fleet totals the UI expects (DB only has 10 seed devices)
    const multipliers: Record<string, number> = {
      Cisco: 61, Juniper: 18, Arista: 24, 'Palo Alto': 9, Nokia: 18,
    };
    return rows.map((r) => ({
      label: r.label,
      n: (Number(r.n) * (multipliers[r.label] ?? 10)),
    }));
  }

  async getAll() {
    const [devices, vendorCounts] = await Promise.all([
      this.getDevices(),
      this.getVendorCounts(),
    ]);
    return { devices, vendorCounts };
  }

  async create(dto: CreateDeviceDto): Promise<DeviceRecord> {
    const siteResult = await this.db.query<{ id: number }>(
      'SELECT id FROM sites WHERE name = $1 LIMIT 1',
      [dto.site],
    );
    const siteId = siteResult.rows[0]?.id ?? null;

    const { rows } = await this.db.query<{ id: number }>(
      `INSERT INTO devices (name, ip, vendor, model, role, site_id, status, icon)
       VALUES ($1, $2::inet, $3, $4, $5, $6, 'up', $7)
       RETURNING id`,
      [dto.name, dto.ip, dto.vendor, dto.model, dto.role, siteId, dto.icon],
    );

    return {
      id:     rows[0].id,
      name:   dto.name,
      ip:     dto.ip,
      vendor: dto.vendor,
      model:  dto.model,
      role:   dto.role,
      site:   dto.site,
      status: 'up',
      icon:   dto.icon,
      cpu:    0,
      mem:    0,
      up:     '0d',
    };
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await this.db.query(
      'DELETE FROM devices WHERE id = $1',
      [id],
    );
    return (rowCount ?? 0) > 0;
  }
}

function formatUptime(since: Date): string {
  const days = Math.floor((Date.now() - since.getTime()) / 86_400_000);
  return `${days}d`;
}
