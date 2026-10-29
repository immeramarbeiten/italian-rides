import Link from "next/link";
import { Bike } from "lucide-react";
import { LogoMark } from "@/components/logo";

const NAV = [
  { href: "/timeline", label: "Timeline" },
  { href: "/inspect", label: "Inspect" },
  { href: "/parts", label: "Parts" },
  { href: "/diagnose", label: "Diagnose" },
  { href: "/garage", label: "Garage" },
  { href: "/workshop", label: "Workshop" },
  { href: "/clubs", label: "Clubs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-rosso text-white">
            <LogoMark className="h-6 w-6" />
          </span>
          <span className="font-grotesk text-lg font-black tracking-tight">
            ITALIAN<span className="text-rosso">RIDES</span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto font-mono text-[11px] tracking-[0.12em]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-medium text-zinc-600 uppercase hover:text-rosso"
            >
              {item.href === "/garage" && <Bike className="size-3.5" />}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
