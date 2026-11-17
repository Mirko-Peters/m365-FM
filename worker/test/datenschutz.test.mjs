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

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const realFetch = globalThis.fetch;
let searchPart = null;   // Attrappe fuer den Suchindex des letzten Seitenbaus
globalThis.fetch = async (u) => {
  const s = String(u);
  if (s.endsWith("/entities.json")) return new Response(JSON.stringify({ entities: [] }), { headers: { "content-type": "application/json" } });
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
  await refreshProfilesExport(env);
  assert.equal((await call(env, "POST", "/api/admin/ban/1", admin)).s, 200);
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
  // Adresse ganz entfernt (Profil privat ohne Adresse): Bindung weg, Name bleibt
  assert.equal((await call(env, "POST", "/api/profile/me", dave, { handle: "", public: false, headline: "" })).s, 200);
  assert.deepEqual(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=7").get().speakers)[0], { n: "Dave Example", s: "confirmed" });
});

test("Profil-Export: veralteter Zwischenspeicher hoechstens einen Tag als Rueckfall (K23a)", () => {
  const src = readFileSync(new URL("../src/profiles.js", import.meta.url), "utf-8");
  assert.match(src, /if \(hit && now\(\) - hit\.updated < 86400\) return J\(JSON\.parse\(hit\.v\)/);
});
