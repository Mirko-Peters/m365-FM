// Firma <-> Entitaet immer als Paar (org_entity, 0026): Community-Firma ohne Entitaet -> Entitaet mitanlegen; Firmen-Entitaet ohne Firma -> unbeanspruchte
// Community-Firma (orgs.unclaimed=1, 0034) mitanlegen. Unbeanspruchte Firmen haben keine oeffentliche Seite (Export/Seitenbau/Suche/Beitritt ausgeschlossen).
import EM from "../../assets/entity-match.js";
import { baseIds, entityMap, trustedUser, validate } from "./entities.js";
import { allowedDomains, matchEmailDomain } from "./claimverify.js";

const now = () => Math.floor(Date.now() / 1000);
const MAX_OWNED = 3;   // wie /api/org: hoechstens 3 eigene Firmen

// Alle Firmen-Entitaeten: live (Datei + Datenbank) plus wartende Neuanlagen
export async function orgEntities(env) {
  const out = [...(await entityMap(env)).values()].filter((e) => e.type === "org"), have = new Set(out.map((e) => e.id));
  for (const r of (await env.DB.prepare("SELECT eid,data FROM entity_rev WHERE status='pending'").all()).results || []) {
    if (have.has(r.eid)) continue;
    try { const d = JSON.parse(r.data); if (d.type === "org") { out.push({ id: r.eid, ...d }); have.add(r.eid); } } catch { /* defekte Zeile */ }
  }
  return out;
}
// Eindeutiger Treffer ueber Domain oder normalisierten Namen (Rechtsform ignoriert); sonst ""
export function findOrgEntity(name, website, list) { return EM.suggest(name, website, list)?.entity?.id || ""; }

async function freeEid(env, base) {
  const known = await baseIds(env);
  let id = String(base || "").slice(0, 44).replace(/-+$/g, ""); if (id.length < 2) id = "firma-" + now().toString(36);
  for (let i = 1; i <= 6; i++) {
    const c = i === 1 ? id : `${id}-${i}`;
    if (!known.has(c) && !(await env.DB.prepare("SELECT 1 x FROM entity_rev WHERE eid=? AND status IN ('live','pending')").bind(c).first())) return c;
  }
  return "";
}
async function freeHandle(db, base) {
  let b = String(base || "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 26);
  if (b.length < 3) b = (b + "-firma").replace(/^-/, "").slice(0, 26);
  for (let i = 1; i <= 8; i++) {
    const c = i === 1 ? b : `${b.slice(0, 24)}-${i}`;
    if (!(await db.prepare("SELECT 1 x FROM orgs WHERE handle=?").bind(c).first()) && !(await db.prepare("SELECT 1 x FROM profiles WHERE handle=?").bind(c).first())) return c;
  }
  return `firma-${now().toString(36)}`.slice(0, 30);
}

// Org-Entitaet zur Firma erzeugen: Name, Website als web, Kurzbeschreibung aus dem Claim-Satz; vertrauenswuerdige Mitglieder live, sonst wartend
export async function createOrgEntity(env, user, { name, tagline, website, trusted }) {
  const eid = await freeEid(env, EM.slug(name)); if (!eid) return { error: "no_id" };
  const tl = String(tagline || "").replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
  const desc = tl.length >= 20 ? { en: tl, de: tl } : { en: `${name} is a company in the Microsoft ecosystem.`, de: `${name} ist ein Unternehmen im Microsoft-Umfeld.` };
  let v = await validate(env, eid, { name, type: "org", desc, web: website || "", rel: [] });
  if (v.err === "bad_url") v = await validate(env, eid, { name, type: "org", desc, web: "", rel: [] });
  if (v.err) return { error: v.err };
  const status = (trusted ?? (user && (await trustedUser(env.DB, user)))) ? "live" : "pending";
  await env.DB.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,?,?,?)").bind(eid, JSON.stringify(v.data), "Firma angelegt", user?.id || 0, status, now()).run();
  return { eid, status, data: v.data };
}

export const setOrgEntity = (db, orgId, eid, confirmed) => db.prepare("INSERT INTO org_entity(org_id,eid,confirmed) VALUES(?,?,?) ON CONFLICT(org_id) DO UPDATE SET eid=excluded.eid,confirmed=excluded.confirmed").bind(orgId, eid, confirmed ? 1 : 0).run();
export const unclaimedOrgOf = (db, eid) => db.prepare("SELECT o.id,o.handle FROM org_entity e JOIN orgs o ON o.id=e.org_id WHERE e.eid=? AND o.unclaimed=1 LIMIT 1").bind(eid).first();

// Inhaber werden: unbeanspruchte Firma uebernehmen (Claim verifiziert oder Admin); Verknuepfung wird dabei bestaetigt
export async function adoptOrg(db, orgId, userId) {
  await db.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(?,?,'owner','active',?) ON CONFLICT(org_id,user_id) DO UPDATE SET role='owner',status='active'").bind(orgId, userId, now()).run();
  await db.prepare("UPDATE orgs SET unclaimed=0 WHERE id=?").bind(orgId).run();
  await db.prepare("UPDATE org_entity SET confirmed=1 WHERE org_id=?").bind(orgId).run();
}
// Nach verifizierter Beanspruchung einer Entitaet (Firmen-E-Mail, Admin, Einladung): deren unbeanspruchte Firma gehoert jetzt dem Claimenden
export async function adoptUnclaimedForEntity(db, userId, eid) {
  const o = await unclaimedOrgOf(db, eid); if (!o) return null;
  await adoptOrg(db, o.id, userId); return o.handle;
}

async function createPairedOrg(db, { eid, name, tagline, website, ownerId }) {
  const handle = await freeHandle(db, EM.slug(name) || eid);
  const r = await db.prepare("INSERT INTO orgs(handle,name,tagline,about,website,country,size,public,created,unclaimed) VALUES(?,?,?,'',?,'','',0,?,?)")
    .bind(handle, String(name).slice(0, 80), String(tagline || "").slice(0, 120), website || "", now(), ownerId ? 0 : 1).run();
  const id = r.meta.last_row_id;
  if (ownerId) await db.prepare("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(?,?,'owner','active',?)").bind(id, ownerId, now()).run();
  await setOrgEntity(db, id, eid, !!ownerId);
  return { id, handle };
}

// Darf der Ersteller die neue Firmen-Entitaet gleich besitzen? Nur unter den Claim-Bedingungen von #309: Admin oder verifizierte Firmen-E-Mail-Domain
async function ownerRight(env, user, data) {
  if (!user) return null;
  if (user.admin) return { via: "admin" };
  const db = env.DB;
  const mail = await db.prepare("SELECT email FROM mail_addr WHERE user_id=? AND verified=1").bind(user.id).first();
  const m = mail ? matchEmailDomain(mail.email, allowedDomains({ type: "org", web: data.web, same_as: data.same_as }, null)) : null;
  if (!m?.ok) return null;
  if (!(await db.prepare("SELECT 1 x FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first())) return null;
  return { via: "domain_email", domain: m.domain };
}

// Neue Firmen-Entitaet (POST /api/entity, Admin, "Neu anlegen") -> Community-Firma im selben Request. Vorhandene unverknuepfte Firma mit gleichem Namen/Domain wird verknuepft statt verdoppelt.
// requireOwner (wartende Entitaet): nur paaren, wenn der Ersteller Inhaber werden darf - sonst erst bei der Freigabe, damit ein ungeprueftes
// Mitglied mit einem Vorschlag keine echte Firma blockiert (POST /api/org meldete sonst claim_required ohne erreichbare Firmen-Domain)
export async function pairNewOrgEntity(env, user, eid, data, { requireOwner = false } = {}) {
  if (data?.type !== "org") return null;
  const db = env.DB;
  if (await db.prepare("SELECT 1 x FROM org_entity WHERE eid=?").bind(eid).first()) return null;   // schon gepaart (idempotent)
  if (requireOwner) {
    const r0 = await ownerRight(env, user, data);
    if (!r0 || !(user.admin || (await db.prepare("SELECT COUNT(*) n FROM org_members WHERE user_id=? AND role='owner'").bind(user.id).first()).n < MAX_OWNED)) return null;
  }
  const loose = (await db.prepare("SELECT o.id,o.handle,o.name,o.website FROM orgs o WHERE NOT EXISTS (SELECT 1 FROM org_entity e WHERE e.org_id=o.id)").all()).results || [];
  const same = loose.find((o) => EM.suggest(o.name, o.website, [{ id: eid, ...data }]));
  if (same) { await setOrgEntity(db, same.id, eid, false); return { handle: same.handle, linked: true, owner: false }; }
  const right = await ownerRight(env, user, data);
  const mayOwn = right && (user.admin || (await db.prepare("SELECT COUNT(*) n FROM org_members WHERE user_id=? AND role='owner'").bind(user.id).first()).n < MAX_OWNED);
  const tl = String(data.desc?.en || data.desc?.de || "").slice(0, 120);
  const org = await createPairedOrg(db, { eid, name: data.name, tagline: tl, website: data.web || "", ownerId: mayOwn ? user.id : 0 });
  if (mayOwn && right.via === "domain_email")
    await db.prepare("INSERT INTO entity_claims(eid,user_id,status,via,verified_via,verified_domain,created) VALUES(?,?,'verified','domain_email','domain_email',?,?) ON CONFLICT(eid) DO NOTHING").bind(eid, user.id, right.domain, now()).run();
  return { handle: org.handle, linked: false, owner: !!mayOwn };
}

// ---- Bestand paaren (Admin, einmalig/idempotent, mit Probelauf) ----
async function plan(env) {
  const db = env.DB, ents = await orgEntities(env), byId = new Map(ents.map((e) => [e.id, e]));
  const paired = new Set(((await db.prepare("SELECT eid FROM org_entity").all()).results || []).map((r) => r.eid));
  const loose = (await db.prepare("SELECT o.id,o.handle,o.name,o.tagline,o.website FROM orgs o WHERE NOT EXISTS (SELECT 1 FROM org_entity e WHERE e.org_id=o.id) ORDER BY o.id").all()).results || [];
  const link = [], create = [];
  for (const o of loose) {   // zuerst vorhandene Entitaet wiederverwenden (Name ohne Rechtsform, Domain), sonst wartende Entitaet anlegen
    const eid = findOrgEntity(o.name, o.website, ents);
    if (eid) { link.push({ org: o, eid }); paired.add(eid); } else create.push(o);
  }
  const live = await entityMap(env);   // unbeanspruchte Firmen nur zu freigegebenen Entitaeten, nie zu wartenden Vorschlaegen
  const missing = ents.filter((e) => !paired.has(e.id) && byId.has(e.id) && live.get(e.id)?.type === "org");
  return { link, create, missing };
}
export async function pairExisting(env, { dry = true, limit = 150 } = {}) {
  const db = env.DB, p = await plan(env);
  const counts = { orgs_without_entity: p.link.length + p.create.length, link_existing: p.link.length, entities_to_create: p.create.length, entities_without_org: p.missing.length };
  if (dry) return { dry: true, ...counts };
  let left = limit, linked = 0, ents = 0, orgs = 0;
  for (const x of p.link) { if (left <= 0) break; await setOrgEntity(db, x.org.id, x.eid, false); linked++; left--; }
  for (const o of p.create) {
    if (left <= 0) break;
    const eid = await freeEid(env, EM.slug(o.name)); if (!eid) continue;
    const tl = String(o.tagline || "").trim(), desc = tl.length >= 20 ? { en: tl, de: tl } : { en: `${o.name} is a company in the Microsoft ecosystem.`, de: `${o.name} ist ein Unternehmen im Microsoft-Umfeld.` };
    let v = await validate(env, eid, { name: o.name, type: "org", desc, web: o.website || "", rel: [] });
    if (v.err === "bad_url") v = await validate(env, eid, { name: o.name, type: "org", desc, web: "", rel: [] });
    if (v.err) continue;
    await db.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,0,'pending',?)").bind(eid, JSON.stringify(v.data), "Firmen und Entitäten paaren", now()).run();
    await setOrgEntity(db, o.id, eid, false); ents++; left--;
  }
  for (const e of p.missing) {
    if (left <= 0) break;
    await createPairedOrg(db, { eid: e.id, name: e.name, tagline: String(e.desc?.en || e.desc?.de || "").slice(0, 120), website: e.web || "", ownerId: 0 }); orgs++; left--;
  }
  const after = await plan(env);
  return { dry: false, linked, entities_created: ents, orgs_created: orgs, remaining: after.link.length + after.create.length + after.missing.length };
}

export async function handleOrgPair(env, request, url, path, user, J) {
  if (path !== "/api/admin/org-pair") return null;
  if (!(user?.admin || user?.editor)) return J({ error: "forbidden" }, 403);
  if (request.method === "GET") return J(await pairExisting(env, { dry: true }));
  if (request.method !== "POST") return J({ error: "method" }, 405);
  const b = await request.json().catch(() => ({}));
  return J(await pairExisting(env, { dry: b.dry !== false }));
}
