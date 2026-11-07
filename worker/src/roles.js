// Rollen automatisch und per Abstimmung: MVP/MCT (verifiziert) werden Editor, Bewerbungen brauchen die Bestaetigung anderer Editoren.
import { roleOf } from "./perm.js";
import { stats } from "./badges.js";
import { notify } from "./mail.js";
import { cleanText } from "./util.js";

export const NEEDED = { editor: 3, moderator: 2 };   // Bestaetigungen durch verschiedene Editoren
export const MIN_POINTS = 25;
const now = () => Math.floor(Date.now() / 1000);
const sysLog = (db, uid, action, reason) => db.prepare("INSERT INTO edit_log(ts,user_id,role,action,kind,item_id,reason,day) VALUES(?,0,'system',?,'user',?,?,?)").bind(now(), action, String(uid), reason, Math.floor(now() / 86400)).run().catch(() => 0);
const QUAL = "SELECT owner_id FROM programs WHERE owner_type='u' AND verified=1 AND program IN ('mvp','mct')";

// Idempotent: vergibt Editor an verifizierte MVP/MCT (nur wenn die Rolle noch nie von Hand/Abstimmung entschieden wurde) und nimmt automatisch vergebene Rollen zurueck.
export async function syncAutoRoles(db, uid = null) {
  const W = uid ? " AND u.id=?" : "", B = uid ? [uid] : [], out = { granted: 0, revoked: 0 };
  const rev = (await db.prepare(`SELECT u.id FROM users u WHERE u.role_source LIKE 'auto\\_%' ESCAPE '\\' AND u.id NOT IN (${QUAL})${W}`).bind(...B).all()).results || [];
  for (const r of rev) { await db.prepare("UPDATE users SET role='user',role_source='' WHERE id=? AND role_source LIKE 'auto\\_%' ESCAPE '\\'").bind(r.id).run(); await sysLog(db, r.id, "role.auto_revoke", "Programm-Verifizierung entfallen"); out.revoked++; }
  const src = (await db.prepare(`SELECT u.id,u.role,u.role_source,CASE WHEN SUM(p.program='mvp')>0 THEN 'auto_mvp' ELSE 'auto_mct' END src FROM users u JOIN programs p ON p.owner_type='u' AND p.owner_id=u.id AND p.verified=1 AND p.program IN ('mvp','mct') WHERE u.banned=0${W} GROUP BY u.id`).bind(...B).all()).results || [];
  for (const r of src) {
    if (r.role === "user" && r.role_source === "") { await db.prepare("UPDATE users SET role='editor',role_source=? WHERE id=? AND role='user' AND role_source=''").bind(r.src, r.id).run(); await sysLog(db, r.id, "role.auto_grant", r.src); out.granted++; }
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

async function colleague(db, a, b) {
  return !!(await db.prepare("SELECT 1 x FROM org_members x JOIN org_members y ON y.org_id=x.org_id AND y.status='active' WHERE x.user_id=? AND y.user_id=? AND x.status='active' LIMIT 1").bind(a, b).first());
}
export async function ineligibleReason(db, voterId, app) {
  if (voterId === app.user_id) return "self";
  if (await colleague(db, voterId, app.user_id)) return "colleague";
  return "";
}

export async function listApplications(db, user) {
  const rows = (await db.prepare("SELECT a.id,a.user_id,a.role,a.motivation,a.topics,a.created,u.name,p.handle FROM editor_applications a JOIN users u ON u.id=a.user_id LEFT JOIN profiles p ON p.user_id=a.user_id WHERE a.status='open' ORDER BY a.created").all()).results || [];
  const out = [];
  for (const a of rows) {
    const votes = (await db.prepare("SELECT v.voter_id,u.name FROM editor_votes v JOIN users u ON u.id=v.voter_id WHERE v.app_id=? ORDER BY v.ts").bind(a.id).all()).results || [];
    const why = await ineligibleReason(db, user.id, a);
    out.push({ id: a.id, role: a.role, name: a.name, handle: a.handle || "", motivation: a.motivation, topics: parseT(a.topics), created: a.created, needed: NEEDED[a.role], votes: votes.map((v) => v.name), voted: votes.some((v) => v.voter_id === user.id), canVote: !why, why });
  }
  return out;
}

async function grant(env, app, source) {
  const db = env.DB;
  await db.prepare("UPDATE users SET role=?,role_source=? WHERE id=? AND role<>'admin'").bind(app.role, source, app.user_id).run();
  await db.prepare("UPDATE editor_applications SET status='approved',decided_ts=? WHERE id=?").bind(now(), app.id).run();
  await sysLog(db, app.user_id, "role.grant", `${app.role} (${source}) Bewerbung #${app.id}`);
  await notify(env, app.user_id, "system", "Deine Bewerbung bei M365.FM wurde angenommen", `<p>Du bist jetzt ${app.role === "editor" ? "Editor" : "Moderator"} bei M365.FM. Die Arbeitsseite findest du unter /${app.role === "editor" ? "redaktion" : "moderation"}/.</p>`, `app:${app.id}:ok`);
}
async function refuse(env, app, by, reason) {
  const db = env.DB;
  await db.prepare("UPDATE editor_applications SET status='rejected',decided_by=?,decided_ts=?,reason=? WHERE id=?").bind(by, now(), reason, app.id).run();
  await sysLog(db, app.user_id, "role.reject", `Bewerbung #${app.id}: ${reason}`);
  await notify(env, app.user_id, "system", "Deine Bewerbung bei M365.FM", `<p>Deine Bewerbung wurde leider nicht angenommen. Begründung: ${String(reason).replace(/[<>&]/g, "")}</p>`, `app:${app.id}:no`);
}

// action: confirm | reject | override (Admin: approve=true/false)
export async function decideApplication(env, user, id, action, b = {}) {
  const db = env.DB, role = roleOf(user), app = await db.prepare("SELECT * FROM editor_applications WHERE id=? AND status='open'").bind(id).first();
  if (!app) return res(404, { error: "not_found" });
  if (role !== "editor" && role !== "admin") return res(403, { error: "forbidden" });
  if (app.user_id === user.id) return res(403, { error: "self" });
  const reason = cleanText(b.reason, 300);
  if (action === "override") {
    if (role !== "admin") return res(403, { error: "forbidden" });
    if (b.approve) await grant(env, app, "manual"); else await refuse(env, app, user.id, reason || "Entscheidung des Admins");
    return res(200, { ok: true, status: b.approve ? "approved" : "rejected" });
  }
  if (action === "reject") {
    if (!reason) return res(400, { error: "reason_required" });
    await refuse(env, app, user.id, reason); return res(200, { ok: true, status: "rejected" });
  }
  const why = await ineligibleReason(db, user.id, app);
  if (why) return res(403, { error: why });
  await db.prepare("INSERT OR IGNORE INTO editor_votes(app_id,voter_id,ts) VALUES(?,?,?)").bind(id, user.id, now()).run();
  const n = (await db.prepare("SELECT COUNT(*) n FROM editor_votes WHERE app_id=?").bind(id).first()).n;
  if (n >= NEEDED[app.role]) { await grant(env, app, "vote"); return res(200, { ok: true, status: "approved", votes: n }); }
  return res(200, { ok: true, status: "open", votes: n, needed: NEEDED[app.role] });
}
