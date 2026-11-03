<p align="center">
  <img src="public/frieze/ill-vespa-gts.jpg" alt="Italian Rides — studio plate of a Vespa GTS" width="100%">
</p>

<h3 align="center">An AI field mechanic for the machines we keep.</h3>

<p align="center">
  <a href="https://cerebralvalley.ai/e/meta-ai-developer-hackathon"><img src="https://img.shields.io/badge/Meta_Hackathon-Oct_2026-0082FB?style=flat-square" alt="Meta Hackathon Oct 2026"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square" alt="Next.js 16"></a>
  <a href="https://dev.meta.ai/docs/models"><img src="https://img.shields.io/badge/Meta_Model_API-Muse_Spark_%2B_SAM-0467DF?style=flat-square" alt="Meta Model API"></a>
  <img src="https://img.shields.io/badge/status-building-amber?style=flat-square" alt="Status: building">
</p>

<p align="center">
  <a href="#the-loop">The loop</a> ·
  <a href="DIARY.md">Build diary</a> ·
  <a href="#credits">Credits</a>
</p>

Add a scooter photo and describe the concern. The agent chooses a visible area, asks SAM for an outline, and examines a close-up. The owner confirms the suggestion, explores prepared mirror or tyre guidance, and can create an editable workshop enquiry or a planned garage record. A twelve-model archive and an illustrative GTS assembly provide context. The archive is not yet a general retrieval source for the vision model.

Built for the Meta AI Developer Hackathon, Oct 27 – Nov 4 2026. Every commit here is hackathon work. The current demo direction and capture instructions are in [video/submission](video/submission/README.md).

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

AI features need a Meta Model API key (hackathon credits cover this many times over):

```bash
cp .env.example .env.local   # paste your key — never commit this file
```

The key lives server-side only (`app/api/*`); the browser never sees it.

## The loop

| Step | What happens | Status |
| ---- | ------------ | ------ |
| See it | Photo + your words → ranked components, you confirm | live |
| Speak it | Push-to-talk concern via Muse Voice Transcribe | live |
| Agent | Look → focus → outline → zoom with a visible trace; still your confirm | live |
| Outline it | Live SAM 3.1 mask over your photo, after consent | live |
| Narrow it | One guided question → prepared mirror/tyre sub-detail | live |
| Fix it | Two bounded checks (mirror note, tyre check); generic guides are PX-only | live |
| Keep it | Draft service record — you confirm before anything saves | live |

## What's real, what's illustrative

Everything here is labeled like a museum. The archive — twelve model records, specs, timelines, the 3D viewer, the garage — is real and runs today. Fitment data and repair procedures are illustrative PX-pattern content, hidden from modern scooters: always confirm part numbers and torque values against the workshop manual for your exact variant. Image identification, SAM outlining and the agent's close-up analysis use the live Meta Model API. Guided questions, source locators and bounded actions are prepared content. Optional voice transcription is available in the upload form; it is not a conversational voice agent. Garage and inspection records are stored in this browser.

## Inside the repo

```
app/         routes — archive, timeline, models, inspect, repairs, garage, clubs
components/  3D viewer, field guide, steppers, garage, clubs directory
lib/         archive data, faults, fitment, service schedules, glossary
design/      brand tokens, Blender pipeline, repair scope, renders
public/      studio plates, documentary photos, 3D models (all credited)
```

## The archive

Twelve milestone records from 1946 to 2018, spanning the Vespa 98 through the Elettrica. Studio illustration plates, credited documentary photographs, an Inside-the-Vespa systems guide, fault finder, glossary, and club directory.

## Credits

- AI: Muse Spark, SAM 3.1, Muse Voice via the Meta Model API; one feature on Muse Spark Open
- 3D: Vespa Primavera ET3 by Nadia Ribitis, CC-BY-4.0 (Sketchfab)
- Photos: Wikimedia Commons contributors, credited per image (`public/frieze/CREDITS.txt`)
- Built with Muse Code. Fan-made tribute — not affiliated with Piaggio or Meta.

## License

Landing before submission (MIT intended). Commons photos and the ET3 model keep their own licenses.
