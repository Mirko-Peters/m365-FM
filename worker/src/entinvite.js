// Einladungsmails fuer Personen-Entitaeten: "Zu dir gibt es eine Seite auf M365.FM – uebernehmen, ergaenzen oder entfernen lassen."
// Token im Link belegt die Adresse; Annahme verknuepft die Entitaet mit dem Konto (entity_claims, via invite). Ablehnen sperrt weitere Einladungen.
import { entityMap } from "./entities.js";
import { maskEmail as maskAddr } from "./claimverify.js";   // kein eigenes maskEmail in dieser Datei (ein Helfer, ein Format: m***@example.com)
import { M365CON_HANDLES } from "./pastevents.js";
import { notifyAdmins } from "./ads.js";
import { mailReady, sendMail } from "./mailer.js";
import { esc, randomToken, rateLimit, cleanText } from "./util.js";
import { claimEntity } from "./events.js";

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
const declineUrl = (env, t) => `${env.API}/api/entityinvite/decline?t=${encodeURIComponent(t)}`;

// Einladungen sind ausschliesslich englisch. Persoenlich von Mirko (Anzeigename, Antworten an die oeffentliche Kontaktadresse aus dem Impressum) sind nur
// die Varianten mvp | default | speaker, und nur wenn der Admin eine Person einlaedt. Alles andere (Mitglieder, Redaktion, Firmen-Entitaeten) bekommt die
// neutrale Mitteilung "neutral": Absender M365.FM, nennt das einladende Mitglied, behauptet keine Gast- oder Speaker-Beziehung.
const FROM_NAME = "Mirko from M365 Show", REPLY_TO = "mirko.peters@m365.fm";
export const VARIANTS = ["default", "mvp", "speaker", "neutral"];
const REMOVE = "This isn't me / please remove";
const CONTROLLER = "Controller: M365.FM, Julius-Hölder-Str 60, 70597 Stuttgart, Germany, mirko.peters@m365.fm.";
// Fusszeile: was gespeichert ist (Name UND Adresse), woher die Adresse stammt, und dass der Entfernen-Link Widerspruch und Loeschung ist.
// Bewusst kein "It is not advertising": die Mail wirbt fuer die Uebernahme der Seite; decline loescht die Kontaktdaten wirklich (siehe unten).
function footer(variant, who) {
  const personal = variant !== "neutral";
  const source = !personal ? `${who} entered your name and address on M365.FM to send you this invitation.`
    : variant === "speaker" ? "I have your address from our correspondence about your M365Con session."
    : "I have your address from our correspondence about your guest appearance on the M365 Show.";
  return `Why you are getting this e-mail: M365.FM stores your name and your e-mail address, plus the public details shown on the page. ${source} If you do not want this, use the “${REMOVE}” link above. That is how you object and have your data deleted: ${personal ? "I" : "we"} will not write to you again, your contact details are deleted (only your address stays on a do-not-contact list) and the team takes the page down after a short check. ${personal ? "I" : "We"} will remind you at most once. ${CONTROLLER}`;
}
const PROGRAM = /\b(MVP|MCT)\b/;   // Wortgrenzen, gross geschrieben: "MVPs", "AMVP" oder "mvp" zaehlen nicht
const strs = (v) => (typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strs) : []);
// "mvp" (MVP/MCT-Variante) oder "default": Programmfeld der Entitaet (program/programs) oder desc/long enthaelt MVP bzw. MCT als Wort
export function inviteVariant(ent) {
  if (!ent || typeof ent !== "object") return "default";
  return [ent.program, ent.programs, ent.desc, ent.long].some((v) => strs(v).some((t) => PROGRAM.test(t))) ? "mvp" : "default";
}
async function entMap(env) { try { return await entityMap(env); } catch { return new Map(); } }
// Namen in der Mail: nur ein Name (eine Zeile, hoechstens 60 Zeichen), kein Link, keine Adresse, kein Hostname. Gilt fuer die Anrede in Einladungen von
// Mitgliedern und Redaktion (sonst bad_input) und fuer den frei waehlbaren Anzeigenamen des einladenden Mitglieds (sonst ohne Namen).
const plainName = (n) => n.length <= 60 && !/[\n\r@\/\\]|:\/\/|\bwww\.|[\w-]\.[a-z]{2,}\b/i.test(n);
const inviter = (byName) => { const n = cleanText(byName || "", 80).replace(/[<>]/g, "").replace(/\s+/g, " ").trim(); return n.length >= 2 && plainName(n) ? n : "A community member"; };
export function mailSubject(reminder, variant = "default") {
  if (variant === "neutral") return reminder ? "Reminder: your page on M365.FM" : "Your page on M365.FM – claim it or have it removed";
  if (variant === "speaker") return reminder ? "Reminder: your speaker page on M365.FM" : "Your speaker page on M365.FM – claim it";
  return reminder ? "Reminder: your guest page on M365.FM" : "Your guest page on M365.FM – claim it";
}
function lines(env, inv, byName, reminder, variant) {
  const accept = link(env, inv.token), decline = declineUrl(env, inv.token), page_ = `${env.SITE}/entity/${inv.eid}/`;
  const pre = reminder ? "Quick reminder: " : "", who = inviter(byName);
  const benefit = variant === "neutral"
    ? "You can claim the page (free account – then you keep the details, topics and links up to date yourself) or have it removed."
    : variant === "speaker"
    ? "If you claim it (free), you can keep your bio, topics and links up to date, your talks show up on your profile with a speaker badge, and – if you are an MVP – they count in the MVP Contribution Tracker."
    : variant === "mvp"
    ? "If you claim it (free), you can keep your bio, topics and links up to date – and your podcast appearance is already counted in the MVP Contribution Tracker, together with your blog, YouTube or Sessionize sources if you add them. Handy for your next MVP renewal."
    : "If you claim it (free), you can keep your bio, topics and links up to date, show up as an expert for your topics and find podcast and event hosts in the guest exchange.";
  const intro = variant === "neutral" ? `${who} added you to M365.FM, the community platform around Microsoft 365, and asked us to send you this invitation. There is a page about you:`
    : variant === "speaker" ? "thanks again for speaking at M365Con. Your session now has its own page on M365.FM, and there is a profile page for you:"
    : "thanks again for being a guest on the M365 Show. Your episode now has its own page on M365.FM, and there is a profile page for you:";
  return { accept, decline, page_, pre, benefit, intro, sign: variant === "neutral" ? ["The M365.FM team"] : ["Best,", "Mirko"], foot: footer(variant, who) };
}
export function mailBody(env, inv, byName, reminder, variant = "default") {
  const { accept, decline, page_, pre, benefit, intro, sign, foot } = lines(env, inv, byName, reminder, variant);
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#1b2430;line-height:1.55">
<p>Hi ${esc(inv.name)},</p>
<p>${esc(pre + intro)} <a href="${esc(page_)}">${esc(page_)}</a></p>
<p>${benefit}</p>
<p><a href="${esc(accept)}" style="background:#3E8BC0;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">Claim my page</a> &nbsp;·&nbsp; <a href="${esc(decline)}">${esc(REMOVE)}</a></p>
<p>${sign.join("<br>")}</p>
<p style="font-size:12px;color:#6b7785">${esc(foot)}</p></div>`;
}
export function mailText(env, inv, byName, reminder, variant = "default") {
  const { accept, decline, page_, pre, benefit, intro, sign, foot } = lines(env, inv, byName, reminder, variant);
  return `Hi ${inv.name},\n\n${pre}${intro} ${page_}\n\n${benefit}\n\nClaim my page: ${accept}\n${REMOVE}: ${decline}\n\n${sign.join("\n")}\n\n${foot}`;
}
// banner: false -> kein M365Con-Hinweis unter Einladungen (Empfaenger haben kein Konto und nichts abonniert)
function mailMsg(env, inv, byName, reminder, variant) {
  return { to: inv.email, subject: mailSubject(reminder, variant), html: mailBody(env, inv, byName, reminder, variant), text: mailText(env, inv, byName, reminder, variant), lang: "en", banner: false,
    ...(variant === "neutral" ? {} : { fromName: FROM_NAME, replyTo: REPLY_TO }) };
}
async function send(env, inv, byName, reminder, variant) {
  return sendMail(env, { ...mailMsg(env, inv, byName, reminder, variant), headers: { "List-Unsubscribe": `<${declineUrl(env, inv.token)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
}
// Hat die Person wirklich bei einer M365Con gesprochen? Nur Sessions der M365Con-Ausgaben selbst (nicht irgendeines Mitglieder-Events, dort verknuepft
// speakersCheck Personen per Namen), die schon stattgefunden haben; eine abgelehnte Zuordnung zaehlt nicht.
export async function spokeAtCon(db, eid) {
  const rows = (await db.prepare(`SELECT s.speakers FROM event_sessions s JOIN events v ON v.id=s.event_id WHERE v.handle IN (${M365CON_HANDLES.map(() => "?").join(",")}) AND s.status='live' AND s.start<>'' AND s.start<? AND s.speakers LIKE ? LIMIT 20`)
    .bind(...M365CON_HANDLES, new Date().toISOString().slice(0, 16), `%"e":"${eid}"%`).all().catch(() => ({ results: [] }))).results || [];
  return rows.some((r) => { try { return JSON.parse(r.speakers).some((x) => x && x.e === eid && x.s !== "declined"); } catch { return false; } });
}
// Variante einer Einladung. personal=false (kein Admin) oder eine Entitaet, die keine Person ist -> neutral. Sonst je Kontakt: Quelle 'speaker'
// (Mirkos M365Con-Speakerliste) -> speaker; ohne Kontaktzeile nur, wenn die Person bei einer M365Con gesprochen hat; sonst Gast (MVP/default).
export async function resolveVariant(db, eid, ent, source, personal = true) {
  if (!personal || (ent && ent.type && ent.type !== "person")) return "neutral";
  if (!source) {
    const c = await db.prepare("SELECT source FROM entity_contacts WHERE eid=?").bind(eid).first();
    source = c?.source || ((await spokeAtCon(db, eid)) ? "speaker" : "guest");
  }
  return source === "speaker" ? "speaker" : inviteVariant(ent);
}
const adminRow = (env, u) => !!u && (u.role === "admin" || (!!u.provider && (env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).includes(`${u.provider}:${u.sub}`)));   // wie isAdmin in index.js
const MAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/;
// Eine Einladung pruefen und (ausser bei dry) anlegen + senden. Gemeinsame Logik fuer /send und /send-batch.
async function inviteOne(env, db, user, staff, x, emap, dry, seen) {
  const eid = String(x.eid || "").toLowerCase(), admin = !!user.admin;
  let email = String(x.email || "").trim().toLowerCase(), name = cleanText(x.name, 80).replace(/[<>]/g, "");
  // Kontaktadressen (Mirkos Gaeste- und Speaker-Korrespondenz) schreibt nur der Admin an: nur er verschickt die persoenliche Fassung
  if (admin && eid && !email) { const c = await db.prepare("SELECT email,name FROM entity_contacts WHERE eid=?").bind(eid).first(); if (c) { email = c.email; name = name || c.name; } }
  if (!EID.test(eid) || !name || !MAIL_RE.test(email) || (!admin && !plainName(name))) return { eid, error: "bad_input" };
  if (!staff) {   // Mitglieder: nur fuer Entitaeten, die sie selbst angelegt haben
    const own = await db.prepare("SELECT 1 x FROM entity_rev WHERE eid=? AND user_id=?").bind(eid, user.id).first(); if (!own) return { eid, error: "not_yours" };
  }
  if (await db.prepare("SELECT 1 x FROM invite_block WHERE email=?").bind(email).first()) return { eid, error: "blocked" };
  if (await db.prepare("SELECT 1 x FROM entity_claims WHERE eid=? AND status='verified'").bind(eid).first()) return { eid, error: "claimed" };
  if (await db.prepare("SELECT 1 x FROM entity_invites WHERE email=?").bind(email).first()) return { eid, error: "already" };   // je Adresse hoechstens eine Einladung, egal fuer welche Entitaet
  if (seen) { if (seen.has(email)) return { eid, error: "duplicate_email" }; seen.add(email); }
  const variant = await resolveVariant(db, eid, emap.get(eid), x.contact_source, admin);
  if (dry) return { eid, email: maskAddr(email), variant };
  const inv = { token: randomToken(20), eid, name, email };
  // Pruefen und Anlegen in einer Anweisung: ein gleichzeitiger zweiter Aufruf (Doppelklick, /send neben dem Sammelversand) verliert sauber statt mit einem UNIQUE-Fehler (500)
  const ins = await db.prepare("INSERT OR IGNORE INTO entity_invites(token,eid,name,email,by_user,created) SELECT ?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM entity_invites WHERE email=?)").bind(inv.token, eid, name, email, user.id, now(), email).run();
  if (!Number(ins.meta?.changes || 0)) return { eid, error: "already" };
  const r = await send(env, inv, user.name, false, variant);
  if (!r.ok) await db.prepare("DELETE FROM entity_invites WHERE token=?").bind(inv.token).run();
  return { eid, ok: r.ok, variant };
}
// Erledigt = nie (mehr) erinnern: Adresse gesperrt (auch ueber eine andere Einladung abgelehnt) oder die Seite ist uebernommen bzw. in Pruefung
// (dann scheitert die Annahme per Token ohnehin). Wer ueber die normale Seite uebernimmt, behaelt status 'sent' - deshalb zaehlt entity_claims.
const settled = (a) => `(EXISTS (SELECT 1 FROM invite_block k WHERE k.email=${a}.email) OR EXISTS (SELECT 1 FROM entity_claims e WHERE e.eid=${a}.eid AND e.status<>'rejected'))`;
export async function remindInvites(env) {   // Cron: nach 7 Tagen einmal erinnern, in derselben Variante wie die Einladung
  const db = env.DB; await ensure(db); if (!mailReady(env)) return 0;
  await db.prepare(`UPDATE entity_invites SET reminded=3 WHERE status='sent' AND reminded=0 AND ${settled("entity_invites")}`).run();   // 3 = uebersprungen; auch spaeter keine verspaetete Erinnerung
  const rows = (await db.prepare(`SELECT i.*,COALESCE(u.name,'') byn,u.role byrole,u.provider byprov,u.sub bysub FROM entity_invites i LEFT JOIN users u ON u.id=i.by_user WHERE i.status='sent' AND i.reminded=0 AND i.created<? AND i.email LIKE '%@%' AND NOT ${settled("i")} LIMIT 20`).bind(now() - 7 * 86400).all()).results || [];
  const emap = rows.length ? await entMap(env) : new Map();
  for (const r of rows) {
    const variant = await resolveVariant(db, r.eid, emap.get(r.eid), undefined, adminRow(env, { role: r.byrole, provider: r.byprov, sub: r.bysub }));
    const x = await send(env, r, r.byn, true, variant); await db.prepare("UPDATE entity_invites SET reminded=? WHERE token=?").bind(x.ok ? 1 : 2, r.token).run();
  }
  return rows.length;
}
// Konto loeschen: die Kontaktzeile der Person (bestaetigte eigene Seite oder bestaetigte Mailadresse des Kontos) wird geloescht, ihre Einladungen
// verlieren Name und Adresse; die Einladungszeile bleibt als Merker "schon eingeladen" (kein zweites Anschreiben nach einem neuen Kontakte-Import).
// Einladungen, die das Konto selbst verschickt hat, bleiben fuer die Eingeladenen gueltig (Entfernen-Link), verweisen aber auf kein Konto mehr.
// Muss vor dem Loeschen von mail_addr laufen.
export async function deleteUserInvites(db, uid) {
  const mail = String((await db.prepare("SELECT email FROM mail_addr WHERE user_id=? AND verified=1").bind(uid).first().catch(() => null))?.email || "").trim().toLowerCase();
  const mine = "eid IN (SELECT eid FROM entity_claims WHERE user_id=?1 AND status='verified')";
  await db.batch([
    db.prepare(`DELETE FROM entity_contacts WHERE ${mine} OR (?2<>'' AND email=?2)`).bind(uid, mail),
    db.prepare(`UPDATE entity_invites SET name='',email='removed-'||rowid,reminded=CASE WHEN reminded=0 THEN 3 ELSE reminded END WHERE ${mine} OR (?2<>'' AND email=?2)`).bind(uid, mail),
    db.prepare("UPDATE entity_invites SET by_user=0 WHERE by_user=?").bind(uid),
  ]);
}

export async function handleEntityInvite(env, request, url, path, user, J) {
  if (!path.startsWith("/api/entityinvite/")) return null;
  const db = env.DB, method = request.method; await ensure(db);
  // Entfernen-Link der Mail und Abmelden im Mailprogramm (List-Unsubscribe, RFC 8058: POST ohne Sitzung und ohne Zusatz-Header, deshalb in index.js
  // von der x-requested-with-Pruefung ausgenommen; das Token im Link ist der Nachweis). GET fragt nur nach: Link-Pruefer von Mailfiltern rufen jeden
  // Link per GET ab und wuerden Empfaenger sonst unbemerkt sperren. POST (Knopf der Rueckfrage oder One-Click) sperrt die Adresse und loescht die
  // Kontaktdaten: Kontaktzeile weg, Name und Adresse aus allen Einladungen an diese Adresse entfernt; nur die Sperrliste behaelt die Adresse.
  // Die Seite selbst nimmt das Team offline (zugesagt in Mail und Bestaetigungsseite): die Admins bekommen dafuer einen Hinweis mit der Entitaets-ID.
  if (path === "/api/entityinvite/decline" && (method === "GET" || method === "POST")) {
    const t = url.searchParams.get("t") || "", i = t ? await db.prepare("SELECT rowid rid,eid,email,status FROM entity_invites WHERE token=?").bind(t).first() : null;
    if (!i) return page("Link invalid / ungültig", "", 404);
    if (i.status !== "declined") {
      if (method === "GET") return page("Remove my page? / Seite entfernen?", `<p>If you confirm, we will not write to you again, delete your contact details and take the page <b>${esc(i.eid)}</b> down after a short check.</p><p>Mit der Bestätigung schreiben wir dir nicht mehr, löschen deine Kontaktdaten und nehmen die Seite nach kurzer Prüfung offline.</p><form method="post"><button type="submit" style="background:#3E8BC0;color:#fff;border:0;padding:10px 18px;border-radius:8px;font:inherit;cursor:pointer">Yes, please remove / Ja, bitte entfernen</button></form>`);
      const addr = i.email.includes("@") ? i.email : "";   // nach einer Kontoloeschung steht dort schon keine Adresse mehr
      await db.batch([
        ...(addr ? [db.prepare("INSERT OR IGNORE INTO invite_block(email,created) VALUES(?,?)").bind(addr, now()), db.prepare("DELETE FROM entity_contacts WHERE email=?").bind(addr)] : []),
        db.prepare("UPDATE entity_invites SET status=CASE WHEN status='claimed' AND token<>?1 THEN status ELSE 'declined' END,name='',email='removed-'||rowid WHERE token=?1 OR (?2<>'' AND email=?2)").bind(t, addr),
      ]);
      const pageUrl = `${env.SITE}/entity/${encodeURIComponent(i.eid)}/`;
      await notifyAdmins(env, `Einladung abgelehnt: Seite ${i.eid} prüfen und entfernen`, `<p>Über den Entfernen-Link einer Einladung („${esc(REMOVE)}“) wurde der Seite <b>${esc(i.eid)}</b> widersprochen. Die Adresse ist gesperrt, Name und Adresse sind gelöscht. Bitte die Seite prüfen und offline nehmen (oder die falsche Zuordnung korrigieren).</p><p><a href="${esc(pageUrl)}">${esc(pageUrl)}</a> · <a href="${env.SITE}/admin/#ent">Verwaltung: Entitäten</a></p>`, `einvdecline:${i.rid}`).catch(() => 0);
    }
    return page("✓ Done / Erledigt", `<p>We will not invite you again. Your contact details are deleted; only your address stays on a do-not-contact list. The team reviews the page <b>${esc(i.eid)}</b> and takes it down.</p><p>Wir laden dich nicht erneut ein. Deine Kontaktdaten sind gelöscht; nur deine Adresse bleibt auf einer Sperrliste. Das Team prüft die Seite und nimmt sie offline.</p>`);
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
        // gesperrte Adressen (Entfernen-Link) kommen nicht wieder in die Kontaktliste
        const r = await db.prepare("INSERT INTO entity_contacts(eid,email,name,created,source) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM invite_block WHERE email=?) ON CONFLICT(eid) DO UPDATE SET email=excluded.email,name=excluded.name,source=excluded.source").bind(eid, email, name, now(), src, email).run();
        n += Number(r.meta?.changes || 0) ? 1 : 0;
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
    // variant: jede Fassung vorab ansehen (default | mvp | speaker | neutral); ohne Angabe die Fassung, die der Admin dieser Entitaet wirklich schicken wuerde
    const ent = (await entMap(env)).get(eid), variant = VARIANTS.includes(b.variant) ? b.variant : await resolveVariant(db, eid, ent, undefined, true);
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
    // Nur ein Versandlauf gleichzeitig: ein zweiter (Doppelklick, zweites Fenster) wird mit 409 abgewiesen statt weitere 50 zu senden. Die Sperre liegt in
    // meta und verfaellt nach 5 Minuten von selbst, falls ein Lauf abbricht.
    const lock = dry ? "" : String(now() + 300);
    if (lock && !Number((await db.prepare("INSERT INTO meta(k,v) VALUES('einvite_batch',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v WHERE CAST(meta.v AS INTEGER)<?").bind(lock, now()).run()).meta?.changes || 0)) return J({ error: "busy" }, 409);
    try {
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
    } finally { if (lock) await db.prepare("DELETE FROM meta WHERE k='einvite_batch' AND v=?").bind(lock).run().catch(() => 0); }
  }
  return J({ error: "not_found" }, 404);
}
