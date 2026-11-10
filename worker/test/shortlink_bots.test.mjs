// Kurzlink c.m365.fm (GO_BASE) und "Mensch oder Bot": classify() mit Kopfzeilen, getrennte Zaehler clicks / clicks_filtered,
// Hostregeln des Workers (nur /<code>), keine Datenspeicherung ueber Personen. SQLite mit allen Migrationen, kein Netz.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { classify, isBot } from "../src/botcheck.js";
import { goBase, goHost, goUrl } from "../src/ads.js";
import { handleSponsorLink } from "../src/sponsor.js";
import worker from "../src/index.js";

const HUMAN = { "accept-language": "de-DE,de;q=0.9,en;q=0.8", accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "sec-fetch-mode": "navigate", "sec-fetch-dest": "document", "sec-fetch-site": "cross-site", "sec-fetch-user": "?1" };
const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const req = (headers = {}, cf, url = "https://c.m365.fm/acme-home") => {
  const r = new Request(url, { headers });
  if (cf) Object.defineProperty(r, "cf", { value: cf });
  return r;
};

test("classify: echter Browser-Klick ist ein Mensch", () => {
  assert.deepEqual(classify(req({ "user-agent": CHROME, ...HUMAN })), { bot: false, reason: "", score: 0 });
  // Safari/iOS und App-Browser ohne Sec-Fetch-User und ohne Sec-Fetch-Version-Pruefung bleiben Mensch
  const safari = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  assert.equal(isBot(req({ "user-agent": safari, "accept-language": "de-DE", accept: "text/html" })), false);
  const { "sec-fetch-user": _u, ...noUser } = HUMAN;
  assert.equal(isBot(req({ "user-agent": CHROME, ...noUser })), false, "Sec-Fetch-User fehlt bei manchen echten Klicks: kein Bot-Hinweis");
  // Cloudflare-WARP-Nutzer sitzen im Cloudflare-Netz: kein Rechenzentrums-Hinweis
  assert.equal(isBot(req({ "user-agent": CHROME, ...HUMAN }, { asOrganization: "Cloudflare, Inc." })), false);
  // Rechenzentrums-Netz allein reicht nie
  assert.equal(isBot(req({ "user-agent": CHROME, ...HUMAN }, { asOrganization: "Microsoft Corporation" })), false);
});

test("classify: eindeutige Bots, Vorschau-Agenten und Link-Scanner", () => {
  const cases = [
    [{}, "no-ua"],
    [{ "user-agent": CHROME, ...HUMAN, "sec-purpose": "prefetch;prerender" }, "prefetch"],
    [{ "user-agent": CHROME, ...HUMAN, "x-moz": "prefetch" }, "prefetch"],
    [{ "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }, "user-agent"],
    [{ "user-agent": "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)" }, "user-agent"],
    [{ "user-agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) SkypeUriPreview Preview/0.5" }, "user-agent"],
    [{ "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Proofpoint-URLDefense" }, "user-agent"],
    [{ "user-agent": "Mozilla/5.0 (Windows NT 10.0) Barracuda Sentinel" }, "user-agent"],
    [{ "user-agent": "Mozilla/5.0 (Windows NT 10.0) HeadlessChrome/120.0.0.0 Safari/537.36" }, "user-agent"],
    [{ "user-agent": "python-requests/2.31", ...HUMAN }, "user-agent"],
    [{ "user-agent": "curl/8.0" }, "user-agent"],
    [{ "user-agent": "Go-http-client/2.0" }, "user-agent"],
    [{ "user-agent": "WhatsApp/2.23" }, "user-agent"],
  ];
  for (const [h, reason] of cases) assert.equal(classify(req(h)).reason, reason, JSON.stringify(h));
  // Cloudflare Bot Management (nur mit Tarif vorhanden): verifizierter Bot oder Wert unter 30
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN }, { botManagement: { verifiedBot: true } })).reason, "bot-management");
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN }, { botManagement: { score: 12 } })).bot, true);
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN }, { botManagement: { score: 80 } })).bot, false);
  // ohne Bot Management fehlt das Feld ganz: darf nichts kaputt machen
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN }, {})).bot, false);
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN })).bot, false, "ohne request.cf");
});

test("classify: Sec-Fetch passt nicht zu einem Link-Klick", () => {
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" })).reason, "sec-fetch");
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, "sec-fetch-dest": "image" })).reason, "sec-fetch");
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, "sec-fetch-mode": "no-cors" })).bot, true);
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, "sec-fetch-dest": "iframe" })).bot, false, "Klick in einem eingebetteten Rahmen");
});

test("classify: schwache Hinweise zaehlen erst ab zwei", () => {
  // Browser-Kennung ohne Sprache: ein Hinweis -> noch Mensch
  const { "accept-language": _l, ...noLang } = HUMAN;
  assert.deepEqual(classify(req({ "user-agent": CHROME, ...noLang })), { bot: false, reason: "", score: 1 });
  // ... zusammen mit fehlendem Sec-Fetch bei modernem Chrome (Skript mit gefaelschter Browserkennung)
  assert.deepEqual(classify(req({ "user-agent": CHROME, accept: "text/html" })), { bot: true, reason: "signals", score: 2 });
  // ... oder mit Rechenzentrums-Netz
  assert.equal(classify(req({ "user-agent": CHROME, ...noLang }, { asOrganization: "Amazon.com, Inc." })).bot, true);
  // Accept nur */* statt text/html und kein Rechenzentrum: ein Hinweis
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, accept: "*/*" })).score, 1);
  assert.equal(classify(req({ "user-agent": CHROME, ...HUMAN, accept: "*/*" }, { asOrganization: "Hetzner Online GmbH" })).bot, true);
  // alte Browser ohne Sec-Fetch (Chrome 70) und iOS-Chrome (CriOS) bekommen keinen Abzug dafuer
  assert.equal(classify(req({ "user-agent": "Mozilla/5.0 Chrome/70.0.3538.77 Safari/537.36", accept: "text/html", "accept-language": "de" })).score, 0);
  assert.equal(classify(req({ "user-agent": "Mozilla/5.0 (iPhone) AppleWebKit CriOS/130.0 Mobile Safari/604.1", accept: "text/html", "accept-language": "de" })).score, 0);
});

test("goBase/goUrl: nur ein reiner https-Ursprung, sonst alte Adresse", () => {
  const API = "https://api-dub.m365.fm";
  assert.equal(goUrl({ API }, "abc-def", "s=topic"), "https://api-dub.m365.fm/go/abc-def?s=topic");
  assert.equal(goUrl({ API, GO_BASE: "https://c.m365.fm" }, "abc-def", "s=topic"), "https://c.m365.fm/abc-def?s=topic");
  assert.equal(goUrl({ API, GO_BASE: "https://c.m365.fm/" }, "ad-x123456", "?s=mid&pt=blog"), "https://c.m365.fm/ad-x123456?s=mid&pt=blog");
  assert.equal(goUrl({ API, GO_BASE: "https://c.m365.fm" }, "h-m365con"), "https://c.m365.fm/h-m365con");
  for (const bad of ["", "http://c.m365.fm", "https://c.m365.fm/go", "https://u:p@c.m365.fm", "c.m365.fm", "javascript:alert(1)", "https://c.m365.fm/?x=1"]) {
    assert.equal(goBase({ GO_BASE: bad }), "", bad);
    assert.equal(goUrl({ API, GO_BASE: bad }, "abc"), "https://api-dub.m365.fm/go/abc", bad);
  }
  assert.equal(goHost({ GO_BASE: "https://c.m365.fm" }), "c.m365.fm");
  assert.equal(goHost({}), "");
});

// ---------------------------------------------------------------- Worker mit SQLite

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,created_at) VALUES('acme-home',1,'p1','https://acme.example/path?x=1','{"utm_source":"m365.fm"}',1);
    INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,active,created_at) VALUES('acme-off',1,'p1','https://acme.example/off','{}',0,1);`);
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; },
    all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => ({ meta: { changes: Number(st.run(...args).changes) } }) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const stored = new Map(), original = globalThis.caches;
  Object.defineProperty(globalThis, "caches", { configurable: true, value: { default: { match: async (k) => stored.get(k.url) || null, put: async (k, v) => { stored.set(k.url, v); } } } });
  const env = { DB: db, SESSION_SECRET: "test-key", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", GO_BASE: "https://c.m365.fm" };
  const done = () => { if (original === undefined) delete globalThis.caches; else Object.defineProperty(globalThis, "caches", { configurable: true, value: original }); raw.close(); };
  const fetchAs = async (url, headers = {}, method = "GET", e = env) => {
    const waits = [], r = new Request(url, { method, headers: { "cf-connecting-ip": "203.0.113.7", ...headers } });
    Object.defineProperty(r, "cf", { value: { country: "DE" } });
    const res = await worker.fetch(r, e, { waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
    return res;
  };
  return { raw, env, fetchAs, done };
}
const sum = (raw, col) => raw.prepare(`SELECT COALESCE(SUM(${col}),0) n FROM sponsor_clicks_daily`).get().n;

test("c.m365.fm/<code>: zaehlt wie /go/<code>, 302 mit UTM, noindex, ohne Cookie; Bots getrennt gefiltert", async () => {
  const { raw, fetchAs, done } = await setup();
  try {
    const human = { "user-agent": CHROME, ...HUMAN };
    let res = await fetchAs("https://c.m365.fm/acme-home?s=topic", human);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), "https://acme.example/path?x=1&utm_source=m365.fm");
    assert.match(res.headers.get("x-robots-tag"), /noindex/);
    assert.equal(res.headers.get("cache-control"), "no-store");
    assert.equal(res.headers.get("set-cookie"), null);
    assert.equal(sum(raw, "clicks"), 1);
    await fetchAs("https://c.m365.fm/acme-home?s=topic", human);   // gleicher Besucher, gleicher Tag: nicht doppelt
    assert.equal(sum(raw, "clicks"), 1);
    // Link-Scanner (Mail-Vorschau) und Crawler: weiterleiten, aber getrennt zaehlen
    res = await fetchAs("https://c.m365.fm/acme-home?s=newsletter", { "user-agent": "Mozilla/5.0 Proofpoint-URLDefense", "accept-language": "en" });
    assert.equal(res.status, 302);
    await fetchAs("https://c.m365.fm/acme-home?s=newsletter", { "user-agent": "curl/8.0" });
    assert.equal(sum(raw, "clicks"), 1, "Bots erhoehen die echten Klicks nicht");
    assert.equal(sum(raw, "clicks_filtered"), 2);
    // HEAD zaehlt nicht, Vorabruf ist gefiltert
    await fetchAs("https://c.m365.fm/acme-home", human, "HEAD");
    await fetchAs("https://c.m365.fm/acme-home?s=entity", { ...human, "sec-purpose": "prefetch" });
    assert.equal(sum(raw, "clicks"), 1); assert.equal(sum(raw, "clicks_filtered"), 3);
    // nur Tageszaehler: keine Spalte mit IP, Browserkennung oder Besucher-Kennung
    const cols = raw.prepare("PRAGMA table_info(sponsor_clicks_daily)").all().map((c) => c.name);
    assert.deepEqual(cols, ["day", "code", "surface", "country", "clicks", "clicks_filtered"]);
    // alter Weg bleibt gueltig
    res = await fetchAs("https://api-dub.m365.fm/go/acme-home?s=entity", { "user-agent": CHROME, ...HUMAN, "cf-connecting-ip": "198.51.100.9" });
    assert.equal(res.status, 302); assert.equal(sum(raw, "clicks"), 2);
  } finally { done(); }
});

test("c.m365.fm: unbekannte oder abgeschaltete Codes 404, kein offener Redirect, sonst nichts erreichbar", async () => {
  const { raw, fetchAs, done } = await setup();
  try {
    const human = { "user-agent": CHROME, ...HUMAN };
    for (const u of ["https://c.m365.fm/unknown-code", "https://c.m365.fm/acme-off", "https://c.m365.fm/ad-doesnotexist", "https://c.m365.fm/h-evil",
      "https://c.m365.fm/ab", "https://c.m365.fm/ACME-HOME", "https://c.m365.fm/acme-home/extra", "https://c.m365.fm/go/acme-home", "https://c.m365.fm//evil.example.com",
      "https://c.m365.fm/api/me", "https://c.m365.fm/api/providers", "https://c.m365.fm/auth/login/google", "https://c.m365.fm/mcp", "https://c.m365.fm/paypal/webhook"]) {
      const res = await fetchAs(u, human);
      assert.equal(res.status, 404, u);
      assert.equal(res.headers.get("location"), null, u);
      assert.equal(res.headers.get("set-cookie"), null, u);
    }
    assert.equal(await (async () => (await fetchAs("https://c.m365.fm/", human)).headers.get("location"))(), "https://www.m365.fm/");
    const robots = await fetchAs("https://c.m365.fm/robots.txt", human);
    assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");
    // POST an eine bekannte Kurzadresse: 404, nichts gezaehlt
    assert.equal((await fetchAs("https://c.m365.fm/acme-home", human, "POST")).status, 404);
    assert.equal(sum(raw, "clicks") + sum(raw, "clicks_filtered"), 0);
    // Ohne GO_BASE (alte Einstellung) ist c.m365.fm kein Kurzlink-Host
    const old = { DB: {}, SESSION_SECRET: "x", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm" };
    assert.equal((await fetchAs("https://c.m365.fm/acme-home", human, "GET", old)).status, 200, "ohne GO_BASE antwortet der normale Worker-Text");
  } finally { done(); }
});

test("handleSponsorLink: Anzeigen- und Hauscodes laufen auch ueber die Kurzform, mit getrenntem Bot-Zaehler", async () => {
  const { raw, env, done } = await setup();
  try {
    raw.exec(`INSERT INTO orgs(id,handle,name,created) VALUES(1,'contoso','Contoso',1);
      INSERT INTO ad_bookings(code,org_id,user_id,product,page_types,quantity,delivered,start,end,target_url,pay_status,creative_status,status,created,updated)
      VALUES('ad-shortcode01',1,1,'banner_mid','entity',100,0,'2020-01-01','2099-01-01','https://contoso.example.com/x','paid','approved','active',1,1);`);
    raw.exec(`INSERT INTO ad_products(id,kind,slot) VALUES('banner_mid','cpm','mid') ON CONFLICT(id) DO NOTHING`);
    const go = async (code, headers) => {
      const waits = [], r = new Request(`https://c.m365.fm/${code}?s=mid&pt=entity`, { headers: { "cf-connecting-ip": "203.0.113.9", ...headers } });
      const url = new URL(r.url), res = await handleSponsorLink(env, r, url, `/go/${code}`, { waitUntil: (p) => waits.push(p) });
      await Promise.all(waits); return res;
    };
    assert.equal((await go("ad-shortcode01", { "user-agent": CHROME, ...HUMAN })).status, 302);
    assert.equal((await go("ad-shortcode01", { "user-agent": "Mozilla/5.0 Barracuda Sentinel" })).status, 302);
    const s = raw.prepare("SELECT SUM(clicks) c,SUM(clicks_filtered) f FROM ad_stats_daily").get();
    assert.deepEqual([s.c, s.f], [1, 1]);
    assert.equal((await go("h-m365con", { "user-agent": CHROME, ...HUMAN })).status, 302);
    assert.equal((await go("h-m365con", { "user-agent": "Googlebot/2.1" })).status, 302);
    const h = raw.prepare("SELECT SUM(clicks) c,SUM(clicks_filtered) f FROM ad_house_stats WHERE house='m365con'").get();
    assert.deepEqual([h.c, h.f], [1, 1]);
  } finally { done(); }
});

test("Datenschutz: die neuen Tabellen und Spalten enthalten keine Nutzer- oder Personenbezuege", async () => {
  const { raw, done } = await setup();
  try {
    for (const t of ["sponsor_clicks_daily", "ad_stats_daily", "ad_house_stats", "sponsor_queries_daily"]) {
      const cols = raw.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
      assert.ok(!cols.some((c) => /user|ip|agent|email|name|visitor|hash/i.test(c)), `${t}: ${cols}`);
    }
    // deshalb braucht weder mergeStatements noch deleteAccount einen Eintrag
    const src = readFileSync(new URL("../src/identities.js", import.meta.url), "utf8") + readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
    for (const t of ["sponsor_clicks_daily", "ad_stats_daily", "ad_house_stats", "sponsor_queries_daily"]) assert.ok(!src.includes(t), t);
  } finally { done(); }
});
