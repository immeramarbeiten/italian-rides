> Superseded by `submission/STORYBOARD.md` and `submission/RECORDING.md`. This earlier plan is kept for reference only.

# Italian Rides — Video Plan (3:03 draft)

Pipeline: `film.py` renders cards + app scenes + narration + music to MP4.
App scenes are animated from committed real artifacts (`video/data/`:
fixtures, decoded SAM masks, headless agent outputs, UI copy) — no fake
cursors, clicks, or typing. Real screen takes can replace any scene later
via `--clips` (same timecodes). Voice: scratch = Piper Lessac (this
draft); final = Apple `say` per `SAY_COMMANDS.sh`. Music: synthesized
ambient bed (`bed.py`) — original, royalty-free by construction.

## Storyboard

| # | Time | Visual | Audio |
|---|------|--------|-------|
| 1 | 0:00–0:08 | TITLE CARD: ITALIAN RIDES / “Show it what’s wrong.” | Music in, no narration |
| 2 | 0:08–0:25 | SCREEN: home → /inspect, mic → “my mirror is loose”, sample loads | seg02: words + photo to Meta; earn-a-record line |
| 3 | 0:25–0:50 | SCREEN: tap mirror (consent) → live SAM mask → one re-tap | seg03: honest empty states, computed masks |
| 4 | 0:50–1:15 | SCREEN: agent trace runs → ranked suggest → confirm left | seg04: narrated steps, you confirm |
| 5 | 1:15–1:40 | SCREEN: photo cutout → reference transition + caption | seg05: study, not reconstruction |
| 6 | 1:40–2:05 | SCREEN: guided question → sub-detail → sourced note | seg06: one question, one checked step |
| 7 | 2:05–2:19 | SCREEN: tyre lane, faster cuts | seg07: owner-manual check, hard stops |
| 8 | 2:19–2:39 | SCREEN: garage draft → save → timeline entry | seg08: drafted, never automatic |
| 9 | 2:39–2:53 | ARCHITECTURE CARD: Spark → SAM → Confirm → Record + honesty rules | seg09: three models, zero invented specs |
| 10 | 2:53–3:03 | END CARD: “Point, confirm, fix. Built on Meta AI.” + repo | seg10 + music out |

Total narration ≈ 265 words. Mandatory beats (from DEMO_SCRIPT.md): consent
visible, one correction, “reference visualization, not a 3D reconstruction”
on screen, no torque/part-number/fitment claims anywhere.

## App scenes (no camera needed)

Each scene below `film.py` builds from real data — no human recording:

1. speak (0:08–0:25): fixture photo + “SAID: my mirror is loose” bar fade.
2. tap (0:25–0:50): positional pulse + the real decoded SAM mask, rendered
   like the app (translucent mask fill, dashed frame added for legibility).
3. agent (0:50–1:15): the 5 real agent steps appearing + focus card.
4. ref (1:15–1:40): photo → generated-study crossfade + honesty caption.
5. guided (1:40–2:05): real question copy → stem highlight → sub-detail.
6. tyre (2:05–2:19): fixture + real mask + check caption.
7. garage (2:19–2:39): real entry format, lines appearing in order.

## Optional: real screen takes (swap-in path)

If a human later captures the running app (1440×900, console clean),
trim the 7 shots above into `video/clips/shot-*.mp4` and run
`film.py --clips video/clips` — takes replace app scenes 1:1, same
timecodes, narration untouched. Keep a backup take of shots 2–4.

## Narration script (final wording)

seg02: Say what's wrong, and show it the scooter. Your words and your photo
go to Meta's models — Spark to understand, SAM to outline. Analyzers label
pixels. This one has to earn a record.

seg03: Tap the part and a live outline draws itself around it. Missed? Tap
again — the app would rather show you an honest empty state than a
confident fake. Every mask you see is computed, never drawn on.

seg04: Or let the agent drive: it looks, focuses, outlines, then zooms in
for a closer look — narrating every step. It ends where it must, with a
suggestion. You confirm. Left or right is yours to settle.

seg05: Watch your photo become the reference. This generated study isolates
the same mirror — a reference visualization, not a reconstruction. Your
scooter stays yours; the drawing just helps you read it.

seg06: One question narrows it down: the stem, or the head? You get a
single checked next step with its source attached — and anything
unverified says so, in plain words.

seg07: Same loop, second component. The front tyre gets a real
owner-manual check: pressure cold, wear indicators, and a hard stop at
anything a photo can't judge.

seg08: Confirmed work lands on the scooter's passport — drafted, never
automatic. You say what you actually did. Nothing saves itself.

seg09: Underneath: three Meta models, one confirmation rule, zero invented
specs. No torque from memory, no part numbers from thin air. The
evaluation on record includes the failures.

seg10: Italian Rides. Point, confirm, fix.

## Music direction

Warm ambient pad loop, slow attack, low in the mix (−9 dB under narration
via ducking in film.py), 4 s fade in / 6 s fade out. Chords: Am9 – Fmaj9 –
Cmaj9 – G6, ~24 s each. Regenerate anytime: `bed.py` is deterministic
(seed 7). If you prefer ElevenLabs royalty-free music instead, drop a
~200 s WAV at `video/assets/music.wav` and film.py uses it.

## Render commands

```sh
# Draft (slates + scratch voice + synth bed):
video/.venv/bin/python video/film.py --out /tmp/vdraft/draft.mp4

# Final (your clips + Apple narration + chosen bed):
./video/narration/SAY_COMMANDS.sh   # renders segments to video/assets/say/
video/.venv/bin/python video/film.py --clips video/clips --voice say --out ~/Desktop/italian-rides-final.mp4
```
