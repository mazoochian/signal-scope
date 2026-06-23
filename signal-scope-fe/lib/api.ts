// Server-side: API_URL overrides so containers can reach the backend by internal hostname.
// Client-side: NEXT_PUBLIC_API_URL is baked into the bundle at build time.
export const API_URL =
  (typeof window === 'undefined' ? process.env.API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000';

export async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, { cache: 'no-store' });
  } catch (cause) {
    // Re-throw Next.js internal signals so the framework can handle them
    if (cause instanceof Error && (cause as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw cause;
    }
    const err = new Error(`BACKEND_UNAVAILABLE: Cannot reach NMS backend at ${API_URL}`);
    err.name = 'BackendUnavailableError';
    err.cause = cause;
    throw err;
  }
  if (!res.ok) throw new Error(`API ${path} returned ${res.status}`);
  return res.json() as Promise<T>;
}
