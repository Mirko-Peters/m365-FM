// Spreaker verbinden ueber den Worker (spreaker_connect.js): Fernet exakt wie spreaker_auth.py (cryptography.fernet), Route nur fuer Admins,
// Klartext-Token nie in der Antwort, in Staging gesperrt, Start-Link mit state=spreaker.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession } from "../src/util.js";
import { fernetEncrypt, fernetDecrypt, spreakerKey, handleSpreakerExchange, cleanDetail, SPREAKER_TOKEN_URL } from "../src/spreaker_connect.js";
import { STAGING_STRIPPED } from "../src/staging.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const CID = "test-client-id-42", SECRET = "test-client-secret-123";

// Testvektor aus Python (cryptography 50, Fernet(urlsafe_b64encode(sha256(b"m365dub|test-client-secret-123"))) ._encrypt_from_parts(pt, 1700000000, bytes(range(16))))
const PY_PLAIN = '{"access_token": "AT-test-vector", "refresh_token": "RT-test-vector", "at": 1700000000}';
const PY_TOKEN = "gAAAAABlU_EAAAECAwQFBgcICQoLDA0ODywDCi_dL05tofb4b7vSyM4042N-ayDrg3fW7OUM3TC3jmal8S5cQZAwyFo-UHhEQUoPekycRbFpCRtH3sQ8O9nt_oS7Hjqb94GLH3-acX4xY8mgmFNVUdEezwQQ5jnwP6oAgdJrvkVJmRd11d2Q7awT79uk6K1oJtczjz6IyO5H";

test("Fernet: Python-Testvektor ist in JS entschluesselbar", async () => {
  const key = await spreakerKey(SECRET);
  assert.equal(await fernetDecrypt(key, PY_TOKEN), PY_PLAIN);
});

test("Fernet: JS erzeugt bei gleicher Zeit und gleichem IV byte-gleich den Python-Text", async () => {
  const key = await spreakerKey(SECRET);
  const iv = new Uint8Array([...Array(16).keys()]);
  assert.equal(await fernetEncrypt(key, PY_PLAIN, { now: 1700000000, iv }), PY_TOKEN);
});

test("Fernet: Rundweg, Format (0x80, Zeit, Padding) und Manipulation", async () => {
  const key = await spreakerKey(SECRET);
  const t = await fernetEncrypt(key, "hallo");
  assert.match(t, /^gAAAAA[A-Za-z0-9_-]+=*$/);
  assert.equal(t.length % 4, 0, "base64url mit Padding");
  assert.equal(await fernetDecrypt(key, t), "hallo");
  await assert.rejects(fernetDecrypt(await spreakerKey("anderes-secret"), t), /signature/);
  const bad = t.slice(0, 40) + (t[40] === "A" ? "B" : "A") + t.slice(41);
  await assert.rejects(fernetDecrypt(key, bad));
});

test("cleanDetail: kurz, ohne Secret, Code und Token", () => {
  const d = cleanDetail(`bad ${SECRET} code=abc123 "access_token":"xyz" ` + "x".repeat(400), [SECRET, "abc123"]);
  assert.ok(!d.includes(SECRET) && !d.includes("abc123") && !d.includes("xyz"));
  assert.ok(d.length <= 200);
});

// ---------- Route ueber den echten Worker-Eingang ----------
async function mk(extra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (l) => { const out = []; for (const s of l) out.push(await s.run()); return out; },
  };
  for (const [id, role] of [[1, "admin"], [2, "user"]]) raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, "U" + id, role);
  return { raw, env: { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, SPREAKER_CLIENT_ID: CID, SPREAKER_CLIENT_SECRET: SECRET, ...extra } };
}

let calls = [], reply = () => new Response(JSON.stringify({ access_token: "AT-live-secret", refresh_token: "RT-live-secret", token_type: "Bearer", expires_in: 3600 }), { headers: { "content-type": "application/json" } });
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const u = String(input?.url || input);
  if (u === SPREAKER_TOKEN_URL) { calls.push({ url: u, init }); return reply(); }
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};

async function call(env, uid, method, path, body, headers = {}) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}), ...headers };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined, redirect: "manual" }), env, { waitUntil() {} });
  const text = await r.text();
  let j = null; try { j = JSON.parse(text); } catch { /* HTML */ }
  return { s: r.status, j, text, h: r.headers };
}

test("exchange: ohne Anmeldung 401, ohne Admin 403, ohne x-requested-with 400 - Spreaker wird nie gefragt", async () => {
  const { env } = await mk(); calls = [];
  assert.equal((await call(env, 0, "POST", "/api/admin/spreaker-exchange", { code: "abc123" })).s, 401);
  const r = await call(env, 2, "POST", "/api/admin/spreaker-exchange", { code: "abc123" });
  assert.equal(r.s, 403); assert.equal(r.j.error, "forbidden");
  assert.equal((await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "abc123" }, { "x-requested-with": "" })).s, 400);
  assert.equal((await call(env, 1, "GET", "/api/admin/spreaker-exchange")).s, 405);
  assert.equal(calls.length, 0);
});

test("exchange: Admin bekommt nur {enc}; Klartext-Token nicht in der Antwort; enc entschluesselt die Tokens", async () => {
  const { env, raw } = await mk(); calls = [];
  const r = await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "https://www.m365.fm/callback?code=abc123XYZ&state=spreaker" });
  assert.equal(r.s, 200);
  assert.deepEqual(Object.keys(r.j), ["enc"]);
  assert.ok(!r.text.includes("AT-live-secret") && !r.text.includes("RT-live-secret") && !r.text.includes(SECRET));
  assert.equal(r.h.get("cache-control"), "no-store");
  assert.equal(r.h.get("access-control-allow-origin"), SITE);
  const d = JSON.parse(await fernetDecrypt(await spreakerKey(SECRET), r.j.enc));
  assert.equal(d.access_token, "AT-live-secret"); assert.equal(d.refresh_token, "RT-live-secret");
  assert.ok(Math.abs(d.at - Date.now() / 1000) < 60);
  assert.equal(calls.length, 1);
  const sent = new URLSearchParams(calls[0].init.body);
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["content-type"], "application/x-www-form-urlencoded");
  assert.deepEqual(Object.fromEntries(sent), { grant_type: "authorization_code", redirect_uri: "https://www.m365.fm/callback", client_id: CID, client_secret: SECRET, code: "abc123XYZ" });
  const a = raw.prepare("SELECT action,detail FROM audit").all().map((x) => ({ ...x }));
  assert.deepEqual(a, [{ action: "spreaker-connect", detail: "ok" }]);
});

test("exchange: Spreaker-Fehler als {error, detail} (400 bzw. 502), ohne Geheimnisse", async () => {
  const { env } = await mk();
  reply = () => new Response(JSON.stringify({ error: "invalid_grant", error_description: `The authorization code has expired (client ${SECRET})` }), { status: 400 });
  let r = await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "abc123" });
  assert.equal(r.s, 400); assert.equal(r.j.error, "invalid_grant");
  assert.match(r.j.detail, /expired/); assert.ok(!r.text.includes(SECRET));
  reply = () => new Response("<html>bad gateway</html>", { status: 503 });
  r = await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "abc123" });
  assert.equal(r.s, 502); assert.equal(r.j.error, "spreaker_503");
  reply = () => new Response(JSON.stringify({ access_token: "AT-only" }), { status: 200 });
  r = await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "abc123" });
  assert.equal(r.s, 502); assert.equal(r.j.error, "no_refresh_token"); assert.ok(!r.text.includes("AT-only"));
  assert.equal((await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "<script>" })).j.error, "bad_code");
  reply = () => new Response(JSON.stringify({ access_token: "AT-live-secret", refresh_token: "RT-live-secret" }));
});

test("exchange: ohne Client-Zugang 503, per MCP-Token nie", async () => {
  const { env } = await mk({ SPREAKER_CLIENT_SECRET: "" });
  assert.equal((await call(env, 1, "POST", "/api/admin/spreaker-exchange", { code: "abc123" })).j.error, "not_configured");
  const J = (d, s) => new Response(JSON.stringify(d), { status: s });
  const req = new Request(API + "/api/admin/spreaker-exchange", { method: "POST", body: '{"code":"abc123"}' });
  assert.equal((await handleSpreakerExchange((await mk()).env, req, { id: 1, admin: true }, J, true)).status, 403);
});

test("exchange und Start in Staging gesperrt, Client-Zugang dort gar nicht sichtbar", async () => {
  assert.ok(STAGING_STRIPPED.includes("SPREAKER_CLIENT_ID") && STAGING_STRIPPED.includes("SPREAKER_CLIENT_SECRET"));
  const { env } = await mk({ ENVIRONMENT: "staging" }); calls = [];
  const J = (d, s) => new Response(JSON.stringify(d), { status: s });
  const req = new Request(API + "/api/admin/spreaker-exchange", { method: "POST", body: '{"code":"abc123"}' });
  const r = await handleSpreakerExchange(env, req, { id: 1, admin: true }, J);
  assert.equal(r.status, 403); assert.equal((await r.json()).error, "staging");
  assert.equal(calls.length, 0);
});

test("/auth/spreaker/start: nur Admin, leitet mit state=spreaker auf Spreaker", async () => {
  const { env } = await mk();
  assert.equal((await call(env, 0, "GET", "/auth/spreaker/start")).s, 403);
  assert.equal((await call(env, 2, "GET", "/auth/spreaker/start")).s, 403);
  const r = await call(env, 1, "GET", "/auth/spreaker/start");
  assert.equal(r.s, 302);
  const u = new URL(r.h.get("location"));
  assert.equal(u.origin + u.pathname, "https://www.spreaker.com/oauth2/authorize");
  assert.deepEqual(Object.fromEntries(u.searchParams), { client_id: CID, response_type: "code", scope: "basic", state: "spreaker", redirect_uri: "https://www.m365.fm/callback" });
  assert.ok(!r.h.get("location").includes(SECRET));
  assert.equal((await call((await mk({ ENVIRONMENT: "staging" })).env, 1, "GET", "/auth/spreaker/start")).s, 403);   // index.js-Handler direkt: auch ohne stagingEnv gesperrt
});
