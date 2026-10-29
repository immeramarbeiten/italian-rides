/**
 * "Inside the Vespa" field-guide data. Two documented GTS configurations
 * with exact manual scope — never assume one manual covers both.
 * Scopes and page numbers verified against the PDFs in User manuals/.
 */

export type FuelSetup = {
  kind: "carburettor" | "injection";
  /** Simplified flow, tank → engine, for the diagram. */
  flow: string[];
  understand: string;
  explore: string;
};

export type DocumentedVariant = {
  id: string;
  name: string;
  chassisPrefix: string;
  enginePrefix: string;
  fuel: FuelSetup;
  source: {
    manual: string;
    pages: string;
    scope: string;
  };
};

export const FIELD_GUIDE_VARIANTS: DocumentedVariant[] = [
  {
    id: "gts125",
    name: "GTS 125",
    chassisPrefix: "ZAPM31300000",
    enginePrefix: "M315M",
    fuel: {
      kind: "carburettor",
      flow: ["Tank ≈10 L (2 L reserve)", "Electrical fuel pump", "Keihin CVEK-30 carburettor", "Intake → engine"],
      understand: "The fuel system supplies the engine with fuel.",
      explore:
        "This documented version meters fuel with a Keihin CVEK-30 depression carburettor (max jet 108, minimum jet 38), fed by an electrical fuel pump.",
    },
    source: {
      manual: "Vespa GTS 125 Workshop Manual",
      pages: "PDF pp. 9–12 (identification + characteristics)",
      scope: "GTS 125 · chassis ZAPM313 · engine M315M only",
    },
  },
  {
    id: "gtsie2009",
    name: "GTS Super 125 i.e. (2009)",
    chassisPrefix: "ZAPM45100000",
    enginePrefix: "M451M",
    fuel: {
      kind: "injection",
      flow: ["Tank", "Electric fuel pump", "Fuel injector", "Intake → engine"],
      understand: "The fuel system supplies the engine with fuel.",
      explore:
        "This documented version meters fuel with electronic injection and an electric fuel pump — no carburettor, no jets to clean. The wiring diagram names the injector, fuel pump and engine-temperature sensor.",
    },
    source: {
      manual: "Vespa GTS Super 125 i.e. (2009) Workshop Manual",
      pages: "PDF pp. 8–9 (identification + engine data)",
      scope: "GTS Super 125 i.e. (2009) · chassis ZAPM451 · engine M451M only",
    },
  },
];

export type GuideSystem = {
  id: string;
  label: string;
  documented: boolean;
};

export const GUIDE_SYSTEMS: GuideSystem[] = [
  { id: "fuel", label: "Fuel", documented: true },
  { id: "engine", label: "Engine", documented: false },
  { id: "brakes", label: "Brakes", documented: false },
  { id: "electrical", label: "Electrical", documented: false },
  { id: "transmission", label: "Transmission", documented: false },
];
