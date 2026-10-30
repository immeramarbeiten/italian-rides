import type { VespaPartId } from "./vespa-inspect";

export type BoundedAction = {
  title: string;
  /** Owner-check walks the user through; note stays descriptive + referral. */
  mode: "owner-check" | "note";
  lines: string[];
  source: string;
};

/**
 * The only two model-adjacent actions the app asserts. Everything else
 * stays illustrative or refers out. Copy is static and conservative by
 * design — never generate repair instructions at runtime.
 */
export const BOUNDED_ACTIONS: Partial<Record<VespaPartId, BoundedAction>> = {
  handlebar: {
    title: "Mirror check",
    mode: "note",
    lines: [
      "Check the stalk mount is tight and the glass is intact — a loose mirror vibrates out of adjustment.",
      "If the mount threads are stripped, the stalk is bent, or the mirror will not hold position: stop, a shop should replace it.",
      "No verified part number or full mirror procedure is on file, so this stays a check, not a repair.",
    ],
    source:
      "GTS 125 Owner's Guide p.54 (mirror removal mentioned in headlamp access); Workshop Manual p.266 lists op. 004066 (operation code, not a part number). Applicability to your exact variant unreviewed.",
  },
  wheels: {
    title: "Tyre pressure + wear check",
    mode: "owner-check",
    lines: [
      "Check pressure cold with a gauge; use the values for your exact variant (owner's guide or sidewall).",
      "Look for wear indicators, cuts, bulges, or uneven wear — any of these means a suitably equipped workshop, not a home fix.",
      "Never judge tread safety or roadworthiness from a photo.",
    ],
    source:
      "GTS 125 Owner's Guide pp.24, 39–40 (wear + cold pressure), p.60 (replacement = equipped workshop). Values withheld until a variant match is reviewed.",
  },
};
