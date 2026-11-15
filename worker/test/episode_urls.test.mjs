// Spreaker-Adressen: Import der Zuordnung (spreaker-urls.json) und des Zustands (spreaker_urls_state.json) in D1, Admin-Uebersicht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { importEpisodeUrls, episodeUrlsOverview, episodeUrlsList } from "../src/episode_urls.js";

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
  // derselbe (noch alte) Zustand im selben Import darf die Folge nicht wieder auf ok setzen
  await withFetch({ "/spreaker-urls.json": { items: moved }, spreaker_urls_state: st }, () => importEpisodeUrls(env));
  assert.equal(raw.prepare("SELECT status FROM episode_urls WHERE spreaker_episode_id='1000'").get().status, "differs");
  // passt der Wert bei Spreaker wieder zur Adresse, bleibt der Zustand ok
  const fixed = { episodes: { 1000: { s: "ok", u: "https://www.m365.fm/show/episodes/neu/", h: 6704921, c: "2026-11-11T04:47:00Z" } } };
  await withFetch({ "/spreaker-urls.json": { items: moved }, spreaker_urls_state: fixed }, () => importEpisodeUrls(env));
  assert.equal(raw.prepare("SELECT status FROM episode_urls WHERE spreaker_episode_id='1000'").get().status, "ok");
  const small = await withFetch({ "/spreaker-urls.json": { items: items.slice(0, 5) } }, () => importEpisodeUrls(env));
  assert.ok(small.skipped);
});

test("Liste je Status (klickbare Kacheln): Titel und abweichende Felder aus dem Zustand, Suche, Seiten zu je 100", async () => {
  const { env } = await setup();
  const episodes = { 1001: { s: "differs", u: "https://www.m365.fm/m365-fm-podcast/s1", h: 6704921, c: "2026-11-10T04:47:00Z", t: "Copilot agents explained", f: ["description_html", "episode_link", "x y"] },
    1100: { s: "missing", u: "", h: 7393187, c: "2026-11-10T04:47:00Z", t: "Folge ohne Seite" } };
  for (let i = 0; i < 130; i++) episodes[String(2000 + i)] = { s: "differs", u: "", h: 6704921, c: "2026-11-10T04:47:00Z", t: "Bulk " + i, f: ["episode_link"] };
  await withFetch({ "/spreaker-urls.json": { items }, spreaker_urls_state: { episodes } }, () => importEpisodeUrls(env));
  const d = await episodeUrlsList(env.DB, "differs");
  assert.equal(d.total, 131); assert.equal(d.items.length, 100);
  const one = (await episodeUrlsList(env.DB, "differs", 0, "copilot")).items;
  assert.equal(one.length, 1); assert.deepEqual([one[0].title, one[0].fields, one[0].url, one[0].spreaker], ["Copilot agents explained", ["description_html", "episode_link"], items[1].url, "https://www.spreaker.com/episode/1001"]);
  assert.equal((await episodeUrlsList(env.DB, "differs", 100)).items.length, 31);
  const m = await episodeUrlsList(env.DB, "missing"); assert.deepEqual(m.items.map((x) => [x.id, x.title]), [["1100", "Folge ohne Seite"]]);
  assert.equal((await episodeUrlsList(env.DB, "bogus")).error, "bad_status");
  assert.equal((await episodeUrlsList(env.DB, "differs", 0, "%")).total, 131, "Platzhalter in der Suche zaehlen nicht");
  // ein spaeterer Zustand ohne Titel loescht den Titel nicht
  await withFetch({ "/spreaker-urls.json": { items }, spreaker_urls_state: { episodes: { 1001: { s: "ok", u: items[1].url, h: 6704921, c: "2026-11-11T04:47:00Z" } } } }, () => importEpisodeUrls(env));
  const ok = await episodeUrlsList(env.DB, "ok", 0, "1001"); assert.deepEqual([ok.items[0].title, ok.items[0].fields], ["Copilot agents explained", []]);
});
