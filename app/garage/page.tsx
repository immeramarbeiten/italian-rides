import { GarageManager } from "@/components/garage-manager";

export const metadata = { title: "My Garage — Italian Rides" };

export default function GaragePage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        MY GARAGE
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        Your garage
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Your actual scooters, their histories, and the work you put into them.
        Park one below, then open its passport for the full story.
      </p>
      <p className="mt-4 border border-dashed border-line bg-white px-4 py-3 font-mono text-[11px] text-zinc-500">
        YOUR GARAGE LIVES IN THIS BROWSER ONLY — NO ACCOUNT YET. EXPORT A COPY BEFORE SWITCHING DEVICES.
      </p>
      <GarageManager />
    </div>
  );
}
