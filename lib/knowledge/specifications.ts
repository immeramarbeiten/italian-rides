import { VESPA_MODELS } from "../vespa-data";
import type { EvidenceTier } from "./evidence";

/**
 * Dataset 2 — Specifications. Every value carries its source and tier.
 * Two layers:
 * - P125X pilot specs: only what the research brief confirms (SIP entry),
 *   flagged unverified until reconciled against a factory manual.
 * - Milestone specs: migrated from the current UI's paraphrased facts so
 *   nothing is silently dropped; all unverified, legacy labels preserved
 *   for the source-registration pass.
 */

export type SpecGroup =
  | "identity"
  | "engine"
  | "transmission"
  | "chassis"
  | "dimensions"
  | "performance"
  | "production";

export type SpecRecord = {
  id: string;
  /** Variant id, or `milestone:<model name>` for archive-level facts. */
  appliesTo: string;
  group: SpecGroup;
  field: string;
  value: string;
  sources: string[];
  /** Original citation labels where the value was migrated from the UI. */
  legacyLabels?: string[];
  evidence: EvidenceTier;
  note?: string;
};

export const P125X_SPECS: SpecRecord[] = [
  { id: "p125x-frame-prefix", appliesTo: "p125x-vnx1t", group: "identity", field: "Frame prefix", value: "VNX1T", sources: ["sip-modelbase"], evidence: "unverified", note: "Catalogue entry; reconcile against factory manual." },
  { id: "p125x-commercial", appliesTo: "p125x-vnx1t", group: "identity", field: "Commercial model", value: "P125X (Vespa PX family)", sources: ["sip-modelbase"], evidence: "unverified" },
  { id: "p125x-years", appliesTo: "p125x-vnx1t", group: "production", field: "Catalogued range", value: "1977–1982 (SIP catalogue)", sources: ["sip-modelbase"], evidence: "unverified", note: "Catalogue range, not a claim of identical components across years." },
  { id: "p125x-engine-class", appliesTo: "p125x-vnx1t", group: "engine", field: "Engine class", value: "125 cc two-stroke single", sources: ["sip-modelbase"], evidence: "unverified" },
  { id: "p125x-gearbox", appliesTo: "p125x-vnx1t", group: "transmission", field: "Gearbox", value: "4-speed manual", sources: ["sip-modelbase"], evidence: "unverified" },
  { id: "p125x-frame", appliesTo: "p125x-vnx1t", group: "chassis", field: "Frame", value: "Self-supporting pressed-steel monocoque", sources: ["sip-modelbase"], evidence: "unverified" },
];

/** Package B wants 20–30 specs; these fields are queued, not invented. */
export const P125X_PENDING_SPECS: { group: SpecGroup; field: string; source: string }[] = [
  { group: "engine", field: "Bore × stroke", source: "Factory manual via Scooterhelp (rights check)" },
  { group: "engine", field: "Compression ratio", source: "Factory manual" },
  { group: "engine", field: "Carburettor type", source: "SIP exploded views (permission) / manual" },
  { group: "engine", field: "Ignition type", source: "Factory manual" },
  { group: "performance", field: "Max power + rpm", source: "Factory manual" },
  { group: "performance", field: "Top speed", source: "Factory manual" },
  { group: "transmission", field: "Clutch type", source: "Factory manual" },
  { group: "transmission", field: "Final drive", source: "Factory manual" },
  { group: "chassis", field: "Front suspension", source: "Factory manual" },
  { group: "chassis", field: "Rear suspension", source: "Factory manual" },
  { group: "chassis", field: "Brakes front/rear", source: "Factory manual" },
  { group: "chassis", field: "Wheels / tyres", source: "Factory manual" },
  { group: "dimensions", field: "Length × width", source: "Factory manual" },
  { group: "dimensions", field: "Wheelbase", source: "Factory manual" },
  { group: "dimensions", field: "Seat height", source: "Factory manual" },
  { group: "dimensions", field: "Dry weight", source: "Factory manual" },
  { group: "dimensions", field: "Fuel capacity", source: "Factory manual" },
  { group: "identity", field: "Engine code", source: "Scooterhelp frame/engine prefix guide" },
];

/** Migrated 1:1 from the current UI so the archive keeps rendering. */
export const MILESTONE_SPECS: SpecRecord[] = VESPA_MODELS.flatMap((m, i) => {
  const key = `milestone:${m.m}`;
  return [
    { id: `ms-${i}-years`, appliesTo: key, group: "production" as SpecGroup, field: "Production years", value: m.y, sources: [], legacyLabels: m.src, evidence: "unverified" as EvidenceTier },
    { id: `ms-${i}-factory`, appliesTo: key, group: "production" as SpecGroup, field: "Factory", value: m.factory, sources: [], legacyLabels: m.src, evidence: "unverified" as EvidenceTier },
    { id: `ms-${i}-engine`, appliesTo: key, group: "engine" as SpecGroup, field: "Engine (summary)", value: m.engine, sources: [], legacyLabels: m.src, evidence: "unverified" as EvidenceTier },
    { id: `ms-${i}-facts`, appliesTo: key, group: "identity" as SpecGroup, field: "Highlights", value: m.facts, sources: [], legacyLabels: m.src, evidence: "unverified" as EvidenceTier },
  ];
});

export const specsFor = (appliesTo: string): SpecRecord[] =>
  [...P125X_SPECS, ...MILESTONE_SPECS].filter((s) => s.appliesTo === appliesTo);
