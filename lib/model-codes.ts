/**
 * Numbers & codes per milestone: frame prefixes, production counts,
 * series and editions. Only what the cited research confirms —
 * no entry means unknown, not zero.
 */

export const MODEL_CODES: Record<string, { text: string; src: string[] }> = {
  "Vespa 98": {
    text: "Series V.98/1–V.98/4 · ≈2,500 built in 1946",
    src: ["WikipediaDE/Vespa98", "Scootering-70Yrs"],
  },
  "Vespa 125": {
    text: "Long-lived line 1948–69, incl. Super and GT derivatives from 1958",
    src: ["WikipediaDE/Vespa125"],
  },
  "Vespa 150 GS Gran Sport": {
    text: "126,350 built 1955–61 in five series · original silver: MaxMeyer 15005",
    src: ["WikipediaDE/VespaGS"],
  },
  "Vespa 50 smallframe": {
    text: "4M+ sold into the 1990s · variants N, L, R, S, SS, Sprinter, SR",
    src: ["WikipediaDE/Vespa50"],
  },
  "Vespa 180 SS Super Sport": {
    text: "Frame VSC1T · nos. 1001–36700 · 35,700 built 1964–68 · red, white, blue",
    src: ["Vespa.name-180SS", "ClassicTrader-180SS"],
  },
  "Vespa 125 Primavera": {
    text: "Classic run 1968–82",
    src: ["Wikipedia/VespaPrimavera"],
  },
  "Vespa Rally 200": {
    text: "180 Rally 1968–73 → Rally 200 1972–79",
    src: ["Wikipedia/VespaRally"],
  },
  "Vespa PX 125/150/200": {
    text: "P125X (VNX1T per SIP catalogue — unverified) · P150X · P200E · 3M+ total",
    src: ["Wikipedia/VespaPX", "Scootering-70Yrs"],
  },
  "Vespa ET4": {
    text: "ET2 50 + ET4 125 at launch · 2nd series + highway-legal 150 in 1999",
    src: ["Wikipedia/VespaET"],
  },
  "Vespa GTS/Granturismo": {
    text: "GT200 (2003) → GTS250 (2005) → GTS300 278cc Euro3 (2008)",
    src: ["Wikipedia/VespaGTS"],
  },
  "Vespa 946": {
    text: "Annual limited editions: Ricordo (3,600), Bellissima, Emporio Armani, (RED), Dior, Snake",
    src: ["Wikipedia/Vespa946-tech"],
  },
  "Vespa Elettrica": {
    text: "Standard + Elettrica X range-extender variant",
    src: ["Autoblog-Elettrica"],
  },
};
