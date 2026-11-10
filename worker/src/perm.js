// Zentrale Rechtepruefung fuer Redaktion und Moderation: can(user, action, item). Reine Funktion (ohne Datenbank), damit sie sich testen laesst;
// user.orgIds und user.actionsToday liefert loadActor(). Rueckgabe { ok, propose, why }:
//   ok=true, propose=false  -> darf ausfuehren;  ok=true, propose=true -> nur Empfehlung (Moderator);  ok=false -> verboten (why = Grund)
import { THRESH } from "./levels.js";
import { maskEmail } from "./claimverify.js";   // ein Helfer, ein Format (m***@example.com); kein zweites maskEmail im Worker
export const ROLES = ["user", "moderator", "editor", "admin"];
// can() ist das EINZIGE Tor fuer Redaktion und Moderation: jede Route (neu unter /api/editor/*, alt unter /api/admin/* und die MCP-Tools) fragt hier.
//   queue.view    Pruefliste und Verlauf lesen (ohne Tageslimit; Fach-Editoren filtert inScope je Eintrag)
//   queue.review  die Listen der Editoren lesen und abgleichen (alte /api/admin/*-Listen, Show Notes lesen): Editoren und Admin, keine Moderatoren
//   claim.decide  Uebernahme einer Entitaet bestaetigen/ablehnen/widerrufen, mit Redaktionsrechten dazu einladen      verify.set  Angabe eines Profils bestaetigen (item.confers: nur Admin)
//   role.vote     Bewerbung bestaetigen/ablehnen (Abstimmung der Editoren)        role.assign Rolle oder Fachbereich direkt setzen (nur Admin)
//   admin.undo    Entscheidung zuruecknehmen (nur Admin)                          escalation.close  Eskalation "an den Admin" erledigen (nur Admin)
export const ACTIONS = ["review.approve", "review.reject", "review.hide", "review.escalate", "content.edit_minor", "content.edit_full", "entity.edit_live", "report.resolve", "dupes.merge",
  "queue.view", "queue.review", "claim.decide", "verify.set", "role.vote", "role.assign", "admin.undo", "escalation.close"];
export const DAILY_CAP = { editor: 300, moderator: 150 };
const MOD_DIRECT = new Set(["review.hide", "review.escalate", "report.resolve"]);   // Moderator fuehrt selbst aus
const MOD_PROPOSE = new Set(["review.approve", "review.reject", "content.edit_minor", "content.edit_full", "entity.edit_live", "dupes.merge"]);
const DECIDING = new Set(["review.approve", "review.reject", "review.hide", "report.resolve", "dupes.merge", "claim.decide", "verify.set", "role.vote"]);   // Entscheidungen: nie ueber eigene Inhalte
const ADMIN_ONLY = new Set(["role.assign", "admin.undo", "escalation.close"]);   // Rollen, Fachbereiche und Undo vergibt nur der Admin; alle anderen Wege zu einer Rolle laufen ueber die Bewerbung
const NO_SCOPE = new Set(["role.vote"]);   // Bewerbungen haben kein Thema: jeder Editor stimmt ab

export function roleOf(user) {
  if (!user) return "user";
  if (user.admin) return "admin";
  if (user.role === "editor" || user.editor) return "editor";
  if (user.role === "moderator" || user.moderator) return "moderator";
  return "user";
}

// Fach-Editor (user.scope gesetzt): nur Eintraege mit Themen im eigenen Bereich (ohne Thema nur allgemeine Editoren), Sprachfassungen (item.i18n) nur in den
// eigenen Sprachen. Alle anderen Rollen sind nicht eingeschraenkt. Eine Definition fuer can() und fuer die Listen der alten Routen.
export function inScope(user, item = {}) {
  if (roleOf(user) !== "editor" || !user.scope) return true;
  const langs = user.scope.langs;
  if (item.i18n) return !langs.size || langs.has(item.lang);
  const t = item.topics || [];
  return t.some((x) => user.scope.topics.has(x)) && (!langs.size || !item.lang || langs.has(item.lang));
}

export function can(user, action, item = {}) {
  const role = roleOf(user);
  if (!ACTIONS.includes(action)) return { ok: false, propose: false, why: "unknown_action" };
  if (role === "user") return { ok: false, propose: false, why: "forbidden" };
  if (role === "admin") return { ok: true, propose: false, why: "" };   // Admin darf alles (Eigeninhalte eingeschlossen: einziger Betreiber)
  if (ADMIN_ONLY.has(action) || item.confers) return { ok: false, propose: false, why: "admin_only" };   // item.confers: die Entscheidung verleiht Rolle, Vertrauen oder Fachbereich
  if (action === "queue.view" || action === "queue.review") return { ok: role === "editor" || action === "queue.view", propose: false, why: role === "editor" || action === "queue.view" ? "" : "forbidden" };
  const cap = DAILY_CAP[role];
  if ((user.actionsToday || 0) >= cap) return { ok: false, propose: false, why: "daily_cap" };
  if (DECIDING.has(action) || action.startsWith("content.edit") || action === "entity.edit_live") {
    // item.ownerIds: weitere Beteiligte, fuer die es eine Entscheidung in eigener Sache waere (z. B. wer zu einer Uebernahme eingeladen hat)
    if (user.id != null && [item.ownerId, ...(item.ownerIds || [])].some((o) => o != null && Number(o) === Number(user.id))) return { ok: false, propose: false, why: "own_content" };
    const mine = new Set((user.orgIds || []).map(Number));
    if ((item.orgIds || []).some((o) => mine.has(Number(o)))) return { ok: false, propose: false, why: "own_company" };
  }
  if (!NO_SCOPE.has(action) && !inScope(user, item)) return { ok: false, propose: false, why: "out_of_scope" };
  if (role === "editor") return { ok: true, propose: false, why: "" };   // alle Aktionen; content.edit_full wird protokolliert und der Autor benachrichtigt (Aufrufer)
  if (MOD_DIRECT.has(action)) return { ok: true, propose: false, why: "" };
  if (MOD_PROPOSE.has(action)) return { ok: true, propose: true, why: "" };
  return { ok: false, propose: false, why: "forbidden" };   // claim.decide, verify.set, role.vote: Moderatoren weder direkt noch als Empfehlung
}

// Endgueltiges Loeschen bleibt Admin-Sache (kein Aktionsname fuer Redakteure).
export const canHardDelete = (user) => roleOf(user) === "admin";
export const isStaff = (user) => roleOf(user) !== "user";
export const emailFor = (user, addr) => (roleOf(user) === "admin" || !addr ? String(addr || "") : maskEmail(String(addr)));

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

export const orgIdsOf = async (db, uid) => (uid ? ((await db.prepare("SELECT org_id FROM org_members WHERE user_id=? AND status='active'").bind(uid).all().catch(() => ({ results: [] }))).results || []).map((r) => r.org_id) : []);

export async function loadActor(db, user) {
  if (!user) return user;
  if (roleOf(user) === "editor" && user.scope === undefined) user = { ...user, scope: await scopeOf(db, user.id) };
  const n = (await db.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=? AND day=? AND undone=0").bind(user.id, day(Math.floor(Date.now() / 1000))).first().catch(() => null))?.n || 0;
  return { ...user, orgIds: await orgIdsOf(db, user.id), actionsToday: n };
}

// Tor fuer die alten Routen (/api/admin/*, Show Notes, Bewertungen ...): Akteur laden und can() fragen. Diese Routen kennen keine Empfehlungen, ein
// "nur empfehlen" (Moderator) zaehlt dort wie verboten. item.ownerId ohne item.orgIds: die Firmen des Eigentuemers werden nachgeladen (eigene Firma).
// -> { ok: true, actor } oder { ok: false, status, why }
export async function gate(db, user, action, item = {}) {
  if (!user) return { ok: false, status: 401, why: "login" };
  const actor = await loadActor(db, user), it = item.ownerId && !item.orgIds ? { ...item, orgIds: await orgIdsOf(db, item.ownerId) } : item;
  const p = can(actor, action, it);
  return p.ok && !p.propose ? { ok: true, actor } : { ok: false, status: 403, why: p.ok ? "forbidden" : p.why, actor };
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
