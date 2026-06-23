export type DeviceRole =
  | 'edge-router'
  | 'aggregation-router'
  | 'core-switch'
  | 'access-switch'
  | 'firewall'
  | 'wlc';

export interface DeviceProfile {
  id: string;
  name: string;
  role: DeviceRole;
  site: string;
  status: 'up' | 'down' | 'warn';
  cpuBase: number;
  cpuAmp: number;
  memBase: number;
  memAmp: number;
  ingressBase: number;
  ingressAmp: number;
  egressBase: number;
  egressAmp: number;
  latencyBase: number;
  latencyAmp: number;
  lossBase: number;
}

export interface DeviceMetrics {
  ts: number;
  cpu: number;
  mem: number;
  ingressGbps: number;
  egressGbps: number;
  latencyMs: number;
  packetLossPct: number;
}

export interface DeviceState {
  profile: DeviceProfile;
  current: DeviceMetrics;
  history: DeviceMetrics[];
  rng: () => number;
  // Ornstein-Uhlenbeck random-walk state per metric
  wCpu: number;
  wMem: number;
  wIngress: number;
  wEgress: number;
  wLatency: number;
  wLoss: number;
}
