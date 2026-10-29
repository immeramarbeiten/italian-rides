import type { VespaPartId } from "./vespa-inspect";

/**
 * Model-specific anatomy: one grounded sentence per assembly, per record.
 * Every line must be derivable from the model's profile (setup/prose/facts
 * in vespa-data.ts) or be a definitional truth (e.g. a hub motor has no
 * chain). No invented specs, no cross-model guessing. Missing key falls
 * back to the general primer in vespa-inspect.ts / component-info.ts.
 */
export const MODEL_ANATOMY: Record<string, Partial<Record<VespaPartId, string>>> = {
  "vespa-98": {
    frame:
      "Split-pressing frame of the first series — no centre stand; it leans on an outrigger under the rear floorboard.",
    legshield: "Hand-finished shield of the V.98 series with minimal trim.",
    handlebar: "Bare utility bar with a 3-speed hand shift — no headset fairing yet.",
    wheels: "Small wheels with an unsprung rear on the band-spring front link.",
    engine: "98cc two-stroke with 3-speed hand shift; about 60 km/h flat out.",
    seat: "One saddle over an unsprung rear wheel — comfort was aspirational.",
  },
  "vespa-125": {
    frame: "The frame that learned rear suspension; welded largeframe pressings from 1957.",
    legshield: "Deeper shield than the 98's, carrying horn and badge.",
    handlebar: "Utility bar with hand-shift; the choke lever lives under the seat, not on the bar.",
    wheels: "Coil-spring front link with a newly sprung rear wheel; about 70 km/h of pace.",
    engine: "125cc two-stroke — the first 125 — with revised shift linkage.",
    seat: "Better-sprung saddle than the 98's, lifting to reveal the choke lever.",
  },
  "vespa-150-gs-gran-sport": {
    frame: "Largeframe monocoque with a faired legshield — the first Vespa shaped for speed.",
    legshield: "Faired shield flowing into the headset; the GS's wind-cheating signature.",
    handlebar: "Faired headset with speedo and 4-speed twist-shift — the sport rider's cockpit.",
    wheels: "The first 10-inch wheels on a Vespa — the footprint for 100+ km/h.",
    engine: "150cc, 8 PS at 7500 rpm, 4-speed — Piaggio's technical turning point.",
    seat: "Long dual seat, five series of it — built for two at full chat.",
  },
  "vespa-50-smallframe": {
    frame: "Spot-welded smallframe monocoque — the shrunken chassis that sold four million.",
    legshield: "Narrow smallframe shield; the sport variants kept it bare and light.",
    handlebar: "Small headset with twist-shift — the 14-year-old's first cockpit.",
    wheels: "9-inch wheels — the smallframe's defining footprint.",
    engine: "Tilted rotary-valve 49.9cc; sport versions add 3-port cylinders, bigger carbs and cigar exhausts.",
    seat: "Short dual seat — two-up freedom on 50cc.",
  },
  "vespa-180-ss-super-sport": {
    frame: "VSC1T largeframe — the GS's successor chassis in red, white or blue.",
    legshield: "Full-width shield with the SS badge; drums behind, no disc in sight.",
    handlebar: "Sport headset, 4-speed twist-shift, 105 km/h on the clock.",
    wheels: "10-inch wheels with drums front and rear.",
    engine: "181.14cc two-stroke, 10 hp, 4-speed — the biggest sport engine yet.",
    seat: "Long dual sport seat; only 35,700 SS machines ever got one.",
  },
  "vespa-125-primavera": {
    frame: "The 50's smallframe monocoque, proven over the longest classic run: 1968–82.",
    legshield: "Smallframe shield with its horn cover — the sixties face.",
    handlebar: "Compact headset with twist-shift.",
    wheels: "Smallframe drums; the 2013 revival moved to 11 in wheels and a front disc.",
    engine: "125cc smallframe two-stroke — ten km/h more than the 'new 125' it came from.",
    seat: "Slim dual seat over the smallframe tunnel.",
  },
  "vespa-rally-200": {
    frame: "Largeframe flagship chassis in white graphics — the Rally look.",
    legshield: "Rally shield in white graphics.",
    handlebar: "Sport headset with twist-shift for the 198cc flagship.",
    wheels: "Running gear sized for the largest engine Piaggio had built.",
    engine: "198cc two-stroke with electronic ignition — the largest Vespa engine to date.",
    seat: "Long dual seat for the big-bore flagship.",
  },
  "vespa-px-125-150-200": {
    frame: "Steel chassis with revised front suspension and rear axle — three million built.",
    legshield: "Squared-off PX shield with the horn cover and, from 1982, Arcobaleno trim.",
    handlebar: "PX headset with speedo, fuel gauge from the Arcobaleno on, and twist-shift.",
    wheels: "Drums front and rear; the Arcobaleno added a self-centring front brake.",
    engine: "P125X, P150X or P200E with electronic ignition; Autolube separate lubrication from 1982.",
    seat: "Long dual PX saddle; the T5 restyled it from 1985.",
  },
  "vespa-et4": {
    frame: "The 50th-anniversary chassis — the first Vespa frame built around a four-stroke.",
    legshield: "Rounded nineties shield; no gear cables behind it anymore.",
    handlebar: "Twist-and-go bar: both levers are brakes, the left grip just holds on.",
    wheels: "Front disc with rear drum — the ET4's modern running gear.",
    engine: "Air-cooled LEADER 125 four-stroke with CVT; a 150 followed in 1999.",
    seat: "Wide dual saddle for the anniversary range.",
  },
  "vespa-gts-granturismo": {
    frame: "Granturismo large frame — the biggest Vespa chassis to date in 2003.",
    legshield: "Full-size GTS shield with the granturismo stance.",
    handlebar: "Wide automatic bar — no shifting, all braking.",
    wheels: "12-inch wheels; the early GT ran a front disc with a rear drum.",
    engine: "Liquid-cooled 4-valve four-stroke with CVT — GT200 to fuel-injected GTS250 to 278cc GTS300.",
    seat: "Deep two-up touring saddle; the granturismo brief in foam and vinyl.",
  },
  "vespa-946": {
    frame: "Steel frame with alloy panels — the MP6 homage in metal.",
    legshield: "Sculpted shield framing the LED headlight.",
    handlebar: "Retro-futurist cockpit; ABS and ASR stand guard behind the levers.",
    wheels: "Dual discs, 220 mm at the front, with ABS and ASR traction control.",
    engine: "125/150 3-valve four-stroke, 11.7/13 hp — air-cooled efficiency in a flagship.",
    seat: "Slim saddle over the single gas shock.",
  },
  "vespa-elettrica": {
    frame: "Steel monocoque carrying a 4.2 kWh Li-ion pack.",
    legshield: "Clean shield with no exhaust heat behind it — and no gears to shift.",
    handlebar: "Twist-and-go bar; both levers brake while electrons do the shifting.",
    wheels: "Wheels built around the hub motor — ≈200 Nm with no chain, no belt, no gears.",
    engine: "Hub motor: 2 kW continuous, 4 kW peak, ≈100 km per ≈4 h wall charge.",
    seat: "Dual saddle; the Elettrica X adds a range extender.",
  },
};
