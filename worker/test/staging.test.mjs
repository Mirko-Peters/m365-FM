// Testumgebung (ENVIRONMENT=staging, src/staging.js): nichts wirkt nach aussen - kein Mail, keine KI, kein LinkedIn/Spreaker/YouTube/Maps, kein Push,
// keine echte Zahlung, keine Crons, keine Live-API. Auf dem Live-Worker (ohne ENVIRONMENT) aendert sich nichts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { isStaging, stagingEnv, STAGING_STRIPPED, blockedHost, BLOCKED_HOSTS, installFetchGuard, StagingBlocked, stagingResponse, ROBOTS_DISALLOW } from "../src/staging.js";
import { sendMail, mailReady } from "../src/mailer.js";
import { anthropicFetch } from "../src/util.js";

async function d1() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  return {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    batch: async (list) => { const out = []; for (const s of list) out.push(await s.run()); return out; },
    exec: async (sql) => raw.exec(sql),
  };
}

const STAGING = { ENVIRONMENT: "staging", SITE: "https://staging.m365.fm", API: "https://api-staging.m365.fm", SESSION_SECRET: "test-secret-0123456789" };
const ctx = { waitUntil() {} };

test("isStaging nur bei ENVIRONMENT=staging", () => {
  assert.ok(isStaging({ ENVIRONMENT: "staging" }));
  assert.ok(!isStaging({}) && !isStaging({ ENVIRONMENT: "production" }) && !isStaging(null));
});

test("stagingEnv: gesperrte Secrets und Bindungen sind weg, DB bleibt, Zahlung und Werbung erzwungen", () => {
  const DB = { marker: 1 };
  const env = { ...STAGING, DB, EMAIL: {}, AI: {}, VEC: {}, RESEND_API_KEY: "r", ANTHROPIC_API_KEY: "a", CF_AIG_TOKEN: "c", SPREAKER_TOKEN: "s", YT_REFRESH_TOKEN: "y",
    LINKEDIN_CLIENT_ID: "l", HEYSUMMIT_API_KEY: "h", GOOGLE_MAPS_API_KEY: "m", VAPID_PRIVATE_JWK: "v", PAYPAL_ENV: "live", ADS_BOOKING: "1", GOOGLE_CLIENT_ID: "login-ok" };
  const e = stagingEnv(env);
  for (const k of STAGING_STRIPPED) assert.equal(e[k], undefined, k + " muss in Staging fehlen");
  assert.equal(e.DB, DB, "D1 bleibt");
  assert.equal(e.SESSION_SECRET, env.SESSION_SECRET);
  assert.equal(e.GOOGLE_CLIENT_ID, "login-ok", "Anmeldung (nur Identitaet lesen) bleibt moeglich");
  assert.equal(e.PAYPAL_ENV, "sandbox");
  assert.equal(e.ADS_BOOKING, "0");
  assert.equal(env.RESEND_API_KEY, "r", "die echte env bleibt unveraendert");
});

test("blockedHost: Dienste mit Wirkung nach aussen gesperrt, Lesen und Anmelden nicht", () => {
  for (const h of ["api.resend.com", "api.anthropic.com", "gateway.ai.cloudflare.com", "api.spreaker.com", "api.linkedin.com", "www.linkedin.com", "www.googleapis.com",
    "maps.googleapis.com", "fcm.googleapis.com", "api.heysummit.com", "api-m.paypal.com", "updates.push.services.mozilla.com", "web.push.apple.com",
    "db5p.notify.windows.com", "API.RESEND.COM", "api-dub.m365.fm"]) assert.ok(blockedHost(h), h);
  for (const h of ["api-m.sandbox.paypal.com", "oauth2.googleapis.com", "openidconnect.googleapis.com", "login.microsoftonline.com", "graph.microsoft.com", "github.com",
    "api.github.com", "challenges.cloudflare.com", "staging.m365.fm", "api-staging.m365.fm", "www.m365.fm", "img.m365.fm", "www.youtube.com", "notify.windows.com.evil.example"]) assert.ok(!blockedHost(h), h);
});

test("fetch-Schutz: gesperrter Host wirft, bevor das Netz erreicht wird; anderes geht durch; zweimal installieren schadet nicht", async () => {
  const seen = [];
  const scope = { fetch: async (u) => { seen.push(String(u.url || u)); return new Response("ok"); } };
  assert.equal(installFetchGuard(scope), true);
  const guarded = scope.fetch;
  assert.equal(installFetchGuard(scope), true);
  assert.equal(scope.fetch, guarded, "nicht doppelt umwickelt");
  await assert.rejects(() => scope.fetch("https://api.resend.com/emails", { method: "POST" }), (e) => e instanceof StagingBlocked && e.code === "staging_blocked");
  await assert.rejects(() => scope.fetch(new Request("https://api.spreaker.com/v2/me")), StagingBlocked);
  await assert.rejects(() => scope.fetch(new URL("https://api-dub.m365.fm/api/health")), StagingBlocked);
  assert.deepEqual(seen, []);
  assert.equal(await (await scope.fetch("https://staging.m365.fm/entities.json")).text(), "ok");
  assert.deepEqual(seen, ["https://staging.m365.fm/entities.json"]);
  assert.equal(installFetchGuard({}), false, "ohne fetch kein Schutz");
});

test("Mail: in Staging nie senden und nie bereit, auch mit gesetztem Schluessel und Bindung", async () => {
  let called = 0;
  const env = { ...STAGING, EMAIL: { send: async () => { called++; return {}; } }, RESEND_API_KEY: "key", MAIL_FROM: "M365.FM <system@m365.fm>" };
  const old = globalThis.fetch; globalThis.fetch = async () => { called++; return new Response("{}"); };
  const oldLog = console.log; console.log = () => {};
  try {
    assert.equal(mailReady(env), false);
    const r = await sendMail(env, { to: "a@example.org", subject: "s", html: "<p>x</p>" });
    assert.deepEqual(r, { ok: false, status: 0, suppressed: "staging" });
    assert.equal(called, 0);
    assert.equal(mailReady({ EMAIL: {}, RESEND_API_KEY: "k" }), true, "live unveraendert");
  } finally { globalThis.fetch = old; console.log = oldLog; }
});

test("KI: anthropicFetch wirft in Staging vor Budget und Netz", async () => {
  let called = 0;
  const old = globalThis.fetch; globalThis.fetch = async () => { called++; return new Response("{}"); };
  try {
    await assert.rejects(() => anthropicFetch({ ...STAGING, DB: { prepare() { called++; throw new Error("kein DB-Zugriff"); } }, ANTHROPIC_API_KEY: "k" }, { model: "claude-haiku-5-5", messages: [] }, { job: "t" }),
      (e) => e.code === "staging_ai_off");
    assert.equal(called, 0);
  } finally { globalThis.fetch = old; }
});

test("Worker in Staging: robots.txt sperrt alles, jede Antwort noindex/nofollow, Health und leerer Events-Export gehen", async () => {
  const old = globalThis.fetch; const oldGuard = globalThis.__stagingFetchGuard;
  try {
    const env = { ...STAGING, DB: await d1() };
    let r = await W.fetch(new Request("https://api-staging.m365.fm/robots.txt"), env, ctx);
    assert.equal(r.status, 200); assert.equal(await r.text(), ROBOTS_DISALLOW);
    assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
    r = await W.fetch(new Request("https://api-staging.m365.fm/api/health"), env, ctx);
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true });
    assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow"); assert.equal(r.headers.get("x-m365-environment"), "staging");
    r = await W.fetch(new Request("https://api-staging.m365.fm/api/events/export"), env, ctx);
    assert.equal(r.status, 200, "leere Staging-Datenbank liefert eine leere Liste, keinen Fehler");
    assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
    const body = await r.json(); assert.ok(body && typeof body === "object");
    r = await W.fetch(new Request("https://api-staging.m365.fm/gibt-es-nicht"), env, ctx);
    assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
  } finally { globalThis.fetch = old; globalThis.__stagingFetchGuard = oldGuard; }
});

test("Worker in Staging: nach dem ersten Aufruf ist der fetch-Schutz aktiv", async () => {
  const old = globalThis.fetch; const oldGuard = globalThis.__stagingFetchGuard;
  try {
    delete globalThis.__stagingFetchGuard;
    globalThis.fetch = async () => new Response("ok");
    await W.fetch(new Request("https://api-staging.m365.fm/api/health"), { ...STAGING, DB: await d1() }, ctx);
    assert.equal(globalThis.__stagingFetchGuard, true);
    await assert.rejects(() => fetch("https://api.resend.com/emails"), StagingBlocked);
  } finally { globalThis.fetch = old; globalThis.__stagingFetchGuard = oldGuard; }
});

test("Worker in Staging: ohne fetch-Schutz keine Antwort (503), nichts laeuft ungeschuetzt", async () => {
  const old = globalThis.fetch; const oldGuard = globalThis.__stagingFetchGuard;
  try {
    delete globalThis.__stagingFetchGuard; globalThis.fetch = undefined;
    const r = await W.fetch(new Request("https://api-staging.m365.fm/api/health"), { ...STAGING, DB: await d1() }, ctx);
    assert.equal(r.status, 503); assert.equal((await r.json()).error, "staging_guard_failed");
  } finally { globalThis.fetch = old; globalThis.__stagingFetchGuard = oldGuard; }
});

test("Cron in Staging: nichts wird ausgefuehrt, kein Datenbankzugriff", async () => {
  const boom = new Proxy({}, { get() { throw new Error("Zugriff auf env in Staging-Cron"); } });
  const env = new Proxy({ ENVIRONMENT: "staging" }, { get: (t, k) => (k === "ENVIRONMENT" ? "staging" : boom[k]) });
  for (const cron of ["0 6 * * *", "*/30 * * * *", "*/15 * * * *"]) {
    const oldLog = console.log; console.log = () => {};
    try { await W.scheduled({ cron, scheduledTime: Date.now() }, env, ctx); } finally { console.log = oldLog; }
  }
});

test("Live (ohne ENVIRONMENT) bleibt unveraendert: eigene robots.txt, kein noindex-Header", async () => {
  const r = await W.fetch(new Request("https://api-dub.m365.fm/robots.txt"), { SITE: "https://www.m365.fm", DB: await d1() }, ctx);
  assert.equal(await r.text(), "User-agent: *\nDisallow: /go/\n");
  assert.equal(r.headers.get("x-robots-tag"), null);
  assert.equal(r.headers.get("x-m365-environment"), null);
});

test("stagingResponse: wandelt auch unveraenderliche Antworten", () => {
  const res = stagingResponse(Response.redirect("https://staging.m365.fm/x", 302));
  assert.equal(res.status, 302); assert.equal(res.headers.get("x-robots-tag"), "noindex, nofollow");
});

// Neue Abrufe nach aussen duerfen nicht unbemerkt an Staging vorbeigehen: jeder Host im Quelltext ist hier entweder gesperrt oder bewusst erlaubt.
test("jeder Host im Quelltext des Workers ist klassifiziert (gesperrt oder erlaubt)", () => {
  const ALLOWED = new Set([
    // eigene Adressen
    "www.m365.fm", "m365.fm", "img.m365.fm", "dedupe.m365.fm", "m365.show", "m365con.net", "www.m365con.net", "de.m365con.net", "2026.m365con.net",
    // Anmeldung: liest nur eine Identitaet
    "accounts.google.com", "oauth2.googleapis.com", "openidconnect.googleapis.com", "login.microsoftonline.com", "graph.microsoft.com", "github.com", "api.github.com",
    "raw.githubusercontent.com", "challenges.cloudflare.com", "api-m.sandbox.paypal.com",
    // nur Links in Texten und Seiten / lesende Quellen
    "www.youtube.com", "m.youtube.com", "music.youtube.com", "studio.youtube.com", "youtu.be", "youtube.com", "www.spreaker.com", "spreaker.com", "www.microsoft.com",
    "mvp.microsoft.com", "learn.microsoft.com", "powerbi.microsoft.com", "blog.fabric.microsoft.com", "sessionize.com", "www.meetup.com", "communitydays.org", "bsky.app",
    "www.powershellgallery.com", "www.nuget.org", "azuresearch-usnc.nuget.org", "www.npmjs.com", "registry.npmjs.org", "api.stackexchange.com",
    // Platzhalter im Quelltext
    "x", "url", "host", "..", "...", "bild.jpg",
  ]);
  const dir = new URL("../src/", import.meta.url);
  const unknown = new Map();
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "staging.js")) {
    const src = readFileSync(new URL(f, dir), "utf-8");
    for (const m of src.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
      const h = m[1].toLowerCase().replace(/\.$/, "");
      if (!blockedHost(h) && !ALLOWED.has(h)) unknown.set(h, [...(unknown.get(h) || []), f]);
    }
  }
  assert.deepEqual([...unknown.entries()], [], "Neuer Host im Worker-Quelltext: in BLOCKED_HOSTS (src/staging.js) aufnehmen, wenn er sendet/schreibt/kostet, sonst hier als erlaubt eintragen");
  for (const h of BLOCKED_HOSTS) assert.ok(blockedHost(h.replace("*.", "x.")), h);
});
