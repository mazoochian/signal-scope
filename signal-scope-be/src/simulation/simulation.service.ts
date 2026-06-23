import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { SimulationEngine } from './simulation.engine';

// Write a batch of device metrics to the DB every N ticks.
// At 2 s/tick this gives one DB write per 10 s instead of per 2 s.
const WRITE_EVERY_N_TICKS = 5;

@Injectable()
export class SimulationService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(SimulationService.name);
  private readonly engine = new SimulationEngine();
  private timer: NodeJS.Timeout;
  private tickCount = 0;
  private deviceIdCache: Map<string, number> | null = null;

  constructor(private readonly db: DbService) {}

  onModuleInit() {
    this.timer = setInterval(() => this.onTick(), 2000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  private async onTick() {
    this.engine.tick();
    this.tickCount++;

    if (this.tickCount % WRITE_EVERY_N_TICKS === 0) {
      await this.persistMetrics().catch((err: Error) =>
        this.log.warn(`device_metrics write failed: ${err.message}`),
      );
    }
  }

  private async persistMetrics() {
    if (!this.deviceIdCache) {
      this.deviceIdCache = await this.loadDeviceIds();
    }

    const snapshot = this.engine.getSnapshot();
    if (!snapshot.length) return;

    const now = new Date();
    const values: unknown[] = [];
    const placeholders: string[] = [];
    let idx = 1;

    for (const d of snapshot) {
      const dbId = this.deviceIdCache.get(d.id);
      if (!dbId) continue;
      placeholders.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      values.push(
        now, dbId,
        d.cpu.toFixed(2), d.mem.toFixed(2),
        d.ingressGbps.toFixed(4), d.egressGbps.toFixed(4),
        d.latencyMs.toFixed(3), d.packetLossPct.toFixed(5),
      );
    }

    if (!placeholders.length) return;

    await this.db.query(
      `INSERT INTO device_metrics
         (time, device_id, cpu_pct, mem_pct, ingress_gbps, egress_gbps, latency_ms, packet_loss_pct)
       VALUES ${placeholders.join(',')}`,
      values,
    );
  }

  private async loadDeviceIds(): Promise<Map<string, number>> {
    const { rows } = await this.db.query<{ id: number; name: string }>(
      'SELECT id, name FROM devices',
    );
    return new Map(rows.map((r) => [r.name, r.id]));
  }

  getWan(points = 80) {
    return this.engine.getWanSeries(points);
  }

  getKpis() {
    return this.engine.getKpis();
  }

  getSnapshot() {
    return this.engine.getSnapshot();
  }

  getDeviceHistory(id: string, points = 100) {
    return this.engine.getDeviceHistory(id, points);
  }
}
