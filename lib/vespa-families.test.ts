import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FAMILIES,
  engineOptions,
  familyFromArchive,
  plausibilityWarning,
} from "./vespa-families.ts";

describe("engineOptions", () => {
  it("lists GTS engines without a 200 that never existed", () => {
    assert.deepEqual(engineOptions("GTS"), ["125", "250", "300"]);
  });
  it("lists only Electric for the Elettrica", () => {
    assert.deepEqual(engineOptions("Elettrica"), ["Electric"]);
  });
  it("lists every engine when the family is unknown", () => {
    const all = engineOptions("");
    assert.ok(all.includes("50") && all.includes("300") && all.includes("Electric"));
  });
});

describe("plausibilityWarning", () => {
  it("warns Elettrica from 1980", () => {
    assert.equal(
      plausibilityWarning("Elettrica", "1980"),
      "The Elettrica arrived in 2018 — check the year.",
    );
  });
  it("stays quiet for PX from 1990", () => {
    assert.equal(plausibilityWarning("PX", "1990"), null);
  });
  it("stays quiet for GTS from 2022", () => {
    assert.equal(plausibilityWarning("GTS", "2022"), null);
  });
  it("warns GT from 2019", () => {
    assert.equal(
      plausibilityWarning("GT", "2019"),
      "The GT was built 2003–2007 — check the year.",
    );
  });
  it("stays quiet when unsure", () => {
    assert.equal(plausibilityWarning("", "1980"), null);
    assert.equal(plausibilityWarning("GTS", ""), null);
    assert.equal(plausibilityWarning("GTS", "old"), null);
    assert.equal(plausibilityWarning("Classic / other", "1950"), null);
  });
});

describe("familyFromArchive", () => {
  it("maps archive names to family labels", () => {
    assert.equal(familyFromArchive("Vespa GTS/Granturismo"), "GTS");
    assert.equal(familyFromArchive("Vespa PX 125/150/200"), "PX");
  });
  it("returns empty for classics without a family", () => {
    assert.equal(familyFromArchive("Vespa 98"), "");
  });
});

describe("data sanity", () => {
  it("every family maps to a valid shape", () => {
    for (const f of FAMILIES) {
      assert.ok(f.label.length > 0);
      assert.ok(f.engines.length > 0);
      if (f.from !== null && f.to !== null) assert.ok(f.from <= f.to);
    }
  });
});
