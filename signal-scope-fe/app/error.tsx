"use client";

import { WifiOff, RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDisconnected = error.message?.includes("BACKEND_UNAVAILABLE");

  if (isDisconnected) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return (
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
          <span className="text-xs text-muted-foreground">Backend Status</span>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-critical/30 bg-critical/10 px-2.5 py-1 text-[11px] font-semibold text-critical">
              <span className="h-1.5 w-1.5 rounded-full bg-critical animate-pulse" />
              OFFLINE
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="max-w-sm w-full text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-critical/30 bg-critical/10">
              <WifiOff className="h-8 w-8 text-critical" />
            </div>

            <h1 className="text-xl font-semibold tracking-tight">Backend Offline</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              SignalScope cannot reach the NMS backend API. The server may be
              down or the URL may be misconfigured.
            </p>

            <div className="mt-4 rounded-md border border-border bg-elevated/40 px-3 py-2.5 text-left">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                Target
              </div>
              <div className="font-mono text-xs text-foreground break-all">
                {backendUrl}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-elevated"
              >
                <Home className="h-3.5 w-3.5" />
                Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
        <span className="text-xs text-muted-foreground">Error</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-warning/30 bg-warning/10">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. If the
            problem persists, the backend may be offline.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-elevated"
            >
              <Home className="h-3.5 w-3.5" />
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
