/**
 * POST /api/inspect — real AI component identification via the Meta Model API.
 *
 * Server-side only: the key never leaves this route. Without a key it
 * answers an honest 503 — it never fakes a result.
 */
import { NextResponse } from "next/server";
import { clientKey, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BASE_URL = "https://api.meta.ai/v1";
const MODEL = "muse-spark-1.3";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

const PROMPT = [
  "You identify Vespa scooter components in a photo.",
  "Most daily riders are modern Vespas (GTS, GT, Primavera, Sprint, LX, S, 946, Elettrica) — name the family when recognizable, otherwise describe what you see.",
  'Reply with JSON only: {"modelGuess": string|null, "components": [{"id": one of frame|legshield|handlebar|wheels|engine|seat, "label": string, "confidence": 0-1, "condition": string}], "notes": string}.',
  "List only components actually visible. Keep condition to one short phrase per component (e.g. rusty exhaust, cracked mirror).",
  "If it is not a Vespa-style scooter, set modelGuess to null and explain in notes.",
].join(" ");

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
        error: "AI not configured",
        hint: "Add META_API_KEY to .env.local (see .env.example).",
      },
      { status: 503 },
    );
  }

  if (rateLimited(clientKey(req, "inspect"))) {
    return NextResponse.json(
      { error: "Too many requests — slow down for a minute." },
      { status: 429 },
    );
  }

  let body: { image?: unknown };
  try {
    body = (await req.json()) as { image?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const image = typeof body.image === "string" ? body.image : "";
  if (!image.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Expected { image: dataURL }." },
      { status: 400 },
    );
  }
  if (Math.ceil((image.length * 3) / 4) > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image too large (max ~6MB)." },
      { status: 413 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: PROMPT },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Model API unreachable." },
      { status: 502 },
    );
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "Model call failed", status: res.status, detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data?.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    return NextResponse.json(
      { error: "Model returned invalid JSON." },
      { status: 502 },
    );
  }
  return NextResponse.json({ mock: false, model: MODEL, result: parsed });
}
