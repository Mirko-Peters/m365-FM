// Startseite in der Sprache des Browsers (6.11.2026): nur "/" wird umgeleitet (302 auf /<sprache>/), Englisch bleibt, Bots nie, Cookie m365_lang geht vor.
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origin = 0;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {
  const u = new URL(typeof req === "string" ? req : req.url);
  if (u.pathname === "/show/redirects.json") return new Response(JSON.stringify({ "/old-home": "/", "/old-ep": "/show/episodes/x/" }), { headers: { "content-type": "application/json" } });
  origin++;
  if (u.pathname === "/" || u.pathname.endsWith("/")) return new Response("<html>" + u.pathname + "</html>", { headers: { "content-type": "text/html; charset=utf-8", etag: '"e1"' } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, pickLang, homeLang, isBot, langCookie } = await import("../index.js");
const env = { MIGRATED: "1" };
const CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const HTML = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const req = (url, h = {}, method = "GET") => new Request(url.startsWith("http") ? url : "https://www.m365.fm" + url, { method, headers: { "user-agent": CHROME, accept: HTML, ...h } });
const run = async (r) => { const w = []; const res = await W.fetch(r, env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

test("Accept-Language: q-Werte, Reihenfolge, Regionen, nicht unterstuetzte Sprachen", () => {
  assert.equal(pickLang("de-DE,de;q=0.9,en;q=0.8"), "de");
  assert.equal(pickLang("de-AT"), "de");
  assert.equal(pickLang("pt-BR,pt;q=0.9"), "pt");
  assert.equal(pickLang("en;q=0.5,fr;q=0.9"), "fr", "hoeherer q-Wert gewinnt, nicht die Reihenfolge");
  assert.equal(pickLang("fr;q=0.8,de;q=0.8"), "fr", "gleicher q-Wert: Reihenfolge");
  assert.equal(pickLang("zh-CN,zh;q=0.9"), "", "Chinesisch gibt es nicht");
  assert.equal(pickLang("zh-CN,zh;q=0.9,ja;q=0.5"), "ja", "naechste unterstuetzte Sprache");
  assert.equal(pickLang("zh,en-US;q=0.7,de;q=0.3"), "en");
  assert.equal(pickLang("de;q=0,fr"), "fr", "q=0 heisst: nicht gewuenscht");
  assert.equal(pickLang("*"), "");
  assert.equal(pickLang(""), "");
  assert.equal(pickLang("iw-IL"), "he", "alter Code fuer Hebraeisch");
  assert.equal(pickLang("in"), "id", "alter Code fuer Indonesisch");
  assert.equal(pickLang("UK-ua"), "uk");
  assert.equal(pickLang("es_MX"), "es");
  assert.equal(pickLang("de;q=abc,it;q=0.5"), "de", "ungueltiger q-Wert zaehlt wie 1");
});

test("Bots und Programme erkennen", () => {
  for (const ua of ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0 Safari/537.36",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)", "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)", "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)", "Twitterbot/1.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
    "Mozilla/5.0 (compatible; YandexBot/3.0)", "DuckDuckBot/1.1", "WhatsApp/2.23", "Discordbot/2.0", "TelegramBot (like TwitterBot)", "Google-InspectionTool/1.0", "curl/8.4.0", "python-requests/2.31", "", undefined])
    assert.ok(isBot(ua), String(ua));
  for (const ua of [CHROME, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0"])
    assert.ok(!isBot(ua), ua);
});

test("Cookie m365_lang lesen", () => {
  assert.equal(langCookie("a=1; m365_lang=de; b=2"), "de");
  assert.equal(langCookie("m365_lang=en"), "en");
  assert.equal(langCookie("m365_lang=zh"), "", "keine Site-Sprache");
  assert.equal(langCookie("xm365_lang=de"), "");
  assert.equal(langCookie(""), "");
});

test("deutscher Browser auf /: 302 auf /de/, privat, Vary, Query bleibt, ohne Abruf beim Ursprung", async () => {
  const n = origin;
  const r = await run(req("/?utm_source=x", { "accept-language": "de-AT,de;q=0.9,en;q=0.5" }));
  assert.equal(r.status, 302);
  assert.equal(r.headers.get("location"), "https://www.m365.fm/de/?utm_source=x");
  assert.equal(r.headers.get("cache-control"), "private, no-store");
  assert.equal(r.headers.get("vary"), "Accept-Language, Cookie");
  assert.equal(origin, n, "eine englische Startseite aus dem Cache kann so nie bei einem deutschen Browser landen");
  const h = await run(req("/", { "accept-language": "ja" }, "HEAD"));
  assert.equal(h.status, 302); assert.equal(h.headers.get("location"), "https://www.m365.fm/ja/");
});

test("Englisch, unbekannte Sprache, Bot, kein HTML, POST: / bleibt 200 mit Vary", async () => {
  for (const [h, m, why] of [[{ "accept-language": "en-US,en;q=0.9,de;q=0.8" }, "GET", "Englisch zuerst"], [{ "accept-language": "zh-CN" }, "GET", "nicht unterstuetzt"], [{}, "GET", "ohne Accept-Language"],
    [{ "accept-language": "de", "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }, "GET", "Googlebot"],
    [{ "accept-language": "de", accept: "application/json" }, "GET", "kein HTML"], [{ "accept-language": "de" }, "POST", "POST"]]) {
    const r = await run(req("/", h, m));
    assert.equal(r.status, 200, why);
    assert.equal(r.headers.get("vary"), "Accept-Language, Cookie", why);
  }
});

test("Cookie geht vor: en bleibt auf /, fr leitet auch einen deutschen Browser nach /fr/, Bot mit Cookie fr folgt dem Cookie", async () => {
  let r = await run(req("/", { "accept-language": "de", cookie: "m365_lang=en" }));
  assert.equal(r.status, 200);
  r = await run(req("/", { "accept-language": "de", cookie: "theme=dark; m365_lang=fr" }));
  assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/fr/");
  r = await run(req("/", { "accept-language": "de", cookie: "m365_lang=xx" }));
  assert.equal(r.headers.get("location"), "https://www.m365.fm/de/", "ungueltiges Cookie: Browsersprache");
});

test("nur genau /: andere Pfade (auch /de/, /show/, /index.html) bleiben unberuehrt", async () => {
  for (const p of ["/de/", "/fr/podcast/", "/show/", "/index.html", "/community/", "/x/"]) {
    const r = await run(req(p, { "accept-language": "de" }));
    assert.ok(r.status !== 302 && r.status !== 301, p);
    assert.notEqual(r.headers.get("vary"), "Accept-Language, Cookie", p);
  }
});

test("Weiterleitung auf / und alter Host auf /: fuer einen deutschen Browser gleich /de/ (ein Schritt statt zwei)", async () => {
  let r = await run(req("/old-home", { "accept-language": "de" }));
  assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/de/");
  r = await run(req("/old-home"));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/"); assert.equal(r.headers.get("vary"), "Accept-Language, Cookie");
  r = await run(req("https://m365.fm/", { "accept-language": "es-ES" }));
  assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/es/");
  // Wahl per Cookie (Domain=m365.fm) gilt auch auf dem alten Host: Englisch -> www/, gewaehlte Sprache vor der Browsersprache
  r = await run(req("https://m365.fm/", { "accept-language": "de-DE", cookie: "m365_lang=en" }));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/");
  r = await run(req("https://dub.m365.fm/", { "accept-language": "de-DE", cookie: "m365_lang=fr" }));
  assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/fr/");
  r = await run(req("https://dub.m365.fm/", { "accept-language": "es-ES", "user-agent": "Twitterbot/1.0" }));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/");
  r = await run(req("/hi/", { "accept-language": "ko-KR" }));
  assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/ko/", "entfernte Sprache -> Startseite in der Browsersprache");
  r = await run(req("/en/", { "accept-language": "de" }));
  assert.equal(r.headers.get("location"), "https://www.m365.fm/de/", "/en/ gab es nie: wie /");
  r = await run(req("/old-ep", { "accept-language": "de" }));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/show/episodes/x/");
});

test("homeLang direkt", () => {
  const r = (h, m = "GET") => new Request("https://www.m365.fm/", { method: m, headers: { "user-agent": CHROME, accept: HTML, ...h } });
  assert.equal(homeLang(r({ "accept-language": "nl-BE" })), "nl");
  assert.equal(homeLang(r({ "accept-language": "nl-BE" }, "HEAD")), "nl");
  assert.equal(homeLang(r({ "accept-language": "nl-BE" }, "OPTIONS")), "");
  assert.equal(homeLang(r({ "accept-language": "en-GB" })), "");
});
