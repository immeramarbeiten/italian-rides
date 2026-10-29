import Link from "next/link";

export const metadata = { title: "Workshops — Italian Rides" };

const PENDING = [
  { region: "Milan area", specialty: "PX engine rebuilds, crank work" },
  { region: "London area", specialty: "Smallframes, 12V conversions" },
  { region: "Los Angeles area", specialty: "GTS service, CVT & brakes" },
];

export default function WorkshopsPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        PROFESSIONALS — PREVIEW
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        Workshops
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Independent mechanics and restoration specialists, filtered by what
        they actually know — not a generic map of repair shops.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PENDING.map((w) => (
          <div key={w.region} className="border border-dashed border-line bg-white p-5">
            <p className="font-grotesk font-bold">{w.region}</p>
            <p className="mt-1 text-sm text-zinc-600">{w.specialty}</p>
            <p className="mt-3 font-mono text-[11px] text-ambra">
              LAUNCH PARTNER — VERIFICATION PENDING
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm text-zinc-600">
        No listings go live until the workshop confirms its details. Until
        then, the{" "}
        <Link href="/workshop" className="font-medium text-rosso underline underline-offset-2">
          workshop desk demo
        </Link>{" "}
        shows the professional workflow.
      </p>
    </div>
  );
}
