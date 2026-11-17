// K18/K19 ueber den Agent-Weg: upstream() reicht die IP des Endnutzers an den echten Community-Worker (/mcp) weiter. Ohne sie landeten alle
// anonymen Agent-Nutzer im gemeinsamen Eimer "mcpa:noip" - einer schoepfte das Budget fuer alle aus. D1 als SQLite im Speicher.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../../worker/src/index.js";
import { ANON_LIMIT } from "../../worker/src/mcp.js";
import { upstream, confirmedCall } from "../src/session.js";

async function community() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../../worker/migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const run = (st, a) => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };
  const DB = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => run(st, a) }; o._sync = () => run(st, a); return o; },
    batch: async (l) => { raw.exec("BEGIN"); try { const out = l.map((s) => s._sync()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB, SESSION_SECRET: "test-secret-0123456789", API: "https://api-dub.m365.fm", SITE: "https://www.m365.fm" };
  return { raw, binding: { fetch: (request) => W.fetch(request, env, { waitUntil() {} }) } };
}
const call = (binding, ip) => upstream(binding, "", "tools/call", { name: "get_help", arguments: {} }, ip).then((r) => JSON.parse(r.content[0].text));

test("K18/K19: zwei anonyme Agent-Nutzer mit verschiedenen IPs - A schoepft sein Limit aus, B bekommt trotzdem Daten", async () => {
  const { raw, binding } = await community();
  for (let i = 0; i < ANON_LIMIT; i++) assert.equal((await call(binding, "203.0.113.7")).error, undefined);
  assert.equal((await call(binding, "203.0.113.7")).error, "rate_limit", "A ist ausgeschoepft");
  const b = await call(binding, "203.0.113.8");
  assert.equal(b.error, undefined, "B hat ein eigenes Budget: " + JSON.stringify(b));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k='mcpa:noip'").get().n, 0, "kein gemeinsamer Eimer");
  // confirmedCall (lesende Werkzeuge) gibt die IP ebenso weiter
  const r = await confirmedCall({ tool: { name: "get_help", annotations: { readOnlyHint: true } }, args: {}, authorization: "", binding, ip: "203.0.113.7", confirm: async () => { throw new Error("nicht erwartet"); } });
  assert.equal(JSON.parse(r.content[0].text).error, "rate_limit");
});

test("upstream setzt nur gueltig aussehende IPs als cf-connecting-ip", async () => {
  const seen = [];
  const binding = { fetch: async (request) => { seen.push(request.headers.get("cf-connecting-ip")); return Response.json({ jsonrpc: "2.0", id: 1, result: {} }); } };
  for (const ip of ["198.51.100.4", "2001:db8::1", "", "x\u0000y", "1.2.3.4, 5.6.7.8"]) await upstream(binding, "", "tools/list", undefined, ip);
  assert.deepEqual(seen, ["198.51.100.4", "2001:db8::1", null, null, null]);
});
