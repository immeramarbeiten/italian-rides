/**
 * Frieze art slots: model name → staged image path.
 * - FRIEZE_ART: coherent AI-generated studio illustrations (white body,
 *   side profile, facing left). Illustrative, not documentary — liveries
 *   and details are representative, not exact.
 * - FRIEZE_PHOTO: licensed Wikimedia Commons documentary photos with
 *   per-image credit (full URLs in public/frieze/CREDITS.txt).
 * Inspect samples still use real photos; model pages show both.
 */
export const FRIEZE_ART: Record<string, string> = {
  "Vespa 98": "/frieze/ill-vespa-98.jpg",
  "Vespa 125": "/frieze/ill-vespa-125.jpg",
  "Vespa 150 GS Gran Sport": "/frieze/ill-vespa-gs150.jpg",
  "Vespa 50 smallframe": "/frieze/ill-vespa-50.jpg",
  "Vespa 180 SS Super Sport": "/frieze/ill-vespa-ss180.jpg",
  "Vespa 125 Primavera": "/frieze/ill-vespa-primavera.jpg",
  "Vespa Rally 200": "/frieze/ill-vespa-rally200.jpg",
  "Vespa PX 125/150/200": "/frieze/ill-vespa-px.jpg",
  "Vespa ET4": "/frieze/ill-vespa-et4.jpg",
  "Vespa GTS/Granturismo": "/frieze/ill-vespa-gts.jpg",
  "Vespa 946": "/frieze/ill-vespa-946.jpg",
  "Vespa Elettrica": "/frieze/ill-vespa-elettrica.jpg",
};

/** Documentary photos (no photo staged for the PX family). */
export const FRIEZE_PHOTO: Record<string, string> = {
  "Vespa 98": "/frieze/photo-v98.jpg",
  "Vespa 125": "/frieze/photo-v125.jpg",
  "Vespa 150 GS Gran Sport": "/frieze/photo-gs150.jpg",
  "Vespa 50 smallframe": "/frieze/photo-v50.jpg",
  "Vespa 180 SS Super Sport": "/frieze/photo-ss180.jpg",
  "Vespa 125 Primavera": "/frieze/photo-primavera.jpg",
  "Vespa Rally 200": "/frieze/photo-rally200.JPG",
  "Vespa ET4": "/frieze/photo-et4.JPG",
  "Vespa GTS/Granturismo": "/frieze/photo-gts.jpg",
  "Vespa 946": "/frieze/photo-r946.JPG",
  "Vespa Elettrica": "/frieze/photo-elettrica.jpg",
};

/** Visible attribution for the Commons photos (CC-BY compliance). */
export const FRIEZE_CREDIT: Record<string, string> = {
  "Vespa 98": "Jay Cross · CC BY 2.0",
  "Vespa 125": "Daderot · CC0",
  "Vespa 150 GS Gran Sport": "ChiemseeMan · Public domain",
  "Vespa 50 smallframe": "Livioandronico2013 · CC BY-SA 4.0",
  "Vespa 180 SS Super Sport": "Kebbins00 · CC BY-SA 4.0",
  "Vespa 125 Primavera": "vespaforum.at · CC BY-SA 3.0",
  "Vespa Rally 200": "Khaosaming · CC BY-SA 3.0",
  "Vespa ET4": "Späth Chr. · Public domain",
  "Vespa GTS/Granturismo": "Michael Wahrlich · CC0",
  "Vespa 946": "Khaosaming · CC BY-SA 3.0",
  "Vespa Elettrica": "Corvettec6r · CC BY-SA 4.0",
};

/**
 * Commons file pages for the credited photos. Filenames verified against
 * public/frieze/CREDITS.txt; re-verify licences before public launch.
 */
export const FRIEZE_SOURCE: Record<string, string> = {
  "Vespa 98": "https://commons.wikimedia.org/wiki/File:1947_Vespa_98_100cc.jpg",
  "Vespa 125":
    "https://commons.wikimedia.org/wiki/File:Vespa_125_Scooter,_1948_-_Science_Museum,_London_-_DSC05675.jpg",
  "Vespa 150 GS Gran Sport":
    "https://commons.wikimedia.org/wiki/File:Vespa_GS_3_150ccm_8PS_1960_1.jpg",
  "Vespa 50 smallframe":
    "https://commons.wikimedia.org/wiki/File:Piaggio_Vespa_Special_50cc_in_Arezzo.jpg",
  "Vespa 180 SS Super Sport":
    "https://commons.wikimedia.org/wiki/File:Haruko%27s_Vespa.jpg",
  "Vespa 125 Primavera":
    "https://commons.wikimedia.org/wiki/File:Vespa_125_Primavera_1972.jpg",
  "Vespa Rally 200":
    "https://commons.wikimedia.org/wiki/File:Vespa_Rally_200_Electronic_1974.JPG",
  "Vespa ET4": "https://commons.wikimedia.org/wiki/File:Vespa_ET4_125.JPG",
  "Vespa GTS/Granturismo":
    "https://commons.wikimedia.org/wiki/File:Vespa_GTS_300_white.jpg",
  "Vespa 946": "https://commons.wikimedia.org/wiki/File:Vespa_946_2013.JPG",
  "Vespa Elettrica":
    "https://commons.wikimedia.org/wiki/File:Piaggio_Vespa_Elettrica.jpg",
};
