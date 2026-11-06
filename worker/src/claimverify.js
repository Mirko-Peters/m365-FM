// Entitaet beanspruchen per Firmen-E-Mail: erlaubte Domains aus der Entitaet, Einmal-Link (24 h), "Weitergeben" an Kolleg:innen.
import { mailReady, sendMail } from "./mailer.js";
import { cleanText, esc, randomToken, rateLimit, sha256hex } from "./util.js";
import { entityMap } from "./entities.js";
import { adoptUnclaimedForEntity } from "./orgpair.js";

const now = () => Math.floor(Date.now() / 1000);
const EID = /^[a-z0-9][a-z0-9-]{1,78}$/;
const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
export const TOKEN_TTL = 86400;
export const OPEN_STATES = ["pending", "email_sent", "forwarded"];

export const FREE_MAIL = new Set(["gmail.com", "googlemail.com", "outlook.com", "outlook.de", "hotmail.com", "hotmail.de", "hotmail.co.uk", "live.com", "live.de", "msn.com", "yahoo.com", "yahoo.de", "yahoo.co.uk", "ymail.com", "gmx.de", "gmx.net", "gmx.at", "gmx.ch", "gmx.com", "web.de", "t-online.de", "freenet.de", "icloud.com", "me.com", "mac.com", "proton.me", "protonmail.com", "pm.me", "aol.com", "mail.com", "mail.de", "posteo.de", "mailbox.org", "zoho.com", "yandex.com", "yandex.ru", "mail.ru", "bluewin.ch", "arcor.de", "1und1.de", "outlook.fr", "orange.fr", "free.fr", "libero.it", "qq.com", "163.com"]);
// Gemeinsame Hosts: keine Firmen-Domain (Profil-/Code-/Social-Seiten)
const SHARED_HOSTS = new Set(["github.com", "gitlab.com", "linkedin.com", "x.com", "twitter.com", "facebook.com", "instagram.com", "youtube.com", "youtu.be", "wikipedia.org", "wikidata.org", "medium.com", "xing.com", "github.io", "sourceforge.net", "npmjs.com", "pypi.org", "apple.com.invalid"]);
const MULTI = new Set(["co.uk", "org.uk", "ac.uk", "com.au", "net.au", "co.nz", "co.jp", "co.kr", "com.br", "com.mx", "com.tr", "co.za", "co.in", "com.cn", "com.sg", "com.hk", "com.ar", "co.il"]);

export function registrable(host) {
  const parts = String(host || "").toLowerCase().replace(/\.$/, "").split(".").filter(Boolean);
  if (parts.length < 2) return "";
  const tail2 = parts.slice(-2).join(".");
  return parts.length >= 3 && MULTI.has(tail2) ? parts.slice(-3).join(".") : tail2;
}
function hostOf(url) {
  try { const u = new URL(String(url || "")); return u.protocol === "https:" || u.protocol === "http:" ? u.hostname.toLowerCase() : ""; } catch { return ""; }
}
const usable = (d) => !!d && !FREE_MAIL.has(d) && !SHARED_HOSTS.has(d);
function siteDomains(e) {
  const out = new Set(), urls = [e?.web, ...(Array.isArray(e?.same_as) ? e.same_as : [])];
  for (const u of urls) { const d = registrable(hostOf(u)); if (usable(d)) out.add(d); }
  return out;
}
// Erlaubte Domains: Firmen-Entitaet = eigene Website (+ offizielle same_as); Produkte/Plattformen = Website der Entwickler-Firma (rel developed_by)
export function allowedDomains(entity, map) {
  if (!entity) return [];
  if (entity.type === "org") return [...siteDomains(entity)];
  if (entity.type === "product" || entity.type === "platform") {
    const out = new Set();
    for (const r of Array.isArray(entity.rel) ? entity.rel : []) {
      if (!Array.isArray(r) || r[0] !== "developed_by") continue;
      const org = map?.get?.(r[1]);
      if (org && org.type === "org") for (const d of siteDomains(org)) out.add(d);
    }
    return [...out];
  }
  return [];
}
export function cleanEmailAddr(s) { return typeof s === "string" && EMAIL.test(s.trim()) ? s.trim().toLowerCase() : ""; }
// "ok" | "bad_email" | "free_mail" | "domain_mismatch"
export function matchEmailDomain(email, domains) {
  const e = cleanEmailAddr(email); if (!e) return { error: "bad_email" };
  const host = e.slice(e.lastIndexOf("@") + 1), reg = registrable(host);
  if (FREE_MAIL.has(host) || FREE_MAIL.has(reg)) return { error: "free_mail" };
  const hit = (domains || []).find((d) => usable(d) && (host === d || host.endsWith("." + d)));
  return hit ? { ok: true, domain: hit, email: e } : { error: "domain_mismatch" };
}
export function maskEmail(email) {
  const at = email.lastIndexOf("@");
  return `${email[0] || ""}***${email.slice(at)}`;
}
const tokHash = (t) => sha256hex(String(t || ""));
const mailHash = (env, e) => sha256hex(`${env.SESSION_SECRET || ""}:claimmail:${e}`);

function mailTexts(kind, lang, p) {
  const de = lang === "de", ent = p.entity, who = p.who, link = p.link;
  if (kind === "verify") return de
    ? { subject: `Bestätige deine Firmen-E-Mail für „${ent}“ auf M365.FM`, text: `Hallo,\n\n${who} hat auf M365.FM beantragt, die Seite „${ent}“ zu übernehmen und diese Adresse (${p.domain}) als Firmen-Mailadresse angegeben.\n\nBestätigen (24 Stunden gültig, einmal nutzbar; du musst als dieselbe Person angemeldet sein):\n${link}\n\nWenn du das nicht warst, ignoriere diese Mail einfach.` }
    : { subject: `Confirm your company email for "${ent}" on M365.FM`, text: `Hello,\n\n${who} asked on M365.FM to take over the page "${ent}" and entered this address (${p.domain}) as a company email.\n\nConfirm (valid for 24 hours, single use; you must be signed in as the same person):\n${link}\n\nIf this wasn't you, just ignore this email.` };
  return de
    ? { subject: `${who} bittet dich, „${ent}“ auf M365.FM zu übernehmen`, text: `Hallo,\n\n${who} möchte die Seite „${ent}“ auf M365.FM übernehmen, hat aber keine Adresse bei ${p.domain} und hat deshalb dich als Kollegin/Kollegen angegeben.\n\nWenn du die Seite für die Firma betreuen möchtest, melde dich an (oder registriere dich) und bestätige hier (24 Stunden gültig, einmal nutzbar). Du wirst dann Inhaber:in, nicht ${who}:\n${link}\n\nWenn du das nicht möchtest, ignoriere diese Mail einfach.` }
    : { subject: `${who} asks you to take over "${ent}" on M365.FM`, text: `Hello,\n\n${who} wants to take over the page "${ent}" on M365.FM but has no ${p.domain} address and named you as a colleague.\n\nIf you want to look after the page for the company, sign in (or register) and confirm here (valid for 24 hours, single use). You become the owner, not ${who}:\n${link}\n\nIf you don't want this, just ignore this email.` };
}
const toHtml = (t) => `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;color:#1b2430;line-height:1.55">${esc(t).replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>').replace(/\n/g, "<br>")}</div>`;

async function issue(env, { kind, eid, user, email, domain, lang }) {
  const db = env.DB, token = randomToken(32), t = now();
  await db.prepare("UPDATE entity_claim_mail SET used=1 WHERE eid=? AND claim_user=? AND kind=? AND used=0").bind(eid, user.id, kind).run();
  await db.prepare("INSERT INTO entity_claim_mail(token_hash,eid,kind,claim_user,email_hash,email_mask,domain,expires,used,created) VALUES(?,?,?,?,?,?,?,?,0,?)")
    .bind(await tokHash(token), eid, kind, user.id, await mailHash(env, email), maskEmail(email), domain, t + TOKEN_TTL, t).run();
  const map = await entityMap(env), ent = map.get(eid)?.name || eid;
  const who = cleanText((await db.prepare("SELECT COALESCE(p.real_name,u.name) n FROM users u LEFT JOIN user_prefs p ON p.user_id=u.id WHERE u.id=?").bind(user.id).first())?.n || user.name || "Someone", 60).replace(/[<>]/g, "");
  const link = `${env.SITE}${lang === "de" ? "/de" : ""}/community/?claimverify=${encodeURIComponent(token)}#c-expert`;
  const m = mailTexts(kind, lang, { entity: ent, who, domain, link });
  const sent = await sendMail(env, { to: email, subject: m.subject, text: m.text, html: toHtml(m.text), lang, headers: {} });
  if (!sent.ok) await db.prepare("DELETE FROM entity_claim_mail WHERE token_hash=?").bind(await tokHash(token)).run();
  return { ok: sent.ok, token };
}

// Nach Bestaetigung: Firmenkonto <-> Entitaet (0026) fuer Inhaber/Admin der Firma sofort bestaetigen
async function confirmOrgLinks(db, uid, eid) {
  await db.prepare("UPDATE org_entity SET confirmed=1 WHERE eid=? AND org_id IN (SELECT org_id FROM org_members WHERE user_id=? AND status='active' AND role IN ('owner','admin'))").bind(eid, uid).run();
  await adoptUnclaimedForEntity(db, uid, eid);   // unbeanspruchte Paar-Firma der Entitaet (0034) -> Inhaber
}

export async function handleClaimVerify(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (!user) return J({ error: "login" }, 401);
  const body = async () => request.json().catch(() => ({}));
  if (path === "/api/entity/claim/domains" && method === "GET") {
    const eid = (url.searchParams.get("eid") || "").toLowerCase(); if (!EID.test(eid)) return J({ error: "bad_id" }, 400);
    const map = await entityMap(env), domains = allowedDomains(map.get(eid), map);
    const c = await db.prepare("SELECT status,fwd_mask FROM entity_claims WHERE eid=? AND user_id=?").bind(eid, user.id).first();
    return J({ domains, mail: mailReady(env), status: c?.status || "", fwd_mask: c?.fwd_mask || "" });
  }
  if ((path === "/api/entity/claim/domain" || path === "/api/entity/claim/forward") && method === "POST") {
    const kind = path.endsWith("/forward") ? "forward" : "verify", b = await body(), eid = String(b.eid || "").toLowerCase();
    const lang = b.lang === "de" ? "de" : "en";
    if (!EID.test(eid)) return J({ error: "bad_id" }, 400);
    const claim = await db.prepare("SELECT status FROM entity_claims WHERE eid=? AND user_id=?").bind(eid, user.id).first();
    if (!claim || !OPEN_STATES.includes(claim.status)) return J({ error: "no_claim" }, 404);
    const map = await entityMap(env), domains = allowedDomains(map.get(eid), map);
    if (!domains.length) return J({ error: "no_domain" }, 409);
    const m = matchEmailDomain(b.email, domains); if (!m.ok) return J({ error: m.error }, 400);
    if (!mailReady(env)) return J({ error: "mail_off" }, 503);
    if (!(await rateLimit(db, `claimmail:u:${user.id}`, 5, 86400)) || !(await rateLimit(db, `claimmail:e:${await mailHash(env, m.email)}`, 3, 86400))) return J({ error: "rate_limit" }, 429);
    const r = await issue(env, { kind, eid, user, email: m.email, domain: m.domain, lang });
    if (!r.ok) return J({ error: "mail_failed" }, 502);
    if (kind === "verify") await db.prepare("UPDATE entity_claims SET status='email_sent',fwd_mask='' WHERE eid=? AND user_id=? AND status IN ('pending','email_sent','forwarded')").bind(eid, user.id).run();
    else await db.prepare("UPDATE entity_claims SET status='forwarded',fwd_mask=? WHERE eid=? AND user_id=? AND status IN ('pending','email_sent','forwarded')").bind(maskEmail(m.email), eid, user.id).run();
    return J({ ok: true, status: kind === "verify" ? "email_sent" : "forwarded", mask: maskEmail(m.email), domain: m.domain });
  }
  if (path === "/api/entity/claim/confirm" && method === "POST") {
    const b = await body(), th = await tokHash(b.t), row = b.t ? await db.prepare("SELECT * FROM entity_claim_mail WHERE token_hash=?").bind(th).first() : null;
    if (!row) return J({ error: "invalid" }, 404);
    if (row.used) return J({ error: "used" }, 410);
    if (row.expires <= now()) return J({ error: "expired" }, 410);
    if (row.kind === "verify" && row.claim_user !== user.id) return J({ error: "wrong_user" }, 403);
    const claim = await db.prepare("SELECT user_id,status FROM entity_claims WHERE eid=?").bind(row.eid).first();
    const okState = claim && claim.user_id === row.claim_user && (row.kind === "verify" ? ["pending", "email_sent", "forwarded"] : ["forwarded"]).includes(claim.status);
    if (!okState) return J({ error: "invalid" }, 404);
    const pr = await db.prepare("SELECT 1 x FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first();
    if (!pr) return J({ error: "need_profile" }, 409);
    const used = await db.prepare("UPDATE entity_claim_mail SET used=1 WHERE token_hash=? AND used=0 AND expires>?").bind(th, now()).run();
    if (Number(used.meta?.changes || 0) !== 1) return J({ error: "used" }, 410);
    const up = await db.prepare("UPDATE entity_claims SET user_id=?,status='verified',via='domain_email',verified_via='domain_email',verified_domain=?,fwd_mask='' WHERE eid=? AND user_id=? AND status IN ('pending','email_sent','forwarded')").bind(user.id, row.domain, row.eid, row.claim_user).run();
    if (Number(up.meta?.changes || 0) !== 1) return J({ error: "invalid" }, 404);
    await db.prepare("UPDATE entity_claim_mail SET used=1 WHERE eid=?").bind(row.eid).run();
    await confirmOrgLinks(db, user.id, row.eid);
    return J({ ok: true, eid: row.eid, domain: row.domain, forwarded: row.kind === "forward" });
  }
  return J({ error: "not_found" }, 404);
}

export async function purgeClaimMail(db) {
  const r = await db.prepare("DELETE FROM entity_claim_mail WHERE expires<?").bind(now() - 7 * 86400).run();
  return { removed: Number(r.meta?.changes || 0) };
}
