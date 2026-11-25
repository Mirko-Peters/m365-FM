// D1-Kosten (Paket A, Punkte 2, 4, 5, 10): Aufgabenliste je Cron, keine Doppellaeufe, Aufraeumen nur im Tageslauf, schlankes Protokoll,
// entityMap einmal je Lauf, rr/rw je Aufgabe.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { meterDb, rawDb } from "../src/d1meter.js";
import { purgeRateLimits, RL_SHORT, RL_MAX_WINDOW } from "../src/util.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const sql = [];
  const db = {
    prepare(q) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { sql.push(q); return { results: raw.prepare(q).all(...a), meta: { rows_read: 2, rows_written: 0 } }; }, first: async () => { sql.push(q); return raw.prepare(q).get(...a) ?? null; }, run: async () => { sql.push(q); const r = raw.prepare(q).run(...a); return { meta: { changes: Number(r.changes), rows_read: 1, rows_written: Number(r.changes) } }; } }; return o; },
    async batch(s) { const out = []; for (const x of s) out.push(await x.run()); return out; },
  };
  return { raw, sql, env: { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "s" } };
}
async function run(env, cron, at) {
  const old = globalThis.fetch, err = console.error, log = console.log, warn = console.warn;
  globalThis.fetch = async () => new Response("{}", { status: 404 }); console.error = () => {}; console.log = () => {}; console.warn = () => {};
  try { const w = []; await worker.scheduled({ cron, scheduledTime: Date.parse(at) }, env, { waitUntil: (x) => w.push(x) }); await Promise.all(w); await Promise.all(w); }
  finally { globalThis.fetch = old; console.error = err; console.log = log; console.warn = warn; }
}
const names = (raw) => raw.prepare("SELECT name FROM cron_runs ORDER BY name").all().map((r) => r.name);

test("dispatchTopicNotifications laeuft je Viertelstunde einmal (nur im */15-Zweig), um :00/:30 nicht doppelt", async () => {
  const { raw, sql, env } = await setup();
  await run(env, "*/15 * * * *", "2026-11-10T10:30:00Z");
  await run(env, "*/30 * * * *", "2026-11-10T10:30:00Z");
  const dispatchQueries = sql.filter((q) => /FROM topic_queue q LEFT JOIN topic_recipient_state/.test(q) && /GROUP BY q\.channel,q\.recipient ORDER BY first_created/.test(q));
  assert.equal(dispatchQueries.length, 1, "eine Empfaengerabfrage fuer beide Cron-Ereignisse um 10:30");
  assert.ok(!names(raw).includes("dispatchTopicNotifications"));
  const src = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
  assert.equal((src.match(/dispatchTopicNotifications\(env/g) || []).length, 1, "nur ein Aufruf im Cron");
});

test("Aufraeumen (Themen-Benachrichtigungen, cron_runs, ratelimit) nur im Tageslauf", async () => {
  const { sql, env, raw } = await setup();
  const del = () => sql.filter((q) => /DELETE FROM topic_deliveries WHERE created<\?|DELETE FROM cron_runs WHERE started<\?|DELETE FROM ratelimit WHERE/.test(q));
  await run(env, "*/15 * * * *", "2026-11-10T10:15:00Z"); await run(env, "*/30 * * * *", "2026-11-10T10:30:00Z");
  assert.deepEqual(del(), [], "tagsueber kein Aufraeumen");
  await run(env, "*/15 * * * *", "2026-11-10T06:00:00Z");
  assert.equal(sql.filter((q) => /DELETE FROM topic_deliveries WHERE created<\?/.test(q)).length, 1, "Themen um 06:00 im */15-Lauf");
  await run(env, "0 6 * * *", "2026-11-10T06:00:00Z");
  assert.equal(sql.filter((q) => /DELETE FROM cron_runs WHERE started<\?/.test(q)).length, 1);
  assert.ok(sql.some((q) => /DELETE FROM ratelimit WHERE k>=\? AND k<\? AND win<\?/.test(q)));
  assert.ok(names(raw).includes("syncExpertise"), "Expertise im Tageslauf");
  raw.exec("DELETE FROM cron_runs");
  await run(env, "*/30 * * * *", "2026-11-10T10:30:00Z");
  assert.ok(!names(raw).includes("syncExpertise"), "Expertise nicht mehr alle 30 Minuten");
});

test("Protokoll: eine Zeile je Aufgabe am Ende (kein UPDATE), uebersprungene Laeufe ohne Zeile, rr/rw in info; Sprecher einmal je Lauf", async () => {
  const { raw, sql, env } = await setup();
  await run(env, "*/30 * * * *", "2026-11-10T10:30:00Z");
  assert.ok(!sql.some((q) => /UPDATE cron_runs/.test(q)));
  assert.ok(!sql.some((q) => /INSERT INTO cron_runs\(name,started\) VALUES/.test(q)));
  const rows = raw.prepare("SELECT name,started,finished,ok,info FROM cron_runs").all();
  assert.ok(rows.length > 10 && rows.every((r) => r.finished >= r.started && r.finished > 0));
  assert.ok(!rows.some((r) => { if (!r.ok) return false; const j = JSON.parse(r.info.length < 300 ? r.info : "{}"); return j.skipped !== undefined && !j.rw; }), "uebersprungen ohne Schreibzugriff -> keine Zeile");
  assert.ok(!names(raw).includes("importLibrarySeed") || process.env.LIB_SEED_IMPORT === "1", "Standard aus -> skipped -> nicht protokolliert");
  assert.ok(rows.filter((r) => r.ok).every((r) => /^\{"rr":\d+,"rw":\d+/.test(r.info)), "info beginnt mit rr/rw");
  assert.equal(rows.filter((r) => r.name === "linkSpeakers").length, 1);
  assert.equal(sql.filter((q) => /^SELECT DISTINCT p\.handle FROM profiles p JOIN users u ON u\.id=p\.user_id WHERE p\.public=1 AND p\.handle IS NOT NULL AND u\.banned=0 AND \(u\.name LIKE/.test(q)).length, 1, "linkSpeakers einmal je Lauf (ein Eintrag in SPEAKER_LINKS)");
});

test("entityMap: alle live-Entitaeten werden je Cron-Lauf einmal gelesen", async () => {
  const { sql, env } = await setup();
  await run(env, "0 6 * * *", "2026-11-10T06:00:00Z");
  const loads = sql.filter((q) => q === "SELECT eid,data FROM entity_rev WHERE status='live' ORDER BY id").length;
  assert.ok(loads <= 2, `hoechstens zweimal (Import verwirft den Merker): ${loads}`);
});

test("d1meter: zaehlt rows_read/rows_written aus all/run/batch, Statements gehen unverpackt an batch", async () => {
  const seen = [];
  const st = (n) => ({ bind() { return st(n); }, all: async () => ({ results: [], meta: { rows_read: n, rows_written: 0 } }), run: async () => ({ meta: { rows_read: 1, rows_written: n } }), first: async () => null, raw: async () => [] });
  const db = { prepare: () => st(3), batch: async (s) => { seen.push(...s); return s.map(() => ({ meta: { rows_read: 1, rows_written: 1 } })); } };
  const m = { rr: 0, rw: 0 }, w = meterDb(db, m);
  await w.prepare("x").bind(1).all(); await w.prepare("y").run();
  await w.batch([w.prepare("a"), w.prepare("b")]);
  assert.deepEqual(m, { rr: 6, rw: 5 });
  assert.ok(seen.every((s) => typeof s.all === "function" && !(Symbol.for("m365.d1.raw") in s)), "unverpackt");
  assert.equal(rawDb(w), db);
});

test("ratelimit: abgelaufene kurze Fenster nach 2 Tagen, alles andere nach 366 Tagen; jedes kurze Praefix hat hoechstens 1 Tag Fenster", async () => {
  const { raw, env } = await setup();
  const t = Date.UTC(2026, 10, 10, 6) / 1000;
  const ins = raw.prepare("INSERT INTO ratelimit(k,n,win) VALUES(?,?,?)");
  ins.run("search:abc", 3, t - 3 * 86400); ins.run("search:new", 3, t - 3600); ins.run("searchx:abc", 1, t - 3 * 86400);
  ins.run("blog:5", 1, t - 3 * 86400); ins.run("expert_notify:9", 1, t - 367 * 86400); ins.run("expert_notify:10", 1, t - 300 * 86400);
  assert.deepEqual(await purgeRateLimits(env.DB, t * 1000), { deleted: 2 });
  assert.deepEqual(raw.prepare("SELECT k FROM ratelimit ORDER BY k").all().map((r) => r.k), ["blog:5", "expert_notify:10", "search:new", "searchx:abc"]);
  // Quelltext: jeder rateLimit-Aufruf mit einem kurzen Praefix nutzt ein Fenster <= 86400 s; laengstes Fenster <= RL_MAX_WINDOW
  const dir = new URL("../src/", import.meta.url), calls = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".js"))) {
    const s = readFileSync(new URL(f, dir), "utf8");
    for (const mm of s.matchAll(/rateLimit\([^,]+,\s*([^,]+),\s*[^,]+,\s*([^)]+?)\)(?:\)|;)/g)) calls.push({ f, key: mm[1].trim(), win: mm[2].trim() });
    for (const mm of s.matchAll(/const ipKey = "([a-z_]+:)"/g)) for (const c of s.matchAll(/rateLimit\(db, ipKey, \d+, (\d+)\)/g)) calls.push({ f, key: "`" + mm[1], win: c[1] });
    for (const mm of s.matchAll(/rateLimit\(db, "([a-z_]+:)" \+ email, \d+, (\d+)\)/g)) calls.push({ f, key: "`" + mm[1], win: mm[2] });
  }
  const evalWin = (w) => (/^[\d\s*]+$/.test(w) ? w.split("*").reduce((a, b) => a * Number(b.trim()), 1) : null);
  for (const p of RL_SHORT) {
    const hits = calls.filter((c) => c.key.replace(/^[`"']/, "").startsWith(p));
    assert.ok(hits.length, `Praefix ${p} wird genutzt`);
    for (const h of hits) { const w = evalWin(h.win); assert.ok(w !== null && w <= 86400, `${h.f}: ${h.key} Fenster ${h.win}`); }
  }
  for (const c of calls) { const w = evalWin(c.win); if (w !== null) assert.ok(w <= RL_MAX_WINDOW, `${c.f}: ${c.key} ${c.win}`); }
});
