// Blog auf der eigenen Domain: Verwaltung durch Mitglieder, Domain-Pruefung, Cloudflare-Anbindung (nur Mocks, nie ein echter Aufruf), Cron.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleByodApi, checkDomain, runByodChecks, domainView } from "../src/byod.js";
import { serveBlog } from "../src/byod_site.js";
import { cfOn, checkDns } from "../src/byod_cf.js";

const ZONE = "0123456789abcdef0123456789abcdef", TOKEN = "SECRET-TOKEN-xyz";
async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(stmts) { for (const st of stmts) await st.run(); } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1),(3,'g','3','Cora',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'anna',1),(2,1,'ben',1),(3,0,'cora',1)");
  raw.exec("INSERT INTO blog_posts(user_id,slug,title,summary,body,lang,topics,status,created,updated,published) VALUES(1,'hallo','Hallo','Kurz','Text','en','[]','live',1,1,1)");
  return { db, raw, env: { DB: db, SITE: "https://www.m365.fm", BYOD: "1", BYOD_CNAME_TARGET: "blogs.m365blogs.net" } };
}
const CFENV = { CF_API_TOKEN: TOKEN, CF_ZONE_ID: ZONE };
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const call = (env, path, method = "GET", data, user = { id: 1 }) => { const url = new URL("https://x" + path); return handleByodApi(env, new Request(url, { method, headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), url, url.pathname, user, J); };
const body = async (r) => (await r).json();

// Mock fuer DNS-ueber-HTTPS und Cloudflare: dns = { "<name>|<type>": Antwort-JSON }, cf = Zustand des Custom Hostnames
function mocks({ dns = {}, cf = null } = {}) {
  const calls = [], state = { cf, dns, creates: 0 };
  const orig = globalThis.fetch;
  globalThis.fetch = async (u, init = {}) => {
    const url = String(u); calls.push({ url, method: init.method || "GET", headers: init.headers || {}, body: init.body });
    if (url.startsWith("https://cloudflare-dns.com/dns-query")) {
      const q = new URL(url), key = q.searchParams.get("name") + "|" + q.searchParams.get("type"), r = state.dns[key];
      if (r === "fail") return new Response("x", { status: 502 });
      return new Response(JSON.stringify(r || { Status: 3, Answer: [] }), { status: 200 });
    }
    if (url.startsWith("https://api.cloudflare.com/client/v4/zones/")) {
      const m = (init.method || "GET");
      if (state.cf?.error) return new Response(JSON.stringify({ success: false, errors: [{ code: state.cf.error, message: "boom" }] }), { status: 400 });
      if (m === "POST") { state.creates++; state.cf = { ...(state.cf || {}), id: "abc12345-0000", status: "pending", ssl: { status: "pending_validation" } }; return new Response(JSON.stringify({ success: true, result: state.cf }), { status: 200 }); }
      if (m === "GET") return state.cf?.gone ? new Response(JSON.stringify({ success: false, errors: [{ code: 1551 }] }), { status: 404 }) : new Response(JSON.stringify({ success: true, result: state.cf }), { status: 200 });
      if (m === "DELETE") return state.cf?.delfail ? new Response("x", { status: 500 }) : new Response(JSON.stringify({ success: true, result: { id: "x" } }), { status: 200 });
    }
    return new Response("unexpected " + url, { status: 599 });
  };
  return { calls, state, done: () => { globalThis.fetch = orig; } };
}
const cnameOk = (host, target = "blogs.m365blogs.net.") => ({ [host + "|CNAME"]: { Status: 0, Answer: [{ name: host + ".", type: 5, data: target }] } });
const cfCalls = (m) => m.calls.filter((c) => c.url.startsWith("https://api.cloudflare.com"));

test("Schalter aus: mine meldet enabled:false, alles andere 404, kein Datenbankzugriff noetig", async () => {
  const { env } = await makeDb(); const off = { ...env, BYOD: "0" };
  assert.deepEqual(await body(call(off, "/api/byod/mine")), { enabled: false });
  for (const [p, m, d] of [["/api/byod/add", "POST", { domain: "blog.anna.de" }], ["/api/byod/check", "POST", { id: 1 }], ["/api/admin/byod", "GET"]]) assert.equal((await call(off, p, m, d, { id: 1, admin: true })).status, 404, p);
  assert.equal((await call({ ...env, BYOD: undefined }, "/api/byod/mine", "GET", undefined, null)).status, 200);
});

test("Anmeldung erforderlich", async () => {
  const { env } = await makeDb();
  assert.equal((await call(env, "/api/byod/mine", "GET", undefined, null)).status, 401);
  assert.equal((await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de" }, null)).status, 401);
});

test("add: Namensregeln, Profil, Limit, doppelte Domain, Links; Antwort mit genau dem DNS-Eintrag", async () => {
  const { env, raw } = await makeDb();
  for (const [d, e] of [["kunde.de", "apex_not_allowed"], ["blog.m365.fm", "own_domain"], ["x.blogs.m365blogs.net", "saas_zone"], ["a.workers.dev", "blocked_suffix"], ["blog.microsoft.com", "brand_domain"], ["???", "bad_domain"]]) {
    const r = await call(env, "/api/byod/add", "POST", { domain: d }); assert.equal(r.status, 400, d); assert.equal((await r.json()).error, e, d);
  }
  assert.equal((await body(call(env, "/api/byod/add", "POST", { domain: "blog.cora.de" }, { id: 3 }))).error, "need_profile");
  assert.equal((await body(call(env, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "http://x" }))).error, "bad_link");
  const ok = await call(env, "/api/byod/add", "POST", { domain: "https://Blog.Anna.de/", imprint_url: "https://anna.de/impressum" }), j = await ok.json();
  assert.equal(ok.status, 200); assert.equal(j.domain.domain, "blog.anna.de"); assert.equal(j.domain.status, "pending");
  assert.deepEqual(j.domain.dns, { type: "CNAME", name: "blog.anna.de", value: "blogs.m365blogs.net" });
  assert.equal(j.domain.txt.name, "_m365fm-verify.blog.anna.de"); assert.match(j.domain.txt.value, /^m365fm-verify=[A-Za-z0-9_-]{10,}$/);
  assert.equal((await body(call(env, "/api/byod/add", "POST", { domain: "zweite.anna.de" }))).error, "limit");   // 1 Domain je Mitglied
  const t = await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de" }, { id: 2 }); assert.equal(t.status, 409); assert.equal((await t.json()).error, "domain_taken");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_domains").get().n, 1);
});

test("mine: nur eigene Domains, Pruef-Token nur als fertiger TXT-Wert", async () => {
  const { env } = await makeDb();
  await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de" });
  const mine = await body(call(env, "/api/byod/mine")); assert.equal(mine.enabled, true); assert.equal(mine.domains.length, 1); assert.equal(mine.can_add, false); assert.equal(mine.target, "blogs.m365blogs.net"); assert.equal(mine.canonical, "platform"); assert.equal(mine.cloudflare, false);
  assert.ok(!("token" in mine.domains[0]) && !("cf_id" in mine.domains[0]));
  assert.equal((await body(call(env, "/api/byod/mine", "GET", undefined, { id: 2 }))).domains.length, 0);
});

test("check ohne Cloudflare-Zugang: DNS ok -> verified, nie active, KEIN Aufruf an Cloudflare", async () => {
  const { env, raw } = await makeDb(); const m = mocks({ dns: cnameOk("blog.anna.de") });
  try {
    await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "https://anna.de/i" });
    const r = await body(call(env, "/api/byod/check", "POST", { id: 1 }));
    assert.equal(r.domain.status, "verified"); assert.equal(r.domain.error, "");
    assert.equal(cfCalls(m).length, 0, "ohne Token kein Aufruf an api.cloudflare.com");
    assert.equal(await serveBlog(env, "blog.anna.de", "/"), null, "verified wird nicht ausgeliefert");
    assert.ok(raw.prepare("SELECT verified_at v FROM blog_domains").get().v > 0);
  } finally { m.done(); }
});

test("check: DNS fehlt -> pending mit dns_missing; Netzfehler aendert nichts; ohne CNAME-Ziel not_configured", async () => {
  const { env, raw } = await makeDb(); let m = mocks();
  try {
    await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de" });
    assert.equal((await body(call(env, "/api/byod/check", "POST", { id: 1 }))).domain.error, "dns_missing");
    m.state.dns = { "blog.anna.de|CNAME": "fail" };
    const r = await body(call(env, "/api/byod/check", "POST", { id: 1 })); assert.equal(r.domain.error, "dns_unavailable"); assert.equal(r.domain.status, "pending");
    m.state.dns = cnameOk("blog.anna.de", "anderes-ziel.example.com.");
    assert.equal((await body(call(env, "/api/byod/check", "POST", { id: 1 }))).domain.error, "dns_missing", "CNAME auf ein anderes Ziel zaehlt nicht");
    const noTarget = { ...env, BYOD_CNAME_TARGET: undefined };
    assert.equal((await body(call(noTarget, "/api/byod/check", "POST", { id: 1 }))).domain.error, "not_configured");
    assert.equal(cfCalls(m).length, 0);
  } finally { m.done(); }
});

test("check mit Cloudflare: anlegen -> wartet -> active; Impressum Pflicht; Token nur im Authorization-Header", async () => {
  const { env, raw } = await makeDb(), cenv = { ...env, ...CFENV }; const m = mocks({ dns: cnameOk("blog.anna.de") });
  try {
    assert.ok(cfOn(cenv)); assert.ok(!cfOn({ ...cenv, CF_ZONE_ID: "kurz" })); assert.ok(!cfOn({ CF_API_TOKEN: "x" })); assert.ok(!cfOn(env));
    await call(cenv, "/api/byod/add", "POST", { domain: "blog.anna.de" });   // ohne Impressum
    let r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 }));
    assert.equal(r.domain.status, "verified"); assert.equal(m.state.creates, 1);
    const post = cfCalls(m)[0]; assert.equal(post.method, "POST"); assert.equal(post.url, `https://api.cloudflare.com/client/v4/zones/${ZONE}/custom_hostnames`);
    assert.deepEqual(JSON.parse(post.body), { hostname: "blog.anna.de", ssl: { method: "http", type: "dv", settings: { min_tls_version: "1.2" } } });
    assert.equal(post.headers.authorization, `Bearer ${TOKEN}`);
    assert.ok(!post.body.includes(TOKEN) && !post.url.includes(TOKEN));
    r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 })); assert.equal(m.state.creates, 1, "nicht doppelt anlegen"); assert.equal(r.domain.status, "verified"); assert.equal(r.domain.cf_status, "pending");
    m.state.cf = { ...m.state.cf, status: "active", ssl: { status: "active" } };   // Cloudflare fertig, aber kein Impressum
    r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 })); assert.equal(r.domain.status, "verified"); assert.equal(r.domain.error, "need_imprint");
    assert.equal(await serveBlog(cenv, "blog.anna.de", "/"), null);
    const l = await body(call(cenv, "/api/byod/links", "POST", { id: 1, imprint_url: "https://anna.de/impressum", privacy_url: "https://anna.de/datenschutz" })); assert.equal(l.domain.imprint_url, "https://anna.de/impressum");
    r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 })); assert.equal(r.domain.status, "active"); assert.equal(r.domain.url, "https://blog.anna.de/"); assert.equal(r.domain.error, "");
    const page = await serveBlog(cenv, "blog.anna.de", "/"); assert.equal(page.status, 200); assert.ok((await page.text()).includes("Hallo"));
    assert.ok(!JSON.stringify(r).includes(TOKEN));
  } finally { m.done(); }
});

test("Aktive Domain wird abgeschaltet, wenn der DNS-Eintrag eindeutig fehlt oder Cloudflare nicht mehr active meldet; Netzfehler schalten nicht ab", async () => {
  const { env, raw } = await makeDb(), cenv = { ...env, ...CFENV }; const m = mocks({ dns: cnameOk("blog.anna.de") });
  try {
    await call(cenv, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "https://anna.de/i" });
    await call(cenv, "/api/byod/check", "POST", { id: 1 }); m.state.cf = { ...m.state.cf, status: "active", ssl: { status: "active" } };
    assert.equal((await body(call(cenv, "/api/byod/check", "POST", { id: 1 }))).domain.status, "active");
    m.state.dns = { "blog.anna.de|CNAME": "fail" };
    assert.equal((await body(call(cenv, "/api/byod/check", "POST", { id: 1 }))).domain.status, "active", "Netzfehler: unveraendert");
    m.state.dns = {};
    const r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 })); assert.equal(r.domain.status, "pending"); assert.equal(raw.prepare("SELECT activated_at a FROM blog_domains").get().a, 0);
    assert.equal(await serveBlog(cenv, "blog.anna.de", "/"), null);
    m.state.dns = cnameOk("blog.anna.de"); m.state.cf = { ...m.state.cf, status: "pending", ssl: { status: "pending_validation" } };
    assert.equal((await body(call(cenv, "/api/byod/check", "POST", { id: 1 }))).domain.status, "verified");
  } finally { m.done(); }
});

test("Cloudflare-Fehler: Status bleibt, nur ein Fehlercode (keine Meldung mit Token); bei geloeschtem Hostnamen wird neu angelegt", async () => {
  const { env } = await makeDb(), cenv = { ...env, ...CFENV }; const m = mocks({ dns: cnameOk("blog.anna.de"), cf: { error: 9109 } });
  try {
    await call(cenv, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "https://anna.de/i" });
    const r = await body(call(cenv, "/api/byod/check", "POST", { id: 1 })); assert.equal(r.domain.status, "verified"); assert.equal(r.domain.error, "cf_9109"); assert.ok(!JSON.stringify(r).includes(TOKEN));
    m.state.cf = null; await call(cenv, "/api/byod/check", "POST", { id: 1 }); assert.equal(m.state.creates, 1);
    m.state.cf = { ...m.state.cf, gone: true }; await call(cenv, "/api/byod/check", "POST", { id: 1 }); assert.equal(m.state.creates, 2, "404 bei Cloudflare: neu anlegen");
  } finally { m.done(); }
});

test("TXT-Token als Besitznachweis (ohne Umstellung des Verkehrs)", async () => {
  const { env, raw } = await makeDb(); const m = mocks();
  try {
    await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de" });
    const tok = raw.prepare("SELECT token t FROM blog_domains").get().t;
    m.state.dns = { "_m365fm-verify.blog.anna.de|TXT": { Status: 0, Answer: [{ type: 16, data: `"m365fm-verify=${tok}"` }] } };
    assert.equal((await body(call(env, "/api/byod/check", "POST", { id: 1 }))).domain.status, "verified");
    m.state.dns = { "_m365fm-verify.blog.anna.de|TXT": { Status: 0, Answer: [{ type: 16, data: `"m365fm-verify=falsch"` }] } };
    raw.exec("UPDATE blog_domains SET status='pending',verified_at=0");
    assert.equal((await body(call(env, "/api/byod/check", "POST", { id: 1 }))).domain.status, "pending");
    assert.deepEqual(await checkDns("blog.anna.de", "blogs.m365blogs.net", ""), { ok: true, cname: false, txt: false });
  } finally { m.done(); }
});

test("Impressum entfernen schaltet eine aktive Domain sofort ab; ungueltige Links werden abgelehnt", async () => {
  const { env, raw } = await makeDb();
  await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "https://anna.de/i" });
  raw.exec("UPDATE blog_domains SET status='active'"); assert.ok(await serveBlog(env, "blog.anna.de", "/"));
  assert.equal((await body(call(env, "/api/byod/links", "POST", { id: 1, imprint_url: "javascript:alert(1)" }))).error, "bad_link");
  const r = await body(call(env, "/api/byod/links", "POST", { id: 1, imprint_url: "", privacy_url: "https://anna.de/d" }));
  assert.equal(r.domain.status, "verified"); assert.equal(r.domain.error, "need_imprint"); assert.equal(await serveBlog(env, "blog.anna.de", "/"), null);
  assert.equal((await call(env, "/api/byod/links", "POST", { id: 1, imprint_url: "https://anna.de/i" }, { id: 2 })).status, 404, "fremde Domain");
});

test("remove: nur die eigene, Cloudflare-Hostname wird mitgeloescht, Fehler dort behaelt die Zeile, gesperrte bleiben", async () => {
  const { env, raw } = await makeDb(), cenv = { ...env, ...CFENV }; const m = mocks({ dns: cnameOk("blog.anna.de") });
  try {
    await call(cenv, "/api/byod/add", "POST", { domain: "blog.anna.de" }); await call(cenv, "/api/byod/check", "POST", { id: 1 });
    assert.equal((await call(cenv, "/api/byod/remove", "POST", { id: 1 }, { id: 2 })).status, 404);
    m.state.cf = { ...m.state.cf, delfail: true };
    assert.equal((await call(cenv, "/api/byod/remove", "POST", { id: 1 })).status, 502); assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_domains").get().n, 1);
    m.state.cf = { ...m.state.cf, delfail: false };
    assert.equal((await call(cenv, "/api/byod/remove", "POST", { id: 1 })).status, 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_domains").get().n, 0);
    assert.ok(cfCalls(m).some((c) => c.method === "DELETE" && c.url.endsWith("/custom_hostnames/abc12345-0000")));
    await call(cenv, "/api/byod/add", "POST", { domain: "neu.anna.de" }); raw.exec("UPDATE blog_domains SET status='blocked'");
    assert.equal((await call(cenv, "/api/byod/remove", "POST", { id: 2 })).status, 403);
    assert.equal((await call(cenv, "/api/byod/add", "POST", { domain: "neu.anna.de" }, { id: 2 })).status, 409, "gesperrte Domain bleibt vergeben");
  } finally { m.done(); }
});

test("Admin: sperren und freigeben (nur Admin); gesperrt wird nie ausgeliefert und nicht neu geprueft", async () => {
  const { env, raw } = await makeDb(); const m = mocks({ dns: cnameOk("blog.anna.de") });
  try {
    await call(env, "/api/byod/add", "POST", { domain: "blog.anna.de", imprint_url: "https://anna.de/i" }); raw.exec("UPDATE blog_domains SET status='active'");
    assert.equal((await call(env, "/api/admin/byod", "GET", undefined, { id: 2 })).status, 403);
    assert.equal((await call(env, "/api/admin/byod/block", "POST", { id: 1, blocked: true }, { id: 2 })).status, 403);
    assert.equal((await body(call(env, "/api/admin/byod/block", "POST", { id: 1, blocked: true }, { id: 9, admin: true }))).status, "blocked");
    assert.equal(await serveBlog(env, "blog.anna.de", "/"), null);
    const chk = await body(call(env, "/api/byod/check", "POST", { id: 1 })); assert.equal(chk.domain.status, "blocked");
    const list = await body(call(env, "/api/admin/byod", "GET", undefined, { id: 9, admin: true })); assert.equal(list.items[0].domain, "blog.anna.de"); assert.equal(list.items[0].handle, "anna");
    assert.equal((await body(call(env, "/api/admin/byod/block", "POST", { id: 1, blocked: false }, { id: 9, admin: true }))).status, "pending");
  } finally { m.done(); }
});

test("Cron: nur mit Schalter und CNAME-Ziel, hoechstens 20 je Lauf, nur Domains, die laenger nicht geprueft wurden", async () => {
  const { env, raw } = await makeDb(); const m = mocks();
  try {
    assert.deepEqual(await runByodChecks({ ...env, BYOD: "0" }), { skipped: true }); assert.deepEqual(await runByodChecks({ ...env, BYOD_CNAME_TARGET: undefined }), { skipped: true });
    for (let i = 0; i < 25; i++) raw.exec(`INSERT INTO blog_domains(user_id,domain,token,created,updated,checked) VALUES(1,'d${i}.anna.de','t${i}',1,1,0)`);
    assert.equal((await runByodChecks(env, 10000)).checked, 20);
    assert.equal((await runByodChecks(env, 10001)).checked, 5, "die ersten 20 wurden gerade geprueft");
    assert.equal(cfCalls(m).length, 0);
  } finally { m.done(); }
});

test("domainView zeigt ohne CNAME-Ziel keinen DNS-Eintrag", () => {
  const v = domainView({}, { id: 1, domain: "blog.anna.de", status: "pending", token: "abc", imprint_url: "", privacy_url: "", error: "", cf_status: "", cf_ssl: "", checked: 0, created: 1, activated_at: 0 });
  assert.equal(v.dns, null); assert.equal(v.url, ""); assert.ok(!("token" in v));
});
