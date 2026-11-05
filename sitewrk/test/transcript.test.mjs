// #266: Transkript-Dateien je Folge aus dem R2-Bucket - noindex, Content-Type mit UTF-8, CORS *; auch mit R2 als Ursprung (R2_PRIMARY=1)
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origins = 0;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") return new Response("b1\n", { headers: { "content-type": "text/plain" } });
  origins++;
  if (u.pathname === "/show/transcripts.txt") return new Response("[en] A — https://www.m365.fm/show/episodes/a/transcript.txt\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
  if (u.pathname === "/show/transcripts.json") return new Response("{}", { headers: { "content-type": "application/json; charset=utf-8" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, TRANSCRIPT, __resetR2Ready } = await import("../index.js");
const UP = new Date("2026-11-05T08:00:00Z");
const obj = (body, ct, meta = {}) => ({ httpEtag: '"t1"', uploaded: UP, httpMetadata: ct ? { contentType: ct } : {}, customMetadata: meta, arrayBuffer: async () => new TextEncoder().encode(body).buffer, text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/show/episodes/copilot-agents/transcript.txt": obj("Hallo Welt.\n", "text/plain; charset=utf-8"),
  "pages/show/episodes/copilot-agents/transcript.vtt": obj("WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHallo\n", "application/octet-stream"),
  "pages/de/copilot-agenten-ki-synchronfassung/transcript.vtt": obj("WEBVTT\n\nde\n", "text/vtt; charset=utf-8"),
  "pages/ja/show/episodes/copilot-agents/transcript.txt": obj("こんにちは\n", ""),
  "pages/show/episodes/weg/transcript.txt": obj("alt\n", "text/plain; charset=utf-8", { gone: "1" }),
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
};
let gets = 0;
const PAGES = { get: async (k) => { gets++; return B[k] || null; } };
const env = { PAGES, MIGRATED: "1", CONSENT_COUNTRIES: "DE" };
const req = (path, h = {}, method = "GET") => new Request("https://www.m365.fm" + path, { headers: h, method });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const hdr = (res, ct) => {
  assert.equal(res.headers.get("content-type"), ct); assert.equal(res.headers.get("x-robots-tag"), "noindex");
  assert.equal(res.headers.get("access-control-allow-origin"), "*"); assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-m365-cr"), null, "keine HTML-Behandlung (Region)");
};

test("Regel: Hauptshow, Dub-Folge und Sprachfassung; Index und andere Dateien nicht", () => {
  for (const p of ["/show/episodes/a-b-1/transcript.txt", "/show/episodes/a/transcript.vtt", "/de/slug-x/transcript.vtt", "/ja/show/episodes/a/transcript.txt"]) assert.ok(TRANSCRIPT.test(p), p);
  for (const p of ["/show/transcripts.txt", "/llms.txt", "/show/episodes/a/transcript.json", "/show/episodes/A/transcript.txt", "/show/episodes/a/transcript.txt/", "/deu/show/episodes/a/transcript.txt"]) assert.ok(!TRANSCRIPT.test(p), p);
});
test("R2-Rueckfall nach 404 bei GitHub Pages: Header je Typ, Body, HEAD, 304", async () => {
  store.clear();
  const t = await run(req("/show/episodes/copilot-agents/transcript.txt")); assert.equal(t.status, 200); hdr(t, "text/plain; charset=utf-8"); assert.equal(await t.text(), "Hallo Welt.\n");
  assert.equal(t.headers.get("etag"), '"t1"'); assert.equal(t.headers.get("last-modified"), UP.toUTCString());
  const v = await run(req("/show/episodes/copilot-agents/transcript.vtt")); hdr(v, "text/vtt; charset=utf-8"); assert.match(await v.text(), /^WEBVTT/);
  const d = await run(req("/de/copilot-agenten-ki-synchronfassung/transcript.vtt")); assert.equal(d.status, 200); hdr(d, "text/vtt; charset=utf-8");
  const j = await run(req("/ja/show/episodes/copilot-agents/transcript.txt")); hdr(j, "text/plain; charset=utf-8"); assert.equal(await j.text(), "こんにちは\n");
  const h = await run(req("/show/episodes/copilot-agents/transcript.txt", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); hdr(h, "text/plain; charset=utf-8");
  const n = await run(req("/show/episodes/copilot-agents/transcript.txt", { "if-none-match": '"t1"' })); assert.equal(n.status, 304);
});
test("fehlt oder als entfernt markiert -> 404 (keine Weiterleitung auf die englische Folge)", async () => {
  store.clear();
  const m = await run(req("/show/episodes/gibt-es-nicht/transcript.txt")); assert.equal(m.status, 404);
  const g = await run(req("/show/episodes/weg/transcript.txt")); assert.equal(g.status, 404);
  const l = await run(req("/fr/show/episodes/gibt-es-nicht/transcript.vtt")); assert.equal(l.status, 404);
});
test("Index: transcripts.txt bleibt sichtbar (kein noindex), transcripts.json ist noindex", async () => {
  const t = await run(req("/show/transcripts.txt")); assert.equal(t.status, 200); assert.equal(t.headers.get("x-robots-tag"), null);
  const j = await run(req("/show/transcripts.json")); assert.equal(j.headers.get("x-robots-tag"), "noindex");
});
test("R2 als Ursprung: Content-Type nach Endung (auch bei octet-stream in den Metadaten), noindex, CORS, ohne Abruf bei GitHub Pages", async () => {
  store.clear(); __resetR2Ready();
  const e2 = { ...env, R2_PRIMARY: "1" };
  await run(req("/x/"), e2); await new Promise((r) => setTimeout(r, 10));   // Bau-Kennung im Hintergrund pruefen
  origins = 0;
  const v = await run(req("/show/episodes/copilot-agents/transcript.vtt"), e2);
  assert.equal(v.status, 200); assert.equal(v.headers.get("x-m365-src"), "r2"); hdr(v, "text/vtt; charset=utf-8");
  assert.equal(origins, 0, "kein Abruf bei GitHub Pages");
  const t = await run(req("/de/copilot-agenten-ki-synchronfassung/transcript.vtt", {}, "HEAD"), e2); assert.equal(t.status, 200); assert.equal(t.headers.get("x-m365-src"), "r2"); hdr(t, "text/vtt; charset=utf-8");
});
