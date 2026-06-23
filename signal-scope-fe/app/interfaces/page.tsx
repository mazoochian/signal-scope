import type { Metadata } from "next";
import { Search, Zap } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { MiniBars } from "@/components/charts/mini-bars";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Interfaces" };

interface IfaceRow {
  name: string; desc: string; vlan: string; duplex: string; speed: string;
  inMbps: string; outMbps: string; errs: number; util: number;
  status: StatusKind; trend: number[];
}

interface InterfaceSummary { total: number; up: number; errored: number; throughput: string }

interface InterfacesData {
  interfaces: IfaceRow[];
  summary: InterfaceSummary;
}

export default async function InterfacesPage() {
  const { interfaces: ifaces, summary } = await apiFetch<InterfacesData>("/interfaces");
  const sortedByUtil = [...ifaces].sort((a, b) => b.util - a.util).slice(0, 6);

  return (
    <>
      <TopBar title="Interfaces" />
      <PageHeader
        title="Interfaces"
        subtitle="core-sw-01 · 48 interfaces · live SNMP polling (10s)"
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input className="h-8 w-72 rounded-md border border-input bg-panel pl-7 pr-2 text-xs" placeholder="Filter description, VLAN, port…" />
          </div>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { l: "Total", v: String(summary.total) },
            { l: "Up", v: String(summary.up), tone: "text-success" },
            { l: "Errored", v: String(summary.errored), tone: "text-warning" },
            { l: "Total Throughput", v: summary.throughput, tone: "text-primary" },
          ].map((s) => (
            <div key={s.l} className="panel flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground">{s.l}</span>
              <span className={`font-mono text-base ${s.tone ?? ""}`}>{s.v}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" title="Port matrix" subtitle="visual front-panel · click to drill in">
            <div className="grid grid-cols-12 gap-1.5">
              {Array.from({ length: 48 }).map((_, i) => {
                const u = (i * 13) % 100;
                const s = u === 0 ? "muted" : u > 85 ? "warn" : "up";
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm border border-border"
                    style={{
                      background: s === "warn" ? "var(--color-warning)" : s === "up" ? "var(--color-success)" : "var(--color-elevated)",
                      opacity: s === "muted" ? 0.4 : 0.35 + u / 200,
                    }}
                    title={`Port ${i + 1} · ${u}%`}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
              <span className="chip"><span className="status-dot text-success" /> Up</span>
              <span className="chip"><span className="status-dot text-warning" /> Saturated</span>
              <span className="chip"><span className="status-dot text-muted-foreground" /> Down/unused</span>
              <span className="chip"><Zap className="h-3 w-3 text-warning" /> PoE 732 / 800 W</span>
            </div>
          </Panel>

          <Panel title="Top utilized · 1h" subtitle="rolling window">
            <ul className="space-y-2.5">
              {sortedByUtil.map((iface) => (
                <li key={iface.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono">{iface.name}</span>
                    <span className="font-mono text-muted-foreground">{iface.util}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full"
                      style={{ width: `${iface.util}%`, background: iface.util > 85 ? "var(--color-warning)" : "var(--color-primary)" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel className="mt-4" title="Interface table">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  {["Port","Description","Status","VLAN","Speed","In","Out","Util","Errors","Trend"].map((h) => (
                    <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ifaces.map((r) => (
                  <tr key={r.name} className="hover:bg-elevated/40">
                    <td className="px-2 py-2 font-mono">{r.name}</td>
                    <td className="px-2 py-2 text-muted-foreground">{r.desc}</td>
                    <td className="px-2 py-2"><StatusPill kind={r.status}>{r.status}</StatusPill></td>
                    <td className="px-2 py-2 font-mono">{r.vlan}</td>
                    <td className="px-2 py-2 font-mono">{r.speed}</td>
                    <td className="px-2 py-2 font-mono text-primary">{r.inMbps}</td>
                    <td className="px-2 py-2 font-mono text-cyan">{r.outMbps}</td>
                    <td className="px-2 py-2 font-mono">{r.util}%</td>
                    <td className="px-2 py-2 font-mono" style={{ color: r.errs > 50 ? "var(--color-critical)" : r.errs > 0 ? "var(--color-warning)" : "inherit" }}>
                      {r.errs}
                    </td>
                    <td className="px-2 py-2 w-28">
                      <MiniBars data={r.trend} height={20} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  );
}
