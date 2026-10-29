import Link from "next/link";

export const metadata = { title: "Club profile — Italian Rides" };

export const dynamic = "force-dynamic";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        CLUBS — PROFILE PREVIEW
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight">{name}</h1>
      <div className="mt-6 max-w-2xl border border-dashed border-line bg-white p-6">
        <p className="font-grotesk text-lg font-bold">Profile pending verification.</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Club profiles open with verified organisations only — name, location,
          affiliation, membership route, rides and official links. Unclaimed
          organisations link to official sources; this page invents no
          contacts, no meeting times, no member counts.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/clubs" className="text-rosso underline underline-offset-2">
            Back to the directory
          </Link>
          <Link href="/methodology" className="text-rosso underline underline-offset-2">
            How we verify
          </Link>
        </div>
      </div>
    </div>
  );
}
