import type { VespaPartId } from "../vespa-inspect";
import type { EvidenceTier } from "./evidence";

/**
 * Dataset 3 — Components and technical structure for the P125X pilot.
 * Assembly hierarchy with named component records. Each record resolves
 * through the canonical coarse part id (frame/legshield/handlebar/wheels/
 * engine/seat) so the 3D viewer, recognition hints and part references
 * share one identity — never raw mesh names or AI labels.
 *
 * Multilingual names are glossary vocabulary (EN/DE/IT), not fitment claims.
 * No OEM numbers yet: numbers arrive only with variant applicability +
 * source evidence (§4C).
 */

export type Assembly = {
  id: string;
  name: string;
  blurb: string;
};

export const ASSEMBLIES: Assembly[] = [
  { id: "bodywork", name: "Bodywork", blurb: "Pressed-steel shell, cowls, shield, floor." },
  { id: "controls-lighting", name: "Controls & lighting", blurb: "Headset, grips, levers, mirrors, lamps." },
  { id: "engine-drivetrain", name: "Engine & drivetrain", blurb: "Barrel, carburettor, clutch, gearbox, exhaust." },
  { id: "wheels-brakes", name: "Wheels, suspension & brakes", blurb: "Split rims, shocks, drum assemblies." },
  { id: "electrical", name: "Electrical", blurb: "Ignition, loom, horn, switches." },
  { id: "fuel-air", name: "Fuel & air", blurb: "Tank, tap, oil feed, airbox." },
  { id: "seating-luggage", name: "Seating & luggage", blurb: "Saddle, hinges, carrier, helmet hook." },
];

export type ComponentRecord = {
  id: string;
  assemblyId: string;
  /** Coarse canonical identity shared with viewer/inspect/parts. */
  canonicalPart: VespaPartId;
  names: { en: string; de: string; it: string };
  location: string;
  visual: string;
  variants: string[];
  /** 3D mesh mapping — null until a validated asset exists. */
  mesh: string | null;
  /** Designated interactive pilots for the viewer (assets pending). */
  pilotInteractive: boolean;
  sources: string[];
  evidence: EvidenceTier;
};

const V = ["p125x-vnx1t"];
const SRC = ["sip-modelbase"];

export const COMPONENTS: ComponentRecord[] = [
  { id: "p125x-side-cowl", assemblyId: "bodywork", canonicalPart: "frame", names: { en: "Side cowl", de: "Seitenhaube", it: "Cofano laterale" }, location: "Left and right flanks over engine and spare wheel", visual: "Large pressed-steel curve with lever latch at the rear edge", variants: V, mesh: null, pilotInteractive: true, sources: SRC, evidence: "unverified" },
  { id: "p125x-legshield", assemblyId: "bodywork", canonicalPart: "legshield", names: { en: "Legshield", de: "Beinschild", it: "Scudo anteriore" }, location: "Front, facing the rider", visual: "Deep curved shield; horn recess centred above the wheel", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-horn-cover", assemblyId: "bodywork", canonicalPart: "legshield", names: { en: "Horn cover", de: "Hupenabdeckung", it: "Copriclacson" }, location: "Centred on the legshield", visual: "Clip-on casting with round badge on classic largeframes", variants: V, mesh: null, pilotInteractive: true, sources: SRC, evidence: "unverified" },
  { id: "p125x-floorboard", assemblyId: "bodywork", canonicalPart: "frame", names: { en: "Floorboard with rails", de: "Trittbrett mit Leisten", it: "Pedana con listelli" }, location: "Tunnel top between legshield and seat", visual: "Rubber strips on alloy rails over the tunnel", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-headset", assemblyId: "controls-lighting", canonicalPart: "handlebar", names: { en: "Headset / handlebar", de: "Lenkerkopf / Lenker", it: "Manubrio" }, location: "Top of the steering column", visual: "Cast headset with speedometer, switches and levers", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-gear-grip", assemblyId: "controls-lighting", canonicalPart: "handlebar", names: { en: "Gear twist-grip", de: "Schaltgriff", it: "Manopola del cambio" }, location: "Left handlebar end", visual: "Twistgrip with 4-speed detent plate", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-brake-levers", assemblyId: "controls-lighting", canonicalPart: "handlebar", names: { en: "Brake levers", de: "Bremshebel", it: "Leve freno" }, location: "Both handlebar ends, below the grips", visual: "Alloy levers with cable adjusters at the perches", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-mirrors", assemblyId: "controls-lighting", canonicalPart: "handlebar", names: { en: "Mirrors", de: "Spiegel", it: "Specchietti" }, location: "Stalks on the headset", visual: "Round or trapezoid heads on threaded stalks", variants: V, mesh: null, pilotInteractive: true, sources: SRC, evidence: "unverified" },
  { id: "p125x-headlight", assemblyId: "controls-lighting", canonicalPart: "handlebar", names: { en: "Headlight", de: "Scheinwerfer", it: "Faro anteriore" }, location: "Front of the headset", visual: "Round lens with rim and pilot bulb", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-tail-light", assemblyId: "electrical", canonicalPart: "seat", names: { en: "Tail light", de: "Rücklicht", it: "Fanalino posteriore" }, location: "Rear, below the seat", visual: "Trapezoid CEV-pattern lens", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-cylinder", assemblyId: "engine-drivetrain", canonicalPart: "engine", names: { en: "Cylinder & head", de: "Zylinder mit Kopf", it: "Gruppo termico" }, location: "Right side under the cowl, above the casings", visual: "Finned alloy barrel with 4-stud head", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-carburettor", assemblyId: "engine-drivetrain", canonicalPart: "engine", names: { en: "Carburettor", de: "Vergaser", it: "Carburatore" }, location: "On the crankcase inlet under the seat/tank area", visual: "Dell'Orto-pattern body with airbox hose (type pending)", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-exhaust", assemblyId: "engine-drivetrain", canonicalPart: "engine", names: { en: "Exhaust", de: "Auspuff", it: "Marmitta / Scarico" }, location: "Low on the right, barrel to rear wheel", visual: "Expansion box with tailpipe exiting rear-right", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-clutch", assemblyId: "engine-drivetrain", canonicalPart: "engine", names: { en: "Clutch", de: "Kupplung", it: "Frizione" }, location: "Inside the right crankcase cover", visual: "Not externally visible; cable enters the cover", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-gearbox", assemblyId: "engine-drivetrain", canonicalPart: "engine", names: { en: "Gearbox", de: "Getriebe", it: "Cambio" }, location: "Unit with the engine, selector in the headset", visual: "Not externally visible; selector box on the casing", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-front-wheel", assemblyId: "wheels-brakes", canonicalPart: "wheels", names: { en: "Front wheel", de: "Vorderrad", it: "Ruota anteriore" }, location: "Single-sided front link", visual: "10 in pressed-steel split rim with drum hub", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-rear-wheel", assemblyId: "wheels-brakes", canonicalPart: "wheels", names: { en: "Rear wheel", de: "Hinterrad", it: "Ruota posteriore" }, location: "Driven hub on the engine casing", visual: "10 in split rim, three-stud pattern", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-front-shock", assemblyId: "wheels-brakes", canonicalPart: "wheels", names: { en: "Front shock absorber", de: "Stoßdämpfer vorn", it: "Ammortizzatore anteriore" }, location: "Inside the front link, behind the mudguard", visual: "Exposed chrome spring unit", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-seat", assemblyId: "seating-luggage", canonicalPart: "seat", names: { en: "Dual saddle", de: "Doppelsitzbank", it: "Sella biposto" }, location: "Above the rear frame, hinged at the front", visual: "Long black cover on a steel pan", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
  { id: "p125x-fuel-tank", assemblyId: "fuel-air", canonicalPart: "seat", names: { en: "Fuel tank", de: "Kraftstofftank", it: "Serbatoio" }, location: "Under the seat", visual: "Steel tank with cap and tap (capacity pending)", variants: V, mesh: null, pilotInteractive: false, sources: SRC, evidence: "unverified" },
];

export const componentsForVariant = (variantId: string) =>
  COMPONENTS.filter((c) => c.variants.includes(variantId));

export const assemblyById = (id: string) =>
  ASSEMBLIES.find((a) => a.id === id) ?? null;
