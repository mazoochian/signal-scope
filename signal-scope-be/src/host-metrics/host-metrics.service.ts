import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import { execSync } from 'child_process';

export interface CpuSample {
  total: number;
  idle: number;
}

export interface HostMetricsSnapshot {
  cpu: number;
  mem: number;
  storage: number;
  load: number;
  cores: number;
  model: string;
}

@Injectable()
export class HostMetricsService implements OnModuleInit, OnModuleDestroy {
  private cachedCpu = 0;
  private lastSample: CpuSample;
  private timer: NodeJS.Timeout;

  // Read the aggregate CPU line from /proc/stat and return total/idle tick counts.
  readCpuSample(): CpuSample {
    const line = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0];
    const parts = line.trim().split(/\s+/).slice(1).map(Number);
    const total = parts.reduce((a, b) => a + b, 0);
    const idle  = (parts[3] ?? 0) + (parts[4] ?? 0); // idle + iowait
    return { total, idle };
  }

  // Compute CPU % between two samples.
  cpuBetween(a: CpuSample, b: CpuSample): number {
    const totalDiff = b.total - a.total;
    const idleDiff  = b.idle  - a.idle;
    return totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;
  }

  readMemPercent(): number {
    const info = fs.readFileSync('/proc/meminfo', 'utf8');
    const get = (key: string) => {
      const m = info.match(new RegExp(`^${key}:\\s+(\\d+)`, 'm'));
      return m ? parseInt(m[1], 10) : 0;
    };
    const total     = get('MemTotal');
    const available = get('MemAvailable');
    return total > 0 ? ((total - available) / total) * 100 : 0;
  }

  readStoragePercent(): number {
    try {
      const out = execSync('df -P /', { encoding: 'utf8' });
      const pct = out.split('\n')[1]?.trim().split(/\s+/)[4] ?? '0%';
      return parseInt(pct, 10);
    } catch {
      return 0;
    }
  }

  async onModuleInit() {
    this.lastSample = this.readCpuSample();
    // Take a quick first sample after 500 ms so the very first API request
    // doesn't return 0% CPU.
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    const next = this.readCpuSample();
    this.cachedCpu = this.cpuBetween(this.lastSample, next);
    this.lastSample = next;
    // Refresh every 2 s thereafter.
    this.timer = setInterval(() => {
      const current = this.readCpuSample();
      this.cachedCpu = this.cpuBetween(this.lastSample, current);
      this.lastSample = current;
    }, 2000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  getMetrics(): HostMetricsSnapshot {
    const cores   = os.cpus().length;
    const load1   = os.loadavg()[0];
    const loadPct = Math.min(100, (load1 / cores) * 100);

    return {
      cpu:     +this.cachedCpu.toFixed(1),
      mem:     +this.readMemPercent().toFixed(1),
      storage: this.readStoragePercent(),
      load:    +loadPct.toFixed(1),
      cores,
      model:   os.cpus()[0]?.model.trim() ?? 'unknown',
    };
  }
}
