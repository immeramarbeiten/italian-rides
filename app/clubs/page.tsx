import { ClubsDirectory } from "@/components/clubs-directory";
import { DemoNext } from "@/components/demo-next";

export const metadata = { title: "Clubs — Italian Rides" };

export default function ClubsPage() {
  return (
    <div className="pt-10">
      <h1 className="font-display text-4xl tracking-tight">Clubs</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Half the machine is the people. Start with the big tents, then find
        your local ride-out as the verified directory grows.
      </p>
      <ClubsDirectory />
      <DemoNext
        href="/"
        step="Tour ✓"
        title="Back to the start"
        blurb="Eighty years of the wasp — restart the tour any time."
      />
    </div>
  );
}
