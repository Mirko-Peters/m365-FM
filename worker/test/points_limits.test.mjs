// Sicherheitspruefung, Paket "Punkte und Limits" (K3, K28, K37, K38, K39, K40): Limits und Punkte duerfen sich weder durch parallele
// Anfragen (Promise.all, MCP-Batch) noch durch selbst vergebene Punkte aushebeln lassen. Alles ueber den echten Worker-Eingang mit einer
// SQLite-D1 im Speicher; die Attrappe fuehrt jede Abfrage erst nach einem Rundgang durch die Ereignisschleife aus (wie der Netzweg zu D1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession, rateLimit } from "../src/util.js";
import { stats, evalBadges, isTrusted, trustPoints } from "../src/badges.js";
import { dailyLimit, MAX_BONUS } from "../src/messages.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }, { id: "azure", type: "product", name: "Azure" }];
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const u = String(input?.url || input);
  if (u.startsWith(SITE + "/") && (u.endsWith("/entities.json") || u.endsWith("/entities-src.json"))) return new Response(JSON.stringify({ entities: ENTS }), { headers: { "content-type": "application/json" } });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};
const NOW = () => Math.floor(Date.now() / 1000);
const hop = () => new Promise((r) => setImmediate(r));
const exec = (st, a) => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };

async function mk(n = 30) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    // jede Abfrage laeuft erst nach einem Rundgang durch die Ereignisschleife - wie der Netzweg zu D1; so verschraenken sich parallele Anfragen
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { await hop(); return { results: st.all(...a) }; }, first: async () => { await hop(); return st.get(...a) ?? null; }, run: async () => { await hop(); return exec(st, a); } }; o._sync = () => exec(st, a); return o; },
    batch: async (l) => { await hop(); raw.exec("BEGIN"); try { const out = l.map((s) => s._sync()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test" };
  for (let id = 1; id <= n; id++) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, "Person " + id, id === 1 ? "admin" : "user");
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  return { raw, db, env };
}
function ins(raw, table, row) {
  const cols = raw.prepare(`PRAGMA table_info(${table})`).all(), r = { ...row };
  for (const c of cols) if (c.notnull && c.dflt_value === null && !c.pk && !(c.name in r)) r[c.name] = /INT|REAL|NUM/i.test(c.type) ? 0 : "";
  const k = Object.keys(r);
  return Number(raw.prepare(`INSERT INTO ${table}(${k.map((x) => `"${x}"`).join(",")}) VALUES(${k.map(() => "?").join(",")})`).run(...k.map((x) => r[x])).lastInsertRowid);
}
async function call(env, uid, method, path, body) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}) };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, { waitUntil() {} });
  return { s: r.status, j: await r.json().catch(() => null) };
}
const one = (raw, sql, ...a) => raw.prepare(sql).get(...a);
const badges = (raw, uid, k) => { for (let i = 0; i < k; i++) raw.prepare("INSERT INTO user_badges(user_id,badge,earned) VALUES(?,?,1)").run(uid, "test_" + i); };   // je 5 Punkte

// ---------- K37/K40: rateLimit atomar ----------
test("K37/K40: rateLimit laesst auch bei parallelen Aufrufen nur max durch (Fenster neu, laufend und abgelaufen)", async () => {
  const { raw, db } = await mk(1);
  const r1 = await Promise.all(Array.from({ length: 10 }, () => rateLimit(db, "yt:9", 1, 7 * 86400)));   // Wochenlimit 1 (Video-/Podcast-Upload)
  assert.equal(r1.filter(Boolean).length, 1, "genau ein Upload je Woche, auch im Schwall");
  const r2 = await Promise.all(Array.from({ length: 20 }, () => rateLimit(db, "mset:9", 4, 3600)));
  assert.equal(r2.filter(Boolean).length, 4); assert.equal(one(raw, "SELECT n FROM ratelimit WHERE k='mset:9'").n, 4);
  assert.equal(await rateLimit(db, "mset:9", 4, 3600), false, "danach bleibt es gesperrt");
  raw.prepare("UPDATE ratelimit SET win=win-3600 WHERE k='mset:9'").run();   // Fenster abgelaufen: wieder max, nicht mehr
  const r3 = await Promise.all(Array.from({ length: 20 }, () => rateLimit(db, "mset:9", 4, 3600)));
  assert.equal(r3.filter(Boolean).length, 4);
});

// ---------- K39 (und K17 ueber die Website): Tageslimit fuer neue Kontakte ----------
test("K39: 20 parallele /api/msg/start an verschiedene Profile legen nur dailyLimit (5) neue Kontakte an", async () => {
  const { raw, env } = await mk(25);
  assert.equal(await dailyLimit(env.DB, 4), 5);
  const to = Array.from({ length: 20 }, (_, i) => "user-" + (5 + i));
  const rs = await Promise.all(to.map((h) => call(env, 4, "POST", "/api/msg/start", { to: h, body: "Hallo, kurze Frage zum Event." })));
  assert.equal(rs.filter((r) => r.s === 200).length, 5);
  assert.equal(rs.filter((r) => r.s === 429 && r.j.error === "daily_limit").length, 15);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM msg_threads WHERE a_id=4").n, 5);
  // zwei parallele Nachrichten an dieselbe Person: ein Thread, zwei Nachrichten, kein Fehler aus UNIQUE(a_id,b_id)
  const { raw: raw2, env: env2 } = await mk(6);
  const two = await Promise.all([1, 2].map((k) => call(env2, 4, "POST", "/api/msg/start", { to: "user-5", body: "Nachricht Nummer " + k })));
  assert.deepEqual(two.map((r) => r.s), [200, 200]);
  assert.equal(one(raw2, "SELECT COUNT(*) n FROM msg_threads").n, 1);
  assert.equal(one(raw2, "SELECT COUNT(*) n FROM msg_messages").n, 2);
});

// ---------- K38: Einloesen atomar, Bonus gedeckelt ----------
test("K38: parallele Einloesungen buchen nie mehr ab als das Guthaben; der Kontakt-Bonus hat einen Tagesdeckel", async () => {
  const { raw, env } = await mk(6);
  badges(raw, 4, 20);   // genau 100 Punkte (plus oeffentliches Profil 10 = 110)
  assert.equal((await stats(env.DB, 4)).balance, 110);
  const rs = await Promise.all(Array.from({ length: 5 }, () => call(env, 4, "POST", "/api/points/redeem", { item: "contacts" })));
  assert.equal(rs.filter((r) => r.s === 200).length, 1, JSON.stringify(rs));
  assert.ok(rs.filter((r) => r.s !== 200).every((r) => r.j.error === "not_enough"));
  assert.equal(one(raw, "SELECT COUNT(*) n FROM points_spent WHERE user_id=4").n, 1);
  assert.equal(one(raw, "SELECT extra FROM msg_bonus WHERE user_id=4").extra, 5);
  assert.ok((await stats(env.DB, 4)).balance >= 0);
  // viel Guthaben: hoechstens 4 Einloesungen je Tag, das Tageslimit steigt hoechstens um MAX_BONUS
  badges(raw, 5, 400);
  const seq = []; for (let i = 0; i < 6; i++) seq.push(await call(env, 5, "POST", "/api/points/redeem", { item: "contacts" }));
  assert.deepEqual(seq.map((r) => r.s), [200, 200, 200, 200, 429, 429]);
  assert.equal(seq[4].j.error, "limit");
  assert.equal(one(raw, "SELECT COUNT(*) n FROM points_spent WHERE user_id=5").n, 4, "am Deckel wird nichts abgebucht");
  raw.prepare("UPDATE msg_bonus SET extra=5000 WHERE user_id=5").run();   // alter Bestand vor dem Deckel
  assert.ok(await dailyLimit(env.DB, 5) <= 25 + MAX_BONUS);
});

test("K38: ask-sponsor - parallele Anfragen an verschiedene Firmen: 2 frei, der Rest nur mit Punkten", async () => {
  const { raw, env } = await mk(12);
  const ev = ins(raw, "events", { handle: "mein-event", owner_id: 4, title: "Mein Event", start: "2027-01-01", seeking_sponsor: 1, public: 1, created: 1, updated: 1 });
  for (let k = 0; k < 4; k++) {
    const o = ins(raw, "orgs", { handle: "firma-" + k, name: "Firma " + k, public: 1, created: 1 });
    ins(raw, "org_members", { org_id: o, user_id: 6 + k, role: "owner", status: "active", created: 1 });
    ins(raw, "org_sponsor", { org_id: o, open: 1, updated: 1 });
  }
  const rs = await Promise.all([0, 1, 2, 3].map((k) => call(env, 4, "POST", "/api/events/ask-sponsor", { event: "mein-event", org: "firma-" + k, body: "Wir suchen einen Sponsor fuer unser Event." })));
  assert.equal(rs.filter((r) => r.s === 200).length, 2, JSON.stringify(rs));
  assert.equal(rs.filter((r) => r.s === 402 && r.j.error === "need_points").length, 2);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM sponsor_asks WHERE event_id=?", ev).n, 2);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM points_spent").n, 0);
  // mit genug Punkten fuer genau eine bezahlte Anfrage: zwei parallele -> eine geht durch, eine nicht; Guthaben nie negativ
  badges(raw, 4, 198);   // 990 + Profil 10 = 1000
  const ok = rs.map((r, k) => (r.s === 200 ? -1 : k)).filter((k) => k >= 0);
  const paid = await Promise.all(ok.map((k) => call(env, 4, "POST", "/api/events/ask-sponsor", { event: "mein-event", org: "firma-" + k, body: "Wir suchen einen Sponsor fuer unser Event." })));
  assert.deepEqual(paid.map((r) => r.s).sort(), [200, 402]);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM points_spent WHERE item='sponsor_ask'").n, 1);
  assert.ok((await stats(env.DB, 4)).balance >= 0);
});

// ---------- K3: Speaker-Punkte nur fuer von anderen bestaetigte Sessions auf geprueften Events ----------
test("K3: selbst eingetragener Speaker, Entwurf, Vorschlag oder fremder confirmed-Eintrag geben keine Speaker-Punkte", async () => {
  const { raw, env } = await mk(6);
  const sp = (...l) => JSON.stringify(l.map(([h, s]) => ({ h, n: h, s })));
  const sess = (event_id, proposer_id, status, speakers) => ins(raw, "event_sessions", { event_id, title: "Session", speakers, status, proposer_id, created: 1 });
  await evalBadges(env, 4); await evalBadges(env, 6);   // Abzeichen vorab vergeben (newcomer), damit nur Speaker-Punkte den Unterschied machen
  const base = (await stats(env.DB, 4)).earned;
  // eigener Entwurf (nie geprueft), 3 Sessions mit sich selbst als Speaker
  const draft = ins(raw, "events", { handle: "entwurf", owner_id: 4, title: "Entwurf", start: "2027-01-01", public: 0, review: "draft", created: 1, updated: 1 });
  for (let i = 0; i < 3; i++) sess(draft, 4, "live", sp(["user-4", "confirmed"]));
  // fremdes, freigegebenes Event: eigener Vorschlag (pending) und eigene, angenommene Session (proposer = man selbst)
  const other = ins(raw, "events", { handle: "fremd", owner_id: 5, title: "Fremd", start: "2027-01-01", public: 1, review: "approved", created: 1, updated: 1 });
  sess(other, 4, "pending", sp(["user-4", "confirmed"]));
  sess(other, 4, "live", sp(["user-4", "confirmed"]));
  // Session des Veranstalters: user-6 bestaetigt, user-4 nur eingeladen
  sess(other, 5, "live", sp(["user-6", "confirmed"], ["user-4", "invited"]));
  assert.equal((await stats(env.DB, 4)).earned, base, "keine Speaker-Punkte fuer Selbstbestaetigung");
  assert.equal((await stats(env.DB, 6)).earned - base, 100, "user-6: vom Veranstalter eingetragen, selbst bestaetigt");
  await evalBadges(env, 4);
  assert.equal(one(raw, "SELECT COUNT(*) n FROM user_badges WHERE user_id=4 AND badge='speaker'").n, 0);
  assert.equal(await isTrusted(env.DB, { id: 4, created: 1 }), false);
  // ueber die API: Session auf dem eigenen Entwurf mit sich selbst als Speaker -> nach wie vor 0
  assert.equal((await call(env, 4, "POST", "/api/event/entwurf/session", { title: "Noch eine Session", speakers: [{ h: "user-4" }] })).s, 200);
  assert.equal((await stats(env.DB, 4)).earned, base);
  // Deckel: hoechstens 20 Sessions zaehlen
  for (let i = 0; i < 25; i++) sess(other, 5, "live", sp(["user-6", "confirmed"]));
  assert.equal((await stats(env.DB, 6)).earned - base, 2000);
});

// ---------- K28: Vertrauensschwelle ----------
test("K28: 25 selbst erzeugte Punkte (Profil, Blog, Abzeichen) machen nicht vertrauenswuerdig; fremd gepruefte Punkte und Kontoalter schon", async () => {
  const { raw, env } = await mk(12);
  const t = NOW();
  // Konto 8: frisch, oeffentliches Profil, ein live Blogbeitrag, Abzeichen newcomer + author = die alten 25 Punkte aus drei Anfragen
  raw.prepare("UPDATE users SET created=? WHERE id IN (8,10)").run(t);
  ins(raw, "blog_posts", { user_id: 8, slug: "b8", title: "Beitrag", summary: "", body: "x".repeat(300), lang: "de", topics: "[]", status: "live", created: t, updated: t });
  for (const b of ["newcomer", "author"]) raw.prepare("INSERT INTO user_badges(user_id,badge,earned) VALUES(?,?,?)").run(8, b, t);
  assert.equal((await stats(env.DB, 8)).points, 25, "Punkte fuer die Anzeige bleiben");
  assert.equal(await trustPoints(env.DB, 8), 0);
  const w = await call(env, 8, "POST", "/api/wiki", { term: "teams", lang: "de", body: "Microsoft Teams ist die Plattform fuer Chat und Meetings." });
  assert.equal(w.j.status, "pending");
  const pend = ins(raw, "wiki_rev", { term: "azure", lang: "de", body: "Vorschlag eines anderen Mitglieds", user_id: 7, status: "pending", created: t });
  assert.equal((await call(env, 8, "POST", "/api/edits/vote", { kind: "wiki", id: pend, v: 1 })).j.error, "not_trusted");
  // Konto 9: alt, 9 freigegebene Wiki-Aenderungen (27 fremd gepruefte Punkte) -> live
  for (let i = 0; i < 9; i++) ins(raw, "wiki_rev", { term: "azure", lang: "en", body: "alt " + i, user_id: 9, status: "old", created: 1 });
  assert.equal((await call(env, 9, "POST", "/api/wiki", { term: "teams", lang: "de", body: "Microsoft Teams ist die Plattform fuer Chat und Meetings." })).j.status, "live");
  // Konto 10: dieselben Punkte, aber Konto juenger als 7 Tage -> pending
  for (let i = 0; i < 9; i++) ins(raw, "wiki_rev", { term: "azure", lang: "en", body: "neu " + i, user_id: 10, status: "old", created: t });
  assert.equal(await trustPoints(env.DB, 10), 27);
  assert.equal((await call(env, 10, "POST", "/api/wiki", { term: "azure", lang: "de", body: "Azure ist die Cloud-Plattform von Microsoft fuer alles." })).j.status, "pending");
  // Konto 11: alt, aber nur Aenderungen an der eigenen, selbst verwalteten Entitaet (gehen ohne Pruefung live) -> zaehlen nicht
  ins(raw, "entity_claims", { eid: "user-11", user_id: 11, status: "verified", via: "owner", created: 1 });
  for (let i = 0; i < 9; i++) ins(raw, "entity_rev", { eid: "user-11", data: "{}", summary: i ? "Profil" : "Selbst verwaltet", user_id: 11, status: "old", created: 1 });
  assert.equal(await trustPoints(env.DB, 11), 0);
  assert.equal(await isTrusted(env.DB, { id: 11, created: 1 }), false);
  // Redaktion und Admin bleiben ohne Schwelle vertrauenswuerdig
  assert.equal(await isTrusted(env.DB, { id: 1, admin: true, created: t }), true);
});

test("K28: vier frische Konten, die sich gegenseitig als Experten bestaetigen, stimmen keine wartende Aenderung live", async () => {
  const { raw, env } = await mk(12);
  const t = NOW(), ring = [3, 4, 5, 6];
  raw.prepare(`UPDATE users SET created=? WHERE id IN (${ring.join(",")})`).run(t);
  for (const o of ring) {
    raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',?,?,3)").run(o, "teams");
    for (const by of ring) if (by !== o) raw.prepare("INSERT INTO endorsements(owner_id,eid,by_id,created) VALUES(?,?,?,?)").run(o, "teams", by, t);
  }
  const pend = ins(raw, "wiki_rev", { term: "teams", lang: "de", body: "Vorschlag eines Zweitkontos", user_id: 6, status: "pending", created: t });
  for (const uid of [3, 4, 5]) assert.equal((await call(env, uid, "POST", "/api/edits/vote", { kind: "wiki", id: pend, v: 1 })).j.error, "not_trusted");
  assert.equal(one(raw, "SELECT status FROM wiki_rev WHERE id=?", pend).status, "pending");
  assert.equal(one(raw, "SELECT COUNT(*) n FROM edit_votes").n, 0);
  assert.equal((await call(env, 3, "GET", "/api/edits/pending?kind=wiki&key=teams&lang=de")).j.can_vote, false);
});

test("K28: von einem Eigentuemer der Entitaet per Einzelstimme freigegebene Aenderungen zaehlen nicht als Fremdpruefung", async () => {
  const { raw, env } = await mk(12);
  ins(raw, "entity_claims", { eid: "teams", user_id: 7, status: "verified", via: "owner", created: 1 });
  for (let i = 0; i < 9; i++) {
    const id = ins(raw, "entity_rev", { eid: "teams", data: "{}", summary: "Zweitkonto " + i, user_id: 8, status: "old", created: 1 });
    raw.prepare("INSERT INTO edit_votes(kind,rev_id,user_id,v,created) VALUES('entity',?,7,1,1)").run(id);
  }
  assert.equal(await trustPoints(env.DB, 8), 0);
  assert.equal(await isTrusted(env.DB, { id: 8, created: 1 }), false);
  // per Redaktion oder Abstimmung freigegebene Aenderungen an fremden Entitaeten zaehlen weiter
  for (let i = 0; i < 9; i++) ins(raw, "entity_rev", { eid: "azure", data: "{}", summary: "fremd " + i, user_id: 9, status: "old", created: 1 });
  assert.equal(await trustPoints(env.DB, 9), 27);
});
