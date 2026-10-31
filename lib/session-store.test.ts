import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { boundedSave } from "./session-store.ts";

type S = { id: string; big?: string };

function quotaStore(failures: number) {
  let left = failures;
  let raw = "";
  return {
    write: (v: string) => {
      if (left > 0) {
        left--;
        throw new Error("QuotaExceededError");
      }
      raw = v;
    },
    saved: () => JSON.parse(raw) as S[],
  };
}

describe("boundedSave", () => {
  it("saves without eviction when quota allows", () => {
    const store = quotaStore(0);
    const r = boundedSave([{ id: "a" }], { id: "b" }, 12, store.write);
    assert.deepEqual(r, { ok: true, evicted: 0 });
    assert.deepEqual(
      store.saved().map((s) => s.id),
      ["b", "a"],
    );
  });
  it("evicts oldest first until the write fits, and reports it", () => {
    const store = quotaStore(2);
    const r = boundedSave(
      [{ id: "a" }, { id: "b" }, { id: "c" }],
      { id: "new" },
      12,
      store.write,
    );
    assert.deepEqual(r, { ok: true, evicted: 2 });
    assert.deepEqual(
      store.saved().map((s) => s.id),
      ["new", "a"],
    );
  });
  it("fails loudly when even one session does not fit", () => {
    const store = quotaStore(99);
    const r = boundedSave([{ id: "a" }], { id: "new" }, 12, store.write);
    assert.deepEqual(r, { ok: false, evicted: 1 });
  });
  it("dedupes by id and enforces the cap", () => {
    const store = quotaStore(0);
    const cur = Array.from({ length: 12 }, (_, i) => ({ id: `s${i}` }));
    const r = boundedSave(cur, { id: "s5" }, 12, store.write);
    assert.deepEqual(r, { ok: true, evicted: 0 });
    const ids = store.saved().map((s) => s.id);
    assert.equal(ids.length, 12);
    assert.equal(ids[0], "s5");
  });
});
