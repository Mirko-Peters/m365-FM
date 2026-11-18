// Sicherheitspruefung (16.11.2026): JEDE Admin-Route (/api/admin/...) im Quelltext muss Anonymen und normalen Mitgliedern den Zugriff verweigern.
// Die Routen werden aus dem Quelltext gesammelt (neue Routen sind automatisch dabei); geprueft wird mit dem ganzen Worker, einer In-Memory-SQLite
// mit allen Migrationen, einem Mitglied ohne Rolle und einem Admin. Kein 2xx fuer Nicht-Admins; ein 5xx waere ein Fehler vor der Pruefung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { makeSession } from "../src/util.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, batch: async (l) => { for (const s of l) await s.run(); return []; } };
  const now = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (1,'github','member','Mitglied',?),(2,'github','boss','Chef',?)").run(now, now);
  raw.prepare("UPDATE users SET role='admin' WHERE id=2").run();
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "test-secret", ADMIN_SUBS: "", CRON_KEY: "cron-test" };
  return { env, member: `m365s=${await makeSession(env, 1)}`, admin: `m365s=${await makeSession(env, 2)}` };
}

const src = readdirSync(new URL("../src/", import.meta.url)).filter((f) => f.endsWith(".js")).map((f) => readFileSync(new URL("../src/" + f, import.meta.url), "utf-8")).join("\n");
const ROUTES = [...new Set([...src.matchAll(/["'`](\/api\/admin\/[A-Za-z0-9_\-\/]+)/g)].map((m) => m[1].replace(/\/$/, "")))].sort();

test("es gibt Admin-Routen im Quelltext (Sammlung funktioniert)", () => { assert.ok(ROUTES.length >= 40, "gefunden: " + ROUTES.length); });

test("alle Admin-Routen: Anonyme und Mitglieder ohne Rolle bekommen nie 2xx und nie einen Serverfehler", async () => {
  const { env, member } = await setup();
  const bad = [], odd = [];
  for (const route of ROUTES) for (const method of ["GET", "POST", "DELETE"]) for (const who of ["anon", "member"]) {
    const headers = { "x-requested-with": "m365", ...(who === "member" ? { cookie: member } : {}), ...(method === "POST" ? { "content-type": "application/json" } : {}) };
    let res;
    try { res = await worker.fetch(new Request("https://api-dub.m365.fm" + route, { method, headers, body: method === "POST" ? "{}" : undefined }), env, { waitUntil() {} }); }
    catch (e) { bad.push(`${who} ${method} ${route}: Ausnahme ${e.message}`); continue; }
    if (res.status >= 200 && res.status < 300) bad.push(`${who} ${method} ${route}: ${res.status}`);
    else if (res.status >= 500) bad.push(`${who} ${method} ${route}: ${res.status}`);
    else if (![401, 403, 404, 405].includes(res.status)) odd.push(`${who} ${method} ${route}: ${res.status}`);
  }
  if (odd.length) console.log("Hinweis (weder 401, 403, 404 noch 405):\n  " + odd.join("\n  "));
  assert.deepEqual(bad, []);
});

test("Ohne den Kopf x-requested-with lehnt der Worker jede schreibende Anfrage ab (CSRF), auch fuer Admins", async () => {
  const { env, admin } = await setup();
  for (const route of ROUTES.slice(0, 40)) {
    const r = await worker.fetch(new Request("https://api-dub.m365.fm" + route, { method: "POST", headers: { cookie: admin, "content-type": "application/json" }, body: "{}" }), env, { waitUntil() {} });
    assert.equal(r.status, 400, route);
  }
});

test("CORS: eine fremde Seite bekommt nie Erlaubnis mit Cookie, auch nicht auf Admin-Routen", async () => {
  const { env, admin } = await setup();
  for (const origin of ["https://evil.example", "https://www.m365.fm.evil.example", "null", "http://www.m365.fm"]) {
    const r = await worker.fetch(new Request("https://api-dub.m365.fm/api/admin/panel/overview", { headers: { origin, cookie: admin, "x-requested-with": "m365" } }), env, { waitUntil() {} });
    assert.equal(r.headers.get("access-control-allow-origin"), null, origin);
    assert.equal(r.headers.get("access-control-allow-credentials"), null, origin);
  }
});
