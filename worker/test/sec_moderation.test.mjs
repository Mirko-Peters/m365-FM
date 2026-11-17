// Sicherheits-Audit, Paket Moderation und Rechte: je Befund ein Regressionstest ueber den echten Worker-Eingang (index.js fetch) mit Sitzungs-Cookie.
// Nutzer wie in editor_rules.test.mjs: 1 Admin, 2 Editor, 3 Moderator, 4 Mitglied (Autor), 5 Editor, 6 Mitglied, 7 Fach-Editor (Bereich: teams)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession } from "../src/util.js";
import { isPushEndpoint, sendPush } from "../src/push.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }, { id: "azure", type: "product", name: "Azure" }, { id: "contoso", type: "org", name: "Contoso", web: "https://www.contoso.com" }];
const realFetch = globalThis.fetch;
let extraFetch = null;   // je Test: (url, init) -> Response | undefined
globalThis.fetch = async (input, init) => {
  const u = String(input?.url || input);
  if (extraFetch) { const r = await extraFetch(u, init); if (r) return r; }
  if (u.startsWith(SITE + "/") && (u.endsWith("/entities.json") || u.endsWith("/entities-src.json"))) return new Response(JSON.stringify({ entities: ENTS }), { headers: { "content-type": "application/json" } });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};

async function mk(envExtra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (l) => { raw.exec("BEGIN"); try { const out = []; for (const s of l) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test", ...envExtra };
  for (const [id, name, role] of [[1, "Admin", "admin"], [2, "Edi", "editor"], [3, "Mo", "moderator"], [4, "Autor", "user"], [5, "Edi2", "editor"], [6, "Mitglied", "user"], [7, "Fach", "editor"]]) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, name, role);
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  ins(raw, "editor_scope", { user_id: 7, topics: '["teams"]', langs: "[]", updated: 1 });
  return { raw, db, env };
}
function ins(raw, table, row) {
  const cols = raw.prepare(`PRAGMA table_info(${table})`).all(), r = { ...row };
  for (const c of cols) if (c.notnull && c.dflt_value === null && !c.pk && !(c.name in r)) r[c.name] = /INT|REAL|NUM/i.test(c.type) ? 0 : "";
  const k = Object.keys(r);
  return Number(raw.prepare(`INSERT INTO ${table}(${k.map((x) => `"${x}"`).join(",")}) VALUES(${k.map(() => "?").join(",")})`).run(...k.map((x) => r[x])).lastInsertRowid);
}
async function call(env, uid, method, path, body, headers = {}) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}), ...headers };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined, redirect: "manual" }), env, { waitUntil() {} });
  const text = await r.text();
  let j = null; try { j = JSON.parse(text); } catch {}
  return { s: r.status, j, text, headers: r.headers };
}

// ---------- K30: erneutes Speichern hebt das Ausblenden der Moderation nicht auf ----------
test("K30: Blogbeitrag erneut speichern laesst das Moderations-Bit im Feed stehen", async () => {
  const { raw, env } = await mk();
  ins(raw, "blog_posts", { id: 50, user_id: 4, slug: "p50", title: "Beitrag 50", summary: "Kurz", body: "Text", lang: "de", topics: "[]", status: "live", created: 100, updated: 100, published: 100 });
  const save = (title) => call(env, 4, "POST", "/api/blog/save", { id: 50, title, summary: "Kurz", body: "Ein Text fuer den Beitrag.", lang: "de", topics: [] });
  assert.equal((await save("Erster Titel")).s, 200);
  const f = raw.prepare("SELECT id,hidden FROM feed_items WHERE owner_id=4").get();
  assert.equal(f.hidden, 0);
  assert.equal((await call(env, 1, "POST", "/api/admin/feed-hide", { id: f.id, hidden: true })).s, 200);
  assert.equal((await save("Zweiter Titel")).s, 200);
  const g = raw.prepare("SELECT title,hidden FROM feed_items WHERE id=?").get(f.id);
  assert.equal(g.title, "Zweiter Titel");
  assert.equal(g.hidden & 1, 1, "Moderations-Bit bleibt");
  const feed = await call(env, 0, "GET", "/api/feed");
  assert.ok(!(feed.j?.items || []).some((x) => x.id === f.id), "nicht im Feed");
  // Mitglieds-Bit (2) loescht das Speichern weiterhin
  raw.prepare("UPDATE feed_items SET hidden=2 WHERE id=?").run(f.id);
  await save("Dritter Titel");
  assert.equal(raw.prepare("SELECT hidden FROM feed_items WHERE id=?").get(f.id).hidden, 0);
});

test("K30: Sprach- oder Profilnamenwechsel beim Speichern legt keinen sichtbaren Feed-Eintrag am Moderations-Bit vorbei an", async () => {
  const { raw, env } = await mk();
  ins(raw, "blog_posts", { id: 50, user_id: 4, slug: "p50", title: "Beitrag 50", summary: "Kurz", body: "Text", lang: "de", topics: "[]", status: "live", created: 100, updated: 100, published: 100 });
  ins(raw, "blog_posts", { id: 51, user_id: 4, slug: "p51", title: "Beitrag 51", summary: "Kurz", body: "Text", lang: "de", topics: "[]", status: "live", created: 100, updated: 100, published: 100 });
  const save = (id, lang) => call(env, 4, "POST", "/api/blog/save", { id, title: "Titel " + lang, summary: "Kurz", body: "Ein Text fuer den Beitrag.", lang, topics: [] });
  const rows = (slug) => raw.prepare("SELECT id,url,hidden FROM feed_items WHERE owner_id=4 AND url LIKE ? ORDER BY id").all(`%/blog/${slug}/`);
  assert.equal((await save(50, "de")).s, 200); assert.equal((await save(51, "de")).s, 200);
  const f = rows("p50")[0];
  assert.equal((await call(env, 1, "POST", "/api/admin/feed-hide", { id: f.id, hidden: true })).s, 200);
  // Sprachwechsel: neue Adresse, aber ausgeblendet
  assert.equal((await save(50, "fr")).s, 200);
  assert.equal(rows("p50").length, 2);
  assert.ok(rows("p50").every((r) => (r.hidden & 1) === 1), JSON.stringify(rows("p50")));
  // Profilname geaendert: wieder neue Adresse, wieder ausgeblendet
  raw.prepare("UPDATE profiles SET handle='neu-4' WHERE user_id=4").run();
  assert.equal((await save(50, "fr")).s, 200);
  assert.equal(rows("p50").length, 3);
  assert.ok(rows("p50").every((r) => (r.hidden & 1) === 1), JSON.stringify(rows("p50")));
  const feed = async () => (await call(env, 0, "GET", "/api/feed")).j?.items || [];
  assert.ok(!(await feed()).some((x) => /\/blog\/p50\//.test(x.url)), "Beitrag 50 nicht im Feed");
  // der andere Beitrag desselben Mitglieds ist nicht betroffen
  assert.equal((await save(51, "fr")).s, 200);
  assert.ok(rows("p51").every((r) => r.hidden === 0));
  assert.ok((await feed()).some((x) => /\/blog\/p51\//.test(x.url)), "Beitrag 51 im Feed");
  // die Moderation gibt die aktuelle Zeile frei: sie erscheint, und erneutes Speichern sperrt sie nicht wieder
  const curRow = rows("p50").at(-1);
  assert.equal((await call(env, 1, "POST", "/api/admin/feed-hide", { id: curRow.id, hidden: false })).s, 200);
  assert.equal((await save(50, "fr")).s, 200);
  assert.equal(raw.prepare("SELECT hidden FROM feed_items WHERE id=?").get(curRow.id).hidden, 0);
  assert.ok((await feed()).some((x) => x.id === curRow.id));
});

// ---------- K31: ausgeblendete Bewertung kommt durch Loeschen und Neuanlegen nicht zurueck ----------
test("K31: ausgeblendete Bewertung - eigenes Loeschen leert nur den Text, Neuanlegen bleibt gesperrt", async () => {
  const { raw, env } = await mk();
  const r = ins(raw, "show_reviews", { show: "en", user_id: 4, rating: 1, title: "Boese", body: "Ganz boeser Text hier", status: "published", created: 1, updated: 1 });
  assert.equal((await call(env, 2, "POST", "/api/reviews/delete", { id: r })).s, 200);
  assert.equal(raw.prepare("SELECT status FROM show_reviews WHERE id=?").get(r).status, "hidden");
  assert.equal((await call(env, 4, "POST", "/api/reviews/delete", { id: r })).s, 200);
  const row = raw.prepare("SELECT status,title,body FROM show_reviews WHERE id=?").get(r);
  assert.deepEqual({ ...row }, { status: "hidden", title: "", body: "" });
  const p = await call(env, 4, "POST", "/api/reviews", { show: "en", rating: 5, body: "0123456789 neuer Text" });
  assert.equal(p.s, 403); assert.equal(p.j.error, "hidden");
  const g = await call(env, 0, "GET", "/api/reviews?show=en");
  assert.equal(g.j.count, 0); assert.equal(g.j.items.length, 0);
  // nicht ausgeblendete eigene Bewertung wird weiter wirklich geloescht
  const r2 = ins(raw, "show_reviews", { show: "en", user_id: 6, rating: 4, created: 1, updated: 1 });
  assert.equal((await call(env, 6, "POST", "/api/reviews/delete", { id: r2 })).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM show_reviews WHERE id=?").get(r2).n, 0);
});

// ---------- K7: Firmen-Admin kann den Inhaber weder herabstufen noch entfernen ----------
test("K7: approve gilt nur fuer wartende Mitglieder; Inhaber und Admins bleiben geschuetzt", async () => {
  const { raw, env } = await mk();
  const o = ins(raw, "orgs", { handle: "firma-x", name: "Firma X", public: 1, created: 1 });
  for (const [uid, role, status] of [[1, "owner", "active"], [2, "admin", "active"], [5, "admin", "active"], [4, "member", "pending"], [6, "editor", "active"]]) ins(raw, "org_members", { org_id: o, user_id: uid, role, status, created: 1 });
  const roleOf = (uid) => ({ ...raw.prepare("SELECT role,status FROM org_members WHERE org_id=? AND user_id=?").get(o, uid) });
  const mem = (uid, body) => call(env, uid, "POST", "/api/org/firma-x/member", body);
  // (a) Admin stuft den Inhaber per approve herab -> abgelehnt
  const a = await mem(2, { action: "approve", user_id: 1, role: "member" });
  assert.equal(a.s, 409); assert.equal(a.j.error, "not_pending");
  assert.deepEqual(roleOf(1), { role: "owner", status: "active" });
  // (b) Admin stuft einen anderen Admin per approve herab -> abgelehnt
  assert.equal((await mem(2, { action: "approve", user_id: 5, role: "member" })).s, 409);
  assert.deepEqual(roleOf(5), { role: "admin", status: "active" });
  // (c) Inhaber entfernen geht nicht
  assert.equal((await mem(2, { action: "remove", user_id: 1 })).s, 400);
  assert.deepEqual(roleOf(1), { role: "owner", status: "active" });
  // (e) aktives Mitglied per approve umstufen geht nicht (nur ueber "role")
  assert.equal((await mem(2, { action: "approve", user_id: 6, role: "member" })).s, 409);
  assert.deepEqual(roleOf(6), { role: "editor", status: "active" });
  // (d) wartende Anfrage freigeben geht weiter
  assert.equal((await mem(2, { action: "approve", user_id: 4, role: "member" })).s, 200);
  assert.deepEqual(roleOf(4), { role: "member", status: "active" });
  // Rolle-Zweig: Admin darf den Inhaber nicht herabstufen
  assert.equal((await mem(2, { action: "role", user_id: 1, role: "member" })).s, 403);
  assert.deepEqual(roleOf(1), { role: "owner", status: "active" });
});

// ---------- K4: Meldungen zur eigenen Expert-Connect-Antwort entscheidet nicht der Antwort-Autor ----------
test("K4: expert_report zu einer Antwort - own_content prueft den Antwort-Autor", async () => {
  const { raw, env } = await mk();
  const er = ins(raw, "expert_requests", { user_id: 4, title: "Anfrage", description: "Beschreibung", status: "open", lang: "de", created: 1 });
  const rp = ins(raw, "expert_request_replies", { request_id: er, user_id: 3, body: "Antwort des Moderators", created: 2 });
  ins(raw, "expert_request_reports", { request_id: er, user_id: 4, reply_id: rp, reason: "unpassend", created: 3 });
  const id = `${er}:${rp}`, left = () => raw.prepare("SELECT COUNT(*) n FROM expert_request_reports WHERE request_id=? AND reply_id=?").get(er, rp).n;
  // Pruefliste: der Antwort-Autor (Moderator 3) sieht den Eintrag als eigenen, ohne Schaltflaeche
  const q = await call(env, 3, "GET", "/api/editor/queue?kind=expert_report");
  const it = (q.j.items || []).find((x) => x.id === id);
  assert.ok(it, "Eintrag in der Pruefliste"); assert.equal(it.own, true); assert.equal(it.actions.resolve, "no");
  // Entscheidung in eigener Sache: 403 own_content, Meldung bleibt
  const d = await call(env, 3, "POST", "/api/editor/decide", { kind: "expert_report", id, action: "resolve" });
  assert.equal(d.s, 403); assert.equal(d.j.error, "own_content"); assert.equal(left(), 1);
  // eigene Firma des Antwort-Autors
  const o = ins(raw, "orgs", { handle: "firma-k4", name: "Firma", public: 1, created: 1 });
  ins(raw, "org_members", { org_id: o, user_id: 3, role: "member", status: "active", created: 1 }); ins(raw, "org_members", { org_id: o, user_id: 5, role: "member", status: "active", created: 1 });
  const c = await call(env, 5, "POST", "/api/editor/decide", { kind: "expert_report", id, action: "resolve" });
  assert.equal(c.j.error, "own_company"); assert.equal(left(), 1);
  // unbeteiligter Editor darf
  assert.equal((await call(env, 2, "POST", "/api/editor/decide", { kind: "expert_report", id, action: "resolve" })).s, 200);
  assert.equal(left(), 0);
});

// ---------- K29: Meldungen setzen keine Redaktionsfassung zurueck und brauchen unabhaengige, vertrauenswuerdige Konten ----------
test("K29: Wiki-Meldungen - Redaktionsfassung bleibt, Zweitkonten zaehlen nicht, Ruecknahme protokolliert und wiederherstellbar", async () => {
  const { raw, env } = await mk();
  const NOWS = Math.floor(Date.now() / 1000);
  for (const id of [11, 12, 13]) raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,?)").run(id, "t", "s" + id, "Neu" + id, "user", NOWS);   // frische Zweitkonten
  for (const id of [14, 15, 16]) { raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, "Pro" + id, "user"); ins(raw, "programs", { owner_type: "u", owner_id: id, program: "mvp", verified: 1 }); }
  const st = (id) => raw.prepare("SELECT status FROM wiki_rev WHERE id=?").get(id).status;
  const report = (uid, id) => call(env, uid, "POST", `/api/wiki/report/${id}`);
  // (a) Vandalismus A (Mitglied) live, Editor korrigiert mit B -> drei Meldungen (auch vertrauenswuerdige) setzen B nicht zurueck
  const a = ins(raw, "wiki_rev", { term: "teams", lang: "de", body: "Vandalismus Vandalismus Vandalismus", summary: "", user_id: 6, status: "live", created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/wiki", { term: "teams", lang: "de", body: "Korrektur der Redaktion mit genug Text", summary: "Korrektur" })).j.status, "live");
  const b = raw.prepare("SELECT id FROM wiki_rev WHERE term='teams' AND status='live'").get().id;
  for (const uid of [11, 12, 13, 14, 15, 16]) assert.equal((await report(uid, b)).s, 200);
  assert.equal(st(b), "live"); assert.equal(st(a), "old");
  const exp = await call(env, 0, "GET", "/api/wiki/export?lang=de");
  assert.ok(exp.j.items.some((x) => x.term === "teams" && /Korrektur/.test(x.body)));
  // (b) Mitgliedsfassung C: drei frische Konten zaehlen nicht
  const c0 = ins(raw, "wiki_rev", { term: "azure", lang: "de", body: "Fruehere Fassung mit Text", summary: "", user_id: 4, status: "old", created: 1 });
  const c = ins(raw, "wiki_rev", { term: "azure", lang: "de", body: "Fassung eines Mitglieds mit Text", summary: "", user_id: 6, status: "live", created: 2 });
  for (const uid of [11, 12, 13]) await report(uid, c);
  assert.equal(st(c), "live", "Zweitkonten setzen nichts zurueck");
  // drei vertrauenswuerdige, aeltere Konten: Ruecknahme mit Protokoll, Status wiederherstellbar
  for (const uid of [14, 15]) await report(uid, c);
  assert.equal(st(c), "live");
  await report(16, c);
  assert.equal(st(c), "reported"); assert.equal(st(c0), "live");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE action='wiki.auto_revert' AND item_id=?").get(String(c)).n, 1);
  const rv = await call(env, 2, "POST", "/api/editor/revert", { kind: "wiki", id: String(c0), rev: c, cur: c0 });
  assert.equal(rv.s, 200, JSON.stringify(rv.j)); assert.equal(st(c), "live"); assert.equal(st(c0), "old");
  // (c) Ratelimit: 10 Meldungen je Konto und Tag
  for (let i = 0; i < 10; i++) raw.prepare("INSERT INTO wiki_rev(term,lang,body,summary,user_id,status,created) VALUES('azure','en','x','',6,'live',?)").run(10 + i);
  const ids = raw.prepare("SELECT id FROM wiki_rev WHERE lang='en' ORDER BY id").all().map((r) => r.id);
  let last; for (const id of ids) last = await report(4, id);
  assert.equal(last.s, 200);
  assert.equal((await report(4, b)).s, 429);
});

test("K29: jede Wiki-Meldung erreicht die Pruefliste der Redaktion (Redaktionsfassung, frische Konten, Ruecknahme)", async () => {
  const { raw, env } = await mk();
  const NOWS = Math.floor(Date.now() / 1000);
  for (const id of [11, 12, 13]) raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,?)").run(id, "t", "s" + id, "Neu" + id, "user", NOWS);
  const report = (uid, id) => call(env, uid, "POST", `/api/wiki/report/${id}`);
  const queue = async (uid = 2) => ((await call(env, uid, "GET", "/api/editor/queue")).j?.items || []).filter((x) => x.kind === "wiki_report");
  // (a) Redaktionsfassung, eine Meldung -> Antwort "review" und Eintrag in der Pruefliste
  assert.equal((await call(env, 2, "POST", "/api/wiki", { term: "teams", lang: "de", body: "Korrektur der Redaktion mit genug Text", summary: "Korrektur" })).j.status, "live");
  const b = raw.prepare("SELECT id FROM wiki_rev WHERE term='teams' AND status='live'").get().id;
  const rb = await report(6, b); assert.equal(rb.s, 200); assert.equal(rb.j.status, "review");
  // (b) Mitgliedsfassung, drei Meldungen frischer Konten (zaehlen nicht fuer die Ruecknahme) -> bleibt live, steht aber in der Pruefliste
  const c = ins(raw, "wiki_rev", { term: "azure", lang: "de", body: "Fassung eines Mitglieds mit Text", summary: "", user_id: 6, status: "live", created: 2 });
  for (const uid of [11, 12, 13]) assert.equal((await report(uid, c)).s, 200);
  assert.equal(raw.prepare("SELECT status FROM wiki_rev WHERE id=?").get(c).status, "live");
  const q = await queue();
  const qb = q.find((x) => x.id === String(b)), qc = q.find((x) => x.id === String(c));
  assert.ok(qb, "Redaktionsfassung in der Pruefliste"); assert.ok(qc, "Mitgliedsfassung in der Pruefliste");
  assert.match(qc.title, /3× gemeldet/); assert.deepEqual(qc.topics, ["azure"]);
  assert.equal(qb.own, true); assert.equal(qb.actions.resolve, "no");   // der Verfasser (Editor 2) entscheidet nicht ueber Meldungen zur eigenen Fassung
  assert.ok((await queue(3)).some((x) => x.id === String(c)), "Moderation sieht die Meldungen");
  assert.ok(!(await queue(7)).some((x) => x.id === String(c)), "Fach-Editor (teams) sieht azure nicht");
  // Vorschau und Verlauf der Fassung fuer die Redaktion
  const it = await call(env, 5, "GET", `/api/editor/item?kind=wiki_report&id=${c}`);
  assert.equal(it.s, 200); assert.match(it.j.item.body, /Fassung eines Mitglieds/);
  assert.equal((await call(env, 5, "GET", `/api/editor/history?kind=wiki&id=${c}`)).s, 200);
  // Erledigen = Meldungen verwerfen, mit Protokoll; danach nicht mehr in der Liste; Admin kann es rueckgaengig machen
  const d = await call(env, 5, "POST", "/api/editor/decide", { kind: "wiki_report", id: String(c), action: "resolve" });
  assert.equal(d.s, 200, JSON.stringify(d.j));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM wiki_reports WHERE rev_id=?").get(c).n, 0);
  assert.ok(!(await queue()).some((x) => x.id === String(c)));
  assert.equal((await call(env, 5, "POST", "/api/editor/decide", { kind: "wiki_report", id: String(c), action: "resolve" })).s, 409);
  assert.equal((await call(env, 1, "POST", `/api/admin/editlog/undo/${d.j.log}`)).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM wiki_reports WHERE rev_id=?").get(c).n, 3);
  // eine per Meldungen zurueckgenommene Fassung bleibt sichtbar (Redaktion kann sie ueber den Verlauf wiederherstellen)
  raw.prepare("UPDATE wiki_rev SET status='reported' WHERE id=?").run(c);
  assert.match((await queue()).find((x) => x.id === String(c))?.title || "", /zurückgenommen/);
  // Fassungen ohne Meldung und nicht mehr aktuelle Fassungen erscheinen nicht
  raw.prepare("UPDATE wiki_rev SET status='old' WHERE id=?").run(c);
  assert.ok(!(await queue()).some((x) => x.id === String(c)));
});

test("K29: drei Meldungen blenden einen Kommentar der Redaktion nicht aus", async () => {
  const { raw, env } = await mk();
  const c = ins(raw, "comments", { vid: "v1", lang: "de", user_id: 2, body: "Hinweis der Redaktion", status: "ok", created: 1 });
  const m = ins(raw, "comments", { vid: "v1", lang: "de", user_id: 6, body: "Kommentar eines Mitglieds", status: "ok", created: 1 });
  for (const uid of [3, 4, 5]) { await call(env, uid, "POST", `/api/comments/${c}/report`); }
  for (const uid of [3, 4, 5]) { await call(env, uid, "POST", `/api/comments/${m}/report`); }
  assert.equal(raw.prepare("SELECT status FROM comments WHERE id=?").get(c).status, "ok");
  assert.equal(raw.prepare("SELECT status FROM comments WHERE id=?").get(m).status, "hidden");
});

// ---------- K5: Live-Aenderungen der Redaktion nur ueber can("entity.edit_live"); Langtext beanspruchter Entitaeten nur Inhaber/Admin ----------
test("K5: Entitaeten/Wiki - Editoren schreiben live nur mit can(), owner_only gilt auch fuer Editoren", async () => {
  const { raw, env } = await mk();
  const D = (long) => ({ name: "Azure", type: "product", desc: { en: "Cloud platform of Microsoft.", de: "Cloud-Plattform von Microsoft." }, long: { de: long, en: "" } });
  const live = () => { const r = raw.prepare("SELECT user_id,data FROM entity_rev WHERE eid='azure' AND status='live' ORDER BY id DESC LIMIT 1").get(); return { uid: r.user_id, long: JSON.parse(r.data).long?.de || "" }; };
  ins(raw, "entity_rev", { eid: "azure", data: JSON.stringify(D("Alter Text von Konto vier, laenger.")), summary: "s", user_id: 4, status: "old", created: 1 });
  ins(raw, "entity_rev", { eid: "azure", data: JSON.stringify(D("Inhabertext der Seite mit genug Inhalt.")), summary: "s", user_id: 6, status: "live", created: 2 });
  ins(raw, "entity_claims", { eid: "azure", user_id: 6, via: "email", status: "verified", created: 1 });
  const post = (uid, long, id = "azure", data) => call(env, uid, "POST", "/api/entity", { id, data: data || D(long), summary: "Aenderung" });
  // Fach-Editor 7 (Bereich teams) und Editor 2: Langtext des Inhabers nicht ueberschreibbar (auch nicht mit der alten Fassung - Umgehung von not_editor_edit)
  for (const uid of [7, 2]) {
    const r = await post(uid, "Fremdtext eines Editors der Redaktion."); assert.equal(r.s, 403); assert.equal(r.j.error, "owner_only");
    assert.equal((await post(uid, "Alter Text von Konto vier, laenger.")).j.error, "owner_only");
  }
  assert.deepEqual(live(), { uid: 6, long: "Inhabertext der Seite mit genug Inhalt." });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE action='entity.edit_live'").get().n, 0);
  // Inhaber und Admin duerfen
  assert.equal((await post(6, "Neuer Inhabertext der Seite, live.")).j.status, "live");
  assert.equal((await post(1, "Admin aendert den Langtext der Seite.")).j.status, "live");
  // Fach-Editor ausserhalb seines Bereichs (ohne eigenes Vertrauen als Mitglied): nur Vorschlag, kein Redaktions-Protokoll
  const T = (desc) => ({ name: "Contoso", type: "org", web: "https://www.contoso.com", desc: { en: desc, de: desc } });
  const r7 = await post(7, "", "contoso", T("Contoso company text by topic editor."));
  assert.equal(r7.j.status, "pending");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=7").get().n, 0);
  // Fach-Editor im Bereich: live mit Protokoll
  const r7b = await post(7, "", "teams", { name: "Microsoft Teams", type: "product", desc: { en: "Chat and meetings app.", de: "Chat- und Meeting-App." } });
  assert.equal(r7b.j.status, "live");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=7 AND action='entity.edit_live'").get().n, 1);
  // Editor als Mitglied der Firma, die mit der Entitaet verknuepft ist: own_company -> kein Live-Schreiben als Redaktion
  const o = ins(raw, "orgs", { handle: "contoso-x", name: "Contoso", public: 1, created: 1 });
  ins(raw, "org_entity", { org_id: o, eid: "contoso" }); ins(raw, "org_members", { org_id: o, user_id: 5, role: "member", status: "active", created: 1 });
  assert.equal((await post(5, "", "contoso", T("Contoso text written by own employee."))).j.status, "pending");
  assert.equal((await post(2, "", "contoso", T("Contoso text by an independent editor."))).j.status, "live");
  // Wiki: Fach-Editor ausserhalb des Bereichs -> Vorschlag; im Bereich -> live
  assert.equal((await call(env, 7, "POST", "/api/wiki", { term: "azure", lang: "de", body: "Wiki-Text ausserhalb des Bereichs.", summary: "x" })).j.status, "pending");
  assert.equal((await call(env, 7, "POST", "/api/wiki", { term: "teams", lang: "de", body: "Wiki-Text im eigenen Bereich, live.", summary: "x" })).j.status, "live");
});

// ---------- K10: Push-Registrierung nur fuer bekannte Push-Dienste ----------
test("K10: isPushEndpoint - Allowlist bekannter Push-Dienste", () => {
  for (const ok of ["https://fcm.googleapis.com/fcm/send/abc", "https://updates.push.services.mozilla.com/wpush/v2/x", "https://web.push.apple.com/QX", "https://wns2-par02p.notify.windows.com/w/?token=x"]) assert.equal(isPushEndpoint(ok), true, ok);
  for (const bad of ["https://evil.example/x", "https://fcm.googleapis.com.evil.example/", "https://user@fcm.googleapis.com/", "https://fcm.googleapis.com:8443/", "http://fcm.googleapis.com/x", "https://notify.windows.com.evil/x", "https://evilnotify.windows.com/x", "", "kein url"]) assert.equal(isPushEndpoint(bad), false, bad);
});
test("K10: /api/push/subscribe und /api/topics/follow lehnen fremde Hosts ab; sendPush fragt sie nie an", async () => {
  const { raw, env } = await mk();
  const keys = { p256dh: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U", auth: "8eDyX_uCN0XRhSbY5hs7Hg" };
  const bad = await call(env, 0, "POST", "/api/push/subscribe", { endpoint: "https://evil.example/x", keys, lang: "en" });
  assert.equal(bad.s, 400);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_subs").get().n, 0);
  assert.equal((await call(env, 0, "POST", "/api/push/subscribe", { endpoint: "https://fcm.googleapis.com/fcm/send/abc", keys, lang: "en" })).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_subs").get().n, 1);
  const tf = await call(env, 0, "POST", "/api/topics/follow", { kind: "entity", id: "teams", lang: "en", endpoint: "https://evil.example/y", keys });
  assert.equal(tf.s, 400);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_subs WHERE endpoint LIKE 'https://evil%'").get().n, 0);
  assert.equal((await call(env, 0, "POST", "/api/topics/follow", { kind: "entity", id: "teams", lang: "en", endpoint: "https://fcm.googleapis.com/fcm/send/topic", keys })).s, 200);   // Gegenprobe: derselbe Aufruf mit Push-Dienst geht
  // Alt-Eintrag mit fremdem Host: kein fetch, Abo wird entfernt
  raw.prepare("INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://evil.example/old',?,?,'en',1,1)").run(keys.p256dh, keys.auth);
  let hit = 0; extraFetch = async (u) => { if (u.startsWith("https://evil.example")) { hit++; return new Response("", { status: 201 }); } };
  try { const r = await sendPush(env, { endpoint: "https://evil.example/old", ...keys }, { title: "x" }); assert.equal(r.gone, true); }
  finally { extraFetch = null; }
  assert.equal(hit, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_subs WHERE endpoint='https://evil.example/old'").get().n, 0);
});

// ---------- K9: Bestaetigungslink der Benachrichtigungsadresse bestaetigt erst per Knopf (POST), nicht beim GET des Mailscanners ----------
test("K9: /api/mail/confirm - GET aendert nichts, POST nur vom eingetragenen Konto, Ablauf nach 48 h; /api/email/confirm ebenso per Knopf", async () => {
  const { raw, env } = await mk();
  const NOWS = Math.floor(Date.now() / 1000), T = "tok-0123456789abcdef";
  await call(env, 4, "GET", "/api/mail/me");   // legt die Mail-Tabellen an
  raw.prepare("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(4,'opfer@contoso.com',0,?,?)").run(T, NOWS);
  const ver = () => raw.prepare("SELECT verified FROM mail_addr WHERE user_id=4").get().verified;
  const g = await call(env, 0, "GET", `/api/mail/confirm?t=${T}`);   // Mailscanner ohne Sitzung
  assert.equal(g.s, 200); assert.match(g.text, /<form method="post">/); assert.equal(ver(), 0);
  const raw0 = await W.fetch(new Request(`${API}/api/mail/confirm?t=${T}`, { method: "POST" }), env, { waitUntil() {} });   // Formular-POST ohne Zusatz-Header und ohne Sitzung
  assert.equal(raw0.status, 401); assert.equal(ver(), 0);
  assert.equal((await call(env, 6, "POST", `/api/mail/confirm?t=${T}`)).s, 403); assert.equal(ver(), 0);   // anderes Konto
  const ok = await W.fetch(new Request(`${API}/api/mail/confirm?t=${T}`, { method: "POST", headers: { cookie: `m365s=${await makeSession(env, 4)}` } }), env, { waitUntil() {} });
  assert.equal(ok.status, 200); assert.equal(ver(), 1);
  // abgelaufener Link
  raw.prepare("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(6,'x@contoso.com',0,'tok-abgelaufen-12345',?)").run(NOWS - 3 * 86400);
  assert.equal((await call(env, 6, "POST", "/api/mail/confirm?t=tok-abgelaufen-12345")).s, 404);
  assert.equal(raw.prepare("SELECT verified FROM mail_addr WHERE user_id=6").get().verified, 0);
  // Folgen-Abo ohne Konto
  raw.prepare("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('leser@contoso.com','de','sub-token-1',0,1)").run();
  const sg = await call(env, 0, "GET", "/api/email/confirm?token=sub-token-1&lang=de");
  assert.equal(sg.s, 200); assert.match(sg.text, /<form method="post">/);
  assert.equal(raw.prepare("SELECT confirmed FROM email_subs").get().confirmed, 0);
  const sp = await W.fetch(new Request(`${API}/api/email/confirm?token=sub-token-1&lang=de`, { method: "POST" }), env, { waitUntil() {} });
  assert.equal(sp.status, 200); assert.equal(raw.prepare("SELECT confirmed FROM email_subs").get().confirmed, 1);
});
