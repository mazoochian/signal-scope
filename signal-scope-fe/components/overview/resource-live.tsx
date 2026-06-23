"use client";

import { Cpu, HardDrive, MemoryStick, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePoller } from "@/lib/use-poller";
import { usePollingInterval } from "@/lib/polling-context";

interface HostMetrics {
  cpu: number;
  mem: number;
  storage: number;
  load: number;
  cores: number;
  model: string;
}

const INITIAL: HostMetrics = { cpu: 0, mem: 0, storage: 0, load: 0, cores: 0, model: "" };

function Bar({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${tone}`} /> {label}
        </span>
        <span className="font-mono text-muted-foreground">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, value)}%`, background: "var(--gradient-primary)" }}
        />
      </div>
    </div>
  );
}

export function ResourceLive({ initialData = INITIAL }: { initialData?: HostMetrics }) {
  const { intervalMs } = usePollingInterval();
  const data = usePoller<HostMetrics>("/host-metrics", intervalMs, initialData);

  return (
    <div className="space-y-3">
      <Bar label="CPU"     value={data.cpu}     icon={Cpu}        tone="text-primary" />
      <Bar label="Memory"  value={data.mem}      icon={MemoryStick} tone="text-cyan" />
      <Bar label="Storage" value={data.storage}  icon={HardDrive}  tone="text-success" />
      <Bar label="Load Avg" value={data.load}    icon={Activity}   tone="text-warning" />
      {data.model && (
        <p className="truncate text-[10px] text-muted-foreground/60 pt-1">{data.model}</p>
      )}
    </div>
  );
}
