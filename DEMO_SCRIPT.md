# Italian Rides — Demo Video Script (~3 minutes)

One continuous journey: timeline → model profile → 3D → inspect → repair → garage → community. Let the UI do the talking; narrate the spine, not every pixel.

## Setup (before recording)

1. Start the app:
   - `cd '<project-root>' && npm run dev`
   - Open http://localhost:3000
2. Open `/garage`, click **Load demo data** (seeds scooters + service log so the passport timeline isn't empty).
3. Have one scooter photo ready for the inspect beat (or use a labelled sample on the page).
4. Record at 1440×900; hide bookmarks; check console is clean.

## The walkthrough

| Time | Screen | Action + line |
| ---- | ------ | ------------- |
| 0:00 | `/` Home | ET3 turntable rotating in the hero. "Eighty years of the wasp — an interactive archive, not a brochure." |
| 0:15 | `/` → scroll | Scroll the frieze — twelve milestones, one collection. "Every era, in frame." Click the PX frame. |
| 0:35 | `/models/vespa-px-125-150-200` | Profile prose, telling detail, specs. "Each model gets a profile — story, specs, and the detail that matters." Scroll to Bloodline, anatomy. Click **Explore in 3D**. |
| 1:05 | `/models/…/viewer` | Orbit the licensed ET3 model. "A real model, not a sketch — orbit it, strip it to assemblies." Pick an assembly card. |
| 1:30 | `/inspect` | Upload the scooter photo (or sample). "Now the other direction — from your scooter to the archive." Confirm the component in the workspace. |
| 1:55 | `/inspect/[session]` → repair | Click through to the repair procedure. Step through twice. "Recognition becomes instruction — with the safety warnings up front." |
| 2:15 | `/garage/[id]/service/new` | Confirm the work, save the record. Cut to the passport timeline with the new entry. "And the work lands on the scooter's passport." |
| 2:35 | `/clubs` + `/methodology` | Quick pan of the club directory, then the methodology page. "Community on one side, honest sources on the other." |
| 2:50 | `/` close | Back on the hero. "Italian Rides — every machine has a story. This one keeps it running." |

## Glasses concept card (storyboard, not product)

Hold 10 seconds on a title card: "Next: guided repairs over audio + glasses — storyboarded, not built." Do not imply it exists.

## Demo path (click order)

`/` → frieze → `/models/vespa-px-125-150-200` → `/viewer` → `/inspect` → `/inspect/[session]` → `/repairs/[slug]` → `/garage/[id]/service/new` → `/garage/[id]` → `/clubs` → `/methodology` → `/`

## Fallbacks

- GLB slow to load? The frieze, profiles, and garage are all plain DOM and carry the story alone; the viewer shows its loading state honestly.
- Local storage empty mid-take? `/garage` → **Load demo data** restores the seed in one click.
- Inspect upload fails? Use a labelled sample photograph on the page.
