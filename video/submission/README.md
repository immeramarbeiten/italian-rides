# Italian Rides — submission film, new direction

This package replaces the previous film concept. Target: **175 seconds, 1920 × 1080, 30 fps**, with a real owner workflow, a calm narrator and legible product interaction.

Start with `STORYBOARD.md`. `timeline.json` contains the timing and narration; `narration.txt` is the continuous voice script. `RECORDING.md` describes how to record the running app agentically or by hand. `render.py` accepts actual screen clips for the final and actual still captures for an explicitly labelled storyboard preview. It does not synthesize product results or interactions.

The main story is: **cracked mirror → agent focus → SAM mask → close-up → owner confirmation → sourced guidance → editable workshop request → planned garage record.** A short tyre vignette shows the second prepared path. Archive browsing gets at most a few seconds. The 3D study supports comprehension and is labelled illustrative.

Open http://localhost:3000/presentation?start=/inspect for the recording frame. It is the live application inside a same-origin iframe, against a quiet desktop background. The pointer follows actual events; click rings come from actual clicks. `?record=0` on an ordinary app page disables recording aids. No responses, latency or findings are fabricated in this view.

## Render

Use the existing local video environment:

```sh
video/.venv/bin/python video/submission/render.py --animatic --out video/submission/output/storyboard.mp4
video/.venv/bin/python video/submission/render.py --clips video/submission/clips --out video/submission/output/submission.mp4
```

Optional `--voice narration.mp3` adds the narrator. Final mode refuses missing clips rather than quietly filling them with invented scenes. Supply shot names from `timeline.json` as MP4 filenames; title/system cards are rendered by the compositor.

The output folder and capture folder are ignored by Git. Keep the original capture, edited clip and source manifest together locally. Preserve an uncut successful model run for review.

## Rehearsal outputs

`PROJECT_REVIEW.md` records the product assessment and remaining limits. `CAPTURE_LOG.md` records the two actual model runs, including the failed mirror phrase and the conflicting vehicle guess.

The generated narration and aligned outputs are local in `output/`. To rebuild the narrated still preview:

```sh
video/.venv/bin/python video/submission/render.py --animatic --manifest video/submission/output/timeline-aligned.json --voice video/submission/output/narration-aligned.wav --out video/submission/output/storyboard-v2.mp4
```

For the final, use that same aligned manifest and voice with `--clips`, omitting `--animatic`. `output/captions.srt` contains the aligned subtitles for the editing application or video player. The compositor does not burn them into the video.
