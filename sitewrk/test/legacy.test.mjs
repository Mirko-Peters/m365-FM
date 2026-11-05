// Weiterleitungen des Site-Workers (MIGRATED=1) gegen die gemeinsame Fallliste legacy_cases.json - dieselbe Liste prueft
// tests/test_site_links.py fuer den Python-Nachbau (site_links.py), mit dem der Seitenbau interne Links direkt auf das Ziel setzt.
import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const FX = JSON.parse(readFileSync(new URL("./legacy_cases.json", import.meta.url), "utf8"));
const store = new Map();
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {   // Ursprung: nur die Weiterleitungstabelle, sonst 404 (wie in der Python-Pruefung: "nichts existiert")
  const u = new URL(typeof req === "string" ? req : req.url);
  if (u.pathname === "/show/redirects.json") return new Response(JSON.stringify(FX.map), { headers: { "content-type": "application/json" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W } = await import("../index.js");
const env = { MIGRATED: "1", PAGES: { get: async () => null } };

test("Weiterleitungen wie in legacy_cases.json (eine Antwort des Workers je Adresse)", async () => {
  for (const [url, want] of FX.cases) {
    const w = []; const res = await W.fetch(new Request(url), env, { waitUntil: (p) => w.push(p) }); await Promise.all(w);
    const got = res.status === 301 ? res.headers.get("location") : null;
    assert.equal(got, want, url);
  }
});
