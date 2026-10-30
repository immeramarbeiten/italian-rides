# SAM visual mask evaluation

The previous `EVAL_REPORT.md` records live API calls and screenshots of bounding boxes; it does not establish the quality of decoded mask edges. No new live SAM calls or photographic mask-quality conclusions were made in this pass: network permission for Meta API calls was not granted. The claim that the old results were “pixel-verified” should not be interpreted as a mask-edge evaluation.

## Reproducible test setup

1. Collect consented/licensed real scooter photographs with mirror and front tyre at different angles, image sizes, lighting, reflective surfaces and occlusion; include absence, inaccurate point and out-of-scope images. Record source/permission separately. Don't use synthetic damage fixtures as real photos.
2. Start this project on localhost:3000 with a server-side `META_API_KEY`. The following sends each photograph to the Meta Model API and may consume API credits.
3. Create a JSON manifest in a private folder. Coordinates are pixels in each image after orientation, not viewport coordinates:

```json
[
  {"id":"mirror-side-daylight","image":"/absolute/path/to/photo.jpg","x":745,"y":125},
  {"id":"front-tyre-oblique","image":"/absolute/path/to/photo.jpg","x":1120,"y":740}
]
```

4. Run `node scripts/evaluate-sam-masks.mjs /absolute/path/manifest.json /absolute/path/private-output`. Each output PNG shows the **decoded mask fill and edge**, plus the green prompt point. Raw response mask paths and a status file are saved locally; keep private if the images are private.
5. Visually inspect each mask, and record: correct target, whether entire object is captured, included neighbouring regions, missed thin stalk, edge quality, occlusion, and whether it is usable as a photographic cutout. Record no result, API errors, retries and unsuitable points; do not score them as successes. Retain sample names and source/licence records separately. An HTTP 200 or nonempty box is not a pass.
6. Report successes and failures with denominators, first-attempt and retap results separately. Different photo configurations and small samples limit generalization. In particular, test rider-side correctness and document whether the mask selects tyre alone, tyre plus wheel, or whole scooter.

The script and parser test exercise the rendering machinery but are not a substitute for visual inspection or an end-to-end browser test.
