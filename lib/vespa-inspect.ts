/** Shared inspection-point metadata for the /inspect 3D viewer. */

export type VespaPartId =
  | "frame"
  | "legshield"
  | "handlebar"
  | "wheels"
  | "engine"
  | "seat";

export type VespaPart = {
  id: VespaPartId;
  label: string;
  note: string;
};

export const VESPA_PARTS: VespaPart[] = [
  {
    id: "frame",
    label: "Frame",
    note: "Pressed-steel step-through monocoque — the Vespa signature.",
  },
  {
    id: "legshield",
    label: "Legshield",
    note: "Curved front shield with horn cover and glovebox on later models.",
  },
  {
    id: "handlebar",
    label: "Handlebar",
    note: "Faired headset on GS/SS; exposed bar on utility models.",
  },
  {
    id: "wheels",
    label: "Wheels",
    note: "9in smallframe to 10–12in; single-sided front fork.",
  },
  {
    id: "engine",
    label: "Engine",
    note: "Side-mounted unit: 2-stroke classic, LEADER/Quasar 4-stroke, then electric.",
  },
  {
    id: "seat",
    label: "Seat & rack",
    note: "Solo saddle or dual seat with rear carrier.",
  },
];

/** Filenames probed under /models/ for the licensed-model slot. */
export const GLB_CANDIDATES = [
  "vespa.glb",
  "vespa-et3.glb",
  "body.glb",
  "wheel.glb",
  "scooter.glb",
] as const;

/** Visible CC attribution for staged GLBs (full record: public/models/CREDITS.txt). */
export const GLB_CREDITS: Record<
  string,
  { label: string; author: string; license: string; url: string | null }
> = {
  "vespa.glb": {
    label: "Vespa PX museum study",
    author: "Owner-provided",
    license: "Licence to confirm",
    url: null,
  },
  "vespa-et3.glb": {
    label: "Vespa Primavera ET3",
    author: "Nadia Ribitis",
    license: "CC-BY-4.0",
    url: "https://sketchfab.com/3d-models/old-scooter-5e9b5072b2224ba982366490ad5f31d9",
  },
};
