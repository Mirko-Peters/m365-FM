// Sicherheitspruefung, MCP-Limits (K17, K18, K19, K37): ein JSON-RPC-Batch darf Limits nicht umgehen, anonyme Aufrufe haben ein Budget je
// Aufrufer, ein Batch liest die Entitaeten nur einmal, und Bridge-Aufrufe tragen die IP des echten Aufrufers (kein gemeinsamer Eimer).
// D1-Attrappe wie in points_limits.test.mjs: jede Abfrage laeuft erst nach einem Rundgang durch die Ereignisschleife.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { sha256hex } from "../src/util.js";
import { ANON_LIMIT, MAX_BATCH_ANON } from "../src/mcp.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }, { id: "azure", type: "product", name: "Azure" }];
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const u = String(input?.url || input);
  if (u.startsWith(SITE + "/") && (u.endsWith("/entities.json") || u.endsWith("/entities-src.json"))) return new Response(JSON.stringify({ entities: ENTS }), { headers: { "content-type": "application/json" } });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};
const hop = () => new Promise((r) => setImmediate(r));
const exec = (st, a) => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };

async function mk(n = 25) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url), seen = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { seen.push(sql); const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { await hop(); return { results: st.all(...a) }; }, first: async () => { await hop(); return st.get(...a) ?? null; }, run: async () => { await hop(); return exec(st, a); } }; o._sync = () => exec(st, a); return o; },
    batch: async (l) => { await hop(); raw.exec("BEGIN"); try { const out = l.map((s) => s._sync()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const sent = [];
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test", MAIL_FROM: "M365.FM <system@m365.fm>", EMAIL: { send: async (m) => { sent.push(m); return { messageId: "x" }; } } };
  for (let id = 1; id <= n; id++) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, "Person " + id, "user");
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  return { raw, db, env, sent, seen };
}
async function token(raw, uid) { const t = "m365_test_" + uid; raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,?,1)").run(await sha256hex(t), uid); return t; }
const rpc = (name, args, id) => ({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } });
async function mcp(env, body, { tok = "", ip = "" } = {}) {
  const headers = { "content-type": "application/json", ...(tok ? { authorization: "Bearer " + tok } : {}), ...(ip ? { "cf-connecting-ip": ip } : {}) };
  const r = await W.fetch(new Request(API + "/mcp", { method: "POST", headers, body: JSON.stringify(body) }), env, { waitUntil() {} });
  const j = await r.json().catch(() => null);
  return { s: r.status, j, res: Array.isArray(j) ? j.map((x) => (x.result ? JSON.parse(x.result.content[0].text) : x.error)) : null };
}
const one = (raw, sql, ...a) => raw.prepare(sql).get(...a);

test("K17: ein Batch mit 20x start_message legt nur dailyLimit (5) neue Kontakte an", async () => {
  const { raw, env } = await mk(25);
  const tok = await token(raw, 4);
  const r = await mcp(env, Array.from({ length: 20 }, (_, i) => rpc("start_message", { to: "user-" + (5 + i), body: "Hallo, kurze Frage zum Event." }, i + 1)), { tok, ip: "198.51.100.7" });
  assert.equal(r.s, 200);
  assert.equal(r.res.filter((x) => x.ok).length, 5, JSON.stringify(r.res));
  assert.equal(r.res.filter((x) => x.error === "daily_limit").length, 15);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM msg_threads WHERE a_id=4").n, 5);
});

test("K37: ein Batch mit 20x set_mail_address verschickt hoechstens 3 Mails an dieselbe Adresse; das MCP-Schreiblimit gilt je Aufruf", async () => {
  const { raw, env, sent } = await mk(6);
  const tok = await token(raw, 4), tok5 = await token(raw, 5);
  const r = await mcp(env, Array.from({ length: 20 }, (_, i) => rpc("set_mail_address", { email: "opfer@example.com" }, i + 1)), { tok });
  assert.equal(sent.length, 3, "Grenze je Zieladresse (3 am Tag) vor der Grenze je Konto (4/h)");
  assert.equal(r.res.filter((x) => x.error === "rate_limit").length, 17);
  await mcp(env, [rpc("set_mail_address", { email: "opfer@example.com" }, 1)], { tok: tok5 });   // ein anderes Konto: dieselbe Adresse bleibt geschuetzt
  assert.equal(sent.length, 3);
  // MCP-Schreiblimit (60/h): 3 parallele Batches mit je 20 Schreibaufrufen + 1 -> genau 60 kommen bis zum Werkzeug
  raw.prepare("DELETE FROM ratelimit").run();
  const all = await Promise.all([0, 1, 2, 3].map((k) => mcp(env, Array.from({ length: k === 3 ? 1 : 20 }, (_, i) => rpc("redeem_points", { item: "contacts" }, i + 1)), { tok })));
  const limited = all.flatMap((x) => x.res).filter((x) => x.error === "rate_limit").length;
  assert.equal(one(raw, "SELECT n FROM ratelimit WHERE k='mcp:4'").n, 60);
  assert.ok(limited >= 1, "der 61. Schreibaufruf wird abgewiesen");
});

test("K18: anonymer Zugang - Batch hoechstens 5, Stundenbudget je IP, ein Vollscan je Batch, IP nur als Hash", async () => {
  const { raw, env, seen } = await mk(2);
  assert.equal((await mcp(env, Array.from({ length: MAX_BATCH_ANON + 1 }, (_, i) => rpc("search_entities", { query: "teams" }, i + 1)), { ip: "203.0.113.9" })).s, 400);
  seen.length = 0;
  const first = await mcp(env, Array.from({ length: 5 }, (_, i) => rpc("search_entities", { query: "teams" }, i + 1)), { ip: "203.0.113.9" });
  assert.ok(first.res.every((x) => x.total === 1), JSON.stringify(first.res));
  assert.equal(seen.filter((q) => /SELECT eid,data FROM entity_rev WHERE status='live'/.test(q)).length, 1, "ein Batch teilt sich einen Vollscan");
  for (let i = 5; i < ANON_LIMIT; i += 5) await mcp(env, Array.from({ length: 5 }, (_, k) => rpc("get_help", {}, k + 1)), { ip: "203.0.113.9" });
  const over = await mcp(env, [rpc("search_entities", { query: "teams" }, 1)], { ip: "203.0.113.9" });
  assert.equal(over.res[0].error, "rate_limit");
  const other = await mcp(env, [rpc("search_entities", { query: "teams" }, 1)], { ip: "203.0.113.10" });
  assert.equal(other.res[0].total, 1, "andere IP: eigenes Budget");
  assert.equal(one(raw, "SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%203.0.113%'").n, 0, "IP nur als Hash");
});

test("K19: Bridge-Aufrufe tragen die IP weiter - ein Aufrufer sperrt search_content_gaps nicht fuer alle", async () => {
  const { raw, env } = await mk(3);
  let lim = 0;
  for (let i = 0; i < 7; i++) { const r = await mcp(env, Array.from({ length: 5 }, (_, k) => rpc("search_content_gaps", { lang: "en" }, k + 1)), { ip: "198.51.100.1" }); lim += r.res.filter((x) => x.error === "rate_limit").length; }
  assert.equal(lim, 5, "A: 30 je Minute, die 5 darueber sind gesperrt");
  const b = await mcp(env, [rpc("search_content_gaps", { lang: "en" }, 1)], { ip: "198.51.100.2" });
  assert.equal(b.res[0].error, undefined, "B (andere IP) bekommt Daten: " + JSON.stringify(b.res[0]));
  const c = await mcp(env, [rpc("search_content_gaps", { lang: "en" }, 1)], { tok: await token(raw, 2) });   // angemeldet ohne IP: eigener Eimer je Konto
  assert.equal(c.res[0].error, undefined);
  assert.ok(one(raw, "SELECT 1 x FROM ratelimit WHERE k='sdq:u:2'"));
});
