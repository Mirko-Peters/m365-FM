// Zentrale Rechtepruefung fuer Redaktion und Moderation: can(user, action, item). Reine Funktion (ohne Datenbank), damit sie sich testen laesst;
// user.orgIds und user.actionsToday liefert loadActor(). Rueckgabe { ok, propose, why }:
//   ok=true, propose=false  -> darf ausfuehren;  ok=true, propose=true -> nur Empfehlung (Moderator);  ok=false -> verboten (why = Grund)
import { THRESH } from "./levels.js";
export const ROLES = ["user", "moderator", "editor", "admin"];
export const ACTIONS = ["review.approve", "review.reject", "review.hide", "review.escalate", "content.edit_minor", "content.edit_full", "entity.edit_live", "report.resolve", "dupes.merge"];
export const DAILY_CAP = { editor: 300, moderator: 150 };
const MOD_DIRECT = new Set(["review.hide", "review.escalate", "report.resolve"]);   // Moderator fuehrt selbst aus
const MOD_PROPOSE = new Set(["review.approve", "review.reject", "content.edit_minor", "content.edit_full", "entity.edit_live", "dupes.merge"]);
const DECIDING = new Set(["review.approve", "review.reject", "review.hide", "report.resolve", "dupes.merge"]);   // Entscheidungen: nie ueber eigene Inhalte

export function roleOf(user) {
  if (!user) return "user";
  if (user.admin) return "admin";
  if (user.role === "editor" || user.editor) return "editor";
  if (user.role === "moderator" || user.moderator) return "moderator";
  return "user";
}

export function can(user, action, item = {}) {
  const role = roleOf(user);
  if (!ACTIONS.includes(action)) return { ok: false, propose: false, why: "unknown_action" };
  if (role === "user") return { ok: false, propose: false, why: "forbidden" };
  if (role === "admin") return { ok: true, propose: false, why: "" };   // Admin darf alles (Eigeninhalte eingeschlossen: einziger Betreiber)
  const cap = DAILY_CAP[role];
  if ((user.actionsToday || 0) >= cap) return { ok: false, propose: false, why: "daily_cap" };
  if (DECIDING.has(action) || action.startsWith("content.edit") || action === "entity.edit_live") {
    if (item.ownerId != null && user.id != null && Number(item.ownerId) === Number(user.id)) return { ok: false, propose: false, why: "own_content" };
    const mine = new Set((user.orgIds || []).map(Number));
    if ((item.orgIds || []).some((o) => mine.has(Number(o)))) return { ok: false, propose: false, why: "own_company" };
  }
  if (role === "editor" && user.scope) {   // Fach-Editor: nur Eintraege mit Themen im eigenen Bereich (ohne Thema nur allgemeine Editoren)
    const t = item.topics || [];
    if (!t.length || !t.some((x) => user.scope.topics.has(x))) return { ok: false, propose: false, why: "out_of_scope" };
    if (user.scope.langs.size && item.lang && !user.scope.langs.has(item.lang)) return { ok: false, propose: false, why: "out_of_scope" };
  }
  if (role === "editor") return { ok: true, propose: false, why: "" };   // alle Aktionen; content.edit_full wird protokolliert und der Autor benachrichtigt (Aufrufer)
  if (MOD_DIRECT.has(action)) return { ok: true, propose: false, why: "" };
  if (MOD_PROPOSE.has(action)) return { ok: true, propose: true, why: "" };
  return { ok: false, propose: false, why: "forbidden" };
}

// Endgueltiges Loeschen bleibt Admin-Sache (kein Aktionsname fuer Redakteure).
export const canHardDelete = (user) => roleOf(user) === "admin";
export const isStaff = (user) => roleOf(user) !== "user";

export function maskEmail(addr) {
  const s = String(addr || ""), at = s.lastIndexOf("@");
  if (at < 1) return s ? "***" : "";
  const dom = s.slice(at + 1), dot = dom.lastIndexOf(".");
  return `${s[0]}***@${dot > 0 ? dom[0] + "***" + dom.slice(dot) : "***"}`;
}
export const emailFor = (user, addr) => (roleOf(user) === "admin" ? String(addr || "") : maskEmail(addr));

const day = (t) => Math.floor(t / 86400);

const parseList = (s) => { try { const v = JSON.parse(s || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; } };

// Bestaetigte Expertise: Stufe Experte (3) oder hoeher UND belegt (Punkte >= Experte-Schwelle) bzw. von der Redaktion geprueft. Reine Selbstangaben erreichen das nie.
export async function confirmedTopics(db, uid) {
  const rows = (await db.prepare("SELECT x.eid FROM expertise x LEFT JOIN expertise_score s ON s.owner_id=x.owner_id AND s.eid=x.eid WHERE x.owner_type='u' AND x.owner_id=? AND x.level>=3 AND (x.verified=1 OR COALESCE(s.score,0)>=?) ORDER BY x.eid").bind(uid, THRESH.expert).all().catch(() => ({ results: [] }))).results || [];
  return rows.map((r) => r.eid);
}
// null = allgemeiner Editor; sonst { topics:Set, langs:Set, auto:[...], extra:[...] } (wird bei jeder Anfrage neu aus der Expertise abgeleitet)
export async function scopeOf(db, uid) {
  const row = await db.prepare("SELECT topics,langs FROM editor_scope WHERE user_id=?").bind(uid).first().catch(() => null);
  if (!row) return null;
  const auto = await confirmedTopics(db, uid), extra = parseList(row.topics);
  return { topics: new Set([...auto, ...extra]), langs: new Set(parseList(row.langs)), auto, extra };
}

export async function loadActor(db, user) {
  if (!user) return user;
  if (roleOf(user) === "editor" && user.scope === undefined) user = { ...user, scope: await scopeOf(db, user.id) };
  const orgIds = ((await db.prepare("SELECT org_id FROM org_members WHERE user_id=? AND status='active'").bind(user.id).all().catch(() => ({ results: [] }))).results || []).map((r) => r.org_id);
  const n = (await db.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=? AND day=? AND undone=0").bind(user.id, day(Math.floor(Date.now() / 1000))).first().catch(() => null))?.n || 0;
  return { ...user, orgIds, actionsToday: n };
}

export async function logEdit(db, user, action, kind, itemId, { reason = "", before = "", after = "" } = {}) {
  const ts = Math.floor(Date.now() / 1000), cut = (v) => (typeof v === "string" ? v : JSON.stringify(v ?? "")).slice(0, 1500);
  const r = await db.prepare("INSERT INTO edit_log(ts,user_id,role,action,kind,item_id,reason,before,after,day) VALUES(?,?,?,?,?,?,?,?,?,?) RETURNING id")
    .bind(ts, user.id, roleOf(user), action, String(kind), String(itemId), String(reason || "").slice(0, 300), cut(before), cut(after), day(ts)).first();
  return r?.id || 0;
}

// Rollen fuer die oeffentliche Anzeige (Ring + Chip): nur Editor und Moderator, Admins bleiben unauffaellig.
export async function publicRoles(db, ids) {   // Map id -> Rolle; out.scopes: id -> Themen-IDs der Fach-Editoren (Tooltip "Fach-Editor fuer ...")
  const u = [...new Set((ids || []).filter(Boolean))], out = new Map(); out.scopes = new Map();
  if (!u.length) return out;
  const rows = (await db.prepare(`SELECT id,role FROM users WHERE id IN (${u.map(() => "?").join(",")}) AND role IN ('editor','moderator')`).bind(...u).all().catch(() => ({ results: [] }))).results || [];
  for (const r of rows) {
    out.set(r.id, r.role);
    if (r.role === "editor") { const sc = await scopeOf(db, r.id); if (sc) out.scopes.set(r.id, [...sc.topics].slice(0, 6)); }
  }
  return out;
}
