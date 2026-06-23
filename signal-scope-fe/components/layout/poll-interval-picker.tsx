"use client";

import { RefreshCw } from "lucide-react";
import { usePollingInterval } from "@/lib/polling-context";

const OPTIONS = [
  { label: "Off",  ms: 0 },
  { label: "5s",   ms: 5_000 },
  { label: "10s",  ms: 10_000 },
  { label: "30s",  ms: 30_000 },
  { label: "1m",   ms: 60_000 },
  { label: "5m",   ms: 300_000 },
];

export function PollIntervalPicker() {
  const { intervalMs, setIntervalMs } = usePollingInterval();

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border bg-panel px-2 py-1 text-[11px]">
      <RefreshCw
        className={`h-3 w-3 ${intervalMs > 0 ? "text-primary" : "text-muted-foreground"}`}
        style={intervalMs > 0 ? { animation: "spin 2s linear infinite" } : undefined}
      />
      <select
        value={intervalMs}
        onChange={(e) => setIntervalMs(Number(e.target.value))}
        className="cursor-pointer bg-transparent text-[11px] text-foreground focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.ms} value={o.ms} className="bg-panel text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
