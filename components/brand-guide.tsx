"use client";

import { useState, type CSSProperties } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoMark } from "@/components/logo";
import { VespaLineArt } from "@/components/vespa-lineart";
import { Frieze } from "@/components/frieze";
import { YearScrubber } from "@/components/year-scrubber";
import { VESPA_MODELS } from "@/lib/vespa-data";
import { cn } from "@/lib/utils";

const PALETTE = [
  { name: "Ink", hex: "#171310", role: "Text · primary buttons", dark: true },
  { name: "Rosso", hex: "#c1271b", role: "Accent · active · hover", dark: true },
  { name: "Rosso deep", hex: "#931b12", role: "Pressed · error", dark: true },
  { name: "Verde", hex: "#1e7a3c", role: "Fits · done · complete", dark: true },
  { name: "Ambra", hex: "#b26a00", role: "Adapts-with-work only", dark: true },
  { name: "Sand", hex: "#f3efe4", role: "Retired from UI in v1.2", dark: false },
  { name: "Zinc-100", hex: "#f4f4f5", role: "Secondary surfaces", dark: false, border: true },
  { name: "Zinc-300", hex: "#d4d4d8", role: "Clear borders", dark: false, border: true },
  { name: "Line", hex: "#e6e1d2", role: "Legacy hairlines", dark: false },
  { name: "Asphalt", hex: "#23201a", role: "Footer band", dark: true },
  { name: "Fog", hex: "#a39c8b", role: "Footer text (on asphalt)", dark: false },
  { name: "White", hex: "#ffffff", role: "Page canvas", dark: false, border: true },
];

const STATES: [string, string, string, string, string][] = [
  ["Primary button", "ink / white", "rosso", "rosso-deep", "2px rosso ring"],
  ["Rosso button", "rosso / white", "rosso-deep", "ink", "2px rosso ring"],
  ["Outline button", "line border", "border ink", "bg zinc-100", "2px rosso ring"],
  ["Text link", "ink underline", "rosso", "rosso-deep", "2px rosso ring"],
  ["Text input", "line border", "zinc-400", "—", "border rosso"],
  ["Checkbox", "16px accent verde", "—", "—", "2px rosso ring"],
];

function Section({
  no,
  title,
  children,
}: {
  no: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        {no}
      </p>
      <h2 className="font-grotesk mt-2 text-3xl font-black tracking-tight">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BrandGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  const [demoIdx, setDemoIdx] = useState(3);
  const [ink, setInk] = useState("#171310");
  const [rosso, setRosso] = useState("#c1271b");
  const [sand, setSand] = useState("#f3efe4");
  const [line, setLine] = useState("#e6e1d2");
  const [asphalt, setAsphalt] = useState("#23201a");
  const [radius, setRadius] = useState(0);
  const [shadow, setShadow] = useState(false);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied("failed");
    }
  }

  const demoSelected = VESPA_MODELS[demoIdx];
  function demoYear(year: number) {
    let best = 0;
    VESPA_MODELS.forEach((m, i) => {
      const y = parseInt(m.y.match(/\d{4}/)?.[0] ?? "0", 10);
      const b = parseInt(
        VESPA_MODELS[best].y.match(/\d{4}/)?.[0] ?? "0",
        10,
      );
      if (Math.abs(y - year) < Math.abs(b - year)) best = i;
    });
    setDemoIdx(best);
  }

  const tweakCss =
    `:root {\n  --color-ink: ${ink};\n  --color-rosso: ${rosso};\n  --color-sand: ${sand};\n  --color-line: ${line};\n  --color-asphalt: ${asphalt};\n  --card-radius: ${radius}px;\n}`;

  const colorRow = (
    label: string,
    value: string,
    set: (v: string) => void,
  ) => (
    <label className="flex items-center gap-3 text-sm">
      <input
        type="color"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="h-9 w-12 cursor-pointer border border-line bg-white p-1"
        aria-label={`${label} color`}
      />
      <span className="w-20 font-medium">{label}</span>
      <span className="font-mono text-xs text-zinc-500">{value}</span>
    </label>
  );

  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        APPROVED BASELINE v1.2 — OWNER: STEFAN · OCT 29
      </p>
      <h1 className="font-grotesk mt-3 max-w-3xl text-5xl leading-[0.95] font-bold tracking-tight">
        Italian Rides, on paper.
      </h1>
      <p className="font-display mt-4 max-w-2xl text-xl italic">
        “The living archive for Italian two-wheel culture.”
      </p>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600">
        Positioning draft — scope call open: Vespa-first archive (wasp stays
        master mark) vs broad platform now (wasp becomes the Vespa collection
        mark). Recommendation: Vespa-first. Sections 01–07 are the baseline;
        section 08 is the experiment area.
      </p>

      <Section no="01 — MARK" title="The wasp">
        <div className="flex flex-wrap items-center gap-8">
          <span className="flex h-24 w-24 items-center justify-center rounded-[18px] bg-rosso text-white">
            <LogoMark className="h-16 w-16" />
          </span>
          <span className="flex h-24 w-24 items-center justify-center border border-line text-ink">
            <LogoMark className="h-16 w-16" />
          </span>
          <div className="flex items-end gap-4">
            <LogoMark className="h-8 w-8 text-ink" />
            <LogoMark className="h-6 w-6 text-ink" />
            <LogoMark className="h-4 w-4 text-ink" detail={false} />
          </div>
          <div className="text-sm leading-relaxed text-zinc-600">
            <p className="font-grotesk text-2xl font-black tracking-tight text-ink">
              ITALIAN<span className="text-rosso">RIDES</span>
            </p>
            <ul className="mt-2 max-w-md list-disc space-y-1 pl-5">
              <li>Primary: white wasp on rosso tile (radius 25%).</li>
              <li>Mono: ink wasp, no tile — print, embroidery, 1-color.</li>
              <li>Below 24px: simple variant, no antennae.</li>
              <li>Clearspace = one wing-width all sides. Min 24px / 8mm.</li>
              <li>Never recolor, rotate, stretch, or set on busy photos.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section no="02 — COLOR" title="Palette (click to copy)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {PALETTE.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => copy(c.hex, c.name)}
              className={cn(
                "p-4 text-left transition-transform",
                c.border && "border border-line",
              )}
              style={{ background: c.hex }}
              aria-label={`Copy ${c.name} ${c.hex}`}
            >
              <span
                className={cn(
                  "block text-sm font-bold",
                  c.dark ? "text-white" : "text-ink",
                )}
              >
                {c.name}
              </span>
              <span
                className={cn(
                  "mt-1 block font-mono text-xs",
                  c.dark ? "text-white/80" : "text-zinc-500",
                )}
              >
                {copied === c.name ? "copied ✓" : c.hex}
              </span>
              <span
                className={cn(
                  "mt-2 block text-xs",
                  c.dark ? "text-white/70" : "text-zinc-500",
                )}
              >
                {c.role}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-sand/60 font-mono text-[11px] text-zinc-500">
                {["CONTROL", "DEFAULT", "HOVER", "PRESSED", "FOCUS"].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATES.map((r) => (
                <tr key={r[0]} className="border-b border-line last:border-0">
                  {r.map((c, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-2",
                        i === 0 && "font-medium",
                        i > 0 && "font-mono text-xs text-zinc-600",
                      )}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 max-w-3xl list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Disabled everywhere: 50% opacity. Errors: rosso-deep + icon + retry.</li>
          <li>Contrast spot-checked: ink/white ≈15 · white/rosso 5.9 · fog/asphalt 6.2.</li>
          <li>Ambra/white is 4.2 — glyphs/large only, always paired with a word.</li>
          <li>Zinc-400 is decorative/meta only, never essential info.</li>
        </ul>
      </Section>

      <Section no="03 — TYPE" title="Three voices, strict roles">
        <div className="space-y-6">
          <div className="border border-line p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              ARCHIVO BLACK — DISPLAY · ≤6 WORDS
            </p>
            <p className="font-grotesk mt-2 text-5xl font-black tracking-tight">
              Eighty years 1946→2018
            </p>
          </div>
          <div className="border border-line p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              GROTESK BOLD = ARCHIVO 700 −0.01EM — CARDS · BUTTONS · HEADS
            </p>
            <p className="font-grotesk mt-2 text-2xl font-bold">
              Card title and section head
            </p>
          </div>
          <div className="border border-line p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              ARCHIVO 400/500 — UI + ALL BODY · 15–17PX · 1.6–1.75 · ≤68CH
            </p>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.7]">
              Body copy sets in Archivo Regular with generous leading and a
              68-character measure, so guides and descriptions stay readable
              without introducing a fourth family.
            </p>
          </div>
          <div className="border border-line p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              FRAUNCES — 2 USES ONLY: MODEL BLURBS · EDITORIAL PULL LINES —
              NEVER INSIDE A HEADLINE
            </p>
            <p className="font-display mt-2 text-2xl text-zinc-700 italic">
              Every mile, kept. Headlines set in one face, one treatment.
            </p>
          </div>
          <div className="border border-line p-6">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              PLEX MONO — DATA · KICKERS · CAPTIONS · REFS
            </p>
            <p className="mt-2 font-mono text-sm">
              150CC · 95 KM/H · 4 GEARS — REF 00-000 (SPECIMEN)
            </p>
          </div>
        </div>
      </Section>

      <Section no="04 — COMPONENTS" title="The kit">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={buttonVariants({})}>Primary</span>
            <span className={buttonVariants({ variant: "racing" })}>Rosso</span>
            <span className={buttonVariants({ variant: "outline" })}>Outline</span>
            <span className={buttonVariants({ variant: "secondary" })}>Secondary</span>
            <span className={buttonVariants({ variant: "ghost" })}>Ghost</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Ink</Badge>
            <Badge variant="racing">Rosso</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <p className="text-sm">
            <span className="text-verde">●</span> fits ·{" "}
            <span className="text-ambra">◐</span> adapts ·{" "}
            <span className="text-stone-400">○</span> no fit
          </p>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card title (grotesk bold)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600">
                Product cards: sharp corners, zinc-300 hairline, flat.
                Titles never serif, never centered.
              </p>
            </CardContent>
          </Card>
          <p className="max-w-3xl text-sm text-zinc-600">
            Radius scope: everything sharp — cards, buttons, chips, inputs.
            No pill radii, no card shadows. Controls feel like tools.
          </p>
          <div className="max-w-xs border border-line bg-white p-4">
            <VespaLineArt className="text-ink" />
            <p className="mt-2 font-mono text-[11px] text-zinc-500">
              LINE ART — PLACEHOLDER ONLY, NEVER A PRODUCT FRAME
            </p>
          </div>
        </div>
      </Section>

      <Section no="05 — FRIEZE + SCRUBBER" title="The signature">
        <ul className="mb-6 max-w-3xl list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Filmstrip, not cards: frame 280px; art 4:3 first, no tilt, no shadow.</li>
          <li>Short year + model name on one baseline; names wrap, never truncate.</li>
          <li>Prev/next buttons carry the affordance; the scrollbar is hidden.</li>
          <li>Selected = RECORD OPEN in rosso. Label shows the live range.</li>
          <li>Recognizable without the logo: year + rule + image.</li>
        </ul>
        <YearScrubber
          models={VESPA_MODELS}
          selected={demoSelected}
          onYear={demoYear}
        />
        <div className="mt-6">
          <Frieze
            models={VESPA_MODELS.slice(0, 4)}
            selected={demoSelected.m}
            onSelect={(name) =>
              setDemoIdx(VESPA_MODELS.findIndex((m) => m.m === name))
            }
          />
        </div>
      </Section>

      <Section no="06 — PATTERNS" title="Product states">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-dashed border-line px-4 py-6 text-center">
            <p className="font-grotesk font-bold">Nothing matches</p>
            <p className="mt-1 text-sm text-zinc-600">
              Try a shorter term like “rim”.
            </p>
            <span className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "mt-3")}>
              Clear search
            </span>
          </div>
          <div className="border border-line p-5" aria-label="Loading example">
            <div className="h-4 w-2/3 animate-pulse bg-zinc-100 motion-reduce:animate-none" />
            <div className="mt-2 h-4 w-full animate-pulse bg-zinc-100 motion-reduce:animate-none" />
            <div className="mt-2 h-4 w-1/2 animate-pulse bg-zinc-100 motion-reduce:animate-none" />
            <p className="mt-3 font-mono text-[11px] text-zinc-500">LOADING — ZINC PULSE</p>
          </div>
          <div className="border border-line p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-rosso-deep">
              <TriangleAlert className="size-4" aria-hidden />
              Fitment data failed to load.
            </p>
            <p className="mt-2 text-sm text-zinc-600 underline underline-offset-2">
              Retry
            </p>
          </div>
        </div>
        <ul className="mt-4 max-w-3xl list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Filters are square chips with aria-pressed + a live result count.</li>
          <li>Every action is keyboard reachable with a visible rosso ring.</li>
          <li>Mobile: frieze stays swipeable, tables scroll-x, touch targets ≥44px.</li>
          <li>Empty states always offer a next action; errors always offer retry.</li>
        </ul>
      </Section>

      <Section no="07 — RULES" title="Imagery + motion + years">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
          <li>
            Frieze plates are AI-generated in one studio style (white body,
            side profile, facing left, 3:2). Model pages pair each plate
            with its licensed documentary photograph.
          </li>
          <li>
            Line art is the placeholder; frieze frames take an art map for
            Blender turntable renders or licensed photos.
          </li>
          <li>
            Lifestyle photography must be licensed or CC with attribution —
            see design/imagery.md for sources.
          </li>
          <li>
            Motion stays calm (scrubber, fades) and dies
            under prefers-reduced-motion.
          </li>
          <li>
            Headlines set in one face, one treatment — no serif or italic
            accent words. Rosso appears only with a job: selection, key
            action, status.
          </li>
          <li>
            Canvas is white; secondary surfaces zinc-100; borders zinc-300.
            Warmth comes from photography, objects, and writing.
          </li>
          <li>
            80 = brand age 1946→2026 · archive = 1946→2018 (72 yrs).
            Never attach “eighty” to the 1946–2018 set.
          </li>
        </ul>
      </Section>

      <Section no="08 — TWEAK LAB (EXPERIMENT AREA)" title="Try values — nothing ships until frozen">
        <p className="mb-6 max-w-3xl text-sm text-zinc-600">
          Play here freely. A value enters the product only after a version-log
          entry in design/tokens.md.
        </p>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            {colorRow("Ink", ink, setInk)}
            {colorRow("Rosso", rosso, setRosso)}
            {colorRow("Sand", sand, setSand)}
            {colorRow("Line", line, setLine)}
            {colorRow("Asphalt", asphalt, setAsphalt)}
            <label className="block text-sm">
              <span className="font-medium">Card radius — {radius}px</span>
              <input
                type="range"
                min={0}
                max={24}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="mt-1 w-full"
                aria-label="Card radius"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={shadow}
                onChange={(e) => setShadow(e.target.checked)}
                className="size-4"
              />
              Warm shadow on cards
            </label>
          </div>
          <div>
            <div
              className="border bg-white p-6"
              style={{ borderColor: line }}
            >
              <p
                className="font-mono text-[11px] tracking-[0.14em]"
                style={{ color: "#6e675a" }}
              >
                LIVE PREVIEW
              </p>
              <p
                className="font-grotesk mt-2 text-4xl font-bold tracking-tight"
                style={{ color: ink }}
              >
                An archive for the machines we keep.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="px-5 py-2 text-sm font-medium text-white"
                  style={{ background: ink }}
                >
                  Primary
                </span>
                <span
                  className="px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ background: rosso }}
                >
                  Rosso
                </span>
              </div>
              <div
                className="mt-4 border bg-white p-5"
                style={{
                  borderColor: line,
                  borderRadius: radius,
                  boxShadow: shadow
                    ? "0 10px 28px rgba(60,45,20,0.08)"
                    : "none",
                }}
              >
                <p
                  className="font-grotesk text-lg font-bold"
                  style={{ color: ink }}
                >
                  Card title
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Radius and shadow update live. Secondary band below:
                </p>
                <div
                  className="mt-3 border px-4 py-3 font-mono text-xs"
                  style={{ background: sand, borderColor: line, color: ink }}
                >
                  SCRUBBER BAND — {sand}
                </div>
              </div>
              <div
                className="mt-4 px-4 py-3 font-mono text-xs"
                style={{ background: asphalt, color: "#a39c8b" }}
              >
                ASPHALT FOOTER — {asphalt}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <pre
                className="flex-1 overflow-x-auto border border-line bg-white p-4 font-mono text-xs"
                style={{ borderRadius: 8 } as CSSProperties}
              >
                {tweakCss}
              </pre>
              <button
                type="button"
                onClick={() => copy(tweakCss, "css")}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {copied === "css" ? (
                  <Check aria-hidden />
                ) : (
                  <Copy aria-hidden />
                )}
                {copied === "css" ? "Copied" : "Copy CSS"}
              </button>
            </div>
            {copied === "failed" && (
              <p className="mt-2 text-sm text-rosso">
                Copy failed — select the CSS above manually.
              </p>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
