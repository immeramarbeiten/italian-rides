import type { VespaPartId } from "./vespa-inspect";
import type { SamMatch } from "./sam-parse";
import { confidenceBand, parseAiResult, type AiResult } from "./inspect-session";
import { outlinePhrase, pickFocus, type Box } from "./agent-decide";
import { suggestAnswer } from "./guided-inspect";

/**
 * Client-side agentic inspect runner. It chains the existing server routes
 * (/api/inspect, /api/sam) with visible decisions: look → focus → outline
 * → zoom → conclude. The API key never leaves the server routes; this
 * orchestrates their calls and narrates each step for the trace UI.
 *
 * Pure decision helpers (pickFocus, padBox, outlinePhrase) are node-tested;
 * the runner itself needs fetch + canvas, so it is covered by the live
 * browser cases in LIVE_TEST.md.
 */

export type AgentStepId = "look" | "focus" | "outline" | "zoom" | "conclude";

export type AgentEvent = {
  step: AgentStepId;
  status: "start" | "done" | "fail";
  detail: string;
};

export type AgentResult = {
  /** Top suggestion, or null when nothing was recognizable. */
  focusId: VespaPartId | null;
  focusLabel: string;
  band: "high" | "medium" | "low" | null;
  /** First SAM match for the focus, when outlining succeeded. */
  mask: SamMatch | null;
  /** Close-up condition note from the zoom step, when available. */
  detailNote: string;
  overview: AiResult | null;
  trace: AgentEvent[];
};

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Run the loop. At most 4 model calls (overview, outline, zoom, and no
 * more). Every step emits an event first, so the UI narrates honestly —
 * including failures and early stops.
 */
export async function runInspectAgent(
  args: {
    imageDataUrl: string;
    concern: string;
    cropToBox: (box: Box) => Promise<string | null>;
  },
  onEvent: (e: AgentEvent) => void,
): Promise<AgentResult> {
  const trace: AgentEvent[] = [];
  const emit = (e: AgentEvent) => {
    trace.push(e);
    onEvent(e);
  };
  const empty: AgentResult = {
    focusId: null,
    focusLabel: "",
    band: null,
    mask: null,
    detailNote: "",
    overview: null,
    trace,
  };

  // 1. Look.
  emit({ step: "look", status: "start", detail: "Asking Spark what is visible…" });
  const seen = await postJson<{ model?: unknown; result?: unknown }>(
    "/api/inspect",
    { image: args.imageDataUrl, concern: args.concern },
  );
  const overview = seen
    ? parseAiResult(seen.result, typeof seen.model === "string" ? seen.model : "?")
    : null;
  if (!overview || overview.components.length === 0) {
    emit({
      step: "look",
      status: "fail",
      detail: overview ? "Nothing recognizable — stopping." : "Identification failed — stopping.",
    });
    return { ...empty, overview, trace };
  }
  emit({
    step: "look",
    status: "done",
    detail: `Sees ${overview.components.length} candidate${overview.components.length === 1 ? "" : "s"}.`,
  });

  // 2. Focus.
  emit({ step: "focus", status: "start", detail: "Deciding what deserves attention…" });
  const pick = pickFocus(overview.components, args.concern, suggestAnswer);
  if (!pick.id) {
    emit({ step: "focus", status: "fail", detail: "No focusable component." });
    return { ...empty, overview, trace };
  }
  emit({
    step: "focus",
    status: "done",
    detail: `Focus: ${pick.label}${pick.suggestedAnswer ? " (your words point here too)" : ""}.`,
  });

  // 3. Outline.
  emit({ step: "outline", status: "start", detail: `Asking SAM to outline it…` });
  const outlined = await postJson<{ matches?: SamMatch[] }>("/api/sam", {
    image: args.imageDataUrl,
    mode: "phrase",
    phrase: outlinePhrase(pick.id, pick.label),
  });
  const mask = outlined?.matches?.[0] ?? null;
  if (!mask) {
    emit({ step: "outline", status: "fail", detail: "No mask — keeping the suggestion only." });
    emit({ step: "conclude", status: "done", detail: "Done without an outline." });
    return {
      ...empty,
      overview,
      focusId: pick.id,
      focusLabel: pick.label,
      band: confidenceBand(overview.components[0].confidence),
      trace,
    };
  }
  emit({ step: "outline", status: "done", detail: "Mask drawn." });

  // 4. Zoom: crop to the mask and re-identify the close-up.
  emit({ step: "zoom", status: "start", detail: "Zooming in for a closer look…" });
  const crop = await args.cropToBox(mask.box);
  let detailNote = "";
  if (crop) {
    const zoomed = await postJson<{ model?: unknown; result?: unknown }>(
      "/api/inspect",
      { image: crop, concern: args.concern },
    );
    const detail = zoomed ? parseAiResult(zoomed.result, "?") : null;
    const cond = detail?.components.find((c) => c.id === pick.id)?.condition;
    if (cond) detailNote = cond;
  }
  emit({
    step: "zoom",
    status: "done",
    detail: detailNote ? `Close-up: ${detailNote}.` : "Close-up added nothing new.",
  });

  // 5. Conclude.
  emit({ step: "conclude", status: "done", detail: "Suggestion ready — you confirm." });
  return {
    focusId: pick.id,
    focusLabel: pick.label,
    band: confidenceBand(overview.components[0].confidence),
    mask,
    detailNote,
    overview,
    trace,
  };
}
