import Link from "next/link";
import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoNext } from "@/components/demo-next";
import { WorkshopDesk } from "@/components/workshop-desk";

export const metadata = { title: "Workshop — Italian Rides" };

const CHECKS = [
  "Two-stroke premix/oil-injection level before every ride (classics).",
  "Tyre pressure: small wheels punish neglect — check weekly.",
  "Brake shoes and cables: adjust for a firm lever, no drag.",
  "Points gap and timing on pre-electronic models, yearly.",
  "Belt and rollers on automatics (ET/GTS) per service book.",
  "Battery on tender over winter; Elettrica per owner's manual.",
];

export default function WorkshopPage() {
  return (
    <div className="pt-10">
      <h1 className="font-display text-4xl tracking-tight">Workshop</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        The work desk: queue maintenance guides as job cards and move them
        from the queue to the lift to done.
      </p>

      <h2 className="font-display mt-8 text-xl">Work desk</h2>
      <WorkshopDesk />

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="size-5 text-lagoon" /> General owner prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-zinc-600">
            Not model-specific — your checklist depends on the scooter.
            Model-specific checks arrive with variant scoping; until then,
            treat these as reminders, not instructions.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm">
            {CHECKS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="mt-8 border border-line bg-white px-4 py-3 text-sm text-zinc-600">
        Comparing models? The full data lives in the{" "}
        <Link href="/archive" className="font-medium text-rosso underline underline-offset-2">
          archive
        </Link>
        .
      </p>

      <DemoNext
        href="/clubs"
        step="6 / 6"
        title="Find your people"
        blurb="Clubs, ride-outs and the event calendar."
      />
    </div>
  );
}
