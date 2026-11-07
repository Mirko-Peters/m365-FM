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
