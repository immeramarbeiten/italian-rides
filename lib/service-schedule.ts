/**
 * Factory service data for the GTS 125, transcribed from the Vespa GTS 125
 * Workshop Manual (273 pp) and Owner's Guide (90 pp). Intervals and values
 * apply to the GTS 125 exactly — not to the 250/300 or earlier families.
 */

export type ServiceRow = { interval: string; tasks: string[] };

export const GTS125_SOURCE =
  "Vespa GTS 125 Workshop Manual + Owner's Guide";

export const GTS125_SCHEDULE: ServiceRow[] = [
  {
    interval: "After 1,000 km (running-in)",
    tasks: [
      "Engine + hub oil replacement",
      "Idle speed and throttle adjustment",
      "Steering, brakes, electrics, tyres, locks check + road test",
    ],
  },
  {
    interval: "Every 3,000 km",
    tasks: ["Engine oil level check / top-up"],
  },
  {
    interval: "Every 6,000 km",
    tasks: [
      "Engine oil replacement, hub oil level check",
      "Plug + electrode gap check, air filter clean",
      "Valve clearance check, rollers + belt check",
      "Coolant, brakes, electrics, tyres + road test",
    ],
  },
  {
    interval: "Every 12,000 km",
    tasks: [
      "Spark plug replacement, driving belt replacement",
      "Full 6,000-km programme + steering, suspension, headlight",
    ],
  },
  {
    interval: "Every 2 years",
    tasks: ["Coolant change", "Brake fluid change"],
  },
];

export type Consumable = { item: string; spec: string };

export const GTS125_CONSUMABLES: Consumable[] = [
  { item: "Engine oil", spec: "AGIP City Hi Tec 4T · SAE 5W-40, API SL, ACEA A3 · ≈1,100 cc at MAX" },
  { item: "Hub oil", spec: "AGIP Rotra 80W-90 (API GL3+) · ≈150 cc · drain screw 15–17 N·m" },
  { item: "Tyres (cold, check ≈500 km)", spec: "Front 1.8 bar · rear 2.0 bar · rear with passenger 2.2 bar" },
  { item: "Spark plug", spec: "Champion RG4HC or NGK CR8EB · gap 0.7–0.8 mm · 12–14 N·m · replace every 12,000 km, engine cold" },
  { item: "Coolant", spec: "50% ethylene glycol + corrosion inhibitor, de-ionised water · change every 2 years" },
  { item: "Brake fluid", spec: "DOT 4 · change every 2 years · never reuse opened containers · reservoir screws 15–20 N·m" },
  { item: "Shock preload", spec: "4 positions via ring nut: 1 solo-min … 4 rider + passenger + luggage" },
];
