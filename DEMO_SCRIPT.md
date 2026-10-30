# Italian Rides — Demo Video Script (~3 minutes)

Hero-lane cut: one journey, mirror lane primary, tyre lane second. Film only the
shipped build — real photo → point → SAM mask → confirm → reference → reviewed
action → garage record. Recording session deferred until the build is frozen;
storyboard is done at that point, not before.

Reference configuration: GTS 125 4T Euro 3 (UK catalogue ZAPM31300). Say it
once, on screen and in narration. Anything outside it is labelled unverified.

## Setup (before recording)

1. Start the app: `npm run dev`, open http://localhost:3000
2. Recording env needs `META_API_KEY` in `.env.local` (server-side only).
   Verify live: `curl -s localhost:3000/api/inspect` → `{"configured":true,...}`
3. Record at 1440×900; hide bookmarks; console clean. Reduced-motion OFF for
   the main take (take a second short clip with it ON if time allows).
4. Sample images: use the page's labelled samples. They are Muse-Image
   fixtures AFTER Commons-approved references — say so in the video.

## The walkthrough

| Time | Screen | Action + line |
| ---- | ------ | ------------- |
| 0:00 | `/` Home | Hero + frieze. "Eighty years of the wasp — and now it helps keep yours running." |
| 0:15 | `/inspect` | Type "my mirror is loose", sample mirror photo loads. "Tell it what's wrong, show it the scooter. Words plus photo go to Meta's models." |
| 0:35 | workspace | Tap the mirror (consent first). Real SAM mask draws. "Tap the part. That outline is SAM 3.1, live — not a sticker." |
| 0:55 | workspace | Ranked list suggests Handlebar; pilot panel offers Left/Right mirror. Confirm left. "Spark ranks, you confirm. Left or right is yours to settle." |
| 1:15 | reference | "See the reference study": photo cutout becomes the generated GTS reference, mirror layer isolated. "Your photo becomes the reference — a study, not a reconstruction." |
| 1:30 | evidence | Guided question ("stem or head?"), source locator, bounded mirror note. "One question, one checked next step. What's unverified says so." |
| 1:55 | second lane | Front-tyre sample: tap, mask, confirm, owner-manual check. "Same loop, second component — a real owner-manual check." |
| 2:20 | `/garage` | Prefilled draft → confirm → timeline entry. "Confirmed work lands on the scooter's passport. Nothing saves itself." |
| 2:45 | close | Home hero. "Italian Rides — point, confirm, fix. Built on Meta AI." |

## Mandatory honesty beats (do not cut)

- Consent line visible before any upload is sent.
- One correction moment: reject or re-tap at least once, showing recovery.
- "Reference visualization, not a 3D reconstruction" visible during the
  reference transition.
- No torque values, part numbers, or fitment verdicts appear anywhere.

## Demo path (click order)

`/` → `/inspect` (concern + mirror sample) → tap → confirm left (pilot) →
reference transition → guided answer → action → tyre sample → tap → confirm →
check → garage draft → confirm → `/garage/[id]`

## Fallbacks

- API down mid-take? Page shows the honest configured/degraded states — film
  the fallback once as B-roll, then use the backup recording of the live run.
- Mask empty? Tap again or switch sample; empty-mask copy is part of the story.
- Local storage empty mid-take? `/garage` → Load demo data restores the seed.
