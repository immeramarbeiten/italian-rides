/**
 * Workshop glossary for readers with no scooter background.
 * Standard terminology, plain words. Editorial definitions —
 * not specifications; values live with the models.
 */

export type GlossaryTerm = {
  term: string;
  short: string;
  detail: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Monocoque",
    short: "Body and frame in one pressed-steel shell.",
    detail:
      "A Vespa has no separate frame: the steel bodywork carries the steering head, the engine and the rider. Damage to the shell is structural, not cosmetic.",
  },
  {
    term: "Legshield",
    short: "The curved front shield facing the rider.",
    detail:
      "Deflects wind and spray; carries the horn, the badge and (on later models) the glovebox. Creases here suggest a frontal impact.",
  },
  {
    term: "Side cowl",
    short: "Removable flank panel over engine or spare wheel.",
    detail:
      "Held by a lever latch. Cowls come off for almost every job, so worn latches and perished rubbers are the most common age faults.",
  },
  {
    term: "Headset",
    short: "The housing on top of the steering column.",
    detail:
      "Carries the speedometer, switches, levers and mirrors. Classics hide the cables inside it; that is where electrical faults usually live.",
  },
  {
    term: "Twistgrip shift",
    short: "Changing gear by twisting the left grip.",
    detail:
      "Classic geared Vespas have no foot lever: the left grip rotates through 3 or 4 speeds with a clutch lever. Automatics (ET4 onward) have no gears at all.",
  },
  {
    term: "Two-stroke",
    short: "Engine that fires every revolution; oil mixes with fuel.",
    detail:
      "All classic Vespas. Simple, light, smoky. Premix models need oil added to the tank; Autolube models meter it from a separate tank.",
  },
  {
    term: "Four-stroke",
    short: "Engine that fires every other revolution; oil stays in a sump.",
    detail:
      "All modern Vespas from the 1996 ET4 on. Cleaner and thriftier, with valve services instead of premix worries.",
  },
  {
    term: "CVT",
    short: "Automatic belt-and-pulley transmission.",
    detail:
      "Continuously variable transmission: no gears, just twist and go. Fitted to every automatic Vespa; the belt and rollers are wear items.",
  },
  {
    term: "Autolube",
    short: "Automatic oil metering for two-strokes.",
    detail:
      "A pump feeds oil from its own tank, so there is no premixing at the pump. Running the oil tank dry seizes the engine fast.",
  },
  {
    term: "Premix",
    short: "Oil blended into the petrol by hand.",
    detail:
      "Early two-strokes (e.g. GS 1:15) need measuring oil into every fill. Wrong ratios seize pistons or foul plugs.",
  },
  {
    term: "Points & condenser",
    short: "Mechanical ignition switch, pre-electronic.",
    detail:
      "A cam opens contact points to fire the plug. Gap (e.g. 0.4 mm) and timing (e.g. 27°) are service items; electronic ignition replaced them from the late 1970s.",
  },
  {
    term: "Drum vs disc",
    short: "Two brake designs; drums hide inside the hub.",
    detail:
      "Classics brake with drums front and rear. Discs arrived with the moderns (ET4 front disc, 1996) and stop harder with less fade.",
  },
  {
    term: "Split rim",
    short: "Two-piece wheel that unbolts for tube changes.",
    detail:
      "The classic 10-inch pressed rim splits so a tube can be changed without tyre levers. Corrosion between the halves is the thing to check.",
  },
  {
    term: "Smallframe / largeframe",
    short: "The two classic size families.",
    detail:
      "Smallframes (50, Primavera) are compact with small wheels; largeframes (GS, Rally, PX) are bigger all round. Few parts cross over.",
  },
  {
    term: "Frame number",
    short: "The stamped identity of a scooter.",
    detail:
      "Prefix plus serial (e.g. VSC1T 1001–36700) pins a machine to a model and year range. Always confirm parts against it — model names alone are not enough.",
  },
  {
    term: "LEADER / Quasar / 3V / i-get",
    short: "Piaggio's modern four-stroke engine families.",
    detail:
      "LEADER powered the ET4 and early GT; Quasar the GTS; 3V the 946 and LX; i-get the current small engines. The name tells you which parts book to open.",
  },
  {
    term: "Euro 2 / 3 / 4",
    short: "Emissions standards that killed the two-stroke.",
    detail:
      "Each step tightened exhaust limits. The PX survived to Euro 3 with a catalytic converter and ended in 2017 at Euro 4.",
  },
  {
    term: "Top end",
    short: "Cylinder, piston, head and gaskets.",
    detail:
      "The wearing heart of a two-stroke. A 'top-end refresh' means rings, gaskets and measuring the bore — the most common engine job.",
  },
];
