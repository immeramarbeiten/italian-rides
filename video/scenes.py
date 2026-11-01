#!/usr/bin/env python3
"""App-scene animation for the film: real artifacts, cinematically presented.

Every visual here comes from committed data (fixtures, decoded SAM masks,
agent outputs, UI copy). Nothing performs interaction: no cursors, no fake
clicks or typing — states fade and zoom; that is all.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
INK, PAPER, ROSSO, GREY = (22, 20, 17), (244, 241, 234), (200, 16, 46), (110, 108, 102)

ROOT = Path(__file__).resolve().parent.parent


def smooth(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def fonts():
    def load(path: str, size: int, index: int = 0):
        try:
            return ImageFont.truetype(path, size, index=index)
        except Exception:
            return None

    base = "/System/Library/Fonts/Helvetica.ttc"
    big = load(base, 120) or ImageFont.load_default()
    mid = load(base, 54) or ImageFont.load_default()
    small = load(base, 38) or ImageFont.load_default()
    micro = load(base, 30) or ImageFont.load_default()
    return big, mid, small, micro


BIG, MID, SMALL, MICRO = fonts()


def load_data() -> dict:
    with open(ROOT / "video" / "data" / "film-masks.json") as f:
        return json.load(f)


def wrap(d: ImageDraw.ImageDraw, s: str, font, maxw: int) -> list[str]:
    words, lines, cur = s.split(), [], ""
    for w in words:
        t = f"{cur} {w}".strip()
        if d.textlength(t, font=font) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def parse_mask(match: dict) -> tuple[list[list[tuple[float, float]]], dict]:
    """Subpath polygons in photo pixels + box."""
    d, box, r = match["svgPath"], match["box"], match["raster"]
    sx = (box["x2"] - box["x1"]) / r["w"]
    sy = (box["y2"] - box["y1"]) / r["h"]
    subs = []
    for sub in re.split(r"(?=[Mm])", d):
        nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", sub)]
        pts = [
            (box["x1"] + nums[i] * sx, box["y1"] + nums[i + 1] * sy)
            for i in range(0, len(nums) - 1, 2)
        ]
        if len(pts) > 2:
            subs.append(pts)
    return subs, box


class Placed:
    """Cover-fit photo with optional slow zoom; maps photo coords to frame."""

    def __init__(self, path: Path):
        self.im = Image.open(path).convert("RGB")
        self.pw, self.ph = self.im.size
        self.s = max(W / self.pw, H / self.ph)

    def frame(self, z: float) -> Image.Image:
        sc = self.s * z
        rw, rh = int(self.pw * sc), int(self.ph * sc)
        ox, oy = (rw - W) // 2, (rh - H) // 2
        return self.im.resize((rw, rh), Image.BILINEAR).crop((ox, oy, ox + W, oy + H))

    def map(self, x: float, y: float, z: float) -> tuple[float, float]:
        sc = self.s * z
        return (x * sc - (self.pw * sc - W) / 2, y * sc - (self.ph * sc - H) / 2)


def dashed_box(d: ImageDraw.ImageDraw, box, color, width=5, dash=26, gap=16):
    x1, y1, x2, y2 = box
    for x in np.arange(x1, x2, dash + gap):
        d.line([x, y1, min(x + dash, x2), y1], fill=color, width=width)
        d.line([x, y2, min(x + dash, x2), y2], fill=color, width=width)
    for y in np.arange(y1, y2, dash + gap):
        d.line([x1, y, x1, min(y + dash, y2)], fill=color, width=width)
        d.line([x2, y, x2, min(y + dash, y2)], fill=color, width=width)


def mask_overlay(pl: Placed, subs, box, z: float, alpha: float) -> Image.Image:
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    pts = [[pl.map(x, y, z) for x, y in poly] for poly in subs]
    # Union first: overlapping subpaths must not stack alpha into blotches.
    union = Image.new("L", (W, H), 0)
    du = ImageDraw.Draw(union)
    for p in pts:
        du.polygon(p, fill=255)
    wash = Image.new("RGBA", (W, H), ROSSO + (0,))
    wash.putalpha(union.point(lambda v: int(70 * alpha) if v > 0 else 0))
    ov.alpha_composite(wash)
    d = ImageDraw.Draw(ov)
    if alpha > 0.5:
        b = [pl.map(box["x1"], box["y1"], z), pl.map(box["x2"], box["y2"], z)]
        dashed_box(d, [b[0][0], b[0][1], b[1][0], b[1][1]], (255, 255, 255, int(230 * alpha)))
    return ov


def tag(text: str, w: int | None = None) -> Image.Image:
    """Small honest-provenance tag, top-left; auto-width so text never clips."""
    probe = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    w = w or int(probe.textlength(text, font=MICRO) + 48)
    im = Image.new("RGBA", (w, 64), (INK[0], INK[1], INK[2], 210))
    d = ImageDraw.Draw(im)
    d.text((24, 14), text, font=MICRO, fill=PAPER)
    return im


def bar_bottom(lines: list[tuple[str, object]], accent: str = "") -> Image.Image:
    """Bottom UI bar: label lines + optional rosso side tick."""
    h = 90 + len(lines) * 62
    im = Image.new("RGBA", (W - 320, h), (255, 255, 255, 245))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W - 320 - 1, h - 1], outline=INK, width=3)
    if accent:
        d.rectangle([0, 0, 10, h], fill=ROSSO)
    y = 34
    for text, font in lines:
        for ln in wrap(d, text, font, W - 460):
            d.text((48, y), ln, font=font, fill=INK)
            y += 58
    return im


def compose(base: Image.Image, layers: list[tuple[Image.Image, tuple[int, int], float]]) -> np.ndarray:
    im = base.convert("RGBA")
    for layer, (x, y), a in layers:
        if a <= 0:
            continue
        la = layer.copy()
        r, g, b, al = la.split()
        al = al.point(lambda v: int(v * a))
        la.putalpha(al)
        im.alpha_composite(la, (x, y))
    return np.asarray(im.convert("RGB"))


def scene_speak(dur: int) -> list:
    data = load_data()
    pl = Placed(ROOT / "public/fixtures/healthy-mirror.png")
    tg = tag("AI-GENERATED FIXTURE")
    bar = bar_bottom([("SAID:  “my mirror is loose”", MID)], accent="x")
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        z = 1.0 + 0.04 * (t / dur)
        base = pl.frame(z)
        a = smooth((t - 2.0) / 1.2)
        out.append(compose(base, [(tg, (60, 60), 1.0), (bar, (160, H - bar.height - 90), a)]))
    return out


def scene_tap(dur: int, tap=(495, 480)) -> list:
    data = load_data()
    pl = Placed(ROOT / "public/fixtures/healthy-mirror.png")
    subs, box = parse_mask(data["tapMirror"])
    tg = tag("SAM 3.1 · LIVE MASK")
    tg_pos = (60, H - 140)  # bottom-left: the mask box owns the top
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        z = 1.0 + 0.05 * (t / dur)
        base = pl.frame(z)
        layers = [(tg, tg_pos, 1.0)]
        # Pulse ring at the tap point (positional cue, not a performed click).
        pt = 2.0
        if pt <= t <= pt + 2.0:
            k = (t - pt) / 2.0
            ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            d = ImageDraw.Draw(ring)
            cx, cy = pl.map(*tap, z)
            rr = 30 + 130 * k
            d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(255, 255, 255, int(220 * (1 - k))), width=6)
            d.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(255, 255, 255, int(220 * (1 - k))))
            layers.append((ring, (0, 0), 1.0))
        layers.append((mask_overlay(pl, subs, box, z, smooth((t - 4.0) / 1.5)), (0, 0), 1.0))
        out.append(compose(base, layers))
    return out


AGENT_STEPS = [
    ("Look", "Sees 3 candidates."),
    ("Focus", "Handlebar."),
    ("Outline", "Mask drawn."),
    ("Zoom", "Round chrome mirror: clean reflective surface."),
    ("Conclude", "Suggestion ready — you confirm."),
]


def scene_agent(dur: int) -> list:
    base = Image.new("RGB", (W, H), INK)
    d0 = ImageDraw.Draw(base)
    d0.text((140, 110), "AGENTIC INSPECT", font=MICRO, fill=GREY)
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        im = base.copy()
        d = ImageDraw.Draw(im, "RGBA")
        y = 230
        for si, (name, detail) in enumerate(AGENT_STEPS):
            a = smooth((t - (1.0 + si * 3.6)) / 0.8)
            if a > 0:
                al = int(255 * a)
                d.text((140, y), f"{si + 1}.", font=MID, fill=(ROSSO[0], ROSSO[1], ROSSO[2], al))
                d.text((230, y), name, font=MID, fill=(PAPER[0], PAPER[1], PAPER[2], al))
                d.text((230, y + 68), detail, font=SMALL, fill=(GREY[0], GREY[1], GREY[2], al))
            y += 150
        a = smooth((t - 20.5) / 0.8)
        if a > 0:
            d.rectangle([140, H - 170, W - 140, H - 80], outline=(255, 255, 255, int(120 * a)), width=2)
            d.text((180, H - 150), "Focus: Handlebar  (high, outlined)", font=MID,
                   fill=(255, 255, 255, int(255 * a)))
        out.append(np.asarray(im.convert("RGB")))
    return out


def scene_ref(dur: int) -> list:
    photo = Placed(ROOT / "public/fixtures/healthy-mirror.png")
    study = Placed(ROOT / "public/gts125-visual-prototype/gts125-reference-study.png")
    cap = bar_bottom([("Reference visualization, not a 3D reconstruction.", SMALL)], accent="x")
    tg = tag("GENERATED STUDY")
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        k = smooth((t - 8.0) / 4.0)  # crossfade photo -> study
        a = Image.blend(photo.frame(1.0 + 0.05 * min(1, t / 8)), study.frame(1.06 - 0.06 * k), k)
        layers = []
        if t > 8.0:
            layers.append((tg, (60, 60), smooth((t - 8.5) / 1.0)))
        layers.append((cap, (160, H - cap.height - 90), smooth((t - 13.0) / 1.2)))
        out.append(compose(a, layers))
    return out


GUIDED_Q = "Where is the looseness — or what do you see?"
GUIDED_A = ["Stem / mount moves", "Head / glass moves or is damaged", "Not sure"]
GUIDED_NOTE = "Check the joint where the stalk meets the bar first."
GUIDED_SUB = "Mirror head + glass — glass is bonded in on many modern Vespas; a head that will not hold position means replacement."
GUIDED_SRC = "SOURCE: GTS 125 Owner's Guide p.54; Workshop op. 004066. Applicability unverified."


def scene_guided(dur: int) -> list:
    base = Image.new("RGB", (W, H), PAPER)
    d0 = ImageDraw.Draw(base)
    d0.text((140, 100), "CLOSER LOOK", font=MICRO, fill=GREY)
    for ln in wrap(d0, GUIDED_Q, BIG, W - 280):
        pass
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        im = base.copy()
        d = ImageDraw.Draw(im, "RGBA")
        y = 190
        for ln in wrap(d, GUIDED_Q, MID, W - 280):
            d.text((140, y), ln, font=MID, fill=INK)
            y += 66
        # Answer chips.
        cx = 140
        for ai, ans in enumerate(GUIDED_A):
            bw = int(d.textlength(ans, font=SMALL) + 70)
            chosen = ai == 0 and t > 8.0
            a = smooth((t - 2.0 - ai * 1.2) / 0.8)
            if a > 0:
                al = int(255 * a)
                fill = INK if chosen else (255, 255, 255, 0)
                fg = PAPER if chosen else INK
                d.rectangle([cx, y, cx + bw, y + 84], fill=fill + ((al,) if chosen else (0,)) if chosen else None,
                            outline=(INK[0], INK[1], INK[2], al), width=3)
                d.text((cx + 35, y + 22), ans, font=SMALL, fill=(fg[0], fg[1], fg[2], al))
            cx += bw + 28
        y += 130
        a = smooth((t - 9.0) / 1.0)
        if a > 0:
            al = int(255 * a)
            for ln in wrap(d, GUIDED_NOTE, SMALL, W - 280):
                d.text((140, y), ln, font=SMALL, fill=(80, 78, 72, al))
                y += 52
        a = smooth((t - 15.0) / 1.0)
        if a > 0:
            al = int(255 * a)
            d.rectangle([140, y + 10, W - 140, y + 250], fill=(255, 255, 255, int(255 * a)),
                        outline=(INK[0], INK[1], INK[2], al), width=3)
            yy = y + 40
            for ln in wrap(d, GUIDED_SUB, SMALL, W - 400):
                d.text((190, yy), ln, font=SMALL, fill=(INK[0], INK[1], INK[2], al))
                yy += 52
            d.text((190, yy + 8), GUIDED_SRC, font=MICRO, fill=(GREY[0], GREY[1], GREY[2], al))
        out.append(np.asarray(im.convert("RGB")))
    return out


def scene_tyre(dur: int) -> list:
    data = load_data()
    pl = Placed(ROOT / "public/fixtures/healthy-tyre.png")
    subs, box = parse_mask(data["tapTyre"])
    tg = tag("FRONT TYRE · OWNER-MANUAL CHECK")
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        z = 1.0 + 0.05 * (t / dur)
        base = pl.frame(z)
        layers = [(tg, (60, 60), 1.0)]
        layers.append((mask_overlay(pl, subs, box, z, smooth((t - 2.5) / 1.5)), (0, 0), 1.0))
        out.append(compose(base, layers))
    return out


GARAGE_LINES = [
    "[Inspected] Handlebar — Stem + mounting area",
    "user said: “my mirror is loose”",
    "(inspection #a3f9, recorded by user)",
]


def scene_garage(dur: int) -> list:
    base = Image.new("RGB", (W, H), PAPER)
    out = []
    for i in range(dur * FPS):
        t = i / FPS
        im = base.copy()
        d = ImageDraw.Draw(im, "RGBA")
        d.text((140, 100), "GARAGE · YOUR SCOOTER", font=MICRO, fill=GREY)
        d.rectangle([140, 170, W - 140, 640], fill=(255, 255, 255, 255), outline=INK, width=3)
        y = 230
        for li, ln in enumerate(GARAGE_LINES):
            a = smooth((t - (2.0 + li * 3.0)) / 0.8)
            if a > 0:
                al = int(255 * a)
                d.text((200, y), ln, font=MID if li == 0 else SMALL,
                       fill=(INK[0], INK[1], INK[2], al))
            y += 110 if li == 0 else 80
        a = smooth((t - 13.0) / 1.0)
        if a > 0:
            d.text((140, 720), "Drafted, never automatic. You say what you actually did.",
                   font=SMALL, fill=(80, 78, 72, int(255 * a)))
        out.append(np.asarray(im.convert("RGB")))
    return out


BUILDERS = {
    "speak": scene_speak,
    "tap": scene_tap,
    "agent": scene_agent,
    "ref": scene_ref,
    "guided": scene_guided,
    "tyre": scene_tyre,
    "garage": scene_garage,
}


def build(scene_id: str, dur: int) -> list:
    return BUILDERS[scene_id](dur)
