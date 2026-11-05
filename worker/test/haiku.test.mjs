import { test } from "node:test";
import assert from "node:assert/strict";
import { claudeText } from "../src/util.js";
import { haikuJson } from "../src/autotr.js";

// Claude Haiku 5.5 (anthropic-version 2023-06-01): temperature != 1 -> 400; eine Antwort kann mit thinking-Bloecken beginnen.
function withFetch(fn, impl) {
  const old = globalThis.fetch; globalThis.fetch = impl;
  return fn().finally(() => { globalThis.fetch = old; });
}
const reply = (content, status = 200) => new Response(JSON.stringify({ content }), { status, headers: { "content-type": "application/json" } });
const ENV = {
  ANTHROPIC_API_KEY: "test-key",
  DB: { prepare() { return { bind() { return this; }, async run() { return { meta: { changes: 1 } }; }, async first() { return { usd: 0, reserved_usd: 0 }; } }; } },
};

test("claudeText: liest nur Text-Bloecke, auch hinter thinking-Bloecken", () => {
  assert.equal(claudeText({ content: [{ type: "thinking", thinking: "", signature: "s" }, { type: "text", text: " {\"a\":1} " }] }), "{\"a\":1}");
  assert.equal(claudeText({ content: [{ type: "text", text: "a" }, { type: "text", text: "b" }] }), "ab");
  assert.equal(claudeText({}), ""); assert.equal(claudeText(null), "");
});

test("haikuJson: keine Sampling-Parameter, Denkphase aus, Aufwand low", () => withFetch(async () => {
  const out = await haikuJson({ ...ENV, CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "gateway-token" }, "sys", { title: "Hallo" }, { job: "test_haiku", lang: "de" });
  assert.deepEqual(out, { title: "Hello" });
}, async (url, init) => {
  assert.equal(url, "https://gateway.ai.cloudflare.com/v1/account/m365fm/anthropic/v1/messages");
  assert.equal(init.headers["cf-aig-authorization"], "Bearer gateway-token");
  assert.deepEqual(JSON.parse(init.headers["cf-aig-metadata"]), { job: "test_haiku", lang: "de", model: "claude-haiku-5-5" });
  const b = JSON.parse(init.body);
  assert.equal(b.model, "claude-haiku-5-5");
  for (const k of ["temperature", "top_p", "top_k"]) assert.ok(!(k in b), `${k} darf nicht gesendet werden`);
  assert.deepEqual(b.thinking, { type: "disabled" }); assert.deepEqual(b.output_config, { effort: "low" });
  assert.equal(b.messages.at(-1).role, "user");   // kein Prefill
  return reply([{ type: "text", text: "{\"title\":\"Hello\"}" }]);
}));

test("haikuJson: Antwort mit thinking-Block vorn und Code-Zaun wird gelesen", () => withFetch(async () => {
  assert.deepEqual(await haikuJson(ENV, "sys", { t: "x" }), { t: "y" });
}, async () => reply([{ type: "thinking", thinking: "", signature: "sig" }, { type: "text", text: "```json\n{\"t\":\"y\"}\n```" }])));

test("haikuJson: 400 -> zweiter Versuch ohne thinking/output_config, weiter ohne temperature", () => {
  const bodies = [];
  return withFetch(async () => {
    assert.deepEqual(await haikuJson(ENV, "sys", { t: "x" }), { t: "z" });
    assert.equal(bodies.length, 2);
    assert.ok("thinking" in bodies[0] && !("thinking" in bodies[1]) && !("output_config" in bodies[1]));
    assert.ok(bodies.every((b) => !("temperature" in b)));
  }, async (url, init) => {
    bodies.push(JSON.parse(init.body));
    return bodies.length === 1 ? reply([], 400) : reply([{ type: "text", text: "{\"t\":\"z\"}" }]);
  });
});

test("haikuJson: anhaltender Fehler wird gemeldet (zaehlt im Aufrufer als failed)", () => withFetch(async () => {
  await assert.rejects(haikuJson(ENV, "sys", {}), /api 500/);
}, async () => reply([], 500)));

test("haikuJson: System-Bloecke mit cache_control gehen unveraendert durch, Variables bleibt in der Nutzernachricht", () => withFetch(async () => {
  const system = [{ type: "text", text: "Regeln", cache_control: { type: "ephemeral" } }];
  assert.deepEqual(await haikuJson({ ...ENV, CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "gateway-token" }, system, { t: "x" }, { job: "test_haiku" }), { t: "y" });
}, async (url, init) => {
  const b = JSON.parse(init.body);
  assert.deepEqual(b.system, [{ type: "text", text: "Regeln", cache_control: { type: "ephemeral" } }]);
  assert.equal(b.messages[0].content, JSON.stringify({ t: "x" }));
  return reply([{ type: "text", text: "{\"t\":\"y\"}" }]);
}));
