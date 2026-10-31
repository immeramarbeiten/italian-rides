# Video — reproducible demo film

`VIDEO_PLAN.md` is the storyboard + script + shot list. This folder renders it.

## Setup (once)

```sh
python3 -m venv video/.venv
video/.venv/bin/pip install imageio imageio-ffmpeg numpy pillow
```

Scratch narration uses Piper (also in the venv) + a voice model anywhere on
disk; final narration uses Apple `say` (see `narration/SAY_COMMANDS.sh`).

## Draft render (works now, no recording needed)

```sh
# 1. scratch voice (example with a Piper model at /tmp/pvoice):
for s in 02 03 04 05 06 07 08 09 10; do
  video/.venv/bin/piper --model /tmp/pvoice/en_US-lessac-medium.onnx \
    --output_file /tmp/vdraft/voice/seg$s.wav < video/script/seg$s.txt
done
# resample each to 48 kHz mono, e.g. with afconvert
# 2. music bed: video/.venv/bin/python video/bed.py --out /tmp/vdraft/bed.wav
# 3. film: video/.venv/bin/python video/film.py --out /tmp/vdraft/draft.mp4
```

## Final render (after the screen session)

1. Trim the 7 shots from VIDEO_PLAN.md into `video/clips/shot-*.mp4`.
2. `./video/narration/SAY_COMMANDS.sh` (needs Mac audio services).
3. `video/.venv/bin/python video/film.py --clips video/clips --voice-dir video/assets/say --out ~/Desktop/italian-rides-final.mp4`

Only code, docs, and the script are committed — venv, audio, clips, and
renders stay local (see .gitignore).
