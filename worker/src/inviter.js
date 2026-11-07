// Abzeichen "Einlader": Zurechnung erfolgreicher Einladungen (invite_success), persoenlicher Link, Admin-Entwertung.
// Erfolgreich = die eingeladene Person hat ein Konto angelegt (OAuth-Anmeldung oder bestaetigte E-Mail) und es ueber einen Einladungsweg genutzt.
import { evalBadges, INVITER_TIERS, inviterTier } from "./badges.js";
import { audit } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
export const REF_DAYS = 30;
export const SOURCES = ["ref", "entity", "speaker", "org", "forward"];
const OAUTH = ["google", "microsoft", "linkedin", "github"];
let ready = false;
export async function ensureInvites(db) {
  if (ready) return;
  await db.prepare("CREATE TABLE IF NOT EXISTS invite_success (inviter_user_id INTEGER NOT NULL, invitee_user_id INTEGER NOT NULL UNIQUE, source TEXT NOT NULL, ref TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, voided INTEGER NOT NULL DEFAULT 0, voided_by INTEGER NOT NULL DEFAULT 0, voided_at INTEGER NOT NULL DEFAULT 0)").run();
  ready = true;
}

async function eligible(db, u) {
  if (!u || u.banned || u.merged_into) return false;
  if (OAUTH.includes(u.provider)) return true;
  const idn = await db.prepare(`SELECT 1 x FROM user_identities WHERE user_id=? AND provider IN (${OAUTH.map(() => "?").join(",")})`).bind(u.id, ...OAUTH).first().catch(() => null);
  if (idn) return true;
  return !!(await db.prepare("SELECT 1 x FROM mail_addr WHERE user_id=? AND verified=1").bind(u.id).first().catch(() => null));
}

// since: Zeitpunkt der Einladung; das Konto muss danach entstanden sein (kein Einladen bestehender Mitglieder). Gibt true zurueck, wenn neu gezaehlt.
export async function recordInvite(env, { inviter, invitee, source, ref = "", since = 0 }) {
  const db = env.DB; await ensureInvites(db);
  inviter = +inviter; invitee = +invitee;
  if (!inviter || !invitee || inviter === invitee || !SOURCES.includes(source)) return false;
  const a = await db.prepare("SELECT id,banned,merged_into FROM users WHERE id=?").bind(inviter).first();
  if (!a || a.banned || a.merged_into) return false;
  const b = await db.prepare("SELECT * FROM users WHERE id=?").bind(invitee).first();
  if (!(await eligible(db, b))) return false;
  if (since && (b.created || 0) < since) return false;
  const r = await db.prepare("INSERT OR IGNORE INTO invite_success(inviter_user_id,invitee_user_id,source,ref,created) VALUES(?,?,?,?,?)").bind(inviter, invitee, source, String(ref).slice(0, 80), now()).run();
  if (!(r.meta?.changes > 0)) return false;
  await evalBadges(env, inviter).catch(() => 0);
  return true;
}

export async function inviteCount(db, uid) {
  try { return (await db.prepare("SELECT COUNT(*) n FROM invite_success WHERE inviter_user_id=? AND voided=0").bind(uid).first())?.n || 0; } catch { return 0; }
}

export async function syncInviterBadges(env) {   // taeglich: Stufen neu bewerten (auch Entzug nach Entwertung)
  const db = env.DB; await ensureInvites(db);
  const ids = new Set(((await db.prepare("SELECT DISTINCT inviter_user_id id FROM invite_success UNION SELECT user_id id FROM user_badges WHERE badge LIKE 'inviter\\_%' ESCAPE '\\'").all()).results || []).map((r) => r.id));
  let n = 0; for (const id of ids) { await evalBadges(env, id); n++; }
  return n;
}

export async function handleInviter(env, request, url, path, user, J) {
  if (path !== "/api/invite/me" && path !== "/api/invite/ref" && path !== "/api/admin/invites" && path !== "/api/admin/invite/void") return null;
  const db = env.DB, method = request.method; await ensureInvites(db);
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/invite/me" && method === "GET") {
    const h = (await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND handle IS NOT NULL").bind(user.id).first())?.handle || "";
    const count = await inviteCount(db, user.id), tier = inviterTier(count);
    return J({ handle: h, link: h ? `${env.SITE}/einladung/${h}/` : "", ref_link: h ? `${env.SITE}/community/?ref=${h}` : "", count, tier, next: INVITER_TIERS.find((t) => t > count) || 0, tiers: INVITER_TIERS }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/invite/ref" && method === "POST") {   // Ref aus Cookie/localStorage der Website bei der Anmeldung zurechnen
    const b = await request.json().catch(() => ({})), h = String(b.ref || "").toLowerCase().slice(0, 40);
    if (!/^[a-z0-9][a-z0-9-]{1,38}$/.test(h)) return J({ error: "bad_request" }, 400);
    const p = await db.prepare("SELECT user_id FROM profiles WHERE handle=?").bind(h).first(); if (!p) return J({ ok: true, counted: false });
    const since = Math.max(Math.min(+b.t || 0, now()), now() - REF_DAYS * 86400);
    return J({ ok: true, counted: await recordInvite(env, { inviter: p.user_id, invitee: user.id, source: "ref", ref: h, since }) });
  }
  if (!user.admin) return J({ error: "forbidden" }, 403);
  if (path === "/api/admin/invites" && method === "GET") {
    const q = +url.searchParams.get("inviter") || 0;
    const rows = (await db.prepare(`SELECT s.*,a.name inviter_name,b.name invitee_name FROM invite_success s LEFT JOIN users a ON a.id=s.inviter_user_id LEFT JOIN users b ON b.id=s.invitee_user_id ${q ? "WHERE s.inviter_user_id=?" : ""} ORDER BY s.created DESC LIMIT 200`).bind(...(q ? [q] : [])).all()).results || [];
    return J({ items: rows });
  }
  if (path === "/api/admin/invite/void" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = +b.invitee, undo = !!b.undo;
    const s = id ? await db.prepare("SELECT inviter_user_id i FROM invite_success WHERE invitee_user_id=?").bind(id).first() : null; if (!s) return J({ error: "not_found" }, 404);
    await db.prepare("UPDATE invite_success SET voided=?,voided_by=?,voided_at=? WHERE invitee_user_id=?").bind(undo ? 0 : 1, undo ? 0 : user.id, undo ? 0 : now(), id).run();
    await audit(db, user.id, undo ? "invite-unvoid" : "invite-void", id, `inviter ${s.i}`);
    await evalBadges(env, s.i);
    return J({ ok: true, count: await inviteCount(db, s.i) });
  }
  return J({ error: "not_found" }, 404);
}
