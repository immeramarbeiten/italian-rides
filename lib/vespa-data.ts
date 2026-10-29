export type VespaModel = {
  m: string;
  y: string;
  factory: string;
  engine: string;
  facts: string;
  /** Short playful line for the detail sheet. */
  blurb: string;
  /** Profile prose, 2–3 sentences. Paraphrased from the cited sources. */
  prose: string;
  /** One telling detail. Must be derivable from facts + sources. */
  anecdote: string;
  /** Running-gear + configuration summary. Every clause needs a source. */
  setup: string;
  src: string[];
};

/** 12 milestone models. Facts paraphrased from public sources. */
export const VESPA_MODELS: VespaModel[] = [
  {
    m: "Vespa 98",
    y: "1946–47",
    factory: "Pontedera, Italy (Piaggio)",
    engine: "98cc 2-stroke single, 3-spd",
    facts: "First Vespa; D'Ascanio design; ~2500 built 1946; 60 km/h",
    blurb: "The sketch that started it all — 98cc of postwar optimism.",
    prose:
      "The first Vespa: Corradino D'Ascanio's 1946 design for Piaggio, built at Pontedera for a country that needed cheap wheels. Around 2,500 were made that first year, each good for about 60 km/h.",
    anecdote: "Only about 2,500 left the factory in 1946 — every survivor is a postwar artifact.",
    setup:
      "98cc with 3-speed hand shift, unsprung rear wheel, band-spring front link — and no centre stand: it leans on an outrigger under the rear floorboard. Built 1946–47 in four series (V.98/1–V.98/4).",
    src: ["Wikipedia/Vespa", "Scootering-70Yrs", "VespaClubBritain", "WikipediaDE/Vespa98"],
  },
  {
    m: "Vespa 125",
    y: "1948–69",
    factory: "Pontedera, Italy",
    engine: "125cc 2-stroke single",
    facts: "First 125cc; added rear suspension; ~70 km/h",
    blurb: "Bigger lungs, same grin. The 98 grows up.",
    prose:
      "Two years in, the 98 grew into the 125 — the first 125cc Vespa. Rear suspension was added and pace climbed to about 70 km/h.",
    anecdote: "The first Vespa with rear suspension.",
    setup:
      "125cc with choke lever under the seat, revised shift linkage, coil-spring front link, sprung rear wheel and a better-sprung saddle. Offered 1948–69; the 1957 generation moved to welded largeframe pressings.",
    src: ["ClassicBikeHub-AtoZ", "TopClassico", "VespaWorldClub", "WikipediaDE/Vespa125"],
  },
  {
    m: "Vespa 150 GS Gran Sport",
    y: "1955–61",
    factory: "Pontedera, Italy",
    engine: "150cc 2-stroke single, 4-spd",
    facts: "First sport Vespa; 100+ km/h; faired headset; 10in wheels",
    blurb: "The first fast one. Ten-inch wheels, hundred-kay attitude.",
    prose:
      "1955: the first sport Vespa. A faired headset, 10-inch wheels, a four-speed box and 100+ km/h pace — Piaggio's own history calls the GS 150 a technical turning point.",
    anecdote: "The first Vespa past 100 km/h — on 10-inch wheels.",
    setup:
      "150cc making 8 PS at 7500 rpm, 4-speed, 10 in wheels, long dual seat, faired legshield — 126,350 built in five series, 1955–61.",
    src: ["Wikipedia/Vespa", "Motorscooter-culture", "Ruetir-GS", "WikipediaDE/VespaGS"],
  },
  {
    m: "Vespa 50 smallframe",
    y: "1963–90s",
    factory: "Pontedera, Italy",
    engine: "49.9cc 2-stroke single",
    facts: "First smallframe; Italy 14+ licence-free niche; 9in wheels",
    blurb: "Fifty cubes of teenage freedom. No licence, no problem.",
    prose:
      "1963 shrank the Vespa: the 50 was the first smallframe, built for Italy's licence-free 14+ niche and rolling on 9-inch wheels.",
    anecdote: "Rideable at 14 with no licence — a generation's first engine.",
    setup:
      "Rotary-valve 49.9cc tilted in a spot-welded smallframe monocoque on 9 in wheels; sport variants (50SS, Sprinter, SR) added 3-port cylinders, bigger carbs and cigar exhausts. Over four million sold into the 1990s.",
    src: ["Wikipedia/Vespa", "VespaMag-smallframe", "Autotrader-Vespa80", "WikipediaDE/Vespa50"],
  },
  {
    m: "Vespa 180 SS Super Sport",
    y: "1965",
    factory: "Pontedera, Italy",
    engine: "181cc 2-stroke single, ~10hp",
    facts: "Replaced GS line; 105 km/h top speed",
    blurb: "The GS's rowdier sibling — white-hot and wind-cheating.",
    prose:
      "The Super Sport replaced the GS line in 1965 as the new flagship, stretching pace to 105 km/h.",
    anecdote: "It retired the legendary GS — big boots to fill.",
    setup:
      "Frame code VSC1T: 181.14cc / 10 hp, 4-speed, 10 in wheels, drum brakes front and rear, 105 km/h. 35,700 built 1964–68 in red, white and blue.",
    src: ["UltimateMotorcycling-historic", "Scootering-70Yrs", "Vespa.name", "Vespa.name-180SS", "ClassicTrader-180SS"],
  },
  {
    m: "Vespa 125 Primavera",
    y: "1968",
    factory: "Pontedera, Italy",
    engine: "125cc 2-stroke smallframe",
    facts: "Derived from 'new 125'; most durable smallframe; +10km/h",
    blurb: "The eternal teenager. Half a century young and counting.",
    prose:
      "Derived from the 'new 125' in 1968, the Primavera added ten km/h and became the most durable smallframe of all.",
    anecdote: "The most durable smallframe ever made.",
    setup:
      "Smallframe monocoque shared with the 50, 125cc two-stroke; classic run 1968–82. (The modern Primavera, built from 2013, is a different machine — 11 in wheels, front disc, optional ABS.)",
    src: ["UKScooters-history", "Wikipedia/Vespa", "Scooterlounge", "WikipediaDE/Vespa50", "Wikipedia/VespaPrimavera"],
  },
  {
    m: "Vespa Rally 200",
    y: "1972–79",
    factory: "Pontedera, Italy",
    engine: "198cc 2-stroke single, electronic ignition",
    facts: "Largest Vespa engine to date; white graphics; Rally flagship",
    blurb: "The big-bore flagship. Stripes, pace, presence.",
    prose:
      "1972's flagship carried the largest Vespa engine to date — 198cc with electronic ignition — dressed in white graphics.",
    anecdote: "The biggest engine Piaggio had ever hung off a Vespa frame.",
    setup:
      "198cc with electronic ignition. Lineage: the 180 Rally (1968–73) replaced the 180 SS; the Rally 200 followed in 1972 and ran to 1979.",
    src: ["UltimateMotorcycling-historic", "TotalMotorcycle-2018", "Ruetir-Rally200", "Wikipedia/VespaRally"],
  },
  {
    m: "Vespa PX 125/150/200",
    y: "1977–78",
    factory: "Pontedera, Italy",
    engine: "125/150/200cc 2-stroke, P200E e-ignition",
    facts: "Best-selling Vespa ever; 3M+ units; steel frame, drum brakes",
    blurb: "Three million strong. The people's Vespa, full stop.",
    prose:
      "1977–78: the people's Vespa. Three engines, one steel frame, drum brakes — over three million built, the best-selling Vespa ever.",
    anecdote: "Three million plus — more than any Vespa before or since.",
    setup:
      "Steel chassis with revised front suspension and rear axle, drums front and rear: P125X, P150X (from 1978) and P200E with electronic ignition. Arcobaleno/Lusso (1982) added Autolube separate lubrication, a fuel gauge and a self-centring front brake; sporty T5 from 1985. Production ended 2017 (Euro 4).",
    src: ["Scootering-70Yrs", "ClassicMotorbikes-P2", "VNAuto-PX", "Wikipedia/VespaPX"],
  },
  {
    m: "Vespa ET4",
    y: "1996",
    factory: "Pontedera, Italy",
    engine: "125cc LEADER 4-stroke single",
    facts: "50th-anniv range with ET2; first 4-stroke Vespa",
    blurb: "The first four-stroke — Vespa grows a conscience.",
    prose:
      "The 1996 50th-anniversary range brought the first four-stroke Vespa — the 125 LEADER — launching alongside the two-stroke ET2.",
    anecdote: "Fifty years in, the wasp learned a new stroke.",
    setup:
      "Air-cooled LEADER 125 four-stroke with CVT automatic, front disc + rear drum. Presented 1996 in Cologne; second series and a highway-legal 150 followed in 1999.",
    src: ["Scootering-70Yrs", "TotalMotorcycle-2018", "Mycarmakesnoise", "Wikipedia/VespaET", "Motorscooter-culture"],
  },
  {
    m: "Vespa GTS/Granturismo",
    y: "2003",
    factory: "Pontedera, Italy",
    engine: "125/200-250cc 4-stroke Quasar",
    facts: "Largest/most powerful Vespa then; Euro3 250 first",
    blurb: "The granturismo: big frame, big pace, zero apologies.",
    prose:
      "2003's Granturismo was the largest and most powerful Vespa to date — and the 250 was the first to meet Euro3.",
    anecdote: "The first Euro3 250 — pace with paperwork.",
    setup:
      "4-stroke 4-valve liquid-cooled (LEADER, then Quasar) with CVT, 12 in wheels, front disc with rear drum on the early GT. GT200 (2003) → GTS250 with Vespa's first fuel injection (2005) → GTS300 278cc Euro3 (2008).",
    src: ["MarellaScooters-history", "Scootering-70Yrs", "Bikesales", "Wikipedia/VespaGTS"],
  },
  {
    m: "Vespa 946",
    y: "2012–13",
    factory: "Pontedera, Italy",
    engine: "125/150cc 3V 4-stroke",
    facts: "MP6-1945 homage concept EICMA2011, prod 2013; premium retro-futurist",
    blurb: "A 1945 dream rebuilt in aluminium for the design museum.",
    prose:
      "A 1945 MP6 prototype reborn: shown as a concept at EICMA 2011, in production by 2013 as a premium retro-futurist flagship.",
    anecdote: "From EICMA concept floor to production in two years.",
    setup:
      "125/150 3-valve air-cooled four-stroke (11.7/13 hp), steel frame with alloy panels, horizontal single gas shock with progressive linkage, dual discs (220 mm front), ABS + ASR traction control, LED headlight. Sold as limited annual editions.",
    src: ["Wikipedia/Vespa946", "UltimateMotorcycling-80Yrs", "Wikipedia/Vespa946-tech"],
  },
  {
    m: "Vespa Elettrica",
    y: "2018",
    factory: "Pontedera, Italy",
    engine: "Electric hub motor, Li-ion",
    facts: "First electric Vespa; production Sept 2018 Pontedera",
    blurb: "The silent wasp. All torque, no smoke.",
    prose:
      "The silent wasp: the first electric Vespa entered production at Pontedera in September 2018.",
    anecdote: "The first Vespa with no exhaust note at all.",
    setup:
      "Hub motor with 2 kW continuous / 4 kW peak and ≈200 Nm claimed, 4.2 kWh Li-ion, ≈100 km range, ≈4 h charge from a wall outlet. Elettrica X adds a range extender.",
    src: ["PiaggioGroup-WIDE", "UltimateMotorcycling-80Yrs", "Autoblog-Elettrica", "Bennetts-Elettrica"],
  },
];

export const FACTORIES_NOTE =
  "All classic models Pontedera (Piaggio plant, since 1946; museum on site). Later global plants: Vinh Phuc Vietnam, Baramati India (2012).";
