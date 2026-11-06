// Jede bekannte alte Adresse in hoechstens EINEM Schritt am Ziel (Wunsch Mirko 6.11.2026): alle Quellen der Weiterleitungstabelle laufen
// durch den echten Worker - www, alter Host (m365.fm, dub.m365.fm), mit und ohne "/" am Ende, als Bot und als deutscher Browser.
// Tabelle: HOPS_TABLE=<datei> (tests/test_redirect_hops.py baut sie aus dem Datenstand mit site_podpage.redirect_table), sonst die Fallliste.
// Ursprung im Test: jede Adresse mit "/" am Ende, die nicht selbst eine alte Adresse ist, liefert 200; alles andere 404.
import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const FILE = process.env.HOPS_TABLE;
const MAP = FILE ? JSON.parse(readFileSync(FILE, "utf8")) : JSON.parse(readFileSync(new URL("./legacy_cases.json", import.meta.url), "utf8")).map;
const store = new Map();
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const MAP_JSON = JSON.stringify(MAP);
const isOld = (p) => Object.prototype.hasOwnProperty.call(MAP, p.replace(/\/+$/, "") || "/");
globalThis.fetch = async (req) => {
  const u = new URL(typeof req === "string" ? req : req.url);
  if (u.pathname === "/show/redirects.json") return new Response(MAP_JSON, { headers: { "content-type": "application/json" } });
  if (u.pathname.endsWith("/") && !isOld(u.pathname)) return new Response("<html>ok</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W } = await import("../index.js");
const env = { MIGRATED: "1", PAGES: { get: async () => null } };
const BROWSER = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", accept: "text/html,*/*;q=0.8", "accept-language": "de-DE,de;q=0.9,en;q=0.5" };
const BOT = { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", accept: "text/html" };
async function call(url, headers) { const w = []; const r = await W.fetch(new Request(url, { headers }), env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return r; }
async function follow(url, headers) {
  let cur = url, hops = 0, r;
  for (;;) {
    r = await call(cur, headers);
    if (r.status < 300 || r.status >= 400) break;
    hops++; cur = new URL(r.headers.get("location"), cur).href;
    if (hops > 5) break;
  }
  return { hops, status: r.status, final: cur };
}

test("jede alte Adresse: hoechstens ein Schritt, Ziel liefert 200", async () => {
  const bad = []; let n = 0;
  for (const src of Object.keys(MAP)) {
    for (const [url, h] of [["https://www.m365.fm" + src, BOT], ["https://www.m365.fm" + src + "/", BROWSER], ["https://m365.fm" + src, BROWSER], ["https://dub.m365.fm" + src + "/", BOT]]) {
      const x = await follow(url, h); n++;
      if (x.hops > 1 || x.status !== 200) bad.push({ url, ua: h === BOT ? "bot" : "browser", ...x });
    }
  }
  if (process.env.HOPS_REPORT) writeFileSync(process.env.HOPS_REPORT, JSON.stringify({ checked: n, bad }, null, 1));
  assert.deepEqual(bad.slice(0, 20), [], `${bad.length} von ${n} Aufrufen mit mehr als einem Schritt oder ohne 200 am Ende`);
});
