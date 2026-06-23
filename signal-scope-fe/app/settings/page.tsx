import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { KeyRound, Users, Lock, ServerCog, Webhook, Mail } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Settings" };

interface SettingsRow {
  l: string;
  s: string;
  sub: string;
  icon: LucideIcon;
  kind: StatusKind;
}

function Row({ l, s, sub, icon: Icon, kind }: SettingsRow) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-md border border-border bg-elevated/40 p-2.5 last:mb-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-panel">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs font-medium">{l}</div>
          <div className="truncate text-[10px] text-muted-foreground">{sub}</div>
        </div>
      </div>
      <StatusPill kind={kind}>{s}</StatusPill>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <PageHeader
        title="Settings"
        subtitle="Authentication, RBAC, collectors, integrations, audit"
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="Authentication"
            subtitle="SSO · OAuth2 · OIDC · LDAP · MFA"
          >
            {(
              [
                {
                  l: "Azure AD (OIDC)",
                  s: "connected",
                  icon: KeyRound,
                  sub: "tenant: signalscope.io · 412 users",
                  kind: "up",
                },
                {
                  l: "LDAP / Active Directory",
                  s: "connected",
                  icon: Users,
                  sub: "corp.local · sync 5m",
                  kind: "up",
                },
                {
                  l: "MFA · TOTP + WebAuthn",
                  s: "enforced",
                  icon: Lock,
                  sub: "all users · 38 enrolled this week",
                  kind: "up",
                },
              ] as SettingsRow[]
            ).map((x) => (
              <Row key={x.l} {...x} />
            ))}
          </Panel>

          <Panel
            title="RBAC Roles"
            subtitle="Least-privilege · approval workflows on write actions"
          >
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  {["Role", "Members", "Read", "Write", "Approve"].map((h) => (
                    <th key={h} className="px-2 py-2 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["NOC L1", "42", "All", "—", "—"],
                  ["NOC L2", "18", "All", "Limited", "—"],
                  ["Network Eng", "12", "All", "All", "Self"],
                  ["Change Mgr", "4", "All", "—", "All"],
                  ["Auditor", "6", "All read-only", "—", "—"],
                ].map((r) => (
                  <tr key={r[0]} className="hover:bg-elevated/40">
                    {r.map((c, i) => (
                      <td key={i} className="px-2 py-2 font-mono">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel
            title="Distributed Collectors"
            subtitle="4 online · 1,314 devices balanced"
          >
            {(
              [
                {
                  l: "collector-us-east-01",
                  s: "online",
                  icon: ServerCog,
                  sub: "412 devices · poll 8.4s · v4.2.1",
                  kind: "up",
                },
                {
                  l: "collector-us-west-01",
                  s: "online",
                  icon: ServerCog,
                  sub: "318 devices · poll 9.1s · v4.2.1",
                  kind: "up",
                },
                {
                  l: "collector-eu-01",
                  s: "online",
                  icon: ServerCog,
                  sub: "402 devices · poll 7.9s · v4.2.1",
                  kind: "up",
                },
                {
                  l: "collector-apac-01",
                  s: "degraded",
                  icon: ServerCog,
                  sub: "182 devices · poll 14.2s · v4.1.7 — upgrade pending",
                  kind: "warn",
                },
              ] as SettingsRow[]
            ).map((x) => (
              <Row key={x.l} {...x} />
            ))}
          </Panel>

          <Panel
            title="Integrations"
            subtitle="Notifications, webhooks, ITSM"
          >
            {(
              [
                {
                  l: "Slack · #noc-critical",
                  s: "active",
                  icon: Webhook,
                  sub: "sev: critical, major",
                  kind: "up",
                },
                {
                  l: "Microsoft Teams · NOC",
                  s: "active",
                  icon: Webhook,
                  sub: "sev: critical",
                  kind: "up",
                },
                {
                  l: "PagerDuty",
                  s: "active",
                  icon: Webhook,
                  sub: "escalation policy: NOC-24x7",
                  kind: "up",
                },
                {
                  l: "ServiceNow ITSM",
                  s: "active",
                  icon: Webhook,
                  sub: "auto-create P1/P2 incidents",
                  kind: "up",
                },
                {
                  l: "SMTP · alerts@",
                  s: "active",
                  icon: Mail,
                  sub: "daily digest 07:00 UTC",
                  kind: "up",
                },
              ] as SettingsRow[]
            ).map((x) => (
              <Row key={x.l} {...x} />
            ))}
          </Panel>
        </div>
      </main>
    </>
  );
}
