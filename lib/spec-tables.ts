/**
 * Conditional spec tables: values with their conditions attached,
 * manual-style. Functional facts only — no manual text reproduced.
 */

export type SpecTable = {
  id: string;
  title: string;
  note: string;
  columns: string[];
  rows: string[][];
  source: string;
};

/** GS 150-3 owner's manual (VD2TS): premix table for running-in and after. */
export const GS_MIX_TABLE: SpecTable = {
  id: "gs-mix",
  title: "Premix — GS 150",
  note: "During and after running-in (3000 km). 2T oil or single-grade SAE 30 only; regular brand petrol, no premium, no additives.",
  columns: ["Oil (cc)", "Petrol (L)", "Mix (L)"],
  rows: [
    ["600", "8.9", "9.5"],
    ["500", "7.5", "8"],
    ["375", "5.625", "6"],
    ["250", "3.75", "4"],
    ["125", "1.875", "2"],
  ],
  source: "Vespa GS 150-3 owner's manual (VD2TS) — 1:15, 65 cc oil per litre",
};
