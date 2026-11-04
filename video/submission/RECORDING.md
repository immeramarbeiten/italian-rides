# Recording the real application

## Entry points

- Home: http://localhost:3000/presentation
- Inspect: http://localhost:3000/presentation?start=/inspect
- GTS study: http://localhost:3000/presentation?start=/models/vespa-gts-granturismo/viewer

The presentation route loads the **actual app** in a same-origin iframe. It adds the browser frame and backdrop. The pointer layer responds to actual pointer events. It does not create masks, fill in findings or trigger model calls. To leave recording mode on an ordinary tab, open `/?record=0`.

## Agent-driven recording

An agent can operate the page through the same controls used by a person. Use semantic labels and wait for visible states, rather than sleeping a guessed number of seconds. The iframe is titled “Italian Rides interactive demo”; use frame-scoped locators when the browser supports them. Capture screenshots/recording through the browser/computer tools available to the agent.

The current CUA browser exposes screenshots but no continuous video-recording capability. It can drive the entire journey and collect still captures. For a final fluid recording, run a screen recorder while the agent operates the browser. On macOS, `record_macos.py` can record an explicitly selected screen rectangle with the system recorder. Screen-recording permission must already be available, or the OS may ask the user to grant it. The script does not change permissions.

```sh
python3 video/submission/record_macos.py --rect X,Y,WIDTH,HEIGHT --seconds 60 --out video/submission/clips/03-agent.mov
```

Record only the presentation region, with the browser at 1920×1080 or larger. Keep the chat, account details, notifications and unrelated tabs outside that rectangle. The custom pointer is already in the app; system cursor capture is optional.

## Actual capture sequence

1. Open the presentation entry and choose the synthetic cracked-mirror sample.
2. Enter the concern from STORYBOARD.md. Pick GTS / 125; leave the year blank.
3. Continue to inspection. Wait for the initial identification response.
4. The default Agent inspection view should be visible. Click **Inspect with agent** once.
5. Capture the complete run: focus selection, model-returned mask on the photo, real crop, result. Keep the original uncut recording.
6. Click **Confirm part & continue** once. Capture the guidance and source locator.
7. Open the GTS study. Record orbit, separation and instruments. Return to the same inspection.
8. Open **Prepare a workshop request**; edit the draft if needed and copy it. The film must say “request prepared”, never “request sent”.
9. Open **Record in My Garage**, select an explicitly labelled demo scooter, set **Planned**, enter the actual decision and save. Refresh once and verify persistence.
10. Record a short tyre sample/check vignette as a separate take.

Capture 2–3 seconds of stillness before and after each key action. Keep every shot in its own file as well as one uninterrupted run. Name final trimmed clips with the exact IDs in `timeline.json`, for example `03-agent.mp4`.

## Time compression

Keep the cursor interaction at normal speed. Long model waits may be removed or accelerated, with “Processing time shortened” shown at the cut. Keep the original latency in the uncut source recording and record it in the capture log. Never add a mask or finding that was absent in the source take.

## Human clips also work

A person can follow exactly the same path. Drop the trimmed clips into `video/submission/clips/`. Use `render.py --clips ...` to assemble them. The layout already provides the browser-window framing, so record it once rather than adding a second browser frame in editing.

## Capture log

For each model take note: date, commit or worktree state, fixture filename, selected family/engine, exact concern, session ID, observed result, duration and any failure. The `captures/` directory holds only real CUA still captures. Raw API responses must omit keys and other credentials.
