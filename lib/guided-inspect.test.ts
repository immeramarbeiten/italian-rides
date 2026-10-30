import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  GUIDED_QUESTIONS,
  SUBCOMPONENTS,
  parentOf,
  subLabel,
  suggestAnswer,
} from "./guided-inspect.ts";

describe("guided-inspect graph integrity", () => {
  it("covers exactly the two prepared assemblies", () => {
    assert.deepEqual(Object.keys(GUIDED_QUESTIONS).sort(), [
      "handlebar",
      "wheels",
    ]);
  });
  it("every answer points at a real subcomponent of the same parent", () => {
    for (const [part, q] of Object.entries(GUIDED_QUESTIONS)) {
      assert.ok(q.question.length > 10);
      for (const a of q.answers) {
        assert.ok(a.label.length > 0 && a.note.length > 0);
        if (a.sub !== null) {
          assert.ok(a.sub in SUBCOMPONENTS);
          assert.equal(SUBCOMPONENTS[a.sub].parent, part);
        }
      }
    }
  });
  it("every subcomponent has a label, blurb and source", () => {
    for (const s of Object.values(SUBCOMPONENTS)) {
      assert.ok(s.label.length > 0);
      assert.ok(s.blurb.length > 20);
      assert.ok(s.source.length > 10);
    }
  });
  it("parentOf and subLabel resolve", () => {
    assert.equal(parentOf("mirror-head"), "handlebar");
    assert.equal(parentOf("tyre-tread"), "wheels");
    assert.match(subLabel("mirror-stem"), /stem/i);
  });
});

describe("suggestAnswer", () => {
  it("maps unambiguous mirror words", () => {
    assert.equal(suggestAnswer("the glass is cracked", "handlebar"), "head");
    assert.equal(suggestAnswer("stalk wobbles at the mount", "handlebar"), "stem");
  });
  it("refuses to decide the ambiguous loose-mirror case", () => {
    assert.equal(suggestAnswer("my mirror is loose", "handlebar"), null);
    assert.equal(suggestAnswer("mirror vibrates", "handlebar"), null);
    assert.equal(suggestAnswer("", "handlebar"), null);
  });
  it("maps unambiguous tyre words", () => {
    assert.equal(suggestAnswer("tread looks worn", "wheels"), "tread");
    assert.equal(suggestAnswer("there is a nail in it", "wheels"), "damage");
    assert.equal(suggestAnswer("pressure seems low", "wheels"), "pressure");
  });
  it("asks when the words match nothing", () => {
    assert.equal(suggestAnswer("tyre looks funny", "wheels"), null);
    assert.equal(suggestAnswer("my mirror is loose", "wheels"), null);
    assert.equal(suggestAnswer("hello", "frame"), null);
  });
});
