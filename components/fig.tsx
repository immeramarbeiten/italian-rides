import { cn } from "@/lib/utils";

/**
 * Manual-style figure system: every technical image gets a Fig. number,
 * every annotated point gets a callout number. Numbers are curated per
 * page (explicit `no`), never auto-generated — curation keeps them honest.
 */

export function FigCaption({
  no,
  children,
  className,
}: {
  no: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.08em] text-zinc-500 uppercase",
        className,
      )}
    >
      FIG. {no} — {children}
    </p>
  );
}

export function Callout({
  n,
  active = false,
  label,
}: {
  n: number;
  active?: boolean;
  label: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center text-xs font-bold shadow",
        active
          ? "bg-rosso text-white"
          : "border border-line bg-white text-ink",
      )}
    >
      {n}
    </span>
  );
}
