import type { VespaPartId } from "./vespa-inspect";

export type ComponentInfo = {
  id: VespaPartId;
  assembly: string;
  /** Plain-language function, 2–4 sentences. Editorial, not a manual. */
  function: string;
  location: string;
  inspectHint: string;
};

export const COMPONENT_INFO: Record<VespaPartId, ComponentInfo> = {
  frame: {
    id: "frame",
    assembly: "Chassis",
    function:
      "The pressed-steel step-through monocoque is the Vespa's defining structure: frame and bodywork in one stressed shell. It carries the steering head, the engine mounts and the side cowls, and its tunnel routes cables and wiring. Rust or crash damage here affects alignment and safety, so the tunnel and floor edges deserve a close look on any old machine.",
    location: "Central spine: steering head to rear wheel, under the floorboard.",
    inspectHint: "Photograph the full left side including the floorboard edge and tunnel.",
  },
  legshield: {
    id: "legshield",
    assembly: "Bodywork",
    function:
      "The curved front shield deflects wind and road spray away from the rider and carries the horn, the badge and — on later models — the glovebox. It is a stressed part of the front structure, so creases around the horn cover or headset suggest a frontal impact. Behind it sit the front suspension and the brake cable run.",
    location: "Front, facing the rider; horn cover centered above the wheel.",
    inspectHint: "Shoot head-on and from 45° so the horn cover and edges are visible.",
  },
  handlebar: {
    id: "handlebar",
    assembly: "Controls",
    function:
      "The headset carries the speedometer, switches, brake levers and mirrors. Classic geared Vespas shift with the left twistgrip and run the clutch cable to it; automatics keep both levers for brakes only. A bent bar or sticky twistgrip is usually crash damage or a dry cable rather than a deep fault.",
    location: "Top of the steering column, above the legshield.",
    inspectHint: "Capture the headset front, both levers and the grips in good light.",
  },
  wheels: {
    id: "wheels",
    assembly: "Running gear",
    function:
      "Classic Vespas run small wheels — the split-rim type lets you change a tube at the roadside without levers. The front wheel hangs off a single-sided link so it unbolts with the brake drum attached. Check rims for flat spots and cracks: split rims corrode between the halves.",
    location: "Front: single-sided fork. Rear: driven hub on the engine casing.",
    inspectHint: "Photograph each wheel straight-on, close enough to read the tire wall.",
  },
  engine: {
    id: "engine",
    assembly: "Powertrain",
    function:
      "A side-mounted unit that swings with the rear wheel: two-stroke singles on the classics, LEADER and Quasar four-strokes on the moderns, a hub motor on the Elettrica. Classic two-strokes with Autolube still need the oil tank checked — premix-era engines seize fast when the pump runs dry. Listen for crank rumble and look for oily weep at the casings.",
    location: "Right side, under the side cowl; exhaust exits low on the right.",
    inspectHint: "Right side with the cowl on, then off if you are servicing it.",
  },
  seat: {
    id: "seat",
    assembly: "Bodywork",
    function:
      "Solo saddles on the earliest machines, long dual seats later, with the fuel cap and often a helmet hook underneath on moderns. The seat latch and hinges wear first; a sagging cover usually means tired foam rather than a broken pan. Under-seat access is also how you reach the tank, battery and fuses.",
    location: "Above the rear frame, hinged at the front on most models.",
    inspectHint: "Top-down plus one shot open, showing what lives underneath.",
  },
};
