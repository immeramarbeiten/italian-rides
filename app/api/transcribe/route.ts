/**
 * POST /api/transcribe — spoken concern → text via Muse Voice Transcribe.
 *
 * Body: { audio: dataURL (audio/wav), keywords?: string[] }.
 * Forwards as multipart to the Meta one-shot endpoint (see the voice
 * cookbook: request-JSON part + audio part). Server-side only: the key
 * never leaves this route. Without a key it answers an honest 503.
 */
import { NextResponse } from "next/server";
import { clientKey, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const URL = "https://api.meta.ai/v1/asr/transcribe";
const MODEL = "muse-voice-transcribe-1.0";
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.META_API_KEY),
    model: MODEL,
  });
}

export async function POST(req: Request) {
  const key = process.env.META_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: "Voice not configured",
        hint: "Add META_API_KEY to .env.local (see .env.example).",
      },
      { status: 503 },
    );
  }

  if (rateLimited(clientKey(req, "transcribe"))) {
    return NextResponse.json(
      { error: "Too many requests — slow down for a minute." },
      { status: 429 },
    );
  }

  let body: { audio?: unknown; keywords?: unknown };
  try {
    body = (await req.json()) as { audio?: unknown; keywords?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const audio = typeof body.audio === "string" ? body.audio : "";
  const m = audio.match(/^data:audio\/(wav|x-wav);base64,(.+)$/);
  if (!m) {
    return NextResponse.json(
      { error: "Expected { audio: WAV dataURL }." },
      { status: 400 },
    );
  }
  const pcm = Buffer.from(m[2], "base64");
  if (pcm.length === 0 || pcm.length > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Audio empty or over ~8MB." },
      { status: 413 },
    );
  }
  const keywords = Array.isArray(body.keywords)
    ? body.keywords.filter((k): k is string => typeof k === "string").slice(0, 8)
    : [];

  const form = new FormData();
  form.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          mode: "PUSH_TO_TALK",
          model: MODEL,
          audioEncoding: "WAV",
          ...(keywords.length > 0 ? { keywords } : {}),
        }),
      ],
      { type: "application/json" },
    ),
  );
  form.append(
    "audio",
    new Blob([new Uint8Array(pcm)], { type: "audio/wav" }),
    "concern.wav",
  );

  let res: Response;
  try {
    res = await fetch(URL, {
      method: "POST",
      signal: AbortSignal.timeout(60_000),
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
  } catch {
    return NextResponse.json({ error: "Model API unreachable." }, { status: 502 });
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "Transcription call failed", status: res.status, detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }
  const data = (await res.json()) as {
    transcript?: unknown;
    turns?: Array<{ transcript?: unknown }>;
  };
  const fromTurns = Array.isArray(data.turns)
    ? data.turns
        .map((t) => (typeof t?.transcript === "string" ? t.transcript : ""))
        .filter(Boolean)
        .join(" ")
        .trim()
    : "";
  const transcript =
    fromTurns || (typeof data.transcript === "string" ? data.transcript.trim() : "");
  return NextResponse.json({ mock: false, model: MODEL, transcript });
}
