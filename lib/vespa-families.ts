/**
 * Mechanic-facing model families: daily riders first, collectors second.
 * Zero imports on purpose — this file must stay dependency-free so it can
 * be unit-tested with plain node.
 */

export type FamilyRecord = {
  /** Short select label, e.g. "GTS". */
  label: string;
  /** Engine options in cc, or ["Electric"]. */
  engines: string[];
  /** First production year, or null when unknown. */
  from: number | null;
  /** Last production year, or null when still built. */
  to: number | null;
  /** Matching archive model name (lib/vespa-data), or null when none. */
  archive: string | null;
};

export const FAMILIES: FamilyRecord[] = [
  { label: "GTS", engines: ["125", "250", "300"], from: 2005, to: null, archive: "Vespa GTS/Granturismo" },
  { label: "GT", engines: ["125", "200"], from: 2003, to: 2007, archive: null },
  { label: "Primavera (modern)", engines: ["50", "125", "150"], from: 2013, to: null, archive: null },
  { label: "Sprint", engines: ["50", "125", "150"], from: 2014, to: null, archive: null },
  { label: "LX", engines: ["50", "125", "150"], from: 2005, to: 2013, archive: null },
  { label: "S", engines: ["50", "125", "150"], from: 2007, to: 2014, archive: null },
  { label: "ET4", engines: ["50", "125", "150"], from: 1996, to: 2005, archive: "Vespa ET4" },
  { label: "946", engines: ["125", "150"], from: 2012, to: null, archive: "Vespa 946" },
  { label: "Elettrica", engines: ["Electric"], from: 2018, to: null, archive: "Vespa Elettrica" },
  { label: "PX", engines: ["125", "150", "200"], from: 1977, to: 2017, archive: "Vespa PX 125/150/200" },
  { label: "Classic / other", engines: ["50", "90", "100", "125", "150", "160", "180", "200"], from: null, to: null, archive: null },
];



/** Map an archive model name to a family label for ?model= deep links. */
export function familyFromArchive(archiveName: string): string {
  return FAMILIES.find((f) => f.archive === archiveName)?.label ?? "";
}

/** Engine options for a family label, or every engine when unsure. */
export function engineOptions(family: string): string[] {
  const found = FAMILIES.find((f) => f.label === family);
  if (found) return found.engines;
  const all = new Set<string>();
  for (const f of FAMILIES) for (const e of f.engines) all.add(e);
  return [...all].sort((a, b) => Number.parseInt(a) - Number.parseInt(b));
}

/**
 * Soft plausibility check: warns when the typed year falls outside the
 * family's production run. Never blocks — returns null when fine or unsure.
 */
export function plausibilityWarning(family: string, yearInput: string): string | null {
  const found = FAMILIES.find((f) => f.label === family);
  const year = Number.parseInt(yearInput.trim(), 10);
  if (!found || !Number.isFinite(year) || found.from === null) return null;
  if (year < found.from) {
    return `The ${found.label} arrived in ${found.from} — check the year.`;
  }
  if (found.to !== null && year > found.to) {
    return `The ${found.label} was built ${found.from}–${found.to} — check the year.`;
  }
  return null;
}
