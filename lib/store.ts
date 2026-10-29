import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEMO_CLUBS,
  DEMO_JOBS,
  DEMO_SAVED,
  DEMO_SCOOTERS,
  DEMO_SERVICE_LOG,
} from "./demo-seed";

export type Scooter = {
  id: string;
  model: string;
  year: string;
  mileage: number;
  notes: string;
};

export type ServiceEntry = {
  id: string;
  scooterId: string;
  date: string;
  mileage: number;
  entry: string;
};

export type JobStatus = "queued" | "active" | "done";

export type Job = {
  id: string;
  guideId: string;
  title: string;
  scooterId: string | null;
  status: JobStatus;
};

export type CaseStatus = "open" | "ready" | "referred" | "resolved";

/** A diagnostic case from Diagnose: symptom + evidence, cause unknown. */
export type Case = {
  id: string;
  scooterId: string | null;
  scooterLabel: string;
  symptom: string;
  observations: string[];
  possibleAreas: string[];
  sources: string[];
  notes: string;
  status: CaseStatus;
};

type GarageState = {
  /** Bookmarked models from the timeline/parts shortlist. */
  saved: string[];
  toggle: (model: string) => void;
  /** Owner's scooters, parked in the garage. */
  scooters: Scooter[];
  addScooter: (s: Omit<Scooter, "id">) => void;
  removeScooter: (id: string) => void;
  setMileage: (id: string, mileage: number) => void;
  /** Mileage / service log entries. */
  serviceLog: ServiceEntry[];
  addServiceEntry: (e: Omit<ServiceEntry, "id">) => void;
  removeServiceEntry: (id: string) => void;
  /** Workshop job cards, queueable from maintenance guides. */
  jobs: Job[];
  queueJob: (j: Omit<Job, "id" | "status">) => void;
  setJobStatus: (id: string, status: JobStatus) => void;
  removeJob: (id: string) => void;
  /** Diagnostic cases handed off from Diagnose. */
  cases: Case[];
  addCase: (c: Omit<Case, "id" | "status">) => void;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  removeCase: (id: string) => void;
  /** Replace local data with an exported backup. */
  importAll: (d: {
    scooters: Scooter[];
    serviceLog: ServiceEntry[];
    jobs: Job[];
    cases: Case[];
  }) => void;
  /** Joined club names (mock membership). */
  joinedClubs: string[];
  toggleClub: (name: string) => void;
  /** Overwrite local state with the one-click demo seed. */
  loadDemo: () => void;
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useGarage = create<GarageState>()(
  persist(
    (set) => ({
      saved: [],
      toggle: (model) =>
        set((s) => ({
          saved: s.saved.includes(model)
            ? s.saved.filter((x) => x !== model)
            : [...s.saved, model],
        })),
      scooters: [],
      addScooter: (s) =>
        set((state) => ({ scooters: [...state.scooters, { ...s, id: uid() }] })),
      removeScooter: (id) =>
        set((state) => ({
          scooters: state.scooters.filter((s) => s.id !== id),
          serviceLog: state.serviceLog.filter((e) => e.scooterId !== id),
          jobs: state.jobs.map((j) =>
            j.scooterId === id ? { ...j, scooterId: null } : j,
          ),
          cases: state.cases.map((c) =>
            c.scooterId === id ? { ...c, scooterId: null } : c,
          ),
        })),
      setMileage: (id, mileage) =>
        set((state) => ({
          scooters: state.scooters.map((s) =>
            s.id === id ? { ...s, mileage } : s,
          ),
        })),
      serviceLog: [],
      addServiceEntry: (e) =>
        set((state) => ({
          serviceLog: [{ ...e, id: uid() }, ...state.serviceLog],
        })),
      removeServiceEntry: (id) =>
        set((state) => ({
          serviceLog: state.serviceLog.filter((e) => e.id !== id),
        })),
      jobs: [],
      queueJob: (j) =>
        set((state) => ({
          jobs: [{ ...j, id: uid(), status: "queued" }, ...state.jobs],
        })),
      setJobStatus: (id, status) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, status } : j)),
        })),
      removeJob: (id) =>
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== id),
        })),
      cases: [],
      addCase: (c) =>
        set((state) => ({
          cases: [{ ...c, id: uid(), status: "open" as CaseStatus }, ...state.cases],
        })),
      setCaseStatus: (id, status) =>
        set((state) => ({
          cases: state.cases.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      removeCase: (id) =>
        set((state) => ({
          cases: state.cases.filter((c) => c.id !== id),
        })),
      importAll: (d) =>
        set(() => ({
          scooters: d.scooters ?? [],
          serviceLog: d.serviceLog ?? [],
          jobs: d.jobs ?? [],
          cases: d.cases ?? [],
        })),
      joinedClubs: [],
      toggleClub: (name) =>
        set((state) => ({
          joinedClubs: state.joinedClubs.includes(name)
            ? state.joinedClubs.filter((c) => c !== name)
            : [...state.joinedClubs, name],
        })),
      loadDemo: () =>
        set(() => ({
          saved: [...DEMO_SAVED],
          scooters: DEMO_SCOOTERS.map((s) => ({ ...s })),
          serviceLog: DEMO_SERVICE_LOG.map((e) => ({ ...e })),
          jobs: DEMO_JOBS.map((j) => ({ ...j })),
          cases: [],
          joinedClubs: [...DEMO_CLUBS],
        })),
    }),
    { name: "vespa-garage" },
  ),
);
