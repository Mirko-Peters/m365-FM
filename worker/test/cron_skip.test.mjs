// D1-Kosten (Paket A, Punkt 1): Cron-Importe schreiben nur Aenderungen und ueberspringen eine unveraenderte Quelldatei (Fingerabdruck in meta).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { importQuotesFromSite } from "../src/quotes.js";
import { syncContentTopics } from "../src/topics.js";
import { importEntitiesFromSite } from "../src/entities.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const log = { writes: 0, sql: [] };
  const changes = () => Number(raw.prepare("SELECT total_changes() n").get().n);
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let a = [];
      const o = {
        bind(...x) { a = x; return o; },
        all: async () => { log.sql.push(sql); return { results: st.all(...a) }; },
        first: async () => { log.sql.push(sql); return st.get(...a) ?? null; },
        run: async () => { log.sql.push(sql); const before = changes(); const r = st.run(...a); const n = changes() - before; if (!/INTO meta/.test(sql)) log.writes += n; return { meta: { changes: n, last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    async batch(s) { const out = []; for (const x of s) out.push(await x.run()); return out; },
  };
  return { raw, log, env: { DB: db, SITE: "https://www.m365.fm" } };
}
function withFetch(map, fn) {
  const old = globalThis.fetch;
  globalThis.fetch = async (u) => { const k = Object.keys(map).find((x) => String(u).includes(x)); return k ? new Response(JSON.stringify(map[k]), { status: 200 }) : new Response("nf", { status: 404 }); };
  return fn().finally(() => { globalThis.fetch = old; });
}

test("Zitate: zweiter Lauf mit gleicher quotes.json schreibt nichts; ein geaendertes Zitat schreibt genau eine Zeile", async () => {
  const { env, log, raw } = await setup();
  const quotes = Array.from({ length: 60 }, (_, i) => ({ id: `1-${i}`, person: "mirko-peters", text: `Zitat ${i}`, lang: "de", episode_id: "1", time_s: i, about: ["azure"] }));
  await withFetch({ "/quotes.json": { quotes } }, () => importQuotesFromSite(env));
  assert.equal(log.writes, 60);
  log.writes = 0; log.sql = [];
  const again = await withFetch({ "/quotes.json": { quotes } }, () => importQuotesFromSite(env));
  assert.equal(again.skipped, "unveraendert"); assert.equal(log.writes, 0);
  assert.ok(log.sql.every((s) => /FROM meta/.test(s)), "nur die meta-Zeile wird gelesen");
  // neue Datei (z. B. anderes generated), Inhalte gleich bis auf ein Zitat: nur diese Zeile
  log.writes = 0;
  const changed = quotes.map((q, i) => (i === 7 ? { ...q, text: "Neuer Text" } : q));
  await withFetch({ "/quotes.json": { generated: "x", quotes: changed } }, () => importQuotesFromSite(env));
  assert.equal(log.writes, 1);
  assert.equal(raw.prepare("SELECT text FROM quote WHERE id='1-7'").get().text, "Neuer Text");
});

test("Themen: created wird nicht ueberschrieben, unveraenderte topics.json uebersprungen, kein COUNT(*) ueber content_topic", async () => {
  const { env, log, raw } = await setup();
  const items = [{ kind: "episode", id: "a", eid: "azure", w: 1 }, { kind: "episode", id: "a", eid: "fabric", w: 0.5 }, { kind: "episode", id: "b", eid: "azure", w: 1 }];
  await withFetch({ "/topics.json": { items } }, () => syncContentTopics(env));
  raw.exec("UPDATE content_topic SET created=7");
  log.writes = 0; log.sql = [];
  const same = await withFetch({ "/topics.json": { items } }, () => syncContentTopics(env));
  assert.equal(same.skipped, "topics.json unveraendert"); assert.equal(log.writes, 0);
  assert.ok(!log.sql.some((s) => /COUNT\(\*\)/i.test(s) && /content_topic/.test(s)));
  log.writes = 0;
  const next = [{ ...items[0] }, { ...items[1], w: 0.8 }, { kind: "episode", id: "c", eid: "azure", w: 1 }];   // Gewicht geaendert, b entfaellt, c neu
  const r = await withFetch({ "/topics.json": { items: next } }, () => syncContentTopics(env));
  assert.equal(r.fromSite, 2, "geaendertes Gewicht + neue Zeile, unveraenderte Zeile nicht");
  assert.equal(log.writes, 3, "dazu das Loeschen der entfallenen Zuordnung");
  assert.deepEqual(raw.prepare("SELECT item_id,eid,weight,created FROM content_topic ORDER BY item_id,eid").all().map((x) => [x.item_id, x.eid, x.weight, x.created === 7]),
    [["a", "azure", 1, true], ["a", "fabric", 0.8, true], ["c", "azure", 1, false]]);
});

test("Entitaeten: zweiter Lauf mit gleichen entities.json/entities-src.json liest kein entity_rev; geaenderte Datei oder Tageslauf rechnen voll", async () => {
  const { env, log, raw } = await setup();
  const ents = [{ id: "contoso", type: "org", name: "Contoso", desc: { en: "Contoso builds Microsoft 365 apps." } }, { id: "hub", type: "product", name: "Hub", desc: { en: "Seed hub text here." } }];
  const files = { "/entities-src.json": { entities: ents }, "/entities.json": { entities: ents } };
  const first = await withFetch(files, () => importEntitiesFromSite(env));
  assert.equal(first.imported, 2); assert.equal(first.open, undefined, "alles erledigt -> Fingerabdruck gespeichert");
  log.sql = []; log.writes = 0;
  const again = await withFetch(files, () => importEntitiesFromSite(env));
  assert.equal(again.skipped, "unveraendert"); assert.equal(again.imported, 0);
  assert.ok(!log.sql.some((q) => /entity_rev|org_entity|FROM orgs/.test(q)), "keine Lesung aller live-eids, kein Abgleich, keine Paarung");
  assert.equal(log.writes, 0);
  log.sql = [];
  const daily = await withFetch(files, () => importEntitiesFromSite(env, { daily: true }));
  assert.equal(daily.skipped, undefined, "Tageslauf rechnet voll (Sicherheitsnetz)"); assert.ok(log.sql.some((q) => /SELECT DISTINCT eid FROM entity_rev/.test(q)));
  const more = [...ents, { id: "neu", type: "concept", name: "Neu", desc: { en: "A new concept for the test." } }];
  const changed = await withFetch({ "/entities-src.json": { entities: more }, "/entities.json": { entities: more } }, () => importEntitiesFromSite(env));
  assert.equal(changed.imported, 1, "geaenderte Datei -> neuer Eintrag wird uebernommen");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='neu' AND status='live'").get().n, 1);
});
