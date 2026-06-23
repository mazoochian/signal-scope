import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Sparkline } from "@/components/charts/sparkline";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Service Assurance" };

interface Service {
  name: string; owner: string; sla: number; health: number;
  kind: StatusKind; deps: string[]; trend: number[];
}

function MetricBox({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-elevated/40 p-2 text-center">
      <div className="text-muted-foreground uppercase tracking-wide text-[9px]">{l}</div>
      <div className="mt-0.5 font-mono">{v}</div>
    </div>
  );
}

export default async function ServicesPage() {
  const services = await apiFetch<Service[]>("/services");

  return (
    <>
      <TopBar title="Service Assurance" />
      <PageHeader
        title="Service Assurance"
        subtitle="Business services modeled as dependency graphs with rolled-up SLA"
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => {
            const ok = s.kind === "up";
            const healthColor = ok
              ? "var(--color-success)"
              : s.kind === "warn"
              ? "var(--color-warning)"
              : "var(--color-critical)";
            return (
              <Panel key={s.name} title={s.name} subtitle={`Owner: ${s.owner} · SLA target ${s.sla}%`}>
                <div className="flex items-center justify-between">
                  <StatusPill kind={s.kind}>
                    {ok ? "Healthy" : s.kind === "warn" ? "Degraded" : "Breach"}
                  </StatusPill>
                  <div className="text-right">
                    <div className="font-mono text-2xl tracking-tight" style={{ color: healthColor }}>
                      {s.health.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Health · 30d</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Sparkline data={s.trend} color={ok ? "var(--color-success)" : "var(--color-warning)"} height={60} />
                </div>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Dependency chain</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {s.deps.map((dep, idx) => (
                      <span key={dep} className="flex items-center">
                        <span className="rounded-md border border-border bg-elevated px-2 py-0.5 font-mono text-[11px]">{dep}</span>
                        {idx < s.deps.length - 1 && <span className="px-1 text-muted-foreground">→</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <MetricBox l="MTTR" v="14m" />
                  <MetricBox l="Incidents 30d" v={ok ? "0" : "3"} />
                  <MetricBox l="Error Budget" v={ok ? "97%" : "11%"} />
                </div>
              </Panel>
            );
          })}
        </div>
      </main>
    </>
  );
}
