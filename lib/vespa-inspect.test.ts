import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rankPartsByHints } from "./vespa-inspect.ts";

describe("rankPartsByHints", () => {
  it("returns catalog order without hints", () => {
    assert.deepEqual(rankPartsByHints(null), [
      "frame",
      "legshield",
      "handlebar",
      "wheels",
      "engine",
      "seat",
    ]);
  });
  it("floats hinted parts first, in confidence order", () => {
    assert.deepEqual(
      rankPartsByHints([{ id: "wheels" }, { id: "handlebar" }]),
      ["wheels", "handlebar", "frame", "legshield", "engine", "seat"],
    );
  });
  it("keeps catalog order among unhinted parts", () => {
    const ranked = rankPartsByHints([{ id: "seat" }]);
    assert.equal(ranked[0], "seat");
    assert.deepEqual(ranked.slice(1), [
      "frame",
      "legshield",
      "handlebar",
      "wheels",
      "engine",
    ]);
  });
  it("ignores ids outside the catalog", () => {
    assert.deepEqual(rankPartsByHints([{ id: "headlight" }, { id: "frame" }]), [
      "frame",
      "legshield",
      "handlebar",
      "wheels",
      "engine",
      "seat",
    ]);
  });
});
