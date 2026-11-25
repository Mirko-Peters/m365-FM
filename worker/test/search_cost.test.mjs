// D1-Kosten der Suche (Paket A, Punkte 5 und 9): Ratenlimit ueber die Bindung RL_SEARCH (Rueckfall D1), kurze Suchen aus dem Kanten-Cache.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleSearch } from "../src/search.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec("CREATE VIRTUAL TABLE search_fts USING fts5(title,keywords,summary,tokenize='trigram'); INSERT INTO meta(k,v) VALUES('search_fts_tokenizer','trigram')");
  const docs = [["en:ai", "https://www.m365.fm/ai/", "AI agents"], ["en:azure", "https://www.m365.fm/azure/", "Azure basics"]];
  for (const [id, url, title] of docs) {
    raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES(?,?,'en','page',?,?,'','','','2026-01-01','',?,0,1,'')").run(id, url, title, ` ${title.toLowerCase()} `, id);
    const { rowid } = raw.prepare("SELECT rowid FROM search_doc WHERE id=?").get(id);
    raw.prepare("INSERT INTO search_fts(rowid,title,keywords,summary) VALUES(?,?,'','')").run(rowid, title);
  }
  const sql = [];
  const db = { prepare(q) { const st = raw.prepare(q); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { sql.push(q); return { results: st.all(...a) }; }, first: async () => { sql.push(q); return st.get(...a) ?? null; }, run: async () => { sql.push(q); const r = st.run(...a); return { meta: { changes: Number(r.changes) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  return { raw, sql, env: { DB: db, SITE: "https://www.m365.fm", SESSION_SECRET: "t" } };
}
const call = (env, q, ip = "203.0.113.20", ctx) => {
  const req = new Request(`https://api-dub.m365.fm/api/search?q=${encodeURIComponent(q)}`, { headers: { "cf-connecting-ip": ip } });
  return handleSearch(env, req, new URL(req.url), (data, status = 200) => ({ data, status }), ctx);
};

test("Ratenlimit: mit RL_SEARCH keine D1-Zeile in ratelimit; abgelehnt -> 429; Bindung gestoert -> D1 wie bisher", async () => {
  const { raw, env } = await setup();
  const keys = [];
  let allow = true;
  const withRl = { ...env, RL_SEARCH: { async limit({ key }) { keys.push(key); return { success: allow }; } } };
  assert.equal((await call(withRl, "Azure")).status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit").get().n, 0, "kein D1-Ratenlimit mit Bindung");
  assert.match(keys[0], /^search:[0-9a-f]{64}$/, "Schluessel ohne IP-Adresse");
  allow = false;
  assert.equal((await call(withRl, "Azure")).status, 429);
  const broken = { ...env, RL_SEARCH: { async limit() { throw new Error("down"); } } };
  const warn = console.warn; console.warn = () => {};
  try { assert.equal((await call(broken, "Azure")).status, 200); } finally { console.warn = warn; }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit").get().n, 1, "Rueckfall auf D1");
  const toml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  assert.match(toml, /\[\[ratelimits\]\]\s*\nname = "RL_SEARCH"\s*\nnamespace_id = "\d+"\s*\nsimple = \{ limit = 60, period = 60 \}/);
  assert.ok(toml.indexOf("[[ratelimits]]") < toml.indexOf("[env.staging]"), "nur live; Staging nutzt D1");
});

test("Kurze Suche (< 3 Zeichen): zweiter Abruf aus dem Kanten-Cache ohne D1 und ohne Ratenlimit; lange Suchen nicht gecacht", async () => {
  const { sql, env } = await setup();
  const store = new Map(), old = globalThis.caches;
  globalThis.caches = { default: { async match(r) { const v = store.get(r.url); return v ? new Response(v) : undefined; }, async put(r, res) { store.set(r.url, await res.text()); } } };
  try {
    const first = await call(env, "AI");
    assert.equal(first.data.results[0].title, "AI agents");
    assert.equal(store.size, 1);
    sql.length = 0;
    const second = await call(env, "AI", "198.51.100.9");
    assert.deepEqual(second.data, first.data);
    assert.equal(sql.length, 0, "kein D1-Zugriff (weder Suche noch ratelimit)");
    await call(env, "Azure");
    assert.equal(store.size, 1, "Suchen ab 3 Zeichen bleiben ungecacht");
    const tasks = []; sql.length = 0;
    await call(env, "AI", "198.51.100.10", { waitUntil: (p) => tasks.push(p) });
    assert.equal(tasks.length, 0, "ohne c=1 keine Zaehlung");
    assert.ok([...store.keys()].every((k) => k.includes("/live/search-short/")));
    await call({ ...env, ENVIRONMENT: "staging" }, "AI");
    assert.equal(store.size, 2, "Staging bekommt einen eigenen Eintrag (gleiche Zone wie live)");
  } finally { globalThis.caches = old; }
});
