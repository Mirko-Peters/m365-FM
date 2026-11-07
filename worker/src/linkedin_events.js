// LinkedIn-Events fuer die Seite "M365 Show": Vorschlagsliste + Veroeffentlichen per Klick im Admin (nie automatisch, kein Cron).
// Nur ein Event, zu dessen Zeit auch ein HeySummit-Event/-Talk (m365con.net) stattfindet, wird vorgeschlagen.
// Alles, was nach einem Live-Test ggf. korrigiert werden muss (Endpunkte, Version, Scopes, Feldnamen), steht in LI und HS.
import { TRANSFER } from "./events.js";
import { b64u, cleanText, cookie, randomToken, sha256hex, sign, verify } from "./util.js";

export const LI = {
  version: "202511",                                         // Header LinkedIn-Version (YYYYMM); nach dem Live-Test anpassen
  restli: "2.0.0",
  api: "https://api.linkedin.com",
  auth: "https://www.linkedin.com/oauth/v2/authorization",
  token: "https://www.linkedin.com/oauth/v2/accessToken",
  scope: "rw_events r_organization_admin",                   // muss mit den Produkten der App unter "Auth" uebereinstimmen
  events: "/rest/events",                                    // POST = anlegen; POST /rest/events/{urn} + X-RestLi-Method: PARTIAL_UPDATE = aendern
  acls: "/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED",
  org: "/rest/organizations/",
  eventFormat: "ONLINE", visibility: "PUBLIC", cancelState: "CANCELLED",
  nameMax: 100, descMax: 2000, locale: { language: "de", country: "DE" },
  redirectPath: "/auth/linkedin-events/callback", stateCookie: "m365le",
};
export const HS = {   // HeySummit-API v2 (Authorization: Token <HEYSUMMIT_API_KEY>), Feldnamen nach Live-Test pruefen
  api: "https://api.heysummit.com/api",
  events: "/events/", talks: "/talks/",
  evStart: "start_date", evEnd: "end_date", talkStart: "start_date", talkEnd: "end_date", url: "url",
};
export const WINDOW_MS = 2 * 3600 * 1000, UTM = "utm_source=linkedin&utm_medium=event&utm_campaign=linkedin-events";
const now = () => Math.floor(Date.now() / 1000);
const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };

// ---------- Token-Verschluesselung (AES-GCM, Schluessel aus LINKEDIN_TOKEN_KEY, sonst SESSION_SECRET) ----------
async function aesKey(env, usage) {
  const secret = env.LINKEDIN_TOKEN_KEY || env.SESSION_SECRET;
  if (!secret) throw new Error("no_key");
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("linkedin-events-token:" + secret));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, [usage]);
}
export async function encryptToken(env, plain) {
  if (!plain) return "";
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await aesKey(env, "encrypt"), new TextEncoder().encode(plain)));
  return b64u.enc(iv) + "." + b64u.enc(ct);
}
export async function decryptToken(env, blob) {
  if (!blob) return "";
  const [iv, ct] = blob.split(".");
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64u.dec(iv) }, await aesKey(env, "decrypt"), b64u.dec(ct)));
}

// ---------- Zeit ----------
// "YYYY-MM-DDTHH:MM" in der Zeitzone tz -> UTC-Millisekunden (ohne Zeitangabe: null, LinkedIn braucht eine Uhrzeit)
export function localToMs(s, tz = "Europe/Berlin") {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(s || "")); if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  const off = (t) => { const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(t)).map((x) => [x.type, x.value])); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t; };
  let t = asUtc - off(asUtc); t = asUtc - off(t); return t;
}
export const fmtBerlin = (ms) => new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short" }).format(new Date(ms));
const isoMs = (v) => { const t = Date.parse(String(v || "")); return Number.isFinite(t) ? t : null; };

// ---------- HeySummit (nur lesen) ----------
export async function fetchHeySummit(env, f = fetch) {
  if (!env.HEYSUMMIT_API_KEY) return { error: "no_heysummit_key", events: [] };
  const H = { authorization: `Token ${env.HEYSUMMIT_API_KEY}`, accept: "application/json" };
  const get = async (p) => { const r = await f(HS.api + p, { headers: H }); if (!r.ok) throw new Error("hs_" + r.status); return r.json(); };
  try {
    const evs = ((await get(HS.events)).results || []).slice(0, 20), out = [];
    for (const e of evs) {
      const talks = ((await get(`${HS.talks}?event=${encodeURIComponent(e.id)}`)).results || []).slice(0, 500);
      out.push({ id: String(e.id), name: String(e.title || e.name || ""), url: String(e[HS.url] || ""), start: isoMs(e[HS.evStart]), end: isoMs(e[HS.evEnd]),
        talks: talks.map((t) => ({ id: String(t.id), title: String(t.title || t.name || ""), url: String(t[HS.url] || ""), start: isoMs(t[HS.talkStart]), end: isoMs(t[HS.talkEnd]) })) });
    }
    return { events: out };
  } catch (e) { return { error: String(e.message || "hs_error"), events: [] }; }
}

// ---------- Regel: wann ist ein m365.fm-Event vorschlagbar? ----------
// Zeitfenster des m365.fm-Events = [start, end] (ohne Ende: +1 h). Treffer, wenn
//  (a) direkte Verknuepfung: Event-Handle in TRANSFER (heysummit:<id>) oder url/tickets_url liegt auf dem Host eines HeySummit-Events/-Talks, oder
//  (b) der Start eines HeySummit-Events oder -Talks liegt innerhalb von +-2 h um unseren Start, oder
//  (c) der Zeitraum eines HeySummit-Talks (start..end) enthaelt unseren Start.
// Nie: vergangene Events, Events ohne Uhrzeit, bereits veroeffentlichte (auch abgesagte), nicht oeffentliche.
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
export function matchHeySummit(ev, hs, transfer = TRANSFER, nowMs = Date.now()) {
  const start = localToMs(ev.start, ev.tz || "Europe/Berlin"); if (start == null) return { ok: false, reason: "no_time" };
  if (start <= nowMs) return { ok: false, reason: "past" };
  const near = (t) => t != null && Math.abs(t - start) <= WINDOW_MS;
  const direct = String(transfer[ev.handle] || "").replace(/^heysummit:/, "");
  const hosts = [host(ev.url), host(ev.tickets_url)].filter(Boolean);
  for (const e of hs) {
    if (direct && e.id === direct) return { ok: true, how: "linked", event: e };
    if (hosts.length && hosts.includes(host(e.url))) return { ok: true, how: "linked", event: e };
    if (near(e.start)) return { ok: true, how: "event_start", event: e };
    for (const t of e.talks) {
      if (near(t.start)) return { ok: true, how: "talk_start", event: e, talk: t };
      if (t.start != null && t.end != null && t.start <= start && start <= t.end) return { ok: true, how: "talk_range", event: e, talk: t };
    }
  }
  return { ok: false, reason: "no_match" };
}

// ---------- Nutzlast ----------
const SITE_EV = (env, ev) => `${env.SITE}/community/events/${ev.handle}/`;
const withUtm = (u) => u + (u.includes("?") ? "&" : "?") + UTM;
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return [...s].length <= n ? s : [...s].slice(0, n - 1).join("").trimEnd() + "…"; };
export function buildPayload(env, ev, hsMatch, orgUrn) {
  const startMs = localToMs(ev.start, ev.tz || "Europe/Berlin"); if (startMs == null) return null;
  let endMs = ev.end && /T/.test(ev.end) ? localToMs(ev.end, ev.tz || "Europe/Berlin") : null; if (endMs == null || endMs <= startMs) endMs = startMs + 3600000;
  const reg = (hsMatch && (hsMatch.talk?.url || hsMatch.event?.url)) || ev.tickets_url || ev.url || "";
  const own = withUtm(SITE_EV(env, ev));
  const tail = `\n\nMehr zum Event: ${own}` + (reg ? `\nKostenlos anmelden: ${withUtm(reg)}` : "");
  const base = clip(ev.summary || ev.about || "", LI.descMax - tail.length - 1);
  const loc = (v) => ({ locale: LI.locale, value: v });
  return {
    organizer: orgUrn, name: loc(clip(ev.title, LI.nameMax)), description: loc(base + tail),
    timeRange: { start: startMs, end: endMs }, eventFormat: LI.eventFormat, externalUrl: withUtm(reg || SITE_EV(env, ev)), visibility: LI.visibility,
  };
}

// ---------- Speicher ----------
export async function getConn(db) { return (await db.prepare("SELECT * FROM linkedin_conn WHERE id=1").first().catch(() => null)) || null; }
async function saveTokens(env, tok, uid, scope) {
  const t = now(), ex = await getConn(env.DB);
  const acc = await encryptToken(env, tok.access_token), ref = tok.refresh_token ? await encryptToken(env, tok.refresh_token) : (ex?.refresh_enc || "");
  await env.DB.prepare("INSERT INTO linkedin_conn(id,access_enc,refresh_enc,expires,scope,connected_by,updated) VALUES(1,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET access_enc=excluded.access_enc,refresh_enc=excluded.refresh_enc,expires=excluded.expires,scope=excluded.scope,connected_by=excluded.connected_by,updated=excluded.updated")
    .bind(acc, ref, t + (+tok.expires_in || 3600), scope || tok.scope || LI.scope, uid, t).run();
}
const creds = (env) => ({ id: env.LINKEDIN_EVENTS_CLIENT_ID || env.LINKEDIN_CLIENT_ID, secret: env.LINKEDIN_EVENTS_CLIENT_SECRET || env.LINKEDIN_CLIENT_SECRET });
async function accessToken(env, f) {
  const c = await getConn(env.DB); if (!c?.access_enc) throw new Error("not_connected");
  if (c.expires > now() + 60) return decryptToken(env, c.access_enc);
  if (!c.refresh_enc) throw new Error("expired");   // LinkedIn gibt Refresh-Tokens nur an freigegebene Partner: dann neu verbinden
  const k = creds(env), r = await f(LI.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: await decryptToken(env, c.refresh_enc), client_id: k.id, client_secret: k.secret }) });
  if (!r.ok) throw new Error("expired");
  await saveTokens(env, await r.json(), c.connected_by, c.scope); return decryptToken(env, (await getConn(env.DB)).access_enc);
}
const liHeaders = (tok, extra = {}) => ({ authorization: `Bearer ${tok}`, "LinkedIn-Version": LI.version, "X-Restli-Protocol-Version": LI.restli, "content-type": "application/json", ...extra });

// ---------- OAuth (3-legged, nur Admin) ----------
export async function oauthStartLE(env, user) {
  const k = creds(env); if (!k.id || !k.secret) return { error: "not_configured" };
  const state = randomToken(16), val = `${state}|${user.id}`;
  const q = new URLSearchParams({ response_type: "code", client_id: k.id, redirect_uri: env.API + LI.redirectPath, state, scope: LI.scope });
  return { location: `${LI.auth}?${q}`, setCookie: cookie(LI.stateCookie, `${val}.${await sign(env.SESSION_SECRET, val)}`, 600) };
}
export async function checkState(env, cookieHeader, state, uid) {   // Cookie signiert, state gleich, an genau diesen Admin gebunden
  const c = new RegExp(`(?:^|;\\s*)${LI.stateCookie}=([^;]+)`).exec(cookieHeader || ""); if (!c || !state) return false;
  const dot = c[1].lastIndexOf("."), val = c[1].slice(0, dot), [st, u] = val.split("|");
  return (await verify(env.SESSION_SECRET, val, c[1].slice(dot + 1))) && st === state && +u === uid;
}
export async function oauthCallbackLE(env, request, url, user, f = fetch) {
  if (!(await checkState(env, request.headers.get("cookie"), url.searchParams.get("state"), user.id))) return { error: "bad_state" };
  const code = url.searchParams.get("code"); if (!code) return { error: "no_code" };
  const k = creds(env), r = await f(LI.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: k.id, client_secret: k.secret, redirect_uri: env.API + LI.redirectPath }) });
  if (!r.ok) return { error: "token" };
  const tok = await r.json().catch(() => ({})); if (!tok.access_token) return { error: "token" };
  await saveTokens(env, tok, user.id, tok.scope);
  return { ok: true };
}

// ---------- LinkedIn-Aufrufe ----------
const urnId = (urn) => String(urn || "").split(":").pop();
export const eventUrl = (urn) => `https://www.linkedin.com/events/${urnId(urn)}/`;
export async function listOrgs(env, f = fetch) {
  const tok = await accessToken(env, f), r = await f(LI.api + LI.acls, { headers: liHeaders(tok) });
  if (!r.ok) throw new Error("li_" + r.status);
  const urns = [...new Set(((await r.json()).elements || []).map((e) => e.organization).filter(Boolean))].slice(0, 20), out = [];
  for (const urn of urns) {
    const o = await f(LI.api + LI.org + urnId(urn), { headers: liHeaders(tok) }).then((x) => (x.ok ? x.json() : {})).catch(() => ({}));
    out.push({ urn, name: o.localizedName || o.name?.localized?.de_DE || urn });
  }
  return out;
}
export async function liPublish(env, payload, f = fetch) {
  const r = await f(LI.api + LI.events, { method: "POST", headers: liHeaders(await accessToken(env, f)), body: JSON.stringify(payload) });
  if (!r.ok) throw new Error("li_" + r.status);
  const urn = r.headers.get("x-restli-id") || r.headers.get("x-linkedin-id") || ""; if (!urn) throw new Error("li_no_urn");
  return { urn: urn.startsWith("urn:") ? urn : "urn:li:event:" + urn };
}
async function liPatch(env, urn, set, f) {
  const r = await f(`${LI.api}${LI.events}/${encodeURIComponent(urn)}`, { method: "POST", headers: liHeaders(await accessToken(env, f), { "X-RestLi-Method": "PARTIAL_UPDATE" }), body: JSON.stringify({ patch: { $set: set } }) });
  if (!r.ok) throw new Error("li_" + r.status);
}
export const liUpdate = (env, urn, payload, f = fetch) => { const { organizer, ...set } = payload; return liPatch(env, urn, set, f); };
export const liCancel = (env, urn, f = fetch) => liPatch(env, urn, { lifecycleState: LI.cancelState }, f);

// ---------- Vorschlagsliste ----------
export async function proposals(env, f = fetch, nowMs = Date.now()) {
  const db = env.DB, conn = await getConn(db), hs = await fetchHeySummit(env, f);
  const evs = (await db.prepare("SELECT * FROM events WHERE public=1 ORDER BY start LIMIT 300").all()).results || [];
  const pub = new Map(((await db.prepare("SELECT * FROM linkedin_events").all().catch(() => ({ results: [] }))).results || []).map((x) => [x.event_id, x]));
  const items = [];
  for (const ev of evs) {
    const li = pub.get(ev.id), m = matchHeySummit(ev, hs.events, TRANSFER, nowMs);
    if (!li && !m.ok) continue;   // veroeffentlichte Events bleiben sichtbar (Aktualisieren/Absagen), neue nur bei Treffer
    const payload = buildPayload(env, ev, m.ok ? m : null, conn?.org_urn || "urn:li:organization:?");
    const row = { handle: ev.handle, title: ev.title, when: payload ? fmtBerlin(payload.timeRange.start) : ev.start, hs: m.ok ? { how: m.how, event: m.event.name, talk: m.talk?.title || "" } : null,
      preview: payload ? { name: payload.name.value, description: payload.description.value, externalUrl: payload.externalUrl } : null, state: "proposal" };
    if (li) { row.state = li.status; row.linkedin_url = li.url; row.changed = !!payload && (await hashOf(payload)) !== li.hash; }
    items.push(row);
  }
  return { items, hs_error: hs.error || "", connected: !!conn?.access_enc, org: conn?.org_name || "" };
}
const hashOf = async (p) => (await sha256hex(JSON.stringify({ ...p, organizer: "" }))).slice(0, 32);

// Aktion fuer ein Event; jede Aktion nur auf expliziten Klick (confirm === true), ohne confirm nur Vorschau
export async function act(env, user, action, handle, confirm, f = fetch, nowMs = Date.now()) {
  if (!user?.admin) return { error: "forbidden" };
  const db = env.DB, ev = await db.prepare("SELECT * FROM events WHERE handle=?").bind(String(handle || "")).first(); if (!ev) return { error: "not_found" };
  const conn = await getConn(db), li = await db.prepare("SELECT * FROM linkedin_events WHERE event_id=?").bind(ev.id).first().catch(() => null);
  if (!conn?.access_enc) return { error: "not_connected" };
  if (!conn.org_urn) return { error: "no_org" };
  const hs = await fetchHeySummit(env, f), m = matchHeySummit(ev, hs.events, TRANSFER, nowMs);
  const payload = buildPayload(env, ev, m.ok ? m : null, conn.org_urn);
  if (action === "publish") {
    if (li) return { error: "already_published", linkedin_url: li.url };
    if (!m.ok) return { error: m.reason === "no_match" && hs.error ? hs.error : m.reason };
    if (confirm !== true) return { preview: payload };
    let r; try { r = await liPublish(env, payload, f); } catch (e) { return { error: String(e.message) }; }
    const t = now(), url = eventUrl(r.urn);
    await db.prepare("INSERT INTO linkedin_events(event_id,urn,url,status,hash,published_by,published,updated) VALUES(?,?,?,?,?,?,?,?)").bind(ev.id, r.urn, url, "published", await hashOf(payload), user.id, t, t).run();
    return { ok: true, urn: r.urn, linkedin_url: url };
  }
  if (!li) return { error: "not_published" };
  if (!payload) return { error: "no_time" };
  if (confirm !== true) return { preview: payload };
  try { if (action === "update") await liUpdate(env, li.urn, payload, f); else await liCancel(env, li.urn, f); } catch (e) { return { error: String(e.message) }; }
  await db.prepare("UPDATE linkedin_events SET status=?,hash=?,updated=? WHERE event_id=?").bind(action === "cancel" ? "cancelled" : "published", action === "update" ? await hashOf(payload) : li.hash, now(), ev.id).run();
  return { ok: true, linkedin_url: li.url };
}

// ---------- REST (/api/admin/linkedin/...) ----------
export async function handleLinkedinEvents(env, request, url, path, user, J, f = fetch) {
  if (!path.startsWith("/api/admin/linkedin/")) return null;
  if (!user?.admin) return J({ error: "forbidden" }, 403);
  const db = env.DB, k = path.slice("/api/admin/linkedin/".length), post = request.method === "POST";
  if (k === "status" && !post) { const c = await getConn(db), cr = creds(env); return J({ configured: !!(cr.id && cr.secret), connected: !!c?.access_enc, org_urn: c?.org_urn || "", org_name: c?.org_name || "", redirect_uri: env.API + LI.redirectPath, scope: LI.scope, heysummit_key: !!env.HEYSUMMIT_API_KEY }); }
  if (k === "orgs" && !post) { try { return J({ orgs: await listOrgs(env, f) }); } catch (e) { return J({ error: String(e.message) }, 502); } }
  if (k === "org" && post) {
    const b = await request.json().catch(() => ({})), urn = String(b.urn || ""); if (!/^urn:li:organization:\d{1,20}$/.test(urn)) return J({ error: "bad_urn" }, 400);
    await db.prepare("UPDATE linkedin_conn SET org_urn=?,org_name=?,updated=? WHERE id=1").bind(urn, cleanText(b.name, 120), now()).run(); return J({ ok: true });
  }
  if (k === "proposals" && !post) return J(await proposals(env, f));
  const am = /^(publish|update|cancel)$/.exec(k);
  if (am && post) { const b = await request.json().catch(() => ({})), r = await act(env, user, am[1], b.handle, b.confirm === true, f); return J(r, r.error ? (r.error === "forbidden" ? 403 : 400) : 200); }
  return null;
}
// Nur zum Verlinken auf der Event-Seite: LinkedIn-URL eines veroeffentlichten (nicht abgesagten) Events
export async function linkedinUrlFor(db, eventId) { const r = await db.prepare("SELECT url FROM linkedin_events WHERE event_id=? AND status='published'").bind(eventId).first().catch(() => null); return r?.url || ""; }
