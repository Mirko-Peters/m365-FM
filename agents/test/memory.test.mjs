import { test } from "node:test";
import assert from "node:assert/strict";
import { MEMORY_TTL, ANONYMOUS_TTL, emptyMemory, memoryOnUse, memoryOnExpiry, expireSession, confirmedCall } from "../src/session.js";

test("Gedächtnis läuft nach genau 30 Tagen ab, Nutzung verschiebt den Ablauf", () => {
  const initial = memoryOnUse(emptyMemory(), 1000);
  assert.equal(initial.schedule, true);
  const memory = { ...initial.memory, context: { event: "42" }, steps: ["Session anlegen"] };
  assert.deepEqual(memoryOnExpiry(memory, 1000 + MEMORY_TTL - 1), { memory, delay: 1 });
  assert.deepEqual(memoryOnExpiry(memory, 1000 + MEMORY_TTL), { memory: emptyMemory(), delay: 0 });
  const refreshed = memoryOnUse(memory, 2000);
  assert.equal(refreshed.schedule, false);
  assert.deepEqual(refreshed.memory.context, { event: "42" });
  assert.equal(refreshed.memory.expiresAt, 2000 + MEMORY_TTL);
  assert.equal(memoryOnExpiry(refreshed.memory, 1000 + MEMORY_TTL).delay, 1);
  const stale = memoryOnUse(memory, 1000 + MEMORY_TTL);
  assert.deepEqual(stale.memory.context, {});
  assert.deepEqual(stale.memory.steps, []);
});

test("Anonyme Sitzungen laufen spätestens nach einem Tag ab, auch bei Nutzung", () => {
  assert.equal(ANONYMOUS_TTL, 24 * 60 * 60 * 1000);
  const initial = memoryOnUse(emptyMemory(), 1000, false);
  assert.equal(initial.schedule, true);
  assert.equal(initial.memory.expiresAt, 1000 + ANONYMOUS_TTL);
  const active = memoryOnUse(initial.memory, 1000 + ANONYMOUS_TTL - 1, false);
  assert.equal(active.memory.expiresAt, initial.memory.expiresAt);
  assert.equal(active.schedule, false);
  assert.equal(memoryOnExpiry(active.memory, 1000 + ANONYMOUS_TTL).delay, 0);
});

test("Abgelaufene Sitzungen zerstören das DO; verlängerte Sitzungen planen erneut", async () => {
  for (const authenticated of [false, true]) {
    const state = memoryOnUse(emptyMemory(), 1000, authenticated).memory;
    let destroyed = 0;
    const scheduled = [];
    const agent = {
      state,
      destroy: async () => { destroyed++; },
      schedule: async (...args) => { scheduled.push(args); },
    };
    await expireSession(agent, state.expiresAt - 1000);
    assert.deepEqual(scheduled, [[1, "expireMemory"]]);
    assert.equal(destroyed, 0);
    await expireSession(agent, state.expiresAt);
    assert.equal(destroyed, 1);
    assert.equal(agent.state, state);
  }
});

test("Ohne Bestätigung kein Service-Aufruf, auch bei Fehler oder fehlendem Token", async () => {
  let calls = 0;
  const binding = { fetch() { calls++; throw new Error("Nicht erwartet"); } };
  const tool = { name: "save_event", annotations: { readOnlyHint: false } };
  assert.equal((await confirmedCall({ tool, args: {}, binding, authorization: "", confirm() { throw new Error("Nicht erwartet"); } })).isError, true);
  assert.equal((await confirmedCall({ tool, args: {}, binding, authorization: "test", confirm: async () => ({ action: "cancel" }) })).isError, true);
  await assert.rejects(confirmedCall({ tool, args: {}, binding, authorization: "test", confirm: async () => { throw new Error("Timeout"); } }));
  assert.equal(calls, 0);
});
