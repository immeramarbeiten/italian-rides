# Automated product film

The current film uses a real isolated Playwright recording, local macOS narration and a Remotion composition. The output, recordings and rendered clips are ignored by Git because they are large local production assets.

## What exists

- `../record-walkthrough.cjs` navigates the live application in an isolated browser profile, operates the 3D controls, runs the two real Meta model flows and saves planned demo work. It never stubs API responses. A take is marked successful only if both outlines appear.
- `../clips/raw/` contains the original uninterrupted WebM and the capture log. `../clips/edited/` contains the cut video passages used by Remotion. `../output/film-edit-manifest.json` records the source time ranges, speed changes and held ends.
- `../voice-scenes.json` and `../generate-local-voice.py` define the narration. Every passage is generated whole with macOS `say`; it is not cut mid-word or time-stretched.
- `make-music.py` synthesizes a quiet original ambient bed locally.
- `Film.jsx` is the Remotion composition. Generated intermediate media and `film-scenes.json` live under `/private/tmp/italian-rides-video-tools/film-public` and `/private/tmp/italian-rides-video-tools` respectively.

## Rebuild

1. Start the app with Meta API credentials already configured. Choose an isolated browser profile and demo data. The capture script defaults to `http://localhost:3000`; set `DEMO_BASE` to select another local app.
2. Install the pinned production dependencies from this directory into `/private/tmp/italian-rides-video-tools`, and install Playwright's FFmpeg using `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/italian-rides-browsers`. The script uses the locally installed Google Chrome unless `CHROME_PATH` is supplied.
3. Run `record-walkthrough.cjs` with `PLAYWRIGHT_BROWSERS_PATH` set. Check `clips/raw/capture-log.json` and keep the original take. A failed take is not silently substituted.
4. Run `generate-local-voice.py` on macOS, then `production/make-music.py`. Run `video/.venv/bin/python video/submission/production/prepare-film.py` from the project root. It calibrates recording and event clocks and writes the edit manifest.
5. Render the `ItalianRides` composition with Remotion, using `/private/tmp/italian-rides-video-tools/film-public` as the public directory and the installed Chrome executable. Check the result and the edit manifest before sharing.

The synthetic fixtures are deliberately labelled on screen. The 3D study is an illustrative reference; it is not reconstructed from the photograph. The editable request is not sent. This is not an evaluation of the model's performance across all real-world conditions.

Example local setup and render, from the project root:

```sh
mkdir -p /private/tmp/italian-rides-video-tools
cp video/submission/production/package.json /private/tmp/italian-rides-video-tools/package.json
npm install --prefix /private/tmp/italian-rides-video-tools --cache /private/tmp/italian-rides-npm-cache
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/italian-rides-browsers /private/tmp/italian-rides-video-tools/node_modules/.bin/playwright install ffmpeg
DEMO_BASE=http://localhost:3000 PLAYWRIGHT_BROWSERS_PATH=/private/tmp/italian-rides-browsers node video/submission/record-walkthrough.cjs
video/.venv/bin/python video/submission/generate-local-voice.py
video/.venv/bin/python video/submission/production/make-music.py
video/.venv/bin/python video/submission/production/prepare-film.py
/private/tmp/italian-rides-video-tools/node_modules/.bin/remotion render /private/tmp/italian-rides-video-tools/Film.jsx ItalianRides video/submission/output/demo.mp4 --public-dir=/private/tmp/italian-rides-video-tools/film-public --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --gl=angle --concurrency=4 --codec=h264
```

The recorded browser viewport is 1440 × 810; Remotion renders the final composition at 1920 × 1080. Real-time model waiting and parts of the 3D/tyre sequences are shortened, as indicated in the video.

The final `italian-rides-demo-v2.mp4` substitutes the 3D sequence with a better-framed recording from an earlier take. That earlier take successfully recorded the study and later failed when opening the simulated fixture; the original raw WebM is retained in `clips/raw/`. The replacement uses seconds 45–66 and 73–81 of `page@60a17c91534384c618db2d68bb20ba56.webm`, accelerated to the same 16.9-second scene. The complete successful model and garage workflow uses the later uninterrupted take identified in `capture-log.json`. Both the source edit and the Remotion-rendered replacement are preserved in `clips/edited/`.

## Version 3: smoother walkthrough

`../record-intro.cjs` captures real homepage scrolling, carousel movement and the provided-image picker in an isolated browser. Its original take and event timestamps are in `../clips/raw/` and `intro-log.json`. `prepare-v3.py` combines that take with the previously recorded actual model, reference and garage interactions. It crops away the recording stage's outer backdrop so the Remotion composition can draw a single continuous background.

`Film-v3.jsx` adds a short opening, animated transitions and an opinionated animated close. The narration is the original, complete ElevenLabs Ian take in `output/narration.mp3`, used as one continuous track rather than cut at every scene. `score-v3.py` creates the audible original instrumental locally. `captions-v3.py` exports captions from that voice's original word timings. `output/film-v3-edit-manifest.json` identifies every source span and speed adjustment; raw media remains separate.

The demonstration photo is AI-generated and is identified as such on screen. Longer model waits are shortened and labelled. Existing captures contain real returned model outputs and an illustrative 3D study; no result is synthesized in editing.

After capturing `intro-log.json`, generate the score, prepare and render from the project root:

```sh
video/.venv/bin/python video/submission/production/score-v3.py
video/.venv/bin/python video/submission/production/prepare-v3.py
video/.venv/bin/python video/submission/production/captions-v3.py
/private/tmp/italian-rides-video-tools/node_modules/.bin/remotion render /private/tmp/italian-rides-video-tools/Film-v3.jsx ItalianRidesV3 video/submission/output/italian-rides-demo-v3.mp4 --public-dir=/private/tmp/italian-rides-video-tools/film-public --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --gl=angle --concurrency=4 --codec=h264
```

For the final v3 mix, `mix-v3.py` normalizes the continuous narrator and balances the score beneath it. After rendering, remux `output/score-and-voice-v3.wav` as the audio track while stream-copying the rendered picture; this avoids re-encoding the visuals and keeps the spoken words uninterrupted.

## Version 4: paced opening and readable details

`record-home-v4.cjs` captures the actual home page with the complete scooters and year scrubber in view. `prepare-v4.py` uses this take at natural speed, retains the model and application footage from version 3, and inserts seven seconds of instrumental breathing room between complete narration sentences. The captions are shifted by the same amount. `Film-v4.jsx` applies editorial camera moves over the recorded image, focusing on the agent panel, source guidance and the unsent draft. The final scooter sticker is cut from the project's existing AI-generated, representative GTS artwork by `make-sticker-v4.py`; it is not a documentary image or a verified GTS 125 model. The gradient moves throughout the film.

Rebuild the film after starting the local preview server:

```sh
DEMO_BASE=http://localhost:3100 PLAYWRIGHT_BROWSERS_PATH=/private/tmp/italian-rides-browsers node video/submission/record-home-v4.cjs
video/.venv/bin/python video/submission/production/make-sticker-v4.py
video/.venv/bin/python video/submission/production/prepare-v4.py
/private/tmp/italian-rides-video-tools/node_modules/.bin/remotion render /private/tmp/italian-rides-video-tools/Film-v4.jsx ItalianRidesV4 video/submission/output/italian-rides-demo-v4-picture.mp4 --public-dir=/private/tmp/italian-rides-video-tools/film-public --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --gl=angle --concurrency=4 --codec=h264
```

For the final export, stream-copy the rendered video and use `output/score-and-voice-v4.wav` as the audio track. See `output/film-v4-edit-manifest.json` for the recorded source and timing details.

## Hackathon submission cut

`make-rules-cut.py` turns the v4 cut into a screen-footage-led version: it opens on the recorded inspection, declares that the project was built during hackathon week, replaces the workflow slide and end card with actual tyre and garage recordings, and adds editorial labels identifying the two model calls. The source log records a successful live-endpoint take; the example image is AI-generated. Model waiting was shortened in editing, and the labels are explanatory overlays rather than a network monitor. The unchanged v4 narration and captions remain synchronized. Run `video/.venv/bin/python video/submission/production/make-rules-cut.py` from the project root to rebuild it.
