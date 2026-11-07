// Einladungsmails fuer Personen-Entitaeten: "Zu dir gibt es eine Seite auf M365.FM – uebernehmen, ergaenzen oder entfernen lassen."
// Token im Link belegt die Adresse; Annahme verknuepft die Entitaet mit dem Konto (entity_claims, via invite). Ablehnen sperrt weitere Einladungen.
import { mailReady, sendMail } from "./mailer.js";
import { esc, randomToken, rateLimit, cleanText } from "./util.js";
import { claimEntity } from "./events.js";
import { entityMap } from "./entities.js";

const now = () => Math.floor(Date.now() / 1000);
const EID = /^[a-z0-9][a-z0-9-]{1,78}$/;
let ready = false;
async function ensure(db) {
  if (ready) return;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS entity_invites (token TEXT PRIMARY KEY, eid TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, by_user INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'sent', created INTEGER NOT NULL, reminded INTEGER NOT NULL DEFAULT 0, UNIQUE(eid, email))"),
    db.prepare("CREATE TABLE IF NOT EXISTS entity_contacts (eid TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL, created INTEGER NOT NULL, source TEXT NOT NULL DEFAULT 'guest')"),
    db.prepare("CREATE TABLE IF NOT EXISTS invite_block (email TEXT PRIMARY KEY, created INTEGER NOT NULL)"),
  ]);
  try { await db.prepare("ALTER TABLE entity_contacts ADD COLUMN source TEXT NOT NULL DEFAULT 'guest'").run(); } catch { /* Spalte existiert schon */ }
  ready = true;
}
const page = (t, b, code = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>M365.FM</title><body style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:12vh auto;padding:0 16px"><h2>${t}</h2>${b}</body>`, { status: code, headers: { "content-type": "text/html; charset=utf-8" } });
const link = (env, t) => `${env.SITE}/community/?invite=${encodeURIComponent(t)}#c-invite`;

// Einladungen sind ausschliesslich englisch und kommen persoenlich von Mirko (Anzeigename), Antworten gehen an die oeffentliche Kontaktadresse aus dem Impressum.
const FROM_NAME = "Mirko from M365 Show", REPLY_TO = "mirko.peters@m365.fm";
const FOOTER = "You receive this one-time message because M365.FM stores public information about you (name, public profile details). It is not advertising; we will remind you at most once. Controller: M365.FM, Julius-Hölder-Str 60, 70597 Stuttgart, Germany, mirko.peters@m365.fm.";
const PROGRAM = /\b(MVP|MCT)\b/;   // Wortgrenzen, gross geschrieben: "MVPs", "AMVP" oder "mvp" zaehlen nicht
const strs = (v) => (typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strs) : []);
// "mvp" (MVP/MCT-Variante) oder "default": Programmfeld der Entitaet (program/programs) oder desc/long enthaelt MVP bzw. MCT als Wort
export function inviteVariant(ent) {
  if (!ent || typeof ent !== "object") return "default";
  return [ent.program, ent.programs, ent.desc, ent.long].some((v) => strs(v).some((t) => PROGRAM.test(t))) ? "mvp" : "default";
}
async function entMap(env) { try { return await entityMap(env); } catch { return new Map(); } }
export function mailSubject(reminder, variant = "default") {
  if (variant === "speaker") return reminder ? "Reminder: your speaker page on M365.FM" : "Your speaker page on M365.FM – claim it";
  return reminder ? "Reminder: your guest page on M365.FM" : "Your guest page on M365.FM – claim it";
}
function lines(env, inv, reminder, variant) {
  const accept = link(env, inv.token), decline = `${env.API}/api/entityinvite/decline?t=${encodeURIComponent(inv.token)}`, page_ = `${env.SITE}/entity/${inv.eid}/`;
  const pre = reminder ? "Quick reminder: " : "";
  const benefit = variant === "speaker"
    ? "If you claim it (free), you can keep your bio, topics and links up to date, your talks show up on your profile with a speaker badge, and – if you are an MVP – they count in the MVP Contribution Tracker."
    : variant === "mvp"
    ? "If you claim it (free), you can keep your bio, topics and links up to date – and your podcast appearance is already counted in the MVP Contribution Tracker, together with your blog, YouTube or Sessionize sources if you add them. Handy for your next MVP renewal."
    : "If you claim it (free), you can keep your bio, topics and links up to date, show up as an expert for your topics and find podcast and event hosts in the guest exchange.";
  const intro = variant === "speaker" ? "thanks again for speaking at M365Con. Your session now has its own page on M365.FM, and there is a profile page for you:" : "thanks again for being a guest on the M365 Show. Your episode now has its own page on M365.FM, and there is a profile page for you:";
  return { accept, decline, page_, pre, benefit, intro };
}
export function mailBody(env, inv, byName, reminder, variant = "default") {
  const { accept, decline, page_, pre, benefit, intro } = lines(env, inv, reminder, variant);
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#1b2430;line-height:1.55">
<p>Hi ${esc(inv.name)},</p>
<p>${pre}${intro} <a href="${esc(page_)}">${esc(page_)}</a></p>
<p>${benefit}</p>
<p><a href="${esc(accept)}" style="background:#3E8BC0;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Claim my page</a> &nbsp;·&nbsp; <a href="${esc(decline)}">This isn't me / please remove</a></p>
<p>Best,<br>Mirko</p>
<p style="font-size:12px;color:#6b7785">${esc(FOOTER)}</p></div>`;
}
export function mailText(env, inv, reminder, variant = "default") {
  const { accept, decline, page_, pre, benefit, intro } = lines(env, inv, reminder, variant);
  return `Hi ${inv.name},\n\n${pre}${intro} ${page_}\n\n${benefit}\n\nClaim my page: ${accept}\nThis isn't me / please remove: ${decline}\n\nBest,\nMirko\n\n${FOOTER}`;
}
function mailMsg(env, inv, byName, reminder, variant) {
  return { to: inv.email, subject: mailSubject(reminder, variant), html: mailBody(env, inv, byName, reminder, variant), text: mailText(env, inv, reminder, variant), lang: "en", fromName: FROM_NAME, replyTo: REPLY_TO };
}
async function send(env, inv, byName, reminder, emap) {   // Erinnerung: gleiche Variante wie die Einladung
  const unsub = `${env.API}/api/entityinvite/decline?t=${encodeURIComponent(inv.token)}`;
  const variant = await resolveVariant(env.DB, inv.eid, (emap || (await entMap(env))).get(inv.eid));
  return sendMail(env, { ...mailMsg(env, inv, byName, reminder, variant), headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
}
// Variante je Kontakt: Quelle 'speaker' -> speaker; sonst Gast (MVP/default). Ohne Kontaktzeile: Sprecher in event_sessions -> speaker.
export async function resolveVariant(db, eid, ent, source) {
  if (!source) {
    const c = await db.prepare("SELECT source FROM entity_contacts WHERE eid=?").bind(eid).first();
    source = c?.source || (await db.prepare("SELECT 1 x FROM event_sessions WHERE speakers LIKE ?").bind(`%"e":"${eid}"%`).first().catch(() => null) ? "speaker" : "guest");
  }
  return source === "speaker" ? "speaker" : inviteVariant(ent);
}
const maskEmail = (e) => { const [l, d] = String(e).split("@"); return `${l.slice(0, 1)}***@${d}`; };
const MAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/;
// Eine Einladung pruefen und (ausser bei dry) anlegen + senden. Gemeinsame Logik fuer /send und /send-batch.
async function inviteOne(env, db, user, staff, x, emap, dry, seen) {
  const eid = String(x.eid || "").toLowerCase();
  let email = String(x.email || "").trim().toLowerCase(), name = cleanText(x.name, 80).replace(/[<>]/g, "");
  if (staff && eid && !email) { const c = await db.prepare("SELECT email,name FROM entity_contacts WHERE eid=?").bind(eid).first(); if (c) { email = c.email; name = name || c.name; } }
  if (!EID.test(eid) || !name || !MAIL_RE.test(email)) return { eid, error: "bad_input" };
  if (!staff) {   // Mitglieder: nur fuer Entitaeten, die sie selbst angelegt haben
    const own = await db.prepare("SELECT 1 x FROM entity_rev WHERE eid=? AND user_id=?").bind(eid, user.id).first(); if (!own) return { eid, error: "not_yours" };
  }
  if (await db.prepare("SELECT 1 x FROM invite_block WHERE email=?").bind(email).first()) return { eid, error: "blocked" };
  if (await db.prepare("SELECT 1 x FROM entity_claims WHERE eid=? AND status='verified'").bind(eid).first()) return { eid, error: "claimed" };
  if (await db.prepare("SELECT 1 x FROM entity_invites WHERE email=?").bind(email).first()) return { eid, error: "already" };   // je Adresse hoechstens eine Einladung, egal fuer welche Entitaet
  if (seen) { if (seen.has(email)) return { eid, error: "duplicate_email" }; seen.add(email); }
  const variant = await resolveVariant(db, eid, emap.get(eid), x.contact_source);
  if (dry) return { eid, email: maskEmail(email), variant };
  const inv = { token: randomToken(20), eid, name, email };
  await db.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created) VALUES(?,?,?,?,?,?)").bind(inv.token, eid, name, email, user.id, now()).run();
  const r = await send(env, inv, user.name, false, emap);
  if (!r.ok) await db.prepare("DELETE FROM entity_invites WHERE token=?").bind(inv.token).run();
  return { eid, ok: r.ok, variant };
}
export async function remindInvites(env) {   // Cron: nach 7 Tagen einmal erinnern
  const db = env.DB; await ensure(db); if (!mailReady(env)) return 0;
  const rows = (await db.prepare("SELECT i.*,COALESCE(u.name,'') byn FROM entity_invites i LEFT JOIN users u ON u.id=i.by_user WHERE i.status='sent' AND i.reminded=0 AND i.created<? LIMIT 20").bind(now() - 7 * 86400).all()).results || [];
  const emap = rows.length ? await entMap(env) : new Map();
  for (const r of rows) { const x = await send(env, r, r.byn, true, emap); await db.prepare("UPDATE entity_invites SET reminded=? WHERE token=?").bind(x.ok ? 1 : 2, r.token).run(); }
  return rows.length;
}

export async function handleEntityInvite(env, request, url, path, user, J) {
  if (!path.startsWith("/api/entityinvite/")) return null;
  const db = env.DB, method = request.method; await ensure(db);
  if (path === "/api/entityinvite/decline" && method === "GET") {
    const t = url.searchParams.get("t") || "", i = t ? await db.prepare("SELECT eid,email FROM entity_invites WHERE token=?").bind(t).first() : null;
    if (!i) return page("Link ungültig / invalid", "", 404);
    await db.batch([db.prepare("UPDATE entity_invites SET status='declined' WHERE token=?").bind(t), db.prepare("INSERT OR IGNORE INTO invite_block(email,created) VALUES(?,?)").bind(i.email, now())]);
    return page("✓ Erledigt / Done", `<p>Wir laden dich nicht erneut ein. Die Seite <b>${esc(i.eid)}</b> wird vom Team geprüft und auf Wunsch entfernt.</p><p>We will not invite you again; the team will review and, on request, remove the page.</p>`);
  }
  if (path === "/api/entityinvite/info" && method === "GET") {
    const i = await db.prepare("SELECT eid,name,status FROM entity_invites WHERE token=?").bind(url.searchParams.get("t") || "").first();
    return i ? J({ eid: i.eid, name: i.name, status: i.status }) : J({ error: "not_found" }, 404);
  }
  if (!user) return J({ error: "login" }, 401);
  const body = async () => request.json().catch(() => ({}));
  if (path === "/api/entityinvite/accept" && method === "POST") {
    const b = await body(), i = await db.prepare("SELECT * FROM entity_invites WHERE token=?").bind(String(b.t || "")).first();
    if (!i || i.status === "declined") return J({ error: "not_found" }, 404);
    const pr = await db.prepare("SELECT 1 x FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first(); if (!pr) return J({ error: "need_profile" }, 409);
    if (!(await claimEntity(db, i.eid, user.id, "invite"))) return J({ error: "claimed" }, 409);
    await db.prepare("UPDATE entity_invites SET status='claimed' WHERE token=?").bind(i.token).run();
    return J({ ok: true, eid: i.eid });
  }
  if (path === "/api/entityinvite/mine" && method === "GET") {
    const rows = (await db.prepare(`SELECT eid,name,status,created,reminded,${user.admin || user.editor ? "email" : "'' email"} FROM entity_invites WHERE ${user.admin || user.editor ? "1=1" : "by_user=?"} ORDER BY created DESC LIMIT 300`).bind(...(user.admin || user.editor ? [] : [user.id])).all()).results || [];
    return J({ items: rows, mail: mailReady(env), staff: !!(user.admin || user.editor) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/entityinvite/contacts" && (user.admin || user.editor)) {   // Kontaktadressen (nur DB, nie im Repo)
    if (method === "GET") { const c = await db.prepare("SELECT COUNT(*) n FROM entity_contacts").first(); const o = await db.prepare("SELECT COUNT(*) n FROM entity_contacts c WHERE NOT EXISTS (SELECT 1 FROM entity_invites i WHERE i.eid=c.eid)").first(); return J({ contacts: c.n, not_invited: o.n }); }
    if (method === "POST") {
      const b = await body(), items = (Array.isArray(b.items) ? b.items : []).slice(0, 400), src = b.source === "speaker" ? "speaker" : "guest"; let n = 0;
      for (const x of items) {
        const eid = String(x.eid || "").toLowerCase(), email = String(x.email || "").trim().toLowerCase(), name = cleanText(x.name, 80).replace(/[<>]/g, "");
        if (!EID.test(eid) || !name || !/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/.test(email)) continue;
        await db.prepare("INSERT INTO entity_contacts(eid,email,name,created,source) VALUES(?,?,?,?,?) ON CONFLICT(eid) DO UPDATE SET email=excluded.email,name=excluded.name,source=excluded.source").bind(eid, email, name, now(), src).run(); n++;
      }
      return J({ ok: true, saved: n });
    }
  }
  if (path === "/api/entityinvite/send" && method === "POST") {
    const b = await body(), staff = !!(user.admin || user.editor);
    const list = (Array.isArray(b.items) ? b.items : [b]).slice(0, staff ? 50 : 3);
    if (!mailReady(env)) return J({ error: "mail_off" }, 503);
    if (!(await rateLimit(db, `einv:${user.id}`, staff ? 200 : 5, 86400))) return J({ error: "rate_limit" }, 429);
    const emap = await entMap(env), out = [], seen = new Set();
    for (const x of list) { const r = await inviteOne(env, db, user, staff, { ...x, contact_source: undefined }, emap, false, seen); out.push(r.error ? r : { eid: r.eid, ok: r.ok }); }
    return J({ results: out });
  }
  if (path === "/api/entityinvite/test" && method === "POST") {   // Nur Admin: Probe-Mail an das eigene Konto, keine Einladungszeile, kein entity_invites-Eintrag
    if (!user.admin) return J({ error: "forbidden" }, 403);
    const b = await body(), eid = String(b.eid || "").toLowerCase();
    if (!EID.test(eid)) return J({ error: "bad_input" }, 400);
    if (!mailReady(env)) return J({ error: "mail_off" }, 503);
    const address = await db.prepare("SELECT email FROM mail_addr WHERE user_id=? AND verified=1").bind(user.id).first();
    if (!address) return J({ error: "email_unverified" }, 409);
    if (!(await rateLimit(db, `einvtest:${user.id}`, 20, 3600))) return J({ error: "rate_limit" }, 429);
    const ent = (await entMap(env)).get(eid), variant = inviteVariant(ent);
    const inv = { token: "TEST-" + randomToken(12), eid, name: cleanText(ent?.name || b.name || eid, 80).replace(/[<>]/g, ""), email: address.email };
    const m = mailMsg(env, inv, user.name, false, variant);
    const r = await sendMail(env, { ...m, subject: "[TEST] " + m.subject });
    return J({ ok: r.ok, variant }, r.ok ? 200 : 502);
  }
  if (path === "/api/entityinvite/send-batch" && (method === "POST" || method === "GET")) {   // Nur Admin: Sammelversand an Kontakte, die noch nicht eingeladen sind
    if (!user.admin) return J({ error: "forbidden" }, 403);
    const waiting = "FROM entity_contacts c WHERE NOT EXISTS (SELECT 1 FROM entity_invites i WHERE i.eid=c.eid OR i.email=c.email) AND NOT EXISTS (SELECT 1 FROM invite_block k WHERE k.email=c.email) AND NOT EXISTS (SELECT 1 FROM entity_claims e WHERE e.eid=c.eid AND e.status='verified')";
    if (method === "GET") {
      const out = { contacts: 0, eligible: 0, sources: {} };
      for (const src of ["guest", "speaker"]) {
        const c = await db.prepare("SELECT COUNT(*) n FROM entity_contacts WHERE source=?").bind(src).first(), w = await db.prepare(`SELECT COUNT(*) n ${waiting} AND c.source=?`).bind(src).first();
        out.sources[src] = { contacts: c?.n || 0, eligible: w?.n || 0 }; out.contacts += c?.n || 0; out.eligible += w?.n || 0;
      }
      return J(out);
    }
    const b = await body(), limit = Math.max(1, Math.min(50, parseInt(b.limit, 10) || 50)), dry = !!b.dry_run, src = b.source === "speaker" || b.source === "guest" ? b.source : "";
    if (!dry && !mailReady(env)) return J({ error: "mail_off" }, 503);
    // Gaeste zuerst, dann Speaker; mehr Zeilen holen, damit uebersprungene Dubletten (gleiche Adresse) das Limit nicht aufbrauchen
    const rows = (await db.prepare(`SELECT c.eid,c.email,c.name,c.source contact_source ${waiting}${src ? " AND c.source=?" : ""} ORDER BY (c.source='speaker'), c.created, c.eid LIMIT ?`).bind(...(src ? [src] : []), limit * 4).all()).results || [];
    const emap = await entMap(env), seen = new Set(), results = []; let sent = 0, want = 0;
    for (const x of rows) {
      if (want >= limit) break;
      if (!dry && !(await rateLimit(db, `einv:${user.id}`, 200, 86400))) { results.push({ eid: x.eid, error: "rate_limit" }); break; }
      const r = await inviteOne(env, db, user, true, x, emap, dry, seen);
      if (r.error === "duplicate_email" || r.error === "already" || r.error === "blocked" || r.error === "claimed") continue;
      want++; results.push(r); if (r.ok) sent++;
    }
    if (dry) return J({ dry_run: true, items: results });
    const limited = results.some((r) => r.error === "rate_limit");
    return J({ dry_run: false, sent, rate_limited: limited, results }, limited && !sent ? 429 : 200);
  }
  return J({ error: "not_found" }, 404);
}
