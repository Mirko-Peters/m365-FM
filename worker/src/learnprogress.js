// Lernfortschritt im Lernpfad (Plan v2, Mirkos Entscheidungen 26.11.2026): gelesene Leitfaden (g) und Vertiefungen (c), Lesestelle und geoeffnete
// Lernpfad-Videos (v) je Nutzer und Pfad in D1 (learn_progress, Migration 0056). Die Seite (assets/learnprogress.js) ruft das erst nach dem Opt-in
// "Lernfortschritt speichern" auf; vorher gibt es keinen Request. Eingehaengt in handleLearnQuiz (learnquiz.js), Route /api/learn/progress.
//   GET    /api/learn/progress?path=<pfad>   Login; Stand {uid, ep, updated, now, state}. Ohne Zeile: ep 0, updated 0, leerer Stand. 1 Lesen.
//   POST   /api/learn/progress  {path, u, ep, init, set, unset, vid, pos}   Login; Aenderungen zusammenfuehren (Vereinigung), Antwort wie GET.
//          u = Konto-ID, fuer die der Client sammelt: ungleich dem angemeldeten Konto -> 409 {error:"uid"} mit dem Stand dieses Kontos, ohne Schreiben
//          (gemeinsames Geraet: im selben Tab ab- und als anderes Konto angemeldet). Ohne u (Gaststand, init:1) entfaellt die Pruefung.
//          Body hoechstens LP_MAX_BODY Bytes (413). Falsche Eintraege werden still verworfen (kein 400), damit ein Ausreisser den Abgleich nicht blockiert.
//          ep des Clients ungleich ep der Zeile und init nicht 1 -> 409 mit dem Serverstand, ohne Schreiben (Zuruecksetzen auf einem anderen Geraet).
//          Keine Aenderung -> kein Schreiben. Schreiben mit optimistischer Sperre auf updated; bei Konflikt einmal neu lesen, sonst 503.
//   DELETE /api/learn/progress?path=<pfad>&u=<konto>   Login; Zuruecksetzen/Abschalten: leerer Stand, neue Epoche ep (Serversekunden). 1 Schreiben.
//          u ungleich dem angemeldeten Konto -> 409 {error:"uid"} ohne Schreiben (1 Lesen). Die Zeile bleibt als leerer Stand mit ep, damit andere Geraete
//          das Zuruecksetzen beim naechsten Abgleich (409 ep) uebernehmen; sie verschwindet mit dem Konto oder nach 24 Monaten ohne Aenderung.
// Alle Zeiten setzt der Server: der Client sendet nur relative Alter (age in Sekunden), absolute Zeitfelder vom Client werden ignoriert.
// Schalter: Var LEARN_PROGRESS_SYNC = "1" (wrangler.toml, live und staging); sonst 404 {error:"off"} vor jeder D1-Abfrage dieses Handlers (index.js liest fuer
// Angemeldete vorher schon die Sitzung, 1-2 Zeilen; der Client merkt sich 404 je Tab), die Seite arbeitet nur lokal.
// Ratenlimit LP_RL je Nutzer: Bindung RL_LEARN (Workers Rate Limiting, kein D1), ohne Bindung (Staging, Tests) D1-Tabelle ratelimit ("learnp:" in RL_SHORT).
// Konto: deleteUserLearn (learnquiz.js) loescht die Zeilen; mergeStatements (identities.js) vereinigt sie mit mergeLearnProgress (gleicher Pfad in beiden
// Konten: gelesen/geoeffnet per ODER, juengste Lesestelle) und uebernimmt die uebrigen mit keepT. Aufraeumen: purgeLearnProgress.
import { cleanText, rateLimit } from "./util.js";

export const LP_MAX_BODY = 16384;          // Bytes je POST
export const LP_MAX_STATE = 24576;         // Bytes des gespeicherten JSON; darueber fallen zuerst die aeltesten Anker/Titel weg
export const LP_MAX = { g: 60, c: 60, v: 100 };              // Eintraege im Stand (neue Eintraege ueber der Grenze werden verworfen)
export const LP_LIST = { set: 120, unset: 120, vid: 100, pos: 60 };   // Eintraege je POST (Rest wird verworfen)
export const LP_AGE_MAX = 30 * 86400;      // age wird auf 0 ... 30 Tage gekappt
export const LP_RL = { max: 30, win: 60 };  // Anfragen je Nutzer und Fenster (Sekunden)
export const LP_KEEP_MS = 730 * 86400 * 1000;   // 24 Monate ohne Aenderung, dann loescht purgeLearnProgress die Zeile
// Gleich wie PATH_RX in learnquiz.js und VID in index.js (worker/test/learnprogress.test.mjs prueft den Gleichlauf am Quelltext)
export const LP_ID_RX = /^[a-z0-9][a-z0-9-]{1,60}$/;
export const LP_VID_RX = /^[A-Za-z0-9_-]{5,24}$/;
// Anker (Ueberschrift-IDs aus site_pillars.slugify, Unicode \w, Dubletten -n): bis 160 Zeichen; ungueltig -> Lesestelle ohne Anker
export const LP_ANCHOR_RX = /^[\p{L}\p{N}\p{M}_-]{1,160}$/u;
export const LP_LANG_RX = /^(en|de|fr|es|it|nl|pt|pl|id|ru|uk|ar|he|ja|ko)$/;
const KINDS = ["g", "c"];

const nowS = () => Math.floor(Date.now() / 1000);
const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
const list = (x, n) => (Array.isArray(x) ? x.slice(0, n) : []);
const int = (x) => (typeof x === "number" && Number.isFinite(x) ? Math.round(x) : typeof x === "string" && /^-?\d{1,12}$/.test(x) ? Number(x) : null);
export const cleanAge = (x) => { const n = int(x); return n === null ? 0 : Math.min(LP_AGE_MAX, Math.max(0, n)); };
export const cleanAnchor = (x) => (typeof x === "string" && LP_ANCHOR_RX.test(x) ? x : "");
// Titel: auf 80 Zeichen nach Codepunkten gekappt (kein halbes Emoji)
export const cleanHeading = (x) => (typeof x === "string" ? Array.from(cleanText(x, 200).replace(/[<>]/g, "").replace(/\s+/g, " ").trim()).slice(0, 80).join("") : "");

// Gespeicherten bzw. zurueckgegebenen Stand normalisieren: nur bekannte Felder mit gueltigen Werten (alte oder kaputte Zeilen werden so bereinigt)
function cleanEntry(e) {
  if (!isObj(e)) return null;
  const o = { r: e.r === 1 ? 1 : 0 };
  const rt = int(e.rt), at = int(e.at), pc = int(e.pc);
  if (rt !== null && rt > 0) o.rt = rt;
  const a = cleanAnchor(e.a), h = cleanHeading(e.h);
  if (a) o.a = a;
  if (h) o.h = h;
  if (typeof e.l === "string" && LP_LANG_RX.test(e.l)) o.l = e.l;
  if (pc !== null && pc >= 0 && pc <= 100) o.pc = pc;
  if (at !== null && at > 0) o.at = at;
  return o;
}
export function normState(s) {
  const src = isObj(s) ? s : {}, out = { g: {}, c: {}, v: {} };
  for (const k of KINDS) {
    if (!isObj(src[k])) continue;
    for (const [id, e] of Object.entries(src[k])) {
      if (Object.keys(out[k]).length >= LP_MAX[k]) break;
      const ce = LP_ID_RX.test(id) ? cleanEntry(e) : null;
      if (ce) out[k][id] = ce;
    }
  }
  if (isObj(src.v)) for (const [id, t] of Object.entries(src.v)) {
    if (Object.keys(out.v).length >= LP_MAX.v) break;
    const n = int(t);
    if (LP_VID_RX.test(id) && n !== null && n > 0) out.v[id] = n;
  }
  return out;
}
const parseState = (txt) => { try { return normState(JSON.parse(txt || "{}")); } catch { return normState({}); } };
// Gespeichert wird kompakt (leere Bereiche fallen weg); zurueckgegeben immer mit g, c und v
const packState = (s) => JSON.stringify(Object.fromEntries(Object.entries(s).filter(([, m]) => Object.keys(m).length)));
const bytes = (s) => new TextEncoder().encode(s).length;

// Aenderungen des Clients auf den Stand anwenden (t = Serversekunden). Ergebnis: neuer Stand (das Original bleibt unveraendert)
export function applyChanges(state, body, t = nowS()) {
  const s = normState(JSON.parse(JSON.stringify(state)));
  const pair = (p) => (Array.isArray(p) && KINDS.includes(p[0]) && typeof p[1] === "string" && LP_ID_RX.test(p[1]) ? [p[0], p[1]] : null);
  const slot = (k, id) => {   // Eintrag holen oder anlegen (null: Grenze erreicht)
    if (s[k][id]) return s[k][id];
    if (Object.keys(s[k]).length >= LP_MAX[k]) return null;
    return (s[k][id] = { r: 0 });
  };
  const unset = new Set(list(body.unset, LP_LIST.unset).map(pair).filter(Boolean).map((p) => p.join(":")));
  for (const p of list(body.set, LP_LIST.set).map(pair).filter(Boolean)) {
    if (unset.has(p.join(":"))) continue;   // steht ein Eintrag in set und unset, gilt unset (ausdrueckliche Nutzeraktion)
    const e = slot(p[0], p[1]);
    if (e && e.r !== 1) { e.r = 1; e.rt = t; }
  }
  for (const key of unset) {
    const [k, id] = key.split(":"), e = s[k][id];
    if (e && e.r === 1) { e.r = 0; e.rt = t; }
  }
  for (const v of list(body.vid, LP_LIST.vid)) {
    if (typeof v !== "string" || !LP_VID_RX.test(v) || s.v[v]) continue;
    if (Object.keys(s.v).length >= LP_MAX.v) break;
    s.v[v] = t;
  }
  for (const p of list(body.pos, LP_LIST.pos)) {
    if (!isObj(p) || !KINDS.includes(p.k) || typeof p.id !== "string" || !LP_ID_RX.test(p.id)) continue;
    const at = t - cleanAge(p.age);   // juengste Lesestelle nach Serverzeit; at/t/rt vom Client werden nie gelesen
    const old = s[p.k][p.id];
    if (old && old.at && old.at >= at) continue;
    const e = slot(p.k, p.id);
    if (!e) continue;
    delete e.a; delete e.h; delete e.l; delete e.pc;
    const a = cleanAnchor(p.a), h = cleanHeading(p.h), pc = int(p.pc);
    if (a) e.a = a;
    if (h) e.h = h;
    if (typeof p.l === "string" && LP_LANG_RX.test(p.l)) e.l = p.l;
    if (pc !== null && pc >= 0 && pc <= 100) e.pc = pc;
    e.at = at;
  }
  return fitState(s);
}

// Groesse: zuerst die aeltesten Anker und Titel streichen
function fitState(s) {
  if (bytes(packState(s)) > LP_MAX_STATE) {
    const ents = KINDS.flatMap((k) => Object.values(s[k])).filter((e) => e.a || e.h).sort((x, y) => (x.at || 0) - (y.at || 0));
    for (const e of ents) { delete e.a; delete e.h; if (bytes(packState(s)) <= LP_MAX_STATE) break; }
  }
  return s;
}

// Zwei Staende vereinigen (Konten zusammenfuehren): a = Zielkonto T, b = Quellkonto S. gelesen und geoeffnet per ODER (Mirkos Regel 3b),
// Lesestelle: die juengere nach Serverzeit (at), Video: fruehester Zeitpunkt. Grenzen wie beim Schreiben (LP_MAX, LP_MAX_STATE).
export function unionState(a, b) {
  const s = normState(JSON.parse(JSON.stringify(normState(a)))), o = normState(b);
  for (const k of KINDS) for (const [id, e] of Object.entries(o[k])) {
    const x = s[k][id];
    if (!x) { if (Object.keys(s[k]).length < LP_MAX[k]) s[k][id] = { ...e }; continue; }
    if (e.r === 1 && x.r !== 1) { x.r = 1; if (e.rt) x.rt = e.rt; }
    if ((e.at || 0) > (x.at || 0)) { for (const f of ["a", "h", "l", "pc"]) delete x[f]; for (const f of ["a", "h", "l", "pc", "at"]) if (e[f] !== undefined) x[f] = e[f]; }
  }
  for (const [v, t] of Object.entries(o.v)) {
    if (s.v[v]) { s.v[v] = Math.min(s.v[v], t); continue; }
    if (Object.keys(s.v).length < LP_MAX.v) s.v[v] = t;
  }
  return fitState(s);
}

// Statements fuer mergeStatements (identities.js), vor keepT("learn_progress"): hat T fuer einen Pfad schon eine Zeile, bekommt sie die Vereinigung
// mit der Zeile von S (ep von T bleibt). Pfade nur bei S uebernimmt danach keepT. 1 Lesen (beide Konten), 1 Schreiben je gemeinsamem Pfad mit Aenderung.
export async function mergeLearnProgress(db, S, T) {
  let rows = [];
  try { rows = (await db.prepare("SELECT user_id,path,state,updated FROM learn_progress WHERE user_id IN (?,?)").bind(S, T).all())?.results || []; }
  catch { return []; }   // Tabelle fehlt (alte Testdatenbank): wie bisher nur keepT
  const by = (u) => new Map(rows.filter((r) => Number(r.user_id) === Number(u)).map((r) => [r.path, r]));
  const sm = by(S), tm = by(T), st = [];
  for (const [path, tr] of tm) {
    const sr = sm.get(path);
    if (!sr) continue;
    const before = parseState(tr.state), after = unionState(before, parseState(sr.state)), txt = packState(after);
    if (txt === packState(before)) continue;
    st.push(db.prepare("UPDATE learn_progress SET state=?, updated=? WHERE user_id=? AND path=?").bind(txt, Math.max(Date.now(), (Number(tr.updated) || 0) + 1), T, path));
  }
  return st;
}

async function allowed(env, uid) {
  if (env.RL_LEARN && typeof env.RL_LEARN.limit === "function") {
    try { return !!(await env.RL_LEARN.limit({ key: `learnp:${uid}` })).success; }
    catch (error) { console.warn("RL_LEARN nicht erreichbar, D1-Ratenlimit:", String(error?.message || error)); }
  }
  return rateLimit(env.DB, "learnp:" + uid, 30, 60);   // = LP_RL (Literal: worker/test/cron_schedule.test.mjs liest das Fenster aus dem Quelltext)
}

// Body mit Obergrenze lesen: null = zu gross
async function readCapped(request, max) {
  if (!request.body) return "";
  const reader = request.body.getReader(), parts = [];
  let n = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.byteLength;
    if (n > max) { await reader.cancel().catch(() => 0); return null; }
    parts.push(value);
  }
  const all = new Uint8Array(n);
  let o = 0;
  for (const p of parts) { all.set(p, o); o += p.byteLength; }
  return new TextDecoder().decode(all);
}

const readRow = (db, uid, path) => db.prepare("SELECT state,ep,updated FROM learn_progress WHERE user_id=? AND path=?").bind(uid, path).first();
const out = (uid, row, state) => ({ uid, ep: row ? Number(row.ep) || 0 : 0, updated: row ? Number(row.updated) || 0 : 0, now: nowS(), state: state || (row ? parseState(row.state) : normState({})) });

export async function handleLearnProgress(env, request, url, user, J, { paths = [] } = {}) {
  if (env.LEARN_PROGRESS_SYNC !== "1") return J({ error: "off" }, 404);   // vor jeder D1-Abfrage
  const method = request.method;
  if (!["GET", "POST", "DELETE"].includes(method)) return J({ error: "method_not_allowed" }, 405);
  if (!user) return J({ error: "login" }, 401);
  const okPath = (p) => typeof p === "string" && LP_ID_RX.test(p) && paths.includes(p);
  let path = "", body = null;
  if (method === "POST") {
    const len = Number(request.headers.get("content-length") || 0);
    if (len > LP_MAX_BODY) return J({ error: "too_large" }, 413);
    const text = await readCapped(request, LP_MAX_BODY);
    if (text === null) return J({ error: "too_large" }, 413);
    try { body = JSON.parse(text); } catch { return J({ error: "bad_request" }, 400); }
    if (!isObj(body)) return J({ error: "bad_request" }, 400);
    path = body.path;
  } else path = url.searchParams.get("path") || "";
  if (!okPath(path)) return J({ error: "bad_path" }, 400);
  if (!(await allowed(env, user.id))) return J({ error: "rate_limited" }, 429);
  const db = env.DB, uid = user.id;

  if (method === "GET") return J(out(uid, await readRow(db, uid, path)));
  const mine = (x) => { const n = int(x); return !n || n <= 0 || n === uid; };   // erwartetes Konto des Clients (fehlt: keine Pruefung)

  if (method === "DELETE") {
    if (!mine(url.searchParams.get("u"))) return J({ ...out(uid, await readRow(db, uid, path)), error: "uid" }, 409);   // anderes Konto angemeldet: nichts loeschen
    const t = Date.now();
    const r = await db.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES(?,?,'{}',?,?) ON CONFLICT(user_id,path) DO UPDATE SET state='{}', " +
      "ep=MAX(excluded.ep, learn_progress.ep+1), updated=MAX(excluded.updated, learn_progress.updated+1) RETURNING ep,updated").bind(uid, path, Math.floor(t / 1000), t).first();
    return J(out(uid, r, normState({})));
  }

  // POST
  const cep = int(body.ep) ?? 0, init = body.init === 1;
  for (let attempt = 0; attempt < 2; attempt++) {
    const row = await readRow(db, uid, path);
    const ep = row ? Number(row.ep) || 0 : 0;
    const before = row ? parseState(row.state) : normState({});
    if (!mine(body.u)) return J({ ...out(uid, row, before), error: "uid" }, 409);   // Stand eines anderen Kontos: nie in dieses uebernehmen (vor ep und init)
    if (cep !== ep && !init) return J({ ...out(uid, row, before), error: "ep" }, 409);
    const after = applyChanges(before, body);
    const txt = packState(after);
    if (txt === packState(before)) return J(out(uid, row, before));   // keine Aenderung: kein Schreiben
    const old = row ? Number(row.updated) || 0 : -1, t = Math.max(Date.now(), old + 1);
    const w = await db.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES(?,?,?,?,?) ON CONFLICT(user_id,path) DO UPDATE SET state=excluded.state, updated=excluded.updated WHERE learn_progress.updated=?")
      .bind(uid, path, txt, ep, t, old).run();
    if ((w?.meta?.changes || 0) > 0) return J(out(uid, { ep, updated: t }, after));
  }
  return J({ error: "busy" }, 503);
}

// Monatlich im Tageslauf (index.js, am 1. bis 3. des Monats, damit ein ausgefallener Lauf nachgeholt wird; zweiter und dritter Lauf loeschen meist nichts):
// Zeilen ohne Aenderung seit 24 Monaten loeschen. Kein Index auf updated: je Lauf liest das die Tabelle (etwa so viele Zeilen wie Nutzer mit Fortschritt).
export const LP_PURGE_DAYS = 3;
export async function purgeLearnProgress(db, at = Date.now()) {
  if (new Date(at).getUTCDate() > LP_PURGE_DAYS) return { skipped: "nur am 1. bis 3. des Monats" };
  const r = await db.prepare("DELETE FROM learn_progress WHERE updated<?").bind(at - LP_KEEP_MS).run();
  return { deleted: r?.meta?.changes || 0 };
}
