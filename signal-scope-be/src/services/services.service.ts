import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { series } from '../common/chart-utils';

@Injectable()
export class ServicesService {
  constructor(private readonly db: DbService) {}

  async getAll() {
    const { rows } = await this.db.query<{
      id: number; name: string; owner: string; sla_pct: string; health_pct: string;
      status: string; path: string | null; mos: string | null;
      loss_pct: string | null; jitter: string | null;
    }>(`
      SELECT id, name, owner, sla_pct, health_pct, status, path, mos, loss_pct, jitter
      FROM services
      ORDER BY id
    `);

    const depsResult = await this.db.query<{ service_id: number; dependency: string }>(
      'SELECT service_id, dependency FROM service_dependencies',
    );
    const depsMap = new Map<number, string[]>();
    for (const r of depsResult.rows) {
      if (!depsMap.has(r.service_id)) depsMap.set(r.service_id, []);
      depsMap.get(r.service_id)!.push(r.dependency);
    }

    return rows.map((s, i) => ({
      name:   s.name,
      owner:  s.owner,
      sla:    +s.sla_pct,
      health: +s.health_pct,
      kind:   s.status,
      deps:   depsMap.get(s.id) ?? [],
      trend:  series(60, i * 7 + 9, 92, 6),
    }));
  }
}
