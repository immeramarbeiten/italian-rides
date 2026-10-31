#!/usr/bin/env python3
"""Assemble the Italian Rides video: cards/slates (or real clips) + narration + bed.

Draft:  film.py --out /tmp/vdraft/draft.mp4
Final:  film.py --clips video/clips --voice-dir video/assets/say --out final.mp4
Needs:  narration wavs (segNN.wav) in --voice-dir, bed wav via --bed.
Timings mirror VIDEO_PLAN.md; film.py is authoritative for the render.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import wave
from pathlib import Path

import imageio.v2 as imageio
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
INK, PAPER, ROSSO, GREY = (22, 20, 17), (244, 241, 234), (200, 16, 46), (110, 108, 102)

# id, seconds, kind, title, sub/narration-note, seg, clip file
SCENES = [
    ("title", 8, "card", "ITALIAN RIDES", "Show it what's wrong.", None, None),
    ("speak", 17, "slot", "Speak + show", "Mic > “my mirror is loose” > sample loads", "seg02", "shot-speak.mp4"),
    ("tap", 25, "slot", "Tap + live mask", "Consent > tap > SAM mask > one re-tap", "seg03", "shot-tap.mp4"),
    ("agent", 25, "slot", "Agent run", "Trace > ranked suggest > confirm left", "seg04", "shot-agent.mp4"),
    ("ref", 25, "slot", "Reference transition", "Photo cutout > study > honest caption", "seg05", "shot-ref.mp4"),
    ("guided", 25, "slot", "One guided question", "Stem or head > sourced note", "seg06", "shot-guided.mp4"),
    ("tyre", 14, "slot", "Second lane: tyre", "Brisk owner-manual check", "seg07", "shot-tyre.mp4"),
    ("garage", 20, "slot", "Garage record", "Draft > save > timeline entry", "seg08", "shot-garage.mp4"),
    ("arch", 14, "arch", "Under the hood", "", "seg09", None),
    ("end", 10, "card", "Point, confirm, fix.", "Built on Meta AI · github.com/immeramarbeiten/italian-rides", "seg10", None),
]


def fonts() -> tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont]:
    """Bold/regular/mono-ish faces with graceful fallback."""
    def load(path: str, size: int, index: int = 0) -> ImageFont.FreeTypeFont | None:
        try:
            return ImageFont.truetype(path, size, index=index)
        except Exception:
            return None

    for base in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/Supplemental/Courier New.ttf"):
        reg, bold = load(base, 64), None
        for i in range(6):
            f = load(base, 64, i)
            if f and "bold" in f.getname()[1].lower():
                bold = load(base, 120)
                if not bold:
                    bold = f
                break
        if reg:
            return (
                load(base, 150) or reg,
                load(base, 64) or reg,
                load(base, 40) or reg,
            )
    d = ImageFont.load_default()
    return d, d, d


BIG, MID, SMALL = None, None, None


def text_center(d: ImageDraw.ImageDraw, y: int, s: str, font, fill) -> int:
    l, t, r, b = d.textbbox((0, 0), s, font=font)
    d.text(((W - (r - l)) / 2, y), s, font=font, fill=fill)
    return y + (b - t)


def card(title: str, sub: str) -> Image.Image:
    im = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(im)
    y = text_center(d, 400, title, BIG, PAPER) + 24
    d.rectangle([W / 2 - 60, y, W / 2 + 60, y + 6], fill=ROSSO)
    text_center(d, y + 56, sub, MID, GREY)
    return im


def slate(title: str, desc: str, tc: str) -> Image.Image:
    im = Image.new("RGB", (W, H), (28, 27, 24))
    d = ImageDraw.Draw(im)
    d.text((90, 80), "SCREEN RECORDING", font=MID, fill=ROSSO)
    d.text((90, 150), tc, font=SMALL, fill=GREY)
    d.text((90, 210), "DRAFT SLATE — replaced by the real take in the final render", font=SMALL, fill=GREY)
    y = text_center(d, 470, title, BIG, PAPER)
    text_center(d, y + 30, desc, MID, GREY)
    return im


def arch_card() -> Image.Image:
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    text_center(d, 150, "Under the hood", BIG, INK)
    boxes = ["SPARK\nsees", "SAM\noutlines", "YOU\nconfirm", "RECORD\nkeeps"]
    bw, bh, gap, y0 = 330, 200, 40, 400
    x0 = (W - (4 * bw + 3 * gap)) / 2
    for i, b in enumerate(boxes):
        x = x0 + i * (bw + gap)
        d.rectangle([x, y0, x + bw, y0 + bh], outline=INK, width=4)
        for j, (line, font, dy) in enumerate([(b.split("\n")[0], MID, 45), (b.split("\n")[1], SMALL, 115)]):
            l, t, r, bb = d.textbbox((0, 0), line, font=font)
            d.text((x + (bw - (r - l)) / 2, y0 + dy), line, font=font, fill=INK if j == 0 else GREY)
        if i < 3:
            ax = x + bw + 8
            d.line([ax, y0 + bh / 2, ax + 24, y0 + bh / 2], fill=ROSSO, width=6)
    for j, rule in enumerate(
        ["No torque from memory", "No part numbers from thin air", "Failures stay in the story"]
    ):
        d.text((W / 2 - 330, 700 + j * 70), f"—  {rule}", font=MID, fill=INK)
    return im


def read_wav_mono(path: Path, sr: int = 48000) -> np.ndarray:
    with wave.open(str(path), "rb") as w:
        assert w.getframerate() == sr, f"{path}: need {sr} Hz"
        raw = w.readframes(w.getnframes())
        pcm = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() == 2:
            pcm = pcm.reshape(-1, 2).mean(axis=1)
        return pcm


def main() -> None:
    global BIG, MID, SMALL
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--clips", default=None, help="dir with shot-*.mp4 for the final")
    ap.add_argument("--voice-dir", default="/tmp/vdraft/voice")
    ap.add_argument("--bed", default="/tmp/vdraft/bed.wav")
    args = ap.parse_args()
    BIG, MID, SMALL = fonts()

    total = sum(s[1] for s in SCENES)
    print(f"{len(SCENES)} scenes, {total}s @ {FPS}fps")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    # --- video ---
    silent = args.out.replace(".mp4", ".silent.mp4")
    writer = imageio.get_writer(
        silent, fps=FPS, codec="libx264", quality=8, macro_block_size=2,
    )
    XF = 12  # crossfade frames
    prev_tail: np.ndarray | None = None
    t = 0.0
    for sid, dur, kind, title, sub, seg, clip in SCENES:
        tc = f"{int(t // 60)}:{int(t % 60):02d}–{int((t + dur) // 60)}:{int((t + dur) % 60):02d}"
        frames: list[np.ndarray] = []
        clip_path = Path(args.clips) / clip if args.clips and clip else None
        if clip_path and clip_path.exists():
            reader = imageio.get_reader(str(clip_path))
            meta = reader.get_meta_data()
            need = dur * FPS
            for i, fr in enumerate(reader):
                if i >= need:
                    break
                im = Image.fromarray(fr).convert("RGB")
                im = im.resize((W, H))  # recording is 1440×900; stretch-free enough at 16:9-ish
                frames.append(np.asarray(im))
            reader.close()
            while len(frames) < need:
                frames.append(frames[-1])
            print(f"  {sid}: clip {clip} ({len(frames)}f)")
        else:
            if kind == "card":
                still = card(title, sub)
            elif kind == "arch":
                still = arch_card()
            else:
                still = slate(title, sub, tc)
            arr = np.asarray(still)
            frames = [arr] * (dur * FPS)
            print(f"  {sid}: {kind} ({tc})")
        # Crossfade head into previous tail.
        if prev_tail is not None:
            for i in range(min(XF, len(frames))):
                a = (i + 1) / (XF + 1)
                frames[i] = (prev_tail * (1 - a) + frames[i].astype(np.float32) * a).astype(np.uint8)
        for fr in frames:
            writer.append_data(fr)
        prev_tail = frames[-1].astype(np.float32)
        t += dur
    writer.close()

    # --- audio ---
    sr = 48000
    mix = np.zeros(int(total * sr), dtype=np.float32)
    spans: list[tuple[float, float]] = []
    t = 0.0
    for sid, dur, kind, title, sub, seg, clip in SCENES:
        if seg:
            p = Path(args.voice_dir) / f"{seg}.wav"
            if not p.exists():
                print(f"  WARN: missing narration {p}")
            else:
                v = read_wav_mono(p, sr)
                start = int((t + 0.6) * sr)
                if len(v) > int((dur - 1.0) * sr):
                    print(f"  WARN: {seg} overflows its scene ({len(v) / sr:.1f}s > {dur - 1.0:.1f}s)")
                    v = v[: int((dur - 1.0) * sr)]
                mix[start : start + len(v)] += v * 0.9
                spans.append((t + 0.6, t + 0.6 + len(v) / sr))
        t += dur
    bed = read_wav_mono(Path(args.bed), sr)
    reps = int(np.ceil(len(mix) / len(bed)))
    bedtrack = np.tile(bed, reps)[: len(mix)] * 0.5
    # Duck the bed under narration.
    gain = np.ones_like(mix)
    for a, b in spans:
        i0, i1 = int(a * sr), int(min(total, b) * sr)
        r = int(0.3 * sr)
        gain[max(0, i0 - r) : i0] = np.linspace(1, 0.35, max(1, i0 - max(0, i0 - r)))
        gain[i0:i1] = 0.35
        gain[i1 : i1 + r] = np.linspace(0.35, 1, r)[: max(0, min(r, len(mix) - i1))]
    out = mix + bedtrack * gain
    out *= 0.89 / max(1e-6, np.abs(out).max())
    mixpath = args.out.replace(".mp4", ".mix.wav")
    with wave.open(mixpath, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(
        [ffmpeg, "-y", "-i", silent, "-i", mixpath, "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
         "-shortest", args.out],
        check=True,
        capture_output=True,
    )
    print(f"film > {args.out}")


if __name__ == "__main__":
    main()
