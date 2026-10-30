/** Canonical pilot IDs describe user-confirmed components, not OEM part numbers. */
export const GTS_PILOT_COMPONENTS = {
  "gts125-mirror-left": { label: "Left mirror", kind: "mirror", side: "left" },
  "gts125-mirror-right": { label: "Right mirror", kind: "mirror", side: "right" },
  "gts125-front-tyre": { label: "Front tyre", kind: "tyre", side: null },
} as const;
export type GtsPilotId = keyof typeof GTS_PILOT_COMPONENTS;
export function isGtsPilotId(value: string): value is GtsPilotId {
  return Object.hasOwn(GTS_PILOT_COMPONENTS, value);
}
/** A family/displacement is not enough to verify a catalogue configuration. */
export function pilotScope(family: string, engine: string): "reference" | "outside" | "unknown" {
  if (family && family !== "GTS") return "outside";
  if (engine && engine !== "125") return "outside";
  return family === "GTS" && engine === "125" ? "reference" : "unknown";
}
