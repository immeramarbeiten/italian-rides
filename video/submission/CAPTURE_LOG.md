# Demo rehearsal — 1 November 2026

These are actual browser-operated flows in the current working tree, not a synthetic replay. Capture images are in the ignored `captures/` directory. No continuous source video was recorded during this rehearsal; these stills do not establish precise model latency.

## Mirror

- Session: `bada853b`.
- Fixture: `ai-gts-mirror-cracked-simulated-v2.png`, displayed by the app as `ai-fixture-mirror-cracked-simulated.png`.
- Owner-selected context: GTS / 125 cc; year unknown.
- Concern: “The mirror glass is cracked. Can it be repaired, or do I need a replacement?”
- Initial response: handlebar candidate at high model confidence. The model also guessed Primavera; this conflicts with the selected GTS reference. The sample is generated and cannot establish an exact model.
- Failure: `rear view mirror` returned no usable mask. The failed-run capture is `agent-full.png`. Keep it as failure evidence; do not use it as a successful result.
- Correction: use the short target phrase `mirror`. A fresh browser agent run returned a decoded mask, a real photo crop and the observation “cracked mirror glass”.
- Owner acceptance saved the returned mask and observation; the accepted label is Mirror throughout the workspace, request and garage.
- Request opened and captured. Nothing sent to a workshop; no supplier price, verified part number or fitment was returned.
- A demo scooter named “GTS 125 — demo scooter” was created. Work was saved as **Planned**, with a note requesting inspection and an estimate. The passport was reloaded and showed the persisted entry. No repair was recorded as completed.
- Passport: `/garage/mvxlx7gb-av3xxt` (browser-local data).

## Front tyre

- Session: `efd28626`.
- Fixture: the simulated front-tyre wear sample.
- Owner-selected context: GTS / 125 cc; year unknown.
- Concern: “I would like to check my front tyre for wear.”
- Actual browser agent run returned a front-tyre mask and a real photo crop.
- Close-up result: **“tread pattern visible”**. It did not establish wear or roadworthiness. The film must preserve that distinction.
- Confirmed Front tyre, opened the prepared pressure/wear guidance and its manual locators. No pressure value or replacement part was asserted.

## 3D reference

The actual GTS front-assembly page was captured at 60% separation. It is an original illustrative study. It is not a reconstructed mesh of the uploaded photograph, a factory model, an exact exploded parts diagram or a repair sequence.

## Checks

- TypeScript: `npx tsc --noEmit --incremental false` passed after the workflow and label changes.
- Unit tests: 43 passed, 0 failed.
- Python production scripts parsed; narration alignment executed successfully against all 391 returned words.
- Narration: one ElevenLabs Ian take, aligned to 175 seconds without changing voice speed; 65 subtitle cues.
- Exact variant, sourced OEM part number, supplier quotation, autonomous delivery and a broad photo evaluation set remain outside the verified demo.
