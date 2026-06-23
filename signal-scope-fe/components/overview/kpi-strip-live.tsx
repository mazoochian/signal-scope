"use client";

import {
  ArrowDownRight, ArrowUpRight,
  ShieldAlert, Server, Network, Activity, AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePoller } from "@/lib/use-poller";
import { usePollingInterval } from "@/lib/polling-context";
import { Sparkline } from "@/components/charts/sparkline";

interface KpiData {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "warn";
  spark: number[];
}

const KPI_ICONS: Record<string, LucideIcon> = {
  "Devices Up":      Server,
  "Critical Alerts": ShieldAlert,
  "WAN Throughput":  Network,
  "Mean Latency":    Activity,
  "Packet Loss":     AlertTriangle,
  "SLA (24h)":       ShieldAlert,
};

const INITIAL: KpiData[] = [
  { label: "Devices Up",      value: "—", delta: "—", tone: "up",   spark: [] },
  { label: "Critical Alerts", value: "—", delta: "—", tone: "warn", spark: [] },
  { label: "WAN Throughput",  value: "—", delta: "—", tone: "up",   spark: [] },
  { label: "Mean Latency",    value: "—", delta: "—", tone: "up",   spark: [] },
  { label: "Packet Loss",     value: "—", delta: "—", tone: "warn", spark: [] },
  { label: "SLA (24h)",       value: "—", delta: "—", tone: "up",   spark: [] },
];

function Kpi({ label, value, delta, tone, spark }: KpiData) {
  const toneCls =
    tone === "up" ? "text-success" : tone === "down" ? "text-critical" : "text-warning";
  const Arrow = tone === "down" ? ArrowDownRight : ArrowUpRight;
  const Icon = KPI_ICONS[label] ?? Server;
  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="font-mono text-xl font-semibold tracking-tight">{value}</div>
        <span className={`inline-flex items-center text-[10px] ${toneCls}`}>
          <Arrow className="h-3 w-3" />{delta}
        </span>
      </div>
      <div className="mt-1.5">
        {spark.length > 0 && <Sparkline data={spark} height={28} />}
      </div>
    </div>
  );
}

export function KpiStripLive({ initialData = { stats: INITIAL } }: { initialData?: { stats: KpiData[] } }) {
  const { intervalMs } = usePollingInterval();
  const data = usePoller<{ stats: KpiData[] }>("/simulation/kpis", intervalMs, initialData);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {data.stats.map((kpi) => <Kpi key={kpi.label} {...kpi} />)}
    </div>
  );
}
