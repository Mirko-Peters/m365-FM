// LinkedIn-Events fuer die Seite "M365 Show": Vorschlagsliste + Veroeffentlichen per Klick im Admin (nie automatisch, kein Cron).
// Regel, auf dem Server fuer jeden Weg durchgesetzt (Liste, Veroeffentlichen, Aktualisieren): nur oeffentliche, kommende m365.fm-Events, deren Zeitfenster
// sich mit einem HeySummit-Event (m365con.net) ueberschneidet - Definition von "gleichzeitig" bei matchHeySummit, Regeln je Aktion bei rowRule.
// Alles, was nach einem Live-Test ggf. korrigiert werden muss (Endpunkte, Version, Scopes, Feldnamen), steht in LI und HS.
import { TRANSFER } from "./events.js";
import { audit, b64u, cleanText, cookie, randomToken, sha256hex, sign, verify } from "./util.js";

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
  format: { online: "ONLINE", onsite: "IN_PERSON", hybrid: "HYBRID" },   // events.mode -> Format des LinkedIn-Events (Werte nach dem Live-Test pruefen)
  visibility: "PUBLIC", cancelState: "CANCELLED",
  nameMax: 100, descMax: 2000, locale: { language: "de", country: "DE" },
  redirectPath: "/auth/linkedin-events/callback", stateCookie: "m365le",
  timeoutMs: 30000, tokenTimeoutMs: 15000,                   // laenger wartet kein Aufruf (Event-API bzw. Token-Erneuerung); HOLD_S (unten) ist bewusst groesser
};
// HeySummit-API v2 (Authorization: Token <HEYSUMMIT_API_KEY>). Feldnamen so, wie das verbundene Konto sie liefert (Event 229506 "M365 Con 27", gelesen am 9.11.2026
// ueber den HeySummit-Connector; tools/mediakit_con.py liest dieselben Event-Felder). Zeiten kommen ohne Zone in UTC ("2027-01-11T07:00:00"), bei Talks steht der
// Versatz daneben (date_timezone_offset "+0000"). Antwortform des REST-Endpunkts (Seiten mit results/next) vor der ersten Veroeffentlichung einmal mit dem Schluessel pruefen:
// passt sie nicht, meldet die Liste "hs_format" bzw. "0 mit Termin" und schlaegt nichts vor (nie umgekehrt).
// Nicht veroeffentlichte HeySummit-Events (is_live false, z. B. die Kopie 229209 "M365 Con (copy)") und archivierte zaehlen nie als "laeuft gleichzeitig".
export const HS = {
  api: "https://api.heysummit.com/api",
  events: "/events/", talks: "/talks/",
  evStart: "first_talk_at", evEnd: "last_talk_at", evUrl: "event_url", evUrlAlt: "url", evArchived: "is_archived", evLive: "is_live",
  talkStart: "date", talkOffset: "date_timezone_offset", talkMins: "broadcast_duration_mins", talkUrl: "url", talkEvent: "event", talkCancelled: "talk_cancelled", talkActive: "is_active",
  defaultMins: 45,                                           // Talk ohne Dauer; auch: last_talk_at ist der BEGINN des letzten Talks
  maxPages: 12, maxCalls: 30, timeoutMs: 15000,
};
export const UTM = "utm_source=linkedin&utm_medium=event&utm_campaign=linkedin-events";
// So lange gilt eine Reservierung als "laeuft gerade": erst danach darf der Admin sie aufloesen (URN eintragen) oder freigeben. Gezaehlt wird ab dem Eintragen
// der Reservierung (echte Uhr, direkt vor dem LinkedIn-Aufruf), nicht ab dem Beginn der Anfrage - HeySummit zu lesen kann davor lange dauern. Muss deutlich
// groesser bleiben als alles, was nach der Reservierung noch warten kann: LI.tokenTimeoutMs + LI.timeoutMs (der Test prueft das Doppelte).
export const HOLD_S = 120;
export const CAND_MAX = 500;   // so viele Kandidaten prueft die Vorschlagsliste hoechstens; wird die Grenze erreicht, meldet sie das (truncated) statt still zu kuerzen
const ACTIONS = ["publish", "update", "cancel", "resolve", "release"];
// Kandidaten fuer NEUE Vorschlaege und Aktualisierungen - die EINE Stelle fuer weitere Ausschluesse (proposals() und act() lesen beide hierueber).
// Importierte Events ohne Veranstalter (unclaimed), vorbei gemeldete Import-Events (retired) und in ein anderes zusammengefuehrte (merged_into) nie (#317).
const CANDIDATE = "e.public=1 AND e.merged_into=0 AND e.unclaimed=0 AND e.retired=0";
// Zusammengefuehrte Events (#317): eine Reservierung (pending) wandert nicht mit (eventmerge.js EVENT_TABLES), eine Zeile am Quell-Event kann also bleiben, waehrend
// das Ziel-Event keine hat. Das Ziel-Event gilt dann als belegt (FAMILY_ROW: Zeile eines in es aufgegangenen Events, ueber hoechstens 6 Stufen), sonst entstuende
// ein zweiter LinkedIn-Event fuer dasselbe Event. Zuruecknehmen der Zusammenfuehrung loest die Bindung wieder.
const FAMILY_ROW = "WITH RECURSIVE fam(id,d) AS (SELECT id,0 FROM events WHERE merged_into=?1 AND id<>?1 UNION SELECT e.id,fam.d+1 FROM events e JOIN fam ON e.merged_into=fam.id WHERE fam.d<5) SELECT l.* FROM linkedin_events l JOIN fam ON fam.id=l.event_id ORDER BY (l.status='pending') DESC,(l.status='published') DESC LIMIT 1";
const FAMILY_TAKEN = "WITH RECURSIVE up(id,p,d) AS (SELECT e.id,e.merged_into,0 FROM events e JOIN linkedin_events l ON l.event_id=e.id WHERE e.merged_into<>0 UNION SELECT e.id,e.merged_into,up.d+1 FROM events e JOIN up ON e.id=up.p WHERE up.p<>0 AND up.d<6) SELECT DISTINCT p id FROM up WHERE p<>0";
const now = () => Math.floor(Date.now() / 1000);
const DAY = 86400000, iso = (ms) => new Date(ms).toISOString();
const rowsOf = (r) => r?.results || [];

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
// "YYYY-MM-DDTHH:MM" in der Zeitzone tz -> UTC-Millisekunden (ohne Zeitangabe oder mit unbekannter Zone: null, LinkedIn braucht eine Uhrzeit)
export function localToMs(s, tz = "Europe/Berlin") {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(s || "")); if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  const off = (t) => { const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(t)).map((x) => [x.type, x.value])); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t; };
  try { let t = asUtc - off(asUtc); t = asUtc - off(t); return t; } catch { return null; }
}
export const fmtBerlin = (ms) => new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short" }).format(new Date(ms));
// HeySummit-Zeit -> UTC-ms: ohne Zone gilt der mitgelieferte Versatz (off, "+0000"), sonst UTC; eine Zone im Text selbst hat Vorrang
export function hsMs(v, off) {
  let s = String(v || "").trim(); if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return null;
  const o = /^([+-])(\d{2}):?(\d{2})$/.exec(String(off || ""));
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(s)) s = s.replace(/([+-]\d{2})(\d{2})$/, "$1:$2"); else s += o ? `${o[1]}${o[2]}:${o[3]}` : "Z";
  const t = Date.parse(s); return Number.isFinite(t) ? t : null;
}
// Zeitfenster eines m365.fm-Events in UTC-ms, gerechnet in der Zeitzone des Events (events.tz): Ende mit Uhrzeit wie eingetragen, Ende nur als Datum = bis 23:59
// dieses Tages, ohne Ende = eine Stunde. Ohne Uhrzeit am Beginn gibt es kein Fenster (null).
export function evWindow(ev) {
  const tz = ev.tz || "Europe/Berlin", start = localToMs(ev.start, tz); if (start == null) return null;
  const e = String(ev.end || ""); let end = /T/.test(e) ? localToMs(e, tz) : /^\d{4}-\d{2}-\d{2}$/.test(e) ? localToMs(e + "T23:59", tz) : null;
  if (end == null || end <= start) end = start + 3600000;
  return { start, end };
}

// ---------- HeySummit (nur lesen) ----------
// Liefert je HeySummit-Event { id, name, url, start, end, talks: [{ id, title, url, start, end }] } in UTC-ms. Abgesagte und inaktive Talks zaehlen nicht,
// archivierte und nicht veroeffentlichte Events (Entwuerfe, Kopien: is_live false) auch nicht. Talks werden nur fuer Events geladen, die noch nicht vorbei sind (ein vergangenes Event ist nie "gleichzeitig" mit einem kommenden).
export async function fetchHeySummit(env, f = fetch, nowMs = Date.now()) {
  if (!env.HEYSUMMIT_API_KEY) return { error: "no_heysummit_key", events: [] };
  const H = { authorization: `Token ${env.HEYSUMMIT_API_KEY}`, accept: "application/json" }, base = new URL(HS.api);
  let calls = 0, partial = false;
  // Folgeseite nur auf demselben Host (der Schluessel geht nie an eine fremde Adresse), immer per https
  const nextUrl = (n) => { try { const u = new URL(String(n), HS.api + "/"); if (u.hostname !== base.hostname) return ""; u.protocol = "https:"; return u.href; } catch { return ""; } };
  const pages = async (p) => {
    const out = []; let u = HS.api + p;
    for (let i = 0; u; i++) {
      if (i >= HS.maxPages || calls >= HS.maxCalls) { partial = true; break; }
      calls++;
      const r = await f(u, { headers: H, signal: AbortSignal.timeout(HS.timeoutMs) }); if (!r.ok) throw new Error("hs_" + r.status);
      const j = await r.json().catch(() => null), list = Array.isArray(j) ? j : j?.results; if (!Array.isArray(list)) throw new Error("hs_format");
      out.push(...list);
      const nx = !Array.isArray(j) && j.next ? nextUrl(j.next) : ""; if (!Array.isArray(j) && j.next && !nx) partial = true;
      u = nx;
    }
    return out;
  };
  try {
    const out = [];
    for (const e of (await pages(HS.events)).filter((x) => x && x.id != null && x[HS.evArchived] !== true && x[HS.evLive] !== false).slice(0, 20)) {
      const start = hsMs(e[HS.evStart]), last = hsMs(e[HS.evEnd]);
      const ev = { id: String(e.id), name: String(e.title || e.name || ""), url: String(e[HS.evUrl] || e[HS.evUrlAlt] || ""), start, end: last == null ? null : last + HS.defaultMins * 60000, talks: [] };
      if (start != null && ev.end != null && ev.end > nowMs) {
        for (const t of await pages(`${HS.talks}?event=${encodeURIComponent(e.id)}`)) {
          if (!t || t[HS.talkCancelled] === true || t[HS.talkActive] === false) continue;
          if (t[HS.talkEvent] != null && String(t[HS.talkEvent]) !== ev.id) continue;   // greift der Filter ?event= nicht, zaehlen fremde Talks trotzdem nie
          const ts = hsMs(t[HS.talkStart], t[HS.talkOffset]), mins = Number(t[HS.talkMins]); if (ts == null) continue;
          ev.talks.push({ id: String(t.id), title: String(t.title || t.name || ""), url: String(t[HS.talkUrl] || ""), start: ts, end: ts + (mins > 0 ? mins : HS.defaultMins) * 60000 });
        }
        for (const t of ev.talks) { if (t.end > ev.end) ev.end = t.end; if (t.start < ev.start) ev.start = t.start; }   // Zeitraum = Huelle aller Talks (proposals() waehlt danach vor)
      }
      out.push(ev);
    }
    return { events: out, partial };
  } catch (e) { return { error: /^hs_\w+$/.test(String(e?.message)) ? e.message : /Timeout|Abort/.test(String(e?.name)) ? "hs_timeout" : "hs_error", events: [] }; }
}

// ---------- Regel: wann laeuft "gleichzeitig" ein HeySummit-Event? ----------
// Verglichen werden Zeitfenster in UTC-Millisekunden (unseres aus evWindow in der Zeitzone des Events, HeySummit liefert UTC). "Gleichzeitig" heisst: die Fenster
// ueberschneiden sich (Beginn des einen vor dem Ende des anderen und umgekehrt), ohne Toleranz. Treffer gibt es auf zwei Wegen:
//  linked: das Event gehoert zu einem HeySummit-Event (Handle in TRANSFER = heysummit:<id>, oder url/tickets_url liegt auf dessen Host) UND unser Fenster
//          ueberschneidet dessen Zeitraum (erster Talk bis Ende des letzten Talks). Die Verknuepfung allein genuegt nie.
//  talk:   unser Fenster ueberschneidet einen einzelnen aktiven, nicht abgesagten Talk (Beginn bis Beginn + Dauer).
// Kein Treffer: Event ohne Uhrzeit (no_time), Event schon vorbei (past), HeySummit-Event ohne bekannten Zeitraum oder schon vorbei.
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const overlap = (a, b) => a.start < b.end && b.start < a.end;
export function matchHeySummit(ev, hs, transfer = TRANSFER, nowMs = Date.now()) {
  const w = evWindow(ev); if (!w) return { ok: false, reason: "no_time" };
  if (w.end <= nowMs) return { ok: false, reason: "past" };
  const direct = String(transfer[ev.handle] || "").replace(/^heysummit:/, ""), hosts = [host(ev.url), host(ev.tickets_url)].filter(Boolean);
  let talk = null;
  for (const e of hs || []) {
    if (e.start == null || e.end == null || e.end <= nowMs) continue;
    if (((direct && e.id === direct) || (hosts.length && hosts.includes(host(e.url)))) && overlap(w, e)) return { ok: true, how: "linked", event: e };
    if (!talk) { const t = (e.talks || []).find((x) => x.start != null && x.end != null && overlap(w, x)); if (t) talk = { ok: true, how: "talk", event: e, talk: t }; }
  }
  return talk || { ok: false, reason: "no_match" };
}

// ---------- Nutzlast: Text, Aufruf und Format folgen dem Event (kostenlos oder nicht, online / vor Ort / hybrid) ----------
const SITE_EV = (env, ev) => `${env.SITE}/community/events/${ev.handle}/`;
const withUtm = (u) => u + (u.includes("?") ? "&" : "?") + UTM;
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return n < 1 ? "" : [...s].length <= n ? s : [...s].slice(0, n - 1).join("").trimEnd() + "…"; };
const MODE_DE = { online: "Online", onsite: "Vor Ort", hybrid: "Hybrid (vor Ort und online)" };
const modeOf = (ev) => (LI.format[ev.mode] ? ev.mode : "online");
export function buildPayload(env, ev, hsMatch, orgUrn) {
  const w = evWindow(ev); if (!w) return null;
  const mode = modeOf(ev), free = !!ev.free;
  // Anmeldelink: der eigene Ticket-Link des Events geht vor; ohne ihn die HeySummit-Seite des Treffers, dann die Event-Website
  const reg = ev.tickets_url || (hsMatch && (hsMatch.talk?.url || hsMatch.event?.url)) || ev.url || "";
  const place = mode === "online" ? "" : [ev.location, ev.country].map((x) => clip(x, 120)).filter(Boolean).join(", ");
  const tail = "\n\n" + (place ? `Ort: ${place}${mode === "hybrid" ? " (und online)" : ""}\n` : "") + `Mehr zum Event: ${withUtm(SITE_EV(env, ev))}` + (reg ? `\n${free ? "Kostenlos anmelden" : "Anmeldung und Tickets"}: ${withUtm(reg)}` : "");
  const base = clip(ev.summary || ev.about || "", LI.descMax - [...tail].length - 1);
  const loc = (v) => ({ locale: LI.locale, value: v });
  return {
    organizer: orgUrn, name: loc(clip(ev.title, LI.nameMax)), description: loc(base + tail),
    timeRange: { start: w.start, end: w.end }, eventFormat: LI.format[mode], externalUrl: withUtm(reg || SITE_EV(env, ev)), visibility: LI.visibility,
  };
}
const hashOf = async (p) => (await sha256hex(JSON.stringify({ ...p, organizer: "" }))).slice(0, 32);
const previewOf = (p, ev) => ({ name: p.name.value, description: p.description.value, externalUrl: p.externalUrl, format: MODE_DE[modeOf(ev)], free: !!ev.free, start: fmtBerlin(p.timeRange.start), end: fmtBerlin(p.timeRange.end) });

// ---------- Speicher ----------
export async function getConn(db) { return (await db.prepare("SELECT * FROM linkedin_conn WHERE id=1").first().catch(() => null)) || null; }
async function saveTokens(env, tok, uid, scope) {
  const t = now(), ex = await getConn(env.DB);
  const acc = await encryptToken(env, tok.access_token), ref = tok.refresh_token ? await encryptToken(env, tok.refresh_token) : (ex?.refresh_enc || "");
  await env.DB.prepare("INSERT INTO linkedin_conn(id,access_enc,refresh_enc,expires,scope,connected_by,updated) VALUES(1,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET access_enc=excluded.access_enc,refresh_enc=excluded.refresh_enc,expires=excluded.expires,scope=excluded.scope,connected_by=excluded.connected_by,updated=excluded.updated")
    .bind(acc, ref, t + (+tok.expires_in || 3600), scope || tok.scope || LI.scope, uid, t).run();
}
// Zugang entfernen: nur die verschluesselten Tokens und wem sie gehoeren (die gewaehlte Seite bleibt fuer die naechste Verbindung stehen)
const DROP_TOKENS = "UPDATE linkedin_conn SET access_enc='',refresh_enc='',expires=0,scope='',connected_by=0,updated=? WHERE id=1";
export async function disconnect(db) { await db.prepare(DROP_TOKENS).bind(now()).run(); }
// Konto geloescht: der LinkedIn-Zugang dieses Admins verschwindet, "veroeffentlicht von" wird geloest; die LinkedIn-Events selbst bleiben im Admin verwaltbar
export async function deleteUserLinkedin(db, uid) {
  await db.batch([db.prepare(DROP_TOKENS + " AND connected_by=?").bind(now(), uid), db.prepare("UPDATE linkedin_events SET published_by=0 WHERE published_by=?").bind(uid)]);
}
const creds = (env) => ({ id: env.LINKEDIN_EVENTS_CLIENT_ID || env.LINKEDIN_CLIENT_ID, secret: env.LINKEDIN_EVENTS_CLIENT_SECRET || env.LINKEDIN_CLIENT_SECRET });
async function accessToken(env, f) {
  const c = await getConn(env.DB); if (!c?.access_enc) throw new Error("not_connected");
  const open = (blob) => decryptToken(env, blob).catch(() => { throw new Error("expired"); });   // Schluessel gewechselt: neu verbinden
  if (c.expires > now() + 60) return open(c.access_enc);
  if (!c.refresh_enc) throw new Error("expired");   // LinkedIn gibt Refresh-Tokens nur an freigegebene Partner: dann neu verbinden
  const k = creds(env), r = await f(LI.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: await open(c.refresh_enc), client_id: k.id, client_secret: k.secret }), signal: AbortSignal.timeout(LI.tokenTimeoutMs) })
    .catch((e) => { throw new Error(/Timeout|Abort/.test(String(e?.name)) ? "li_timeout" : "li_network"); });   // Token-Erneuerung haengt: der Event-Aufruf ist dann noch nicht erfolgt
  if (!r.ok) throw new Error("expired");
  await saveTokens(env, await r.json(), c.connected_by, c.scope); return open((await getConn(env.DB)).access_enc);
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
  const k = creds(env), r = await f(LI.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: k.id, client_secret: k.secret, redirect_uri: env.API + LI.redirectPath }), signal: AbortSignal.timeout(LI.tokenTimeoutMs) }).catch(() => null);
  if (!r?.ok) return { error: "token" };
  const tok = await r.json().catch(() => ({})); if (!tok.access_token) return { error: "token" };
  await saveTokens(env, tok, user.id, tok.scope);
  return { ok: true };
}

// ---------- LinkedIn-Aufrufe ----------
// Fehler tragen nur feste Kennungen (nie Antworttexte oder Token) und sagen, ob LinkedIn sicher NICHTS getan hat (definite) oder der Ausgang offen ist.
const fail = (code, definite) => Object.assign(new Error(code), { definite });
const errCode = (e) => (/^(li_\w+|expired|not_connected|no_key)$/.test(String(e?.message)) ? e.message : "li_error");
const isGone = (e) => /^li_(404|410)$/.test(errCode(e));   // LinkedIn kennt den Event nicht (mehr), z. B. weil er dort selbst geloescht wurde
const urnId = (urn) => String(urn || "").split(":").pop();
export const eventUrl = (urn) => `https://www.linkedin.com/events/${urnId(urn)}/`;
// Eingabe des Admins beim Aufloesen einer Reservierung: URN, reine Zahl oder Adresse https://www.linkedin.com/events/<Zahl>/
export const urnOf = (v) => { const m = /^(?:urn:li:event:|https:\/\/www\.linkedin\.com\/events\/)?(\d{5,20})\/?$/.exec(String(v || "").trim()); return m ? "urn:li:event:" + m[1] : ""; };
async function liCall(env, f, url, init) {
  let tok; try { tok = await accessToken(env, f); } catch (e) { throw fail(errCode(e), true); }   // vor dem Aufruf gescheitert
  let r; try { r = await f(url, { ...init, headers: liHeaders(tok, init.headers), signal: AbortSignal.timeout(LI.timeoutMs) }); } catch (e) { throw fail(/Timeout|Abort/.test(String(e?.name)) ? "li_timeout" : "li_network", false); }
  if (!r.ok) throw fail("li_" + r.status, r.status >= 400 && r.status < 500 && r.status !== 408);   // 4xx = abgelehnt; 408 und 5xx koennen trotzdem etwas angelegt haben
  return r;
}
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
  const r = await liCall(env, f, LI.api + LI.events, { method: "POST", body: JSON.stringify(payload) });
  // Rest.li nennt die neue ID im Kopf (x-restli-id, aelter x-linkedin-id) und im Location-Pfad; fehlt sie, existiert der Event trotzdem: Ausgang offen
  let id = r.headers.get("x-restli-id") || r.headers.get("x-linkedin-id") || String(r.headers.get("location") || "").split("?")[0].split("/").filter(Boolean).pop() || "";
  try { id = decodeURIComponent(id); } catch { /* unveraendert */ }
  const urn = /^\d+$/.test(id) ? "urn:li:event:" + id : /^urn:li:\w+:\d+$/.test(id) ? id : ""; if (!urn) throw fail("li_no_urn", false);
  return { urn };
}
const liPatch = (env, urn, set, f) => liCall(env, f, `${LI.api}${LI.events}/${encodeURIComponent(urn)}`, { method: "POST", headers: { "X-RestLi-Method": "PARTIAL_UPDATE" }, body: JSON.stringify({ patch: { $set: set } }) });
export const liUpdate = (env, urn, payload, f = fetch) => { const { organizer, ...set } = payload; return liPatch(env, urn, set, f); };
export const liCancel = (env, urn, f = fetch) => liPatch(env, urn, { lifecycleState: LI.cancelState }, f);
// 404/410 auf Aktualisieren oder Absagen allein beweist nichts (ein falscher Pfad oder eine falsche Version saehe genauso aus, siehe Kopf und LI). Erst wenn auch
// das Lesen des Events unter derselben Adresse 404/410 antwortet, gilt er als auf LinkedIn geloescht. Antwortet das Lesen anders, bleibt der Fehler des
// Aufrufs stehen (li_404/li_410) und es wird nichts ausgetragen. Pfad und Version erst nach dem Live-Test des Besitzers aendern.
async function confirmGone(env, urn, e, f) {
  if (!isGone(e)) return false;
  try { await liCall(env, f, `${LI.api}${LI.events}/${encodeURIComponent(urn)}`, { method: "GET" }); return false; } catch (g) { return isGone(g); }
}

// ---------- Regeln je Aktion: eine Stelle fuer die Liste (welche Knoepfe) und fuer die Ausfuehrung (act) ----------
// ev = Zeile aus events mit li_ok (erfuellt CANDIDATE) oder null (geloescht), li = Zeile aus linkedin_events oder null. Rueckgabe: Fehlerkennung oder "" (erlaubt).
// Fuer publish und update kommt danach noch die HeySummit-Regel (needsHs).
const needsHs = (a) => a === "publish" || a === "update";
const holdLeft = (li, nowMs) => Math.max(0, Math.ceil(HOLD_S - (nowMs / 1000 - li.updated)));   // Sekunden, bis eine Reservierung geklaert werden darf
function rowRule(action, ev, li, nowMs, known = false) {   // known: die Anfrage traegt den Beleg einer store_failed-Antwort (ticketFor), die Wartezeit entfaellt
  const w = ev ? evWindow(ev) : null;
  if (action === "publish") {   // nur oeffentliche Events, die noch nicht begonnen haben und noch keine Zeile haben (auch keine reservierte oder abgesagte)
    if (li) return li.status === "pending" ? "publish_pending" : li.status === "cancelled" ? "cancelled" : "already_published";
    return !ev ? "not_found" : !ev.li_ok ? "not_public" : !w ? "no_time" : w.start <= nowMs ? "past" : "";
  }
  if (!li) return "not_published";
  if (action === "resolve" || action === "release") return li.status !== "pending" ? "not_pending" : !known && holdLeft(li, nowMs) > 0 ? "publish_running" : "";
  if (li.status !== "published") return li.status === "pending" ? "publish_pending" : "cancelled";   // nach einer Absage gibt es kein Aktualisieren und kein zweites Absagen
  if (action === "cancel") return "";   // Absagen geht immer: auch wenn das m365.fm-Event versteckt, vorbei oder geloescht ist
  return !ev ? "orphan" : !ev.li_ok ? "not_public" : !w ? "no_time" : w.end <= nowMs ? "past" : "";
}
const hsReason = (m, hs) => (m.reason === "no_match" && hs.error ? hs.error : m.reason);

// ---------- Vorschlagsliste ----------
// Neue Vorschlaege: oeffentliche Events (CANDIDATE) mit Uhrzeit, die noch nicht begonnen haben, naechstes zuerst. Die Vorauswahl geschieht in SQL und VOR dem
// LIMIT schon nach der HeySummit-Regel: nur Events, deren Termin in den Zeitraum eines kommenden HeySummit-Events faellt (je ein Tag Luft fuer Zeitzonen; genau
// gerechnet wird danach in rowRule/matchHeySummit). Events ohne Uhrzeit, ohne HeySummit-Zeitraum oder mit LinkedIn-Zeile verbrauchen die Grenze so nie; wird sie
// trotzdem erreicht (mehr als CAND_MAX Events im HeySummit-Zeitraum), entfallen die fernsten und die Antwort sagt es (truncated).
// Dazu jede LinkedIn-Zeile, an der noch etwas zu tun ist: reservierte (pending), veroeffentlichte bis zum Ende des Events (auch wenn das m365.fm-Event
// inzwischen versteckt ist) und verwaiste (m365.fm-Event geloescht) - damit kein LinkedIn-Event ohne Absage-Knopf zurueckbleibt.
export async function proposals(env, f = fetch, nowMs = Date.now()) {
  const db = env.DB, conn = await getConn(db), hs = await fetchHeySummit(env, f, nowMs), org = conn?.org_urn || "urn:li:organization:?";
  await purgeLinkedinOrphans(db, nowMs).catch(() => 0);
  const spans = hs.events.filter((e) => e.start != null && e.end != null && e.end > nowMs).map((e) => [iso(e.start - DAY).slice(0, 10), iso(e.end + DAY).slice(0, 16)]);
  let evs = [], truncated = false;
  if (spans.length) {   // ohne kommendes HeySummit-Event (oder HeySummit nicht lesbar) gibt es keinen neuen Vorschlag
    const taken = JSON.stringify(rowsOf(await db.prepare(FAMILY_TAKEN).all()).map((r) => r.id));   // Ziel-Events mit LinkedIn-Zeile an einem in sie aufgegangenen Event: kein neuer Vorschlag
    evs = rowsOf(await db.prepare(`SELECT e.*, 1 AS li_ok FROM events e WHERE ${CANDIDATE} AND e.start LIKE '%T%' AND e.start>=? AND e.id NOT IN (SELECT event_id FROM linkedin_events) AND e.id NOT IN (SELECT value FROM json_each(?)) AND (${spans.map(() => "(MAX(e.start,COALESCE(NULLIF(e.end,''),e.start))>=? AND e.start<=?)").join(" OR ")}) ORDER BY e.start LIMIT ${CAND_MAX + 1}`).bind(iso(nowMs - DAY).slice(0, 10), taken, ...spans.flat()).all());
    truncated = evs.length > CAND_MAX; if (truncated) evs.length = CAND_MAX;
  }
  const lis = rowsOf(await db.prepare("SELECT * FROM linkedin_events ORDER BY (status='pending') DESC, published DESC LIMIT 500").all()), byEvent = new Map(lis.map((x) => [x.event_id, x]));
  const seen = new Set(evs.map((e) => e.id));
  for (const e of rowsOf(await db.prepare(`SELECT e.*, (CASE WHEN ${CANDIDATE} THEN 1 ELSE 0 END) AS li_ok FROM events e WHERE e.id IN (SELECT event_id FROM linkedin_events)`).all())) if (!seen.has(e.id)) { seen.add(e.id); evs.push(e); }
  const items = [];
  for (const ev of evs) {
    const li = byEvent.get(ev.id) || null, w = evWindow(ev), m = matchHeySummit(ev, hs.events, TRANSFER, nowMs);
    const can = ACTIONS.filter((a) => !rowRule(a, ev, li, nowMs) && (!needsHs(a) || m.ok));
    if (!li && !can.includes("publish")) continue;                                       // neu nur, wenn alle Regeln erfuellt sind
    const over = w ? w.end : localToMs(String(ev.end || ev.start).slice(0, 10) + "T23:59", ev.tz || "Europe/Berlin");   // ohne Uhrzeit: bis zum Ende des Tages
    if (li && li.status !== "pending" && over != null && over <= nowMs) continue;        // vorbei: nichts mehr zu verwalten
    if (li && li.status === "cancelled" && !ev.li_ok) continue;
    const payload = buildPayload(env, ev, m.ok ? m : null, org);
    const row = { id: ev.id, handle: ev.handle, title: ev.title, when: payload ? `${fmtBerlin(payload.timeRange.start)} – ${fmtBerlin(payload.timeRange.end)}` : ev.start, at: w?.start || 0,
      hs: m.ok ? { how: m.how, event: m.event.name, talk: m.talk?.title || "" } : null, preview: payload ? previewOf(payload, ev) : null, state: li ? li.status : "proposal", can };
    if (li) {
      row.linkedin_url = li.url; row.hidden = !ev.li_ok; if (li.status === "pending") row.wait = holdLeft(li, nowMs); row.changed = li.status === "published" && !!payload && (await hashOf(payload)) !== li.hash;
      if (li.status === "published" && !m.ok) row.rule = hsReason(m, hs);                // Regel nicht (mehr) erfuellt: Aktualisieren gesperrt, Absagen bleibt
    }
    items.push(row);
  }
  // Verwaist (m365.fm-Event geloescht): reservierte immer, veroeffentlichte bis zum Ende des LinkedIn-Events (danach gibt es nichts mehr abzusagen)
  for (const li of lis) if (!seen.has(li.event_id) && li.status !== "cancelled" && !(li.status === "published" && li.ends > 0 && li.ends <= nowMs))
    items.push({ id: li.event_id, handle: li.handle, title: li.title || `Event ${li.event_id}`, when: li.starts ? fmtBerlin(li.starts) : "", at: li.starts || 0, hs: null, preview: null, state: li.status, orphan: true, linkedin_url: li.url, ...(li.status === "pending" ? { wait: holdLeft(li, nowMs) } : {}), can: ACTIONS.filter((a) => !needsHs(a) && !rowRule(a, null, li, nowMs)) });
  const urgent = (x) => (x.state === "pending" || x.orphan || x.hidden ? 0 : 1);
  items.sort((a, b) => urgent(a) - urgent(b) || a.at - b.at);
  const info = { events: hs.events.length, dated: hs.events.filter((e) => e.start != null).length, talks: hs.events.reduce((n, e) => n + e.talks.length, 0), partial: !!hs.partial };
  return { items, hs_error: hs.error || "", hs_info: info, truncated, limit: CAND_MAX, connected: !!conn?.access_enc, org: conn?.org_name || "" };
}

// Beleg fuer "LinkedIn hat diesen Event angelegt, nur das Eintragen hier ist gescheitert" (store_failed): gebunden an Event, URN und genau diese Reservierung.
// Wer ihn bei resolve mitschickt, muss die Wartezeit nicht abwarten - der Aufruf an LinkedIn ist ja beendet und die URN kommt vom Server selbst.
const ticketVal = (eid, urn, stamp) => `linkedin-events-resolve|${eid}|${urn}|${stamp}`;
const ticketFor = async (env, eid, urn, stamp) => (env.SESSION_SECRET ? sign(env.SESSION_SECRET, ticketVal(eid, urn, stamp)).catch(() => "") : "");
// Ergebnis des LinkedIn-Aufrufs in GENAU diese Reservierung eintragen (stamp = ihr Zeitstempel): "ok", "lost" (die Reservierung gibt es nicht mehr, z. B. zu
// Unrecht freigegeben und neu belegt - eine fremde Reservierung wird nie ueberschrieben) oder "failed" (D1 nach drei Versuchen nicht erreichbar).
async function storeUrn(db, eid, stamp, urn, url) {
  for (let i = 0; i < 3; i++) {
    try {
      const n = Number((await db.prepare("UPDATE linkedin_events SET urn=?,url=?,status='published',updated=? WHERE event_id=? AND status='pending' AND urn='' AND updated=?").bind(urn, url, now(), eid, stamp).run()).meta?.changes || 0);
      if (n === 1) return "ok";
      return (await db.prepare("SELECT 1 x FROM linkedin_events WHERE event_id=? AND urn=?").bind(eid, urn).first()) ? "ok" : "lost";   // "ok": ein frueherer Versuch hatte doch geschrieben
    } catch { /* naechster Versuch */ }
  }
  return "failed";
}

// Aktion fuer ein Event; jede Aktion nur auf expliziten Klick (confirm === true), ohne confirm nur Vorschau.
// ref = Handle oder { handle, event_id, urn, ticket, gone }: event_id geht vor (verwaiste Zeilen haben kein m365.fm-Event mehr), urn/ticket nur fuer resolve,
// gone nur fuer cancel. nowMs gilt fuer die Regeln (Tests); der Zeitstempel einer Reservierung kommt immer von der echten Uhr im Moment des Eintragens.
export async function act(env, user, action, ref, confirm, f = fetch, nowMs = Date.now()) {
  if (!user?.admin) return { error: "forbidden" };
  if (!ACTIONS.includes(action)) return { error: "bad_action" };
  const db = env.DB, q = ref && typeof ref === "object" ? ref : { handle: ref }, id = /^[1-9]\d{0,14}$/.test(String(q.event_id ?? "")) ? +q.event_id : 0, t = Math.floor(nowMs / 1000);
  const sel = `SELECT e.*, (CASE WHEN ${CANDIDATE} THEN 1 ELSE 0 END) AS li_ok FROM events e WHERE `;
  const ev = id ? await db.prepare(sel + "e.id=?").bind(id).first() : await db.prepare(sel + "e.handle=?").bind(String(q.handle || "")).first();
  const eid = ev?.id || id, li = eid ? await db.prepare("SELECT * FROM linkedin_events WHERE event_id=?").bind(eid).first() : null;
  if (!ev && !li) return { error: "not_found" };
  const online = action === "publish" || action === "update" || action === "cancel", conn = online ? await getConn(db) : null;
  if (online && !conn?.access_enc) return { error: "not_connected" };
  if (needsHs(action) && !conn.org_urn) return { error: "no_org" };
  const known = action === "resolve" && li?.status === "pending" && !!env.SESSION_SECRET && typeof q.ticket === "string" && !!urnOf(q.urn) && await verify(env.SESSION_SECRET, ticketVal(eid, urnOf(q.urn), li.updated), q.ticket);
  const fam = action === "publish" && !li && ev ? await db.prepare(FAMILY_ROW).bind(ev.id).first() : null;   // Zeile eines in dieses Event aufgegangenen Events zaehlt wie eine eigene
  const denied = rowRule(action, ev, li || fam, nowMs, known); if (denied) return { error: denied, ...((li || fam)?.url ? { linkedin_url: (li || fam).url } : {}) };
  const name = ev?.handle || li?.handle || String(eid);
  let payload = null;
  if (needsHs(action)) {   // die HeySummit-Regel gilt beim Veroeffentlichen UND beim Aktualisieren; ist HeySummit nicht lesbar, geht nichts raus
    const hs = await fetchHeySummit(env, f, nowMs), m = matchHeySummit(ev, hs.events, TRANSFER, nowMs);
    if (!m.ok) return { error: hsReason(m, hs) };
    payload = buildPayload(env, ev, m, conn.org_urn); if (!payload) return { error: "no_time" };
  }
  if (action === "publish") {
    if (confirm !== true) return { preview: payload };
    // 1) Reservieren, BEVOR LinkedIn gerufen wird: nur wer die Zeile anlegt (changes === 1), darf weiter. Der Zeitstempel ist die Uhr JETZT (nicht der Beginn
    //    der Anfrage, HeySummit kann davor lange gebraucht haben): ab hier laeuft HOLD_S, und er ist zugleich das Kennzeichen genau dieser Reservierung
    const stamp = now(); let res;
    try { res = await db.prepare("INSERT INTO linkedin_events(event_id,urn,url,status,hash,handle,title,starts,ends,published_by,published,updated) VALUES(?,'','','pending',?,?,?,?,?,?,?,?) ON CONFLICT(event_id) DO NOTHING").bind(ev.id, await hashOf(payload), ev.handle, clip(ev.title, 200), payload.timeRange.start, payload.timeRange.end, user.id, stamp, stamp).run(); } catch { return { error: "db_error" }; }
    if (Number(res?.meta?.changes || 0) !== 1) return { error: "publish_pending" };
    // 2) LinkedIn. Sicher abgelehnt: Reservierung weg, neuer Versuch moeglich. Ausgang offen: Reservierung bleibt, der Admin klaert es (resolve/release)
    let r;
    try { r = await liPublish(env, payload, f); } catch (e) {
      if (e.definite) { await db.prepare("DELETE FROM linkedin_events WHERE event_id=? AND status='pending' AND urn='' AND updated=?").bind(ev.id, stamp).run().catch(() => 0); return { error: errCode(e) }; }
      await audit(db, user.id, "linkedin-publish-unclear", name, errCode(e)); return { error: errCode(e), pending: true };
    }
    // 3) Ergebnis eintragen. Scheitert das, existiert der LinkedIn-Event: die Reservierung bleibt, URN und Beleg gehen an den Admin, der sie sofort nachtragen kann
    const url = eventUrl(r.urn), stored = await storeUrn(db, ev.id, stamp, r.urn, url);
    await audit(db, user.id, stored === "ok" ? "linkedin-publish" : stored === "lost" ? "linkedin-publish-lost" : "linkedin-publish-unstored", name, r.urn);
    if (stored === "ok") return { ok: true, urn: r.urn, linkedin_url: url };
    if (stored === "lost") return { error: "store_failed", lost: true, urn: r.urn, linkedin_url: url };   // hier gibt es nichts nachzutragen: den Event auf LinkedIn selbst entfernen
    return { error: "store_failed", pending: true, urn: r.urn, linkedin_url: url, ticket: await ticketFor(env, ev.id, r.urn, stamp) };
  }
  if (action === "resolve") {   // Reservierung mit offenem Ausgang: der Admin hat den Event auf LinkedIn gefunden und traegt ihn ein
    const urn = urnOf(q.urn); if (!urn) return { error: "bad_urn" };
    if (await db.prepare("SELECT 1 x FROM linkedin_events WHERE urn=? AND event_id<>?").bind(urn, eid).first()) return { error: "urn_taken" };
    if (confirm !== true) return { preview: { action, urn, linkedin_url: eventUrl(urn) } };
    const r = await db.prepare("UPDATE linkedin_events SET urn=?,url=?,status='published',updated=? WHERE event_id=? AND status='pending'").bind(urn, eventUrl(urn), t, eid).run();
    if (Number(r.meta?.changes || 0) !== 1) return { error: "not_pending" };
    await audit(db, user.id, "linkedin-resolve", name, urn); return { ok: true, urn, linkedin_url: eventUrl(urn) };
  }
  if (action === "release") {   // Reservierung verwerfen: nur, wenn auf LinkedIn sicher kein Event entstanden ist (das bestaetigt der Admin per Klick)
    if (confirm !== true) return { preview: { action } };
    const r = await db.prepare("DELETE FROM linkedin_events WHERE event_id=? AND status='pending'").bind(eid).run();
    if (Number(r.meta?.changes || 0) !== 1) return { error: "not_pending" };
    await audit(db, user.id, "linkedin-release", name); return { ok: true };
  }
  if (action === "update") {
    if (confirm !== true) return { preview: payload };
    try { await liUpdate(env, li.urn, payload, f); } catch (e) { const gone = await confirmGone(env, li.urn, e, f); return { error: gone ? "li_gone" : errCode(e), ...(gone ? { linkedin_url: li.url } : {}) }; }
    await db.prepare("UPDATE linkedin_events SET hash=?,handle=?,title=?,starts=?,ends=?,updated=? WHERE event_id=? AND status='published'").bind(await hashOf(payload), ev.handle, clip(ev.title, 200), payload.timeRange.start, payload.timeRange.end, t, eid).run();   // der Status bleibt, wie er ist
    await audit(db, user.id, "linkedin-update", name, li.urn); return { ok: true, linkedin_url: li.url };
  }
  if (confirm !== true) return { preview: { action, urn: li.urn, linkedin_url: li.url } };
  // 404/410: LinkedIn kennt den Event nicht (mehr) - etwa, weil er dort selbst geloescht wurde. Das allein traegt hier nichts aus (ein falscher Endpunkt saehe
  // genauso aus): angeboten wird "austragen" (li_gone) nur, wenn auch das Lesen des Events 404/410 antwortet (confirmGone), und erst wenn der Admin es
  // ausdruecklich bestaetigt (gone) UND LinkedIn dabei wieder so antwortet, gilt der Event als erledigt.
  let gone = false;
  try { await liCancel(env, li.urn, f); } catch (e) {
    if (!(await confirmGone(env, li.urn, e, f))) return { error: errCode(e) };
    if (q.gone !== true) return { error: "li_gone", linkedin_url: li.url };
    gone = true;
  }
  // Abgesagt. Gibt es das m365.fm-Event noch, bleibt die Zeile als "abgesagt" stehen (kein zweites Veroeffentlichen); eine verwaiste Zeile ist damit erledigt
  if (ev) await db.prepare("UPDATE linkedin_events SET status='cancelled',updated=? WHERE event_id=? AND status='published'").bind(t, eid).run();
  else await db.prepare("DELETE FROM linkedin_events WHERE event_id=? AND status='published'").bind(eid).run();
  await audit(db, user.id, gone ? "linkedin-cancel-gone" : "linkedin-cancel", name, li.urn); return { ok: true, linkedin_url: li.url, ...(gone ? { gone: true } : {}) };
}

// ---------- REST (/api/admin/linkedin/...) ----------
// Jede Route steht als path === "..." da: so sieht sie tools/mcp_routes.mjs, und der Deploy verlangt den Eintrag in worker/mcp_coverage.json.
const CODE = { forbidden: 403, not_found: 404, already_published: 409, publish_pending: 409, publish_running: 409, cancelled: 409, not_pending: 409, not_published: 409, urn_taken: 409, li_gone: 409, db_error: 503, store_failed: 502 };
export async function handleLinkedinEvents(env, request, url, path, user, J, f = fetch) {
  if (!path.startsWith("/api/admin/linkedin/")) return null;
  if (!user?.admin) return J({ error: "forbidden" }, 403);
  const db = env.DB, get = request.method === "GET", post = request.method === "POST";
  // Status: nur Ja/Nein und oeffentliche Angaben, nie Token, Client-Secret oder Schluessel
  if (path === "/api/admin/linkedin/status" && get) { const c = await getConn(db), cr = creds(env); return J({ configured: !!(cr.id && cr.secret), connected: !!c?.access_enc, org_urn: c?.org_urn || "", org_name: c?.org_name || "", redirect_uri: env.API + LI.redirectPath, scope: LI.scope, heysummit_key: !!env.HEYSUMMIT_API_KEY }); }
  if (path === "/api/admin/linkedin/orgs" && get) { try { return J({ orgs: await listOrgs(env, f) }); } catch (e) { return J({ error: errCode(e) }, 502); } }
  if (path === "/api/admin/linkedin/org" && post) {
    const b = await request.json().catch(() => ({})), urn = String(b.urn || ""); if (!/^urn:li:organization:\d{1,20}$/.test(urn)) return J({ error: "bad_urn" }, 400);
    const r = await db.prepare("UPDATE linkedin_conn SET org_urn=?,org_name=?,updated=? WHERE id=1").bind(urn, cleanText(b.name, 120), now()).run();
    return Number(r.meta?.changes || 0) === 1 ? J({ ok: true }) : J({ error: "not_connected" }, 400);
  }
  if (path === "/api/admin/linkedin/disconnect" && post) { await disconnect(db); await audit(db, user.id, "linkedin-disconnect"); return J({ ok: true }); }
  if (path === "/api/admin/linkedin/proposals" && get) return J(await proposals(env, f));
  const action = path === "/api/admin/linkedin/publish" ? "publish" : path === "/api/admin/linkedin/update" ? "update" : path === "/api/admin/linkedin/cancel" ? "cancel"
    : path === "/api/admin/linkedin/resolve" ? "resolve" : path === "/api/admin/linkedin/release" ? "release" : "";
  if (action && post) {
    const b = await request.json().catch(() => ({})), r = await act(env, user, action, { handle: b?.handle, event_id: b?.event_id, urn: b?.urn, ticket: b?.ticket, gone: b?.gone === true }, b?.confirm === true, f);
    return J(r, r.error ? CODE[r.error] || (/^(li|hs)_/.test(r.error) ? 502 : 400) : 200);
  }
  return J({ error: "not_found" }, 404);
}
// Verwaiste veroeffentlichte Zeilen (m365.fm-Event geloescht, auch per Kontoloeschung), deren LinkedIn-Event vorbei ist: nichts mehr abzusagen, die Liste zeigt sie
// nicht mehr - Handle und Titel des geloeschten Events verschwinden dann auch hier (taeglicher Cron und beim Laden der Liste). Reservierungen bleiben (klaeren).
export async function purgeLinkedinOrphans(db, nowMs = Date.now()) {
  const r = await db.prepare("DELETE FROM linkedin_events WHERE status='published' AND ends>0 AND ends<=? AND event_id NOT IN (SELECT id FROM events)").bind(nowMs).run();
  return { deleted: Number(r.meta?.changes || 0) };
}
// Nur zum Verlinken auf der Event-Seite: LinkedIn-URL eines veroeffentlichten (nicht abgesagten) Events
export async function linkedinUrlFor(db, eventId) { const r = await db.prepare("SELECT url FROM linkedin_events WHERE event_id=? AND status='published'").bind(eventId).first().catch(() => null); return r?.url || ""; }
