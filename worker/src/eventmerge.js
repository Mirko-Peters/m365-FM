// Event-Import: Normalisierung, Abgleich und umkehrbares Zusammenfuehren von Events, Sessions und Speakern.
// Hinweis: assets/entity-match.js (PR #309) liegt auf main noch nicht vor; die kleine Normalisierung steht deshalb hier (normText & Co.).
// Regeln: sichere Treffer ("high") werden zusammengefuehrt, unsichere ("low") landen in dedupe_queue; nie hart loeschen (merged_into + merge_log).
import { ensureDirectoryCols } from "./directory.js";

const now = () => Math.floor(Date.now() / 1000);
const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };

// ---------------------------------------------------------------- Normalisierung
export function normText(s) {
  return String(s ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/\p{Extended_Pictographic}|️|‍/gu, " ")
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")   // Satzzeichen, Anfuehrungszeichen aller Art
    .replace(/\s+/g, " ").trim();
}
const LEGAL = new Set(["gmbh", "ug", "inc", "llc", "ltd", "ev", "e", "v", "corp", "co", "ag", "bv", "sas", "sarl", "oy", "ab", "srl", "sa", "kg"]);
const EDITION = new Set(["edition", "ausgabe", "vol", "volume", "annual", "jaehrliche", "jahrliche", "the"]);
// Event-Name ohne Jahr, Edition und Rechtsform; year = erkannte Jahreszahl (Hinweis, kein Schluessel)
export function normEventName(title) {
  let t = normText(title), year = "";
  t = t.replace(/\b(19|20)\d{2}\b/g, (m) => { year = year || m; return " "; })
    .replace(/\b\d+(st|nd|rd|th)\b/g, " ").replace(/\b(no|nr)\b\s*\d+\b/g, " ").replace(/\bnumber\s*\d+\b/g, " ");
  const toks = t.split(" ").filter((w) => w && !EDITION.has(w) && !/^\d{1,2}$/.test(w));
  while (toks.length > 1 && LEGAL.has(toks[toks.length - 1])) toks.pop();
  return { key: toks.join(" "), year };
}
export const normSessionTitle = (s) => normText(s);
export const normPerson = (s) => normText(s).replace(/\b(dr|prof|mvp|mr|mrs|ms)\b/g, " ").replace(/\s+/g, " ").trim();
export const cityKey = (s) => normText(s).replace(/^(city of|stadt)\s+/, "");
const TRACKING = /^(utm_|fbclid|gclid|mc_|ref$|source$|igshid)/i;
// URL-Schluessel: ohne Protokoll, www, Tracking-Parameter, Fragment, Schluss-Slash
export function normUrl(u) {
  try {
    const x = new URL(String(u || "").trim()); if (!/^https?:$/.test(x.protocol)) return "";
    const q = [...x.searchParams.entries()].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&");
    return (x.hostname.replace(/^www\./, "").toLowerCase() + x.pathname.replace(/\/+$/, "").toLowerCase() + (q ? "?" + q : ""));
  } catch { return ""; }
}
// Profil-Links von Speakern: LinkedIn/X/GitHub/Blog auf einen Schluessel bringen ("" = nicht brauchbar)
export function normLink(u) {
  try {
    const x = new URL(String(u || "").trim()); if (!/^https?:$/.test(x.protocol)) return "";
    const host = x.hostname.replace(/^www\./, "").toLowerCase(), seg = x.pathname.split("/").filter(Boolean);
    if (host.endsWith("linkedin.com")) return seg[0] === "in" && seg[1] ? "linkedin:" + decodeURIComponent(seg[1]).toLowerCase() : "";
    if (host === "twitter.com" || host === "x.com") return seg[0] && !["intent", "share", "home", "i"].includes(seg[0].toLowerCase()) ? "x:" + seg[0].toLowerCase() : "";
    if (host === "github.com") return seg[0] ? "github:" + seg[0].toLowerCase() : "";
    if (host === "sessionize.com") return seg[0] && seg[0] !== "s" ? "sessionize:" + seg[0].toLowerCase() : "";
    const n = normUrl(u); return seg.length || host.split(".").length > 2 ? n : n;   // Blog/Firmenseite: Host+Pfad
  } catch { return ""; }
}
const dayNum = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000) : null; };
export const dayDiff = (a, b) => { const x = dayNum(a), y = dayNum(b); return x === null || y === null ? null : Math.abs(x - y); };
const mins = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || "")); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000 : null; };
// Ueberlappen zwei Zeitfenster? null = unbekannt (mindestens ein Beginn fehlt)
export function overlaps(s1, e1, s2, e2) {
  const a = mins(s1), b = mins(s2); if (a === null || b === null) return null;
  const a2 = mins(e1) ?? a + 1, b2 = mins(e2) ?? b + 1;
  return a < b2 && b < a2 || a === b;
}
export function jaccard(a, b) {
  const x = new Set(String(a).split(" ").filter(Boolean)), y = new Set(String(b).split(" ").filter(Boolean)); if (!x.size || !y.size) return 0;
  let n = 0; for (const t of x) if (y.has(t)) n++;
  return n / (x.size + y.size - n);
}
export const hash24 = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
const richer = (a, b) => { a = String(a ?? ""); b = String(b ?? ""); return b.length > a.length ? b : a; };
const rndToken = () => [...crypto.getRandomValues(new Uint8Array(18))].map((b) => b.toString(16).padStart(2, "0")).join("");
const RANK = { confirmed: 3, invited: 2, declined: 1 };

// ---------------------------------------------------------------- Quellen
export async function addSource(db, table, id, kind, ref, url = "", t = now()) {
  if (table === "event_source") await db.prepare("INSERT INTO event_source(event_id,kind,ref,url,url_key,first_seen,last_seen) VALUES(?,?,?,?,?,?,?) ON CONFLICT(event_id,kind,ref) DO UPDATE SET last_seen=excluded.last_seen,url=CASE WHEN event_source.url='' THEN excluded.url ELSE event_source.url END,url_key=CASE WHEN event_source.url_key='' THEN excluded.url_key ELSE event_source.url_key END").bind(id, kind, ref, url, normUrl(url), t, t).run();
  else await db.prepare("INSERT INTO session_source(session_id,kind,ref,url,first_seen,last_seen) VALUES(?,?,?,?,?,?) ON CONFLICT(session_id,kind,ref) DO UPDATE SET last_seen=excluded.last_seen").bind(id, kind, ref, url, t, t).run();
}
const SHARED_KINDS = ["sessionize_api", "sessionize_event", "communitydays"];

// ---------------------------------------------------------------- Events
const isOnline = (mode, city) => mode === "online" || (!city && mode !== "onsite");
// cand: { title, start, end, mode, city, url, sources:[{kind,ref,url}] }. Ergebnis: { id, confidence: high|low, reason, others:[{id,reason}] } oder null
export async function findEvent(db, cand, excludeId = 0) {
  const { key } = normEventName(cand.title), ck = cityKey(cand.city || ""), online = isOnline(cand.mode, ck);
  const hits = new Map();   // id -> { confidence, reason }
  const put = (id, confidence, reason) => { if (id === excludeId) return; const o = hits.get(id); if (!o || (confidence === "high" && o.confidence === "low")) hits.set(id, { confidence, reason }); };
  const live = async (id) => db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(id).first();
  const dateClash = (ev) => { const d = dayDiff(cand.start, ev.start); return d !== null && d > 3; };
  for (const s of cand.sources || []) {
    if (!SHARED_KINDS.includes(s.kind) || !s.ref) continue;
    for (const r of (await db.prepare("SELECT event_id FROM event_source WHERE kind=? AND ref=?").bind(s.kind, s.ref).all()).results || []) { const ev = await live(r.event_id); if (ev) put(ev.id, "high", "source:" + s.kind); }
  }
  const urlKeys = new Set([normUrl(cand.url), ...(cand.sources || []).map((s) => normUrl(s.url))].filter((k) => k && k.includes("/")));   // reine Domain (ohne Pfad) ist zu unspezifisch
  for (const uk of urlKeys) {
    const rows = [...((await db.prepare("SELECT id FROM events WHERE url_key=? AND merged_into=0").bind(uk).all()).results || []), ...((await db.prepare("SELECT event_id id FROM event_source WHERE url_key=?").bind(uk).all()).results || [])];
    for (const r of rows) { const ev = await live(r.id); if (ev) put(ev.id, dateClash(ev) ? "low" : "high", "url"); }
  }
  if (key) {
    const rows = (await db.prepare("SELECT * FROM events WHERE name_key=? AND merged_into=0").bind(key).all()).results || [];
    for (const ev of rows) {
      const d = dayDiff(cand.start, ev.start);
      if (d === null) { put(ev.id, "low", "name_without_date"); continue; }
      if (d > 1) continue;   // andere Ausgabe (Jahr/Datum)
      const evOnline = isOnline(ev.mode, ev.city_key);
      if ((online && evOnline) || (ck && ck === ev.city_key)) put(ev.id, "high", "name+date+place");
      else put(ev.id, "low", "name+date_place_differs");
    }
    if (!rows.length || true) {   // aehnlicher Name (Wortmenge) + Datum +-1 + gleicher Ort: nur zur Pruefung vorschlagen
      const near = (await db.prepare("SELECT * FROM events WHERE merged_into=0 AND name_key<>'' AND name_key<>? AND abs(julianday(substr(start,1,10))-julianday(?))<=1").bind(key, String(cand.start || "").slice(0, 10) || "0000-00-00").all()).results || [];
      for (const ev of near) if (jaccard(key, ev.name_key) >= 0.8 && ((online && isOnline(ev.mode, ev.city_key)) || (ck && ck === ev.city_key))) put(ev.id, "low", "similar_name");
    }
  }
  const all = [...hits.entries()].map(([id, v]) => ({ id, ...v })).sort((a, b) => (a.confidence === b.confidence ? 0 : a.confidence === "high" ? -1 : 1) || a.id - b.id);
  if (!all.length) return null;
  return { ...all[0], others: all.slice(1) };
}
function slugHandle(title) {
  const base = normText(title).replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "event";
  return base.length >= 3 ? base : base + "-event";
}
async function freeHandle(db, title, year) {
  const base = slugHandle(title); let h = base, i = 1;
  while (await db.prepare("SELECT 1 x FROM events WHERE handle=?").bind(h).first()) { i++; h = (base.slice(0, 36 - String(i).length) + "-" + (i === 2 && year ? year : i)).slice(0, 40); if (i > 2 && h === base + "-" + year) h = base.slice(0, 34) + "-" + i; if (i > 50) h = base.slice(0, 28) + "-" + rndToken().slice(0, 8); }
  return h;
}
const dateOk = (s) => /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(s || "");
const richerDate = (a, b) => (!a ? b : !b ? a : b.length > a.length && b.startsWith(a.slice(0, 10)) ? b : a);
const CAND_TEXT = (c) => ({ summary: String(c.summary || "").slice(0, 200), about: String(c.about || "").slice(0, 3000) });
// Event anlegen oder mit dem sicheren Treffer zusammenfuehren. opts.dry = nichts schreiben. Liefert { action: created|merged|queued, id }
export async function upsertEvent(db, cand, opts = {}) {
  await ensureDirectoryCols(db);
  const t = opts.now || now(), m = await findEvent(db, cand);
  const { key, year } = normEventName(cand.title), ck = cityKey(cand.city || "");
  const mode = ["online", "onsite", "hybrid"].includes(cand.mode) ? cand.mode : ck ? "onsite" : "online";
  if (m && m.confidence === "high") {
    if (opts.dry) return { action: "merged", id: m.id, reason: m.reason };
    const ev = await db.prepare("SELECT * FROM events WHERE id=?").bind(m.id).first(), x = CAND_TEXT(cand);
    const nu = { title: richer(ev.title, cand.title), summary: richer(ev.summary, x.summary), about: richer(ev.about, x.about), start: richerDate(ev.start, cand.start || ""), end: richerDate(ev.end, cand.end || ""),
      url: ev.url || cand.url || "", tickets_url: ev.tickets_url || cand.tickets_url || "", location: ev.location || cand.city || "", country: ev.country || cand.country || "", lang: ev.lang || cand.lang || "", organizer_name: ev.organizer_name || cand.organizer_name || "", mode: ev.mode !== "online" ? ev.mode : mode };
    // Titel: den ohne Jahr/Edition-Verlust behalten, der Besitzer-Eintrag (nicht herrenlos) hat Vorrang
    if (!ev.unclaimed) nu.title = ev.title;
    await db.prepare("UPDATE events SET title=?,summary=?,about=?,start=?,end=?,url=?,tickets_url=?,location=?,country=?,lang=?,organizer_name=?,mode=?,url_key=?,city_key=CASE WHEN city_key='' THEN ? ELSE city_key END,updated=? WHERE id=?")
      .bind(nu.title, nu.summary, nu.about, nu.start, nu.end, nu.url, nu.tickets_url, nu.location, nu.country, nu.lang, nu.organizer_name, nu.mode, normUrl(nu.url) || ev.url_key, ck, t, ev.id).run();
    for (const s of cand.sources || []) if (s.ref) await addSource(db, "event_source", ev.id, s.kind, s.ref, s.url || "", t);
    for (const o of m.others) if (o.confidence === "low") await queueDupe(db, "event", ev.id, o.id, o.reason, t);
    return { action: "merged", id: ev.id, reason: m.reason };
  }
  if (opts.dry) return { action: m ? "queued" : "created", id: m?.id || 0, reason: m?.reason || "" };
  if (String(cand.title || "").trim().length < 3) return { action: "skipped", reason: "bad_data" };
  const undated = !dateOk(cand.start);   // ohne Datum: verborgen anlegen, damit Name-Treffer ohne Datum in der Warteschlange landen koennen
  const handle = await freeHandle(db, cand.title, year), x = CAND_TEXT(cand), owner = opts.owner_id || 0, src = cand.source || "";
  const id = (await db.prepare("INSERT INTO events(handle,owner_id,org_id,title,summary,about,start,end,mode,location,country,url,tickets_url,free,lang,topics,seeking_sponsor,public,created,updated,source,source_url,url_key,name_key,city_key,unclaimed,organizer_name) VALUES(?,?,NULL,?,?,?,?,?,?,?,?,?,?,?,?,'[]',0,?,?,?,?,?,?,?,?,?,?)")
    .bind(handle, owner, String(cand.title).trim().slice(0, 120), x.summary, x.about, undated ? "" : cand.start, cand.end || "", mode, String(cand.city || "").slice(0, 120), String(cand.country || "").slice(0, 60), cand.url || "", cand.tickets_url || "", cand.free === false ? 0 : 1, String(cand.lang || "").slice(0, 10), undated ? 0 : 1, t, t,
      src, cand.source_url || "", normUrl(cand.url || cand.source_url || ""), key, ck, owner ? 0 : 1, String(cand.organizer_name || "").slice(0, 120)).run()).meta.last_row_id;
  if (cand.city) await db.prepare("UPDATE events SET city=? WHERE id=?").bind(String(cand.city).slice(0, 80), id).run().catch(() => 0);
  for (const s of cand.sources || []) if (s.ref) await addSource(db, "event_source", id, s.kind, s.ref, s.url || "", t);
  if (m) await queueDupe(db, "event", m.id, id, m.reason, t);   // unsicherer Treffer: beide bleiben, Admin entscheidet
  return { action: m ? "queued" : "created", id, handle, reason: m?.reason || "" };
}

export async function queueDupe(db, kind, a, b, reason, t = now()) {
  if (!a || !b || a === b) return false;
  const [x, y] = a < b ? [a, b] : [b, a];
  return Number((await db.prepare("INSERT OR IGNORE INTO dedupe_queue(kind,a_id,b_id,reason,created) VALUES(?,?,?,?,?)").bind(kind, x, y, reason, t).run()).meta?.changes || 0) === 1;
}

// ---------------------------------------------------------------- Speaker
const entryKey = (e) => (e.r ? "r" + e.r : e.h ? "h" + e.h : "n" + normPerson(e.n));
function unionSpeakers(a, b) {
  const out = [], at = new Map();
  const pos = (e) => { for (const k of [e.r ? "r" + e.r : "", e.h ? "h" + e.h : "", "n" + normPerson(e.n)]) if (k.length > 1 && at.has(k)) return at.get(k); return -1; };
  for (const e of [...a, ...b]) {
    const i = pos(e);
    if (i < 0) { out.push({ ...e }); const idx = out.length - 1; for (const k of [e.r ? "r" + e.r : "", e.h ? "h" + e.h : "", "n" + normPerson(e.n)]) if (k.length > 1) at.set(k, idx); continue; }
    const c = out[i];
    if ((RANK[e.s] || 0) > (RANK[c.s] || 0)) c.s = e.s;
    for (const f of ["h", "e", "r", "sz", "t"]) if (!c[f] && e[f]) c[f] = e[f];
    if (e.n && e.n.length > (c.n || "").length) c.n = e.n;
    if (c.h) { delete c.t; delete c.o; }   // verknuepfte Profile brauchen keinen Einladungslink
    for (const k of [e.r ? "r" + e.r : "", e.h ? "h" + e.h : ""]) if (k) at.set(k, i);
  }
  return out;
}
export { unionSpeakers };

// Identitaet eines Speakers: Sessionize-ID, gleicher Profil-Link oder gleicher Name mit gemeinsamem Event => dieselbe Person.
// cand: { n, sz, links:[url], tagline, bio, photo_src, h }. Ergebnis: ref-ID (neu oder vorhanden)
export async function resolveSpeakerRef(db, eventId, cand, opts = {}) {
  const t = opts.now || now(), nk = normPerson(cand.n), keys = [...new Set((cand.links || []).map(normLink).filter(Boolean))];
  let ref = null, via = "";
  if (cand.sz) { ref = await db.prepare("SELECT * FROM speaker_ref WHERE sessionize_id=? AND merged_into=0 ORDER BY id LIMIT 1").bind(String(cand.sz)).first(); via = "sessionize"; }
  if (!ref) for (const k of keys) { ref = await db.prepare("SELECT r.* FROM speaker_ref r WHERE r.merged_into=0 AND EXISTS (SELECT 1 FROM json_each(r.links) WHERE value=?) ORDER BY r.id LIMIT 1").bind(k).first(); if (ref) { via = "link"; break; } }
  let lowRefs = [];
  if (!ref && nk) {
    const same = (await db.prepare("SELECT * FROM speaker_ref WHERE name_key=? AND merged_into=0 ORDER BY id").bind(nk).all()).results || [];
    for (const r of same) {
      const co = eventId && (await db.prepare("SELECT 1 x FROM event_sessions s WHERE s.event_id=? AND s.speakers LIKE ? LIMIT 1").bind(eventId, `%"r":${r.id},%`).first() || await db.prepare("SELECT 1 x FROM event_sessions s WHERE s.event_id=? AND s.speakers LIKE ? LIMIT 1").bind(eventId, `%"r":${r.id}}%`).first());
      // widerspruechige Sessionize-IDs sind zwei verschiedene Personen
      if (cand.sz && r.sessionize_id && r.sessionize_id !== String(cand.sz)) continue;
      if (co && !ref) { ref = r; via = "name+event"; } else lowRefs.push(r);
    }
  }
  const links = (r) => parse(r.links, []);
  if (ref) {
    const l = [...new Set([...links(ref), ...keys])].slice(0, 12);
    await db.prepare("UPDATE speaker_ref SET name=?,sessionize_id=CASE WHEN sessionize_id='' THEN ? ELSE sessionize_id END,links=?,tagline=?,bio=?,photo_src=CASE WHEN photo_src='' THEN ? ELSE photo_src END,handle=CASE WHEN handle='' THEN ? ELSE handle END,updated=? WHERE id=?")
      .bind(richer(ref.name, cand.n), String(cand.sz || ""), JSON.stringify(l), richer(ref.tagline, String(cand.tagline || "").slice(0, 160)), richer(ref.bio, String(cand.bio || "").slice(0, 1500)), cand.photo_src || "", cand.h || "", t, ref.id).run();
    return { id: ref.id, via, created: false };
  }
  const id = (await db.prepare("INSERT INTO speaker_ref(name,name_key,sessionize_id,links,tagline,bio,photo_src,handle,created,updated) VALUES(?,?,?,?,?,?,?,?,?,?)")
    .bind(String(cand.n).slice(0, 80), nk, String(cand.sz || ""), JSON.stringify(keys.slice(0, 12)), String(cand.tagline || "").slice(0, 160), String(cand.bio || "").slice(0, 1500), cand.photo_src || "", cand.h || "", t, t).run()).meta.last_row_id;
  for (const r of lowRefs) await queueDupe(db, "speaker", r.id, id, "name_without_shared_event", t);   // gleicher Name, aber nirgends gemeinsam aufgetreten
  return { id, via: "new", created: true };
}

// ---------------------------------------------------------------- Sessions
function sessionMatch(a, b) {   // a, b: { title_key, sessionize_id, start, end }  ->  high | low | null
  if (a.sessionize_id && b.sessionize_id) return a.sessionize_id === b.sessionize_id ? "high" : null;   // verschiedene Sessionize-IDs sind verschiedene Sessions
  const ov = overlaps(a.start, a.end, b.start, b.end);
  if (a.title_key && a.title_key === b.title_key) return ov === false ? null : "high";
  if (a.title_key && b.title_key && ov !== false && jaccard(a.title_key, b.title_key) >= 0.8) return "low";
  return null;
}
export async function findSession(db, eventId, cand, excludeId = 0) {
  const tk = normSessionTitle(cand.title);
  let rows = (await db.prepare("SELECT * FROM event_sessions WHERE event_id=? AND merged_into=0").bind(eventId).all()).results || [];
  const probe = { title_key: tk, sessionize_id: String(cand.sessionize_id || ""), start: cand.start || "", end: cand.end || "" };
  const out = [];
  for (const r of rows) { if (r.id === excludeId) continue; const c = sessionMatch(probe, r); if (c) out.push({ id: r.id, confidence: c, row: r }); }
  out.sort((x, y) => (x.confidence === y.confidence ? 0 : x.confidence === "high" ? -1 : 1) || x.id - y.id);
  return out;
}
// Speakers einer Session herstellen: Kandidaten -> Eintraege im speakers-JSON (mit Einladungslink fuer Personen ohne Profil, ohne Mail)
async function buildSpeakers(db, eventId, list, opts) {
  const out = [];
  for (const c of (list || []).slice(0, 12)) {
    if (!c || String(c.n || "").trim().length < 2) continue;
    const ref = await resolveSpeakerRef(db, eventId, c, opts);
    const e = { n: String(c.n).trim().slice(0, 80), r: ref.id, s: c.s || "confirmed" };
    if (c.sz) e.sz = String(c.sz);
    if (c.h) e.h = c.h;
    const r = await db.prepare("SELECT handle FROM speaker_ref WHERE id=?").bind(ref.id).first();
    if (!e.h && r?.handle) e.h = r.handle;
    if (!e.h && e.n.length >= 3) {   // eindeutiges oeffentliches Profil mit diesem Namen: verknuepfen, die Person bestaetigt selbst
      const mm = (await db.prepare("SELECT p.handle FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.public=1 AND p.handle IS NOT NULL AND lower(u.name)=lower(?) LIMIT 2").bind(e.n).all()).results || [];
      if (mm.length === 1) { e.h = mm[0].handle; e.s = "invited"; }
    }
    if (e.h && !c.s) e.s = e.s === "confirmed" && !opts.trusted ? "invited" : e.s;
    if (!e.h) e.o = 1;
    out.push(e);
  }
  return out;
}
async function saveInviteRows(db, eventId, sid, sp) {
  await db.prepare("DELETE FROM speaker_invites WHERE session_id=? AND token NOT IN (SELECT value FROM json_each(?))").bind(sid, JSON.stringify(sp.filter((x) => x.t && !x.h).map((x) => x.t))).run();
  for (const x of sp) {
    if (x.h || !x.t) continue;
    await db.prepare("INSERT OR IGNORE INTO speaker_invites(token,event_id,session_id,name,eid,created) VALUES(?,?,?,?,?,?)").bind(x.t, eventId, sid, x.n, x.e || "", now()).run();
  }
}
// Session anlegen oder mit dem sicheren Treffer zusammenfuehren (Speaker werden vereinigt). source: {kind, ref, url}
export async function upsertSession(db, eventId, cand, source, opts = {}) {
  const t = opts.now || now(), tk = normSessionTitle(cand.title), matches = await findSession(db, eventId, cand);
  const high = matches.find((m) => m.confidence === "high");
  const speakers = opts.dry ? [] : await buildSpeakers(db, eventId, cand.speakers, opts);
  if (opts.dry) return { action: high ? "merged" : "created", id: high?.id || 0 };
  const status = opts.status || "live";
  if (high) {
    const s = high.row, merged = unionSpeakers(parse(s.speakers, []), speakers);
    for (const x of merged) if (!x.h && !x.t) x.t = rndToken();
    const f = { abstract: richer(s.abstract, String(cand.abstract || "").slice(0, 1500)), start: s.start || cand.start || "", end: s.end || cand.end || "", room: s.room || String(cand.room || "").slice(0, 60), track: s.track || String(cand.track || "").slice(0, 60), lang: s.lang || String(cand.lang || "").slice(0, 10), recording_url: s.recording_url || cand.recording_url || "" };
    await db.prepare("UPDATE event_sessions SET abstract=?,start=?,end=?,room=?,track=?,lang=?,recording_url=?,speakers=?,sessionize_id=CASE WHEN sessionize_id='' THEN ? ELSE sessionize_id END,title_key=? WHERE id=?")
      .bind(f.abstract, f.start, f.end, f.room, f.track, f.lang, f.recording_url, JSON.stringify(merged), String(cand.sessionize_id || ""), tk, s.id).run();
    if (s.status === "retired" && status === "live") await db.prepare("UPDATE event_sessions SET status='live' WHERE id=?").bind(s.id).run();
    await saveInviteRows(db, eventId, s.id, merged);
    if (source?.ref) await addSource(db, "session_source", s.id, source.kind, source.ref, source.url || "", t);
    for (const m of matches) if (m.confidence === "low") await queueDupe(db, "session", s.id, m.id, "similar_title", t);
    return { action: "merged", id: s.id };
  }
  for (const x of speakers) if (!x.h) x.t = rndToken();
  const id = (await db.prepare("INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created,title_key,sessionize_id) VALUES(?,?,?,?,?,?,?,'',?,?,?,?,?,?,?,?,?)")
    .bind(eventId, String(cand.title).trim().slice(0, 140), String(cand.abstract || "").slice(0, 1500), cand.start || "", cand.end || "", String(cand.room || "").slice(0, 60), String(cand.track || "").slice(0, 60), String(cand.lang || "").slice(0, 10), "[]", JSON.stringify(speakers), cand.recording_url || "", status, opts.proposer_id || 0, t, tk, String(cand.sessionize_id || "")).run()).meta.last_row_id;
  await saveInviteRows(db, eventId, id, speakers);
  if (source?.ref) await addSource(db, "session_source", id, source.kind, source.ref, source.url || "", t);
  for (const m of matches) if (m.confidence === "low") await queueDupe(db, "session", m.id, id, "similar_title", t);
  return { action: "created", id };
}

// ---------------------------------------------------------------- Zusammenfuehren (umkehrbar)
async function log(db, kind, from, into, snapshot, auto, by) {
  return (await db.prepare("INSERT INTO merge_log(kind,from_id,into_id,snapshot,auto,by_user,created) VALUES(?,?,?,?,?,?,?)").bind(kind, from, into, JSON.stringify(snapshot), auto ? 1 : 0, by || 0, now()).run()).meta.last_row_id;
}
export async function mergeSessions(db, fromId, intoId, by = 0, auto = false) {
  const a = await db.prepare("SELECT * FROM event_sessions WHERE id=? AND merged_into=0").bind(fromId).first(), b = await db.prepare("SELECT * FROM event_sessions WHERE id=? AND merged_into=0").bind(intoId).first();
  if (!a || !b || a.id === b.id) return { error: "not_found" };
  const merged = unionSpeakers(parse(b.speakers, []), parse(a.speakers, []));
  const nu = { abstract: richer(b.abstract, a.abstract), start: b.start || a.start, end: b.end || a.end, room: b.room || a.room, track: b.track || a.track, level: b.level || a.level, lang: b.lang || a.lang, recording_url: b.recording_url || a.recording_url, sessionize_id: b.sessionize_id || a.sessionize_id };
  const srcs = (await db.prepare("SELECT kind,ref,url FROM session_source WHERE session_id=?").bind(a.id).all()).results || [], added = [];
  for (const s of srcs) { if (!(await db.prepare("SELECT 1 x FROM session_source WHERE session_id=? AND kind=? AND ref=?").bind(b.id, s.kind, s.ref).first())) { added.push(s); await addSource(db, "session_source", b.id, s.kind, s.ref, s.url); } }
  const inv = (await db.prepare("SELECT token FROM speaker_invites WHERE session_id=?").bind(a.id).all()).results || [];
  const snap = { into_before: { abstract: b.abstract, start: b.start, end: b.end, room: b.room, track: b.track, level: b.level, lang: b.lang, recording_url: b.recording_url, sessionize_id: b.sessionize_id, speakers: b.speakers }, from_status: a.status, from_speakers: a.speakers, added_sources: added, invites: inv.map((x) => x.token), after_speakers: JSON.stringify(merged) };
  await db.prepare("UPDATE event_sessions SET abstract=?,start=?,end=?,room=?,track=?,level=?,lang=?,recording_url=?,sessionize_id=?,speakers=? WHERE id=?").bind(nu.abstract, nu.start, nu.end, nu.room, nu.track, nu.level, nu.lang, nu.recording_url, nu.sessionize_id, JSON.stringify(merged), b.id).run();
  await db.prepare("UPDATE speaker_invites SET session_id=? WHERE session_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE event_sessions SET merged_into=?,status='merged' WHERE id=?").bind(b.id, a.id).run();
  return { ok: true, log: await log(db, "session", a.id, b.id, snap, auto, by) };
}
export async function mergeEvents(db, fromId, intoId, by = 0, auto = false) {
  const a = await db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(fromId).first(), b = await db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(intoId).first();
  if (!a || !b || a.id === b.id) return { error: "not_found" };
  const nu = { summary: richer(b.summary, a.summary), about: richer(b.about, a.about), start: richerDate(b.start, a.start), end: richerDate(b.end, a.end), url: b.url || a.url, tickets_url: b.tickets_url || a.tickets_url, location: b.location || a.location, country: b.country || a.country, lang: b.lang || a.lang, organizer_name: b.organizer_name || a.organizer_name, city_key: b.city_key || a.city_key, url_key: b.url_key || a.url_key, name_key: b.name_key || a.name_key };
  const snap = { into_before: Object.fromEntries(Object.keys(nu).map((k) => [k, b[k]])), from_public: a.public, sessions: [], attendees: [], partners: [], roles: [], added_sources: [] };
  for (const s of (await db.prepare("SELECT kind,ref,url FROM event_source WHERE event_id=?").bind(a.id).all()).results || []) if (!(await db.prepare("SELECT 1 x FROM event_source WHERE event_id=? AND kind=? AND ref=?").bind(b.id, s.kind, s.ref).first())) { snap.added_sources.push(s); await addSource(db, "event_source", b.id, s.kind, s.ref, s.url); }
  snap.sessions = ((await db.prepare("SELECT id FROM event_sessions WHERE event_id=?").bind(a.id).all()).results || []).map((x) => x.id);
  snap.attendees = ((await db.prepare("SELECT user_id FROM event_attendees WHERE event_id=? AND user_id NOT IN (SELECT user_id FROM event_attendees WHERE event_id=?)").bind(a.id, b.id).all()).results || []).map((x) => x.user_id);
  snap.partners = ((await db.prepare("SELECT org_id FROM event_partners WHERE event_id=? AND org_id NOT IN (SELECT org_id FROM event_partners WHERE event_id=?)").bind(a.id, b.id).all()).results || []).map((x) => x.org_id);
  snap.roles = ((await db.prepare("SELECT user_id FROM event_roles WHERE event_id=? AND user_id NOT IN (SELECT user_id FROM event_roles WHERE event_id=?)").bind(a.id, b.id).all()).results || []).map((x) => x.user_id);
  await db.prepare("UPDATE events SET summary=?,about=?,start=?,end=?,url=?,tickets_url=?,location=?,country=?,lang=?,organizer_name=?,city_key=?,url_key=?,name_key=?,updated=? WHERE id=?").bind(nu.summary, nu.about, nu.start, nu.end, nu.url, nu.tickets_url, nu.location, nu.country, nu.lang, nu.organizer_name, nu.city_key, nu.url_key, nu.name_key, now(), b.id).run();
  await db.prepare("UPDATE event_sessions SET event_id=? WHERE event_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE speaker_invites SET event_id=? WHERE event_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE OR IGNORE event_attendees SET event_id=? WHERE event_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE OR IGNORE event_partners SET event_id=? WHERE event_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE OR IGNORE event_roles SET event_id=? WHERE event_id=?").bind(b.id, a.id).run();
  await db.prepare("UPDATE events SET merged_into=?,public=0 WHERE id=?").bind(b.id, a.id).run();
  const id = await log(db, "event", a.id, b.id, snap, auto, by);
  await dedupeEventSessions(db, b.id, by);
  return { ok: true, log: id };
}
// Doppelte Sessions innerhalb eines Events: sichere Treffer vereinigen, unsichere in die Warteschlange
export async function dedupeEventSessions(db, eventId, by = 0) {
  let merged = 0, queued = 0;
  for (;;) {
    const rows = (await db.prepare("SELECT * FROM event_sessions WHERE event_id=? AND merged_into=0 ORDER BY id").bind(eventId).all()).results || [];
    let did = false;
    outer: for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      const c = sessionMatch(rows[i], rows[j]); if (!c) continue;
      if (c === "high") { const r = await mergeSessions(db, rows[j].id, rows[i].id, by, true); if (r.ok) { merged++; did = true; break outer; } }
      else if (await queueDupe(db, "session", rows[i].id, rows[j].id, "similar_title")) queued++;
    }
    if (!did) break;
  }
  return { merged, queued };
}
export async function mergeSpeakerRefs(db, fromId, intoId, by = 0, auto = false) {
  const a = await db.prepare("SELECT * FROM speaker_ref WHERE id=? AND merged_into=0").bind(fromId).first(), b = await db.prepare("SELECT * FROM speaker_ref WHERE id=? AND merged_into=0").bind(intoId).first();
  if (!a || !b || a.id === b.id) return { error: "not_found" };
  const links = [...new Set([...parse(b.links, []), ...parse(a.links, [])])].slice(0, 12), sessions = [];
  const rows = (await db.prepare("SELECT id,speakers FROM event_sessions WHERE speakers LIKE ? OR speakers LIKE ?").bind(`%"r":${a.id},%`, `%"r":${a.id}}%`).all()).results || [];
  for (const s of rows) {
    const sp = parse(s.speakers, []); if (!sp.some((x) => x.r === a.id)) continue;
    const next = unionSpeakers(sp.filter((x) => x.r !== a.id && x.r !== b.id), [...sp.filter((x) => x.r === b.id), ...sp.filter((x) => x.r === a.id).map((x) => ({ ...x, r: b.id }))]);
    // Reihenfolge der Speaker beibehalten: nach Position des ersten Treffers
    const ord = sp.map((x) => (x.r === a.id ? b.id : x.r)), pos = (x) => { const i = ord.indexOf(x.r); return i < 0 ? 999 : i; };
    next.sort((x, y) => pos(x) - pos(y));
    sessions.push({ id: s.id, before: s.speakers, after: JSON.stringify(next) });
    await db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(next), s.id).run();
  }
  await db.prepare("UPDATE speaker_ref SET links=?,tagline=?,bio=?,photo=CASE WHEN photo='' THEN ? ELSE photo END,photo_src=CASE WHEN photo_src='' THEN ? ELSE photo_src END,sessionize_id=CASE WHEN sessionize_id='' THEN ? ELSE sessionize_id END,handle=CASE WHEN handle='' THEN ? ELSE handle END,name=?,updated=? WHERE id=?")
    .bind(JSON.stringify(links), richer(b.tagline, a.tagline), richer(b.bio, a.bio), a.photo, a.photo_src, a.sessionize_id, a.handle, richer(b.name, a.name), now(), b.id).run();
  await db.prepare("UPDATE speaker_ref SET merged_into=? WHERE id=?").bind(b.id, a.id).run();
  return { ok: true, log: await log(db, "speaker", a.id, b.id, { into_before: { links: b.links, tagline: b.tagline, bio: b.bio, photo: b.photo, photo_src: b.photo_src, sessionize_id: b.sessionize_id, handle: b.handle, name: b.name }, sessions }, auto, by) };
}
// Zusammenfuehrung rueckgaengig machen (nur wenn noch nicht zurueckgenommen)
export async function unmerge(db, logId, by = 0) {
  const l = await db.prepare("SELECT * FROM merge_log WHERE id=? AND undone=0").bind(logId).first(); if (!l) return { error: "not_found" };
  const s = parse(l.snapshot, {});
  if (l.kind === "session") {
    const b = s.into_before || {};
    await db.prepare("UPDATE event_sessions SET abstract=?,start=?,end=?,room=?,track=?,level=?,lang=?,recording_url=?,sessionize_id=?,speakers=? WHERE id=?").bind(b.abstract, b.start, b.end, b.room, b.track, b.level, b.lang, b.recording_url, b.sessionize_id, b.speakers, l.into_id).run();
    await db.prepare("UPDATE event_sessions SET merged_into=0,status=? WHERE id=?").bind(s.from_status || "live", l.from_id).run();
    for (const x of s.added_sources || []) await db.prepare("DELETE FROM session_source WHERE session_id=? AND kind=? AND ref=?").bind(l.into_id, x.kind, x.ref).run();
    for (const tok of s.invites || []) await db.prepare("UPDATE speaker_invites SET session_id=? WHERE token=?").bind(l.from_id, tok).run();
  } else if (l.kind === "event") {
    const b = s.into_before || {}, cols = Object.keys(b);
    if (cols.length) await db.prepare(`UPDATE events SET ${cols.map((c) => c + "=?").join(",")} WHERE id=?`).bind(...cols.map((c) => b[c]), l.into_id).run();
    await db.prepare("UPDATE events SET merged_into=0,public=? WHERE id=?").bind(s.from_public ?? 1, l.from_id).run();
    for (const id of s.sessions || []) { await db.prepare("UPDATE event_sessions SET event_id=? WHERE id=? AND event_id=?").bind(l.from_id, id, l.into_id).run(); await db.prepare("UPDATE speaker_invites SET event_id=? WHERE session_id=?").bind(l.from_id, id).run(); }
    for (const u of s.attendees || []) await db.prepare("UPDATE OR IGNORE event_attendees SET event_id=? WHERE event_id=? AND user_id=?").bind(l.from_id, l.into_id, u).run();
    for (const o of s.partners || []) await db.prepare("UPDATE OR IGNORE event_partners SET event_id=? WHERE event_id=? AND org_id=?").bind(l.from_id, l.into_id, o).run();
    for (const u of s.roles || []) await db.prepare("UPDATE OR IGNORE event_roles SET event_id=? WHERE event_id=? AND user_id=?").bind(l.from_id, l.into_id, u).run();
    for (const x of s.added_sources || []) await db.prepare("DELETE FROM event_source WHERE event_id=? AND kind=? AND ref=?").bind(l.into_id, x.kind, x.ref).run();
  } else if (l.kind === "speaker") {
    const b = s.into_before || {};
    await db.prepare("UPDATE speaker_ref SET links=?,tagline=?,bio=?,photo=?,photo_src=?,sessionize_id=?,handle=?,name=? WHERE id=?").bind(b.links, b.tagline, b.bio, b.photo, b.photo_src, b.sessionize_id, b.handle, b.name, l.into_id).run();
    await db.prepare("UPDATE speaker_ref SET merged_into=0 WHERE id=?").bind(l.from_id).run();
    for (const x of s.sessions || []) await db.prepare("UPDATE event_sessions SET speakers=? WHERE id=? AND speakers=?").bind(x.before, x.id, x.after).run();
  } else return { error: "bad_kind" };
  await db.prepare("UPDATE merge_log SET undone=1 WHERE id=?").bind(l.id).run();
  // Eine Rueckgabe soll nicht sofort wieder automatisch zusammengefuehrt werden: als "getrennt" vormerken
  const [x, y] = l.from_id < l.into_id ? [l.from_id, l.into_id] : [l.into_id, l.from_id];
  await db.prepare("INSERT INTO dedupe_queue(kind,a_id,b_id,reason,status,created,decided,decided_by) VALUES(?,?,?,'unmerged','separate',?,?,?) ON CONFLICT(kind,a_id,b_id) DO UPDATE SET status='separate',decided=excluded.decided,decided_by=excluded.decided_by").bind(l.kind, x, y, now(), now(), by).run();
  return { ok: true, kind: l.kind };
}
// Entscheidung in der Warteschlange: "merge" fuehrt zusammen, "separate" merkt sich "getrennt lassen"
export async function decideDupe(db, id, action, by) {
  const q = await db.prepare("SELECT * FROM dedupe_queue WHERE id=? AND status='open'").bind(id).first(); if (!q) return { error: "not_found" };
  if (action === "separate") { await db.prepare("UPDATE dedupe_queue SET status='separate',decided=?,decided_by=? WHERE id=?").bind(now(), by, id).run(); return { ok: true, status: "separate" }; }
  if (action !== "merge") return { error: "bad_action" };
  let r;
  if (q.kind === "event") {
    const a = await db.prepare("SELECT * FROM events WHERE id=?").bind(q.a_id).first(), b = await db.prepare("SELECT * FROM events WHERE id=?").bind(q.b_id).first();
    if (!a || !b) return { error: "not_found" };
    const into = a.unclaimed && !b.unclaimed ? b : b.unclaimed && !a.unclaimed ? a : a.id < b.id ? a : b, from = into === a ? b : a;
    r = await mergeEvents(db, from.id, into.id, by);
  } else if (q.kind === "session") r = await mergeSessions(db, q.b_id, q.a_id, by);
  else r = await mergeSpeakerRefs(db, q.b_id, q.a_id, by);
  if (r.error) return r;
  await db.prepare("UPDATE dedupe_queue SET status='merged',decided=?,decided_by=? WHERE id=?").bind(now(), by, id).run();
  return { ok: true, status: "merged", log: r.log };
}
export async function listDupes(db) {
  const rows = (await db.prepare("SELECT * FROM dedupe_queue WHERE status='open' ORDER BY id LIMIT 100").all()).results || [], out = [];
  for (const q of rows) {
    const side = async (id) => q.kind === "event" ? await db.prepare("SELECT id,handle,title,start,city,mode,source,unclaimed FROM events WHERE id=?").bind(id).first()
      : q.kind === "session" ? await db.prepare("SELECT s.id,s.title,s.start,s.room,e.title event,e.handle FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.id=?").bind(id).first()
      : await db.prepare("SELECT id,name,tagline,sessionize_id FROM speaker_ref WHERE id=?").bind(id).first();
    out.push({ id: q.id, kind: q.kind, reason: q.reason, a: await side(q.a_id), b: await side(q.b_id) });
  }
  return out;
}
