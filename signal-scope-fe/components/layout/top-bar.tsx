"use client";

import { Search, Globe, ChevronDown } from "lucide-react";
import { NotificationCenter } from "@/components/ui/notification-center";
import { AddDeviceDialog } from "@/components/devices/add-device-dialog";
import { PollIntervalPicker } from "@/components/layout/poll-interval-picker";

interface TopBarProps {
  title: string;
}

function LiveStatus() {
  return (
    <div className="hidden items-center gap-3 rounded-md border border-border bg-panel px-3 py-1.5 text-[11px] md:flex">
      <span className="flex items-center gap-1.5">
        <span className="status-dot text-success" /> 1,284 up
      </span>
      <span className="flex items-center gap-1.5">
        <span className="status-dot text-warning" /> 23 warn
      </span>
      <span className="flex items-center gap-1.5">
        <span className="status-dot text-critical" /> 7 down
      </span>
      <span className="ml-1 font-mono text-muted-foreground">poll 12s</span>
    </div>
  );
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Globe className="h-3.5 w-3.5" />
        <span>global</span>
        <ChevronDown className="h-3 w-3" />
        <span className="mx-1.5 text-muted-foreground/40">/</span>
        <span className="text-foreground/90">{title}</span>
      </div>
      <div className="relative ml-6 hidden flex-1 max-w-md lg:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search devices, IPs, interfaces, MAC, alerts…"
          className="h-8 w-full rounded-md border border-input bg-elevated/60 pl-8 pr-16 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LiveStatus />
        <PollIntervalPicker />
        <NotificationCenter />
        <AddDeviceDialog buttonClassName="hidden md:inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90" />
      </div>
    </header>
  );
}
