// Abzeichen "Einlader": Zurechnung erfolgreicher Einladungen (invite_success), persoenlicher Link, Admin-Entwertung.
// Erfolgreich = die eingeladene Person hat ein Konto angelegt (OAuth-Anmeldung oder bestaetigte E-Mail) und es ueber einen Einladungsweg genutzt.
import { evalBadges, INVITER_TIERS, inviterTier } from "./badges.js";
import { audit, rateLimit, sha256hex, sign, verify } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
export const REF_DAYS = 30;
export const REF_DAY_CAP = 20, REF_IP_CAP = 5;   // Zurechnungen ueber den Link pro Tag: je Einlader insgesamt und je Einlader von einem Anschluss (gegen Sammeln mit Wegwerfkonten)
export const PEND_RUN = 60;   // vorgemerkte Zurechnungen, die ein Tageslauf hoechstens nachholt (Datenbankabfragen je Lauf bleiben begrenzt)
export const SOURCES = ["ref", "entity", "speaker", "org", "forward"];
const OAUTH = ["google", "microsoft", "linkedin", "github"];
const HANDLE = /^[a-z0-9][a-z0-9-]{1,38}$/;

// Klick-Beleg fuer den persoenlichen Link: Kuerzel + Serverzeit, mit dem Sitzungsgeheimnis signiert. Der Browser merkt ihn nur (localStorage,
// 30 Tage) und legt ihn nach der Anmeldung vor; ob und wem zugerechnet wird, entscheidet allein der Server: Signatur, Alter des Belegs und
// "Konto nach dem Klick entstanden" - beides Serverzeit. Einen Zeitpunkt aus dem Browser gibt es nicht mehr (vorher: {ref, t} frei waehlbar).
export async function clickToken(env, h, t = now()) { return `${h}.${t}.${await sign(env.SESSION_SECRET, `invite|${h}|${t}`)}`; }
export async function readClick(env, token) {
  const m = /^([a-z0-9][a-z0-9-]{1,38})\.(\d{9,11})\.([A-Za-z0-9_-]{20,64})$/.exec(String(token || ""));
  if (!m || !(await verify(env.SESSION_SECRET, `invite|${m[1]}|${m[2]}`, m[3]))) return null;
  const t = +m[2]; if (t > now() + 60 || now() - t > REF_DAYS * 86400) return null;   // 60 s Spielraum zwischen Worker-Instanzen
  return { h: m[1], t };
}
let ready = false;
export async function ensureInvites(db) {
  if (ready) return;
  await db.prepare("CREATE TABLE IF NOT EXISTS invite_success (inviter_user_id INTEGER NOT NULL, invitee_user_id INTEGER NOT NULL UNIQUE, source TEXT NOT NULL, ref TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, voided INTEGER NOT NULL DEFAULT 0, voided_by INTEGER NOT NULL DEFAULT 0, voided_at INTEGER NOT NULL DEFAULT 0)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS invite_pending (invitee_user_id INTEGER NOT NULL UNIQUE, inviter_user_id INTEGER NOT NULL, ref TEXT NOT NULL DEFAULT '', since INTEGER NOT NULL DEFAULT 0, held INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL)").run();
  ready = true;
}

async function eligible(db, u) {
  if (!u || u.banned || u.merged_into) return false;
  if (OAUTH.includes(u.provider)) return true;
  const idn = await db.prepare(`SELECT 1 x FROM user_identities WHERE user_id=? AND provider IN (${OAUTH.map(() => "?").join(",")})`).bind(u.id, ...OAUTH).first().catch(() => null);
  if (idn) return true;
  return !!(await db.prepare("SELECT 1 x FROM mail_addr WHERE user_id=? AND verified=1").bind(u.id).first().catch(() => null));
}

// Pruefung ohne Schreiben: Einlader aktiv, eingeladene Person mit nachgewiesener Anmeldung, keine Selbst-Einladung, noch niemandem zugerechnet.
// since: Zeitpunkt der Einladung; das Konto muss danach entstanden sein (kein Einladen bestehender Mitglieder).
async function inviteOpen(db, { inviter, invitee, source, since = 0 }) {
  if (!inviter || !invitee || inviter === invitee || !SOURCES.includes(source)) return false;
  const a = await db.prepare("SELECT id,banned,merged_into FROM users WHERE id=?").bind(inviter).first();
  if (!a || a.banned || a.merged_into) return false;
  const b = await db.prepare("SELECT * FROM users WHERE id=?").bind(invitee).first();
  if (!(await eligible(db, b))) return false;
  if (since && (b.created || 0) < since) return false;
  return !(await db.prepare("SELECT 1 x FROM invite_success WHERE invitee_user_id=?").bind(invitee).first());
}

// Gibt true zurueck, wenn neu gezaehlt.
export async function recordInvite(env, { inviter, invitee, source, ref = "", since = 0 }) {
  const db = env.DB; await ensureInvites(db);
  inviter = +inviter; invitee = +invitee;
  if (!(await inviteOpen(db, { inviter, invitee, source, since })) || !(await insertInvite(db, { inviter, invitee, source, ref }))) return false;
  await evalBadges(env, inviter).catch(() => 0);
  return true;
}
const insertInvite = async (db, { inviter, invitee, source, ref = "" }) => (await db.prepare("INSERT OR IGNORE INTO invite_success(inviter_user_id,invitee_user_id,source,ref,created) VALUES(?,?,?,?,?)").bind(inviter, invitee, source, String(ref).slice(0, 80), now()).run()).meta?.changes > 0;

// Zurechnungen ueber den Link an diesen Einlader in den letzten win Sekunden (Tagesgrenze)
const refDay = async (db, inviter, win = 86400) => (await db.prepare("SELECT COUNT(*) n FROM invite_success WHERE inviter_user_id=? AND source='ref' AND created>?").bind(inviter, now() - win).first())?.n || 0;

// Vorgemerkte Zurechnungen nachholen (Tageslauf). Wer ueber einer Tagesgrenze lag, ist in invite_pending vorgemerkt (geprueft: gueltiger Beleg,
// Konto nach dem Klick entstanden) und muss dafuer nicht wiederkommen. Die Grenzen gelten weiter: je Einlader hoechstens REF_DAY_CAP Zurechnungen
// ueber den Link pro Tag (direkte und nachgeholte zusammen); Zeilen, die an der Grenze je Anschluss lagen (held=1), hoechstens REF_IP_CAP je
// Einlader und Tag (Zaehler invref:late:<einlader>, auch bei mehreren Laeufen am Tag) - der Hash der IP-Adresse wird dafuer nicht aufbewahrt.
// Vor dem Zaehlen wird alles erneut geprueft (Einlader aktiv, Konto berechtigt, nach dem Klick entstanden und niemandem zugerechnet); was nicht
// mehr zaehlen kann, entfaellt. Die Stufe bewertet danach syncInviterBadges, einmal je Einlader. Fenster 23 h statt 24 h: der Lauf von gestern
// (06:00, auf die Sekunde nie gleich) darf den von heute nicht blockieren.
export async function creditPending(env, max = PEND_RUN) {
  const db = env.DB; await ensureInvites(db);
  const all = async (sql, ...b) => (await db.prepare(sql).bind(...b).all()).results || [];
  const pick = (i, held, n) => all("SELECT * FROM invite_pending WHERE inviter_user_id=? AND held=? ORDER BY created,invitee_user_id LIMIT ?", i, held, n);
  let n = 0;
  for (const { i } of await all("SELECT inviter_user_id i FROM invite_pending GROUP BY inviter_user_id ORDER BY MIN(created) LIMIT 100")) {
    let room = Math.min(REF_DAY_CAP - await refDay(db, i, 82800), max - n); if (room <= 0) continue;
    const rows = [...await pick(i, 0, room), ...await pick(i, 1, Math.min(room, REF_IP_CAP))].sort((a, b) => a.created - b.created);
    let full = false;   // Tagesmenge der an der Anschluss-Grenze vorgemerkten erreicht
    for (const r of rows) {
      if (room <= 0) break;
      const o = { inviter: i, invitee: r.invitee_user_id, source: "ref", ref: r.ref, since: r.since }, open = await inviteOpen(db, o);
      if (open && r.held && (full || (full = !(await rateLimit(db, `invref:late:${i}`, REF_IP_CAP, 82800))))) continue;   // bleibt vorgemerkt
      if (open && (await insertInvite(db, o))) { room--; n++; }
      await db.prepare("DELETE FROM invite_pending WHERE invitee_user_id=?").bind(r.invitee_user_id).run();
    }
  }
  return n;
}

// Kontoloeschung (DSGVO): alle Zeilen des Kontos, als Einlader (ref = eigenes Profilkuerzel) wie als eingeladene Person; wer ein Konto entwertet
// hat (voided_by), bleibt nicht als Verweis stehen. Die Stufe des Einladers einer geloeschten Person wird sofort neu bewertet.
export async function deleteUserInvites(env, id) {
  const db = env.DB; await ensureInvites(db);
  const by = (await db.prepare("SELECT inviter_user_id i FROM invite_success WHERE invitee_user_id=?").bind(id).first())?.i || 0;
  await db.batch([db.prepare("DELETE FROM invite_success WHERE inviter_user_id=? OR invitee_user_id=?").bind(id, id), db.prepare("UPDATE invite_success SET voided_by=0 WHERE voided_by=?").bind(id),
    db.prepare("DELETE FROM invite_pending WHERE inviter_user_id=? OR invitee_user_id=?").bind(id, id)]);   // auch vorgemerkte Zurechnungen, beide Seiten
  if (by && by !== id) await evalBadges(env, by).catch(() => 0);
}

export async function inviteCount(db, uid) {
  try { return (await db.prepare("SELECT COUNT(*) n FROM invite_success WHERE inviter_user_id=? AND voided=0").bind(uid).first())?.n || 0; } catch { return 0; }
}

export async function syncInviterBadges(env) {   // taeglich: vorgemerkte Zurechnungen nachholen, Stufen neu bewerten (auch Entzug nach Entwertung)
  const db = env.DB; await ensureInvites(db);
  // abgelaufene Zaehler der Tagesgrenzen loeschen (invref:<konto>, invref:ip:<einlader>:<hash der IP-Adresse>, invref:late:<einlader>): nichts davon bleibt laenger als zwei Tage (Datenschutzerklaerung)
  await db.prepare("DELETE FROM ratelimit WHERE k>='invref:' AND k<'invref;' AND win<?").bind(now() - 86400).run().catch(() => 0);
  const late = await creditPending(env).then(() => null, (e) => e);   // ein Fehler hier haelt den Abgleich nicht auf, wird aber danach gemeldet (cron_runs)
  // nur bestehende Konten: evalBadges legt sonst fuer eine verwaiste Kennung wieder Abzeichen an
  const ids = new Set(((await db.prepare("SELECT s.inviter_user_id id FROM invite_success s JOIN users u ON u.id=s.inviter_user_id UNION SELECT b.user_id id FROM user_badges b JOIN users u ON u.id=b.user_id WHERE b.badge LIKE 'inviter\\_%' ESCAPE '\\'").all()).results || []).map((r) => r.id));
  let n = 0; for (const id of ids) { await evalBadges(env, id); n++; }
  if (late) throw late;
  return n;
}

// JSON-Koerper als Objekt: fehlender, kaputter oder leerer Koerper (auch das gueltige JSON null) ergibt {} - Antwort 400 statt Ausnahme und 500
const body = async (request) => { const b = await request.json().catch(() => null); return b && typeof b === "object" ? b : {}; };

export async function handleInviter(env, request, url, path, user, J) {
  if (path !== "/api/invite/me" && path !== "/api/invite/click" && path !== "/api/invite/ref" && path !== "/api/admin/invites" && path !== "/api/admin/invite/void") return null;
  const db = env.DB, method = request.method;
  if (path === "/api/invite/click" && method === "POST") {   // Link geoeffnet (/einladung/<kuerzel>/ oder ?ref=): Klick-Beleg, ohne Anmeldung und ohne Datenbank (weder Zugriff noch Eintrag)
    const h = String((await body(request)).ref || "").toLowerCase();
    if (!HANDLE.test(h)) return J({ error: "bad_request" }, 400);
    return J({ ok: true, token: user ? "" : await clickToken(env, h) });   // schon angemeldet: das Konto gibt es bereits, nichts zuzurechnen
  }
  await ensureInvites(db);
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/invite/me" && method === "GET") {
    // Seite /einladung/<kuerzel>/ mit Name, Kurzvorstellung und Teilen-Karte gibt es nur fuer oeffentliche Profile (site_invite.py). Ist das Profil
    // nicht (mehr) oeffentlich, gibt es ab sofort nur den schlichten Link /community/?ref=<kuerzel> (ohne Vorschau, ohne Namen); ohne Kuerzel keinen.
    // Die Seite entsteht erst mit dem naechsten Seitenbau: bis dahin leitet der Site-Worker /einladung/<kuerzel>/ auf den schlichten Link (kein 404).
    const p = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=? AND handle IS NOT NULL").bind(user.id).first();
    const h = p?.handle || "", preview = !!(h && p.public), ref_link = h ? `${env.SITE}/community/?ref=${h}` : "";
    const count = await inviteCount(db, user.id), tier = inviterTier(count);
    // ueber der Tagesgrenze vorgemerkt: wird an den folgenden Tagen nachgeholt (ohne Konten, die inzwischen anders zugerechnet sind)
    const pending = (await db.prepare("SELECT COUNT(*) n FROM invite_pending p WHERE p.inviter_user_id=? AND NOT EXISTS (SELECT 1 FROM invite_success s WHERE s.invitee_user_id=p.invitee_user_id)").bind(user.id).first())?.n || 0;
    return J({ handle: h, link: preview ? `${env.SITE}/einladung/${h}/` : ref_link, ref_link, preview, count, pending, tier, next: INVITER_TIERS.find((t) => t > count) || 0, tiers: INVITER_TIERS }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/invite/ref" && method === "POST") {   // Klick-Beleg nach der Anmeldung einloesen
    const k = await readClick(env, (await body(request)).token);
    if (!k) return J({ error: "bad_request" }, 400);   // ohne gueltigen Beleg keine Zurechnung (auch nicht mit {ref, t} aus dem Browser)
    if (!(await rateLimit(db, `invref:${user.id}`, 10, 86400))) return J({ error: "rate_limit" }, 429);
    const p = await db.prepare("SELECT user_id FROM profiles WHERE handle=?").bind(k.h).first();
    const o = { inviter: +p?.user_id || 0, invitee: user.id, source: "ref", ref: k.h, since: k.t };   // since = Serverzeit des Klicks: das Konto muss danach entstanden sein
    if (!(await inviteOpen(db, o))) return J({ ok: true, counted: false });
    if (await db.prepare("SELECT 1 x FROM invite_pending WHERE invitee_user_id=?").bind(user.id).first()) return J({ ok: true, counted: false, pending: true });   // schon vorgemerkt (die erste Einladung gilt)
    // Tagesgrenzen erst, wenn die Einladung sonst zaehlen wuerde: je Einlader von einem Anschluss (der Zaehler gehoert zum Einlader - ein Buero oder
    // Mobilfunknetz, das zwei Mitglieder einladen, teilt ihn nicht) und je Einlader insgesamt. Darueber geht nichts verloren und niemand muss
    // wiederkommen: die Zurechnung wird vorgemerkt, der Tageslauf holt sie nach (creditPending). held=1: lag an der Grenze je Anschluss.
    const ip = (await sha256hex(`${env.SESSION_SECRET}:invref:${request.headers.get("cf-connecting-ip") || "0"}`)).slice(0, 32);
    const held = !(await rateLimit(db, `invref:ip:${o.inviter}:${ip}`, REF_IP_CAP, 86400)) ? 1 : (await refDay(db, o.inviter)) >= REF_DAY_CAP ? 0 : -1;
    if (held < 0) return J({ ok: true, counted: await recordInvite(env, o) });
    await db.prepare("INSERT OR IGNORE INTO invite_pending(invitee_user_id,inviter_user_id,ref,since,held,created) VALUES(?,?,?,?,?,?)").bind(user.id, o.inviter, k.h, k.t, held, now()).run();
    return J({ ok: true, counted: false, pending: true });
  }
  if (!user.admin) return J({ error: "forbidden" }, 403);
  if (path === "/api/admin/invites" && method === "GET") {
    const q = +url.searchParams.get("inviter") || 0;
    const rows = (await db.prepare(`SELECT s.*,a.name inviter_name,b.name invitee_name FROM invite_success s LEFT JOIN users a ON a.id=s.inviter_user_id LEFT JOIN users b ON b.id=s.invitee_user_id ${q ? "WHERE s.inviter_user_id=?" : ""} ORDER BY s.created DESC LIMIT 200`).bind(...(q ? [q] : [])).all()).results || [];
    return J({ items: rows });
  }
  if (path === "/api/admin/invite/void" && method === "POST") {
    const b = await body(request), id = +b.invitee, undo = !!b.undo;
    const s = id ? await db.prepare("SELECT inviter_user_id i FROM invite_success WHERE invitee_user_id=?").bind(id).first() : null; if (!s) return J({ error: "not_found" }, 404);
    await db.prepare("UPDATE invite_success SET voided=?,voided_by=?,voided_at=? WHERE invitee_user_id=?").bind(undo ? 0 : 1, undo ? 0 : user.id, undo ? 0 : now(), id).run();
    await audit(db, user.id, undo ? "invite-unvoid" : "invite-void", id, `inviter ${s.i}`);
    await evalBadges(env, s.i);
    return J({ ok: true, count: await inviteCount(db, s.i) });
  }
  return J({ error: "not_found" }, 404);
}
