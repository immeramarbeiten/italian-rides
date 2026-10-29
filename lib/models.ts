import { VESPA_MODELS, type VespaModel } from "./vespa-data";

export type EngineType = "2-stroke" | "4-stroke" | "electric";
export type ModelFamily = "pioneer" | "largeframe" | "smallframe" | "modern";
export type ModelCategory = "classic" | "modern";

export type ModelMeta = {
  slug: string;
  family: ModelFamily;
  engineType: EngineType;
  decade: string;
  category: ModelCategory;
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Editorial groupings for archive filters. Not factory designations. */
const META: Record<string, Omit<ModelMeta, "slug" | "decade">> = {
  "Vespa 98": { family: "pioneer", engineType: "2-stroke", category: "classic" },
  "Vespa 125": { family: "largeframe", engineType: "2-stroke", category: "classic" },
  "Vespa 150 GS Gran Sport": { family: "largeframe", engineType: "2-stroke", category: "classic" },
  "Vespa 50 smallframe": { family: "smallframe", engineType: "2-stroke", category: "classic" },
  "Vespa 180 SS Super Sport": { family: "largeframe", engineType: "2-stroke", category: "classic" },
  "Vespa 125 Primavera": { family: "smallframe", engineType: "2-stroke", category: "classic" },
  "Vespa Rally 200": { family: "largeframe", engineType: "2-stroke", category: "classic" },
  "Vespa PX 125/150/200": { family: "largeframe", engineType: "2-stroke", category: "classic" },
  "Vespa ET4": { family: "modern", engineType: "4-stroke", category: "modern" },
  "Vespa GTS/Granturismo": { family: "modern", engineType: "4-stroke", category: "modern" },
  "Vespa 946": { family: "modern", engineType: "4-stroke", category: "modern" },
  "Vespa Elettrica": { family: "modern", engineType: "electric", category: "modern" },
};

function decadeOf(y: string): string {
  const m = y.match(/\d{4}/);
  return m ? `${Math.floor(parseInt(m[0], 10) / 10) * 10}s` : "Unknown";
}

export type ArchiveModel = VespaModel & ModelMeta;

const FALLBACK = { family: "largeframe", engineType: "2-stroke", category: "classic" } as const;

export const ARCHIVE_MODELS: ArchiveModel[] = VESPA_MODELS.map((m) => ({
  ...m,
  slug: slugify(m.m),
  decade: decadeOf(m.y),
  ...(META[m.m] ?? FALLBACK),
}));

export const modelBySlug = (slug: string) =>
  ARCHIVE_MODELS.find((m) => m.slug === slug);

export const modelIndexByName = (name: string) =>
  VESPA_MODELS.findIndex((m) => m.m === name);

export function neighbors(slug: string): {
  prev: ArchiveModel | null;
  next: ArchiveModel | null;
} {
  const i = ARCHIVE_MODELS.findIndex((m) => m.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? ARCHIVE_MODELS[i - 1] : null,
    next: i < ARCHIVE_MODELS.length - 1 ? ARCHIVE_MODELS[i + 1] : null,
  };
}

const unique = (xs: string[]) => [...new Set(xs)];

export const DECADES = unique(ARCHIVE_MODELS.map((m) => m.decade));
export const FAMILIES: ModelFamily[] = ["pioneer", "largeframe", "smallframe", "modern"];
export const ENGINE_TYPES: EngineType[] = ["2-stroke", "4-stroke", "electric"];
export const CATEGORIES: ModelCategory[] = ["classic", "modern"];
