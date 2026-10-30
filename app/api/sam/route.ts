/**
 * POST /api/sam — real segmentation via SAM 3.1 (Meta Model API).
 *
 * Body: { image: dataURL, mode: "point", x, y, width, height }
 *    or { image: dataURL, mode: "phrase", phrase }.
 * Coordinates are pixels in the SENT image. Server-side only: the key never
 * leaves this route. Zero matches is a normal 200 with matches: [].
 */
import { NextResponse } from "next/server";
import { buildObjectPrompt } from "@meta-sam/parser";
import { parseSamText } from "@/lib/sam-parse";
import { clientKey, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BASE_URL = "https://api.meta.ai/v1";
const MODEL = "sam-3.1";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_MATCHES = 8;

type Body = {
  image?: unknown;
  mode?: unknown;
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
  phrase?: unknown;
};

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.META_API_KEY),
    model: MODEL,
  });
}

function isInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n);
}

export async function POST(req: Request) {
  const key = process.env.META_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: "Segmentation not configured",
        hint: "Add META_API_KEY to .env.local (see .env.example).",
      },
      { status: 503 },
    );
  }

  if (rateLimited(clientKey(req, "sam"))) {
    return NextResponse.json(
      { error: "Too many requests — slow down for a minute." },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const image = typeof body.image === "string" ? body.image : "";
  if (!image.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Expected { image: dataURL, ... }." },
      { status: 400 },
    );
  }
  if (Math.ceil((image.length * 3) / 4) > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image too large (max ~6MB)." },
      { status: 413 },
    );
  }

  let prompt: string;
  if (body.mode === "point") {
    const { x, y, width, height } = body;
    if (
      !isInt(x) ||
      !isInt(y) ||
      !isInt(width) ||
      !isInt(height) ||
      width <= 0 ||
      height <= 0 ||
      x < 0 ||
      y < 0 ||
      x >= width ||
      y >= height
    ) {
      return NextResponse.json(
        { error: "Point must sit inside width/height." },
        { status: 400 },
      );
    }
    try {
      prompt = buildObjectPrompt({
        size: { width, height },
        objects: [{ id: 0, prompts: [{ points: [{ x, y }] }] }],
      });
    } catch {
      return NextResponse.json(
        { error: "Could not build the point prompt." },
        { status: 400 },
      );
    }
  } else if (body.mode === "phrase") {
    const phrase = typeof body.phrase === "string" ? body.phrase.trim() : "";
    if (phrase.length === 0 || phrase.length > 60) {
      return NextResponse.json(
        { error: "Phrase must be 1–60 characters." },
        { status: 400 },
      );
    }
    prompt = phrase;
  } else {
    return NextResponse.json(
      { error: 'Mode must be "point" or "phrase".' },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              { type: "input_image", image_url: image },
            ],
          },
        ],
      }),
    });
  } catch {
    return NextResponse.json({ error: "Model API unreachable." }, { status: 502 });
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "Segmentation call failed", status: res.status, detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }
  const data = (await res.json()) as {
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };
  const text = data?.output?.[0]?.content?.[0]?.text ?? "";
  if (typeof text !== "string") {
    return NextResponse.json(
      { error: "Segmentation returned an unexpected shape." },
      { status: 502 },
    );
  }
  return NextResponse.json({
    mock: false,
    model: MODEL,
    matches: parseSamText(text).slice(0, MAX_MATCHES),
  });
}
