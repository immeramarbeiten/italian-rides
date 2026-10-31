# Live browser test — Italian Rides hero lane

Do these in order on the machine that will record. Tick each box only for
what you actually saw; on any failure, note it and move on — do not fake
a pass. Cases 1–2 are the demo; the rest harden it.

Setup: `npm run dev`, open http://localhost:3000, console open and clean,
1440×900. `META_API_KEY` in `.env.local`.

## Demo path

- [ ] **1. Mirror lane (Entry B).** On `/inspect`, type “my mirror is
  loose”, pick family GTS / engine 125, load the healthy-mirror fixture.
  Expect: ranked list with Handlebar `SUGGESTED` near the top; match note
  mentions the AI models. Tap the mirror → consent prompt appears →
  Outline → a real SAM mask draws over the mirror. In the pilot panel,
  pick Left mirror → Confirm. Expect: right column jumps to the mapped
  view for the SAME component; “See the reference study” plays the
  photo-cutout → reference transition with the honest caption. Answer
  the guided question (Stem), read the sub-detail + bounded mirror note.
  Record in garage → prefilled draft names the mirror → Save → the
  timeline shows the entry with your quoted words.
- [ ] **2. Tyre lane.** New inspection, front-tyre fixture, concern “tread
  looks worn”. Expect: pilot offers Front tyre → confirm → transition →
  guided “Tread wear” → owner-manual check → garage draft → save. No
  torque, part numbers, or fitment verdicts anywhere on either lane.

## Corrections and failures (judges trust these)

- [ ] **3. Re-tap resets honestly.** On a confirmed mirror, tap a
  different spot. Expect: pilot confirm clears (it belonged to the old
  mask); re-confirm the new outline; garage draft follows the latest.
- [ ] **4. Assembly overrides pilot.** Confirm pilot Left mirror, then
  select Wheels in the ranked list instead. Expect: pilot clears, draft
  says Wheels — never a mirror label on wheel work (and vice versa).
- [ ] **5. Empty mask.** Tap bare background with no part. Expect: “SAM
  found nothing” + outline-by-name still available; no fake outline.
- [ ] **6. Consent decline.** Fresh photo, tap, choose “Not now”. Expect:
  no API call, manual selection still fully usable.
- [ ] **7. Not identifiable.** Pick a photo with no clear component (or
  the cockpit-style crop). Expect: “Component not identifiable” path,
  archive link, the system does not guess.
- [ ] **8. Family correction.** Set GTS + year 1979. Expect: plausibility
  warning; fixing the year clears it. (The eval caught a real
  HPE→Primavera miss — show a correction like this in the video.)

## Robustness

- [ ] **9. Degraded mode (optional, takes a restart).** Temporarily move
  `.env.local` aside, restart dev, reload `/inspect`. Expect: honest
  503/unavailable copy, manual flow intact. Restore the key after.
- [ ] **10. Reduced motion.** Enable the OS reduce-motion setting,
  re-run case 1's transition. Expect: static crossfade, same content,
  no animation.
- [ ] **11. Garage honesty.** Open a draft, Discard → nothing saved.
  Save one, refresh → it persists. Edit + delete work. An “Inspected”
  record never claims “Completed”.
- [ ] **12. Narrow viewport.** Repeat case 1 at phone width (~390px).
  Expect: usable, no overlapping controls, console clean.
- [ ] **13. Console.** After all cases: no errors (warnings noted).
- [ ] **14. Agent run.** Fresh mirror inspection, before selecting: Run the
  agent → confirm the sends → watch look → focus → outline → zoom →
  conclude → “Select Handlebar” → normal flow continues. Expect: at most
  4 model calls, failures narrated not hidden, selection still manual.
- [ ] **15. Voice concern.** On `/inspect`, mic → say “my mirror is
  loose” → transcript fills the input (fix it by hand if mis-heard) →
  inspect proceeds. Expect: works over localhost; needs mic permission.

## Sign-off

- [ ] All demo-path boxes ticked; failures written up, not hidden.
- [ ] Cases 3–8 each show recovery, not perfection.
- [ ] Ready to record per DEMO_SCRIPT.md.
