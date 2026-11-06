import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { allowedDomains, matchEmailDomain, registrable, maskEmail, handleClaimVerify } from "../src/claimverify.js";
import { handleEvents } from "../src/events.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const entities = [
  { id: "acme", type: "org", name: "Acme GmbH", web: "https://www.acme.de/de", same_as: ["https://acme-group.com", "https://www.linkedin.com/company/acme"] },
  { id: "acme-tool", type: "product", name: "Acme Tool", web: "https://github.com/acme/tool", rel: [["developed_by", "acme"]] },
  { id: "nodom", type: "org", name: "No Domain Inc" },
  { id: "someone", type: "person", name: "Some One", web: "https://someone.de" },
];
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = { prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { const r = raw.prepare(sql).run(...a); return { meta: { changes: Number(r.changes) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const mails = [], env = { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "s", MAIL_FROM: "M365 <no@m365.fm>", EMAIL: { send: async (m) => { mails.push(m); return { messageId: "m" + mails.length }; } } };
  for (const id of [1, 2, 3, 4]) { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'github',?,?,1)").run(id, "s" + id, "User " + id); raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,1)").run(id, "user" + id); }
  raw.prepare("UPDATE users SET role='admin' WHERE id=4").run();
  return { raw, env, mails };
}
const withEntities = () => { const old = globalThis.fetch; globalThis.fetch = async (i) => String(i).endsWith("/entities.json") ? { json: async () => ({ entities }) } : { ok: false, json: async () => ({}) }; return () => { globalThis.fetch = old; }; };
const call = (env, path, user, body, method = "POST") => { const req = new Request("https://api.test" + path, { method, ...(method === "POST" ? { body: JSON.stringify(body) } : {}) }); return handleClaimVerify(env, req, new URL(req.url), new URL(req.url).pathname, user, J); };
const tokenOf = (mail) => /claimverify=([^&#\s]+)/.exec(mail.text)[1];
const claim = (raw, eid, uid, status = "pending") => raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES(?,?,?,'manual',1)").run(eid, uid, status);
const U = (id) => ({ id, name: "User " + id });

test("Domain: Subdomain erlaubt, Freemail und fremde Domain abgelehnt, Produkte erben Entwickler-Domain", () => {
  const map = new Map(entities.map((e) => [e.id, e]));
  assert.deepEqual(allowedDomains(map.get("acme"), map).sort(), ["acme-group.com", "acme.de"]);   // LinkedIn-Seite zaehlt nicht
  assert.deepEqual(allowedDomains(map.get("acme-tool"), map).sort(), ["acme-group.com", "acme.de"]);   // github.com als eigene Seite zaehlt nicht
  assert.deepEqual(allowedDomains(map.get("nodom"), map), []);
  assert.deepEqual(allowedDomains(map.get("someone"), map), []);
  const d = ["acme.de"];
  assert.equal(matchEmailDomain("Max@acme.de", d).domain, "acme.de");
  assert.equal(matchEmailDomain("max@mail.eu.acme.de", d).ok, true);
  assert.equal(matchEmailDomain("max@notacme.de", d).error, "domain_mismatch");
  assert.equal(matchEmailDomain("max@acme.de.evil.com", d).error, "domain_mismatch");
  for (const f of ["gmail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "gmx.de", "web.de", "t-online.de", "icloud.com", "proton.me"]) assert.equal(matchEmailDomain("a@" + f, [f]).error, "free_mail", f);
  assert.equal(matchEmailDomain("kaputt", d).error, "bad_email");
  assert.equal(registrable("a.b.example.co.uk"), "example.co.uk");
  assert.equal(maskEmail("max@acme.de"), "m***@acme.de");
});

test("Verify: Link einmalig, Token nur gehasht, Status verified_via=domain_email, Firmenverknüpfung bestätigt", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    raw.prepare("INSERT INTO orgs(id,handle,name,created) VALUES(1,'acme-org','Acme',1)").run();
    raw.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(1,1,'owner','active',1)").run();
    raw.prepare("INSERT INTO org_entity(org_id,eid) VALUES(1,'acme')").run();
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "x@gmail.com" })).status, 400);
    assert.equal(mails.length, 0);
    const r = await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "Max@Sub.acme.de", lang: "de" });
    assert.equal(r.status, 200);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "email_sent");
    assert.equal(mails.length, 1); assert.equal(mails[0].to, "max@sub.acme.de"); assert.match(mails[0].text, /User 1/); assert.match(mails[0].text, /Acme GmbH/);
    const t = tokenOf(mails[0]); assert.ok(t.length >= 43);
    const dump = JSON.stringify(raw.prepare("SELECT * FROM entity_claim_mail").all());
    assert.ok(!dump.includes(t) && !dump.includes("max@sub.acme.de"), "weder Token noch Adresse im Klartext");
    assert.equal((await call(env, "/api/entity/claim/confirm", U(2), { t })).status, 403);   // falscher Nutzer
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "email_sent");
    const ok = await call(env, "/api/entity/claim/confirm", U(1), { t }); assert.equal(ok.status, 200);
    const c = raw.prepare("SELECT * FROM entity_claims WHERE eid='acme'").get();
    assert.deepEqual([c.status, c.user_id, c.verified_via, c.verified_domain], ["verified", 1, "domain_email", "acme.de"]);
    assert.equal(raw.prepare("SELECT confirmed FROM org_entity WHERE org_id=1").get().confirmed, 1);
    assert.equal((await call(env, "/api/entity/claim/confirm", U(1), { t })).status, 410);   // einmalig
  } finally { restore(); raw.close(); }
});

test("Verify: abgelaufener Link wird abgelehnt, unbekannter Link 404", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "max@acme.de" });
    raw.prepare("UPDATE entity_claim_mail SET expires=1").run();
    const r = await call(env, "/api/entity/claim/confirm", U(1), { t: tokenOf(mails[0]) });
    assert.equal(r.status, 410); assert.equal((await r.json()).error, "expired");
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "email_sent");
    assert.equal((await call(env, "/api/entity/claim/confirm", U(1), { t: "nope" })).status, 404);
  } finally { restore(); raw.close(); }
});

test("Weitergeben: Kollege wird Inhaber, Anfragende sehen nur maskierte Adresse, ohne Domain-Adresse kein Abschluss", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    assert.equal((await call(env, "/api/entity/claim/forward", U(1), { eid: "acme", email: "me@gmail.com" })).status, 400);
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "me@private.de" })).status, 400);   // Anfragende ohne Firmenadresse: kein Abschluss
    const r = await call(env, "/api/entity/claim/forward", U(1), { eid: "acme", email: "kollege@acme.de" });
    const j = await r.json(); assert.equal(j.status, "forwarded"); assert.equal(j.mask, "k***@acme.de");
    const mine = await (await call(env, "/api/entity/claim/domains?eid=acme", U(1), null, "GET")).json();
    assert.equal(mine.fwd_mask, "k***@acme.de"); assert.ok(!JSON.stringify(mine).includes("kollege"));
    assert.match(mails[0].text, /User 1/);
    const t = tokenOf(mails[0]);
    assert.equal((await call(env, "/api/entity/claim/confirm", U(3), { t })).status, 200);
    const c = raw.prepare("SELECT user_id,status,verified_via,fwd_mask FROM entity_claims WHERE eid='acme'").get();
    assert.deepEqual([c.user_id, c.status, c.verified_via, c.fwd_mask], [3, "verified", "domain_email", ""]);
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "x@acme.de" })).status, 404);   // Anfragende hat keinen Claim mehr
  } finally { restore(); raw.close(); }
});

test("Weitergeben: Kollege braucht Profil, Link wird dann nicht verbraucht", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    await call(env, "/api/entity/claim/forward", U(1), { eid: "acme", email: "kollege@acme.de" });
    raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(9,'github','s9','Neu',1)").run();
    assert.equal((await call(env, "/api/entity/claim/confirm", U(9), { t: tokenOf(mails[0]) })).status, 409);
    raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(9,1,'neu',1)").run();
    assert.equal((await call(env, "/api/entity/claim/confirm", U(9), { t: tokenOf(mails[0]) })).status, 200);
  } finally { restore(); raw.close(); }
});

test("Ratenlimit pro Nutzer und pro Adresse", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    for (let i = 0; i < 3; i++) assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "a@acme.de" })).status, 200);
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "a@acme.de" })).status, 429);   // 3 je Adresse
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "b@acme.de" })).status, 200);
    assert.equal((await call(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "c@acme.de" })).status, 429);   // 5 Versuche je Nutzer
  } finally { restore(); raw.close(); }
});

test("Admin: Override bei Entität ohne Domain, Liste zeigt Status, Domain-Verifizierte erscheinen", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  const admin = async (method, body) => { const req = new Request("https://api.test/api/admin/entity/claim" + (method === "GET" ? "s" : ""), { method, ...(body ? { body: JSON.stringify(body) } : {}) }); return handleEvents(env, req, new URL(req.url), new URL(req.url).pathname, { id: 4, admin: true }, J); };
  try {
    claim(raw, "nodom", 2);
    assert.equal((await call(env, "/api/entity/claim/domains?eid=nodom", U(2), null, "GET").then((r) => r.json())).domains.length, 0);
    assert.equal((await call(env, "/api/entity/claim/domain", U(2), { eid: "nodom", email: "a@nodom.com" })).status, 409);
    claim(raw, "acme", 1, "forwarded"); raw.prepare("UPDATE entity_claims SET fwd_mask='k***@acme.de' WHERE eid='acme'").run();
    const list = await (await admin("GET")).json();
    assert.deepEqual(list.claims.map((c) => [c.eid, c.status]).sort(), [["acme", "forwarded"], ["nodom", "pending"]]);
    assert.equal((await admin("POST", { eid: "nodom", ok: true })).status, 200);
    assert.deepEqual(Object.values(raw.prepare("SELECT status,verified_via FROM entity_claims WHERE eid='nodom'").get()), ["verified", "admin"]);
    raw.prepare("INSERT INTO orgs(id,handle,name,created) VALUES(7,'nd','No Dom',1)").run();
    raw.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(7,2,'admin','active',1),(7,3,'member','active',1)").run();
    raw.prepare("INSERT INTO org_entity(org_id,eid,confirmed) VALUES(7,'nodom',0)").run();
    assert.equal((await admin("POST", { eid: "nodom", ok: true })).status, 404);   // schon bestätigt
    assert.equal((await admin("POST", { eid: "acme", ok: false })).status, 200);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "rejected");
    raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,verified_via,verified_domain,created) VALUES('acme-tool',3,'verified','domain_email','domain_email','acme.de',2)").run();
    assert.equal((await (await admin("GET")).json()).domain_verified[0].domain, "acme.de");
  } finally { restore(); raw.close(); }
});

test("Admin-Bestätigung setzt org_entity.confirmed automatisch (nur Inhaber/Admin der Firma)", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    claim(raw, "nodom", 2); claim(raw, "acme", 3);
    raw.exec(`INSERT INTO orgs(id,handle,name,created) VALUES(7,'nd','No Dom',1),(8,'ac','Acme',1);
      INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(7,2,'admin','active',1),(8,3,'member','active',1);
      INSERT INTO org_entity(org_id,eid,confirmed) VALUES(7,'nodom',0),(8,'acme',0);`);
    const req = new Request("https://api.test/api/admin/entity/claim", { method: "POST", body: JSON.stringify({ eid: "nodom", ok: true }) });
    assert.equal((await handleEvents(env, req, new URL(req.url), "/api/admin/entity/claim", { id: 4, admin: true }, J)).status, 200);
    assert.equal(raw.prepare("SELECT confirmed FROM org_entity WHERE org_id=7").get().confirmed, 1);
    const req2 = new Request("https://api.test/api/admin/entity/claim", { method: "POST", body: JSON.stringify({ eid: "acme", ok: true }) });
    await handleEvents(env, req2, new URL(req2.url), "/api/admin/entity/claim", { id: 4, admin: true }, J);
    assert.equal(raw.prepare("SELECT confirmed FROM org_entity WHERE org_id=8").get().confirmed, 0, "einfaches Mitglied: nicht bestätigt");
  } finally { restore(); raw.close(); }
});
