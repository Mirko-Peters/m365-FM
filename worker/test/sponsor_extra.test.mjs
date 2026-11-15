import test from "node:test";
import assert from "node:assert/strict";
import { sponsorExtraEntities, limitTopics, GRACE_MONTHS, GRACE_DAYS } from "../src/sponsor_extra.js";

const ents = [{ id: "acme", type: "org", rel: [] }, { id: "acme-backup", type: "product", rel: [["developed_by", "acme"]] },
  { id: "acme-suite", type: "platform", rel: [["part_of", "acme"]] }, { id: "acme-concept", type: "concept", rel: [["part_of", "acme"]] }, { id: "other", type: "product", rel: [["developed_by", "x"]] }];
const pl = [{ start: "2026-01-01", end: "2026-06-30" }];
const at = (d) => sponsorExtraEntities("acme", d, pl, ents);

test("Konstanten", () => { assert.equal(GRACE_MONTHS, 6); assert.equal(GRACE_DAYS, 182); });
test("laufend", () => assert.deepEqual(at("2026-03-01"), ["acme", "acme-backup", "acme-suite"]));
test("Karenz Tag 1 und 182", () => { assert.equal(at("2026-07-01").length, 3); assert.equal(at("2026-12-29").length, 3); });
test("abgelaufen ab Tag 183", () => assert.deepEqual(at("2026-12-30"), []));
test("nicht gesponsert", () => { assert.deepEqual(sponsorExtraEntities("acme", "2026-03-01", [], ents), []); assert.deepEqual(sponsorExtraEntities("", "2026-03-01", pl, ents), []); });
test("Extras zaehlen nicht zu den 10, Dedupe", () => {
  const raw = Array.from({ length: 12 }, (_, i) => "t" + i).concat(["acme-backup"]);
  const out = limitTopics(raw, ["acme", "acme-backup"]);
  assert.equal(out.length, 12); assert.deepEqual(out.slice(0, 2), ["acme", "acme-backup"]); assert.equal(out.filter((x) => x === "acme-backup").length, 1);
});
test("ohne Extras: erste 10", () => assert.deepEqual(limitTopics(Array.from({ length: 15 }, (_, i) => i)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
