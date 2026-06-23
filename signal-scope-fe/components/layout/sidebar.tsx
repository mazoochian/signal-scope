"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Radar,
  Network,
  Boxes,
  BellRing,
  Workflow,
  GitBranch,
  FileBarChart2,
  Waves,
  ShieldCheck,
  Cog,
  Cpu,
  Server,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const nav: NavSection[] = [
  {
    section: "Operate",
    items: [
      { href: "/", label: "Overview", icon: Activity },
      { href: "/topology", label: "Topology", icon: Network },
      { href: "/alerts", label: "Alerts", icon: BellRing, badge: "37" },
      { href: "/services", label: "Service Assurance", icon: ShieldCheck },
    ],
  },
  {
    section: "Monitor",
    items: [
      { href: "/devices", label: "Devices", icon: Server },
      { href: "/interfaces", label: "Interfaces", icon: Waves },
      { href: "/wireless", label: "Wireless", icon: Wifi },
      { href: "/telemetry", label: "Flow & Telemetry", icon: GitBranch },
    ],
  },
  {
    section: "Manage",
    items: [
      { href: "/discovery", label: "Discovery", icon: Radar },
      { href: "/configuration", label: "Configuration", icon: Workflow },
      { href: "/inventory", label: "Inventory", icon: Boxes },
      { href: "/reports", label: "Reports", icon: FileBarChart2 },
    ],
  },
  {
    section: "System",
    items: [{ href: "/settings", label: "Settings", icon: Cog }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <div
          className="relative grid h-8 w-8 place-items-center rounded-md"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Cpu className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">SignalScope</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            NMS · v4.2
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {nav.map((group) => (
          <div key={group.section} className="mb-4">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              {group.section}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" style={{ boxShadow: "var(--shadow-glow)" }} />
                      )}
                      <Icon
                        className={`h-4 w-4 ${
                          active
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-critical/15 px-1.5 py-0.5 text-[10px] font-semibold text-critical">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/60 p-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
            JR
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-xs font-medium">j.ramirez</div>
            <div className="truncate text-[10px] text-muted-foreground">
              NOC Engineer · L2
            </div>
          </div>
          <div className="ml-auto status-dot text-success" />
        </div>
      </div>
    </aside>
  );
}
