import type { Metadata } from "next";
import {
  Globe2, Router, Wifi, Server, Filter, Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Sparkline } from "@/components/charts/sparkline";
import { HeatStrip } from "@/components/charts/heat-strip";
import { KpiStripLive } from "@/components/overview/kpi-strip-live";
import { WanChartLive } from "@/components/overview/wan-chart-live";
import { ResourceLive } from "@/components/overview/resource-live";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = {
  title: "Network Overview",
  description: "NOC overview: device health, alerts, WAN, SLA, and live telemetry.",
};

interface AlertItem {
  id: number; sev: string; kind: StatusKind;
  title: string; device: string; ago: string; rc: string;
}
interface SiteItem { name: string; avail: number; heat: number[] }
interface TalkerItem { src: string; app: string; mbps: string }
interface ServiceItem {
  name: string; kind: StatusKind; status: string; path: string;
  mos: string; loss: string; jitter: string; trend: number[];
}
interface LogItem { t: string; sev: string; sevColor: string; msg: string }
interface StaticData {
  alerts: AlertItem[];
  sites: SiteItem[];
  talkers: TalkerItem[];
  services: ServiceItem[];
  logs: LogItem[];
}
interface HostMetrics { cpu: number; mem: number; storage: number; load: number; cores: number; model: string }
interface WanData {
  ingress: number[]; egress: number[];
  stats: { label: string; value: string; color: string }[];
}
interface KpisData { stats: { label: string; value: string; delta: string; tone: "up" | "down" | "warn"; spark: number[] }[] }

function DeviceTypeBox({ icon: Icon, n, l }: { icon: LucideIcon; n: number; l: string }) {
  return (
    <div className="rounded-md border border-border bg-elevated/40 p-2 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
      <div className="mt-1 font-mono text-sm">{n}</div>
      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{l}</div>
    </div>
  );
}

function Metric({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded bg-panel/60 px-1.5 py-1 text-center">
      <div className="text-muted-foreground">{l}</div>
      <div className="font-mono text-foreground">{v}</div>
    </div>
  );
}

export default async function OverviewPage() {
  const [staticData, wanData, kpisData, hostData] = await Promise.all([
    apiFetch<StaticData>("/overview"),
    apiFetch<WanData>("/simulation/wan"),
    apiFetch<KpisData>("/simulation/kpis"),
    apiFetch<HostMetrics>("/host-metrics"),
  ]);
  const { alerts, sites, talkers, services, logs } = staticData;

  return (
    <>
      <TopBar title="Network Overview" />
      <PageHeader
        title="Network Overview"
        subtitle="Real-time NOC view · 1,314 monitored devices · 6 sites · 4 collectors online"
        actions={
          <>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs hover:bg-elevated">
              <Filter className="h-3.5 w-3.5" /> Last 1h
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs hover:bg-elevated">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </>
        }
      />

      <main className="flex-1 px-5 py-5">
        <KpiStripLive initialData={kpisData} />

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3" style={{ alignItems: "stretch" }}>
          <Panel
            grow
            className="xl:col-span-2"
            title="WAN Aggregate Throughput"
            subtitle="6 sites · MPLS + DIA + SD-WAN"
            actions={
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="chip"><span className="status-dot text-primary" /> Ingress</span>
                <span className="chip"><span className="status-dot text-cyan" /> Egress</span>
              </div>
            }
          >
            <WanChartLive initialData={wanData} />
          </Panel>

          <Panel
            title="Active Alerts"
            subtitle="Correlated · 37 open"
            actions={<a className="text-[11px] text-primary hover:underline" href="/alerts">View all</a>}
          >
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.id} className="group flex items-start gap-3 rounded-md border border-border bg-elevated/40 p-2.5 hover:border-primary/40">
                  <StatusPill kind={a.kind}>{a.sev}</StatusPill>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{a.title}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {a.device} · {a.ago}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{a.rc}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel title="Site Health" subtitle="Last 60 min · availability heat">
            <ul className="space-y-2.5">
              {sites.map((s) => (
                <li key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <Globe2 className="h-3.5 w-3.5 text-muted-foreground" /> {s.name}
                    </span>
                    <span className="font-mono text-muted-foreground">{s.avail}%</span>
                  </div>
                  <HeatStrip data={s.heat} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Top Talkers" subtitle="NetFlow · last 5 min">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-medium pb-2">Source</th>
                  <th className="text-left font-medium pb-2">App</th>
                  <th className="text-right font-medium pb-2">Mbps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {talkers.map((t) => (
                  <tr key={t.src} className="hover:bg-elevated/40">
                    <td className="py-1.5 font-mono">{t.src}</td>
                    <td className="py-1.5"><span className="chip">{t.app}</span></td>
                    <td className="py-1.5 text-right font-mono text-primary">{t.mbps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Resource Utilization" subtitle="This server · live">
            <ResourceLive initialData={hostData} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <DeviceTypeBox icon={Router} n={184} l="Routers" />
              <DeviceTypeBox icon={Server} n={612} l="Switches" />
              <DeviceTypeBox icon={Wifi}   n={518} l="APs" />
            </div>
          </Panel>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" title="Service Assurance" subtitle="End-to-end business services">
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.name} className="rounded-md border border-border bg-elevated/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{s.name}</div>
                    <StatusPill kind={s.kind}>{s.status}</StatusPill>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{s.path}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                    <Metric l="MOS" v={s.mos} />
                    <Metric l="Loss" v={s.loss} />
                    <Metric l="Jitter" v={s.jitter} />
                  </div>
                  <div className="mt-2">
                    <Sparkline data={s.trend} color="var(--color-success)" height={26} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Live Syslog" subtitle="Streaming · all collectors">
            <ol className="space-y-1 font-mono text-[10.5px] leading-relaxed">
              {logs.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground/60">{l.t}</span>
                  <span className={l.sevColor}>{l.sev}</span>
                  <span className="text-foreground/90 truncate">{l.msg}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </main>
    </>
  );
}
