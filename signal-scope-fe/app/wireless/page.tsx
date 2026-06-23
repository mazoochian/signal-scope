import type { Metadata } from "next";
import { Wifi } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Sparkline } from "@/components/charts/sparkline";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Wireless" };

interface AccessPoint {
  name: string; ssid: string; clients: number; ch24: number;
  ch5: number; rssi: number; util: number; status: StatusKind;
}
interface SsidDist { ssid: string; n: number; color: string }
interface WirelessSummary { clients: string; channelUtil: string; avgRssi: string; roamsPerMin: string }

interface WirelessData {
  accessPoints: AccessPoint[];
  ssidDistribution: SsidDist[];
  summary: WirelessSummary;
  clientsChart: number[];
}

export default async function WirelessPage() {
  const { accessPoints, ssidDistribution, summary, clientsChart } =
    await apiFetch<WirelessData>("/wireless");

  const maxSsidN = ssidDistribution[0]?.n ?? 1;

  return (
    <>
      <TopBar title="Wireless" />
      <PageHeader
        title="Wireless"
        subtitle="wlc-hq-01 · 518 APs · 7,214 active clients · 24 SSIDs"
      />

      <main className="flex-1 px-5 py-5">
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { l: "Clients", v: summary.clients },
            { l: "Channel utilization", v: summary.channelUtil, tone: "text-warning" },
            { l: "Avg RSSI", v: summary.avgRssi },
            { l: "Roams /min", v: summary.roamsPerMin },
          ].map((s) => (
            <div key={s.l} className="panel p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.l}</span>
              <span className={`font-mono text-base ${s.tone ?? ""}`}>{s.v}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" title="Access Points">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    {["AP","SSID","Clients","2.4 Ch","5 Ch","RSSI","Util","Status"].map((h) => (
                      <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accessPoints.map((r) => (
                    <tr key={r.name} className="hover:bg-elevated/40">
                      <td className="px-2 py-2 font-mono">
                        <Wifi className="mr-1.5 inline h-3 w-3 text-primary" />{r.name}
                      </td>
                      <td className="px-2 py-2"><span className="chip">{r.ssid}</span></td>
                      <td className="px-2 py-2 font-mono">{r.clients}</td>
                      <td className="px-2 py-2 font-mono">{r.ch24}</td>
                      <td className="px-2 py-2 font-mono">{r.ch5}</td>
                      <td className="px-2 py-2 font-mono">{r.rssi} dBm</td>
                      <td className="px-2 py-2 font-mono" style={{ color: r.util > 70 ? "var(--color-warning)" : "inherit" }}>
                        {r.util}%
                      </td>
                      <td className="px-2 py-2"><StatusPill kind={r.status}>{r.status}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="Clients · 24h">
              <Sparkline data={clientsChart} color="var(--color-primary)" height={120} />
            </Panel>
            <Panel title="SSID distribution">
              {ssidDistribution.map((x) => (
                <div key={x.ssid} className="mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>{x.ssid}</span>
                    <span className="font-mono text-muted-foreground">{x.n}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full"
                      style={{ width: `${(x.n / maxSsidN) * 100}%`, background: `var(--color-${x.color})` }}
                    />
                  </div>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}
