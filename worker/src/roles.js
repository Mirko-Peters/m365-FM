// Rollen automatisch und per Abstimmung: MVP/MCT (verifiziert) werden Editor, Bewerbungen brauchen die Bestaetigung anderer Editoren.
import { roleOf, can, loadActor, orgIdsOf } from "./perm.js";
import { stats } from "./badges.js";
import { notify } from "./mail.js";
import { cleanText } from "./util.js";

export const NEEDED = { editor: 3, moderator: 2 };   // Bestaetigungen durch verschiedene Editoren
export const MIN_POINTS = 25;
const now = () => Math.floor(Date.now() / 1000);
const sysLog = (db, uid, action, reason) => db.prepare("INSERT INTO edit_log(ts,user_id,role,action,kind,item_id,reason,day) VALUES(?,0,'system',?,'user',?,?,?)").bind(now(), action, String(uid), reason, Math.floor(now() / 86400)).run().catch(() => 0);
const RANK = { user: 0, moderator: 1, editor: 2, admin: 3 };
// Offene Bewerbungen schliessen, die sich erledigt haben, weil das Mitglied die Rolle (oder eine hoehere) inzwischen auf anderem Weg hat: Automatik, Admin
// oder eine zweite Bewerbung. Sonst wuerde eine spaete Bestaetigung z. B. einen Editor auf Moderator zuruecksetzen.
export async function closeObsolete(db, uid) {
  const u = await db.prepare("SELECT role FROM users WHERE id=?").bind(uid).first(); if (!u) return 0;
  const apps = (await db.prepare("SELECT id,role FROM editor_applications WHERE user_id=? AND status='open'").bind(uid).all()).results || []; let n = 0;
  for (const a of apps) if ((RANK[u.role] || 0) >= RANK[a.role]) { await db.prepare("UPDATE editor_applications SET status='obsolete',decided_ts=?,reason='Rolle bereits vorhanden' WHERE id=? AND status='open'").bind(now(), a.id).run(); n++; }
  return n;
}
const QUAL = "SELECT owner_id FROM programs WHERE owner_type='u' AND verified=1 AND program IN ('mvp','mct')";

// Idempotent: vergibt Editor an verifizierte MVP/MCT (nur wenn die Rolle noch nie von Hand/Abstimmung entschieden wurde) und nimmt automatisch vergebene Rollen zurueck.
export async function syncAutoRoles(db, uid = null) {
  const W = uid ? " AND u.id=?" : "", B = uid ? [uid] : [], out = { granted: 0, revoked: 0 };
  const rev = (await db.prepare(`SELECT u.id FROM users u WHERE u.role_source LIKE 'auto\\_%' ESCAPE '\\' AND u.id NOT IN (${QUAL})${W}`).bind(...B).all()).results || [];
  for (const r of rev) { await db.prepare("UPDATE users SET role='user',role_source='' WHERE id=? AND role_source LIKE 'auto\\_%' ESCAPE '\\'").bind(r.id).run(); await sysLog(db, r.id, "role.auto_revoke", "Programm-Verifizierung entfallen"); out.revoked++; }
  const src = (await db.prepare(`SELECT u.id,u.role,u.role_source,CASE WHEN SUM(p.program='mvp')>0 THEN 'auto_mvp' ELSE 'auto_mct' END src FROM users u JOIN programs p ON p.owner_type='u' AND p.owner_id=u.id AND p.verified=1 AND p.program IN ('mvp','mct') WHERE u.banned=0${W} GROUP BY u.id`).bind(...B).all()).results || [];
  for (const r of src) {
    if (r.role === "user" && r.role_source === "") { await db.prepare("UPDATE users SET role='editor',role_source=? WHERE id=? AND role='user' AND role_source=''").bind(r.src, r.id).run(); await sysLog(db, r.id, "role.auto_grant", r.src); await closeObsolete(db, r.id); out.granted++; }
    else if (r.role_source.startsWith("auto_") && r.role_source !== r.src) await db.prepare("UPDATE users SET role_source=? WHERE id=?").bind(r.src, r.id).run();   // MVP <-> MCT: Quelle nachziehen
  }
  return out;
}

const parseT = (s) => { try { const v = JSON.parse(s || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const res = (status, body) => ({ status, body });

export async function applyForRole(env, user, b) {
  const db = env.DB, role = b.role === "moderator" ? "moderator" : b.role === "editor" ? "editor" : "";
  if (!role) return res(400, { error: "bad_request" });
  const cur = roleOf(user);
  if (cur === "admin" || cur === "editor" || cur === role) return res(409, { error: "already" });
  if (!(await db.prepare("SELECT 1 x FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first())) return res(400, { error: "profile_not_public" });
  if (((await stats(db, user.id)).points || 0) < MIN_POINTS) return res(400, { error: "not_enough_points", need: MIN_POINTS });
  const motivation = cleanText(b.motivation, 1000);
  if (motivation.length < 20) return res(400, { error: "motivation_short" });
  const topics = (Array.isArray(b.topics) ? b.topics : []).map((x) => cleanText(x, 60)).filter(Boolean).slice(0, 10);
  if (await db.prepare("SELECT 1 x FROM editor_applications WHERE user_id=? AND status='open'").bind(user.id).first()) return res(409, { error: "open_exists" });
  const id = (await db.prepare("INSERT INTO editor_applications(user_id,role,motivation,topics,created) VALUES(?,?,?,?,?) RETURNING id").bind(user.id, role, motivation, JSON.stringify(topics), now()).first()).id;
  return res(200, { ok: true, id });
}

export async function myApplications(db, uid) {
  const rows = (await db.prepare("SELECT id,role,motivation,topics,status,created,decided_ts,reason,(SELECT COUNT(*) FROM editor_votes v WHERE v.app_id=editor_applications.id) votes FROM editor_applications WHERE user_id=? ORDER BY id DESC LIMIT 5").bind(uid).all()).results || [];
  return rows.map((r) => ({ ...r, topics: parseT(r.topics), needed: NEEDED[r.role] }));
}

// Wer ueber eine Bewerbung mitentscheiden darf, sagt can(role.vote): Editoren und Admin, nie ueber die eigene Bewerbung, nie ueber Kollegen der eigenen Firma
// (auch nicht ablehnen). -> "" (darf) | self | colleague | forbidden ...
export async function ineligibleReason(db, voter, app) {
  const p = can(await loadActor(db, voter), "role.vote", { ownerId: app.user_id, orgIds: await orgIdsOf(db, app.user_id) });
  return p.ok && !p.propose ? "" : p.why === "own_content" ? "self" : p.why === "own_company" ? "colleague" : p.why || "forbidden";
}

export async function listApplications(db, user) {
  const rows = (await db.prepare("SELECT a.id,a.user_id,a.role,a.motivation,a.topics,a.created,u.name,p.handle FROM editor_applications a JOIN users u ON u.id=a.user_id LEFT JOIN profiles p ON p.user_id=a.user_id WHERE a.status='open' ORDER BY a.created").all()).results || [];
  const out = [];
  for (const a of rows) {
    const votes = (await db.prepare("SELECT v.voter_id,u.name FROM editor_votes v JOIN users u ON u.id=v.voter_id WHERE v.app_id=? ORDER BY v.ts").bind(a.id).all()).results || [];
    const why = await ineligibleReason(db, user, a);
    out.push({ id: a.id, role: a.role, name: a.name, handle: a.handle || "", motivation: a.motivation, topics: parseT(a.topics), created: a.created, needed: NEEDED[a.role], votes: votes.map((v) => v.name), voted: votes.some((v) => v.voter_id === user.id), canVote: !why, why });
  }
  return out;
}

// Rolle aus einer Bewerbung vergeben: nur AUFWAERTS (Mitglied -> Moderator/Editor, Moderator -> Editor). Hat das Mitglied die Rolle oder eine hoehere
// inzwischen schon, wird die Bewerbung als erledigt geschlossen und die Rolle nicht angefasst. -> true, wenn die Rolle vergeben wurde
async function grant(env, app, source) {
  const db = env.DB, lower = Object.keys(RANK).filter((r) => RANK[r] < RANK[app.role]);
  const done = (await db.prepare(`UPDATE users SET role=?,role_source=? WHERE id=? AND banned=0 AND role IN (${lower.map(() => "?").join(",")})`).bind(app.role, source, app.user_id, ...lower).run()).meta.changes > 0;
  if (!done) { await closeObsolete(db, app.user_id); await db.prepare("UPDATE editor_applications SET status='obsolete',decided_ts=?,reason='Rolle bereits vorhanden' WHERE id=? AND status='open'").bind(now(), app.id).run(); return false; }
  await db.prepare("UPDATE editor_applications SET status='approved',decided_ts=? WHERE id=?").bind(now(), app.id).run();
  await sysLog(db, app.user_id, "role.grant", `${app.role} (${source}) Bewerbung #${app.id}`);
  await closeObsolete(db, app.user_id);
  await notify(env, app.user_id, "system", "Deine Bewerbung bei M365.FM wurde angenommen", `<p>Du bist jetzt ${app.role === "editor" ? "Editor" : "Moderator"} bei M365.FM. Die Arbeitsseite findest du unter /${app.role === "editor" ? "redaktion" : "moderation"}/.</p>`, `app:${app.id}:ok`);
  return true;
}
async function refuse(env, app, by, reason) {
  const db = env.DB;
  await db.prepare("UPDATE editor_applications SET status='rejected',decided_by=?,decided_ts=?,reason=? WHERE id=?").bind(by, now(), reason, app.id).run();
  await sysLog(db, app.user_id, "role.reject", `Bewerbung #${app.id}: ${reason}`);
  await notify(env, app.user_id, "system", "Deine Bewerbung bei M365.FM", `<p>Deine Bewerbung wurde leider nicht angenommen. Begründung: ${String(reason).replace(/[<>&]/g, "")}</p>`, `app:${app.id}:no`);
}

// action: confirm | reject | override (Admin: approve=true/false). Rechte nur ueber can(): role.vote (Editoren, nicht eigene Bewerbung/Firma) und
// role.assign (Admin). Eine Rolle entsteht fuer Nicht-Admins ausschliesslich ueber NEEDED Bestaetigungen verschiedener Editoren.
export async function decideApplication(env, user, id, action, b = {}) {
  const db = env.DB, app = await db.prepare("SELECT * FROM editor_applications WHERE id=? AND status='open'").bind(id).first();
  if (!can(user, "role.vote").ok) return res(403, { error: "forbidden" });
  if (!app) return res(404, { error: "not_found" });
  const reason = cleanText(b.reason, 300);
  if (action === "override") {
    const p = can(user, "role.assign"); if (!p.ok) return res(403, { error: "forbidden" });
    if (b.approve) return (await grant(env, app, "manual")) ? res(200, { ok: true, status: "approved" }) : res(200, { ok: true, status: "obsolete" });
    await refuse(env, app, user.id, reason || "Entscheidung des Admins"); return res(200, { ok: true, status: "rejected" });
  }
  const why = await ineligibleReason(db, user, app);
  if (why) return res(403, { error: why });
  if (action === "reject") {
    if (!reason) return res(400, { error: "reason_required" });
    await refuse(env, app, user.id, reason); return res(200, { ok: true, status: "rejected" });
  }
  if (action !== "confirm") return res(400, { error: "bad_request" });
  await db.prepare("INSERT OR IGNORE INTO editor_votes(app_id,voter_id,ts) VALUES(?,?,?)").bind(id, user.id, now()).run();
  const n = (await db.prepare("SELECT COUNT(*) n FROM editor_votes WHERE app_id=?").bind(id).first()).n;
  if (n >= NEEDED[app.role]) return (await grant(env, app, "vote")) ? res(200, { ok: true, status: "approved", votes: n }) : res(200, { ok: true, status: "obsolete", votes: n });
  return res(200, { ok: true, status: "open", votes: n, needed: NEEDED[app.role] });
}
