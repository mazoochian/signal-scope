import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class InventoryService {
  constructor(private readonly db: DbService) {}

  async getAssets() {
    const { rows } = await this.db.query<{
      serial_number: string; host_name: string | null; model: string | null;
      vendor: string | null; site_name: string | null; rack: string | null;
      os_version: string | null; purchased_at: Date | null;
      warranty_expires_at: Date | null; end_of_support_at: Date | null;
    }>(`
      SELECT
        ia.serial_number, ia.host_name, ia.model, ia.vendor, ia.rack, ia.os_version,
        ia.purchased_at, ia.warranty_expires_at, ia.end_of_support_at,
        s.name AS site_name
      FROM inventory_assets ia
      LEFT JOIN sites s ON s.id = ia.site_id
      ORDER BY ia.id
    `);

    return rows.map((r) => ({
      sn:        r.serial_number,
      host:      r.host_name               ?? '—',
      model:     r.model                   ?? '—',
      vendor:    r.vendor                  ?? '—',
      site:      r.site_name               ?? '—',
      rack:      r.rack                    ?? '—',
      os:        r.os_version              ?? '—',
      purchased: r.purchased_at            ? r.purchased_at.toISOString().slice(0, 10) : '—',
      warranty:  r.warranty_expires_at     ? r.warranty_expires_at.toISOString().slice(0, 10) : '—',
      eos:       r.end_of_support_at       ? r.end_of_support_at.toISOString().slice(0, 10) : '—',
    }));
  }

  getSummary() {
    return [
      { label: 'Under warranty', value: '1,141', tone: 'success' },
      { label: 'Expiring 90d',   value: '42',    tone: 'warning' },
      { label: 'EoS within 1yr', value: '18',    tone: 'warning' },
      { label: 'EoL / unsupported', value: '9',  tone: 'critical' },
    ];
  }

  async getAll() {
    const assets = await this.getAssets();
    return { assets, summary: this.getSummary() };
  }
}
