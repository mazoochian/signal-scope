import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Sparkline } from "@/components/charts/sparkline";
import { apiFetch } from "@/lib/api";

export const metadata: Metadata = { title: "Flow & Telemetry" };

interface App { app: string; bps: string; flows: number; pct: number }
interface Conversation { src: string; dst: string; app: string; bytes: string; packets: string; duration: string }
interface Subscription { device: string; sub: string; rate: string; lag: string; ok: boolean }
interface FlowStat { label: string; value: string }

interface TelemetryData {
  apps: App[];
  conversations: Conversation[];
  subscriptions: Subscription[];
  flowStats: FlowStat[];
  throughputChart: number[];
}

export default async function TelemetryPage() {
  const { apps, conversations, subscriptions, flowStats, throughputChart } =
    await apiFetch<TelemetryData>("/telemetry");

  return (
    <>
      <TopBar title="Flow & Telemetry" />
      <PageHeader
        title="Flow & Telemetry"
        subtitle="NetFlow v9 · IPFIX · sFlow · gNMI streaming · 4 collectors"
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" title="Aggregate Flow Throughput" subtitle="all collectors · last 24h">
            <Sparkline data={throughputChart} color="var(--color-primary)" height={220} />
            <div className="mt-3 grid grid-cols-4 gap-3 text-[11px]">
              {flowStats.map((x) => (
                <div key={x.label} className="rounded-md border border-border bg-elevated/40 p-2">
                  <div className="text-muted-foreground uppercase tracking-wide text-[10px]">{x.label}</div>
                  <div className="mt-1 font-mono text-sm">{x.value}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Top Applications">
            <ul className="space-y-2.5">
              {apps.map((a) => (
                <li key={a.app}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{a.app}</span>
                    <span className="font-mono text-muted-foreground">{a.bps}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
                    <div className="h-full" style={{ width: `${a.pct}%`, background: "var(--gradient-primary)" }} />
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {a.flows.toLocaleString()} flows
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Conversations · top talkers + listeners">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    {["Source","Destination","App","Bytes","Packets","Duration"].map((h) => (
                      <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {conversations.map((r, i) => (
                    <tr key={i} className="hover:bg-elevated/40">
                      <td className="px-2 py-2 font-mono">{r.src}</td>
                      <td className="px-2 py-2 font-mono">{r.dst}</td>
                      <td className="px-2 py-2 font-mono">{r.app}</td>
                      <td className="px-2 py-2 font-mono">{r.bytes}</td>
                      <td className="px-2 py-2 font-mono">{r.packets}</td>
                      <td className="px-2 py-2 font-mono">{r.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Streaming Telemetry · subscription health">
            <ul className="space-y-2 text-xs">
              {subscriptions.map((s) => (
                <li key={s.device} className="flex items-center justify-between rounded border border-border bg-elevated/40 p-2">
                  <div>
                    <div className="font-mono">{s.device}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{s.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[11px]">{s.rate}</div>
                    <div className={`font-mono text-[10px] ${s.ok ? "text-muted-foreground" : "text-warning"}`}>
                      lag {s.lag}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </main>
    </>
  );
}
