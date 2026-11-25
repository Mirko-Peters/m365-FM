// D1-Kosten (Paket A, Punkt 9): Hausanzeigen-Einblendungen gebuendelt per ctx.waitUntil, ad_house 60 s im Isolat.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleAds } from "../src/ads.js";

const FETCH = { "user-agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/130", "accept-language": "de-DE,de;q=0.9", accept: "*/*", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty", "sec-fetch-site": "same-site", "cf-connecting-ip": "203.0.113.5" };
const J = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...extra } });

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const sql = [];
  const db = { prepare(q) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { sql.push(q); return { results: raw.prepare(q).all(...a) }; }, first: async () => { sql.push(q); return raw.prepare(q).get(...a) ?? null; }, run: async () => { sql.push(q); const r = raw.prepare(q).run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { const out = []; for (const x of s) out.push(await x.run()); return out; } };
  return { raw, sql, env: { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "t", ADS_BOOKING: "0", AD_HOUSE_FLUSH_MS: "0" } };
}
const serve = (env, query, ctx, headers = {}) => { const url = new URL(`https://api-dub.m365.fm/api/ads/serve${query}`); return handleAds(env, new Request(url, { headers: { ...FETCH, ...headers } }), url, url.pathname, undefined, J, ctx); };

test("Einblendungen mit ctx: ein UPSERT mit +n statt einem je Aufruf; ad_house einmal gelesen", async () => {
  const { raw, sql, env } = await setup();
  raw.exec("INSERT INTO ad_house(slot,title,body,cta,url,langs,active,created) VALUES('top','M365Con','','','https://m365con.net/','de',1,1)");
  const tasks = [], ctx = { waitUntil: (p) => tasks.push(p) };
  for (let i = 0; i < 3; i++) assert.equal((await (await serve(env, "?slot=top&pt=lang&lang=de", ctx, { "cf-ipcountry": "DE" })).json()).house.title, "M365Con");
  await serve(env, "?slot=top&pt=lang&lang=de", ctx, { "user-agent": "Googlebot/2.1" });   // Bot: nicht gezaehlt
  await Promise.all(tasks);
  assert.equal(sql.filter((q) => /FROM ad_house WHERE active=1/.test(q)).length, 1, "ad_house 60 s im Isolat");
  assert.equal(sql.filter((q) => /INSERT INTO ad_house_stats/.test(q)).length, 1, "ein gebuendelter Schreibzugriff");
  assert.deepEqual(raw.prepare("SELECT house,slot,lang,country,impressions FROM ad_house_stats").all().map((x) => ({ ...x })), [{ house: `x${raw.prepare("SELECT id FROM ad_house").get().id}`, slot: "top", lang: "de", country: "DE", impressions: 3 }]);
  // Verwaltung aendert Hausanzeigen: der Merker dieses Isolats verfaellt sofort
  await handleAds(env, new Request("https://api-dub.m365.fm/api/admin/ads/house", { method: "POST", body: JSON.stringify({ slot: "top", title: "Webinar", url: "https://example.com/w", langs: "de" }), headers: { "content-type": "application/json", "x-requested-with": "m365" } }), new URL("https://api-dub.m365.fm/api/admin/ads/house"), "/api/admin/ads/house", { id: 1, admin: true }, J);
  assert.equal((await (await serve(env, "?slot=top&pt=lang&lang=de", ctx)).json()).house.title, "Webinar");
  await Promise.all(tasks);
});

test("Einblendungen ohne ctx: sofort gezaehlt (wie bisher)", async () => {
  const { raw, env } = await setup();
  await serve(env, "?slot=mid&pt=blog&lang=de&house=m365con");
  assert.equal(raw.prepare("SELECT SUM(impressions) n FROM ad_house_stats WHERE house='m365con'").get().n, 1);
});
