// Spreaker-Adressen: Import der Zuordnung (spreaker-urls.json) und des Zustands (spreaker_urls_state.json) in D1, Admin-Uebersicht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { importEpisodeUrls, episodeUrlsOverview } from "../src/episode_urls.js";

function sqliteDb(raw) {
  return { prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { raw.prepare(sql).run(...a); return {}; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
}
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  return { raw, env: { DB: sqliteDb(raw), SITE: "https://www.m365.fm" } };
}
const items = Array.from({ length: 120 }, (_, i) => ({ spreaker_episode_id: String(1000 + i), show_id: i < 60 ? 6704921 : 7393187, lang: i < 60 ? "en" : "de", slug: "s" + i, url: i < 60 ? `https://www.m365.fm/show/episodes/s${i}/` : `https://www.m365.fm/de/s${i}/` }));
function withFetch(map, fn) {
  const old = globalThis.fetch;
  globalThis.fetch = async (u) => { const k = Object.keys(map).find((x) => String(u).includes(x)); return k ? new Response(JSON.stringify(map[k]), { status: 200 }) : new Response("nf", { status: 404 }); };
  return fn().finally(() => { globalThis.fetch = old; });
}

test("Import: Zuordnung + Zustand -> Zaehler ok / differs / missing, letzter Lauf", async () => {
  const { env } = await setup();
  const state = { run: { at: "2026-11-10T04:47:00Z", mode: "apply", changed: 2, checked: 4 },
    episodes: { 1000: { s: "ok", u: items[0].url, h: 6704921, c: "2026-11-10T04:47:00Z" }, 1001: { s: "differs", u: "https://www.m365.fm/m365-fm-podcast/s1", h: 6704921, c: "2026-11-10T04:47:00Z" },
      1100: { s: "missing", u: "", h: 7393187, c: "2026-11-10T04:47:00Z" }, 1101: { s: "bogus", u: "", h: 1, c: "x" } } };
  const r = await withFetch({ "/spreaker-urls.json": { items }, spreaker_urls_state: state }, () => importEpisodeUrls(env));
  assert.equal(r.imported, 120); assert.equal(r.state, 3);
  const o = await episodeUrlsOverview(env.DB);
  assert.equal(o.ok, 1); assert.equal(o.differs, 1); assert.equal(o.missing, 1); assert.equal(o.unknown, 117);
  assert.equal(o.last_run.mode, "apply"); assert.equal(o.differs_sample[0].id, "1001");
});

test("Import: geaenderte Adresse macht eine als ok gefuehrte Folge wieder offen; zu kleine Datei wird nicht uebernommen", async () => {
  const { env, raw } = await setup();
  const st = { episodes: { 1000: { s: "ok", u: items[0].url, h: 6704921, c: "2026-11-10T04:47:00Z" } } };
  await withFetch({ "/spreaker-urls.json": { items }, spreaker_urls_state: st }, () => importEpisodeUrls(env));
  const moved = items.map((x, i) => (i === 0 ? { ...x, url: "https://www.m365.fm/show/episodes/neu/" } : x));
  await withFetch({ "/spreaker-urls.json": { items: moved } }, () => importEpisodeUrls(env));
  assert.equal(raw.prepare("SELECT status FROM episode_urls WHERE spreaker_episode_id='1000'").get().status, "differs");
  const small = await withFetch({ "/spreaker-urls.json": { items: items.slice(0, 5) } }, () => importEpisodeUrls(env));
  assert.ok(small.skipped);
});
