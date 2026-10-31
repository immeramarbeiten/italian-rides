#!/usr/bin/env python3
"""Deterministic ambient music bed. Original synthesis, royalty-free.

Warm pad loop: Am9 – Fmaj9 – Cmaj9 – G6, soft-saw stack through a one-pole
lowpass, slow attack, gentle stereo life. Usage:
    video/.venv/bin/python video/bed.py --out /tmp/vdraft/bed.wav --seconds 200
"""

from __future__ import annotations

import argparse
import wave

import numpy as np

SR = 48000

# Frequencies (Hz). Am9 – Fmaj9 – Cmaj9 – G6(add9-ish).
CHORDS = [
    [110.00, 164.81, 196.00, 246.94, 293.66],  # Am9
    [87.31, 174.61, 220.00, 261.63, 329.63],   # Fmaj9
    [130.81, 196.00, 246.94, 293.66, 392.00],  # Cmaj9
    [98.00, 146.83, 196.00, 293.66, 440.00],   # G6
]


def render(seconds: float, seed: int = 7) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    per = seconds / len(CHORDS)
    for ci, chord in enumerate(CHORDS):
        start = int(ci * per * SR)
        end = int((ci + 1) * per * SR) if ci < len(CHORDS) - 1 else n
        seg = np.zeros(end - start)
        for f in chord:
            # Soft saw: fundamental + decaying harmonics, slight random detune.
            det = 1.0 + (rng.random() - 0.5) * 0.0012
            ph = 2 * np.pi * f * det * t[start:end]
            tone = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)
            seg += tone / len(chord)
        # Slow attack + release crossfade between chords.
        env = np.ones_like(seg)
        a = min(len(seg), int(6 * SR))
        env[:a] = 0.5 - 0.5 * np.cos(np.pi * np.arange(a) / a)
        r = min(len(seg), int(6 * SR))
        env[-r:] *= 0.5 + 0.5 * np.cos(np.pi * np.arange(r) / r)
        out[start:end] += seg * env
    # One-pole lowpass for warmth, then breathing LFO + faint air.
    alpha = 0.06
    warm = np.zeros_like(out)
    acc = 0.0
    # Chunked loop to stay fast in pure Python.
    for i in range(0, n, SR):
        chunk = out[i : i + SR]
        y = np.empty_like(chunk)
        for j, x in enumerate(chunk):
            acc += alpha * (x - acc)
            y[j] = acc
        warm[i : i + SR] = y
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.07 * t + 1.0)
    air = rng.standard_normal(n) * 0.004
    mono = (warm * 0.5 + air) * lfo
    # Gentle stereo: tiny delay + detune shimmer on the right.
    d = int(0.012 * SR)
    right = np.concatenate([np.zeros(d), mono])[:n] * 0.96
    stereo = np.stack([mono, right], axis=1)
    # Fades + normalize to a bed-level peak.
    fi, fo = int(4 * SR), int(6 * SR)
    stereo[:fi] *= (0.5 - 0.5 * np.cos(np.pi * np.arange(fi) / fi))[:, None]
    stereo[-fo:] *= (0.5 + 0.5 * np.cos(np.pi * np.arange(fo) / fo))[:, None]
    stereo *= 0.22 / max(1e-6, np.abs(stereo).max())
    return stereo


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--seconds", type=float, default=200.0)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()
    stereo = render(args.seconds, args.seed)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(args.out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"bed → {args.out} ({args.seconds:.0f}s)")


if __name__ == "__main__":
    main()
