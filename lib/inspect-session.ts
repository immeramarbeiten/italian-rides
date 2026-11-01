import { VESPA_PARTS, type VespaPartId } from "./vespa-inspect";
import { CATALOG_PARTS } from "./vespa-parts";
import type { SamOverlay } from "./sam-parse";
import type { SubId } from "./guided-inspect";
import type { GtsPilotId } from "./gts-pilot";
import { boundedSave, type SaveResult } from "./session-store";

export type SessionStatus = "uploaded" | "matched" | "selected" | "mapped";

export type AiComponent = {
  id: string;
  label: string;
  confidence: number;
  condition: string;
};

export type AiResult = {
  model: string;
  modelGuess: string | null;
  components: AiComponent[];
  notes: string;
};

export type InspectionSession = {
  id: string;
  createdAt: string;
  imageDataUrl: string;
  fileName: string;
  manufacturer: string;
  family: string;
  /** Engine displacement in cc, "Electric", or "" when unsure. */
  engine: string;
  year: string;
  status: SessionStatus;
  selectedPart: VespaPartId | null;
  /** AI or filename-keyword hints — the user always confirms visually. */
  hintPartIds: VespaPartId[];
  matchNote: string;
  matchMs: number;
  /** Present when the vision model answered; absent on fallback or old sessions. */
  ai?: AiResult | null;
  /** Agent observations are suggestions, not verified damage or fitment. */
  agentObservation?: { focusId: VespaPartId; detailNote: string; band: "high" | "medium" | "low" | null } | null;
  /** SAM outline the user drew; absent until first outline. */
  sam?: SamOverlay | null;
  /** User confirmation is tied to a particular SAM object and is cleared on re-outline. */
  pilotSelection?: { componentId: GtsPilotId; objectId: string; confirmedAt: string } | null;
  /** User's own words about the problem (Entry B); absent when skipped. */
  concern?: string;
  /** Prepared subcomponent the user settled on; absent until chosen. */
  subPart?: SubId | null;
  /** Guided-question answer id; absent until answered. */
  guidedAnswer?: string | null;
};

const KEY = "italian-rides-inspections";
const NOTICE_KEY = "italian-rides-inspections-evicted";

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

/**
 * Persist a session. When quota forces out older sessions, they go
 * oldest-first and the count is left in NOTICE_KEY for the workspace
 * banner — eviction is always reported, never silent. Callers must not
 * navigate on ok:false or the workspace shows "not found".
 */
export function saveSession(s: InspectionSession): SaveResult {
  let result: SaveResult;
  try {
    result = boundedSave(readAll(), s, 12, (raw) =>
      localStorage.setItem(KEY, raw),
    );
  } catch {
    return { ok: false, evicted: 0 };
  }
  if (result.ok && result.evicted > 0) {
    try {
      const prev = Number(localStorage.getItem(NOTICE_KEY) ?? 0) || 0;
      localStorage.setItem(NOTICE_KEY, String(prev + result.evicted));
    } catch {
      /* notice is best-effort; the save itself succeeded */
    }
  }
  return result;
}

/** Delete all stored inspections. Only call after explicit user consent. */
export function clearInspections(): boolean {
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(KEY);
    localStorage.removeItem(NOTICE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Read and clear the pending eviction notice count. */
export function takeEvictionNotice(): number {
  try {
    if (typeof window === "undefined") return 0;
    const n = Number(localStorage.getItem(NOTICE_KEY) ?? 0) || 0;
    if (n > 0) localStorage.removeItem(NOTICE_KEY);
    return n;
  } catch {
    return 0;
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

/** Model-reported confidence as a neutral band, never a precise percent. */
export function confidenceBand(c: number): "high" | "medium" | "low" {
  return c >= 0.85 ? "high" : c >= 0.6 ? "medium" : "low";
}



/**
 * Validate the /api/inspect payload. Unknown component ids are dropped.
 * An empty list is a valid no-match; null means the shape was unusable
 * and the caller must fall back.
 */
export function parseAiResult(raw: unknown, model: string): AiResult | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.components)) return null;
  const ids = new Set(VESPA_PARTS.map((p) => p.id));
  const components: AiComponent[] = [];
  for (const c of r.components) {
    if (typeof c !== "object" || c === null) continue;
    const o = c as Record<string, unknown>;
    if (typeof o.id !== "string" || !ids.has(o.id as VespaPartId)) continue;
    const confidence =
      typeof o.confidence === "number"
        ? Math.min(1, Math.max(0, o.confidence))
        : 0;
    components.push({
      id: o.id,
      label: typeof o.label === "string" ? o.label : o.id,
      confidence,
      condition: typeof o.condition === "string" ? o.condition : "",
    });
  }
  components.sort((a, b) => b.confidence - a.confidence);
  return {
    model,
    modelGuess: typeof r.modelGuess === "string" ? r.modelGuess : null,
    components,
    notes: typeof r.notes === "string" ? r.notes : "",
  };
}
