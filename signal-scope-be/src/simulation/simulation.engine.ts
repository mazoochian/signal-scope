import { DeviceProfile, DeviceRole, DeviceState, DeviceMetrics } from './simulation.types';

const MAX_HISTORY = 300;

// Ornstein-Uhlenbeck parameters
// θ (theta) controls mean-reversion speed. At 2 s/tick, θ=0.04 gives a
// reversion half-life of ln(2)/0.04 ≈ 17 ticks ≈ 34 seconds — deviations
// persist for tens of seconds before pulling back, which is what real
// throughput graphs look like.
const THETA = 0.04;
// Per-tick noise is uniform on [-0.5, 0.5] scaled by (amp * NOISE_SCALE).
// Stationary std ≈ amp * NOISE_SCALE * 0.289 / sqrt(2*THETA) ≈ amp * 0.36,
// so values typically roam within ±amp of the baseline.
const NOISE_SCALE = 0.35;

function lcg(seed: number): () => number {
  let s = ((seed ^ 0xdeadbeef) * 1664525 + 1013904223) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function clamp(min: number, max: number, v: number) {
  return Math.min(max, Math.max(min, v));
}

const ROLE_DEFAULTS: Record<DeviceRole, Omit<DeviceProfile, 'id' | 'name' | 'role' | 'site' | 'status'>> = {
  'edge-router': {
    cpuBase: 34, cpuAmp: 22,
    memBase: 48, memAmp: 12,
    ingressBase: 12.0, ingressAmp: 5.5,
    egressBase: 8.0, egressAmp: 4.0,
    latencyBase: 14, latencyAmp: 8,
    lossBase: 0.02,
  },
  'aggregation-router': {
    cpuBase: 28, cpuAmp: 18,
    memBase: 45, memAmp: 12,
    ingressBase: 11, ingressAmp: 6,
    egressBase: 9.5, egressAmp: 5,
    latencyBase: 3, latencyAmp: 2,
    lossBase: 0.005,
  },
  'core-switch': {
    cpuBase: 15, cpuAmp: 10,
    memBase: 55, memAmp: 12,
    ingressBase: 18, ingressAmp: 7,
    egressBase: 17, egressAmp: 7,
    latencyBase: 0.4, latencyAmp: 0.2,
    lossBase: 0.001,
  },
  'access-switch': {
    cpuBase: 22, cpuAmp: 14,
    memBase: 38, memAmp: 10,
    ingressBase: 2.1, ingressAmp: 1.5,
    egressBase: 1.9, egressAmp: 1.4,
    latencyBase: 0.8, latencyAmp: 0.4,
    lossBase: 0.002,
  },
  'firewall': {
    cpuBase: 44, cpuAmp: 24,
    memBase: 62, memAmp: 14,
    ingressBase: 6.5, ingressAmp: 4.0,
    egressBase: 6.0, egressAmp: 3.8,
    latencyBase: 4, latencyAmp: 2,
    lossBase: 0.004,
  },
  'wlc': {
    cpuBase: 32, cpuAmp: 14,
    memBase: 54, memAmp: 10,
    ingressBase: 3.2, ingressAmp: 2.0,
    egressBase: 2.8, egressAmp: 1.8,
    latencyBase: 6, latencyAmp: 3,
    lossBase: 0.01,
  },
};

const SEED_DEVICES: Array<Pick<DeviceProfile, 'id' | 'name' | 'site' | 'status'> & { role: DeviceRole }> = [
  { id: 'core-sw-01',      name: 'core-sw-01',      role: 'core-switch',        site: 'HQ-NYC', status: 'up' },
  { id: 'core-sw-02',      name: 'core-sw-02',      role: 'core-switch',        site: 'HQ-NYC', status: 'up' },
  { id: 'edge-rtr-nyc-01', name: 'edge-rtr-nyc-01', role: 'edge-router',        site: 'HQ-NYC', status: 'down' },
  { id: 'edge-rtr-nyc-02', name: 'edge-rtr-nyc-02', role: 'edge-router',        site: 'HQ-NYC', status: 'up' },
  { id: 'agg-rtr-lax-01',  name: 'agg-rtr-lax-01',  role: 'aggregation-router', site: 'LAX',    status: 'warn' },
  { id: 'fw-edge-sea-01',  name: 'fw-edge-sea-01',  role: 'firewall',           site: 'SEA',    status: 'warn' },
  { id: 'acc-sw-hq-09',    name: 'acc-sw-hq-09',    role: 'access-switch',      site: 'HQ-NYC', status: 'warn' },
  { id: 'acc-sw-dc-10',    name: 'acc-sw-dc-10',    role: 'access-switch',      site: 'DCA',    status: 'up' },
  { id: 'wlc-hq-01',       name: 'wlc-hq-01',       role: 'wlc',               site: 'HQ-NYC', status: 'up' },
  { id: 'core-sw-fra-01',  name: 'core-sw-fra-01',  role: 'core-switch',        site: 'FRA',    status: 'up' },
];

export class SimulationEngine {
  private states = new Map<string, DeviceState>();

  constructor() {
    SEED_DEVICES.forEach((d, i) => {
      const profile: DeviceProfile = { ...d, ...ROLE_DEFAULTS[d.role] };
      const wm = d.status === 'warn' ? 1.15 : 1.0;
      const state: DeviceState = {
        profile,
        current: this.deadMetrics(),
        history: [],
        rng: lcg(i * 7919 + 31337),
        wCpu:     profile.cpuBase * wm,
        wMem:     profile.memBase,
        wIngress: d.status === 'down' ? 0 : profile.ingressBase * wm,
        wEgress:  d.status === 'down' ? 0 : profile.egressBase * wm,
        wLatency: profile.latencyBase * wm,
        wLoss:    profile.lossBase * wm,
      };
      // Run 300 warm-up ticks to populate history with settled OU values
      for (let t = 0; t < MAX_HISTORY; t++) {
        this.ouStep(state, Date.now() - (MAX_HISTORY - t) * 2000);
      }
      state.current = state.history[state.history.length - 1];
      this.states.set(d.id, state);
    });
  }

  private deadMetrics(): DeviceMetrics {
    return { ts: Date.now(), cpu: 0, mem: 0, ingressGbps: 0, egressGbps: 0, latencyMs: 999, packetLossPct: 100 };
  }

  private ouStep(state: DeviceState, ts: number) {
    const { profile: p, rng: r } = state;
    const n = () => (r() - 0.5); // uniform noise, zero mean, σ ≈ 0.289

    if (p.status === 'down') {
      // Down device: flat-line near zero with tiny jitter
      state.wIngress = 0;
      state.wEgress  = 0;
      state.wCpu     = clamp(0, 3, state.wCpu + n() * 0.5);
      state.wMem     = clamp(0, 8, state.wMem + n() * 0.5);
      state.wLatency = 999;
      state.wLoss    = 100;
    } else {
      const wm = p.status === 'warn' ? 1.15 : 1.0;

      // Each metric follows: x += θ(μ - x) + σ·noise
      // where σ = amp * NOISE_SCALE  and  μ = base * wm
      const ou = (x: number, base: number, amp: number) =>
        x + THETA * (base * wm - x) + n() * amp * NOISE_SCALE;

      state.wCpu     = clamp(1, 99,   ou(state.wCpu,     p.cpuBase,     p.cpuAmp));
      state.wMem     = clamp(5, 98,   ou(state.wMem,     p.memBase,     p.memAmp * 0.5)); // memory moves slowly
      state.wIngress = Math.max(0.01, ou(state.wIngress, p.ingressBase, p.ingressAmp));
      state.wEgress  = Math.max(0.01, ou(state.wEgress,  p.egressBase,  p.egressAmp));
      state.wLatency = Math.max(0.1,  ou(state.wLatency, p.latencyBase, p.latencyAmp));
      // Loss is always tiny; model as independent small positive OU walk
      state.wLoss    = Math.max(0, state.wLoss + THETA * (p.lossBase * wm - state.wLoss) + r() * p.lossBase * 0.5);
    }

    const metrics: DeviceMetrics = {
      ts,
      cpu:           state.wCpu,
      mem:           state.wMem,
      ingressGbps:   state.wIngress,
      egressGbps:    state.wEgress,
      latencyMs:     state.wLatency,
      packetLossPct: state.wLoss,
    };
    if (state.history.length >= MAX_HISTORY) state.history.shift();
    state.history.push(metrics);
    state.current = metrics;
  }

  tick() {
    const now = Date.now();
    this.states.forEach((state) => this.ouStep(state, now));
  }

  getSnapshot() {
    return Array.from(this.states.values()).map((s) => ({
      id: s.profile.id,
      name: s.profile.name,
      role: s.profile.role,
      site: s.profile.site,
      status: s.profile.status,
      cpu:           +s.current.cpu.toFixed(1),
      mem:           +s.current.mem.toFixed(1),
      ingressGbps:   +s.current.ingressGbps.toFixed(2),
      egressGbps:    +s.current.egressGbps.toFixed(2),
      latencyMs:     +s.current.latencyMs.toFixed(2),
      packetLossPct: +s.current.packetLossPct.toFixed(4),
    }));
  }

  getWanSeries(points = 80) {
    const edges  = Array.from(this.states.values()).filter((s) => s.profile.role === 'edge-router');
    const active = edges.filter((r) => r.profile.status !== 'down');
    const histLen = edges[0]?.history.length ?? 0;
    const ingress: number[] = [];
    const egress:  number[] = [];

    for (let i = 0; i < points; i++) {
      const hi = Math.max(0, histLen - points + i);
      let sumIn = 0, sumOut = 0;
      edges.forEach((r) => {
        sumIn  += r.history[hi]?.ingressGbps ?? 0;
        sumOut += r.history[hi]?.egressGbps  ?? 0;
      });
      ingress.push(+sumIn.toFixed(2));
      egress.push(+sumOut.toFixed(2));
    }

    const peakIn  = Math.max(...ingress);
    const peakOut = Math.max(...egress);
    const sorted  = [...ingress].sort((a, b) => a - b);
    const p95     = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
    const avgLoss = active.reduce((s, r) => s + r.current.packetLossPct, 0) / Math.max(active.length, 1);

    return {
      ingress,
      egress,
      stats: [
        { label: 'Peak In',   value: `${peakIn.toFixed(1)} Gbps`,  color: 'primary' },
        { label: 'Peak Out',  value: `${peakOut.toFixed(1)} Gbps`, color: 'cyan' },
        { label: 'Drops',     value: `${avgLoss.toFixed(3)}%`,     color: 'warning' },
        { label: '95th %ile', value: `${p95.toFixed(1)} Gbps`,     color: 'foreground' },
      ],
    };
  }

  getKpis() {
    const all      = Array.from(this.states.values());
    const upDevs   = all.filter((s) => s.profile.status !== 'down' && s.current.ingressGbps > 0.1);
    const edges    = all.filter((s) => s.profile.role === 'edge-router' && s.profile.status !== 'down');
    const warnDevs = all.filter((s) => s.current.cpu > 78 && s.profile.status !== 'down');
    const histLen  = all[0]?.history.length ?? 0;
    const N        = 40;

    const spark = (fn: (hi: number) => number) =>
      Array.from({ length: N }, (_, i) => fn(Math.max(0, histLen - N + i)));

    const wanSpark   = spark((hi) => edges.reduce((s, r) => s + (r.history[hi]?.ingressGbps ?? 0), 0));
    const latSpark   = spark((hi) => {
      const vals = edges.map((r) => r.history[hi]?.latencyMs ?? 0);
      return vals.reduce((a, b) => a + b, 0) / Math.max(vals.length, 1);
    });
    const upSpark    = spark((hi) => all.filter((s) => (s.history[hi]?.ingressGbps ?? 0) > 0.1).length * 130);
    const alertSpark = spark((hi) =>
      all.filter((s) => {
        const h = s.history[hi];
        return h && s.profile.status !== 'down' && (h.cpu > 78 || h.latencyMs > 30);
      }).length + 5);
    const lossSpark  = spark((hi) =>
      edges.reduce((s, r) => s + (r.history[hi]?.packetLossPct ?? 0), 0) / Math.max(edges.length, 1));
    const slaSpark   = spark((hi) => {
      const up = edges.filter((r) => (r.history[hi]?.ingressGbps ?? 0) > 0.5).length;
      return (up / Math.max(edges.length, 1)) * 100;
    });

    const wanNow  = edges.reduce((s, r) => s + r.current.ingressGbps, 0);
    const latNow  = edges.reduce((s, r) => s + r.current.latencyMs, 0) / Math.max(edges.length, 1);
    const lossNow = edges.reduce((s, r) => s + r.current.packetLossPct, 0) / Math.max(edges.length, 1);

    return {
      stats: [
        { label: 'Devices Up',      value: `1,${200 + upDevs.length * 28}`,   delta: `+${upDevs.length}`,    tone: 'up',   spark: upSpark },
        { label: 'Critical Alerts', value: `${warnDevs.length + 5}`,           delta: `+${warnDevs.length}`,  tone: warnDevs.length > 1 ? 'down' : 'warn', spark: alertSpark },
        { label: 'WAN Throughput',  value: `${wanNow.toFixed(1)} Gbps`,        delta: '+6.2%',                tone: 'up',   spark: wanSpark },
        { label: 'Mean Latency',    value: `${latNow.toFixed(1)} ms`,          delta: '-1.1ms',               tone: 'up',   spark: latSpark },
        { label: 'Packet Loss',     value: `${lossNow.toFixed(3)} %`,          delta: lossNow > 0.05 ? '+0.01' : '—', tone: lossNow > 0.05 ? 'warn' : 'up', spark: lossSpark },
        { label: 'SLA (24h)',       value: '99.982 %',                         delta: 'met',                  tone: 'up',   spark: slaSpark },
      ],
    };
  }

  getDeviceHistory(id: string, points = 100) {
    const s = this.states.get(id);
    if (!s) return null;
    const h = s.history.slice(-points);
    return {
      id, role: s.profile.role, status: s.profile.status, site: s.profile.site,
      cpu:         h.map((m) => +m.cpu.toFixed(1)),
      mem:         h.map((m) => +m.mem.toFixed(1)),
      ingressGbps: h.map((m) => +m.ingressGbps.toFixed(2)),
      egressGbps:  h.map((m) => +m.egressGbps.toFixed(2)),
      latencyMs:   h.map((m) => +m.latencyMs.toFixed(2)),
      timestamps:  h.map((m) => m.ts),
    };
  }
}
