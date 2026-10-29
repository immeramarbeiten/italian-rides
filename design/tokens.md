# Italian Rides design tokens — “White archive, instant soul”

> **APPROVED BASELINE — v1.1 · owner: Stefan · Oct 27.**
> Product code follows this file. Experiments live in `/brand` section 08 and
> ship only after a version-log entry here.

## Version log

| Version | Date   | Owner  | Decision |
| ------- | ------ | ------ | -------- |
| v1.0    | Oct 27 | Stefan | Baseline frozen: A+B fusion palette, type trio, components. |
| v1.1    | Oct 27 | Stefan | Positioning draft; scope question open (Vespa-first vs platform); body-text rules; Fraunces roles; color states + contrast; mark variants; frieze spec; radius scale; baseline/lab split; 80-year rule. |

## Positioning (draft — scope call open)

- Proposed: **“The living archive for Italian two-wheel culture.”**
- Promise: every machine documented, every part findable, every ride shared.
- Scope options: (a) **Vespa-first archive** — wasp stays master mark, name
  reserves room to grow; (b) **broad platform now** — wasp becomes the Vespa
  collection mark, master brand is wordmark + frieze. Recommendation: (a).

## Years, honestly

- Brand age: **80 years, 1946→2026** (founding to present). “Eighty years of
  the wasp” always means this.
- Archive range: **1946→2018, 72 years, 12 milestones.** The frieze label
  always shows its own range; never attach “eighty” to the 1946–2018 set.

## Recipe

- **Structure is A:** white museum wall, horizontal frieze of models as the
  timeline itself, hairlines, Stripe-grade data tables.
- **Soul is B:** models sit in instant-film frames (slight tilt, straighten on
  hover), Watts-style year scrubber, editorial serif voice, asphalt footer with
  skid marks.
- Signature handshake: grotesk display + one italic serif accent word in red
  (“Eighty years of the *wasp.*”).

## Palette

| Token      | Hex     | Role                                              |
| ---------- | ------- | ------------------------------------------------- |
| ink        | 171310  | text, primary buttons, header wordmark            |
| rosso      | c1271b  | accent: years-active, CTAs-hover, step chips      |
| rosso-deep | 931b12  | pressed, error text/borders                       |
| verde      | 1e7a3c  | success semantics only: fits, done, complete      |
| ambra      | b26a00  | “adapts with work” only — large/UI use, see below |
| sand       | f3efe4  | bands (scrubber), note fills — never full page    |
| line       | e6e1d2  | warm hairlines                                    |
| asphalt    | 23201a  | footer band                                       |
| fog        | a39c8b  | footer text on asphalt only                       |
| white      | ffffff  | page canvas                                       |

Legacy names (`lagoon`, `racing`, `parchment`) survive as palette aliases
in `globals.css` so older components render in the new language; new code must
use ink/rosso/sand. `racing` also survives as a button/badge *variant name*.

### Control states (all controls implement these)

| Control        | Default      | Hover        | Pressed     | Focus              | Disabled   |
| -------------- | ------------ | ------------ | ----------- | ------------------ | ---------- |
| Primary button | ink / white  | rosso        | rosso-deep  | 2px rosso ring     | 50% opacity |
| Rosso button   | rosso / white| rosso-deep   | ink         | 2px rosso ring     | 50% opacity |
| Outline button | line border  | border ink   | bg sand     | 2px rosso ring     | 50% opacity |
| Text link      | ink underline| rosso        | rosso-deep  | 2px rosso ring     | zinc-400, no underline |
| Text input     | line border  | zinc-400     | —           | border rosso       | sand fill, zinc-400 |
| Checkbox       | 16px, accent verde | —      | —           | 2px rosso ring     | 50% opacity |
| Range/scrubber | accent rosso | —            | —           | 2px rosso ring     | 50% opacity |

Errors: rosso-deep text + icon + retry/next action. Meaning never depends on
color alone — fit states always pair glyph + word (“● FITS”).

### Contrast (spot-checked Oct 27)

- ink/white ≈ 15 ✓ · white/rosso 5.9 ✓ · fog/asphalt 6.2 ✓
- ambra/white 4.2 — large/UI only (≥18px or glyphs), always with a word.
- zinc-500/white 4.8 ✓ small mono ok · zinc-400 decorative/meta only.

## Type

- **Archivo Black (900, −0.04em):** display only, ≤6 words, heroes + years.
- **Grotesk bold = Archivo 700, −0.01em:** card titles, buttons, section
  heads. This is the only “grotesk bold” in the system.
- **Archivo Regular/Medium (400/500):** UI + all body copy. Body rules:
  15–17px, 1.6–1.75 leading, ≤68ch, ink or zinc-700 on white.
- **Fraunces:** exactly three uses — (1) italic accent word in display,
  (2) model blurbs + detail names, (3) footer brand line. Never body,
  buttons, or data.
- **Plex Mono:** kickers, captions, specs, refs, labels. Uppercase + tracking
  for kickers.

## Frieze spec (the signature — recognizable without the logo)

- Frame 248px desktop / 78vw mobile; art 4:3 top; caption below (name 15px
  semibold + mono 11px uppercase specs).
- Giant year Archivo Black 48px, ink; selected = rosso. Tick bar 48×3px
  top-left, ink (rosso when selected).
- Tilt cycles −1.6° / +1.1° / −0.7°; straightens on hover/select.
- Strip: horizontal scroll-snap at all sizes; hairline label row above
  (“THE FRIEZE — {first} → {last} · SCROLL →”).
- Art slot accepts photos; line art is the placeholder.

## Components

- Buttons pill; **product cards 10px radius**; frieze frames 2px; chips pill;
  inputs sharp (0px). Card titles grotesk bold, never serif/centered.
- Tables: hairline rows, sand thead, mono refs, verde/ambra/no-fit glyphs.
- Footer: asphalt + dual skid curves + mono caption, then fog text.

## Mark

- Primary: white wasp on rosso rounded square (radius = 25% of size).
- Mono: ink wasp, no tile — print, embroidery, single-color.
- Below 24px digital: simple variant (no antennae, `detail={false}`).
- Clearspace = one wing-width on all sides. Minimum: 24px digital / 8mm print.
- Never recolor, rotate, stretch, or place on busy photography.

## Imagery rules

- No AI-generated images ship in the app — ever. Concept photos stay in
  `design-inspo/` as look targets.
- Line-art scooter (`VespaLineArt`) is the placeholder until Blender renders or
  licensed photos land; frames already accept an `art` map.

## Motion

Calm only: tilt straighten, scrubber, tour transitions. Everything disabled
under `prefers-reduced-motion` (global CSS guard + MotionConfig).

## Baseline vs lab

- This file + `/brand` sections 01–07 = APPROVED BASELINE.
- `/brand` section 08 (tweak lab) = EXPERIMENT AREA. Values ship only after a
  version-log entry here.
