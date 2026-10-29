# Italian Rides — imagery brief (Oct 27)

Goal: every frieze frame gets real art, the 3D viewer gets a real GLB, and the
parts pages get teardown illustration. No AI-generated images ship in the app.

## Style decision (recommended: hybrid)

- **Frieze frames → studio-white Blender turntable renders.** One consistent
  angle, one light, white background. Accuracy + consistency across all 12
  models; impossible with scavenged photos.
- **Hero / footer moments → licensed Italian lifestyle photography.**
  Warmth comes from photos, structure from renders.
- **Parts/teardown → original exploded line illustrations** in brand style
  (ink on white, rosso callouts), drawn from references — never copied.

## Verified sources

Photos (per-file license check + attribution where required):

- Wikimedia Commons Vespa media — categories under “Vespa scooters”; example:
  <https://commons.wikimedia.org/wiki/File:Red_Vespa_Scooter.jpg>
  (most files CC-BY/SA — attribute the author in the caption).
- Seen via <https://en.wikipedia.org/wiki/Vespa> (“media related to Vespa
  scooters” link to Commons).

Teardown/part references (facts + look only — never copy or redistribute):

- Scooter Center exploded views (free interactive database, all frames):
  <https://www.scooter-center.com/en/exploded_views>
- SIP Scootershop catalogs (downloadable PDFs with part numbers + diagrams).
- Haynes Vespa P/PX 1978–2012 (buy the book; exploded views inside):
  <https://manuals.plus/xh/asin/0857335928>
- Piaggio workshop manuals floating on doc sites (e.g. vdocuments) are gray
  area: extract facts, never ship the PDFs.

Do NOT use:

- HiClipart / PNG-clipart sites — murky licensing, likely Piaggio press
  images reposted without rights.
- vespa.com / Piaggio press photos without written permission.
- Screenshots of Scooter Center / SIP diagrams shipped as our own.

## Blender plan (per blender skill)

1. Probe: `blender --version`, GPU?, numpy in Blender Python.
2. Models: Sketchfab CC-BY (free account to download, attribute in-app):
   - Vespa V50 by ya.iljinser (7.8k tris, ideal):
     <https://sketchfab.com/3d-models/vespa-v50-926046f28f13487ca8c60c7a0aaa7ec6>
   - Draft Vespa Rally 200, Vespa SS180 (backups, same license).
3. One idempotent `build.py` with `bpy_helpers`: import → decimate if needed
   → split into the 6 named assemblies (frame, legshield, handlebar, wheels,
   engine, seat) → `studio_lighting` + Khronos PBR Neutral → transparent
   film flattened on `#FFFFFF` for turntable stills.
4. Checks every round: look at the render, `contact_sheet.py` for all angles,
   `H.report()` for sizes/polys. Preview mode (50% / 12 samples) until final.
5. Deliverables: `public/models/*.glb` (≤60k tris, Y-up, per-part names for
   hotspots) + `design/renders/*.png` (1200px white turntable stills for the
   frieze `art` slots) + the `.blend` + attribution file.

## Teardown illustration plan

- Hand-trace one exploded view (start: PX engine) as original SVG line art in
  brand style, using SIP/Scooter-Center/Haynes as reference.
- Numbered callouts link to the fitment matrix rows.
- If it lands well, repeat per assembly (6 total).

## Next steps

1. Confirm the hybrid style (or pick one lane).
2. Download + attribute the Sketchfab V50; probe Blender on this machine.
3. DONE Oct 27: v1 blockout still rendered (`design/renders/vespa-side-v1.png`,
   `.blend` saved, script at `design/blender/build.py`) and wired to the PX
   frieze frame + detail panel as Render 001/012. Note: Blender crashes in
   the sandbox (Metal probe) — runs need an unsandboxed shell.
   Remaining: polish rounds (fender arc, cowl taper, lamp embed), 11 more
   model stills, GLB export for the viewer.
4. Then: GLB into the viewer, then lifestyle photo slots, then teardown SVG.
