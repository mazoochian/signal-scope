"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "signal-scope-poll-ms";
export const DEFAULT_INTERVAL = 10_000;

interface PollingCtx {
  intervalMs: number;
  setIntervalMs: (ms: number) => void;
}

const PollingContext = createContext<PollingCtx>({
  intervalMs: DEFAULT_INTERVAL,
  setIntervalMs: () => {},
});

export function PollingProvider({ children }: { children: React.ReactNode }) {
  const [intervalMs, setIntervalMsState] = useState(DEFAULT_INTERVAL);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setIntervalMsState(Number(stored));
  }, []);

  const setIntervalMs = (ms: number) => {
    setIntervalMsState(ms);
    localStorage.setItem(STORAGE_KEY, String(ms));
  };

  return (
    <PollingContext.Provider value={{ intervalMs, setIntervalMs }}>
      {children}
    </PollingContext.Provider>
  );
}

export function usePollingInterval() {
  return useContext(PollingContext);
}
