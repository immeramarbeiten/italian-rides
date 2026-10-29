# Italian Rides — Build Diary

Project: Italian Rides (Meta Hackathon Oct 2026)
Stack: Next.js 16 + React 19 + TypeScript, React Three Fiber + drei, Tailwind 4, motion, zustand
Demo flow: `/` → `/timeline` → `/inspect?model=…` → `/parts` → `/garage` → `/workshop` → `/clubs` → `/`

Visual version: open [diary.html](./diary.html) in a browser (checkboxes persist per browser).

## Status at a glance (Oct 27 — P0 spec build, green 124 pages)

- P0 product spec built out in brand v1.1 language: `/archive`, `/brands/vespa`, `/models/[slug]` + `/viewer` + `/components/[slug]`, new `/inspect` + `/inspect/[sessionId]`, `/repairs/[slug]`, `/garage/[vehicleId]` + `/service/new`, `/methodology`, P1 stubs (`/parts/[slug]`, `/workshops`, `/clubs/[slug]`, `/events`, `/passports/[publicId]`, `/workshop/jobs/[id]`).
- Build green: 124 static pages, TS clean. Verified via prerendered-HTML checks (10/10 route markers, incl. repair stepper SSR).
- Inspect is an honest local demo: filename heuristic + manual confirm, EXIF stripped, localStorage only. No ML connected; methodology page says so.
- Still unverified in a real browser (sandbox EPERM on sockets). Still open: SCOPE CALL, GLB export, real clubs/fitment data, video, judges README.

## Done

- [x] Scaffold: Next.js app router, TS, Tailwind, R3F, drei, motion, zustand, shadcn-style `components/ui`
- [x] Home `/` with hero + 3D scooter + tour banner
- [x] Timeline `/timeline` — 12 Vespa models, decade filter, detail panel, source labels
- [x] 3D inspect `/inspect` — procedural Vespa, orbit, 6 hotspots, exploded-view slider, X-ray toggle, GLB loader slot
- [x] Parts `/parts` — photo-ID mock, fitment matrix (fit/adapt/no × 12 models), maintenance guides with checklist + queue-to-workshop
- [x] Garage `/garage` — my scooters, mileage/service log, localStorage persist, Load demo data seed
- [x] Workshop `/workshop` — job cards, Start/Finish flow, receives queued jobs from guides
- [x] Clubs `/clubs` — member badge, clubs list, parts discovery search
- [x] Tour banners (numbered "continue the tour" on every step)
- [x] `DEMO_SCRIPT.md` — 60–90 s video walkthrough with timestamps + fallbacks
- [x] Build workflow complete: final build green, route table + prerendered-HTML content checks per route, link audit passed

## Still open

- [ ] Live browser pass: `npm run dev` → open http://localhost:3000, walk the tour, check console for errors (never run — sandbox blocked it)
- [ ] Real Blender GLB export into `public/models/` (procedural fallback works, but hybrid goal needs at least one GLB)
- [ ] Part identification beyond mock (real classifier or documented heuristic limits)
- [ ] Verified fitment data (real part × model sources, not mock matrix)
- [ ] Backend/persistence beyond localStorage (if hackathon judging needs multi-device)
- [ ] Record demo video following `DEMO_SCRIPT.md`
- [ ] Mobile/responsive pass + console-error check in real browser
- [ ] README for judges (what it is, how to run, what is mock)
- [ ] PIVOT (Round 24): Meta-model heartbeat — real AI inspect, SAM overlays, voice repair mode, agentic diagnose, Spark Open feature
- [ ] Public repo + deploy before Nov 4 9PM ET (private until then is fine)

## Log

- 17:35 — Project folder confirmed, empty. Scope set: full demo user flow, Next.js+R3F+shadcn/Tailwind+motion+Blender hybrid.
- 17:5x — Scaffold complete: Next.js 16, all deps installed, 7 route slots created.
- 18:0x — Timeline + 3D inspect + parts + garage/workshop/clubs builders finished (all components + lib data on disk).
- 18:10 — Integrator wired tour banners + `DEMO_SCRIPT.md`; build passes.
- 18:1x — Verifier/synthesis running. Diary created (DIARY.md + diary.html).
- 18:20 — Workflow COMPLETE (11/11, 0 failed). Final build green, all routes prerendered, demo flow verified via HTML checks. Caveats: no live HTTP/browser smoke (sandbox EPERM), no licensed GLB (Blender absent; recommended: Sketchfab Vespa V50 CC-BY by ya.iljinser into `public/models/`), fitment/mock data illustrative. Next: live browser pass, GLB, video.
- 18:30 — Design reset agreed: first draft was structure-only. New flow: user drops screenshots in `design-inspo/` → coded direction examples to vote on → tokens → rebuild. Target feel: Apple-effortless + Airbnb-modern + Stripe-functional, "precision archive" edge. Blender now installed (unverified from sandbox). Glasses: no build; demo video will storyboard a glasses+audio guided segment instead. Real clubs (VWC directory + VCOA, NA+EU) and real parts sources (SIP catalogs, Piaggio parts manuals — facts only, no redistribution) queued for post-design-lock rebuild.
- Oct 27 — User added 17 screenshots (retro display type, Watts timeline scrubber, polaroids, holo/flip cards, dark pro UI, Airbnb). Built 3 coded directions in `design-inspo/directions/`: A White Frieze, B Instant Film (+skid-mark footer, AI concept photos), C Collector Cards (holo+flip). Awaiting vote → tokens → rebuild. Comic-view idea parked as a future 3D toon-shader inspect mode.
- Oct 27 — Voted: A+B fusion. Froze `design/tokens.md` (“white archive, instant soul”: Archivo + Fraunces italic + Plex Mono; ink/rosso/sand/asphalt). Rebuilt home (frieze + fitment teaser + polaroid 3D), timeline (scrubber + frieze + spec sheet), header, footer (skids), buttons/badges/cards. Old theme names kept as palette aliases; green semantics fixed (verde/ambra). Build green 10/10, prerender verified. No AI images shipped — frames are photo-ready (`art` prop) for Blender/owner photos.
- Oct 27 — Round 2: renamed to Italian Rides (app + metadata + footer + diary), new wasp logo mark, timeline reordered (frieze → scrubber → sheet), detail sheet rewritten (playful blurb + ENGINE/BUILT/BORN specs + parts/3D CTAs, sources shrunk to one mono line), fixed runaway hero-viewer growth (bounded heights + min-w-0), new /brand guide page with live tweak lab, wrote `design/imagery.md` (hybrid style reco + verified sources + Blender plan). Build green 11/11. Still open: style confirm, Sketchfab V50 download, first Blender turntable still.
- Oct 27 — Round 3: brand v1.1 per critique (positioning draft, body-type rules, Fraunces 3-uses, control states + contrast notes, mark mono/simple/clearspace, frieze spec, radius scale, 80-vs-72 rule, baseline/lab split, product patterns; Brand removed from header nav, still at /brand). Blender pipeline live (needs unsandboxed shell): `design/blender/build.py` v3 → PX side still 1200×900 + .blend → wired as Render 001/012 (PX frieze frame + detail panel). Build green 11/11, art verified in HTML. Still open: SCOPE CALL (Vespa-first vs platform), render polish (fender, lamp embed), 11 more stills, GLB export.
- Oct 27 — Round 4 (landing images): parametric `design/blender/series.py` — 12 liveries (period colors, wheel sizes, scales) rendered in one 64s run → `public/frieze/*.png` + per-model `.blend`. All 12 wired via FRIEZE_ART (home + timeline friezes, detail panels). Spot-checked black/white/orange. Build green 11/11, 12/12 refs verified. Still open: SCOPE CALL, render polish rounds, GLB export, real clubs + fitment data, video.
- Oct 27 — Round 5 (1:1 hero + photos): detailed `design/blender/px150.py` (fender arc, rails, speedo, levers, cable, vents, latch, PX badge, rack, stand) → 1200×900 hero still, checked vs real PX ref (~80% there, stylized not photoreal). 8 Commons photos licensed+downloaded (CREDITS.txt + visible attribution); SS180/Primavera/Elettrica keep series renders (no exact CC photo). Frieze = 1 hero + 8 photos + 3 renders. Build green, 12/12 verified. Still open: SCOPE CALL, true-photoreal path (Sketchfab scan import), GLB export, real clubs + fitment, video.
- Oct 29 — Round 16 (diagnose/workshop trust rework): quarantined petrol/fuel-line/bump procedures to labeled historical archive; diagnose is now scooter-first + observation decision flow w/ model-gated values (GS/PX documents); workshop cases w/ handoff (status open→ready→referred→resolved), JSON export/import, guide-scope labels + modern-scooter warning, vehicle reference card; spec table moved out (archive link), checklist reframed as general prompts, stale marketplace blurb fixed. Build green 126.
- Oct 29 — Round 15 (field guide + clubs): verified GTS125 carb (ZAPM313/KEIHIN CVEK-30, pp.9-12) vs i.e. injection (ZAPM451, pp.8-9) + wiring names (injector/pump/temp/ECU); built Inside-the-Vespa field guide (original SVG stage, 2 configs, 5 systems w/ honest pending states, 3-level explanations, Why-panel w/ manual+pages, knowledge trail) on GTS page; bloodline neighbours labeled; clubs → 5 verified orgs (VCC Chicago, Italia, VCB 1952) + 3-event calendar w/ region badges. Dup PDFs confirmed (left in place — user files). Build green 126.
- Oct 29 — Round 14 (modern data + friend feedback): mined GTS125 workshop/owner manuals (text layers!) → service schedule + consumables module live on GTS page (intervals, 5W-40/1.1L, hub 80W-90/150cc, 1.8/2.0/2.2 bar, RG4HC/CR8EB 0.7-0.8mm 12-14Nm, DOT4, coolant, preload). Friend fixes: scope lines (family vs single), outcome-labeled actions, illustrative-3D disclaimer, photo/render-aware captions, Parts-compatibility w/ explicit FITS/ADAPTS/DOES-NOT-FIT, anatomy framed as general primer. Build green 126.
- Oct 29 — Round 13 (persona gaps): novice → /glossary (18 terms) + timeline primer; modern owner → diagnose honestly scoped to classic two-strokes w/ modern-pending note; nerd → Numbers & codes on all 12 profiles (frame ranges, counts, paint, editions). Build green 126.
- Oct 29 — Round 12 (manuals → product): 18 manuals inventoried; built Fig. caption/callout system (model heroes, timeline sheets), /diagnose fault-finder (20 manual-sourced entries, owner/dealer levels, GS+P200 sources), GS premix spec table + SpecTable component, trilingual names on component pages. Upgraded 3 weakest photos (GS→ChiemseeMan PD meet shot, V50→Arezzo, GTS→Wahrlich CC0 studio). Catalogs: SIP is Cloudflare-walled (manual browser research needed), legit SIP assembly PDFs exist; Sketchfab CC shortlist for user download (annaandrei Retro, danilo 50 Special). Openverse/Unsplash unreachable without API key. Build green 125.
- Oct 28 — Round 11 (museum model + build fix): build error was stale .next cache after part-identifier deletion (no live imports) — cleaned, green 124. Owner-provided museum-study GLB staged as primary `vespa.glb` (ET3 kept as `vespa-et3.glb` fallback in slot list); museum still → PX frieze slot; credits carry explicit LICENCE-TO-CONFIRM. GLB credit UI now handles unlinked licences.
- Oct 28 — Round 10 (photos + research + honesty purge): last 3 renders replaced w/ exact-model Commons photos (SS180 = Kebbins00's 1965 SS180; Primavera = '72 smallframe, cropped; Elettrica = Corvettec6r) + CREDITS + FRIEZE_SOURCE links; researched sourced Setup field for all 12 (WP EN/DE, vespa.name, Classic Trader, Autoblog/Bennetts) w/ corrected year ranges; 12/12 detail pages verified; parts marketplace removed from clubs (fictional vendors/prices deleted), clubs reduced to 3 verified orgs w/ VWD2027 date; mock PartIdentifier removed from /parts (→/inspect link instead); torque disclaimer added to guides; demo seed club fixed. Build green 124.
- Oct 28 — Round 9 (journey rework, plan go): one spine (landing timeline → profile → parts/3D → inspect → garage). Landing cards rewired to real IA, fitment teaser made honest (invented SIP ref dropped), frieze unified w/ warm grade; model pages gained Profile prose + Telling-detail anecdote (12/12 grounded in cited facts) + Bloodline strip; /brands/vespa → /timeline redirect (refs repointed); timeline sheet gained Open-profile CTA; DEMO_SCRIPT rewritten to 3-min beats. Browser QA still owed (sandbox).
- Oct 28 — Round 8 (real GLB): no-purchase solution found — Vespa Primavera ET3 by Nadia Ribitis, CC-BY-4.0 (via SceneView mirror of Sketchfab "old-scooter"). 2.6MB, 1 mesh + 4 textures, buffer-validated. Staged as `public/models/vespa.glb` + CREDITS.txt; viewer auto-loads it (auto-framing normalization added), landing hero now shows the real model w/ turntable + attribution; per-model geometry + mesh-level hotspots still pending (single mesh → orbit-only in GLB mode). Build green, hero/viewer HTML verified. Runtime render still needs a real browser.
- Oct 27 — Round 7 (PX study): evaluated externally produced outputs. Adopted 3/4 study v2 (clearly better than our blocky px150.png side view) → `public/frieze/px-study.jpg` (1200px, 72KB) in the PX frieze slot; archived both .blends + v1 PNG under `design/blender/px-study/` (rights-clean, unverifiable in sandbox). Cherry-picked Commons file-page URLs → `FRIEZE_SOURCE`, credit lines now link out (timeline sheet, model page, passport, inspect samples). Rejected: hero photo swap (live 3D hero is the wow), timeline reorder (undoes approved order), page/timeline rewrites (near-copies). Noted pre-existing honesty bug: home FIT_ROWS "SIP #93050000" ref is invented — needs replacing with illustrative label or real ref.
- Oct 27 — Round 6 (P0 spec build): full route map in v1.1 language. New lib (`models.ts`, `inspect-session.ts`, `component-info.ts`), archive explorer (URL-synced search/filters, collection+timeline), Vespa milestone explorer, model overview + immersive viewer (`?component=` deep links) + 72 component pages, inspect upload→workspace (drag-drop, samples, downscale+EXIF-strip, sessions, manual confirm, technical drawer), 6 repair steppers with explicit completion, garage passports + service form, methodology page, footer nav, 6 P1 stubs. Fixed: Button has no asChild (plain-Link passport button), service-form TS narrowing. Build green 124 pages, HTML markers 10/10. Still open: SCOPE CALL, browser pass, GLB, real clubs/fitment, video, README.

## Round 18 — De-generify pass (motoring-archive direction, external review)
- **Homepage:** photo-led hero replaces 3D-in-polaroid (GTS 300 studio shot + quiet credit); headline now product-specific ("An archive for the machines we keep"); red-italic formula removed; 4 generic stats → one archive-index strip (12 models · 1946–2018).
- **Frieze → filmstrip:** tilts, shadows, cardboard borders gone; larger images first, short-year + name baseline, RECORD OPEN selected state; sepia grade removed (photos keep own character).
- **Model pages:** ARCHIVE / TIMELINE / MODEL + RECORD 001–012; admin (scope, 3D caveat, sources) folded into ABOUT THIS RECORD details; primary action "Understand its systems" (#field-guide on GTS, #anatomy elsewhere); 3D demoted to secondary; captions/alt no longer claim "side view".
- **Inspect:** honest lede (manual selection, photo not auto-identified). Label contrast bumped zinc-500→600 on touched surfaces.
- Build green 126/126; markers verified in prerendered HTML.
- Still open from this review: model-specific anatomy copy (generic 6 cards still pasted on every page incl. Elettrica), Archive/Explore/Work density modes, full label-contrast sweep, art-direction standard doc.

## Round 19 — Model-specific anatomy + homepage story pass
- **Anatomy:** new lib/model-anatomy.ts — 72 grounded one-liners (12 records × 6 assemblies), each derivable from the model's profile; model pages show them on cards (2-line clamp), component pages add an ON THIS MODEL box under the general primer. Generic "faired headset on GS/SS" paste-up gone.
- **Homepage:** hero text top-aligned with photo; date range no-wrap; zero-crop aspect (1280/1058) so wheels survive; actions now "Explore the archive" / "Understand your scooter"; "every claim with its source" softened to "Explore the sources behind every record".
- **Page order:** hero → index strip → frieze → INSIDE THE MACHINE (live FieldGuide + knowledge-trail line) → Discover/Understand/Keep journey rows. Illustrative fitment table removed from front page.
- **Frieze:** names/specs wrap (no ellipses), prev/next buttons, hidden scrollbar, first/last year header kept.
- **Footer:** slim subtle skid, product positioning line, photo-credit + non-affiliation, hackathon credit; factory paragraph + Bremsspuren strip dropped.
- Build green 126/126; markers verified in HTML.

## Round 20 — Visual reset: industrial precision, Italian warmth
- **Global:** red top rule removed (logo carries brand); buttons pills → square tools; red-italic headline flourish removed on inspect/diagnose/methodology/glossary (single-treatment sans headlines, font-black → bold); timeline/inspect panels cream → white/zinc-100 with zinc-300 borders.
- **Timeline:** restructured around one selected machine — scrubber on top as primary nav (era chips dropped), hero with year + NN/12 + large image + single "Explore this model" CTA + prev/next, readable sources line, strip below with scroll-sync effect (selection always visible); "New to Vespa?" now a details; disclaimer box dropped (footer carries it); no "side elevation" labels.
- **Inspect:** illustration-first — "Understand a component.", field-guide stage + six assembly chips + primer panel left, photo as optional companion right; samples now visible thumbnails; model selects stay after exploration; CTA "Choose a component"; privacy line shortened to what is true (browser-only, no upload; no delete promise — no delete feature exists).
- Build green 126/126; server markers verified in HTML (entry/explorer are client-rendered, verified by compile).

## Round 21 — White-canvas sweep + plain-language pass
- **Surfaces:** every bg-sand outside brand-guide → white or zinc-100 with zinc-300 borders: buttons (secondary/ghost), badges, scrubber, field guide, model aside + chips, component boxes, viewer, repairs safety box (kept ambra border — status with a job), stepper, archive empty-art, demo-next hover, spec-table head, workspace skeletons/photo/selection.
- **Language:** "in this demo (build)", "demo data/set", "local demo storage" gone from UI — now plain scope notes where the decision happens (garage storage + export warning, viewer orientation-not-measurement, inspect honesty, methodology recognition, workspace labels, sample-scooter loader).
- Zero stragglers (grep clean), build green 126/126, markers verified in prerendered HTML.

## Round 22 — Illustration redraw + nerd review + brand v1.2
- **ScooterStage redrawn:** proper Vespa profile (fender, legshield, column + lamp + bar, step-through + stand, rear cowl, seated seat); fuel chain moved inside the body (tank under seat → engine at rear wheel); nodes resized to r7 so all four read; caption now "schematic, not to scale". Geometry verified via PIL bezier-flatten renders (3 iterations).
- **Nerd review:** 21 fixes across model-anatomy.ts — removed unsourced specifics (PX 10in/split-rim size, 946 hand-finishing, GTS glovebox/instrumentation, 50SS bars/seats, Rally stripe placement, round speedo/horn covers, T5 solo claim, Elettrica battery placement) + softened the PX three-stud split-rim claim in the general primer. Rule enforced: model lines trace to that model's profile or definitional truths.
- **Brand guide → v1.2:** matches shipped reality — square tools, single-treatment headlines, serif banished from headlines, sand retired (zinc-100/300 in), filmstrip rules, no pills/shadows/tilts anywhere incl. tweak lab.
- Build green 126/126.

## Round 23 — Coherent illustration set (AI studio plates)
- Generated 12 white-studio side-profile plates via image model, style-locked to user's GTS reference; rejected 3 (modern-GS, modern-SS, spare-wheel-125) and regenerated era-locked; mirrored 3 right-facers to face left; normalized to 1600×1067 JPEG ~150KB.
- Wiring: FRIEZE_ART = illustrations (frieze, timeline sheet, archive, heroes, passport); new FRIEZE_PHOTO = licensed Commons photos, now shown as FIG. 2 "documentary photograph" with credit on model pages (PX has none); inspect samples stay photographic.
- Labels honest throughout: "studio illustration / AI-generated plate", methodology + brand guide updated (no-AI rule retired).
- Build green 126/126.

## Round 24 — Pivot: AI field mechanic (plan, Oct 29)

Hackathon rules demand meaningful Meta-model use in the product; the archive alone scores ~0 on "Use of Meta AI tooling" and risks the eligibility gate. Reframe: the archive is the knowledge base, the product is a hands-free AI mechanic. Pre-git audit done: no secrets in code; .gitignore hardened (.env*, User manuals/, unlicensed museum-study GLB); User manuals (436MB, copyrighted) and unlicensed vespa.glb must never ship — public builds fall back to CC-BY ET3; local /Users/stefan paths sanitized.

Build order (deadline Nov 4, 9PM ET):
1. Repo (private first, public at submit) + judges README + Meta API proxy route (server-side key)
2. Real AI inspect (Muse Spark multimodal): photo → component + model + condition, keep confidence + manual-confirm UX
3. SAM 3.1 part overlays: masks as SVG polygons over the user photo (viewBox = image pixels), click-to-select
4. Voice-guided repair mode (TTS steps + "next step" transcribe) = the glasses story in a browser
5. Agentic diagnose loop (Spark agent + fault tools + manual citations) → $5k agentic bonus shot
6. One feature on Muse Spark Open via Baseten → $10k open-weight bonus shot
7. Re-cut video around the AI loop (archive = 15s); storyboard session just before recording; X post for viral/community awards

Cut: events-in-area, parts marketplace, more stills/illustrations, brand polish.
Test images: NO scraping (IG/Craigslist/willhaben = assets without permission → DQ risk). Own photos first, Commons-licensed second (candidate: File:Vespa relitto.jpg, CC — verify version + author), Muse Image-generated damaged-part fixtures third.

## Round 24 research notes (Oct 29)

- README benchmarked against 12 frontier repos (OpenClaw, Hermes, Superpowers, vercel/ai, ECC, nanoGPT, Gemini CLI, n8n, shadcn/ui, Codex, browser-use, LangGraph): hero-first, centered pitch, quickstart above the fold, link row, repo tree for judges, honesty section kept as the differentiator.
- jakubkrehel/skills teardown (MIT): agent skill for parametric technical illustration — "model the object once, project many views", illustrative-by-default exports, bundled viewer (part select + sliders + export). Reuse plan: adopt its honesty contract (matches ours) and single-model→many-views for field-guide/repair diagrams; generate one coherent line-art set per repair assembly.
- Repair realism (SIP/Haynes/Modern Vespa/Scooterotica) → design/repair-scope.md: launch DIY six (tire+tube, gear oil, carb clean, plug+cap, cables, brake shoes); clutch/CVT as tool-gated advanced mode; engine/forks/ignition-faults as "talk to your mechanic" mode, not DIY steps.
- API verified: Meta Model API is OpenAI-compatible at https://api.meta.ai/v1 (muse-spark-1.3, vision via image_url). Built app/api/inspect (POST image dataURL → grounded JSON; GET config status; honest 503 without key).
