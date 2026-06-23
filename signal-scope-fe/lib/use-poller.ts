"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "./api";

export function usePoller<T>(path: string, intervalMs: number, initial: T) {
  const [data, setData] = useState<T>(initial);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const url = `${API_URL}/api${path}`;

    const poll = () => {
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: T) => { if (mounted.current) setData(d); })
        .catch(() => {});
    };

    poll();
    if (intervalMs <= 0) return () => { mounted.current = false; };
    const id = setInterval(poll, intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [path, intervalMs]);

  return data;
}
