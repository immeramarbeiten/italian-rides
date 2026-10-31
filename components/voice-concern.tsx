"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

/** Scooter terms that bias recognition toward our vocabulary. */
const KEYWORDS = ["mirror", "tyre", "tire", "vespa", "gts", "handlebar", "brake"];

const MAX_SECONDS = 30;

/** Decode any recorded blob and re-encode as 16 kHz mono 16-bit WAV dataURL. */
async function toWav16k(blob: Blob): Promise<string | null> {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    const raw = await new AC().decodeAudioData(await blob.arrayBuffer());
    if (!raw.duration || raw.duration > 120) return null;
    const rate = 16000;
    const off = new OfflineAudioContext(
      1,
      Math.max(1, Math.ceil(raw.duration * rate)),
      rate,
    );
    const src = off.createBufferSource();
    src.buffer = raw;
    src.connect(off.destination);
    src.start();
    const out = await off.startRendering();
    const ch = out.getChannelData(0);
    const n = ch.length;
    const buf = new ArrayBuffer(44 + n * 2);
    const v = new DataView(buf);
    const wstr = (o: number, s: string) => {
      for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
    };
    wstr(0, "RIFF");
    v.setUint32(4, 36 + n * 2, true);
    wstr(8, "WAVE");
    wstr(12, "fmt ");
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    wstr(36, "data");
    v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) {
      const s = Math.max(-1, Math.min(1, ch[i]));
      v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return `data:audio/wav;base64,${btoa(bin)}`;
  } catch {
    return null;
  }
}

/**
 * Push-to-talk concern input. Records, converts to WAV in-browser, and
 * transcribes via live Muse Voice Transcribe. Silent when the browser
 * cannot record — the text input stays the way in.
 */
export function VoiceConcern({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  // Initialize false so the first client render matches SSR; enable after
  // mount. Reading window APIs in the initializer breaks hydration.
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("MediaRecorder" in window && "AudioContext" in window);
  }, []);
  const [state, setState] = useState<"idle" | "recording" | "working" | "error">("idle");
  const [message, setMessage] = useState("");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  if (!supported) return null;

  function stopTracks() {
    const rec = recRef.current as (MediaRecorder & { stream?: MediaStream }) | null;
    rec?.stream?.getTracks().forEach((t) => t.stop());
  }

  async function toggle() {
    if (state === "recording") {
      recRef.current?.stop();
      return;
    }
    if (state === "working") return;
    setMessage("");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState("error");
      setMessage("Microphone unavailable or blocked — type instead.");
      return;
    }
    try {
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => void finish(new Blob(chunksRef.current));
      recRef.current = Object.assign(rec, { stream });
      rec.start();
      setState("recording");
      timerRef.current = window.setTimeout(() => {
        if (recRef.current?.state === "recording") recRef.current.stop();
      }, MAX_SECONDS * 1000);
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      setState("error");
      setMessage("Recording failed to start — type instead.");
    }
  }

  async function finish(blob: Blob) {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    stopTracks();
    setState("working");
    const wav = await toWav16k(blob);
    if (!wav) {
      setState("error");
      setMessage("Could not read that recording — try again or type.");
      return;
    }
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: wav, keywords: KEYWORDS }),
      });
      if (res.status === 503) {
        setState("error");
        setMessage("Voice unavailable (API key missing) — type instead.");
        return;
      }
      if (!res.ok) throw new Error("bad response");
      const data = (await res.json()) as { transcript?: string };
      const text = (data.transcript ?? "").trim();
      if (!text) {
        setState("error");
        setMessage("Heard nothing usable — try again or type.");
        return;
      }
      setState("idle");
      onTranscript(text);
    } catch {
      setState("error");
      setMessage("Transcription failed — try again or type.");
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={state === "working"}
        aria-pressed={state === "recording"}
        title={state === "recording" ? "Stop recording" : "Speak your concern"}
        className={cn(
          "inline-flex size-9 items-center justify-center border transition-colors",
          state === "recording"
            ? "animate-pulse border-rosso bg-rosso text-white"
            : "border-line bg-white hover:border-ink",
          state === "working" && "cursor-wait opacity-60",
        )}
      >
        <Mic className="size-4" aria-hidden />
      </button>
      {state === "recording" && (
        <span className="font-mono text-xs text-rosso">LISTENING… TAP TO STOP</span>
      )}
      {state === "working" && (
        <span className="font-mono text-xs text-zinc-500">TRANSCRIBING…</span>
      )}
      {state === "error" && message && (
        <span className="font-mono text-xs text-rosso-deep">{message}</span>
      )}
    </span>
  );
}
