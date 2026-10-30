# P9 mini-eval report — held-out real photos, hero lane

Date: 30 Oct 2026. Harness: `/tmp/eval/` (throwaway, not shipped).
Method: the REAL `POST` handlers from `app/api/inspect/route.ts` and
`app/api/sam/route.ts` executed under node with type-stripping; only two
test shims — `next/server` response wrapper (framework surface, covered by
`next build`) and a curl-backed `fetch` (sandbox Node DNS is broken; route
code unchanged). Live Meta Model API, key from local `.env.local`.
Every SAM box below was rendered onto its photo and eyeballed.

## Photo set (held out — none used as study refs, fixtures, or samples)

1280px thumbs, eval use only, never shipped:

| id | Commons file | licence |
| -- | ------------ | ------- |
| cockpit | Cockpit Vespa GTS 300 ABS Super E4 Modell 2018.jpg | CC BY-SA 4.0 |
| rossa | Piaggio Vespa GTS 250 ie rossa.jpg | CC BY-SA 2.0 |
| gts125 | Vespa GTS 125.jpg | CC0 |
| super | Vespa GTS 125 Supersport.jpg | CC BY-SA 4.0 |
| hpe | Vespa GTS 300 HPE.jpg | CC BY 4.0 |

Ground truth was established by viewing each photo before probing.

## Inspect (muse-spark-1.3): 5 calls, 5 × HTTP 200, all real JSON

| photo | modelGuess | correct? | components |
| ----- | ---------- | -------- | ---------- |
| cockpit | GTS | yes (dial close-up, no full scooter) | handlebar/instrument-cluster 0.95 |
| rossa | GTS | yes | all 6 assemblies, 0.85–0.96 |
| gts125 | GTS | yes | all 6, incl. "GTS badge" mention |
| super | GTS | yes | 5 assemblies (no engine visible — correct omission) |
| hpe | **Primavera** | **NO — it is a GTS 300 HPE** | 6 assemblies, sensible otherwise |

Finding 1 (kept in product): Spark mis-guesses family on front-view black
GTS. The manual family/engine/year selectors + plausibility warning exist
for exactly this case; the demo must show a correction moment, not a
perfect first guess.

## SAM point (sam-3.1): 15 calls, 15 × HTTP 200, every one a real mask

Pixel-verified against the intended part (tap must be ON the part):

| target | taps | verified result |
| ------ | ---- | --------------- |
| rossa mirror | 1 | HIT — tight box on mirror + stalk |
| gts125 mirror | 1 | HIT — mirror head + stalk |
| super mirror | 2 (v1 tap missed) | HIT on v2 — tight box on black mirror head |
| hpe mirror | 2 (v1 tap missed) | HIT on v2 — chrome mirror + stalk |
| super front tyre | 1 | HIT — wheel + fender, tap on tread |
| hpe front tyre | 1 | HIT — tight tread box |
| gts125 front tyre | 2 (v1 hit rim → sliver) | HIT on v2 — full front wheel |
| rossa front tyre | 4 (occluded sliver) | DOCUMENTED MISS — tap on true sliver latches whole-scooter box |
| cockpit dial (negative) | 1 | segments display cluster — expected; SAM is not a classifier |

Finding 2: with a correct tap, SAM isolates mirrors 4/4 and clearly
visible front tyres 3/3. Off-part taps segment what was actually tapped
(pavement ×3, rim sliver ×1) — correct behavior, and the reason the UI
has tap-retry + manual selection + user confirm.

Finding 3: a narrow, half-occluded tyre sliver resolves to the parent
scooter, not the tyre. Mitigation is product-side (retry/confirm copy
already in the demo script's mandatory correction beat), not a model fix
we can ship before Nov 4.

## What this does NOT claim

- No accuracy percentage: n=5 photos is a smoke test, not a benchmark.
- No browser journey test: sandbox has no browser; the click-through
  (upload → tap → mask → confirm → reference → action → garage) still
  needs the user's live pass.
- No latency/robustness numbers under judging conditions.

## Release gate status

Both lanes pass the scripted headless journey on held-out photos;
variant mismatch exposes no verified fitment (no fitment ships at all);
mask failures recover via retry/confirm; history is user-confirmed.
Remaining gates are user-side: live browser pass, recording, deploy env,
public flip, submission.
