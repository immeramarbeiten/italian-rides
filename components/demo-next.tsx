import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DemoNext({
  href,
  step,
  title,
  blurb,
}: {
  href: string;
  step: string;
  title: string;
  blurb: string;
}) {
  return (
    <nav
      aria-label="Continue the demo tour"
      className="mt-12 border border-line bg-white shadow-[0_10px_28px_rgba(60,45,20,0.08)]"
    >
      <Link
        href={href}
        className="flex items-center gap-4 p-5 transition-colors hover:bg-zinc-100"
      >
        <span className="rounded-full bg-rosso px-3 py-1 font-mono text-xs whitespace-nowrap text-white">
          {step}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-grotesk block text-lg leading-tight font-bold">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-sm text-zinc-600">
            {blurb}
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-rosso" aria-hidden />
      </Link>
    </nav>
  );
}
