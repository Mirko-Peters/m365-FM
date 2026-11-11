// Geschaeftsadresse im Profil (/api/profile/business) und Adress-Nachweis bei der Uebernahme (/api/entity/claim/evidence), Migration 0046.
// Wunsch 11.11.2026 (iFAKT): ohne Firmen-E-Mail die Geschaeftsadresse als Nachweis, die Redaktion entscheidet - nie automatisch.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { addressMatch, cleanAddress, companyAddress, normStreet, handleClaimVerify, BIZ_MAX } from "../src/claimverify.js";
import { handleProfiles, deleteUserData, RESERVED_HANDLES } from "../src/profiles.js";
import { callTool } from "../src/mcp.js";
import { handleEvents, purgeEntityClaimReview } from "../src/events.js";
import { mergeStatements } from "../src/identities.js";
import { makeSession } from "../src/util.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const ADDR = { street: "Curiestr. 2", zip: "70563", city: "Stuttgart", country: "Germany" };
const entities = [
  { id: "acme", type: "org", name: "Acme GmbH", web: "https://www.acme.de", ...ADDR },
  { id: "acme-tool", type: "product", name: "Acme Tool", rel: [["developed_by", "acme"]] },
  { id: "nodom", type: "org", name: "No Domain Inc" },
  { id: "other", type: "org", name: "Other AG", web: "https://other.example" },
  { id: "someone", type: "person", name: "Some One" },
  ...Array.from({ length: BIZ_MAX + 1 }, (_, i) => ({ id: "co-" + i, type: "org", name: "Co " + i })),
];
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = { prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { const r = raw.prepare(sql).run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const mails = [], env = { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "s", MAIL_FROM: "M365 <no@m365.fm>", EMAIL: { send: async (m) => { mails.push(m); return { messageId: "m" + mails.length }; } } };
  for (const id of [1, 2, 3, 4]) { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'github',?,?,1)").run(id, "s" + id, "User " + id); raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,1)").run(id, "user" + id); }
  raw.prepare("UPDATE users SET role='editor' WHERE id=3").run(); raw.prepare("UPDATE users SET role='admin' WHERE id=4").run();
  return { raw, env, mails };
}
const withEntities = () => { const old = globalThis.fetch; globalThis.fetch = async (i) => { const u = String(i); return u.endsWith("/entities-src.json") || u.endsWith("/entities.json") ? { ok: true, json: async () => ({ entities }) } : { ok: false, json: async () => ({}) }; }; return () => { globalThis.fetch = old; }; };
const req = (path, method, body) => new Request("https://api.test" + path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });
const biz = async (env, user, method = "GET", body, q = "") => { const r = req("/api/profile/business" + q, method, body); return handleProfiles(env, r, new URL(r.url), "/api/profile/business", user, J); };
const cv = async (env, path, user, body, method = "POST") => { const r = req(path, method, method === "POST" ? body : null); return handleClaimVerify(env, r, new URL(r.url), new URL(r.url).pathname, user, J); };
const ev = (env, path, user, body, method = "POST") => { const r = req(path, method, method === "POST" ? body : null); return handleEvents(env, r, new URL(r.url), path, user, J); };
const claim = (raw, eid, uid, status = "pending") => raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES(?,?,?,'manual',1)").run(eid, uid, status);
const U = (id) => ({ id, name: "User " + id });
const EDITOR = { id: 3, name: "User 3", role: "editor" }, ADMIN = { id: 4, name: "User 4", admin: true };

test("Abgleich: Str./Strasse/Straße, Gross/Klein, Leerzeichen und Hausnummer; ohne Firmenadresse unknown", () => {
  for (const s of ["Curiestr. 2", "Curiestraße 2", "CURIESTRASSE  2", "Curie-Straße 2", "curie str. 2"]) assert.equal(normStreet(s), "curiestr2", s);
  assert.equal(normStreet("Königstraße 2 a"), normStreet("Koenigstr. 2A"));
  assert.notEqual(normStreet("Curiestr. 2"), normStreet("Curiestr. 20"));   // Hausnummer zaehlt
  const co = { street: "Curiestr. 2", zip: "70563" };
  assert.equal(addressMatch({ street: "Curiestraße 2", zip: "70 563" }, co), "yes");
  assert.equal(addressMatch({ street: "Curiestraße 2", zip: "70565" }, co), "no");   // PLZ muss gleich sein
  assert.equal(addressMatch({ street: "Curiestraße 4", zip: "70563" }, co), "no");
  assert.equal(addressMatch({ street: "Curiestraße 2", zip: "70563" }, null), "unknown");
  assert.equal(addressMatch({ street: "x 1", zip: "12345" }, { street: "", zip: "12345" }), "unknown");
  const map = new Map(entities.map((e) => [e.id, e]));
  assert.deepEqual(companyAddress(map.get("acme-tool"), map), { street: "Curiestr. 2", zip: "70563", city: "Stuttgart" });   // Produkt: Adresse der Entwickler-Firma
  assert.equal(companyAddress(map.get("nodom"), map), null);
  assert.equal(companyAddress({ type: "person", ...ADDR }, map), null);   // nur Firmen
  assert.deepEqual(cleanAddress({ street: "  Curiestr.   2 ", zip: "70563", city: "Stuttgart", country: "Germany" }), ADDR);
  for (const [k, v] of [["street", "<b>x</b> 1"], ["street", "ab"], ["street", "x".repeat(121)], ["zip", "1"], ["zip", "7056;3"], ["city", "S"], ["country", 'De"u'], ["street", "Haupt\u0000str 1"]]) assert.equal(cleanAddress({ ...ADDR, [k]: v }).error, "bad_" + k, k + "=" + v);
  assert.equal(cleanAddress({ ...ADDR, zip: "SW1A 1AA", city: "Saint-Étienne", street: "O'Connell St. 5/7" }).zip, "SW1A 1AA");
});

test("Profil: Geschaeftsadresse speichern, aendern, loeschen - nur eigene, nur Firmen-Entitaeten, Laengen, Grenze", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    assert.equal((await biz(env, null)).status, 401);
    assert.equal((await biz(env, null, "POST", { eid: "acme", ...ADDR })).status, 401);
    assert.equal((await biz(env, U(1), "POST", { eid: "someone", ...ADDR })).status, 400);   // Person: keine Firma
    assert.equal((await (await biz(env, U(1), "POST", { eid: "gibtsnicht", ...ADDR })).json()).error, "bad_entity");
    assert.equal((await (await biz(env, U(1), "POST", { eid: "acme", ...ADDR, zip: "<1>" })).json()).error, "bad_zip");
    assert.equal((await biz(env, U(1), "POST", { eid: "acme", ...ADDR })).status, 200);
    assert.equal((await biz(env, U(1), "POST", { eid: "acme", ...ADDR, street: "Curiestr. 4" })).status, 200);   // aendern
    const mine = await (await biz(env, U(1))).json();
    assert.deepEqual(mine.items.map((x) => [x.eid, x.company, x.street, x.zip, x.city, x.country]), [["acme", "Acme GmbH", "Curiestr. 4", "70563", "Stuttgart", "Germany"]]);
    assert.deepEqual((await (await biz(env, U(2))).json()).items, [], "fremde Konten sehen nichts");
    assert.equal((await biz(env, U(2), "DELETE", null, "?eid=acme")).status, 404, "fremdes Konto loescht nichts");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1").get().n, 1);
    for (let i = 0; i < BIZ_MAX - 1; i++) assert.equal((await biz(env, U(1), "POST", { eid: "co-" + i, ...ADDR })).status, 200);
    assert.equal((await (await biz(env, U(1), "POST", { eid: "co-" + BIZ_MAX, ...ADDR })).json()).error, "limit");
    assert.equal((await biz(env, U(1), "POST", { eid: "co-0", ...ADDR, city: "Berlin" })).status, 200, "aendern geht auch an der Grenze");
    assert.equal((await biz(env, U(1), "DELETE", null, "?eid=acme")).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1 AND eid='acme'").get().n, 0);
  } finally { restore(); raw.close(); }
});

test("Nachweis: offene Anfrage noetig, Abgleich gespeichert, nie automatisch bestaetigt, Weitergabe verfaellt", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    assert.equal((await cv(env, "/api/entity/claim/evidence", null, { eid: "acme", ...ADDR })).status, 401);
    assert.equal((await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR })).status, 404);   // ohne Anfrage
    claim(raw, "acme", 1);
    assert.equal((await cv(env, "/api/entity/claim/forward", U(1), { eid: "acme", email: "chef@acme.de" })).status, 200);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "forwarded");
    assert.equal((await cv(env, "/api/entity/claim/evidence", U(2), { eid: "acme", ...ADDR })).status, 404, "fremde Anfrage");
    assert.equal((await (await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR, link: "http://acme.de/impressum" })).json()).error, "bad_link");
    assert.equal((await (await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR, note: "x".repeat(501) })).json()).error, "bad_note");
    assert.equal((await (await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR, street: "" })).json()).error, "bad_street");
    const r = await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", street: "Curiestraße 2", zip: "70563", city: "Stuttgart", country: "Deutschland", note: "Ich arbeite im <Marketing>", link: "https://www.acme.de/impressum#x" });
    const j = await r.json();
    assert.equal(r.status, 200); assert.deepEqual(j, { ok: true, status: "pending" }, "der Abgleich geht nicht an das Mitglied");
    const e = raw.prepare("SELECT * FROM entity_claim_evidence WHERE eid='acme'").get();
    assert.deepEqual([e.user_id, e.addr_match, e.note, e.link], [1, "yes", "Ich arbeite im Marketing", "https://www.acme.de/impressum"]);
    const c = raw.prepare("SELECT status,verified_via,fwd_mask FROM entity_claims WHERE eid='acme'").get();
    assert.deepEqual([c.status, c.verified_via, c.fwd_mask], ["pending", "", ""], "Adresse stimmt, trotzdem nur Redaktion");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_mail WHERE kind='forward' AND used=0").get().n, 0, "Weitergabe-Link verfaellt");
    assert.equal((await cv(env, "/api/entity/claim/confirm", { id: 9, name: "Kollege" }, { t: /claimverify=([^&#\s]+)/.exec(mails[0].text)[1] })).status, 410);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business").get().n, 0, "ohne save nichts im Profil");
    // Abweichung und Produkt (Adresse der Entwickler-Firma) / Firma ohne Adresse
    claim(raw, "acme-tool", 2); claim(raw, "nodom", 2, "email_sent");
    await cv(env, "/api/entity/claim/evidence", U(2), { eid: "acme-tool", ...ADDR, zip: "70565", save: true });
    await cv(env, "/api/entity/claim/evidence", U(2), { eid: "nodom", ...ADDR, save: true });
    assert.deepEqual(raw.prepare("SELECT eid,addr_match FROM entity_claim_evidence WHERE user_id=2 ORDER BY eid").all().map((x) => Object.values(x)), [["acme-tool", "no"], ["nodom", "unknown"]]);
    assert.deepEqual(raw.prepare("SELECT eid,company FROM profile_business WHERE user_id=2").all().map((x) => Object.values(x)), [["nodom", "No Domain Inc"]], "save: nur Firmen kommen ins Profil");
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='nodom'").get().status, "pending");
    // Vorbefuellung und eigener Nachweis nur fuer das eigene Konto
    const d1 = await (await cv(env, "/api/entity/claim/domains?eid=acme", U(1), null, "GET")).json();
    assert.equal(d1.evidence.street, "Curiestraße 2"); assert.equal(d1.evidence.addr_match, undefined, "kein Abgleich an das Mitglied");
    const d2 = await (await cv(env, "/api/entity/claim/domains?eid=acme", U(2), null, "GET")).json();
    assert.equal(d2.evidence, null);
    const d3 = await (await cv(env, "/api/entity/claim/domains?eid=nodom", U(2), null, "GET")).json();
    assert.equal(d3.biz.street, "Curiestr. 2");
    const mine = await (await ev(env, "/api/entity/claim/mine", U(1), null, "GET")).json();
    assert.deepEqual(mine.claims.map((x) => [x.eid, x.status, x.evidence]), [["acme", "pending", 1]]);
    assert.equal((await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR })).status, 200, "aendern geht");
    claim(raw, "someone", 1);   // Personen-Seite: kein Adress-Nachweis
    assert.equal((await (await cv(env, "/api/entity/claim/evidence", U(1), { eid: "someone", ...ADDR })).json()).error, "not_company");
    assert.equal((await (await cv(env, "/api/entity/claim/domains?eid=someone", U(1), null, "GET")).json()).company, false);
    assert.equal(d1.company, true);
  } finally { restore(); raw.close(); }
});

test("Redaktion: Liste zeigt Adresse, Abgleich, Notiz, Link; Admin bestaetigt die eigene Anfrage, Editor nicht; Nachweis danach geloescht, Profiladresse bleibt", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 4); claim(raw, "other", 3);
    assert.equal((await cv(env, "/api/entity/claim/evidence", ADMIN, { eid: "acme", ...ADDR, note: "iFAKT-Fall", link: "https://www.acme.de/impressum", save: true })).status, 200);
    assert.equal((await cv(env, "/api/entity/claim/evidence", EDITOR, { eid: "other", ...ADDR })).status, 200);
    const list = await (await ev(env, "/api/admin/entity/claims", ADMIN, null, "GET")).json();
    const a = list.claims.find((x) => x.eid === "acme"), o = list.claims.find((x) => x.eid === "other");
    assert.deepEqual(a.address, { street: "Curiestr. 2", zip: "70563", city: "Stuttgart", country: "Germany", note: "iFAKT-Fall", link: "https://www.acme.de/impressum" });
    assert.equal(a.address_match, "yes"); assert.equal(o.address_match, "unknown");
    assert.equal((await ev(env, "/api/admin/entity/claims", U(1), null, "GET")).status, 403, "Mitglieder sehen keine Nachweise");
    const own = await ev(env, "/api/admin/entity/claim", EDITOR, { eid: "other", ok: true });
    assert.deepEqual([own.status, (await own.json()).error], [403, "own_content"], "Editor entscheidet nie in eigener Sache");
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='other'").get().status, "pending");
    assert.equal((await ev(env, "/api/admin/entity/claim", ADMIN, { eid: "acme", ok: true })).status, 200, "Admin darf die eigene Uebernahme bestaetigen (perm.js)");
    assert.deepEqual(Object.values(raw.prepare("SELECT status,verified_via FROM entity_claims WHERE eid='acme'").get()), ["verified", "admin"]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_evidence WHERE eid='acme'").get().n, 0, "Nachweis nach der Entscheidung geloescht");
    assert.equal(raw.prepare("SELECT street FROM profile_business WHERE user_id=4 AND eid='acme'").get().street, "Curiestr. 2", "Geschaeftsadresse im Profil bleibt");
    assert.equal((await ev(env, "/api/admin/entity/claim", ADMIN, { eid: "other", ok: false })).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_evidence").get().n, 0, "auch nach Ablehnung geloescht");
    // verwaiste Nachweise (Anfrage anders erledigt) raeumt der Tageslauf weg
    raw.exec("INSERT INTO entity_claim_evidence(eid,user_id,street,zip,city,country,created) VALUES('nodom',2,'a 1','12345','x','y',1)");
    await purgeEntityClaimReview(env.DB);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_evidence").get().n, 0);
  } finally { restore(); raw.close(); }
});

test("Firmen-E-Mail bestaetigt: Adress-Nachweis entfaellt sofort", async () => {
  const { raw, env, mails } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR });
    await cv(env, "/api/entity/claim/domain", U(1), { eid: "acme", email: "max@acme.de" });
    assert.equal((await cv(env, "/api/entity/claim/confirm", U(1), { t: /claimverify=([^&#\s]+)/.exec(mails[0].text)[1] })).status, 200);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "verified");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_evidence").get().n, 0);
  } finally { restore(); raw.close(); }
});

test("Konten zusammenfuehren: Geschaeftsadressen wandern (bei gleicher Firma gilt die des Zielkontos), Nachweis folgt der Anfrage", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR });
    await biz(env, U(1), "POST", { eid: "acme", ...ADDR, city: "Quelle" }); await biz(env, U(1), "POST", { eid: "other", ...ADDR });
    await biz(env, U(2), "POST", { eid: "acme", ...ADDR, city: "Ziel" });
    for (const s of await mergeStatements(env.DB, 1, 2)) await s.run();
    assert.deepEqual(raw.prepare("SELECT user_id,eid,city FROM profile_business ORDER BY eid").all().map((x) => Object.values(x)), [[2, "acme", "Ziel"], [2, "other", "Stuttgart"]]);
    assert.equal(raw.prepare("SELECT user_id FROM entity_claim_evidence WHERE eid='acme'").get().user_id, 2);
    const list = await (await ev(env, "/api/admin/entity/claims", ADMIN, null, "GET")).json();
    assert.equal(list.claims.find((x) => x.eid === "acme").address.street, "Curiestr. 2", "Anfrage und Nachweis passen nach der Zusammenfuehrung zusammen");
  } finally { restore(); raw.close(); }
});

test("Konto loeschen: Geschaeftsadressen und Adress-Nachweise sind weg", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    claim(raw, "acme", 1);
    await cv(env, "/api/entity/claim/evidence", U(1), { eid: "acme", ...ADDR, save: true });
    await biz(env, U(2), "POST", { eid: "acme", ...ADDR });
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1").get().n, 1);
    const session = await makeSession(env, 1);
    const r = await worker.fetch(new Request("https://api.test/api/me", { method: "DELETE", headers: { cookie: `m365s=${session}`, "x-requested-with": "m365" } }), env);
    assert.equal(r.status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1").get().n, 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claim_evidence").get().n, 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=2").get().n, 1, "andere Konten bleiben");
    await deleteUserData(env.DB, 2);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business").get().n, 0);
  } finally { restore(); raw.close(); }
});

test("Routen: CSRF-Kopfzeile Pflicht, Nachweis-Route ist angebunden", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    const session = await makeSession(env, 1);
    const post = (path, headers) => worker.fetch(new Request("https://api.test" + path, { method: "POST", headers: { cookie: `m365s=${session}`, "content-type": "application/json", ...headers }, body: JSON.stringify({ eid: "acme", ...ADDR }) }), env);
    assert.equal((await post("/api/profile/business", {})).status, 400, "ohne x-requested-with");
    assert.equal((await post("/api/entity/claim/evidence", {})).status, 400);
    assert.equal((await post("/api/profile/business", { "x-requested-with": "m365" })).status, 200);
    claim(raw, "acme", 1);
    assert.equal((await post("/api/entity/claim/evidence", { "x-requested-with": "m365" })).status, 200);
  } finally { restore(); raw.close(); }
});

test("Konten zusammenfuehren: Obergrenze der Geschaeftsadressen gilt danach weiter, die zuletzt gepflegten bleiben", async () => {
  const { raw, env } = await setup();
  try {
    const ins = raw.prepare("INSERT INTO profile_business(user_id,eid,company,street,zip,city,country,updated) VALUES(?,?,?,'Weg 1','12345','Ort','Germany',?)");
    for (let i = 0; i < BIZ_MAX; i++) ins.run(1, "co-" + i, "Co " + i, 100 + i);   // Quelle: volle Liste
    ins.run(2, "co-" + BIZ_MAX, "Co " + BIZ_MAX, 500); ins.run(2, "acme", "Acme GmbH", 50);   // Ziel: eine neue und eine alte
    for (const s of await mergeStatements(env.DB, 1, 2)) await s.run();
    const left = raw.prepare("SELECT eid FROM profile_business WHERE user_id=2 ORDER BY updated DESC").all().map((x) => x.eid);
    assert.equal(left.length, BIZ_MAX);
    assert.deepEqual(left.slice(0, 2), ["co-" + BIZ_MAX, "co-" + (BIZ_MAX - 1)]);
    assert.ok(!left.includes("acme") && !left.includes("co-0"), "die aeltesten entfallen");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1").get().n, 0);
  } finally { raw.close(); }
});

test("Handles me, business und company sind gesperrt: sie wuerden /api/profile/<handle> verdecken (Profil und MCP)", async () => {
  const { raw, env } = await setup();
  try {
    assert.deepEqual([...RESERVED_HANDLES], ["me", "business", "company"]);
    for (const handle of RESERVED_HANDLES) {   // "me" ist schon zu kurz (bad_handle), business und company waeren gueltig
      const r = req("/api/profile/me", "POST", { handle, public: 1 }), want = handle === "me" ? ["bad_handle", 400] : ["handle_taken", 409];
      const res = await handleProfiles(env, r, new URL(r.url), "/api/profile/me", U(1), J);
      assert.equal(res.status, want[1], handle); assert.equal((await res.json()).error, want[0]);
      assert.equal((await callTool(env, U(2), "update_my_profile", { handle })).error, want[0], "MCP " + handle);
    }
    assert.deepEqual(raw.prepare("SELECT handle FROM profiles WHERE user_id IN (1,2) ORDER BY user_id").all().map((x) => x.handle), ["user1", "user2"]);
    const r = req("/api/profile/me", "POST", { handle: "business-mirko", public: 0 });
    assert.equal((await handleProfiles(env, r, new URL(r.url), "/api/profile/me", U(1), J)).status, 200, "Handle mit dem Wort darin bleibt erlaubt");
  } finally { raw.close(); }
});
