/**
 * Tiny in-memory rate limiter for the public demo's AI routes.
 * Per-key sliding window; process-local (fine for a hackathon demo).
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 20;
const MAX_KEYS = 2000;

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > MAX_KEYS) {
    const first = hits.keys().next();
    if (!first.done) hits.delete(first.value);
  }
  return arr.length > MAX_HITS;
}

export function clientKey(req: Request, route: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${route}:${ip}`;
}
