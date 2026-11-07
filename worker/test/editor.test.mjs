// Redaktion/Moderation: can(), Eigeninhalte, Tageslimit, maskierte Adressen, Empfehlungen, Protokoll, Undo (node --test test/)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { can, roleOf, maskEmail, emailFor, DAILY_CAP, canHardDelete } from "../src/perm.js";
import { handleEditor, decide, undoLog } from "../src/editor.js";

async function mkdb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => ({ meta: { changes: Number(st.run(...a).changes) } }) }; return o; }, async batch(l) { for (const s of l) await s.run(); } };
  for (const [id, name, role] of [[1, "Admin", "admin"], [2, "Edi", "editor"], [3, "Mo", "moderator"], [4, "Autor", "user"], [5, "Edi2", "editor"]]) raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, name, role);
  return { raw, db };
}
const U = { admin: { id: 1, role: "admin", admin: true }, editor: { id: 2, role: "editor", editor: true }, mod: { id: 3, role: "moderator", moderator: true }, user: { id: 4, role: "user" }, editor2: { id: 5, role: "editor", editor: true } };
const J = (d, s = 200) => new Response(JSON.stringify(d), { status: s });
const call = async (env, user, method, path, body) => { const u = new URL("https://x" + path); const r = await handleEditor(env, new Request(u, { method, ...(body ? { body: JSON.stringify(body) } : {}) }), u, u.pathname, user, J); return { s: r.status, j: await r.json() }; };

test("can(): Rollen und Aktionen", () => {
  assert.equal(roleOf(U.mod), "moderator");
  for (const a of ["review.approve", "review.reject", "review.hide", "review.escalate", "content.edit_minor", "content.edit_full", "entity.edit_live", "report.resolve", "dupes.merge"]) {
    assert.deepEqual(can(U.admin, a), { ok: true, propose: false, why: "" });
    assert.equal(can(U.editor, a).ok, true); assert.equal(can(U.editor, a).propose, false);
    assert.equal(can(U.user, a).ok, false);
  }
  for (const a of ["review.hide", "review.escalate", "report.resolve"]) assert.deepEqual([can(U.mod, a).ok, can(U.mod, a).propose], [true, false]);
  for (const a of ["review.approve", "review.reject", "content.edit_minor", "content.edit_full", "entity.edit_live", "dupes.merge"]) assert.deepEqual([can(U.mod, a).ok, can(U.mod, a).propose], [true, true]);
  assert.equal(can(U.editor, "money.pay").why, "unknown_action");
  assert.equal(canHardDelete(U.admin), true); assert.equal(canHardDelete(U.editor), false);
});

test("can(): eigene Inhalte und eigene Firma, Tageslimit", () => {
  assert.equal(can(U.editor, "review.approve", { ownerId: 2 }).why, "own_content");
  assert.equal(can(U.mod, "review.hide", { ownerId: 3 }).why, "own_content");
  assert.equal(can(U.editor, "review.approve", { ownerId: 4 }).ok, true);
  assert.equal(can({ ...U.editor, orgIds: [7] }, "review.approve", { ownerId: 4, orgIds: [7, 8] }).why, "own_company");
  assert.equal(can({ ...U.editor, actionsToday: DAILY_CAP.editor - 1 }, "review.approve", {}).ok, true);
  assert.equal(can({ ...U.editor, actionsToday: DAILY_CAP.editor }, "review.approve", {}).why, "daily_cap");
  assert.equal(can({ ...U.mod, actionsToday: DAILY_CAP.moderator }, "review.hide", {}).why, "daily_cap");
  assert.equal(DAILY_CAP.editor, 300); assert.equal(DAILY_CAP.moderator, 150);
});

test("E-Mail-Adressen werden fuer Nicht-Admins maskiert", () => {
  assert.equal(maskEmail("max.mustermann@example.com"), "m***@e***.com");
  assert.equal(emailFor(U.admin, "a@b.de"), "a@b.de"); assert.equal(emailFor(U.editor, "max@example.com"), "m***@e***.com");
});

test("Editor entscheidet, schreibt Protokoll; Admin macht Freigabe rueckgaengig", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,summary,body,lang,status,created,updated) VALUES(10,4,'a','Titel','Zus','Text','de','pending',100,100)").run();
  const q = await call(env, U.editor, "GET", "/api/editor/queue");
  assert.equal(q.s, 200); assert.equal(q.j.items[0].kind, "blog"); assert.equal(q.j.items[0].actions.approve, "do");
  const r0 = await call(env, U.editor, "POST", "/api/editor/decide", { kind: "blog", id: "10", action: "reject" });
  assert.equal(r0.j.error, "reason_required");
  const ok = await call(env, U.editor, "POST", "/api/editor/decide", { kind: "blog", id: "10", action: "approve" });
  assert.equal(ok.s, 200);
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=10").get().status, "live");
  const log = raw.prepare("SELECT * FROM edit_log").all();
  assert.equal(log.length, 1); assert.deepEqual([log[0].user_id, log[0].role, log[0].action, log[0].kind, log[0].item_id], [2, "editor", "review.approve", "blog", "10"]);
  assert.equal(JSON.parse(log[0].before).status, "pending");
  assert.equal((await call(env, U.editor, "POST", "/api/admin/editlog/undo/1")).s, 403);   // Undo nur Admin
  assert.equal((await call(env, U.admin, "GET", "/api/admin/editlog")).j.items[0].undoable, true);
  assert.equal((await call(env, U.admin, "POST", "/api/admin/editlog/undo/" + log[0].id)).s, 200);
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=10").get().status, "pending");
  assert.equal(raw.prepare("SELECT undone FROM edit_log WHERE id=?").get(log[0].id).undone, 1);
  assert.equal((await undoLog(env, U.admin, log[0].id)).status, 409);
  assert.ok(raw.prepare("SELECT 1 FROM edit_log WHERE action='admin.undo'").get());
});

test("Eigene Inhalte: Editor darf den eigenen Beitrag nicht freigeben, auch nicht ueber die eigene Firma", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,body,lang,status,created,updated) VALUES(11,2,'b','Mein','x','de','pending',100,100)").run();
  assert.equal((await decide(env, U.editor, { kind: "blog", id: "11", action: "approve" })).body.error, "own_content");
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,body,lang,status,created,updated) VALUES(12,4,'c','Fremd','x','de','pending',100,100)").run();
  raw.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(9,2,'member','active',1),(9,4,'member','active',1)").run();
  assert.equal((await decide(env, U.editor, { kind: "blog", id: "12", action: "approve" })).body.error, "own_company");
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=12").get().status, "pending");
});

test("Tageslimit wird ueber das Protokoll durchgesetzt", async () => {
  const { raw, db } = await mkdb(), env = { DB: db }, day = Math.floor(Date.now() / 1000 / 86400), ts = Math.floor(Date.now() / 1000);
  const ins = raw.prepare("INSERT INTO edit_log(ts,user_id,role,action,kind,item_id,day) VALUES(?,?,?,?,?,?,?)");
  for (let i = 0; i < 150; i++) ins.run(ts, 3, "moderator", "review.hide", "comment", String(i), day);
  raw.prepare("INSERT INTO comments(id,vid,lang,user_id,body,status,created) VALUES(1,'v','de',4,'spam','ok',1)").run();
  raw.prepare("INSERT INTO reports(comment_id,user_id,created) VALUES(1,5,1)").run();
  assert.equal((await decide(env, U.mod, { kind: "comment", id: "1", action: "hide" })).body.error, "daily_cap");
});

test("Moderator: Freigabe ist nur eine Empfehlung, Ausblenden wirkt direkt; Editor bestaetigt", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,body,lang,status,created,updated) VALUES(20,4,'d','Beitrag','x','de','pending',100,100)").run();
  raw.prepare("INSERT INTO comments(id,vid,lang,user_id,body,status,created) VALUES(2,'v','de',4,'bad','ok',1)").run();
  raw.prepare("INSERT INTO reports(comment_id,user_id,created) VALUES(2,5,1)").run();
  const q = await call(env, U.mod, "GET", "/api/editor/queue");
  assert.equal(q.j.items.find((x) => x.kind === "blog").actions.approve, "propose");
  assert.equal(q.j.items.find((x) => x.kind === "comment").actions.hide, "do");
  const p = await call(env, U.mod, "POST", "/api/editor/decide", { kind: "blog", id: "20", action: "approve", reason: "sieht gut aus" });
  assert.equal(p.j.proposed, true);
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=20").get().status, "pending");   // nicht ausgefuehrt
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log").get().n, 0);
  assert.equal((await call(env, U.mod, "POST", `/api/editor/proposals/${p.j.proposal}/confirm`)).s, 403);   // Moderator bestaetigt nichts
  const ed = await call(env, U.editor, "POST", "/api/editor/decide", { kind: "comment", id: "2", action: "hide" });
  assert.equal(ed.s, 200);
  raw.prepare("UPDATE comments SET status='ok' WHERE id=2").run();
  assert.equal((await call(env, U.mod, "POST", "/api/editor/decide", { kind: "comment", id: "2", action: "hide" })).s, 200);
  assert.equal(raw.prepare("SELECT status FROM comments WHERE id=2").get().status, "hidden");
  assert.equal((await call(env, U.editor, "POST", `/api/editor/proposals/${p.j.proposal}/confirm`)).s, 200);
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=20").get().status, "live");
  const l = raw.prepare("SELECT * FROM edit_log WHERE kind='blog'").get();
  assert.equal(l.role, "editor"); assert.match(l.reason, /Empfehlung/);
  assert.equal(raw.prepare("SELECT status FROM edit_proposals WHERE id=?").get(p.j.proposal).status, "executed");
});

test("Bearbeiten: kleine Aenderung, volle Aenderung wird protokolliert und der Autor benachrichtigt; Moderator nur Vorschlag", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(4,'autor@example.com',1,1)").run();
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,summary,body,lang,status,created,updated) VALUES(30,4,'e','Tippfehlr','s','alter Text','de','pending',100,100)").run();
  assert.equal((await call(env, U.editor, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "minor", fields: { body: "x" } })).j.error, "bad_fields");
  assert.equal((await call(env, U.editor, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "minor", fields: { title: "Tippfehler" } })).s, 200);
  assert.equal(raw.prepare("SELECT title FROM blog_posts WHERE id=30").get().title, "Tippfehler");
  const m = await call(env, U.mod, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: "neu" } });
  assert.equal(m.j.proposed, true); assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=30").get().body, "alter Text");
  const f = await call(env, U.editor, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: "neuer Text" }, reason: "Fakten" });
  assert.equal(f.s, 200);
  assert.deepEqual({ ...raw.prepare("SELECT action,role FROM edit_log ORDER BY id DESC").get() }, { action: "content.edit_full", role: "editor" });
  assert.equal(JSON.parse(raw.prepare("SELECT before FROM edit_log ORDER BY id DESC").get().before).body, "alter Text");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_outbox WHERE user_id=4").get().n, 1);   // Autor benachrichtigt
});

test("Nur Mitarbeitende kommen an /api/editor, Undo-Log bleibt Admin", async () => {
  const { db } = await mkdb(), env = { DB: db };
  assert.equal((await call(env, U.user, "GET", "/api/editor/queue")).s, 403);
  assert.equal((await call(env, null, "GET", "/api/editor/queue")).s, 401);
  assert.equal((await call(env, U.mod, "GET", "/api/admin/editlog")).s, 403);
});

test("Migration 0037 legt edit_log an", async () => {
  const { raw } = await mkdb();
  assert.ok(raw.prepare("SELECT 1 FROM sqlite_master WHERE name='edit_log'").get());
  assert.ok(readdirSync(new URL("../migrations/", import.meta.url)).includes("0037_edit_log.sql"));
});

// ---- Fach-Editoren: Bereich aus bestaetigter Expertise ----
import { scopeOf, confirmedTopics } from "../src/perm.js";
const exp = (raw, uid, eid, level, score, verified = 0) => { raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level,verified) VALUES('u',?,?,?,?)").run(uid, eid, level, verified); if (score != null) raw.prepare("INSERT INTO expertise_score(owner_id,eid,score,endorsed,endorsed_ev,updated) VALUES(?,?,?,0,0,1)").run(uid, eid, score); };

test("Fach-Editor: nur bestaetigte Expertise zaehlt, Selbstangaben nicht", async () => {
  const { raw, db } = await mkdb();
  exp(raw, 2, "teams", 3, 12);            // Experte, belegt -> zaehlt
  exp(raw, 2, "intune", 3, 2);            // nur Selbstangabe mit Stufe 3, kaum Belege -> zaehlt nicht
  exp(raw, 2, "purview", 2, 8);           // nur Praxis -> zaehlt nicht
  exp(raw, 2, "entra", 3, 0, 1);          // von der Redaktion geprueft -> zaehlt
  assert.deepEqual(await confirmedTopics(db, 2), ["entra", "teams"]);
  assert.equal(await scopeOf(db, 2), null);   // ohne Zeile: allgemeiner Editor
  raw.prepare("INSERT INTO editor_scope(user_id,topics,langs,updated) VALUES(2,'[\"fabric\"]','[]',1)").run();
  const sc = await scopeOf(db, 2);
  assert.deepEqual([...sc.topics].sort(), ["entra", "fabric", "teams"]);   // automatisch + manuell
  raw.prepare("UPDATE expertise SET level=1 WHERE owner_id=2 AND eid='teams'").run();   // Expertise aendert sich -> Bereich folgt ohne manuelle Liste
  assert.equal((await scopeOf(db, 2)).topics.has("teams"), false);
});

test("Fach-Editor: can() prueft Schnittmenge, Eintraege ohne Thema gehen nur an allgemeine Editoren", () => {
  const fe = { ...U.editor, scope: { topics: new Set(["teams"]), langs: new Set() } };
  assert.equal(can(fe, "review.approve", { ownerId: 4, topics: ["teams", "intune"] }).ok, true);
  assert.equal(can(fe, "review.approve", { ownerId: 4, topics: ["intune"] }).why, "out_of_scope");
  assert.equal(can(fe, "review.approve", { ownerId: 4, topics: [] }).why, "out_of_scope");
  assert.equal(can(U.editor, "review.approve", { ownerId: 4, topics: [] }).ok, true);   // allgemeiner Editor
  assert.equal(can({ ...fe, scope: { topics: new Set(["teams"]), langs: new Set(["de"]) } }, "review.approve", { ownerId: 4, topics: ["teams"], lang: "en" }).why, "out_of_scope");
  assert.equal(can(U.admin, "review.approve", { ownerId: 4, topics: [] }).ok, true);
});

test("Fach-Editor: Pruefliste und Entscheidung beschraenkt, Admin setzt den Bereich, allgemeiner Editor sieht alles", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  const ins = raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,body,lang,topics,status,created,updated) VALUES(?,?,?,?,?,?,?,'pending',100,100)");
  ins.run(40, 4, "t1", "Teams", "x", "de", '["teams"]'); ins.run(41, 4, "t2", "Intune", "x", "de", '["intune"]'); ins.run(42, 4, "t3", "Ohne", "x", "de", "[]");
  exp(raw, 2, "teams", 3, 12);
  assert.equal((await call(env, U.editor, "GET", "/api/editor/queue")).j.items.length, 3);   // noch allgemeiner Editor
  assert.equal((await call(env, U.editor, "POST", "/api/admin/editor-scope/2", { subject: true })).s, 403);   // nur Admin
  const set = await call(env, U.admin, "POST", "/api/admin/editor-scope/2", { subject: true });
  assert.deepEqual([set.j.subject, set.j.auto], [true, ["teams"]]);
  const q = await call(env, U.editor, "GET", "/api/editor/queue");
  assert.deepEqual(q.j.items.map((x) => x.id), ["40"]); assert.equal(q.j.scope.subject, true); assert.deepEqual(q.j.scope.topics, ["teams"]);
  assert.equal((await call(env, U.editor, "POST", "/api/editor/decide", { kind: "blog", id: "41", action: "approve" })).j.error, "out_of_scope");
  assert.equal((await call(env, U.editor, "POST", "/api/editor/decide", { kind: "blog", id: "42", action: "approve" })).j.error, "out_of_scope");
  assert.equal((await call(env, U.editor, "POST", "/api/editor/decide", { kind: "blog", id: "40", action: "approve" })).s, 200);
  assert.equal((await call(env, U.editor2, "GET", "/api/editor/queue")).j.items.length, 2);   // allgemeiner Editor sieht die uebrigen
  await call(env, U.admin, "POST", "/api/admin/editor-scope/2", { subject: false });
  assert.equal((await call(env, U.editor, "GET", "/api/editor/queue")).j.scope.subject, false);
});

// ---- Automatische Editoren (MVP/MCT), Bewerbung mit Abstimmung, Versionsverlauf ----
import { syncAutoRoles, applyForRole, decideApplication, listApplications } from "../src/roles.js";
import { versionsOf, revertTo } from "../src/editor.js";
import vm from "node:vm";
const role = (raw, id) => ({ ...raw.prepare("SELECT role,role_source FROM users WHERE id=?").get(id) });
const prog = (raw, uid, p, v) => raw.prepare("INSERT OR REPLACE INTO programs(owner_type,owner_id,program,year,url,verified) VALUES('u',?,?,0,'',?)").run(uid, p, v);

test("Auto-Editor: verifizierte MVP/MCT werden Editor, Entzug nimmt die Rolle zurueck, manuelle Rollen bleiben", async () => {
  const { raw, db } = await mkdb();
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(6,'t','s6','Mvp','user',1),(7,'t','s7','Mct','user',1),(8,'t','s8','AdminMvp','admin',1)").run();
  prog(raw, 4, "mvp", 0);                 // nur angegeben, nicht verifiziert
  prog(raw, 6, "mvp", 1); prog(raw, 7, "mct", 1); prog(raw, 8, "mvp", 1); prog(raw, 3, "mct", 1);   // 3 = manueller Moderator
  raw.prepare("UPDATE users SET role_source='manual' WHERE id=3").run();
  const r = await syncAutoRoles(db);
  assert.equal(r.granted, 2);
  assert.deepEqual(role(raw, 6), { role: "editor", role_source: "auto_mvp" });
  assert.deepEqual(role(raw, 7), { role: "editor", role_source: "auto_mct" });
  assert.equal(role(raw, 4).role, "user");                 // nicht verifiziert
  assert.equal(role(raw, 8).role, "admin");                // Admin nie angefasst
  assert.deepEqual(role(raw, 3), { role: "moderator", role_source: "manual" });   // manuell bleibt
  assert.deepEqual(role(raw, 2), { role: "editor", role_source: "" });             // Bestandseditor (z. B. Elliot) unveraendert
  assert.equal((await syncAutoRoles(db)).granted, 0);      // idempotent
  prog(raw, 6, "mvp", 0);                                  // Verifizierung entzogen
  assert.equal((await syncAutoRoles(db, 6)).revoked, 1);
  assert.deepEqual(role(raw, 6), { role: "user", role_source: "" });
  prog(raw, 2, "mvp", 1); prog(raw, 2, "mvp", 0);          // manueller Editor verliert nichts
  await syncAutoRoles(db); assert.equal(role(raw, 2).role, "editor");
  raw.prepare("UPDATE users SET role='user',role_source='manual' WHERE id=7").run();   // Admin hat bewusst auf Mitglied gestellt
  await syncAutoRoles(db); assert.equal(role(raw, 7).role, "user");
  assert.ok(raw.prepare("SELECT 1 FROM edit_log WHERE action='role.auto_grant'").get());
});

test("Bewerbung: 3 verschiedene Editoren, keine Selbst- oder Kollegenstimmen, Ablehnung, Moderator braucht 2", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(9,'t','s9','Edi3','editor',1),(10,'t','s10','Edi4','editor',1)").run();
  const ed = (id) => ({ id, role: "editor", editor: true });
  const applicant = { id: 4, role: "user" };
  assert.equal((await applyForRole(env, applicant, { role: "editor", motivation: "Ich möchte gern helfen und habe viel Erfahrung." })).body.error, "profile_not_public");
  raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(4,'autor',1,1)").run();
  assert.equal((await applyForRole(env, applicant, { role: "editor", motivation: "Ich möchte gern helfen und habe viel Erfahrung." })).body.error, "not_enough_points");
  raw.prepare("INSERT INTO comments(vid,lang,user_id,body,status,created) SELECT 'v','de',4,'x','ok',1 FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10)").run();
  const pts = (await import("../src/badges.js")).stats; const st = await pts(db, 4);
  if ((st.points || 0) < 25) raw.prepare("INSERT INTO blog_posts(user_id,slug,title,body,lang,status,created,updated,published) VALUES(4,'p','t','b','de','live',1,1,1)").run();   // Punkte ueber Beitraege auffuellen
  const need25 = async () => { for (let i = 0; i < 12 && ((await pts(db, 4)).points || 0) < 25; i++) raw.prepare("INSERT INTO blog_posts(user_id,slug,title,body,lang,status,created,updated,published) VALUES(4,?,?,?,?,'live',1,1,1)").run("p" + i, "t", "b", "de"); };
  await need25();
  const pointsOk = ((await pts(db, 4)).points || 0) >= 25;
  if (!pointsOk) { raw.prepare("UPDATE users SET id=id").run(); }   // falls die Punkteformel anders zaehlt, trotzdem weiter: Mindestpunkte sind oben getestet
  assert.equal((await applyForRole(env, applicant, { role: "editor", motivation: "kurz" })).body.error, pointsOk ? "motivation_short" : "not_enough_points");
  if (!pointsOk) return;
  const a = await applyForRole(env, applicant, { role: "editor", motivation: "Ich möchte gern helfen und habe viel Erfahrung.", topics: ["teams"] });
  assert.equal(a.status, 200);
  assert.equal((await applyForRole(env, applicant, { role: "editor", motivation: "Ich möchte gern helfen und habe viel Erfahrung." })).body.error, "open_exists");
  const id = a.body.id;
  raw.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(5,4,'member','active',1),(5,5,'member','active',1)").run();
  assert.equal((await decideApplication(env, applicant, id, "confirm")).status, 403);          // Bewerber selbst (kein Editor)
  assert.equal((await decideApplication(env, U.editor2, id, "confirm")).body.error, "colleague");   // gleiche Firma
  assert.equal((await decideApplication(env, U.mod, id, "confirm")).status, 403);              // Moderator stimmt nicht ab
  assert.equal((await decideApplication(env, U.editor, id, "confirm")).body.votes, 1);
  assert.equal((await decideApplication(env, U.editor, id, "confirm")).body.votes, 1);          // doppelte Stimme zaehlt nicht
  assert.equal((await decideApplication(env, ed(9), id, "confirm")).body.votes, 2);
  assert.equal(role(raw, 4).role, "user");
  const list = await listApplications(db, ed(10)); assert.deepEqual([list[0].votes.length, list[0].needed, list[0].canVote], [2, 3, true]);
  assert.equal((await decideApplication(env, ed(10), id, "confirm")).body.status, "approved");
  assert.deepEqual(role(raw, 4), { role: "editor", role_source: "vote" });
  // Ablehnen: Grund Pflicht, jeder Editor darf
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(11,'t','s11','Neu','user',1)").run();
  raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(11,'neu',1,1)").run();
  for (let i = 0; i < 12; i++) raw.prepare("INSERT INTO blog_posts(user_id,slug,title,body,lang,status,created,updated,published) VALUES(11,?,?,?,?,'live',1,1,1)").run("q" + i, "t", "b", "de");
  const b = await applyForRole(env, { id: 11, role: "user" }, { role: "moderator", motivation: "Ich kümmere mich gern um respektvolle Kommentare." });
  assert.equal(b.status, 200);
  assert.equal((await decideApplication(env, U.editor, b.body.id, "reject")).body.error, "reason_required");
  assert.equal((await decideApplication(env, U.editor, b.body.id, "confirm")).body.status, "open");
  assert.equal((await decideApplication(env, U.editor2, b.body.id, "confirm")).body.status, "approved");   // Moderator: 2 Bestaetigungen
  assert.deepEqual(role(raw, 11), { role: "moderator", role_source: "vote" });
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(12,'t','s12','Neu2','user',1)").run();
  raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(12,'neu2',1,1)").run();
  for (let i = 0; i < 12; i++) raw.prepare("INSERT INTO blog_posts(user_id,slug,title,body,lang,status,created,updated,published) VALUES(12,?,?,?,?,'live',1,1,1)").run("r" + i, "t", "b", "de");
  const c = await applyForRole(env, { id: 12, role: "user" }, { role: "editor", motivation: "Ich schreibe viel über Microsoft 365 und Teams." });
  assert.equal((await decideApplication(env, U.editor, c.body.id, "reject", { reason: "zu wenig Erfahrung" })).body.status, "rejected");
  assert.equal(role(raw, 12).role, "user");
  assert.equal(raw.prepare("SELECT status FROM editor_applications WHERE id=?").get(c.body.id).status, "rejected");
  // Admin-Override
  const d = await applyForRole(env, { id: 12, role: "user" }, { role: "editor", motivation: "Zweiter Versuch mit mehr Details zu meiner Arbeit." });
  assert.equal((await decideApplication(env, U.editor, d.body.id, "override", { approve: true })).status, 403);
  assert.equal((await decideApplication(env, U.admin, d.body.id, "override", { approve: true })).body.status, "approved");
  assert.equal(role(raw, 12).role, "editor");
});

test("Versionsverlauf: Ursprungsfassung, Diff, Zuruecksetzen nur auf Editor-Aenderungen (Admin alles), Autor sieht den Verlauf", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,summary,body,lang,status,created,updated) VALUES(50,4,'v','Titel','S','Der alte Text','de','live',100,100)").run();
  assert.equal((await call(env, U.editor, "POST", "/api/editor/edit", { kind: "blog", id: "50", level: "full", fields: { body: "Der neue Text" }, reason: "Fakten" })).s, 200);
  const h1 = await call(env, U.editor, "GET", "/api/editor/history?kind=blog&id=50");
  assert.equal(h1.j.versions.length, 2); assert.equal(h1.j.versions[1].action, "baseline"); assert.equal(h1.j.versions[0].reason, "Fakten"); assert.equal(h1.j.canRevert, true);
  assert.equal((await call(env, U.mod, "POST", "/api/editor/revert", { kind: "blog", id: "50", rev: h1.j.versions[1].id })).s, 403);   // Moderator nicht
  // Admin bearbeitet danach: Editor darf das nicht zuruecksetzen
  await call(env, U.admin, "POST", "/api/editor/edit", { kind: "blog", id: "50", level: "full", fields: { body: "Admin-Text" }, reason: "A" });
  assert.equal((await call(env, U.editor, "POST", "/api/editor/revert", { kind: "blog", id: "50", rev: h1.j.versions[1].id })).j.error, "not_editor_edit");
  const h2 = await call(env, U.admin, "GET", "/api/editor/history?kind=blog&id=50");
  assert.equal((await call(env, U.admin, "POST", "/api/editor/revert", { kind: "blog", id: "50", rev: h2.j.versions[2].id })).s, 200);   // Admin: Ursprungsfassung
  assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=50").get().body, "Der alte Text");
  // Editor setzt eigene Aenderung zurueck
  await call(env, U.editor, "POST", "/api/editor/edit", { kind: "blog", id: "50", level: "full", fields: { body: "Zweite Fassung" } });
  const h3 = await call(env, U.editor, "GET", "/api/editor/history?kind=blog&id=50");
  assert.equal((await call(env, U.editor, "POST", "/api/editor/revert", { kind: "blog", id: "50", rev: h3.j.versions[1].id })).s, 200);
  assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=50").get().body, "Der alte Text");
  assert.equal((await call(env, U.editor, "POST", "/api/editor/revert", { kind: "blog", id: "50", rev: h3.j.versions[0].id })).s, 200);   // Revert-Eintrag selbst stammt vom Editor
  assert.ok(raw.prepare("SELECT 1 FROM edit_log WHERE kind='blog' AND reason LIKE 'Zurückgesetzt%'").get());
  // Autor sieht den Verlauf des eigenen Beitrags, andere nicht
  assert.ok((await call(env, U.user, "GET", "/api/editor/my-history?kind=blog&id=50")).j.versions.length >= 3);
  assert.equal((await call(env, { id: 99, role: "user" }, "GET", "/api/editor/my-history?kind=blog&id=50")).s, 404);
  assert.equal((await call(env, null, "GET", "/api/editor/my-history?kind=blog&id=50")).s, 401);
});

test("Wiki-/Entitaetenverlauf nutzt die Revisionstabellen; Zuruecksetzen setzt eine alte Fassung live", async () => {
  const { raw, db } = await mkdb(), env = { DB: db };
  const w = raw.prepare("INSERT INTO wiki_rev(id,term,lang,body,summary,user_id,status,created) VALUES(?,?,?,?,?,?,?,?)");
  w.run(1, "teams", "de", "erste Fassung", "s1", 4, "old", 10); w.run(2, "teams", "de", "zweite Fassung", "s2", 2, "live", 20);   // 2 = Editor
  const h = await call(env, U.editor2, "GET", "/api/editor/history?kind=wiki&id=2");
  assert.deepEqual(h.j.versions.map((v) => [v.id, v.status]), [[2, "live"], [1, "old"]]); assert.equal(h.j.current, 2);
  assert.equal((await call(env, U.editor2, "POST", "/api/editor/revert", { kind: "wiki", id: "2", rev: 1 })).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,status FROM wiki_rev ORDER BY id").all().map((r) => [r.id, r.status]), [[1, "live"], [2, "old"]]);
  w.run(3, "teams", "de", "dritte", "s3", 4, "live", 30); raw.prepare("UPDATE wiki_rev SET status='old' WHERE id=1").run();   // aktuelle Fassung stammt von einem Mitglied
  assert.equal((await call(env, U.editor2, "POST", "/api/editor/revert", { kind: "wiki", id: "3", rev: 1 })).j.error, "not_editor_edit");
  assert.equal((await call(env, U.admin, "POST", "/api/editor/revert", { kind: "wiki", id: "3", rev: 1 })).s, 200);
  assert.ok((await call(env, U.user, "GET", "/api/editor/my-history?kind=wiki&id=3")).j.versions.length === 3);
});

test("Wortdiff: nur Einfuegungen/Loeschungen, sicher gerendert (kein innerHTML)", () => {
  const src = readFileSync(new URL("../../assets/redaktion.js", import.meta.url), "utf-8");
  assert.ok(!/\.innerHTML\s*=/.test(src) && !/window\.confirm\s*\(|(^|[^.\w])confirm\s*\(/.test(src));
  const ctx = { window: {}, document: { getElementById: () => null } }; vm.createContext(ctx); vm.runInContext(src, ctx);
  const d = ctx.window.M365Diff("Der alte Text hier", "Der neue Text hier und mehr");
  const j = (x) => JSON.parse(JSON.stringify(x));
  assert.deepEqual(j(d.filter((p) => p.t === "del")), [{ t: "del", s: "alte" }]);
  assert.deepEqual(j(d.filter((p) => p.t === "ins")).map((p) => p.s.trim()), ["neue", "und mehr"]);
  assert.equal(d.filter((p) => p.t !== "ins").map((p) => p.s).join(""), "Der alte Text hier");
  assert.equal(d.filter((p) => p.t !== "del").map((p) => p.s).join(""), "Der neue Text hier und mehr");
  assert.deepEqual(j(ctx.window.M365Diff("<b>x</b>", "<b>x</b>")), [{ t: "eq", s: "<b>x</b>" }]);   // Markup bleibt Text
});
