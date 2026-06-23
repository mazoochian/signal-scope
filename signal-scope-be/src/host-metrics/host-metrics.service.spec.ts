import * as fs from 'fs';
import * as os from 'os';
import { execSync } from 'child_process';
import { HostMetricsService } from './host-metrics.service';

// Helper: read two /proc/stat samples 600 ms apart and compute CPU % directly.
async function measureCpuIndependently(service: HostMetricsService): Promise<number> {
  const a = service.readCpuSample();
  await new Promise<void>((r) => setTimeout(r, 600));
  const b = service.readCpuSample();
  return service.cpuBetween(a, b);
}

describe('HostMetricsService', () => {
  let service: HostMetricsService;

  beforeAll(async () => {
    service = new HostMetricsService();
    await service.onModuleInit();
    // Let one full refresh cycle complete so cachedCpu is settled.
    await new Promise<void>((r) => setTimeout(r, 2100));
  });

  afterAll(() => service.onModuleDestroy());

  // ─── CPU ────────────────────────────────────────────────────────────────────

  it('returns a CPU percentage between 0 and 100', async () => {
    const { cpu } = service.getMetrics();
    expect(cpu).toBeGreaterThanOrEqual(0);
    expect(cpu).toBeLessThanOrEqual(100);
  });

  it('cpu% agrees with an independent /proc/stat reading within ±25 pp', async () => {
    // Take an independent measurement concurrently with the service's next cycle.
    const [ref, { cpu }] = await Promise.all([
      measureCpuIndependently(service),
      Promise.resolve(service.getMetrics()),
    ]);
    // CPU can shift quickly; a ±25 pp window is realistic for a busy dev machine.
    expect(Math.abs(cpu - ref)).toBeLessThan(25);
  });

  // ─── Memory ─────────────────────────────────────────────────────────────────

  it('returns a memory percentage between 0 and 100', () => {
    const { mem } = service.getMetrics();
    expect(mem).toBeGreaterThanOrEqual(0);
    expect(mem).toBeLessThanOrEqual(100);
  });

  it('mem% matches os.freemem()/os.totalmem() within ±5 pp', () => {
    // Reference: Node os module (same kernel data, just a different interface).
    const refMem = (1 - os.freemem() / os.totalmem()) * 100;
    const { mem } = service.getMetrics();
    expect(Math.abs(mem - refMem)).toBeLessThan(5);
  });

  it('mem% matches /proc/meminfo MemAvailable within ±3 pp', () => {
    const info  = fs.readFileSync('/proc/meminfo', 'utf8');
    const parse = (key: string) => parseInt(info.match(new RegExp(`^${key}:\\s+(\\d+)`, 'm'))?.[1] ?? '0', 10);
    const total = parse('MemTotal');
    const avail = parse('MemAvailable');
    const refMem = ((total - avail) / total) * 100;
    const { mem } = service.getMetrics();
    expect(Math.abs(mem - refMem)).toBeLessThan(3);
  });

  // ─── Storage ────────────────────────────────────────────────────────────────

  it('returns a storage percentage between 0 and 100', () => {
    const { storage } = service.getMetrics();
    expect(storage).toBeGreaterThanOrEqual(0);
    expect(storage).toBeLessThanOrEqual(100);
  });

  it('storage% matches `df -P /` output exactly', () => {
    const raw = execSync('df -P /', { encoding: 'utf8' });
    const refPct = parseInt(raw.split('\n')[1].trim().split(/\s+/)[4], 10);
    const { storage } = service.getMetrics();
    expect(storage).toBe(refPct);
  });

  // ─── Load / misc ────────────────────────────────────────────────────────────

  it('load% is within 0–100', () => {
    const { load } = service.getMetrics();
    expect(load).toBeGreaterThanOrEqual(0);
    expect(load).toBeLessThanOrEqual(100);
  });

  it('load% matches os.loadavg()[0] / cores within ±1 pp', () => {
    const refLoad = Math.min(100, (os.loadavg()[0] / os.cpus().length) * 100);
    const { load } = service.getMetrics();
    expect(Math.abs(load - refLoad)).toBeLessThan(1);
  });

  it('cores matches os.cpus().length', () => {
    const { cores } = service.getMetrics();
    expect(cores).toBe(os.cpus().length);
  });

  it('model is a non-empty string', () => {
    const { model } = service.getMetrics();
    expect(typeof model).toBe('string');
    expect(model.length).toBeGreaterThan(0);
  });
});
