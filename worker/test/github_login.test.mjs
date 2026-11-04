// GitHub-Login (#236): OAuth 2.0 ohne OIDC - Token als JSON, Profil von api.github.com/user, sub = numerische ID, kein prompt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";

async function d1() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
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
    batch: async (list) => Promise.all(list.map((s) => s.run())),
    exec: async (sql) => raw.exec(sql),
  };
  return { db, raw };
}

const BASE_ENV = { SESSION_SECRET: "test-secret-0123456789", API: "https://api-dub.m365.fm", SITE: "https://www.m365.fm" };
const GH = { GH_OAUTH_CLIENT_ID: "gh-client", GH_OAUTH_CLIENT_SECRET: "gh-secret" };

function withFetch(fn, impl) {
  const old = globalThis.fetch; globalThis.fetch = impl;
  return fn().finally(() => { globalThis.fetch = old; });
}

async function login(env) {
  const r = await W.fetch(new Request("https://api-dub.m365.fm/auth/login/github?return=" + encodeURIComponent("https://www.m365.fm/community/")), env);
  const loc = new URL(r.headers.get("location")), ck = /m365o=([^;]+)/.exec(r.headers.get("set-cookie"))[1];
  return { r, loc, ck, state: loc.searchParams.get("state") };
}
const callback = (env, ck, state, code = "the-code") =>
  W.fetch(new Request(`https://api-dub.m365.fm/auth/callback/github?code=${code}&state=${state}`, { headers: { cookie: "m365o=" + ck } }), env);

test("GitHub-Login: Weiterleitung zu github.com mit read:user, ohne prompt", async () => {
  const { db } = await d1();
  const { r, loc } = await login({ ...BASE_ENV, ...GH, DB: db });
  assert.equal(r.status, 302);
  assert.equal(loc.origin + loc.pathname, "https://github.com/login/oauth/authorize");
  assert.equal(loc.searchParams.get("client_id"), "gh-client");
  assert.equal(loc.searchParams.get("scope"), "read:user");
  assert.equal(loc.searchParams.get("redirect_uri"), "https://api-dub.m365.fm/auth/callback/github");
  assert.equal(loc.searchParams.get("prompt"), null);
});

test("GitHub-Login: Nutzer github:<numerische ID>, Name aus login, erneute Anmeldung findet denselben Nutzer", async () => {
  const { db, raw } = await d1(), env = { ...BASE_ENV, ...GH, DB: db };
  const calls = [];
  await withFetch(async () => {
    for (const round of [1, 2]) {
      const { ck, state } = await login(env);
      const r = await callback(env, ck, state);
      assert.equal(r.status, 302, "Runde " + round);
      assert.equal(r.headers.get("location"), "https://www.m365.fm/community/");
      assert.match(r.headers.get("set-cookie"), /m365s=/);
    }
  }, async (url, init = {}) => {
    const u = String(url), h = new Headers(init.headers || {}); calls.push({ u, h });
    if (u === "https://github.com/login/oauth/access_token") {
      assert.equal(h.get("accept"), "application/json");
      const b = new URLSearchParams(init.body); assert.equal(b.get("client_secret"), "gh-secret"); assert.equal(b.get("code"), "the-code");
      return new Response(JSON.stringify({ access_token: "gho_test", token_type: "bearer", scope: "read:user" }), { headers: { "content-type": "application/json" } });
    }
    if (u === "https://api.github.com/user") {
      assert.equal(h.get("authorization"), "Bearer gho_test"); assert.equal(h.get("user-agent"), "m365fm");
      assert.equal(h.get("accept"), "application/vnd.github+json");
      return new Response(JSON.stringify({ id: 583231, login: "octocat", name: null }), { headers: { "content-type": "application/json" } });
    }
    throw new Error("unerwarteter Abruf " + u);
  });
  const users = raw.prepare("SELECT provider,sub,name FROM users WHERE provider='github'").all();
  assert.deepEqual(users.map((x) => ({ ...x })), [{ provider: "github", sub: "583231", name: "octocat" }]);
  assert.equal(calls.filter((c) => c.u.includes("access_token")).length, 2);
});

test("GitHub-Login: Fehler beim Token (Status 200 mit error) und beim Profil ergeben 400, kein Nutzer", async () => {
  const { db, raw } = await d1(), env = { ...BASE_ENV, ...GH, DB: db };
  await withFetch(async () => {
    const a = await login(env); const r1 = await callback(env, a.ck, a.state, "bad");
    assert.equal(r1.status, 400); assert.match(await r1.text(), /token/);
  }, async () => new Response(JSON.stringify({ error: "bad_verification_code" }), { status: 200, headers: { "content-type": "application/json" } }));
  await withFetch(async () => {
    const a = await login(env); const r2 = await callback(env, a.ck, a.state);
    assert.equal(r2.status, 400);
  }, async (url) => String(url).includes("access_token")
    ? new Response(JSON.stringify({ access_token: "gho_x" }), { headers: { "content-type": "application/json" } })
    : new Response(JSON.stringify({ login: "no-id" }), { headers: { "content-type": "application/json" } }));   // Profil ohne id
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM users WHERE provider='github'").get().n, 0);
});

test("GitHub-Login ohne Secrets: kein Knopf in /api/providers, /auth/login/github -> Login not configured", async () => {
  const { db } = await d1(), env = { ...BASE_ENV, DB: db };
  const r = await W.fetch(new Request("https://api-dub.m365.fm/auth/login/github"), env);
  assert.equal(r.status, 503); assert.match(await r.text(), /Login not configured/);
  const p = await (await W.fetch(new Request("https://api-dub.m365.fm/api/providers"), env)).json();
  assert.ok(!p.providers.includes("github"));
  const p2 = await (await W.fetch(new Request("https://api-dub.m365.fm/api/providers"), { ...env, ...GH })).json();
  assert.ok(p2.providers.includes("github"));
});
