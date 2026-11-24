// Zertifikat: E-Mail aus der Anmeldung (Entscheidung Mirko 24.11.2026). Zusatzschritt /auth/login/<anbieter>?purpose=certmail -> Callback speichert nur die
// vom Anbieter bestaetigte E-Mail in learn_certs (draft); kein Login-Wechsel, kein Verknuepfen, keine Kontoerstellung. Die Anbieter sind gemockt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { makeSession } from "../src/util.js";
import { deleteUserLearn, MS_PERSONAL_TID, maskEmail, CERTMAIL_SCOPE } from "../src/learnquiz.js";

const PATH = "manufacturing-excellence";
const RET = "https://www.m365.fm/de/learn/path/manufacturing-excellence/test/";
const CLIENTS = { GOOGLE_CLIENT_ID: "g-client", GOOGLE_CLIENT_SECRET: "g-secret", MS_CLIENT_ID: "ms-client", MS_CLIENT_SECRET: "ms-secret",
  LINKEDIN_CLIENT_ID: "li-client", LINKEDIN_CLIENT_SECRET: "li-secret", GH_OAUTH_CLIENT_ID: "gh-client", GH_OAUTH_CLIENT_SECRET: "gh-secret" };

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, batch: async (l) => { for (const s of l) await s.run(); return []; } };
  const t = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (1,'google','g-ada','Ada L.',?),(2,'google','g-bob','Bob',?)").run(t, t);
  const ids = raw.prepare("INSERT INTO user_identities(user_id,provider,sub,created) VALUES (?,?,?,?)");
  for (const [u, p, s] of [[1, "google", "g-ada"], [1, "microsoft", "ms-ada"], [1, "linkedin", "li-ada"], [1, "github", "1001"], [2, "google", "g-bob"]]) ids.run(u, p, s, t);
  raw.prepare("INSERT INTO learn_attempts(id,user_id,path,lang,qids,started,finished,score,total,passed) VALUES ('att-ada-1',1,?,'de','[]',?,?,27,30,1)").run(PATH, t - 100, t - 50);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "test-secret", ADMIN_SUBS: "", CERTOPUS_ON: "0", ...CLIENTS };
  const s = { ada: `m365s=${await makeSession(env, 1)}`, bob: `m365s=${await makeSession(env, 2)}` };
  return { env, raw, s, counts: () => ({ users: raw.prepare("SELECT COUNT(*) n FROM users").get().n, ids: raw.prepare("SELECT COUNT(*) n FROM user_identities").get().n }) };
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const idToken = (claims) => `${b64({ alg: "RS256", typ: "JWT" })}.${b64(claims)}.c2ln`;
const TOKEN_URL = { google: "https://oauth2.googleapis.com/token", microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  linkedin: "https://www.linkedin.com/oauth/v2/accessToken", github: "https://github.com/login/oauth/access_token" };
const INFO_URL = { google: "https://openidconnect.googleapis.com/v1/userinfo", microsoft: "https://graph.microsoft.com/oidc/userinfo",
  linkedin: "https://api.linkedin.com/v2/userinfo", github: "https://api.github.com/user" };

// Anbieter-Mock: token (mit optionalem id_token), userinfo, GitHub /user/emails. calls merkt sich jeden Abruf.
function mockProvider(provider, { info, idClaims, emails, emailsStatus = 200 }) {
  const calls = [], old = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url), h = new Headers(init.headers || {}); calls.push({ u, h });
    if (u === TOKEN_URL[provider]) return Response.json({ access_token: "AT-secret-123", token_type: "bearer", ...(idClaims ? { id_token: idToken(idClaims) } : {}) });
    if (u === INFO_URL[provider]) { assert.equal(h.get("authorization"), "Bearer AT-secret-123"); return Response.json(info); }
    if (u === "https://api.github.com/user/emails") {
      assert.equal(h.get("authorization"), "Bearer AT-secret-123"); assert.equal(h.get("user-agent"), "m365fm");
      return Response.json(emails || [], { status: emailsStatus });
    }
    throw new Error("unerwarteter Abruf " + u);
  };
  return { calls, restore: () => { globalThis.fetch = old; } };
}

const startCM = (env, cookie, provider, { path = PATH, ret = RET } = {}) =>
  worker.fetch(new Request(`https://api-dub.m365.fm/auth/login/${provider}?purpose=certmail&path=${path}&return=${encodeURIComponent(ret)}`, { headers: cookie ? { cookie } : {} }), env);

// Start mit Sitzung, dann Callback (Cookie: Sitzung + state). -> {r, status (certmail=), loc}
async function flow(env, cookie, provider, mock, { cbCookie, code = "the-code" } = {}) {
  const st = await startCM(env, cookie, provider);
  assert.equal(st.status, 302);
  const loc = new URL(st.headers.get("location"));
  assert.notEqual(loc.origin, "https://www.m365.fm", "Start leitet zum Anbieter: " + loc.href);
  const ck = /m365o=([^;]+)/.exec(st.headers.get("set-cookie"))[1];
  const m = mockProvider(provider, mock);
  try {
    const q = new URLSearchParams({ state: loc.searchParams.get("state"), ...(code ? { code } : { error: "access_denied" }) });
    const r = await worker.fetch(new Request(`https://api-dub.m365.fm/auth/callback/${provider}?${q}`, { headers: { cookie: `${cbCookie ?? cookie}; m365o=${ck}` } }), env);
    const back = new URL(r.headers.get("location") || "https://x/");
    return { r, status: back.searchParams.get("certmail"), back, calls: m.calls, scope: loc.searchParams.get("scope") };
  } finally { m.restore(); }
}
const row = (raw, uid = 1) => { const x = raw.prepare("SELECT email,email_src,status,email_at,name,attempt_id FROM learn_certs WHERE user_id=? AND path=?").get(uid, PATH); return x ? { ...x } : null; };
const noLogin = (r) => assert.ok(!/m365s=/.test(r.headers.get("set-cookie") || ""), "kein Login-Wechsel (keine neue Sitzung)");

test("Start: Scopes nur fuer den Zusatzschritt, normale Anmeldung unveraendert; ohne Sitzung oder ohne verknuepften Anbieter kein OAuth", async () => {
  const { env, s } = await setup();
  const want = { google: "openid email", microsoft: "openid email", linkedin: "openid profile email", github: "read:user user:email" };
  assert.deepEqual(CERTMAIL_SCOPE, want);
  const normal = { google: "openid profile", microsoft: "openid profile", linkedin: "openid profile email", github: "read:user" };
  for (const p of Object.keys(want)) {
    const r = await startCM(env, s.ada, p);
    assert.equal(r.status, 302, p);
    const loc = new URL(r.headers.get("location"));
    assert.equal(loc.searchParams.get("scope"), want[p], p);
    assert.equal(loc.searchParams.get("redirect_uri"), `https://api-dub.m365.fm/auth/callback/${p}`, "keine neue Redirect-URI");
    assert.match(r.headers.get("set-cookie"), /m365o=.*\|C1\.\d+\.[0-9a-f]{32}\.manufacturing-excellence\./, "Zweck und Pfad im signierten state");
    const n = await worker.fetch(new Request(`https://api-dub.m365.fm/auth/login/${p}?return=${encodeURIComponent(RET)}`), env);
    assert.equal(new URL(n.headers.get("location")).searchParams.get("scope"), normal[p], "normale Anmeldung: " + p);
  }
  const cases = [[null, "google", {}, "session"], [s.bob, "github", {}, "wrong_account"], [s.ada, "google", { path: "Bad/Path" }, "error"]];
  for (const [cookie, p, o, err] of cases) {
    const r = await startCM(env, cookie, p, o);
    assert.equal(r.status, 302);
    const loc = new URL(r.headers.get("location"));
    assert.equal(loc.origin + loc.pathname, "https://www.m365.fm/de/learn/path/manufacturing-excellence/test/", err);
    assert.equal(loc.searchParams.get("certmail"), err);
  }
  const foreign = await startCM(env, null, "google", { ret: "https://evil.example/x" });
  assert.equal(new URL(foreign.headers.get("location")).origin, "https://www.m365.fm", "Ruecksprung nur auf die eigene Seite");
});

test("Google, richtige Identitaet: bestaetigte E-Mail als Entwurf gespeichert, kein Login, kein Token gespeichert; Status maskiert", async () => {
  const { env, raw, s, counts } = await setup();
  const before = counts();
  const f = await flow(env, s.ada, "google", { info: { sub: "g-ada", email: "Ada@Example.org", email_verified: true } });
  assert.equal(f.r.status, 302); assert.equal(f.status, "ok"); noLogin(f.r);
  assert.equal(f.back.origin + f.back.pathname, "https://www.m365.fm/de/learn/path/manufacturing-excellence/test/");
  assert.match(f.r.headers.get("set-cookie"), /m365o=;/, "state-Cookie geloescht");
  const r = row(raw);
  assert.equal(r.email, "ada@example.org"); assert.equal(r.email_src, "google"); assert.equal(r.status, "draft"); assert.ok(r.email_at > 0);
  assert.deepEqual(counts(), before, "kein Konto, keine Verknuepfung");
  const dump = JSON.stringify(raw.prepare("SELECT * FROM learn_certs").all()) + JSON.stringify(raw.prepare("SELECT * FROM mail_addr").all());
  assert.ok(!dump.includes("AT-secret-123"), "Access-Token nicht gespeichert");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_addr").get().n, 0, "nicht in mail_addr");
  const st = await worker.fetch(new Request(`https://api-dub.m365.fm/api/learn/cert?path=${PATH}`, { headers: { cookie: s.ada, origin: "https://www.m365.fm" } }), env);
  const j = await st.json();
  assert.equal(j.email_masked, "a***@example.org"); assert.equal(j.email_src, "google"); assert.equal(j.cert, null);
  assert.deepEqual(j.providers, ["linkedin", "microsoft", "google", "github"]);
  assert.equal(maskEmail("max@example.com"), "m***@example.com");
  // POST: kein email-Feld noetig; ein abweichendes wird abgelehnt, gespeichert bleibt die Adresse aus der Anmeldung
  const post = (body) => worker.fetch(new Request("https://api-dub.m365.fm/api/learn/cert", { method: "POST", headers: { cookie: s.ada, origin: "https://www.m365.fm", "x-requested-with": "m365", "content-type": "application/json" },
    body: JSON.stringify({ path: PATH, attempt: "att-ada-1", name: "Ada Lovelace", consent: true, lang: "de", ...body }) }), env, { waitUntil() {} });
  const bad = await post({ email: "jemand@example.com" });
  assert.equal(bad.status, 400); assert.equal((await bad.json()).error, "email_fixed");
  assert.equal((await post({})).status, 503, "Certopus aus: wartet (pending)");
  assert.deepEqual([row(raw).email, row(raw).email_src, row(raw).status, row(raw).name], ["ada@example.org", "google", "pending", "Ada Lovelace"]);
  // Konto loeschen: die neuen Felder gehen mit
  await deleteUserLearn(env.DB, 1);
  assert.equal(row(raw), null);
});

test("Fremde oder unbekannte Identitaet: abgelehnt (wrong_account), kein Login-Wechsel, nichts verknuepft, kein Konto angelegt", async () => {
  const { env, raw, s, counts } = await setup();
  const before = counts();
  for (const sub of ["g-bob", "g-niemand"]) {
    const f = await flow(env, s.ada, "google", { info: { sub, email: "bob@example.org", email_verified: true } });
    assert.equal(f.status, "wrong_account", sub); noLogin(f.r);
    assert.equal(row(raw), null, "nichts gespeichert");
    assert.equal(row(raw, 2), null);
  }
  assert.deepEqual(counts(), before);
  // Bob hat Google, aber keinen bestandenen Test: not_passed
  const nb = await flow(env, s.bob, "google", { info: { sub: "g-bob", email: "bob@example.org", email_verified: true } });
  assert.equal(nb.status, "not_passed"); assert.equal(row(raw, 2), null);
});

test("Sitzung muss zum state passen; Abbruch beim Anbieter; Zertifikat schon ausgestellt -> Adresse bleibt", async () => {
  const { env, raw, s } = await setup();
  const info = { info: { sub: "g-ada", email: "ada@example.org", email_verified: true } };
  for (const cb of [s.bob, ""]) {
    const f = await flow(env, s.ada, "google", info, { cbCookie: cb });
    assert.equal(f.status, "session"); noLogin(f.r); assert.equal(row(raw), null);
  }
  const c = await flow(env, s.ada, "google", info, { code: "" });
  assert.equal(c.status, "cancel"); assert.equal(c.calls.length, 0, "ohne Code kein Abruf beim Anbieter");
  const t = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO learn_certs(user_id,path,attempt_id,name,email,email_src,email_at,status,created,updated) VALUES (1,?,'att-ada-1','Ada','alt@example.org','linkedin',?, 'ok',?,?)").run(PATH, t, t, t);
  const f = await flow(env, s.ada, "google", info);
  assert.equal(f.status, "issued"); assert.equal(row(raw).email, "alt@example.org");
});

test("Nur bestaetigte E-Mails: Google/LinkedIn email_verified === true", async () => {
  const { env, raw, s } = await setup();
  for (const [p, info] of [["google", { sub: "g-ada", email: "ada@example.org", email_verified: false }], ["google", { sub: "g-ada", email: "ada@example.org", email_verified: "true" }],
    ["google", { sub: "g-ada", email_verified: true }], ["linkedin", { sub: "li-ada", email: "ada@example.org" }]]) {
    const f = await flow(env, s.ada, p, { info });
    assert.equal(f.status, "unverified", JSON.stringify(info)); assert.equal(row(raw), null);
  }
  const ok = await flow(env, s.ada, "linkedin", { info: { sub: "li-ada", email: "ada@li.example", email_verified: true } });
  assert.equal(ok.status, "ok"); assert.equal(row(raw).email_src, "linkedin");
});

test("GitHub: nur die primaere und bestaetigte Adresse aus /user/emails", async () => {
  const { env, raw, s } = await setup();
  const info = { id: 1001, login: "ada" };
  let f = await flow(env, s.ada, "github", { info, emails: [{ email: "ada@primary.example", primary: true, verified: false }, { email: "ada@other.example", primary: false, verified: true }] });
  assert.equal(f.scope, "read:user user:email");
  assert.equal(f.status, "unverified"); assert.equal(row(raw), null);
  assert.ok(f.calls.some((c) => c.u === "https://api.github.com/user/emails"));
  f = await flow(env, s.ada, "github", { info, emails: [], emailsStatus: 403 });
  assert.equal(f.status, "error"); noLogin(f.r);
  f = await flow(env, s.ada, "github", { info, emails: [{ email: "ada@other.example", primary: false, verified: true }, { email: "Ada@Primary.example", primary: true, verified: true }] });
  assert.equal(f.status, "ok"); noLogin(f.r);
  assert.deepEqual([row(raw).email, row(raw).email_src], ["ada@primary.example", "github"]);
});

test("Microsoft: nur private Konten (tid) oder xms_edov === true aus dem id_token; Arbeitskonten sonst abgelehnt (nOAuth)", async () => {
  const { env, raw, s } = await setup();
  const info = { sub: "ms-ada", email: "ada@contoso.example" };
  const base = { aud: "ms-client", sub: "ms-ada", email: "ada@contoso.example" };
  for (const [claims, want] of [
    [{ ...base, tid: "11111111-2222-3333-4444-555555555555" }, "unverified"],                       // Arbeitskonto ohne Beleg
    [{ ...base, tid: "11111111-2222-3333-4444-555555555555", xms_edov: false }, "unverified"],
    [{ ...base, tid: "11111111-2222-3333-4444-555555555555", xms_edov: "true" }, "unverified"],
    [{ ...base, tid: MS_PERSONAL_TID, aud: "fremde-app" }, "unverified"],                           // id_token einer anderen App
    [{ ...base, tid: MS_PERSONAL_TID, sub: "ms-jemand" }, "unverified"],                            // passt nicht zur Anmeldung
    [null, "unverified"],                                                                           // kein id_token
  ]) {
    const f = await flow(env, s.ada, "microsoft", { info, idClaims: claims });
    assert.equal(f.status, want, JSON.stringify(claims)); assert.equal(row(raw), null);
  }
  let f = await flow(env, s.ada, "microsoft", { info, idClaims: { ...base, tid: MS_PERSONAL_TID, email: "ada@outlook.example" } });
  assert.equal(f.status, "ok"); assert.deepEqual([row(raw).email, row(raw).email_src], ["ada@outlook.example", "microsoft"]);
  f = await flow(env, s.ada, "microsoft", { info, idClaims: { ...base, tid: "11111111-2222-3333-4444-555555555555", xms_edov: true } });
  assert.equal(f.status, "ok"); assert.equal(row(raw).email, "ada@contoso.example", "neuer Schritt ersetzt den Entwurf");
});

test("Konten zusammenfuehren: Entwurf des Zielkontos weicht einer Anforderung des Quellkontos", async () => {
  const { mergeStatements } = await import("../src/identities.js");
  const { env, raw } = await setup();
  const t = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO learn_certs(user_id,path,email,email_src,email_at,status,created,updated) VALUES (2,?,'bob@t.example','google',?,'draft',?,?)").run(PATH, t, t, t);
  raw.prepare("INSERT INTO learn_certs(user_id,path,attempt_id,name,email,email_src,email_at,status,created,updated) VALUES (1,?,'att-ada-1','Ada','ada@s.example','github',?,'pending',?,?)").run(PATH, t, t, t);
  await env.DB.batch(await mergeStatements(env.DB, 1, 2));
  assert.deepEqual([row(raw, 2).email, row(raw, 2).status, row(raw, 2).email_src], ["ada@s.example", "pending", "github"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_certs").get().n, 1);
});
