"use client";

import { usePoller } from "@/lib/use-poller";
import { usePollingInterval } from "@/lib/polling-context";
import { Sparkline } from "@/components/charts/sparkline";

interface WanData {
  ingress: number[];
  egress: number[];
  stats: { label: string; value: string; color: string }[];
}

const EMPTY: WanData = {
  ingress: Array(80).fill(0),
  egress: Array(80).fill(0),
  stats: [
    { label: "Peak In",   value: "—", color: "primary" },
    { label: "Peak Out",  value: "—", color: "cyan" },
    { label: "Drops",     value: "—", color: "warning" },
    { label: "95th %ile", value: "—", color: "foreground" },
  ],
};

export function WanChartLive({ initialData = EMPTY }: { initialData?: WanData }) {
  const { intervalMs } = usePollingInterval();
  const data = usePoller<WanData>("/simulation/wan", intervalMs, initialData);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <div className="relative flex-1 min-h-[160px]">
        <div className="absolute inset-0 noc-grid opacity-30 rounded" />
        <div className="absolute inset-0">
          <Sparkline data={data.ingress} color="var(--color-primary)" stretch />
        </div>
        <div className="absolute inset-0">
          <Sparkline data={data.egress} color="var(--color-cyan)" stretch />
        </div>
        <div className="pointer-events-none absolute inset-y-2 left-0 flex flex-col justify-between text-[9px] font-mono text-muted-foreground/70">
          <span>20G</span>
          <span>15G</span>
          <span>10G</span>
          <span>5G</span>
          <span>0</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 text-[11px] shrink-0">
        {data.stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-elevated/40 p-2">
            <div className="text-muted-foreground uppercase tracking-wide text-[10px]">{s.label}</div>
            <div className={`mt-1 font-mono text-sm text-${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
