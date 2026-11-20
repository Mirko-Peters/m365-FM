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
  assert.match(again.skipped, /fertig/, "alles eingespielt, Datei unveraendert: nichts mehr zu tun");
  raw.exec("DELETE FROM meta WHERE k='lib_seed_done'");   // Marke weg: ein neuer Lauf prueft alles und findet alles unveraendert
  const forced = await importLibrarySeed(env, [item(1), item(2)]);
  assert.deepEqual([forced.created, forced.updated, forced.same], [0, 0, 2]);
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

// ---- Pruefbefunde des Code-Reviews (20.11.2026) ----
test("Import ueberschreibt keinen von Hand geschriebenen Eintrag mit gleichem Slug, auch nicht beim Kennzeichen (K1)", async () => {
  const { env, raw } = await fixture();
  raw.prepare("INSERT INTO lib_items(user_id,slug,kind,title,summary,body,lang,topics,version,status,created,updated,published) VALUES(7,'starter-prompt-number-1','prompt','Starter prompt number 1','mein Text','Mein eigener Text, von Hand geschrieben, lang genug fuer die Pruefung.','en','[]',1,'live',1,1,1)").run();
  const r = await importLibrarySeed(env, [item(1), item(2)]);
  assert.deepEqual(r.rejected, [{ title: "Starter prompt number 1", why: "slug_taken" }]);
  const row = raw.prepare("SELECT body,reviewed,origin FROM lib_items WHERE slug='starter-prompt-number-1'").get();
  assert.match(row.body, /Mein eigener Text/); assert.equal(row.reviewed, 0); assert.equal(row.origin, "");
  assert.equal(raw.prepare("SELECT origin FROM lib_items WHERE slug='starter-prompt-number-2'").get().origin, "seed");
});

test("Bearbeiten eines importierten Eintrags ueber /api/library/save nimmt reviewed zurueck und macht ihn zum eigenen (K2)", async () => {
  const { env, raw } = await fixture();
  await importLibrarySeed(env, [item(1)]);
  const { handleLibrary } = await import("../src/library.js");
  const id = raw.prepare("SELECT id FROM lib_items").get().id;
  const J = (b, s = 200) => new Response(JSON.stringify(b), { status: s });
  const req = new Request("https://x/api/library/save", { method: "POST", body: JSON.stringify({ id, kind: "prompt", title: "Starter prompt number 1", summary: "s", body: "Ganz neuer, ungeprueft eingefuegter Text " + "y".repeat(40), topics: ["copilot-studio"], lang: "en" }) });
  const res = await handleLibrary(env, req, new URL(req.url), "/api/library/save", { id: 7, admin: 0 }, J);
  assert.equal(res.status, 200);
  const row = raw.prepare("SELECT reviewed,origin FROM lib_items WHERE id=?").get(id);
  assert.deepEqual([row.reviewed, row.origin], [0, ""]);
  const again = await importLibrarySeed(env, [item(1), item(9)]);   // geaenderte Datei: der Lauf ist wieder aktiv
  assert.deepEqual(again.rejected.map((x) => x.why), ["slug_taken"], "ein bearbeiteter Eintrag wird nie mehr vom Import angefasst");
});

test("Import merkt sich das Profil: wechselt der Inhaber der Kennung, passiert nichts (K4)", async () => {
  const { env, raw } = await fixture();
  await importLibrarySeed(env, [item(1)], { cap: 1 });
  assert.equal(raw.prepare("SELECT v FROM meta WHERE k='lib_seed_uid'").get().v, "7");
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(8,'x','8','Fremd',1); UPDATE profiles SET handle='alt' WHERE user_id=7; INSERT INTO profiles(user_id,public,handle,updated) VALUES(8,1,'mirko-p',1)");
  const r = await importLibrarySeed(env, [item(1), item(2)]);
  assert.match(r.skipped, /gewechselt/); assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 1);
});

test("Import ist nach dem letzten Lauf erledigt, bis sich die Datei aendert; geloeschte Eintraege kommen nicht zurueck (K1)", async () => {
  const { env, raw } = await fixture();
  const seed = [item(1), item(2)];
  const a = await importLibrarySeed(env, seed); assert.equal(a.created, 2); assert.equal(a.pending, 0);
  raw.exec("DELETE FROM lib_items WHERE slug='starter-prompt-number-2'");
  const b = await importLibrarySeed(env, seed);
  assert.match(b.skipped, /fertig/); assert.equal(raw.prepare("SELECT COUNT(*) n FROM lib_items").get().n, 1);
  const c = await importLibrarySeed(env, [item(1), item(2, { body: "z".repeat(70) })]);   // Datei geaendert: Lauf wieder aktiv, Eintrag 2 fehlt und wird neu angelegt
  assert.equal(c.created, 1);
});

test("Zwischenstand meldet pending zuerst; abgelehnte Eintraege verhindern die Erledigt-Marke", async () => {
  const { env, raw } = await fixture();
  const r = await importLibrarySeed(env, [item(1, { kind: "nope" }), item(2), item(3)], { cap: 1 });
  assert.deepEqual(Object.keys(r).slice(0, 2), ["pending", "created"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM meta WHERE k='lib_seed_done'").get().n, 0);
  const s = await importLibrarySeed(env, [item(1, { kind: "nope" }), item(2), item(3)]);
  assert.equal(s.pending, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM meta WHERE k='lib_seed_done'").get().n, 0, "mit Ablehnung nie 'fertig'");
});

test("Wochenmail: Start-Eintraege (origin seed) stehen nicht im Digest", () => {
  const sql = readFileSync(new URL("../src/digest.js", import.meta.url), "utf-8");
  assert.match(sql, /l\.status='live' AND l\.origin<>'seed'/);
});
