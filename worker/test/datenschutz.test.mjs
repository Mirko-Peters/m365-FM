// Datenschutz nach Kontoloeschung, Privatstellen und Bann (Sicherheitspruefung K21, K22, K23a, K41, K42, K43, K44, K45; privacy.js):
// Inhalte bleiben bei M365.FM, aber anonym ("Former member"); Personendaten verschwinden aus allen oeffentlichen Wegen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession } from "../src/util.js";
import { callTool } from "../src/mcp.js";
import { refreshProfilesExport } from "../src/profiles.js";
import { importSearchIndex } from "../src/search.js";
import { importEntitiesFromSite } from "../src/entities.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const realFetch = globalThis.fetch;
let searchPart = null;   // Attrappe fuer den Suchindex des letzten Seitenbaus
let siteEnts = [];   // Attrappe fuer /entities.json des letzten Seitenbaus
let srcEnts = null;   // Attrappe fuer /entities-src.json (reine Repo-Fassung)
globalThis.fetch = async (u) => {
  const s = String(u);
  if (srcEnts && s.endsWith("/entities-src.json")) return new Response(JSON.stringify({ entities: srcEnts }), { headers: { "content-type": "application/json" } });
  if (s.endsWith("/entities.json")) return new Response(JSON.stringify({ entities: siteEnts }), { headers: { "content-type": "application/json" } });
  if (searchPart && s.endsWith("/search/manifest.json")) return new Response(JSON.stringify({ generated: "2026-11-16", parts: 1 }), { headers: { "content-type": "application/json" } });
  if (searchPart && s.endsWith("/search/part-1.json")) return new Response(JSON.stringify(searchPart), { headers: { "content-type": "application/json" } });
  return new Response("{}", { status: 404 });
};
process.on("exit", () => { globalThis.fetch = realFetch; });

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (list) => { raw.exec("BEGIN"); try { const out = []; for (const s of list) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SITE, API, SESSION_SECRET: "test-secret-0123456789", ADMIN_SUBS: "" };
  const t = Math.floor(Date.now() / 1000);
  const user = async (id, name, role = "") => { raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,'github',?,?,?,?)").run(id, "s" + id, name, role, t); return `m365s=${await makeSession(env, id)}`; };
  return { raw, db, env, t, user };
}
async function call(env, method, path, cookie = "", body) {
  const headers = { "x-requested-with": "m365", origin: SITE, cookie };
  if (body) headers["content-type"] = "application/json";
  const r = await W.fetch(new Request(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined }), env);
  return { s: r.status, j: await r.clone().json().catch(() => null) };
}
const saveProfile = (env, c, handle, pub, headline = "Senior Consultant at Contoso") => call(env, "POST", "/api/profile/me", c, { handle, public: pub, headline, about: "", channels: [], programs: [], certs: [] });
const entityIds = async (env) => (await call(env, "GET", "/api/entity/export")).j.items.map((x) => x.id);
const cacheRows = (raw) => raw.prepare("SELECT COUNT(*) n FROM export_cache WHERE k='profiles'").get().n;

test("Kontoloeschung: Inhalte bleiben anonym, Personendaten verschwinden (K21, K41, K42, K44, K45)", async () => {
  const { raw, env, t, user } = await setup();
  const alice = await user(1, "Alice Example"), mallory = await user(3, "Mallory");
  assert.equal((await saveProfile(env, alice, "alice", true)).s, 200);
  assert.ok((await entityIds(env)).includes("alice"), "Personen-Entitaet aus dem Profil angelegt");
  // Blog: ein veroeffentlichter Beitrag mit KI-Uebersetzung, ein Entwurf mit Uebersetzung
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,body,lang,status,created,updated,published) VALUES (10,1,'live-post','Live','Body live','en','live',?,?,?),(11,1,'draft','Draft','Body draft','en','draft',?,?,0)").run(t, t, t, t, t);
  raw.prepare("INSERT INTO item_tr(kind,item_id,lang,title,summary,body,created) VALUES ('blog',10,'de','Live DE','','Text live DE',?),('blog',11,'de','Entwurf DE','','Text Entwurf DE',?)").run(t, t);
  raw.prepare("INSERT INTO translation(kind,item_id,lang,field,text,src,created) VALUES ('blog','11','de','body','Text Entwurf DE','auto',?),('entity','alice','de','desc','Alice Example ist Mitglied','auto',?)").run(t, t);
  // Bewertung, Speaker-Eintrag in einem fremden Programm, Suchindex
  assert.equal((await call(env, "POST", "/api/reviews", alice, { show: "en", rating: 5, title: "Great show", body: "I love this podcast a lot" })).s, 200);
  await user(2, "Org Owner");
  raw.prepare("INSERT INTO events(id,handle,title,owner_id,public,start,created,updated) VALUES (5,'ev-five','Event',2,1,?,?,?)").run(t + 86400, t, t);
  raw.prepare("INSERT INTO event_sessions(id,event_id,title,speakers,status,proposer_id,created) VALUES (7,5,'Talk',?,'live',2,?)").run(JSON.stringify([{ h: "alice", n: "Alice Example", e: "alice", s: "confirmed" }, { n: "Bob Guest", s: "confirmed" }]), t);
  raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES ('p1',?,'fr','person','Alice','alice','','','','','','h',0,?,''),('p2',?,'en','person','Alice','alice','','','','','','h',0,?,'')").run(SITE + "/fr/community/u/alice/", t, SITE + "/entity/alice/", t);
  await refreshProfilesExport(env);
  assert.equal(cacheRows(raw), 1);

  assert.equal((await call(env, "DELETE", "/api/me", alice)).s, 200);

  assert.equal(cacheRows(raw), 0, "Profil-Export-Zwischenspeicher sofort verworfen (K45)");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM search_doc WHERE gone=0").get().n, 0, "Suchtreffer sofort entfernt (K45)");
  // K41: Personen-Entitaet samt Uebersetzungen und Anspruch weg
  assert.ok(!(await entityIds(env)).includes("alice"));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='alice'").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claims WHERE eid='alice'").get().n, 0);
  assert.ok(!JSON.stringify((await call(env, "GET", "/api/translations/export?kind=entity")).j).includes("Alice Example"));
  // K21: Uebersetzungs-Export liefert keine Community-Inhalte; Uebersetzung des Entwurfs weg (auch die Quelle), der veroeffentlichte Beitrag bleibt anonym
  assert.equal((await call(env, "GET", "/api/translations/export?kind=blog")).s, 400);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM item_tr WHERE kind='blog' AND item_id=11").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM translation WHERE kind='blog' AND item_id='11'").get().n, 0);
  const live = raw.prepare("SELECT user_id,title FROM blog_posts WHERE id=10").get();
  assert.ok(live && live.user_id < 0, "Beitrag bleibt, ohne Konto (anonym)");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_posts WHERE id=11").get().n, 0, "Entwurf geloescht");
  assert.ok(!JSON.stringify((await call(env, "GET", "/api/blog/export")).j).includes("Body live"), "nicht mehr unter dem alten Profil");
  // K44: Bewertung bleibt, anonym
  const rv = (await call(env, "GET", "/api/reviews?show=en")).j;
  assert.equal(rv.count, 1); assert.equal(rv.items[0].name, "Former member"); assert.equal(rv.items[0].handle, "");
  assert.ok(raw.prepare("SELECT user_id FROM show_reviews").get().user_id < 0);
  // K42: Speaker-Eintrag bleibt anonym; der naechste Inhaber der Adresse erbt nichts
  const sp = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers);
  assert.deepEqual(sp[0], { n: "Former member", s: "confirmed", anon: 1 }); assert.equal(sp[1].n, "Bob Guest");
  assert.equal((await saveProfile(env, mallory, "alice", true)).s, 200, "Adresse ist wieder frei");
  assert.equal((await callTool(env, { id: 3, name: "Mallory" }, "update_my_session", { session_id: 7, abstract: "x", recording_url: "https://evil.example/" })).error, "not_found");
  assert.equal((await call(env, "POST", "/api/speaker/claim", mallory, { name: "Former member" })).s, 404, "anonyme Eintraege beansprucht niemand");
  assert.ok((await entityIds(env)).includes("alice"), "der neue Inhaber bekommt seine eigene Personen-Entitaet");
  assert.ok(!JSON.stringify((await call(env, "GET", "/api/entity?id=alice")).j).includes("Alice Example"));
});

test("Privatstellen: Personen-Entitaet, Export, Suche und Kurzzeile verschwinden; zurueck bei oeffentlich (K22, K41, K45)", async () => {
  const { raw, env, t, user } = await setup();
  const bob = await user(1, "Bob Example");
  assert.equal((await saveProfile(env, bob, "bob", true)).s, 200);
  assert.equal((await call(env, "GET", "/api/u/1")).j.user.bio, "Senior Consultant at Contoso");
  raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES ('p1',?,'en','person','Bob','bob','','','','','','h',0,?,'')").run(SITE + "/community/u/bob/", t);
  await refreshProfilesExport(env);
  assert.equal((await saveProfile(env, bob, "bob", false, "Secret Co")).s, 200);
  assert.equal(cacheRows(raw), 0, "K45");
  assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id='p1'").get().gone, 1, "K45");
  assert.ok(!(await entityIds(env)).includes("bob"), "K41");
  assert.ok(!JSON.stringify(await callTool(env, null, "get_entity", { id: "bob" })).includes("Bob Example"), "K41: auch nicht per MCP");
  assert.equal((await call(env, "GET", "/api/u/1")).s, 404, "K22: kein oeffentliches Profil, kein Kommentar");
  assert.equal(raw.prepare("SELECT bio FROM users WHERE id=1").get().bio, "", "K22: Kurzzeile eines privaten Profils nicht in users.bio");
  raw.prepare("INSERT INTO comments(user_id,vid,lang,body,status,created) VALUES (1,'ep1','en','Hallo','ok',?)").run(t);
  raw.prepare("UPDATE users SET bio='Secret Co' WHERE id=1").run();   // Altbestand
  assert.equal((await call(env, "GET", "/api/u/1")).j.user.bio, "", "K22: Kommentator mit privatem Profil ohne Kurzzeile");
  raw.prepare("INSERT INTO comments(user_id,vid,lang,body,status,created) VALUES (1,'ep1','de','Hallo','ok',?)").run(t);
  const top = (await call(env, "GET", "/api/curator?lang=de")).j.top;
  assert.equal(top.length, 1); assert.equal(top[0].bio, "", "K22: Kurator-Rangliste ohne Kurzzeile eines privaten Profils");
  // Suchindex aus dem letzten Bau bringt das Profil nicht zurueck
  searchPart = { part: 1, docs: [{ id: "p1", url: SITE + "/community/u/bob/", lang: "en", type: "person", title: "Bob", summary: "", keywords: "" }, { id: "e1", url: SITE + "/episodes/x/", lang: "en", type: "episode", title: "Folge", summary: "", keywords: "" }] };
  try { await importSearchIndex(env); } finally { searchPart = null; }
  assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id='p1'").get().gone, 1, "bleibt entfernt");
  assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id='e1'").get().gone, 0, "andere Treffer normal");
  assert.equal((await saveProfile(env, bob, "bob", true)).s, 200);
  assert.ok((await entityIds(env)).includes("bob"), "wieder oeffentlich -> wieder da");
});

test("Bann: Mitgliedersuche, Team, Teilnehmer, Bewertungen und Personen-Entitaet ohne gesperrte Person (K43, K45)", async () => {
  const { raw, env, t, user } = await setup();
  const carol = await user(1, "Carol Example"), admin = await user(2, "Admin", "admin");
  assert.equal((await saveProfile(env, carol, "carol", true)).s, 200);
  assert.equal((await call(env, "POST", "/api/reviews", carol, { show: "en", rating: 4, title: "Nice show", body: "Good episodes every week" })).s, 200);
  raw.prepare("INSERT INTO events(id,handle,title,owner_id,public,start,created,updated) VALUES (5,'ev-five','Event',2,1,?,?,?)").run(t + 86400, t, t);
  raw.prepare("INSERT INTO event_roles(event_id,user_id,role,created) VALUES (5,1,'helfer',?)").run(t);
  raw.prepare("INSERT INTO event_attendees(event_id,user_id,status,visible,created) VALUES (5,1,'going',1,?)").run(t);
  assert.equal((await callTool(env, null, "search_members", { query: "Carol" })).members.length, 1);
  raw.prepare("INSERT INTO events(id,handle,title,owner_id,public,start,created,updated) VALUES (6,'ev-carol','Carols Event',1,1,?,?,?)").run(t + 86400, t, t);
  raw.prepare("INSERT INTO entity_claims(eid,user_id,status,created) VALUES ('carol-co',1,'verified',?)").run(t);
  const carolOrganizer = async () => (await call(env, "GET", "/api/events/export")).j.events.find((e) => e.handle === "ev-carol").organizer;
  assert.deepEqual(await carolOrganizer(), { kind: "u", handle: "carol", name: "Carol Example" });
  assert.ok(JSON.stringify((await call(env, "GET", "/api/entity/claims")).j).includes("carol"));
  await refreshProfilesExport(env);
  assert.equal((await call(env, "POST", "/api/admin/ban/1", admin)).s, 200);
  assert.deepEqual(await carolOrganizer(), { kind: "u", handle: "", name: "" }, "K43: Veranstalter ohne Name und Adresse des gesperrten Kontos");
  assert.deepEqual((await call(env, "GET", "/api/entity/claims")).j.claims, [], "K43: keine Beanspruchung eines gesperrten Kontos");
  assert.equal(cacheRows(raw), 0, "K45");
  assert.deepEqual((await callTool(env, null, "search_members", { query: "Carol" })).members, []);
  assert.ok(!JSON.stringify(await callTool(env, null, "get_event_team", { handle: "ev-five" })).includes("carol"));
  assert.ok(!JSON.stringify((await call(env, "GET", "/api/event/ev-five/attendees")).j).includes("carol"));
  assert.ok(!JSON.stringify((await call(env, "GET", "/api/event/ev-five/team")).j).includes("carol"));
  const rv = (await call(env, "GET", "/api/reviews?show=en")).j.items[0];
  assert.equal(rv.handle, ""); assert.notEqual(rv.name, "Carol Example");
  assert.ok(!(await entityIds(env)).includes("carol"), "K41");
});

test("Adresswechsel: Speaker-Eintraege wandern mit, der neue Inhaber der alten Adresse erbt nichts (K42)", async () => {
  const { raw, env, t, user } = await setup();
  const dave = await user(1, "Dave Example"), eve = await user(2, "Eve");
  assert.equal((await saveProfile(env, dave, "dave", true)).s, 200);
  raw.prepare("INSERT INTO events(id,handle,title,owner_id,public,start,created,updated) VALUES (5,'ev-five','Event',2,1,?,?,?)").run(t + 86400, t, t);
  raw.prepare("INSERT INTO event_sessions(id,event_id,title,speakers,status,proposer_id,created) VALUES (7,5,'Talk',?,'live',2,?),(8,5,'Panel',?,'live',2,?)")
    .run(JSON.stringify([{ h: "dave", n: "Dave Example", e: "dave", s: "confirmed" }]), t, JSON.stringify([{ h: "dave", n: "Dave Example", s: "declined" }]), t);
  assert.equal((await saveProfile(env, dave, "dave2", true)).s, 200);
  assert.deepEqual(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers)[0], { h: "dave2", n: "Dave Example", e: "dave2", s: "confirmed" });
  assert.equal((await saveProfile(env, eve, "dave", true)).s, 200);
  assert.equal((await callTool(env, { id: 2, name: "Eve" }, "update_my_session", { session_id: 7, abstract: "x" })).error, "not_found");
  assert.equal((await callTool(env, { id: 1, name: "Dave Example" }, "update_my_session", { session_id: 7, abstract: "Neu" })).ok, true, "der Speaker selbst weiter");
  // Abgelehnte Anfrage laesst sich nicht nachtraeglich bestaetigen (frueher ohne Statuspruefung)
  assert.equal((await call(env, "POST", "/api/speaker/respond", dave, { id: 8, ok: true })).s, 409);
  assert.equal(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=8").get().speakers)[0].s, "declined");
  // Adresse ganz entfernt (Profil privat ohne Adresse): Profil-Bindung weg, Name bleibt, Eintrag bleibt an das Konto gebunden (uid)
  assert.equal((await call(env, "POST", "/api/profile/me", dave, { handle: "", public: false, headline: "" })).s, 200);
  assert.deepEqual(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers)[0], { n: "Dave Example", s: "confirmed", uid: 1 });
  // Ein anderes Mitglied mit gleichem Namen (oeffentliches Profil) kann ihn weder vorgeschlagen bekommen noch beanspruchen
  const dave3 = await user(4, "Dave Example");
  assert.equal((await saveProfile(env, dave3, "dave-other", true)).s, 200);
  assert.deepEqual((await call(env, "GET", "/api/speaker/suggest", dave3)).j.suggestions, []);
  assert.equal((await call(env, "POST", "/api/speaker/claim", dave3, { name: "Dave Example" })).s, 404);
  // Speichert der Veranstalter die Session, bleibt die Bindung (kein Verknuepfen per Name mit dem anderen Profil)
  raw.prepare("UPDATE events SET owner_id=2 WHERE id=5").run();
  assert.equal((await call(env, "POST", "/api/event/ev-five/session", eve, { id: 7, title: "Talk", speakers: [{ n: "Dave Example" }] })).s, 200);
  const sp7 = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers)[0];
  assert.equal(sp7.h, undefined, "nicht mit dem gleichnamigen Profil verknuepft"); assert.equal(sp7.uid, 1);
  // Dave selbst bekommt eine neue Adresse und beansprucht den Eintrag wieder
  assert.equal((await saveProfile(env, dave, "dave-new", true)).s, 200);
  assert.equal((await call(env, "POST", "/api/speaker/claim", dave, { name: "Dave Example" })).j?.linked, 2, "beide Sessions (7 und 8)");
  const back = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers)[0];
  assert.equal(back.h, "dave-new"); assert.equal(back.uid, undefined);
});

test("Profil-Export: veralteter Zwischenspeicher hoechstens einen Tag als Rueckfall (K23a)", () => {
  const src = readFileSync(new URL("../src/profiles.js", import.meta.url), "utf-8");
  assert.match(src, /if \(hit && now\(\) - hit\.updated < 86400\) return J\(JSON\.parse\(hit\.v\)/);
});

test("Personen-Merker: fremder Vorschlag 'Selbst verwaltet'/person blendet eine Event-Entitaet nicht aus; Kontoloeschung des Inhabers laesst sie stehen (K41)", async () => {
  const { raw, env, t, user } = await setup();
  const owner = await user(1, "Event Owner"), mallory = await user(3, "Mallory");
  raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES ('ev-conf',?,'Selbst verwaltet',1,'live',?)").run(JSON.stringify({ name: "Conf", type: "event", desc: { en: "Conf is an event." } }), t);
  raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES ('ev-conf',1,'verified','owner',?)").run(t);
  const r = await call(env, "POST", "/api/entity", mallory, { id: "ev-conf", data: { name: "Conf", type: "person", desc: { en: "Conf is a person in the community." } }, summary: "Selbst verwaltet" });
  assert.equal(r.s, 200); assert.equal(r.j.status, "pending");
  assert.ok((await entityIds(env)).includes("ev-conf"), "Vorschlag eines Mitglieds blendet nichts aus");
  assert.equal((await call(env, "GET", "/api/entity?id=ev-conf")).s, 200);
  assert.ok(JSON.stringify(await callTool(env, null, "get_entity", { id: "ev-conf" })).includes("Conf"));
  assert.equal((await call(env, "DELETE", "/api/me", owner)).s, 200);
  assert.ok(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='ev-conf' AND status IN ('live','old')").get().n >= 1, "Geschichte der Event-Entitaet bleibt (nichts loeschen)");
  assert.ok((await entityIds(env)).includes("ev-conf"));
});

test("Kontoloeschung: der naechste Cron holt die Personen-Entitaet nicht aus /entities.json zurueck (K41)", async () => {
  const { raw, env, t, user } = await setup();
  const alice = await user(1, "Alice Example");
  assert.equal((await saveProfile(env, alice, "alice", true)).s, 200);
  const exported = (await call(env, "GET", "/api/entity/export")).j.items.find((x) => x.id === "alice");
  assert.ok(exported, "vor der Loeschung im Export");
  raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES ('p2',?,'en','person','Alice','alice','','','','','','h',0,?,'')").run(SITE + "/entity/alice/", t);
  assert.equal((await call(env, "DELETE", "/api/me", alice)).s, 200);
  // letzter Seitenbau: /entities.json enthaelt die Person noch (D1-Export eingemischt), der Suchindex ebenso
  siteEnts = [{ id: "alice", ...exported.data }, { id: "m365", name: "Microsoft 365", type: "product" }];
  searchPart = { part: 1, docs: [{ id: "p2", url: SITE + "/entity/alice/", lang: "en", type: "person", title: "Alice Example", summary: "Senior Consultant", keywords: "" }] };
  try {
    await importEntitiesFromSite(env);
    await importSearchIndex(env);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='alice'").get().n, 0, "nicht neu angelegt");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='m365'").get().n, 1, "andere Eintraege normal");
    assert.ok(!(await entityIds(env)).includes("alice"));
    assert.equal((await call(env, "GET", "/api/entity?id=alice")).s, 404);
    assert.ok(!JSON.stringify(await callTool(env, null, "get_entity", { id: "alice" })).includes("Alice Example"), "auch nicht ueber /entities.json im MCP");
    assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id='p2'").get().gone, 1, "Suchtreffer bleibt entfernt");
  } finally { siteEnts = []; searchPart = null; }
  // Die frei gewordene Adresse gehoert dem naechsten Inhaber samt eigener Personen-Entitaet
  const bob = await user(2, "Bob Example");
  assert.equal((await saveProfile(env, bob, "alice", true)).s, 200);
  assert.ok((await entityIds(env)).includes("alice"));
  assert.equal(raw.prepare("SELECT user_id FROM person_entity WHERE eid='alice'").get().user_id, 2);
});

test("Kontoloeschung: steht dieselbe id spaeter redaktionell im Repo, wird der Merker aufgehoben (K41)", async () => {
  const { raw, env, user } = await setup();
  const alice = await user(1, "Alice Example");
  assert.equal((await saveProfile(env, alice, "alice", true)).s, 200);
  assert.equal((await call(env, "DELETE", "/api/me", alice)).s, 200);
  assert.equal(raw.prepare("SELECT user_id FROM person_entity WHERE eid='alice'").get().user_id, 0);
  const guest = { id: "alice", name: "Alice Guest", type: "person", desc: { en: "Alice Guest is a podcast guest." } };
  siteEnts = [guest]; srcEnts = [guest];
  try {
    await importEntitiesFromSite(env);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM person_entity WHERE eid='alice'").get().n, 0, "Merker aufgehoben");
    assert.equal((await call(env, "GET", "/api/entity?id=alice")).s, 200);
    assert.ok(JSON.stringify(await callTool(env, null, "get_entity", { id: "alice" })).includes("Alice Guest"), "MCP liefert die Repo-Fassung");
    await importEntitiesFromSite(env);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='alice' AND status='live'").get().n, 1, "der naechste Cron legt die Repo-Fassung an");
  } finally { siteEnts = []; srcEnts = null; }
});

test("Kontoloeschung: Merker aufgehoben, /entities.json noch mit veralteter Profil-Fassung - zwei Cron-Laeufe holen sie nicht zurueck (K41)", async () => {
  const { raw, env, user } = await setup();
  const alice = await user(1, "Alice Example");
  assert.equal((await saveProfile(env, alice, "alice", true, "Secret Headline Contoso")).s, 200);
  const exported = (await call(env, "GET", "/api/entity/export")).j.items.find((x) => x.id === "alice");
  assert.ok(JSON.stringify(exported).includes("Secret Headline Contoso"), "Profiltext steht vor der Loeschung im Export");
  assert.equal((await call(env, "DELETE", "/api/me", alice)).s, 200);
  // Repo hat inzwischen einen Gast mit gleicher id; der letzte Seitenbau (/entities.json) enthaelt aber noch die D1-Profil-Fassung
  srcEnts = [{ id: "alice", name: "Alice Guest", type: "person", desc: { en: "Alice Guest is a podcast guest." } }];
  siteEnts = [{ id: "alice", ...exported.data }];
  const leak = (s) => /Secret Headline Contoso|Alice Example/.test(s);
  try {
    for (let run = 1; run <= 2; run++) {
      await importEntitiesFromSite(env);
      assert.equal(raw.prepare("SELECT COUNT(*) n FROM person_entity WHERE eid='alice'").get().n, 0, `Lauf ${run}: Merker aufgehoben`);
      assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='alice' AND status='live'").get().n, 1, `Lauf ${run}: genau eine live-Fassung`);
      const revs = raw.prepare("SELECT data,summary FROM entity_rev WHERE eid='alice'").all();
      assert.ok(!revs.some((r) => leak(r.data)), `Lauf ${run}: keine Revision mit Profiltext`);
      const ex = JSON.stringify((await call(env, "GET", "/api/entity/export")).j.items.find((x) => x.id === "alice"));
      assert.ok(ex.includes("Alice Guest"), `Lauf ${run}: Export liefert die Repo-Fassung`);
      assert.ok(!leak(ex), `Lauf ${run}: Export ohne Profiltext`);
      assert.ok(!leak(JSON.stringify(await callTool(env, null, "get_entity", { id: "alice" }))), `Lauf ${run}: MCP ohne Profiltext`);
    }
  } finally { siteEnts = []; srcEnts = null; }
});

test("Anonymer Speaker-Eintrag bleibt anonym, wenn der Veranstalter die Session speichert - auch mit einem Profil 'Former member' (K42)", async () => {
  const { raw, env, t, user } = await setup();
  const org = await user(2, "Org Owner"), mallory = await user(3, "Mallory");
  raw.prepare("UPDATE users SET name='Former member' WHERE id=3").run();
  assert.equal((await saveProfile(env, mallory, "mallory", true)).s, 200);
  raw.prepare("INSERT INTO events(id,handle,title,owner_id,public,start,created,updated) VALUES (5,'ev-five','Event',2,1,?,?,?)").run(t + 86400, t, t);
  raw.prepare("INSERT INTO event_sessions(id,event_id,title,speakers,status,proposer_id,created) VALUES (7,5,'Talk',?,'live',2,?)").run(JSON.stringify([{ n: "Former member", s: "confirmed", anon: 1 }, { n: "Bob Guest", s: "confirmed" }]), t);
  assert.equal((await call(env, "POST", "/api/event/ev-five/session", org, { id: 7, title: "Talk", speakers: [{ n: "Former member" }, { n: "Bob Guest" }] })).s, 200);
  const sp = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers);
  assert.deepEqual(sp[0], { n: "Former member", s: "confirmed", anon: 1 }, "kein Handle, anon bleibt");
  assert.equal(sp[1].n, "Bob Guest");
  assert.equal((await call(env, "POST", "/api/speaker/respond", mallory, { id: 7, ok: true })).s, 409);
  assert.equal((await call(env, "POST", "/api/speaker/claim", mallory, { name: "Former member" })).s, 404);
});

test("Migration 0054: Rueckfuellung nur aus der ersten Fassung von ownedEntity, nicht aus spaeteren Vorschlaegen (K41)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url), files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files.filter((f) => f < "0054")) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const ins = raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES (?,?,?,?,?,1)");
  ins.run("alice", JSON.stringify({ name: "Alice", type: "person" }), "Selbst verwaltet", 1, "old");
  ins.run("alice", JSON.stringify({ name: "Alice", type: "person", web: "https://a.example/" }), "Web", 1, "live");
  ins.run("ev-conf", JSON.stringify({ name: "Conf", type: "event" }), "Selbst verwaltet", 2, "live");
  ins.run("ev-conf", JSON.stringify({ name: "Conf", type: "person" }), "Selbst verwaltet", 3, "pending");
  ins.run("ev-conf", JSON.stringify({ name: "Conf", type: "person" }), "Selbst verwaltet", 3, "rejected");
  const cl = raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES (?,?,'verified','owner',1)");
  cl.run("alice", 1); cl.run("ev-conf", 2);
  const m = readFileSync(new URL("0054_person_entity.sql", dir), "utf-8");
  raw.exec(m); raw.exec(m);   // idempotent
  assert.deepEqual(raw.prepare("SELECT eid,user_id FROM person_entity ORDER BY eid").all().map((r) => ({ ...r })), [{ eid: "alice", user_id: 1 }]);
});
