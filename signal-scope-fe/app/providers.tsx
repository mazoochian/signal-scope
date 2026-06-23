"use client";

import { PollingProvider } from "@/lib/polling-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PollingProvider>{children}</PollingProvider>;
}
