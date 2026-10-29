import type { VespaPartId } from "./vespa-inspect";
import { CATALOG_PARTS } from "./vespa-parts";

export type SessionStatus = "uploaded" | "matched" | "selected" | "mapped";

export type InspectionSession = {
  id: string;
  createdAt: string;
  imageDataUrl: string;
  fileName: string;
  manufacturer: string;
  family: string;
  year: string;
  status: SessionStatus;
  selectedPart: VespaPartId | null;
  /** Filename-keyword hints only — the user always confirms visually. */
  hintPartIds: VespaPartId[];
  matchNote: string;
  matchMs: number;
};

const KEY = "italian-rides-inspections";

function readAll(): InspectionSession[] {
  try {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function getSession(id: string): InspectionSession | null {
  return readAll().find((s) => s.id === id) ?? null;
}

export function saveSession(s: InspectionSession): void {
  try {
    const rest = readAll().filter((x) => x.id !== s.id);
    localStorage.setItem(KEY, JSON.stringify([s, ...rest].slice(0, 12)));
  } catch {
    // Private mode / quota: session survives in memory only.
  }
}

export function newSessionId(): string {
  try {
    return crypto.randomUUID().slice(0, 8);
  } catch {
    return Date.now().toString(36);
  }
}

/**
 * Downscale to a JPEG data URL. Redrawing through canvas also strips EXIF
 * (including GPS), so uploads stay small and metadata-free.
 */
export async function downscaleImage(
  src: Blob | string,
  maxDim = 1600,
): Promise<{ dataUrl: string; width: number; height: number; ms: number }> {
  const t0 = performance.now();
  const blob =
    typeof src === "string" ? await (await fetch(src)).blob() : src;
  const bmp = await createImageBitmap(blob);
  const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
  const width = Math.max(1, Math.round(bmp.width * scale));
  const height = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bmp, 0, 0, width, height);
  bmp.close();
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.85),
    width,
    height,
    ms: Math.round(performance.now() - t0),
  };
}

/** Local filename-keyword heuristic. A hint, never a diagnosis. */
export function suggestFromName(fileName: string): VespaPartId[] {
  const lower = fileName.toLowerCase();
  const hits: { id: VespaPartId; score: number }[] = [];
  for (const p of CATALOG_PARTS) {
    const score = p.keywords.filter((k) => lower.includes(k)).length;
    if (score > 0) hits.push({ id: p.id, score });
  }
  return hits.sort((a, b) => b.score - a.score).map((h) => h.id);
}
