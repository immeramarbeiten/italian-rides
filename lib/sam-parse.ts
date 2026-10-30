import { decodeMaskToSVGPath } from "@meta-sam/parser";

export type SamBox = { x1: number; y1: number; x2: number; y2: number };

export type SamMatch = {
  objectId: string;
  box: SamBox;
  frame: { w: number; h: number };
  raster: { w: number; h: number };
  /** Mask path in raster pixels, positioned at the box origin. Null when undecodable. */
  svgPath: string | null;
};

export type SamOverlay = {
  matches: SamMatch[];
  side: "" | "L" | "R";
  label: string;
};

const RECORD_RE =
  /(\d+)<\|box;x1=(\d+);y1=(\d+);x2=(\d+);y2=(\d+);w=(\d+);h=(\d+)(;c=[\d.]+)?\|><\|mask;x=(\d+);y=(\d+)(;c=[\d.]+)?;data=(\d+),(\d+),([~!])([^|]*)\|>/g;

/**
 * Parse SAM grammar text into matches. Never throws: records with an
 * undecodable mask keep their box with svgPath null.
 */
export function parseSamText(text: string): SamMatch[] {
  const out: SamMatch[] = [];
  RECORD_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RECORD_RE.exec(text)) !== null) {
    const rasterW = Number(m[13]);
    const rasterH = Number(m[12]);
    let svgPath: string | null = null;
    try {
      svgPath = decodeMaskToSVGPath({
        encoding: m[14] === "~" ? "lossless" : "one_bit",
        payload: m[14] + m[15],
        width: rasterW,
        height: rasterH,
      });
    } catch {
      svgPath = null;
    }
    out.push({
      objectId: m[1],
      box: {
        x1: Number(m[2]),
        y1: Number(m[3]),
        x2: Number(m[4]),
        y2: Number(m[5]),
      },
      frame: { w: Number(m[6]), h: Number(m[7]) },
      raster: { w: rasterW, h: rasterH },
      svgPath,
    });
  }
  return out;
}
