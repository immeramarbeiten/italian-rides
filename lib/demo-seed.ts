import type { Job, Scooter, ServiceEntry } from "./store";

/** One-click mock data for the 60–90 s demo video. Local only. */
export const DEMO_SCOOTERS: Scooter[] = [
  {
    id: "demo-px150",
    model: "Vespa PX 125/150/200",
    year: "1979",
    mileage: 24500,
    notes: "Original paint, Pinasco 177 kit",
  },
  {
    id: "demo-gts300",
    model: "Vespa GTS/Granturismo",
    year: "2016",
    mileage: 8200,
    notes: "Daily rider",
  },
];

export const DEMO_SERVICE_LOG: ServiceEntry[] = [
  {
    id: "demo-svc-1",
    scooterId: "demo-px150",
    date: "2026-04-12",
    mileage: 24310,
    entry: "Top-end refresh: rings, gaskets, plug. Torqued head to spec.",
  },
  {
    id: "demo-svc-2",
    scooterId: "demo-px150",
    date: "2026-09-02",
    mileage: 24480,
    entry: "New brake shoes front + rear, cables adjusted.",
  },
];

export const DEMO_JOBS: Job[] = [
  {
    id: "demo-job-1",
    guideId: "engine",
    title: "Engine — Top-end refresh checklist",
    scooterId: "demo-px150",
    status: "active",
  },
  {
    id: "demo-job-2",
    guideId: "wheels",
    title: "Wheels — Remove, inspect and refit a wheel",
    scooterId: "demo-gts300",
    status: "queued",
  },
];

export const DEMO_SAVED = ["Vespa 98", "Vespa 150 GS Gran Sport"];

export const DEMO_CLUBS = ["Vespa World Club"];
