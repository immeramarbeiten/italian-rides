import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { outlinePhrase, padBox, pickFocus } from "./agent-decide.ts";

describe("outlinePhrase", () => {
  it("maps assemblies to short SAM nouns", () => {
    assert.equal(outlinePhrase("wheels", "x"), "wheel");
    assert.equal(outlinePhrase("legshield", "x"), "front legshield");
  });
  it("targets the mirror rather than grips when the concern names a mirror", () => {
    assert.equal(outlinePhrase("handlebar", "Handlebar", "the mirror glass is cracked"), "mirror");
    assert.equal(outlinePhrase("wheels", "Wheels", "tyre tread looks worn"), "front tyre");
    assert.equal(outlinePhrase("handlebar", "Handlebar", "brake lever feels wrong"), "handlebar");
  });
  it("falls back to the given label for unknown ids", () => {
    assert.equal(outlinePhrase("headlight", "front lamp"), "front lamp");
  });
});

describe("pickFocus", () => {
  const suggest = (words: string) =>
    words.includes("glass") ? "head" : null;
  it("picks the top component and annotates word-matches", () => {
    const pick = pickFocus(
      [{ id: "handlebar", label: "Handlebar" }],
      "the glass is cracked",
      suggest,
    );
    assert.equal(pick.id, "handlebar");
    assert.equal(pick.suggestedAnswer, "head");
  });
  it("returns null focus for empty input, never inventing", () => {
    assert.deepEqual(pickFocus([], "my mirror is loose", suggest), {
      id: null,
      label: "",
      suggestedAnswer: null,
    });
  });
  it("prioritizes an unambiguous concern over a higher-ranked unrelated component", () => {
    const pick = pickFocus(
      [{ id: "legshield", label: "Legshield" }, { id: "handlebar", label: "Handlebar" }],
      "the mirror glass is cracked",
      (words, id) => id === "handlebar" && words.includes("glass") ? "head" : null,
    );
    assert.equal(pick.id, "handlebar");
    assert.equal(pick.suggestedAnswer, "head");
  });
  it("falls back to the top candidate when the concern matches more than one", () => {
    const pick = pickFocus([{id:"wheels",label:"Wheels"},{id:"handlebar",label:"Handlebar"}], "cracked", () => "damage");
    assert.equal(pick.id, "wheels");
  });
  it("leaves ambiguous words unannotated", () => {
    const pick = pickFocus(
      [{ id: "handlebar", label: "Handlebar" }],
      "my mirror is loose",
      suggest,
    );
    assert.equal(pick.id, "handlebar");
    assert.equal(pick.suggestedAnswer, null);
  });
});

describe("padBox", () => {
  it("pads symmetrically inside the frame", () => {
    assert.deepEqual(padBox({ x1: 100, y1: 100, x2: 200, y2: 200 }, 1000, 1000), {
      x1: 85,
      y1: 85,
      x2: 215,
      y2: 215,
    });
  });
  it("clamps to frame edges", () => {
    assert.deepEqual(padBox({ x1: 0, y1: 0, x2: 50, y2: 50 }, 1000, 1000), {
      x1: 0,
      y1: 0,
      x2: 58,
      y2: 58,
    });
  });
});
