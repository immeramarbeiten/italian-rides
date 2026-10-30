import type { VespaPartId } from "./vespa-inspect";
import type { GtsPilotId } from "./gts-pilot";

/**
 * Friend-flow layer: two-level selection (assembly → prepared subcomponent),
 * one static guided question per prepared assembly, and a conservative
 * keyword suggestion over the user's own words. Copy is static and reviewed
 * by design — the app suggests and asks, never diagnoses.
 */

export type SubId = "mirror-head" | "mirror-stem" | "tyre-tread" | "tyre-sidewall";

export type SubInfo = {
  id: SubId;
  parent: VespaPartId;
  label: string;
  /** Plain-language orientation. Editorial, not a workshop manual. */
  blurb: string;
  source: string;
};

export const SUBCOMPONENTS: Record<SubId, SubInfo> = {
  "mirror-head": {
    id: "mirror-head",
    parent: "handlebar",
    label: "Mirror head + glass",
    blurb:
      "The head pivots on the stalk so you can aim it; on many modern Vespas the glass is bonded into the head rather than sold separately — your variant's parts book is the authority. A cracked glass or a head that will not hold position means replacement, not adjustment.",
    source:
      "Editorial orientation. No verified part number or mirror procedure on file — see the bounded mirror check.",
  },
  "mirror-stem": {
    id: "mirror-stem",
    parent: "handlebar",
    label: "Stem + mounting area",
    blurb:
      "The stalk mounts to the handlebar or headset; a 'loose mirror' often means movement at that base joint — confirm by checking where the play is before deciding anything. Stripped threads or a bent stalk are shop work.",
    source:
      "GTS 125 Owner's Guide p.54 (mirror removal mentioned in headlamp access); Workshop Manual p.266 op. 004066 (operation code, not a part number).",
  },
  "tyre-tread": {
    id: "tyre-tread",
    parent: "wheels",
    label: "Tread band",
    blurb:
      "The contact band carries wear indicators: when the tread wears flush with them, the tyre is done. Read them in good light with the wheel turned, not from a photo alone.",
    source:
      "GTS 125 Owner's Guide pp.24, 39–40 (wear + cold pressure). Values withheld until a variant match is reviewed.",
  },
  "tyre-sidewall": {
    id: "tyre-sidewall",
    parent: "wheels",
    label: "Sidewall + markings",
    blurb:
      "The sidewall carries the size and pressure markings and takes the most abuse from kerbs. Any cut, bulge or cracking here means a suitably equipped workshop — never a home repair, and never ride on it.",
    source:
      "GTS 125 Owner's Guide p.60 (replacement = equipped workshop).",
  },
};

export type GuidedAnswer = {
  id: string;
  label: string;
  /** Subcomponent to highlight, or null when the answer spans areas. */
  sub: SubId | null;
  /** One honest follow-through line. Never a diagnosis. */
  note: string;
};

export type GuidedQuestion = {
  question: string;
  answers: GuidedAnswer[];
};

/** Only assemblies with prepared, sourced content get a question. */
export const GUIDED_QUESTIONS: Partial<Record<VespaPartId, GuidedQuestion>> = {
  handlebar: {
    question: "Where is the looseness — or what do you see?",
    answers: [
      {
        id: "stem",
        label: "Stem / mount moves",
        sub: "mirror-stem",
        note: "Check the joint where the stalk meets the bar first, and see whether the play is there or in the head.",
      },
      {
        id: "head",
        label: "Head / glass moves or is damaged",
        sub: "mirror-head",
        note: "A head that will not hold position needs replacing — a shop job.",
      },
      {
        id: "unsure",
        label: "Not sure",
        sub: null,
        note: "Compare both areas in the reference view before deciding anything.",
      },
    ],
  },
  wheels: {
    question: "What is your concern about the tyre?",
    answers: [
      {
        id: "tread",
        label: "Tread wear",
        sub: "tyre-tread",
        note: "Find the wear indicators in the grooves — flush with the tread means done.",
      },
      {
        id: "damage",
        label: "Cut, bulge, or something embedded",
        sub: null,
        note: "Any of these means a suitably equipped workshop. Do not ride on it.",
      },
      {
        id: "pressure",
        label: "Pressure",
        sub: null,
        note: "Pressure cannot be judged from a photo — check cold with a gauge, using your variant's values.",
      },
    ],
  },
};

export function parentOf(sub: SubId): VespaPartId {
  return SUBCOMPONENTS[sub].parent;
}

export function subLabel(sub: SubId): string {
  return SUBCOMPONENTS[sub].label;
}

/**
 * Single-source-of-truth bridge: a mask-bound pilot confirmation resolves
 * to its parent assembly, so the guided flow, bounded action and Garage
 * draft always describe the same component the pilot confirmed.
 */
const PILOT_PARENT: Record<GtsPilotId, VespaPartId> = {
  "gts125-mirror-left": "handlebar",
  "gts125-mirror-right": "handlebar",
  "gts125-front-tyre": "wheels",
};

export function pilotToAssembly(id: GtsPilotId): VespaPartId {
  return PILOT_PARENT[id];
}

/**
 * Generic repair guides are PX-pattern procedures with PX torque values.
 * They apply only to PX and classic machines — never to modern families
 * or unknown scooters, where they would mislead more than help.
 */
export function pxGuidesApply(family: string): boolean {
  return family === "PX" || family === "Classic / other";
}

const RULES: { part: VespaPartId; answer: string; words: string[] }[] = [
  { part: "handlebar", answer: "head", words: ["glass", "crack", "reflect", "shatter", "face"] },
  { part: "handlebar", answer: "stem", words: ["stalk", "stem", "mount", "base", "thread", "bolt", "screw"] },
  { part: "wheels", answer: "tread", words: ["tread", "wear", "worn", "bald", "indicator"] },
  { part: "wheels", answer: "damage", words: ["cut", "bulge", "nail", "puncture", "slash", "embedded", "crack"] },
  { part: "wheels", answer: "pressure", words: ["pressure", "psi", "inflate", "underinfl", "soft"] },
];

/**
 * Suggest (never decide) a guided answer from the user's own words.
 * Returns null — meaning "ask the user" — for empty, ambiguous
 * ("my mirror is loose") or off-topic text.
 */
export function suggestAnswer(concern: string, part: VespaPartId): string | null {
  const lower = concern.toLowerCase();
  if (lower.trim().length < 3) return null;
  const hits = RULES.filter(
    (r) => r.part === part && r.words.some((w) => lower.includes(w)),
  ).map((r) => r.answer);
  const unique = [...new Set(hits)];
  return unique.length === 1 ? unique[0] : null;
}
