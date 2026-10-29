import type { VespaPartId } from "./vespa-inspect";
import { VESPA_MODELS } from "./vespa-data";

export type FitStatus = "fit" | "adapt" | "no";

export type FitCell = {
  fit: FitStatus;
  note?: string;
};

export type CatalogPart = {
  id: VespaPartId;
  /** Catalog item this fitment row describes. */
  item: string;
  blurb: string;
  /** Filename keywords the mock identifier matches on. */
  keywords: string[];
  /** One cell per VESPA_MODELS entry, same order. */
  fitment: FitCell[];
  sources: string[];
  guide: MaintenanceGuide;
};

export type MaintenanceGuide = {
  title: string;
  tools: string[];
  torque: string;
  steps: { label: string; detail: string }[];
};

/** Column labels for the matrix, derived from research data. */
export const FITMENT_COLUMNS: { model: string; years: string }[] =
  VESPA_MODELS.map((m) => ({ model: m.m, years: m.y }));

const F = (note?: string): FitCell => ({ fit: "fit", note });
const A = (note?: string): FitCell => ({ fit: "adapt", note });
const N = (note?: string): FitCell => ({ fit: "no", note });

/**
 * Illustrative fitment data compiled from public parts-catalogue patterns.
 * Always confirm against the frame number and the official parts book.
 * Model order: 98, 125, GS150, 50, 180SS, Primavera, Rally200, PX, ET4, GTS, 946, Elettrica.
 */
export const CATALOG_PARTS: CatalogPart[] = [
  {
    id: "frame",
    item: "Side cowl set, largeframe (PX pattern)",
    blurb:
      "Pressed-steel side cowls over engine and spare wheel. Largeframe curve; smallframe and modern monocoques differ.",
    keywords: ["cowl", "frame", "body", "panel", "cowling", "side"],
    fitment: [
      N("Narrow early body"),
      A("Needs fettling to badge holes"),
      A("GS badge mounts differ"),
      N("Smallframe shell"),
      F("Same largeframe curve"),
      N("Smallframe shell"),
      F("Direct pattern fit"),
      F("Reference model"),
      N("ET monocoque"),
      N("GTS monocoque"),
      N("946 monocoque"),
      N("Elettrica monocoque"),
    ],
    sources: ["SIP catalogue pattern", "Scootering-70Yrs"],
    guide: {
      title: "Remove and refit side cowls",
      tools: ["8 mm spanner", "Soft cloth", "Masking tape"],
      torque: "Cowl lever pivot: hand-tight plus 1/4 turn — no torque spec; do not overtighten the lever screw.",
      steps: [
        {
          label: "Protect the paint",
          detail: "Tape the legshield edge and cowl lip before levering anything.",
        },
        {
          label: "Release the lever",
          detail: "Turn the cowl lever to open, lift the rear edge first, then slide forward off the front peg.",
        },
        {
          label: "Inspect the rubber",
          detail: "Check the cowl rubbers and front peg grommet; perished rubbers rattle and chip paint.",
        },
        {
          label: "Refit front-first",
          detail: "Hook the front peg, swing the rear down, close the lever. Cowl should sit flush with even gaps.",
        },
      ],
    },
  },
  {
    id: "legshield",
    item: "Horn cover, round-badge type",
    blurb:
      "Clip-on pressed cover for the legshield horn recess. Round-badge casting suits classic largeframes.",
    keywords: ["horn", "legshield", "shield", "badge", "cover", "fender", "mudguard"],
    fitment: [
      A("Early recess is shallower"),
      F("Round-badge era"),
      F("Direct fit"),
      N("Smallframe recess differs"),
      F("Direct fit"),
      N("Smallframe recess differs"),
      F("Direct fit"),
      F("Direct fit"),
      N("ET plastic shield"),
      N("GTS plastic shield"),
      N("946 one-piece casting"),
      N("Elettrica shield"),
    ],
    sources: ["SIP catalogue pattern", "VespaClubBritain"],
    guide: {
      title: "Refit a loose horn cover",
      tools: ["Trim tool or spoon", "New spring clips", "Contact adhesive"],
      torque: "No torque spec — clip fit only. Badge screw (if fitted): 1.5 Nm max.",
      steps: [
        {
          label: "Remove without bending",
          detail: "Ease the cover off from the bottom edge with a trim tool; never pry from the badge.",
        },
        {
          label: "Renew the clips",
          detail: "Replace flattened spring clips; a dab of adhesive on cracked clip seats only.",
        },
        {
          label: "Seat evenly",
          detail: "Press top edge first, then bottom. No rocking, no proud corners.",
        },
      ],
    },
  },
  {
    id: "handlebar",
    item: "Gear twist-grip, 4-speed",
    blurb:
      "Left-hand twist-grip with 4-speed detent plate for manual-shift classics. Automatics take no grip-shift parts.",
    keywords: ["grip", "handlebar", "twist", "gear", "headset", "bar", "throttle"],
    fitment: [
      N("3-speed control"),
      N("3-speed control"),
      F("4-speed reference"),
      N("3/4-speed smallframe differs"),
      F("Direct fit"),
      N("Smallframe tube differs"),
      F("Direct fit"),
      F("Direct fit"),
      N("CVT automatic"),
      N("CVT automatic"),
      N("CVT automatic"),
      N("Electric, no gears"),
    ],
    sources: ["SIP catalogue pattern", "ClassicBikeHub-AtoZ"],
    guide: {
      title: "Replace gear cables and grip",
      tools: ["10 mm spanner", "Cable oil", "Side cutters", "Grease"],
      torque: "Headset top nut: 25 Nm. Lever perch bolts: 8 Nm. Do not crush the tube.",
      steps: [
        {
          label: "Slack the cables",
          detail: "Back both gear adjusters off at the headset so the pulleys go slack.",
        },
        {
          label: "Slide the old grip off",
          detail: "Remove the end plug, twist while pulling; clean the tube and grease lightly.",
        },
        {
          label: "Fit the new grip",
          detail: "Align the detent plate marks before seating fully home.",
        },
        {
          label: "Set neutral",
          detail: "Adjust so neutral sits true between 1st and 2nd with equal free play both ways.",
        },
        {
          label: "Road check",
          detail: "Each gear must engage without crunch or jump-out under load.",
        },
      ],
    },
  },
  {
    id: "wheels",
    item: "10 in pressed-steel split rim",
    blurb:
      "Two-piece riveted/bolted pressed rim for drum-brake hubs. Check hub spline and brake diameter before ordering.",
    keywords: ["wheel", "rim", "tyre", "tire", "fork", "brake", "hub", "drum"],
    fitment: [
      N("8 in wheel"),
      N("8 in wheel"),
      F("10 in reference"),
      N("9 in smallframe"),
      F("Direct fit"),
      A("Late Primavera 10 in only"),
      F("Direct fit"),
      F("Direct fit"),
      A("Check hub spline count"),
      N("12 in GTS hub"),
      N("12 in 946 hub"),
      N("Elettrica hub motor"),
    ],
    sources: ["SIP catalogue pattern", "Scootering-70Yrs"],
    guide: {
      title: "Remove, inspect and refit a wheel",
      tools: ["13 mm socket", "Torque wrench", "Wire brush", "Grease"],
      torque: "PX-pattern wheel nuts: 20–25 Nm in a star pattern. Front axle nut: 40 Nm. Recheck after 50 km.",
      steps: [
        {
          label: "Loosen before lifting",
          detail: "Crack the nuts with the wheel on the ground, then lift and support the scooter.",
        },
        {
          label: "Inspect the split",
          detail: "Check rim halves for cracks at the bolt holes and the valve-seat area.",
        },
        {
          label: "Clean the mating faces",
          detail: "Wire-brush drum and rim faces; smear of grease on the hub centre only.",
        },
        {
          label: "Torque in sequence",
          detail: "Star-pattern to 20–25 Nm, spin-check for wobble, recheck after 50 km.",
        },
      ],
    },
  },
  {
    id: "engine",
    item: "Top-end gasket set, 200 cc 2-stroke",
    blurb:
      "Head, base and exhaust gaskets for the large 2-stroke barrel. Four-strokes and electrics share nothing here.",
    keywords: ["engine", "gasket", "piston", "barrel", "cylinder", "exhaust", "carb", "spark"],
    fitment: [
      N("98 cc barrel"),
      N("125 cc barrel"),
      N("150 cc barrel"),
      N("50 cc barrel"),
      N("180 cc barrel"),
      N("125 cc smallframe"),
      A("Rally 200 porting differs slightly"),
      F("P200E reference"),
      N("LEADER 4-stroke"),
      N("Quasar 4-stroke"),
      N("3V 4-stroke"),
      N("Electric drive"),
    ],
    sources: ["SIP catalogue pattern", "ClassicMotorbikes-P2"],
    guide: {
      title: "Top-end refresh checklist",
      tools: ["Torque wrench", "Feeler gauges", "Gasket scraper", "Assembly lube"],
      torque: "Head nuts: 18–20 Nm in diagonal sequence. Exhaust nuts: 12 Nm with copper grease. Cylinder base: 12 Nm.",
      steps: [
        {
          label: "Strip and measure",
          detail: "Remove the barrel, measure bore wear and ring gap; glaze-bust or rebore as needed.",
        },
        {
          label: "Clean faces dead flat",
          detail: "Scrape gaskets without gouging; check head and barrel faces on a surface plate.",
        },
        {
          label: "Fit base gasket and barrel",
          detail: "Lube the bore, stagger ring gaps 120°, compress rings by hand on entry.",
        },
        {
          label: "Torque the head",
          detail: "Diagonal sequence to 18–20 Nm; re-torque after first heat cycle.",
        },
        {
          label: "Run-in",
          detail: "Rich jetting, varied throttle, no full load for the first 500 km.",
        },
      ],
    },
  },
  {
    id: "seat",
    item: "Long dual saddle, largeframe",
    blurb:
      "Two-person saddle on largeframe seat frame. Smallframes and moderns use different pans and hinges.",
    keywords: ["seat", "saddle", "rack", "carrier", "lamp", "light", "wiring", "electric"],
    fitment: [
      N("Solo saddle era"),
      N("Solo saddle era"),
      A("GS hinge differs; adaptable"),
      N("Smallframe pan"),
      A("SS hinge differs; adaptable"),
      N("Smallframe pan"),
      F("Direct fit"),
      F("Direct fit"),
      N("ET seat unit"),
      N("GTS seat unit"),
      N("946 seat unit"),
      N("Elettrica seat unit"),
    ],
    sources: ["SIP catalogue pattern", "VespaWorldClub"],
    guide: {
      title: "Refit a dual saddle",
      tools: ["10/13 mm spanners", "Threadlock (medium)", "Grease"],
      torque: "Seat frame bolts: 15 Nm with medium threadlock. Hinge bolt: hand-tight plus grease, must pivot freely.",
      steps: [
        {
          label: "Check the pan",
          detail: "Look for cracked welds and torn cover straps before refitting.",
        },
        {
          label: "Grease the hinge",
          detail: "Hinge must swing freely with no side play; shim if rattling.",
        },
        {
          label: "Bolt down",
          detail: "15 Nm with threadlock; confirm the latch catches positively.",
        },
      ],
    },
  },
];

export function catalogPart(id: VespaPartId): CatalogPart {
  const found = CATALOG_PARTS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown part id: ${id}`);
  return found;
}
