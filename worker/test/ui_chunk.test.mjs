import test from "node:test";
import assert from "node:assert/strict";
import { uiChunk } from "../src/translate.js";

test("uiChunk: hoechstens 40 kurze Texte je Block", () => {
  const todo = Array.from({ length: 100 }, (_, i) => [`k${i}`, "Save"]);
  assert.equal(uiChunk(todo, 0).length, 40);
  assert.equal(uiChunk(todo, 80).length, 20);
});

test("uiChunk: lange Absaetze begrenzen den Block nach Zeichen, mindestens ein Text", () => {
  const todo = Array.from({ length: 30 }, (_, i) => [`p${i}`, "x".repeat(400)]);
  const c = uiChunk(todo, 0);
  assert.ok(c.length < 30 && c.length >= 1);
  assert.ok(c.reduce((n, [, v]) => n + v.length, 0) <= 9000);
  assert.equal(uiChunk([["big", "y".repeat(20000)]], 0).length, 1);
});
