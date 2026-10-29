import type { VespaPartId } from "./vespa-inspect";

/**
 * Fault-finder data, transcribed as functional facts from owner's-manual
 * fault tables (German/Spanish/French originals, translated).
 *
 * Product rules (safety review):
 * - Source found ≠ safe, current, or applicable instruction.
 * - Anything involving petrol as a cleaner, fuel-system opening, or
 *   bump-starting is HISTORICAL: preserved in the archive, never guided.
 * - Model-specific values show only when the scooter matches the source
 *   manual's documented models. Everyone else gets general guidance.
 * - No manual text reproduced, no scans shipped.
 */

export type FaultLevel = "owner" | "dealer" | "historical";

export type FaultSource = {
  manual: string;
  pages: string;
  lang: string;
  /** Model names (garage `model` values) this source documents. */
  documents: string[];
};

export type FaultEntry = {
  id: string;
  group: "Won't start" | "Runs poorly" | "Lights & electrics" | "Fuel & oil";
  cause: string;
  /** Model-specific check. Shown only on documented-model match. */
  remedy: string;
  /** Model-free guidance. Always safe to show. */
  general: string;
  level: FaultLevel;
  relatedPart: VespaPartId;
  source: FaultSource;
};

const GS: FaultSource = {
  manual: "Vespa GS 150-3 owner's manual (VD2TS), fault tables",
  pages: "pp. 37–39",
  lang: "German original, translated",
  documents: ["Vespa 150 GS Gran Sport"],
};

const P200: FaultSource = {
  manual: "Vespa P200 owner's manual, fault-finding section",
  pages: "pp. 90–92",
  lang: "Spanish/French originals, translated",
  documents: ["Vespa PX 125/150/200"],
};

export const FAULT_GROUPS = [
  "Won't start",
  "Runs poorly",
  "Lights & electrics",
  "Fuel & oil",
] as const;

export const FAULTS: FaultEntry[] = [
  { id: "tank-empty", group: "Won't start", cause: "Fuel tank empty", remedy: "Switch the tap to Reserve and refuel as soon as possible.", general: "Check the fuel level and whether the tap has a Reserve position.", level: "owner", relatedPart: "engine", source: GS },
  { id: "tap-filter", group: "Won't start", cause: "Tap body or filter clogged (historical procedure)", remedy: "Historical: remove, wash in clean petrol, blow dry with compressed air. Petrol must not be used as a cleaning solvent.", general: "A clogged tap or filter starves the carburettor — have a workshop inspect it.", level: "historical", relatedPart: "engine", source: GS },
  { id: "no-fuel-carb", group: "Won't start", cause: "No fuel reaching the carburettor (historical procedure)", remedy: "Historical: detach the tap-to-carb line and check flow through the tap and nozzle seat. Fuel-system opening needs review for your exact vehicle.", general: "If fuel isn't reaching the carburettor, the tap, line or filter is suspect — workshop job.", level: "historical", relatedPart: "engine", source: GS },
  { id: "flooded", group: "Won't start", cause: "Flooded — fuel smell or wet plug", remedy: "Close the tap, remove the plug, kick through several times with the plug out, then refit and retry.", general: "Flooding clears by closing the fuel tap and turning the engine over with the plug removed.", level: "owner", relatedPart: "engine", source: GS },
  { id: "plug-fouled", group: "Won't start", cause: "Spark plug fouled", remedy: "Replace the plug; set the gap per the manual (GS: 0.6 mm).", general: "A fouled plug is a replace-don't-clean item — check the gap spec for your model.", level: "owner", relatedPart: "engine", source: GS },
  { id: "plug-broken", group: "Won't start", cause: "Plug insulation broken", remedy: "Replace the plug.", general: "Cracked plug insulation means replacement.", level: "owner", relatedPart: "engine", source: GS },
  { id: "points", group: "Won't start", cause: "Breaker points dirty, misadjusted or worn", remedy: "Clean with a points file; reset to 0.4 mm with a feeler gauge; replace when worn.", general: "Points ignition needs workshop tools — gap, timing and wear all matter.", level: "dealer", relatedPart: "engine", source: GS },
  { id: "timing", group: "Won't start", cause: "Ignition mistimed", remedy: "Correct the 27° advance with a timing tool and degree disc.", general: "Ignition timing is a workshop measurement, not a guess.", level: "dealer", relatedPart: "engine", source: GS },
  { id: "condenser", group: "Won't start", cause: "Condenser or coil failed; HT lead broken", remedy: "Replace condenser or coil; replace or resolder the HT lead.", general: "No spark with a good plug points at condenser, coil or lead.", level: "dealer", relatedPart: "engine", source: GS },
  { id: "jets", group: "Runs poorly", cause: "Jets clogged (main, idle, needle)", remedy: "Remove the jets and blow through; dry with compressed air. Never clear a jet with wire or a needle — it damages the bore.", general: "Clogged jets need removal and compressed air — never wire.", level: "owner", relatedPart: "engine", source: GS },
  { id: "float", group: "Runs poorly", cause: "Float punctured or chamber misaligned", remedy: "Replace a punctured float; mount the chamber exactly vertical.", general: "Suspect the float if fuel level in the carburettor misbehaves.", level: "owner", relatedPart: "engine", source: GS },
  { id: "airfilter", group: "Runs poorly", cause: "Air filter clogged (historical procedure)", remedy: "Historical: wash in clean petrol. Petrol must not be used as a cleaning solvent — use the cleaner your manual specifies.", general: "A clogged air filter chokes the engine — clean or replace per your manual.", level: "historical", relatedPart: "engine", source: GS },
  { id: "choke", group: "Runs poorly", cause: "Choke stuck closed", remedy: "Free the flap and oil it.", general: "A stuck choke floods some running and starves other — check it moves freely.", level: "owner", relatedPart: "engine", source: GS },
  { id: "compression", group: "Runs poorly", cause: "Low compression", remedy: "Check the plug and cylinder-head tightness.", general: "Low compression points at plug seating, head tightness or top-end wear.", level: "owner", relatedPart: "engine", source: P200 },
  { id: "consumption", group: "Runs poorly", cause: "Poor performance, high consumption", remedy: "Check the starter lever isn't stuck closed; free and grease it.", general: "Check the starter/enrichment lever returns fully.", level: "owner", relatedPart: "engine", source: P200 },
  { id: "terminals", group: "Lights & electrics", cause: "Terminals loose or disconnected", remedy: "Reconnect and tighten.", general: "Check battery and lamp terminals are tight and clean.", level: "owner", relatedPart: "handlebar", source: P200 },
  { id: "bulb", group: "Lights & electrics", cause: "Bulb blown", remedy: "Replace following the manual's bulb instructions.", general: "Confirm the correct bulb type before replacing.", level: "owner", relatedPart: "handlebar", source: P200 },
  { id: "aim", group: "Lights & electrics", cause: "Headlamp aimed wrong", remedy: "Re-aim the headlamp.", general: "Headlamp aim is adjustable — check it against a wall, not traffic.", level: "owner", relatedPart: "handlebar", source: P200 },
  { id: "persist", group: "Lights & electrics", cause: "Fault persists after the checks", remedy: "See a dealer workshop.", general: "Persistent electrical faults need a workshop with a wiring diagram.", level: "dealer", relatedPart: "handlebar", source: P200 },
  { id: "mix-ratio", group: "Fuel & oil", cause: "Wrong premix ratio", remedy: "Run 1:15 petrol-to-oil — 65 cc of oil per litre of petrol — with 2T oil or SAE 30 single-grade.", general: "Premix two-strokes need the ratio from their own manual — never guess.", level: "owner", relatedPart: "engine", source: GS },
];

/** Start observations for "Won't start" → relevant fault subsets. */
export const START_OBSERVATIONS: {
  id: string;
  label: string;
  faultIds: string[];
  note: string;
}[] = [
  { id: "nothing", label: "Nothing happens", faultIds: [] as string[], note: "No manual-sourced checks cover a dead starter yet — check the kill switch, battery and fuses, or open a workshop case." },
  { id: "turns", label: "The engine turns but doesn't start", faultIds: ["tank-empty", "flooded", "plug-fouled", "plug-broken", "points", "timing", "condenser"], note: "" },
  { id: "brief", label: "It starts briefly, then stops", faultIds: ["tank-empty", "flooded", "jets", "float", "choke"], note: "" },
  { id: "unsure", label: "I'm not sure", faultIds: ["tank-empty", "flooded", "plug-fouled", "plug-broken", "points", "timing", "condenser", "jets", "float", "choke"], note: "When unsure, read the possible causes, then save the symptom as a workshop case." },
];
