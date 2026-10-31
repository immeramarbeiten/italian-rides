import type { VespaPartId } from "./vespa-inspect";

/**
 * Pure agent decisions (node-tested). The fetch/canvas runner lives in
 * ./agent.ts and is covered by the live browser cases instead.
 */

const PHRASE: Record<string, string> = {
  engine: "engine",
  wheels: "wheel",
  handlebar: "handlebar",
  frame: "scooter frame",
  legshield: "front legshield",
  seat: "seat",
};

/** Short noun SAM understands for an assembly id. */
export function outlinePhrase(id: string, fallback: string): string {
  return PHRASE[id] ?? fallback;
}

export type FocusPick = {
  id: VespaPartId | null;
  label: string;
  /** Guided answer the user's words suggest, if any. */
  suggestedAnswer: string | null;
};

/**
 * Decide what deserves attention: the top AI component, annotated with any
 * guided suggestion from the user's own words. Never invents a component —
 * empty stays empty.
 */
export function pickFocus(
  components: { id: string; label: string }[],
  concern: string,
  suggest: (words: string, part: VespaPartId) => string | null,
): FocusPick {
  const top = components[0];
  if (!top) return { id: null, label: "", suggestedAnswer: null };
  const id = top.id as VespaPartId;
  return {
    id,
    label: top.label,
    suggestedAnswer: suggest(concern, id),
  };
}

export type Box = { x1: number; y1: number; x2: number; y2: number };

/** Pad a box by a fraction, clamped to the frame. */
export function padBox(
  box: Box,
  frameW: number,
  frameH: number,
  frac = 0.15,
): Box {
  const w = box.x2 - box.x1;
  const h = box.y2 - box.y1;
  return {
    x1: Math.max(0, Math.round(box.x1 - w * frac)),
    y1: Math.max(0, Math.round(box.y1 - h * frac)),
    x2: Math.min(frameW, Math.round(box.x2 + w * frac)),
    y2: Math.min(frameH, Math.round(box.y2 + h * frac)),
  };
}
