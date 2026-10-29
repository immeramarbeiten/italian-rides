import type { EvidenceTier } from "./evidence";

/**
 * Dataset 1 — Manufacturer → Family → Exact variant.
 * Model names alone are never technical identifiers: a 1978 PX and a late
 * PX may look alike and differ mechanically. Specs, parts and procedures
 * key off variant records, never off display names.
 */

export type Manufacturer = {
  id: string;
  name: string;
  country: string;
  note: string;
};

export type Family = {
  id: string;
  manufacturerId: string;
  name: string;
  /** Commercial names sold under this family. */
  commercialModels: string[];
  note: string;
  sources: string[];
};

export type VariantScope =
  | { kind: "exact"; framePrefix: string }
  | { kind: "range"; note: string }
  | { kind: "family-wide"; note: string };

export type ModelVariant = {
  id: string;
  familyId: string;
  commercialModel: string;
  framePrefix: string | null;
  engineCode: string | null;
  productionStart: number | null;
  productionEnd: number | null;
  /** Documented revision boundaries inside the range (frame numbers). */
  revisionBoundaries: string[];
  markets: string[];
  /** Chassis ranges where fitted components change. */
  chassisRanges: { status: "pending" | "documented"; note: string };
  scope: VariantScope;
  historicalStatus: string;
  sources: string[];
  evidence: EvidenceTier;
  /** Research coverage checklist — honest gaps, not silent ones. */
  pendingFields: string[];
};

export const MANUFACTURERS: Manufacturer[] = [
  { id: "piaggio", name: "Piaggio", country: "Italy", note: "Parent manufacturer; Vespa marque since 1946." },
];

export const FAMILIES: Family[] = [
  {
    id: "vespa-px",
    manufacturerId: "piaggio",
    name: "Vespa PX",
    commercialModels: ["P125X", "P150X", "P200E"],
    note: "Largeframe range from 1977–78; best-selling Vespa line. Individual configurations differ — research per variant.",
    sources: ["scooterhelp", "sip-modelbase"],
  },
];

/**
 * Technical pilot (§7 Package B): one exact P125X/VNX1T configuration.
 * Research starting points from the SIP catalogue entry — NOT yet
 * reconciled against an original factory manual for every year.
 */
export const VARIANTS: ModelVariant[] = [
  {
    id: "p125x-vnx1t",
    familyId: "vespa-px",
    commercialModel: "P125X",
    framePrefix: "VNX1T",
    engineCode: null,
    productionStart: 1977,
    productionEnd: 1982,
    revisionBoundaries: [],
    markets: [],
    chassisRanges: {
      status: "pending",
      note: "SIP documents frame-number boundaries with chassis filtering; extract values with permission, do not copy diagrams.",
    },
    scope: { kind: "exact", framePrefix: "VNX1T" },
    historicalStatus: "Discontinued production range",
    sources: ["sip-modelbase"],
    evidence: "unverified",
    pendingFields: [
      "Factory engine code",
      "Markets (IT/AT/DE/UK splits)",
      "Chassis-number boundaries",
      "Revision boundaries within 1977–1982",
      "Regional names / homologation codes",
    ],
  },
];

export const variantById = (id: string) =>
  VARIANTS.find((v) => v.id === id) ?? null;

export const familyById = (id: string) =>
  FAMILIES.find((f) => f.id === id) ?? null;
