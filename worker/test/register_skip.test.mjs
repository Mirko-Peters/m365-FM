// D1-Kosten (Paket A, Punkt 2): Register-Importe ueberspringen unveraenderte Dateien, die Kopie aus ent_tr/item_tr laeuft nicht in jedem Lauf.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { importEpisodes, importTranslations } from "../src/register.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const sql = [];
  const db = {
    prepare(q) {
      const st = raw.prepare(q); let a = [];
      const o = {
        bind(...x) { a = x; return o; },
        all: async () => { sql.push(q); return { results: st.all(...a) }; },
        first: async () => { sql.push(q); return st.get(...a) ?? null; },
        run: async () => { sql.push(q); const r = st.run(...a); return { meta: { changes: Number(r.changes) } }; },
      };
      return o;
    },
    async batch(s) { const out = []; for (const x of s) out.push(await x.run()); return out; },
  };
  return { raw, sql, env: { DB: db, SITE: "https://www.m365.fm" } };
}
function withFetch(map, fn) {
  const old = globalThis.fetch;
  globalThis.fetch = async (u) => { const p = new URL(String(u)).pathname; return p in map ? new Response(JSON.stringify(map[p]), { status: 200 }) : new Response("nf", { status: 404 }); };
  return fn().finally(() => { globalThis.fetch = old; });
}
const eps = Array.from({ length: 5 }, (_, i) => ({ slug: `folge-${i}`, title: `Folge ${i}`, summary: "S", texts: { keypoints: ["a"] }, guests: ["anna"] }));

test("importEpisodes: unveraenderter Teil liest die Tabelle episode nicht, kein COUNT(*); geaenderter Teil nur seine Zeilen", async () => {
  const { env, sql, raw } = await setup();
  const files = { "/episodes-register.json": { parts: 1, count: 5, renames: {} }, "/episodes-register-1.json": { episodes: eps } };
  assert.equal((await withFetch(files, () => importEpisodes(env))).changed, 5);
  assert.ok(!sql.some((q) => /COUNT\(\*\)/.test(q)));
  sql.length = 0;
  const again = await withFetch(files, () => importEpisodes(env));
  assert.equal(again.skipped, "Teil unveraendert");
  assert.ok(!sql.some((q) => /FROM episode\b/.test(q)), "kein Lesen der Tabelle episode");
  assert.ok(!sql.some((q) => /^\s*(INSERT|UPDATE|DELETE)/i.test(q) && !/INTO meta/.test(q)), "kein Schreibzugriff ausser meta");
  files["/episodes-register-1.json"] = { episodes: eps.map((e, i) => (i === 2 ? { ...e, title: "Neu" } : e)) };
  sql.length = 0;
  assert.equal((await withFetch(files, () => importEpisodes(env))).changed, 1);
  assert.equal(raw.prepare("SELECT title FROM episode WHERE slug='folge-2'").get().title, "Neu");
  assert.ok(sql.some((q) => /FROM episode WHERE slug IN \(SELECT value FROM json_each/.test(q)), "nur die Zeilen des Teils");
});

test("importTranslations: Kopie aus ent_tr beim ersten Lauf und mit daily, unveraenderte Registerdatei ohne Tabellenabgleich", async () => {
  const { env, sql, raw } = await setup();
  raw.exec("INSERT INTO ent_tr(eid,field,lang,text,created) VALUES('azure','desc','de','Wolke',1)");
  const items = [{ kind: "episode", id: "folge-1", lang: "de", field: "title", text: "Folge eins" }];
  const files = { "/translations-register-de.json": { kind: "episode", lang: "de", items } };
  const first = await withFetch(files, () => importTranslations(env));
  assert.equal(first.copied, 1); assert.equal(first.imported, 1);
  assert.ok(!sql.some((q) => /COUNT\(\*\)/.test(q)));
  raw.exec("INSERT INTO ent_tr(eid,field,lang,text,created) VALUES('fabric','desc','de','Stoff',1); UPDATE meta SET v='0' WHERE k='tr_import_i'");
  sql.length = 0;
  const second = await withFetch(files, () => importTranslations(env));
  assert.equal(second.copied, 0); assert.equal(second.skipped, "Registerdatei unveraendert");
  assert.ok(!sql.some((q) => /FROM ent_tr|FROM item_tr|FROM translation/.test(q)), "weder Kopie noch Tabellenabgleich");
  raw.exec("UPDATE meta SET v='0' WHERE k='tr_import_i'");
  assert.equal((await withFetch(files, () => importTranslations(env, { daily: true }))).copied, 1, "Tageslauf uebernimmt neue ent_tr-Zeilen");
});
