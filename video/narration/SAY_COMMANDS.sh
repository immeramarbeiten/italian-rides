#!/bin/sh
# Final narration with Apple voices. Run on your Mac (needs audio services):
#   ./video/narration/SAY_COMMANDS.sh
# Renders 48 kHz WAVs into video/assets/say/ for film.py --voice say.
set -eu
cd "$(dirname "$0")/../.."
OUT=video/assets/say
mkdir -p "$OUT"
VOICE="${VOICE:-Daniel}"
RATE="${RATE:-170}"
for seg in 02 03 04 05 06 07 08 09 10; do
  echo "seg$seg ($VOICE @ $RATE)…"
  say -v "$VOICE" -r "$RATE" -o "$OUT/seg$seg.aiff" -f "video/script/seg$seg.txt"
  afconvert -f WAVE -d I16@48000 -c 1 "$OUT/seg$seg.aiff" "$OUT/seg$seg.wav"
  rm "$OUT/seg$seg.aiff"
done
echo "done → $OUT"
