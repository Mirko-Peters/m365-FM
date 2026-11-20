// Bibliothek: Import der Start-Eintraege (library.js importLibrarySeed) und Kennzeichen "reviewed" (Migration 0054).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { importLibrarySeed } from "../src/library.js";

async function fixture({ handle = "mirko-p", pub = 1, banned = 0 } = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO meta(k,v) VALUES('entity_source','db')`);
  for (const e of ["copilot-studio", "kaizen", "power-bi"]) raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,0,'live',1)").run(e, "{}", "");
  raw.exec(`INSERT INTO users(id,provider,sub,name,banned,created) VALUES(7,'x','7','Mirko Peters',${banned},1); INSERT INTO profiles(user_id,public,handle,updated) VALUES(7,${pub},'${handle}',1)`);
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  return { env: { DB: db, LIB_SEED_HANDLE: "mirko-p" }, raw };
}
const item = (n, over = {}) => ({ kind: "prompt", title: `Starter prompt number ${n}`, summary: "A short summary that is long enough to be useful.", lang: "en", body: "x".repeat(60) + ` ${n}`, link: "", topics: ["copilot-studio"], reviewed: true, ...over });

test("Import legt Eintraege live unter dem Profil an, mit Kennzeichen, ohne Tageslimit", async () => {
  const { env, raw } = await fixture();
  const seed = Array.from({ length: 30 }, (_, i) => item(i + 1));
  const r = await importLibrarySeed(env, seed, { cap: 100 });
  assert.equal(r.created, 30); assert.equal(r.rejected.length, 0);
  const rows = raw.prepare("SELECT user_id,status,reviewed,version,slug FROM lib_items").all();
  assert.equal(rows.length, 30);
  assert.ok(rows.every((x) => x.user_id === 7 && x.status === "live" && x.reviewed === 1 && x.version === 1));
});

test("Import ist wiederholbar: unveraendert bleibt, geaendert wird aktualisiert, nichts wird geloescht", async () => {
  const { env, raw } = await fixture();
  await importLibrarySeed(env, [item(1), item(2)]);
  const again = await importLibrarySeed(env, [item(1), item(2)]);
  assert.deepEqual([again.created, again.updated, again.same], [0, 0, 2]);
  const ch = await importLibrarySeed(env, [item(1, { body: "y".repeat(80) })]);
  assert.equal(ch.updated, 1);
  assert.equal(raw.prepare("SELECT version FROM lib_items WHERE title=?").get("Starter prompt number 1").version, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 2, "Eintrag 2 fehlt in der zweiten Liste, bleibt aber erhalten");
  const un = await importLibrarySeed(env, [item(2, { reviewed: false })]);
  assert.equal(un.updated, 1);
  assert.equal(raw.prepare("SELECT reviewed FROM lib_items WHERE title=?").get("Starter prompt number 2").reviewed, 0);
});

test("Import lehnt Eintraege ab, die /api/library/save auch ablehnen wuerde", async () => {
  const { env, raw } = await fixture();
  const r = await importLibrarySeed(env, [item(1, { topics: ["gibt-es-nicht"] }), item(2, { kind: "nope" }), item(3, { title: "abc" }), item(4, { body: "kurz" }), item(5, { kind: "plugin", link: "" }),
    item(6, { kind: "plugin", link: "https://bit.ly/x" }), item(7, { topics: [] }), item(8), item(8)]);
  assert.deepEqual(r.rejected.map((x) => x.why), ["bad_topic", "bad_kind", "title", "too_short", "need_link", "bad_link", "bad_topic", "dup_slug"]);
  assert.equal(r.created, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 1);
});

test("Import: Obergrenze je Lauf, der Rest folgt im naechsten Lauf", async () => {
  const { env, raw } = await fixture();
  const seed = Array.from({ length: 7 }, (_, i) => item(i + 1));
  const a = await importLibrarySeed(env, seed, { cap: 3 });
  assert.deepEqual([a.created, a.pending], [3, 4]);
  const b = await importLibrarySeed(env, seed, { cap: 3 }); assert.deepEqual([b.created, b.same, b.pending], [3, 3, 1]);
  const c = await importLibrarySeed(env, seed, { cap: 3 }); assert.deepEqual([c.created, c.same, c.pending], [1, 6, 0]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 7);
});

test("Import: ohne oeffentliches Profil, bei gesperrtem Konto oder ohne Kennung passiert nichts", async () => {
  for (const f of [{ pub: 0 }, { banned: 1 }]) {
    const { env, raw } = await fixture(f);
    const r = await importLibrarySeed(env, [item(1)]);
    assert.ok(r.skipped, JSON.stringify(f)); assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 0);
  }
  const { env } = await fixture(); env.LIB_SEED_HANDLE = "";
  assert.ok((await importLibrarySeed(env, [item(1)])).skipped);
});

test("Gebaute Datei: alle Eintraege bestehen die Regeln des Imports (Themen existieren in entities.json)", async () => {
  const seed = JSON.parse(readFileSync(new URL("../src/library_seed.json", import.meta.url), "utf-8"));
  const ents = new Set(JSON.parse(readFileSync(new URL("../../data/entities.json", import.meta.url), "utf-8")).map((e) => e.id));
  const { env } = await fixture();
  for (const e of ents) env.DB.prepare("INSERT OR IGNORE INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,0,'live',1)").bind(e, "{}", "").run();
  const r = await importLibrarySeed(env, seed, { cap: 100000 });
  assert.deepEqual(r.rejected, []); assert.equal(r.created, seed.length);
});
