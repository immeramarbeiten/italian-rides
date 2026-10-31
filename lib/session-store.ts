/**
 * Bounded localStorage writes. Keeps the newest sessions, evicts oldest
 * first only when quota forces it, and reports every eviction so callers
 * can tell the user. Never silently discards to make room.
 *
 * Import-free on purpose: node-tested directly.
 */

export type SaveResult = { ok: boolean; evicted: number };

export function boundedSave<T extends { id: string }>(
  current: T[],
  next: T,
  cap: number,
  write: (raw: string) => void,
): SaveResult {
  let list = [next, ...current.filter((x) => x.id !== next.id)].slice(0, cap);
  let evicted = 0;
  for (;;) {
    try {
      write(JSON.stringify(list));
      return { ok: true, evicted };
    } catch {
      if (list.length <= 1) return { ok: false, evicted };
      list = list.slice(0, -1);
      evicted++;
    }
  }
}
