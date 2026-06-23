"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { API_URL } from "@/lib/api";

type NotifLevel = "crit" | "maj" | "warn" | "info";

interface Notification {
  id: number;
  level: NotifLevel;
  source: "device" | "app";
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

const LEVEL_META: Record<
  NotifLevel,
  { label: string; text: string; border: string; bg: string }
> = {
  crit: { label: "CRIT", text: "text-critical", border: "border-critical/30", bg: "bg-critical/10" },
  maj:  { label: "MAJ",  text: "text-warning",  border: "border-warning/30",  bg: "bg-warning/10"  },
  warn: { label: "WARN", text: "text-warning",  border: "border-warning/20",  bg: "bg-warning/8"   },
  info: { label: "INFO", text: "text-info",     border: "border-info/30",     bg: "bg-info/10"     },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetch(`${API_URL}/api/notifications`)
      .then((r) => r.json())
      .then(setNotifications)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function markRead(id: number) {
    fetch(`${API_URL}/api/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    fetch(`${API_URL}/api/notifications/mark-all-read`, { method: "POST" }).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open notification center"
        aria-expanded={open}
        className="relative grid h-8 w-8 place-items-center rounded-md border border-border bg-panel hover:bg-elevated"
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-0.5 text-[9px] font-bold text-critical-foreground pulse-ring">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-border bg-popover shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-critical/15 px-1.5 py-0.5 text-[10px] font-semibold text-critical">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-elevated hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <ul className="max-h-[30rem] divide-y divide-border overflow-y-auto">
            {notifications.map((n) => {
              const m = LEVEL_META[n.level];
              return (
                <li
                  key={n.id}
                  className={`group flex items-start gap-3 px-4 py-3 transition-colors ${
                    n.read ? "opacity-45" : "hover:bg-elevated/40"
                  }`}
                >
                  <span className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${m.bg} ${m.border} ${m.text}`}>
                    {m.label}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{n.title}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{n.detail}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${n.source === "device" ? "text-primary/70" : "text-muted-foreground/60"}`}>
                        {n.source}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/50">{n.time}</span>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      title="Mark as read"
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border bg-elevated text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:border-success/50 hover:text-success"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5 text-center">
            <a href="/alerts" className="text-[11px] text-primary hover:underline">
              View all alerts →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
