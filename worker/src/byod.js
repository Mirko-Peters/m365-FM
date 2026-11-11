// Blog auf der eigenen Domain (BLOG_OWN_DOMAIN.md): Auslieferung fuer den Site-Worker (sitewrk) und Verwaltung der Domains durch Mitglieder.
// Alles hinter dem Schalter BYOD (Standard "0"). Domain wird erst "active", wenn (1) der CNAME auf unser Ziel nachweislich steht (oder das TXT-Token),
// (2) Cloudflare Hostname und Zertifikat als active meldet (nur mit CF_API_TOKEN und CF_ZONE_ID) und (3) ein Impressum-Link eingetragen ist.
import { byodOn, validateDomain, cleanLink, BYOD_MAX_DOMAINS_PER_USER } from "./byod_rules.js";
import { serveBlog, unknownHost } from "./byod_site.js";
import { checkDns, cfOn, cfCreate, cfGet, cfDelete, cnameTarget, TXT_PREFIX, txtValue } from "./byod_cf.js";
import { randomToken, rateLimit, audit } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
const COLS = "id,user_id,domain,status,token,cf_id,cf_status,cf_ssl,imprint_url,privacy_url,error,created,updated,checked,verified_at,activated_at";

// GET /api/byod/serve?host=<host>&path=<pfad>: fertige Seite des Blogs, wenn host eine AKTIVE Mitglieds-Domain ist. Sonst ein neutrales 404.
// Oeffentlich lesbar (es sind oeffentliche Inhalte), aber nur fuer aktive Domains; ohne Schalter BYOD=1 immer 404. Kein Cookie, keine Sitzung.
export async function handleByodServe(env, request, url) {
  if (!byodOn(env) || (request.method !== "GET" && request.method !== "HEAD")) return unknownHost();
  const r = await serveBlog(env, url.searchParams.get("host") || "", url.searchParams.get("path") || "/");
  return r || unknownHost();
}

// Was die Oberflaeche und die KI-Werkzeuge sehen: ohne Pruef-Token-Interna, mit genau dem DNS-Eintrag zum Kopieren
export function domainView(env, d) {
  const target = cnameTarget(env);
  return { id: d.id, domain: d.domain, status: d.status, error: d.error || "", imprint_url: d.imprint_url, privacy_url: d.privacy_url, cf_status: d.cf_status, cf_ssl: d.cf_ssl, checked: d.checked, created: d.created, activated_at: d.activated_at,
    dns: target ? { type: "CNAME", name: d.domain, value: target } : null, txt: { type: "TXT", name: TXT_PREFIX + d.domain, value: txtValue(d.token) }, url: d.status === "active" ? `https://${d.domain}/` : "" };
}

// Prueft eine Domain und schreibt den neuen Stand. Kein Aufruf an Cloudflare ohne CF_API_TOKEN/CF_ZONE_ID. Rueckgabe: die aktuelle Zeile.
export async function checkDomain(env, d, t = now()) {
  const db = env.DB;
  if (d.status === "blocked") return d;
  const target = cnameTarget(env);
  const set = async (f) => { const n = { ...d, ...f, checked: t, updated: t }; await db.prepare("UPDATE blog_domains SET status=?,cf_id=?,cf_status=?,cf_ssl=?,error=?,checked=?,updated=?,verified_at=?,activated_at=? WHERE id=?")
    .bind(n.status, n.cf_id, n.cf_status, n.cf_ssl, n.error, n.checked, n.updated, n.verified_at, n.activated_at, d.id).run(); return n; };
  if (!target) return await set({ error: "not_configured" });
  const dns = await checkDns(d.domain, target, d.token);
  if (!dns.ok) return await set({ error: "dns_unavailable" });   // Netzfehler: nichts aendern, nie abschalten wegen eines Ausfalls
  if (!dns.cname && !dns.txt) return await set({ status: "pending", error: "dns_missing", activated_at: 0 });   // eindeutig keine Eintraege: auch eine aktive Domain wird abgeschaltet
  let n = { ...d, status: d.status === "active" ? "active" : "verified", verified_at: d.verified_at || t, error: "" };
  if (!cfOn(env)) return await set({ ...n, status: n.status === "active" ? "verified" : n.status, activated_at: 0 });   // ohne Zugang zu Cloudflare nie aktiv, ohne Fehler
  let cf = n.cf_id ? await cfGet(env, n.cf_id) : await cfCreate(env, d.domain);
  if (!cf.ok && n.cf_id && cf.status === 404) cf = await cfCreate(env, d.domain);   // bei Cloudflare geloescht: neu anlegen
  if (!cf.ok) return await set({ ...n, status: n.status === "active" ? "verified" : n.status, activated_at: 0, error: cf.error });
  n = { ...n, cf_id: cf.id, cf_status: cf.status, cf_ssl: cf.ssl };
  if (cf.status !== "active" || cf.ssl !== "active") return await set({ ...n, status: "verified", activated_at: 0 });   // wartet auf Cloudflare (Zertifikat)
  if (!d.imprint_url) return await set({ ...n, status: "verified", activated_at: 0, error: "need_imprint" });   // Pflicht fuer Betreiber: Impressum des Autors
  return await set({ ...n, status: "active", activated_at: d.activated_at || t });
}

// Cron: offene und aktive Domains regelmaessig pruefen (hoechstens 20 je Lauf), damit "Jetzt pruefen" nicht noetig ist und eine entfernte DNS-Zeile die Domain abschaltet
export async function runByodChecks(env, t = now()) {
  if (!byodOn(env) || !cnameTarget(env)) return { skipped: true };
  const rows = (await env.DB.prepare(`SELECT ${COLS} FROM blog_domains WHERE status IN ('pending','verified','active') AND checked<? ORDER BY checked LIMIT 20`).bind(t - 900).all()).results || [];
  let n = 0; for (const d of rows) { await checkDomain(env, d, t).catch(() => 0); n++; }
  return { checked: n };
}

export async function handleByodApi(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (path === "/api/admin/byod" || path === "/api/admin/byod/block") {
    if (!byodOn(env)) return J({ error: "disabled" }, 404);
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    if (path === "/api/admin/byod" && method === "GET") return J({ items: ((await db.prepare("SELECT d.id,d.domain,d.status,d.error,d.created,d.checked,u.name,p.handle FROM blog_domains d JOIN users u ON u.id=d.user_id LEFT JOIN profiles p ON p.user_id=d.user_id ORDER BY d.created DESC LIMIT 300").all()).results || []) });
    if (path === "/api/admin/byod/block" && method === "POST") {
      const b = await request.json().catch(() => ({})), d = await db.prepare(`SELECT ${COLS} FROM blog_domains WHERE id=?`).bind(+b.id).first(); if (!d) return J({ error: "not_found" }, 404);
      if (b.blocked) await db.prepare("UPDATE blog_domains SET status='blocked',error='blocked',updated=?,activated_at=0 WHERE id=?").bind(now(), d.id).run();
      else await db.prepare("UPDATE blog_domains SET status='pending',error='',updated=?,checked=0 WHERE id=?").bind(now(), d.id).run();   // Freigabe: neu pruefen
      await audit(db, user.id, b.blocked ? "byod.block" : "byod.unblock", d.domain, "").catch(() => 0);
      return J({ ok: true, status: b.blocked ? "blocked" : "pending" });
    }
    return null;
  }
  if (!path.startsWith("/api/byod/")) return null;
  if (path === "/api/byod/serve") return null;   // der Site-Worker fragt ohne Sitzung (handleByodServe)
  if (!byodOn(env)) return path === "/api/byod/mine" && method === "GET" ? J({ enabled: false }) : J({ error: "disabled" }, 404);   // Oberflaeche versteckt sich selbst
  if (!user) return J({ error: "login" }, 401);

  if (path === "/api/byod/mine" && method === "GET") {
    const rows = (await db.prepare(`SELECT ${COLS} FROM blog_domains WHERE user_id=? ORDER BY id`).bind(user.id).all()).results || [];
    const pr = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=?").bind(user.id).first();
    return J({ enabled: true, configured: !!cnameTarget(env), cloudflare: cfOn(env), max: BYOD_MAX_DOMAINS_PER_USER, can_add: rows.length < BYOD_MAX_DOMAINS_PER_USER, profile_public: !!(pr?.public && pr.handle), target: cnameTarget(env) || "",
      canonical: env.BYOD_CANONICAL === "own" ? "own" : "platform", domains: rows.map((d) => domainView(env, d)) });
  }

  if (path === "/api/byod/add" && method === "POST") {
    if (!(await rateLimit(db, `byodadd:${user.id}`, 10, 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), v = validateDomain(b.domain, env);
    if (!v.ok) return J({ error: v.error }, 400);
    const pr = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=?").bind(user.id).first();
    if (!(pr?.public && pr.handle)) return J({ error: "need_profile" }, 400);
    const n = (await db.prepare("SELECT COUNT(*) n FROM blog_domains WHERE user_id=?").bind(user.id).first()).n;
    if (n >= BYOD_MAX_DOMAINS_PER_USER) return J({ error: "limit" }, 400);
    if (await db.prepare("SELECT 1 x FROM blog_domains WHERE domain=?").bind(v.host).first()) return J({ error: "domain_taken" }, 409);
    const imp = b.imprint_url ? cleanLink(b.imprint_url) : "", pri = b.privacy_url ? cleanLink(b.privacy_url) : "";
    if ((b.imprint_url && !imp) || (b.privacy_url && !pri)) return J({ error: "bad_link" }, 400);
    const t = now();
    try { await db.prepare("INSERT INTO blog_domains(user_id,domain,status,token,imprint_url,privacy_url,created,updated) VALUES(?,?,'pending',?,?,?,?,?)").bind(user.id, v.host, randomToken(18), imp, pri, t, t).run(); }
    catch { return J({ error: "domain_taken" }, 409); }   // gleichzeitige Eintragung (UNIQUE)
    const d = await db.prepare(`SELECT ${COLS} FROM blog_domains WHERE domain=?`).bind(v.host).first();
    return J({ ok: true, domain: domainView(env, d) });
  }

  const own = async (id) => await db.prepare(`SELECT ${COLS} FROM blog_domains WHERE id=? AND user_id=?`).bind(+id, user.id).first();

  if (path === "/api/byod/check" && method === "POST") {
    if (!(await rateLimit(db, `byodchk:${user.id}`, 30, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), d = await own(b.id); if (!d) return J({ error: "not_found" }, 404);
    return J({ ok: true, domain: domainView(env, await checkDomain(env, d)) });
  }

  if (path === "/api/byod/links" && method === "POST") {
    const b = await request.json().catch(() => ({})), d = await own(b.id); if (!d) return J({ error: "not_found" }, 404);
    const imp = b.imprint_url ? cleanLink(b.imprint_url) : "", pri = b.privacy_url ? cleanLink(b.privacy_url) : "";
    if ((b.imprint_url && !imp) || (b.privacy_url && !pri)) return J({ error: "bad_link" }, 400);
    await db.prepare("UPDATE blog_domains SET imprint_url=?,privacy_url=?,updated=? WHERE id=?").bind(imp, pri, now(), d.id).run();
    const nd = { ...d, imprint_url: imp, privacy_url: pri };
    if (!imp && d.status === "active") { await db.prepare("UPDATE blog_domains SET status='verified',activated_at=0,error='need_imprint' WHERE id=?").bind(d.id).run(); nd.status = "verified"; nd.error = "need_imprint"; }   // ohne Impressum nie ausliefern
    return J({ ok: true, domain: domainView(env, nd) });
  }

  if (path === "/api/byod/remove" && method === "POST") {
    const b = await request.json().catch(() => ({})), d = await own(b.id); if (!d) return J({ error: "not_found" }, 404);
    if (d.status === "blocked") return J({ error: "blocked" }, 403);   // gesperrte Domains bleiben gesperrt (sonst: entfernen und neu eintragen)
    if (d.cf_id && cfOn(env)) { const r = await cfDelete(env, d.cf_id); if (!r.ok) return J({ error: r.error || "cf_error" }, 502); }
    await db.prepare("DELETE FROM blog_domains WHERE id=?").bind(d.id).run();
    return J({ ok: true });
  }
  return null;
}
