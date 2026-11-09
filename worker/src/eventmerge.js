// Event-Import: Normalisierung, Abgleich und umkehrbares Zusammenfuehren von Events, Sessions und Speakern.
// Regeln:
//  1) Automatisch zusammengefuehrt wird nur bei starker Identitaet: dieselbe eigene Quelle bzw. eigene URL des Events (nie eine Listen-, Feed- oder
//     Profil-URL) ohne Datums- oder Namenswiderspruch, oder gleicher normalisierter Name UND gleicher Tag UND gleiche Stadt. Alles andere: dedupe_queue (Admin).
//  2) Jede automatische Zusammenfuehrung ist eine Zeile-in-Zeile-Zusammenfuehrung mit Eintrag in merge_log (auto=1) und laesst sich zuruecknehmen;
//     "getrennt lassen" (dedupe_queue.status='separate') gilt dauerhaft und wird von spaeteren Laeufen beachtet.
//  3) Was ein Mitglied oder ein Veranstalter eingetragen oder bearbeitet hat, gewinnt immer gegen spaetere Importe.
//  4) Beim Zusammenfuehren wird nie hart geloescht (merged_into + merge_log); geloeschte Import-Events hinterlassen eine Loeschmarke (event_tombstone).
//  5) Gelesene Texte werden beim Eingang gesaeubert (scrub); gespeichert werden nur http/https-Adressen (safeUrl, httpsUrl).
//  6) Lesen und Schreiben laufen gebuendelt ueber db.batch, damit ein Lauf weit unter den Subrequest-Grenzen bleibt.
//  7) Ein Datensatz einer Quelle wird an seiner eigenen Geschichte wiedererkannt (event_source: Kennung + Name und Tag, wie ihn die Quelle zuletzt lieferte),
//     nicht am heutigen Namen oder Termin des Events hier: umbenannt, verschoben oder (auch von einem Admin) zusammengefuehrt, er wird aufgefrischt und nie neu angelegt.
//  8) Fuer ein Import-Event, das niemand pflegt, ist eine Quelle massgeblich – der Datensatz der Veranstaltungsliste (Community Days), sonst der, aus dem es
//     entstand: aendert ihn die Quelle (Termin, Ort, Texte), folgt das Event. Andere Datensaetze ergaenzen nur; gepflegte Events aendert kein Import.
import { ensureDirectoryCols } from "./directory.js";
import { cleanUrl, goodHost } from "./profiles.js";
import { cleanText } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
const parse = (s, d) => { try { const v = JSON.parse(s); return v ?? d; } catch { return d; } };
// Anweisungen in Paketen ausfuehren (ein D1-Aufruf je Paket, jedes Paket eine Transaktion); liefert die Ergebnisse in Reihenfolge
export async function runBatch(db, ops, size = 40) { const out = []; for (let i = 0; i < ops.length; i += size) out.push(...(await db.batch(ops.slice(i, i + size)) || [])); return out; }

// ---------------------------------------------------------------- Normalisierung
export function normText(s) {
  return String(s ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, " ")
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
// Profil-Links von Speakern (nur zum Vergleich im Speicher, sie werden nicht gespeichert): LinkedIn/X/GitHub/Blog auf einen Schluessel bringen
export function normLink(u) {
  try {
    const x = new URL(String(u || "").trim()); if (!/^https?:$/.test(x.protocol)) return "";
    const host = x.hostname.replace(/^www\./, "").toLowerCase(), seg = x.pathname.split("/").filter(Boolean);
    if (host.endsWith("linkedin.com")) return seg[0] === "in" && seg[1] ? "linkedin:" + decodeURIComponent(seg[1]).toLowerCase() : "";
    if (host === "twitter.com" || host === "x.com") return seg[0] && !["intent", "share", "home", "i"].includes(seg[0].toLowerCase()) ? "x:" + seg[0].toLowerCase() : "";
    if (host === "github.com") return seg[0] ? "github:" + seg[0].toLowerCase() : "";
    if (host === "sessionize.com") return seg[0] && seg[0] !== "s" ? "sessionize:" + seg[0].toLowerCase() : "";
    return normUrl(u);   // Blog/Firmenseite: Host+Pfad
  } catch { return ""; }
}
const dayNum = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000) : null; };
export const dayDiff = (a, b) => { const x = dayNum(a), y = dayNum(b); return x === null || y === null ? null : Math.abs(x - y); };
const shiftDay = (d, n) => { const x = dayNum(d); return x === null ? "" : new Date((x + n) * 86400000).toISOString().slice(0, 10); };
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

// ---------------------------------------------------------------- Saeubern (Eingang)
// Gelesener Text: Steuer- und Bidi-Zeichen, Tags, spitze Klammern und Links raus, Leerraum glaetten, Laenge begrenzen
export const scrub = (s, n) => cleanText(String(s ?? ""), 200000).replace(/<[^>]*>/g, " ").replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, n).trim();
export const scrubLine = (s, n) => scrub(s, 200000).replace(/\s+/g, " ").trim().slice(0, n).trim();
// Nur http/https, ohne Zugangsdaten, oeffentlicher Host, hoechstens 300 Zeichen; alles andere wird "" (javascript:, data:, ...)
export function safeUrl(u) {
  try { const x = new URL(String(u ?? "").trim()); if (!/^https?:$/.test(x.protocol) || x.username || x.password || !goodHost(x.hostname)) return ""; x.hash = ""; return x.href.length > 300 ? "" : x.href; } catch { return ""; }
}
// Event-, Ticket- und Aufzeichnungs-Link: dieselbe Regel wie im Mitglieder-Formular (cleanUrl, nur https), damit ein importiertes Event unveraendert speicherbar bleibt
export const httpsUrl = (u) => cleanUrl(String(u ?? ""), null) || "";
const dateOk = (s) => /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(s || "") && !isNaN(Date.parse(s.length === 10 ? s + "T00:00:00Z" : s + ":00Z"));
// Ende passend zum Beginn: nie davor; ein reines Datum am Tag eines Beginns mit Uhrzeit sagt nichts aus und entfaellt (das Formular lehnt sonst "Ende vor Beginn" ab)
export function normEnd(start, end) {
  if (!dateOk(start) || !dateOk(end)) return "";
  if (end.slice(0, 10) !== start.slice(0, 10)) return end.slice(0, 10) > start.slice(0, 10) ? end : "";
  return end.length > 10 && start.length > 10 && end > start ? end : "";
}
// Von Hand geaenderte Felder einer Session merken (event_sessions.edited_fields): der Abgleich mit der Quelle laesst sie stehen
export function markEdited(prev, changed) { return [...new Set([...String(prev || "").split(","), ...changed].filter(Boolean))].join(","); }
const locked = (row) => new Set(String(row?.edited_fields || "").split(",").filter(Boolean));

// ---------------------------------------------------------------- Schluessel
const OWN_KINDS = ["sessionize_api", "sessionize_event", "communitydays"];   // Quellen, deren ref genau EIN Event bezeichnet (nie Liste, Feed oder Profil)
const KEY_KIND = "key";   // Ersatz-Kennung eines Datensatzes ohne eigene Kennung (Quelle + Name + Tag + Stadt): erkennt nur denselben Datensatz derselben Quelle wieder
const MENTION = "sessionize_mention";   // Sessionize-Adresse, die nur im Fliesstext eines Events steht: schwacher Hinweis (Warteschlange), nie Identitaet
const ownUrlKey = (u) => { const k = normUrl(u); return k.includes("/") ? k : ""; };   // eigene Seite des Events; eine reine Domain ist zu unspezifisch
export const KEYS_V = 1;   // Version der Schluessel-Berechnung (events.keys_v): bei Aenderung an normEventName/cityKey/normUrl erhoehen, die Rueckfuellung rechnet dann neu
// Schluessel eines Events: { title, url, city | location, mode }
export function eventKeys(e) {
  return { name_key: normEventName(e.title).key, url_key: ownUrlKey(e.url), city_key: e.mode === "online" ? "" : cityKey(String(e.city || e.location || "").split(",")[0]) };
}
// Rueckfuellung (idempotent, gedeckelt): Schluessel fuer Events und Sessions, die ohne Schluessel angelegt wurden (Formular, Programm-Importe, Livestreams, Altbestand)
export async function backfillKeys(db, limit = 150) {
  const [e, s] = await db.batch([
    db.prepare("SELECT id,title,url,location,city,mode FROM events WHERE keys_v<? LIMIT ?").bind(KEYS_V, limit),
    db.prepare("SELECT id,title FROM event_sessions WHERE title_key='' LIMIT ?").bind(limit),
  ]);
  const ops = [];
  for (const r of e.results || []) { const k = eventKeys(r); ops.push(db.prepare("UPDATE events SET name_key=?,url_key=?,city_key=?,keys_v=? WHERE id=?").bind(k.name_key, k.url_key, k.city_key, KEYS_V, r.id)); }
  for (const r of s.results || []) ops.push(db.prepare("UPDATE event_sessions SET title_key=? WHERE id=? AND title_key=''").bind(normSessionTitle(r.title) || "-", r.id));   // "-" = Titel ohne Buchstaben/Ziffern (nicht erneut waehlen)
  await runBatch(db, ops, 50);
  return { events: (e.results || []).length, sessions: (s.results || []).length };
}

// ---------------------------------------------------------------- Handles
const TRANSLIT = { "ß": "ss", "ø": "o", "ł": "l", "æ": "ae", "œ": "oe", "đ": "d", "ð": "d", "þ": "th", "ı": "i" };
// Adresse eines Events: nur a-z, 0-9 und Bindestrich (wie die Routen /api/event/<handle> und das Formular verlangen); "" wenn nichts Brauchbares bleibt
export function slugHandle(title) {
  const base = String(title ?? "").toLowerCase().replace(/[ßøłæœđðþı]/g, (c) => TRANSLIT[c]).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32).replace(/-+$/, "");
  return base.length >= 3 ? base : "";
}
async function freeHandle(db, title, year) {
  const base = slugHandle(title) || "event-" + (await hash24(String(title))).slice(0, 8);
  const taken = new Set(((await db.prepare("SELECT handle FROM events WHERE handle=?1 OR handle LIKE ?2").bind(base, base.slice(0, 26) + "%").all()).results || []).map((r) => r.handle));
  if (!taken.has(base)) return base;
  const tries = [year && !base.includes(year) ? `${base.slice(0, 35)}-${year}` : "", ...Array.from({ length: 60 }, (_, i) => `${base.slice(0, 36)}-${i + 2}`)].filter(Boolean);
  return tries.find((h) => !taken.has(h)) || `${base.slice(0, 31)}-${rndToken().slice(0, 8)}`;
}

// ---------------------------------------------------------------- Warteschlange "Moegliche Dubletten"
const pairOf = (a, b) => (a < b ? [a, b] : [b, a]);
const queueStmt = (db, kind, a, b, reason, t) => { const [x, y] = pairOf(a, b); return db.prepare("INSERT OR IGNORE INTO dedupe_queue(kind,a_id,b_id,reason,created) VALUES(?,?,?,?,?)").bind(kind, x, y, reason, t); };
export async function queueDupe(db, kind, a, b, reason, t = now()) {
  if (!a || !b || a === b) return false;
  return Number((await queueStmt(db, kind, a, b, reason, t).run()).meta?.changes || 0) === 1;
}
// Eine Entscheidung "getrennt lassen" bleibt bestehen: INSERT OR IGNORE laesst vorhandene Zeilen (auch 'separate') unveraendert
const separateStmt = (db, kind, a, b, by, t) => { const [x, y] = pairOf(a, b); return db.prepare("INSERT INTO dedupe_queue(kind,a_id,b_id,reason,status,created,decided,decided_by) VALUES(?,?,?,'unmerged','separate',?,?,?) ON CONFLICT(kind,a_id,b_id) DO UPDATE SET status='separate',decided=excluded.decided,decided_by=excluded.decided_by").bind(kind, x, y, t, t, by); };
const mergedStmt = (db, kind, a, b, by, t) => { const [x, y] = pairOf(a, b); return db.prepare("UPDATE dedupe_queue SET status='merged',decided=?,decided_by=? WHERE kind=? AND a_id=? AND b_id=? AND status='open'").bind(t, by, kind, x, y); };
const logStmt = (db, kind, from, into, snapshot, auto, by, t) => db.prepare("INSERT INTO merge_log(kind,from_id,into_id,snapshot,auto,by_user,created) VALUES(?,?,?,?,?,?,?)").bind(kind, from, into, JSON.stringify(snapshot), auto ? 1 : 0, by || 0, t);

// ---------------------------------------------------------------- Quellen
// s.name_key/day/hash = Stand des Datensatzes in seiner Quelle. Er steht nur an der Zeile des Datensatzes selbst (dem Event, das aus ihm entstand, oder seiner
// ausgeblendeten Zeile); Verweise, die beim Zusammenfuehren ans Ziel-Event kopiert werden (srcCopy), tragen keinen Stand und aendern einen vorhandenen nicht.
const evSourceStmt = (db, id, s, t) => db.prepare("INSERT INTO event_source(event_id,kind,ref,url,url_key,name_key,day,hash,first_seen,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(event_id,kind,ref) DO UPDATE SET last_seen=excluded.last_seen,url=CASE WHEN event_source.url='' THEN excluded.url ELSE event_source.url END,url_key=CASE WHEN event_source.url_key='' THEN excluded.url_key ELSE event_source.url_key END,name_key=CASE WHEN excluded.hash<>'' THEN excluded.name_key ELSE event_source.name_key END,day=CASE WHEN excluded.hash<>'' THEN excluded.day ELSE event_source.day END,hash=CASE WHEN excluded.hash<>'' THEN excluded.hash ELSE event_source.hash END")
  .bind(id, s.kind, s.ref, s.url || "", OWN_KINDS.includes(s.kind) ? ownUrlKey(s.url) : "", s.hash ? s.name_key || "" : "", s.hash ? s.day || "" : "", s.hash || "", t, t);
const srcCopy = ({ kind, ref, url }) => ({ kind, ref, url });
const sesSourceStmt = (db, id, s, t) => db.prepare("INSERT INTO session_source(session_id,kind,ref,url,hash,first_seen,last_seen) VALUES(?,?,?,?,?,?,?) ON CONFLICT(session_id,kind,ref) DO UPDATE SET last_seen=excluded.last_seen,hash=excluded.hash")
  .bind(id, s.kind, s.ref, s.url || "", s.hash || "", t, t);
export async function addEventSource(db, id, kind, ref, url = "", t = now()) { await evSourceStmt(db, id, { kind, ref, url: safeUrl(url) }, t).run(); }

// ---------------------------------------------------------------- Events
// Von Hand angelegt, uebernommen oder bearbeitet: Importe (und Zusammenfuehrungen) aendern am Inhalt nichts mehr
export const protectedEvent = (ev) => !!(ev.owner_id || ev.org_id || !ev.unclaimed || ev.edited_at);
const richerDate = (a, b) => (!a ? b : !b ? a : b.length > a.length && b.startsWith(a.slice(0, 10)) ? b : a);
// Kandidat eines Importers saeubern: Texte, Adressen, Datum, Modus, Schluessel. null = unbrauchbar.
// Eingang: { title, summary, about, start, end, mode, city, country, url, tickets_url, organizer_name, lang, free, source, source_url, sources:[{kind,ref,url}] }
// sources[0] ist die Kennung des Datensatzes in seiner Quelle (z. B. die eigene Seite des Events); nur daran wird ein erneuter Import desselben Datensatzes erkannt.
// Eine Quelle der Art sessionize_mention (Adresse nur im Fliesstext) landet in out.mentions: sie fuehrt nie zusammen, sondern nur in die Warteschlange.
// sole (optional): der Importer hat die ganze Quelle gelesen und weiss, ob sources[0] dort genau einen Datensatz bezeichnet (siehe sameRecord).
export function cleanCand(c) {
  const title = scrubLine(c?.title, 120); if (title.length < 3) return null;
  const start = dateOk(String(c.start || "")) ? String(c.start) : "", place = scrubLine(c.city, 80);
  const mode = ["online", "onsite", "hybrid"].includes(c.mode) ? c.mode : place ? "onsite" : "online", city = mode === "online" ? "" : place, sources = [], mentions = [];
  for (const s of Array.isArray(c.sources) ? c.sources : []) {
    const kind = String(s?.kind || ""), ref = cleanText(String(s?.ref ?? ""), 200), list = OWN_KINDS.includes(kind) ? sources : kind === MENTION ? mentions : null;
    if (list && ref && !list.some((x) => x.kind === kind && x.ref === ref)) list.push({ kind, ref, url: kind === MENTION ? "" : safeUrl(s.url) });
  }
  const out = { title, summary: scrubLine(c.summary, 200), about: scrub(c.about, 3000), start, end: normEnd(start, String(c.end || "")), mode, city, location: city, country: scrubLine(c.country, 60),
    url: httpsUrl(c.url), tickets_url: httpsUrl(c.tickets_url), organizer_name: scrubLine(c.organizer_name, 120), lang: scrubLine(c.lang, 10).replace(/[^A-Za-z-]/g, ""), free: c.free === true ? 1 : c.free === false ? 0 : -1,
    source: /^[a-z_]{2,20}$/.test(c.source || "") ? c.source : "", source_url: safeUrl(c.source_url), sources,
    sole: c.sole === true ? true : c.sole === false ? false : undefined,   // true = einziger Datensatz mit dieser Kennung im aktuellen Stand der Quelle, false = mehrere teilen sie, sonst unbekannt
    online_stated: c.online_stated === true };   // die Quelle sagt ausdruecklich "online" (nicht bloss: kein Ort gefunden)
  const k = eventKeys(out), n = normEventName(title);
  out.name_key = k.name_key; out.city_key = k.city_key; out.url_key = ownUrlKey(safeUrl(c.url)); out.year = n.year;   // Schluessel auch aus einer http-Adresse (gespeichert wird sie nicht)
  out.mentions = mentions.filter((x) => !sources.some((y) => y.kind === "sessionize_event" && y.ref === x.ref));
  if (!sources.length) {   // Importer ohne eigene Kennung: Ersatz, damit derselbe Datensatz wiedererkannt wird. Ohne Datum liesse er sich nie wiedererkennen: unbrauchbar.
    if (!start || !out.name_key) return null;
    sources.push({ kind: KEY_KIND, ref: `${out.source || "import"}:${out.name_key}|${start.slice(0, 10)}|${out.city_key}`, url: "" });
  }
  return out;
}
// Passen zwei Namens-Schluessel zueinander (einer enthaelt den anderen oder mindestens die halben Woerter stimmen)? Ein fehlender Schluessel widerspricht nicht.
const nameLike = (a, b) => !a || !b || a.includes(b) || b.includes(a) || jaccard(a, b) >= 0.5;
// Ist der Kandidat der Datensatz, den die Quelle unter derselben Kennung zuletzt mit Namen rk am Tag rd lieferte?
//   "same"    Name passt und der Tag liegt hoechstens 3 Tage daneben. Teilen sich in der Quelle mehrere Datensaetze die Kennung (c.sole === false),
//             muessen Name und Tag genau stimmen: sonst wuerden zwei Eintraege einer Reihe still zu einem.
//   sonst nur, wenn der Importer weiss, dass die Kennung in der Quelle jetzt genau EINEN Datensatz bezeichnet (c.sole): dann hat sich der Datensatz geaendert –
//   "changed" (UID eines Kalenders), "moved" (gleicher Name, neuer Termin hoechstens MOVE_DAYS entfernt, der alte lag noch nicht in der Vergangenheit)
//   oder "renamed" (neuer Name, gleicher Termin).
//   ""        ein anderer Datensatz: mehrere Events teilen die Adresse (Reihe, Seite einer User Group) oder es ist die naechste Ausgabe unter derselben Adresse.
const MOVE_DAYS = 180;   // weiter weg ist es keine Verlegung mehr, sondern die naechste Ausgabe
function sameRecord(c, rk, rd, today) {
  const nm = nameLike(c.name_key, rk), dd = dayDiff(c.start, rd), near = dd === null || dd <= 3;
  if (c.sole === false) return c.name_key === rk && !dd ? "same" : "";
  if (nm && near) return "same";
  if (c.sole !== true) return "";
  if (c.sources[0].ref.startsWith("uid:")) return "changed";
  return nm ? (rd >= today && dd <= MOVE_DAYS ? "moved" : "") : near ? "renamed" : "";
}
// Treffer fuer einen gesaeuberten Kandidaten. Rang 3 = eigene Quelle, 2 = eigene URL, 1 = Name+Tag+Stadt (jeweils "high"); alles andere "low" (Rang 0).
// Ergebnis: null oder { id, row, rank, confidence, reason, rec?, others:[{id,confidence,reason}] }. Wer vom besten Treffer "getrennt gelassen" wurde, entfaellt.
// rec = { holder, hash }: derselbe Datensatz wurde schon einmal gelesen; holder ist die Zeile, die ihn haelt – das Event selbst oder eine ausgeblendete Zeile,
// die (automatisch oder von einem Admin) in das Event zusammengefuehrt wurde. Ausgeblendete Zeilen nehmen deshalb an der Quellen-Suche teil und zaehlen fuer ihr Ziel.
// Events ohne Schluessel (von Hand, aus Programm-Importen oder dem Altbestand; keys_v < KEYS_V) nehmen trotzdem teil: ihre Schluessel werden hier
// im Speicher berechnet und – ausser im Probelauf (opts.dry) – gleich gespeichert.
export async function findEvent(db, c, opts = {}) {
  const refs = c.sources.filter((s) => OWN_KINDS.includes(s.kind) || s.kind === KEY_KIND), d = c.start.slice(0, 10), j = (a) => JSON.stringify(a), prim = c.sources[0];
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const uks = [...new Set([c.url_key, ...refs.map((s) => (OWN_KINDS.includes(s.kind) ? ownUrlKey(s.url) : ""))].filter(Boolean))];
  const weak = [...c.sources.filter((s) => s.kind === "sessionize_event").map((s) => [MENTION, s.ref]), ...(c.mentions || []).map((s) => ["sessionize_event", s.ref])];
  const pairs = (list) => list.map(() => "(s.kind=? AND s.ref=?)").join(" OR ") || "0";
  const res = await db.batch([
    db.prepare(`SELECT e.*,s.kind sk,s.ref sr,s.name_key rk,s.day rd,s.hash rh FROM event_source s JOIN events e ON e.id=s.event_id WHERE ${pairs(refs)} ORDER BY e.merged_into<>0,e.id`).bind(...refs.flatMap((s) => [s.kind, s.ref])),
    db.prepare("SELECT e.* FROM events e WHERE e.merged_into=0 AND (e.url_key IN (SELECT value FROM json_each(?1)) OR e.id IN (SELECT event_id FROM event_source WHERE url_key IN (SELECT value FROM json_each(?1))))").bind(j(uks)),
    db.prepare("SELECT * FROM events WHERE merged_into=0 AND name_key<>'' AND ?1<>'' AND (name_key=?1 OR (?2<>'' AND substr(start,1,10) BETWEEN ?3 AND ?4)) LIMIT 500").bind(c.name_key, d, shiftDay(d, -1), shiftDay(d, 1)),
    db.prepare(`SELECT e.* FROM event_source s JOIN events e ON e.id=s.event_id WHERE e.merged_into=0 AND (${pairs(weak)})`).bind(...weak.flat()),
    db.prepare("SELECT * FROM events WHERE keys_v<? LIMIT 400").bind(KEYS_V),
  ]), rows = (i) => res[i]?.results || [], hits = new Map(), rekey = [];
  const put = (ev, rank, reason, rec) => {
    if (ev.id === opts.excludeId) return; const o = hits.get(ev.id);
    if (!o || rank > o.rank) hits.set(ev.id, { id: ev.id, row: ev, rank, confidence: rank ? "high" : "low", reason, rec });
    else if (rec && rank === o.rank && (!o.rec || (rec.holder.id === ev.id && o.rec.holder.id !== ev.id))) { o.rec = rec; o.reason = reason; }   // haelt das Event den Datensatz selbst, gilt diese Zeile
  };
  const clash = (ev) => { const x = dayDiff(c.start, ev.start); return x !== null && x > 3; };   // gleiche Adresse, aber andere Ausgabe (Jahr)
  // Eine Adresse kann trotz allem mehreren Events gehoeren (Seite einer User Group, Reihe): passt der Name gar nicht, entscheidet ein Admin
  const nameOk = (ev) => nameLike(c.name_key, ev.name_key);
  // Listet die Quelle selbst mehrere Datensaetze unter dieser Adresse (c.sole === false), ist sie nicht die eigene Adresse EINES Events: nur ein Hinweis fuer die Admins
  const byUrl = (ev) => (c.sole === false ? put(ev, 0, "url_shared") : clash(ev) ? put(ev, 0, "url_date_differs") : nameOk(ev) ? put(ev, 2, "url") : put(ev, 0, "url_name_differs"));
  const byName = (ev) => {
    if (ev.name_key === c.name_key) {
      const x = dayDiff(c.start, ev.start);
      if (x === null) put(ev, 0, "name_without_date");
      else if (x === 0 && c.city_key && c.city_key === ev.city_key) put(ev, 1, "name+day+city");
      else if (x <= 1) put(ev, 0, x ? "name+date_near" : c.city_key || ev.city_key ? "name+day_place_differs" : "name+day_online");   // online: kein Ort, der die Gleichheit belegt
    } else if (c.city_key === ev.city_key && (dayDiff(c.start, ev.start) ?? 9) <= 1 && jaccard(c.name_key, ev.name_key) >= 0.8) put(ev, 0, "similar_name");
  };
  // Ausgeblendete (zusammengefuehrte) Zeilen zaehlen fuer das Event, in dem sie aufgegangen sind
  const known = new Map(); for (let i = 0; i < 5; i++) for (const r of rows(i)) if (!known.has(r.id)) known.set(r.id, r);
  for (let i = 0, ids = [...new Set(rows(0).map((r) => r.merged_into).filter((id) => id && !known.has(id)))]; i < 5 && ids.length; i++) {
    const got = (await db.prepare("SELECT * FROM events WHERE id IN (SELECT value FROM json_each(?))").bind(j(ids)).all()).results || [];
    for (const g of got) known.set(g.id, g);
    ids = [...new Set(got.map((g) => g.merged_into).filter((id) => id && !known.has(id)))];
  }
  const target = (e) => { for (let i = 0; i < 6 && e?.merged_into; i++) e = known.get(e.merged_into); return e && !e.merged_into ? e : null; };
  for (const r of rows(0)) {
    const ev = target(r); if (!ev) continue;
    if (r.sk === prim.kind && r.sr === prim.ref && r.rh) {   // Zeile eines Datensatzes mit dieser Kennung: derselbe (auch umbenannt, verschoben, zusammengefuehrt) oder ein anderer unter derselben Adresse?
      const how = sameRecord(c, r.rk, r.rd, today);
      if (how) put(ev, 3, how === "same" ? "source:" + r.sk : "source_" + how, { holder: r, hash: r.rh });
      else put(ev, 0, (dayDiff(c.start, r.rd) ?? 0) > 3 ? "source_date_differs" : c.sole === false ? "source_shared" : "source_name_differs");
    } else if (!r.merged_into) clash(ev) ? put(ev, 0, "source_date_differs") : r.sk === "communitydays" && (c.sole === false || !nameOk(ev)) ? put(ev, 0, c.sole === false ? "source_shared" : "source_name_differs") : put(ev, 3, "source:" + r.sk);   // Verweis ohne eigenen Stand (anderer Datensatz desselben Events): das Event muss selbst passen
  }
  rows(1).forEach(byUrl); if (c.name_key) rows(2).forEach(byName);
  for (const ev of rows(3)) put(ev, 0, "mentioned_link");
  for (const ev of rows(4)) {   // noch ohne Schluessel: jetzt berechnen
    const k = eventKeys(ev); Object.assign(ev, k, { keys_v: KEYS_V }); rekey.push(db.prepare("UPDATE events SET name_key=?,url_key=?,city_key=?,keys_v=? WHERE id=?").bind(k.name_key, k.url_key, k.city_key, KEYS_V, ev.id));
    if (ev.merged_into) continue;
    if (k.url_key && uks.includes(k.url_key)) byUrl(ev);
    if (c.name_key && k.name_key) byName(ev);
  }
  if (rekey.length && !opts.dry) await runBatch(db, rekey, 80);
  let all = [...hits.values()]; if (!all.length) return null;
  all.sort((a, b) => b.rank - a.rank || !!b.rec - !!a.rec || (b.row.source === c.source) - (a.row.source === c.source) || a.id - b.id);
  if (all.length > 1) {
    const ids = j(all.map((x) => x.id)), best = all[0];
    const sep = (await db.prepare("SELECT a_id,b_id FROM dedupe_queue WHERE kind='event' AND status='separate' AND a_id IN (SELECT value FROM json_each(?1)) AND b_id IN (SELECT value FROM json_each(?1))").bind(ids).all()).results || [];
    all = all.filter((x) => x === best || !sep.some((p) => (p.a_id === best.id && p.b_id === x.id) || (p.b_id === best.id && p.a_id === x.id)));
  }
  const [best, ...others] = all;
  return { ...best, others: others.map(({ id, confidence, reason }) => ({ id, confidence, reason })) };
}
// Was ein ungeschuetztes Event von einem weiteren Datensatz (Kandidat oder zusammengefuehrtes Event) uebernimmt: laengerer Text, genaueres Datum, leere Felder.
// auth = x ist der fuer dieses Event massgebliche Datensatz (siehe upsertEvent) und die Quelle liefert ihn geaendert: Titel, Termin, Ort, Texte und Links folgen
// dann der Quelle (ein Import-Event ohne Veranstalter pflegt sonst niemand). Angaben, die die Quelle nicht (mehr) macht, loeschen nichts – ausser dem Ende, das zum Termin gehoert,
// und dem Ort, wenn die Quelle das Event ausdruecklich als online ausweist (fehlt nur die Ortsangabe, bleiben Modus und Ort).
// Liefert { before, after } nur mit den geaenderten Spalten.
function fillEvent(ev, x, auth = false, today = "") {
  if (protectedEvent(ev)) return { before: {}, after: {} };
  let nu;
  if (auth) {
    const start = x.start && !(ev.start.length > x.start.length && ev.start.startsWith(x.start)) ? x.start : ev.start;   // ein reines Datum der Quelle nimmt eine bekannte Uhrzeit desselben Tages nicht weg
    const online = x.mode === "online" && (ev.mode === "online" || x.online_stated === true);
    nu = { title: x.title || ev.title, summary: x.summary || ev.summary, about: x.about || ev.about, start, end: x.start ? normEnd(start, x.end || "") : ev.end, mode: online ? "online" : x.mode === "online" ? ev.mode : x.mode || ev.mode, free: x.free >= 0 ? x.free : ev.free,
      location: online ? "" : x.city || ev.location, city: online ? "" : x.city || ev.city || "" };
    for (const f of ["url", "tickets_url", "country", "lang", "organizer_name"]) nu[f] = x[f] || ev[f] || "";
    if (nu.location !== ev.location) Object.assign(nu, { lat: null, lng: null, geo_precision: "", geo_address: "", geo_at: 0 });   // neuer Ort: Koordinaten verwerfen, der Geocode-Lauf holt sie neu
    if (ev.retired && today && (nu.end || nu.start).slice(0, 10) >= today) nu.retired = 0;   // als vergangen markiert, jetzt auf einen kuenftigen Termin verlegt
  } else {
    nu = { title: richer(ev.title, x.title), summary: richer(ev.summary, x.summary), about: richer(ev.about, x.about), start: richerDate(ev.start, x.start || ""), mode: ev.mode !== "online" ? ev.mode : x.mode || ev.mode, free: ev.free < 0 && x.free >= 0 ? x.free : ev.free };
    nu.end = normEnd(nu.start, richerDate(ev.end, x.end || "")) || (nu.start === ev.start ? ev.end : "");
    for (const f of ["url", "tickets_url", "location", "country", "lang", "organizer_name", "city"]) nu[f] = ev[f] || x[f] || "";
    if (nu.mode === "online" && ev.mode === "online") { nu.location = ev.location; nu.city = ev.city || ""; }   // Online-Event bekommt keinen Ort untergeschoben
  }
  Object.assign(nu, eventKeys(nu)); if (!nu.url_key) nu.url_key = ev.url_key || x.url_key || "";
  if (!ev.start && nu.start && !ev.public && !ev.merged_into) nu.public = 1;   // ohne Datum verborgen angelegt (siehe insertEvent): mit dem nachgetragenen Datum sichtbar
  const before = {}, after = {};
  for (const k of Object.keys(nu)) if ((nu[k] ?? "") !== (ev[k] ?? "")) { before[k] = ev[k] ?? ""; after[k] = nu[k]; }
  return { before, after };
}
const setCols = (db, table, id, cols, extra = [], extraSql = "") => db.prepare(`UPDATE ${table} SET ${Object.keys(cols).map((c) => `"${c}"=?`).join(",")}${extraSql} WHERE id=?`).bind(...Object.values(cols), ...extra, id);
// Technische Adresse einer Zeile, die gleich beim Anlegen in einem anderen Event aufgeht: "~" kommt in keiner echten Adresse vor (Formular und Routen
// erlauben nur a-z, 0-9, -). Eine nie sichtbare Zeile belegt so keine Adresse, die ein Mitglied vergeben moechte; wird sie zurueckgenommen, bekommt sie eine echte.
const HIDDEN = "~";
async function insertEvent(db, c, t, mergedInto = 0) {
  const handle = mergedInto ? HIDDEN + rndToken().slice(0, 30) : await freeHandle(db, c.title, c.year);
  const id = (await db.prepare("INSERT INTO events(handle,owner_id,org_id,title,summary,about,start,end,tz,mode,location,country,url,tickets_url,free,lang,topics,seeking_sponsor,public,created,updated,source,source_url,url_key,name_key,city_key,keys_v,unclaimed,organizer_name,merged_into,city) VALUES(?,0,NULL,?,?,?,?,?,'',?,?,?,?,?,?,?,'[]',0,?,?,?,?,?,?,?,?,?,1,?,?,?)")
    .bind(handle, c.title, c.summary, c.about, c.start, c.end, c.mode, c.city, c.country, c.url, c.tickets_url, c.free, c.lang, !c.start || mergedInto ? 0 : 1, t, t,   // ohne Datum: verborgen, bis ein Admin den Namens-Treffer entschieden hat
      c.source, c.source_url, c.url_key, c.name_key, c.city_key, KEYS_V, c.organizer_name, mergedInto, c.city).run()).meta.last_row_id;
  return { id, handle };
}
const TOMB_DAYS = 3;
async function tombstoned(db, c, today) {
  const day = c.start.slice(0, 10), prim = c.sources[0], keys = [...c.sources.filter((s) => OWN_KINDS.includes(s.kind)).map((s) => [s.kind, s.ref]), ...(c.url_key ? [["url", c.url_key]] : []), ...(c.name_key && day ? [["name", `${c.name_key}|${c.city_key}`]] : [])];
  if (!keys.length) return false;
  const rows = (await db.prepare(`SELECT kind,ref,day,title FROM event_tombstone WHERE ${keys.map(() => "(kind=? AND ref=?)").join(" OR ")}`).bind(...keys.flat()).all()).results || [];
  return rows.some((r) => {
    const d = dayDiff(day, r.day); if (r.kind === "name") return d === 0;
    if (d === null || d <= TOMB_DAYS) return true;   // gleiche Adresse in einem anderen Jahr ist eine neue Ausgabe ...
    return c.sole === true && r.kind === prim.kind && r.ref === prim.ref && r.day >= today && d <= MOVE_DAYS && nameLike(c.name_key, normEventName(r.title).key);   // ... ein geloeschtes, noch nicht vergangenes Event, das die Quelle nur verlegt hat, ist es nicht
  });
}
const LEAD_KIND = "communitydays";   // die Veranstaltungsliste: fuer ein Import-Event ohne Veranstalter die massgebliche Quelle (vor Angaben aus Speaker-Profilen)
const recordHash = (c) => hash24(JSON.stringify(["v1", c.title, c.summary, c.about, c.start, c.end, c.mode, c.city, c.country, c.url, c.tickets_url, c.organizer_name, c.lang, c.free]));
// Event anlegen, auffrischen oder mit dem sicheren Treffer zusammenfuehren. opts.dry = nichts schreiben.
// Liefert { action: created | merged | queued | skipped, id, handle?, reason, log?, changed? } (log = merge_log-ID einer neuen automatischen Zusammenfuehrung,
// changed = beim Auffrischen wurden Aenderungen der Quelle in das Event uebernommen).
export async function upsertEvent(db, cand, opts = {}) {
  await ensureDirectoryCols(db);
  const t = opts.now || now(), c = cleanCand(cand); if (!c) return { action: "skipped", reason: "bad_data" };
  const today = opts.today || new Date(t * 1000).toISOString().slice(0, 10), rec = c.sources[0];
  Object.assign(rec, { name_key: c.name_key, day: c.start.slice(0, 10), hash: await recordHash(c) });   // Stand des Datensatzes, an dem er beim naechsten Lesen wiedererkannt wird
  const m = await findEvent(db, c, { dry: opts.dry, today }), srcs = [...c.sources, ...c.mentions];
  if (m && m.confidence === "high") {
    if (opts.dry) return { action: "merged", id: m.id, reason: m.reason };
    const ev = m.row, have = (await db.prepare("SELECT kind,ref FROM event_source WHERE event_id=?").bind(ev.id).all()).results || [];
    const has = (s) => have.some((h) => h.kind === s.kind && h.ref === s.ref), ops = [];
    const others = m.others.map((o) => queueStmt(db, "event", ev.id, o.id, o.reason, t));
    if (m.rec) {   // derselbe Datensatz erneut gelesen: auffrischen, keine neue Zusammenfuehrung
      // Hat die Quelle ihn geaendert (und teilt er seine Kennung mit keinem anderen), folgt ihm die Zeile, die ihn haelt: das Event selbst oder seine ausgeblendete Zeile.
      // Fuer das (ungepflegte) Event ist genau eine Quelle massgeblich: der Datensatz der Veranstaltungsliste (LEAD_KIND), auch wenn er erst spaeter dazukam;
      // ein anderer nur, wenn das Event aus ihm entstand und kein Listen-Datensatz dazugehoert. Alle uebrigen ergaenzen wie bei jeder Zusammenfuehrung.
      const h = m.rec.holder, own = h.id === ev.id, changed = m.rec.hash !== rec.hash && c.sole !== false;
      const lead = changed && (rec.kind === LEAD_KIND || (own && !have.some((x) => x.kind === LEAD_KIND))), f = fillEvent(ev, c, lead, today), touched = Object.keys(f.after).length > 0;
      if (!own) {
        const fh = fillEvent(h, c, changed, today); if (Object.keys(fh.after).length) ops.push(setCols(db, "events", h.id, fh.after, [t], ",updated=?"));
        ops.push(evSourceStmt(db, h.id, rec, t));
        // was das Event von dem zusammengefuehrten Datensatz nachtraeglich uebernimmt, gehoert zu dieser Zusammenfuehrung: beim Zuruecknehmen geht es mit zurueck
        const l = touched ? await db.prepare("SELECT id,snapshot FROM merge_log WHERE kind='event' AND from_id=? AND into_id=? AND undone=0 ORDER BY id DESC LIMIT 1").bind(h.id, ev.id).first() : null;
        if (l) { const sn = parse(l.snapshot, {}); ops.push(db.prepare("UPDATE merge_log SET snapshot=? WHERE id=?").bind(JSON.stringify({ ...sn, into_before: { ...f.before, ...(sn.into_before || {}) }, into_after: { ...(sn.into_after || {}), ...f.after } }), l.id)); }
      }
      if (touched) ops.push(setCols(db, "events", ev.id, f.after, [t], ",updated=?"));
      for (const s of srcs) ops.push(evSourceStmt(db, ev.id, own || s !== rec ? s : srcCopy(s), t));
      await runBatch(db, [...ops, ...others]);
      return { action: "merged", id: ev.id, reason: m.reason, changed: lead && touched };
    }
    // anderer Datensatz desselben Events: als ausgeblendete Zeile festhalten und protokolliert zusammenfuehren (umkehrbar)
    const f = fillEvent(ev, c), hid = await insertEvent(db, c, t, ev.id), added = srcs.filter((s) => !has(s));
    for (const s of srcs) ops.push(evSourceStmt(db, hid.id, s, t));
    if (Object.keys(f.after).length) ops.push(setCols(db, "events", ev.id, f.after, [t], ",updated=?"));
    for (const s of added) ops.push(evSourceStmt(db, ev.id, srcCopy(s), t));
    ops.push(...others, logStmt(db, "event", hid.id, ev.id, { into_before: f.before, into_after: f.after, from_public: c.start ? 1 : 0, added_sources: added.map(({ kind, ref }) => ({ kind, ref })), moved: {}, session_logs: [], reason: m.reason }, true, opts.by, t));
    const res = await runBatch(db, ops, 60);
    return { action: "merged", id: ev.id, reason: m.reason, log: res[res.length - 1]?.meta?.last_row_id || 0 };
  }
  if (await tombstoned(db, c, today)) return { action: "skipped", reason: "deleted" };   // von Admin/Veranstalter geloescht: kommt nicht zurueck
  if (opts.dry) return { action: m ? "queued" : "created", id: m?.id || 0, reason: m?.reason || "" };
  const nu = await insertEvent(db, c, t), ops = srcs.map((s) => evSourceStmt(db, nu.id, s, t));
  if (m) for (const o of [m, ...m.others]) ops.push(queueStmt(db, "event", o.id, nu.id, o.reason, t));   // unsicherer Treffer: beide bleiben, ein Admin entscheidet
  await runBatch(db, ops);
  return { action: m ? "queued" : "created", id: nu.id, handle: nu.handle, reason: m?.reason || "" };
}

// Tabellen, die an einem Event haengen. EINE Stelle fuer Zusammenfuehren, Zuruecknehmen und Loeschen: eine weitere Tabelle (z. B. linkedin_events)
// wird nur hier eingetragen. key = Spalte, die eine Zeile innerhalb eines Events eindeutig macht ("" = hoechstens eine Zeile je Event).
// Beim Zusammenfuehren wandern die Zeilen, die es am Ziel-Event unter demselben Schluessel noch nicht gibt; der Rest bleibt am ausgeblendeten Quell-Event.
export const EVENT_TABLES = [
  { table: "event_sessions", key: "id" },
  { table: "speaker_invites", key: "token" },
  { table: "event_attendees", key: "user_id" },
  { table: "event_partners", key: "org_id" },
  { table: "event_roles", key: "user_id" },
  { table: "event_transfers", key: "user_id" },
  { table: "sponsor_asks", key: "org_id" },
  { table: "event_claims", key: "user_id" },
  { table: "event_settings", key: "" },
];
// Event samt allem, was daran haengt, loeschen (Anweisungen fuer eine Batch). Hat das Event eine Import-Quelle, bleiben Loeschmarken zurueck,
// damit es der naechste Import-Lauf nicht neu anlegt. Mit ihm verschwinden die in es zusammengefuehrten (ausgeblendeten) Zeilen.
export async function eventDeleteOps(db, ev, t = now()) {
  const fam = [ev]; let layer = [ev.id];
  for (let i = 0; i < 5 && layer.length; i++) {
    const kids = (await db.prepare("SELECT * FROM events WHERE merged_into IN (SELECT value FROM json_each(?))").bind(JSON.stringify(layer)).all()).results || [];
    fam.push(...kids); layer = kids.map((k) => k.id);
  }
  const ids = JSON.stringify(fam.map((e) => e.id)), ops = [];
  const src = (await db.prepare("SELECT event_id,kind,ref FROM event_source WHERE event_id IN (SELECT value FROM json_each(?))").bind(ids).all()).results || [];
  const tomb = (kind, ref, e) => ops.push(db.prepare("INSERT OR IGNORE INTO event_tombstone(kind,ref,day,title,created) VALUES(?,?,?,?,?)").bind(kind, ref, String(e.start || "").slice(0, 10), e.title, t));
  if (fam.some((e) => e.source) || src.some((s) => OWN_KINDS.includes(s.kind))) for (const e of fam) {
    for (const s of src) if (s.event_id === e.id && OWN_KINDS.includes(s.kind)) tomb(s.kind, s.ref, e);
    if (e.url_key) tomb("url", e.url_key, e);
    if (e.name_key && e.start) tomb("name", `${e.name_key}|${e.city_key}`, e);
  }
  const ses = "SELECT id FROM event_sessions WHERE event_id IN (SELECT value FROM json_each(?1))";
  ops.push(db.prepare(`DELETE FROM session_source WHERE session_id IN (${ses})`).bind(ids), db.prepare(`DELETE FROM dedupe_queue WHERE kind='session' AND (a_id IN (${ses}) OR b_id IN (${ses}))`).bind(ids),
    db.prepare(`UPDATE merge_log SET undone=1 WHERE (kind='session' AND into_id IN (${ses})) OR (kind='event' AND (from_id IN (SELECT value FROM json_each(?1)) OR into_id IN (SELECT value FROM json_each(?1))))`).bind(ids));
  for (const x of EVENT_TABLES) ops.push(db.prepare(`DELETE FROM ${x.table} WHERE event_id IN (SELECT value FROM json_each(?))`).bind(ids));
  ops.push(db.prepare("DELETE FROM event_source WHERE event_id IN (SELECT value FROM json_each(?))").bind(ids), db.prepare("DELETE FROM dedupe_queue WHERE kind='event' AND (a_id IN (SELECT value FROM json_each(?1)) OR b_id IN (SELECT value FROM json_each(?1)))").bind(ids),
    db.prepare("DELETE FROM events WHERE id IN (SELECT value FROM json_each(?))").bind(ids));
  return ops;
}
// Loeschmarke einer Session: nur ein Hash ihrer Quellen-Kennung (die Kennung kann den Sessionize-Namen eines Speakers enthalten)
export const sessionTomb = (kind, ref) => hash24("session|" + kind + "|" + ref);
// Eine Session loeschen (Anweisungen fuer eine Batch): Quellen, Einladungen und Warteschlange mit. tomb = Loeschmarken je Quelle setzen,
// damit Abgleich und erneuter Import die vom Veranstalter geloeschte Session nicht wiederbringen.
export async function sessionDeleteOps(db, sid, tomb = true, t = now()) {
  const kids = (await db.prepare("SELECT id FROM event_sessions WHERE id=?1 OR merged_into=?1").bind(sid).all()).results || [], ids = JSON.stringify(kids.map((k) => k.id)), ops = [];
  if (tomb) for (const s of (await db.prepare("SELECT DISTINCT kind,ref FROM session_source WHERE session_id IN (SELECT value FROM json_each(?))").bind(ids).all()).results || []) ops.push(db.prepare("INSERT OR IGNORE INTO event_tombstone(kind,ref,day,title,created) VALUES('session',?,'','',?)").bind(await sessionTomb(s.kind, s.ref), t));
  return [...ops, db.prepare("DELETE FROM session_source WHERE session_id IN (SELECT value FROM json_each(?))").bind(ids), db.prepare("DELETE FROM speaker_invites WHERE session_id IN (SELECT value FROM json_each(?))").bind(ids),
    db.prepare("DELETE FROM dedupe_queue WHERE kind='session' AND (a_id IN (SELECT value FROM json_each(?1)) OR b_id IN (SELECT value FROM json_each(?1)))").bind(ids),
    db.prepare("UPDATE merge_log SET undone=1 WHERE kind='session' AND (from_id IN (SELECT value FROM json_each(?1)) OR into_id IN (SELECT value FROM json_each(?1)))").bind(ids),
    db.prepare("DELETE FROM event_sessions WHERE id IN (SELECT value FROM json_each(?))").bind(ids)];
}
// Konto wird geloescht: alles entfernen, was der Import ueber dieses Konto gespeichert hat (Anweisungen fuer eine Batch) –
// Beanspruchungen, Vorschau, das an Speaker-Identitaeten gemerkte Profil, die selbst importierten Speaker-Eintraege samt deren Quellen-Kennung
// (sie enthaelt den Sessionize-Namen), die Speaker-Identitaet selbst (Name), sobald keine Session mehr auf sie verweist, und den Eintrag der Person
// in den Vorher-/Nachher-Staenden des Protokolls (merge_log.snapshot). Protokolle und Entscheidungen bleiben ohne Personenbezug.
// Die Anweisungen gehoeren ans ENDE der Batch (nach dem Loeschen der Events und offenen Vorschlaege des Kontos): die Pruefung "verweist noch eine Session
// auf die Identitaet?" laeuft in SQL zum Zeitpunkt der Ausfuehrung.
export async function forgetImporter(db, uid) {
  const h = (await db.prepare("SELECT handle FROM profiles WHERE user_id=?").bind(uid).first())?.handle || "", ops = [], gone = new Set();
  const refs = ((await db.prepare("SELECT DISTINCT x.ref FROM session_source x JOIN event_sessions s ON s.id=x.session_id WHERE x.kind='sessionize_profile' AND s.proposer_id=?").bind(uid).all()).results || []).map((r) => r.ref), rj = JSON.stringify(refs);
  if (refs.length) {
    const rows = (await db.prepare("SELECT s.id,s.speakers,s.proposer_id,s.merged_into,(SELECT COUNT(*) FROM session_source o WHERE o.session_id=s.id AND NOT (o.kind='sessionize_profile' AND o.ref IN (SELECT value FROM json_each(?1)))) other FROM event_sessions s WHERE s.id IN (SELECT session_id FROM session_source WHERE kind='sessionize_profile' AND ref IN (SELECT value FROM json_each(?1)))").bind(rj).all()).results || [];
    for (const r of rows) {
      const sp = parse(r.speakers, []), rest = h ? sp.filter((x) => x.h !== h) : sp;
      for (const x of sp) if (h && x.h === h && x.r) gone.add(x.r);
      if (r.merged_into || (!rest.length && !r.other && r.proposer_id === uid)) ops.push(...(await sessionDeleteOps(db, r.id, false)));   // nur dieser Import trug die Session
      else if (rest.length !== sp.length) ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(rest), r.id));
    }
    ops.push(db.prepare("DELETE FROM session_source WHERE kind='sessionize_profile' AND ref IN (SELECT value FROM json_each(?))").bind(rj));
  }
  ops.push(db.prepare("DELETE FROM event_claims WHERE user_id=?").bind(uid), db.prepare("DELETE FROM import_preview WHERE user_id=?").bind(uid),
    db.prepare("UPDATE merge_log SET by_user=0 WHERE by_user=?").bind(uid), db.prepare("UPDATE dedupe_queue SET decided_by=0 WHERE decided_by=?").bind(uid));
  if (h) {
    for (const r of (await db.prepare("SELECT id FROM speaker_ref WHERE handle=?").bind(h).all()).results || []) gone.add(r.id);
    ops.push(db.prepare("UPDATE speaker_ref SET handle='' WHERE handle=?").bind(h));
    // Protokoll: den Eintrag der Person (Name + Profil) aus den gemerkten Speaker-Listen nehmen; die Zusammenfuehrung selbst bleibt nachvollziehbar
    const drop = (js) => { const a = parse(js, null); if (!Array.isArray(a)) return js; const b = a.filter((x) => x?.h !== h); return b.length === a.length ? js : JSON.stringify(b); };
    for (const l of (await db.prepare("SELECT id,kind,snapshot FROM merge_log WHERE kind IN ('session','speaker') AND snapshot LIKE ? LIMIT 500").bind(`%${h}%`).all()).results || []) {
      const s = parse(l.snapshot, null); if (!s || typeof s !== "object") continue;
      for (const o of [s.into_before, s.into_after]) if (o && typeof o.speakers === "string") o.speakers = drop(o.speakers);
      if (s.into_before?.handle === h) s.into_before.handle = "";
      for (const x of Array.isArray(s.sessions) ? s.sessions : []) { x.before = drop(x.before); x.after = drop(x.after); }
      const js = JSON.stringify(s); if (js !== l.snapshot) ops.push(db.prepare("UPDATE merge_log SET snapshot=? WHERE id=?").bind(js, l.id));
    }
  }
  if (gone.size) {   // Speaker-Identitaeten dieses Kontos: weg, sobald keine Session mehr auf sie verweist (sonst bleibt nur der Name, den ein Veranstalter in seinem Programm fuehrt)
    const ids = JSON.stringify([...gone]), orphan = "id IN (SELECT value FROM json_each(?1)) AND NOT EXISTS (SELECT 1 FROM event_sessions s, json_each(CASE WHEN json_valid(s.speakers) THEN s.speakers ELSE '[]' END) j WHERE json_extract(j.value,'$.r')=speaker_ref.id)";
    const dead = "(SELECT value FROM json_each(?1) WHERE value NOT IN (SELECT id FROM speaker_ref))";
    ops.push(db.prepare(`DELETE FROM speaker_ref WHERE ${orphan}`).bind(ids),
      db.prepare(`DELETE FROM dedupe_queue WHERE kind='speaker' AND (a_id IN ${dead} OR b_id IN ${dead})`).bind(ids),
      db.prepare(`UPDATE merge_log SET undone=1,snapshot='{}' WHERE kind='speaker' AND (from_id IN ${dead} OR into_id IN ${dead})`).bind(ids));
  }
  return ops;
}

// ---------------------------------------------------------------- Speaker
function unionSpeakers(a, b) {
  const out = [], at = new Map();
  const keys = (e) => [e.r ? "r" + e.r : "", e.h ? "h" + e.h : "", e.sz ? "z" + e.sz : "", "n" + normPerson(e.n)].filter((k) => k.length > 1);
  for (const e of [...a, ...b]) {
    const hit = keys(e).find((k) => at.has(k));
    if (hit === undefined) { out.push({ ...e }); for (const k of keys(e)) at.set(k, out.length - 1); continue; }
    const i = at.get(hit), c = out[i];
    // Status: ein verknuepftes Profil wird nur durch einen Eintrag desselben Profils bestaetigt (nie stillschweigend durch einen blossen Namenseintrag)
    if ((RANK[e.s] || 0) > (RANK[c.s] || 0) && (c.h ? e.h === c.h : !e.h)) c.s = e.s;
    if (!c.h && e.h) { c.h = e.h; c.s = e.s; }
    for (const f of ["e", "r", "sz", "t"]) if (!c[f] && e[f]) c[f] = e[f];
    if (!c.h && e.n && e.n.length > (c.n || "").length) c.n = e.n;
    if (c.h) { delete c.t; delete c.o; }   // verknuepfte Profile brauchen keinen Einladungslink
    for (const k of keys(c)) at.set(k, i);
  }
  return out;
}
export { unionSpeakers };
// Speaker der massgeblichen Quelle einspielen: Eintraege ohne Quellen-Kennung (von Hand, Profil-Import) bleiben, zurueckgezogene Quellen-Speaker entfallen,
// verbleibende behalten Profil, Status und Einladungslink.
function replaceFromSource(cur, next) {
  const want = new Set(next.map((e) => e.sz)), out = cur.filter((e) => !e.sz || want.has(e.sz)).map((e) => ({ ...e }));
  for (const e of next) {
    let c = out.find((x) => x.sz === e.sz) || out.find((x) => !x.sz && ((x.r && x.r === e.r) || normPerson(x.n) === normPerson(e.n)));
    if (!c) { out.push({ ...e }); continue; }
    c.sz = e.sz; c.r = c.r || e.r; if (!c.h) { c.n = e.n; if (e.h) { c.h = e.h; c.s = e.s; delete c.t; delete c.o; } }
  }
  return out;
}
// Speaker-Identitaeten fuer viele Kandidaten auf einmal: Sessionize-Kennung (sicher) oder gleicher Name im selben Event.
// Allein ueber den Namen wird quer ueber Events nie verbunden (solche Paare gehen als "moegliche Dublette" an die Admins), und ein Mitgliedsprofil
// wird nie ueber den blossen Namen zugeordnet: dafuer gibt es "Bist du das?" (/api/speaker/claim), das die Person selbst anstoesst.
// Importiert ein Mitglied sein eigenes Profil mit starkem Nachweis (opts.linkHandle), ist das Profil selbst die Identitaet: eine Zeile je Profil.
// cands: [{ n, sz, h }]; local = Kennungen (speaker_ref.id), die im Event schon vorkommen. Liefert key(c) -> { id, handle } und die noetigen Anweisungen.
const spKey = (c) => (c.sz ? "z" + c.sz : "n" + normPerson(c.n));
async function resolveSpeakers(db, cands, local, opts, t) {
  const out = new Map(), ops = []; if (!cands.length) return { out, ops };
  const uniq = [...new Map(cands.map((c) => [spKey(c), c])).values()];
  const [bySz, byName, byHandle] = await db.batch([
    db.prepare("SELECT * FROM speaker_ref WHERE merged_into=0 AND sessionize_id<>'' AND sessionize_id IN (SELECT value FROM json_each(?)) ORDER BY id").bind(JSON.stringify(uniq.map((c) => c.sz).filter(Boolean))),
    db.prepare("SELECT * FROM speaker_ref WHERE merged_into=0 AND name_key<>'' AND name_key IN (SELECT value FROM json_each(?)) ORDER BY id").bind(JSON.stringify([...new Set(uniq.map((c) => normPerson(c.n)).filter(Boolean))])),
    db.prepare("SELECT * FROM speaker_ref WHERE merged_into=0 AND handle<>'' AND handle IN (SELECT value FROM json_each(?)) ORDER BY id").bind(JSON.stringify(opts.linkHandle ? uniq.map((c) => c.h).filter(Boolean) : [])),
  ]);
  const fresh = [];
  for (const c of uniq) {
    const nk = normPerson(c.n), same = (byName.results || []).filter((r) => r.name_key === nk && !(c.sz && r.sessionize_id && r.sessionize_id !== c.sz));   // widerspruechliche Sessionize-Kennungen: zwei Personen
    const ref = (c.sz && (bySz.results || []).find((r) => r.sessionize_id === c.sz)) || same.find((r) => local.has(r.id)) || (c.h && (byHandle.results || []).find((r) => r.handle === c.h));
    if (!ref) { fresh.push({ c, nk, same }); continue; }
    const handle = ref.handle || (opts.linkHandle && c.h) || "";
    if ((c.sz && !ref.sessionize_id) || handle !== ref.handle) ops.push(db.prepare("UPDATE speaker_ref SET sessionize_id=CASE WHEN sessionize_id='' THEN ? ELSE sessionize_id END,handle=CASE WHEN handle='' THEN ? ELSE handle END,updated=? WHERE id=?").bind(c.sz || "", handle, t, ref.id));
    out.set(spKey(c), { id: ref.id, handle: ref.handle || "" });
  }
  if (fresh.length) {
    const res = await runBatch(db, fresh.map(({ c, nk }) => db.prepare("INSERT INTO speaker_ref(name,name_key,sessionize_id,handle,created,updated) VALUES(?,?,?,?,?,?)").bind(c.n, nk, c.sz || "", (opts.linkHandle && c.h) || "", t, t)));
    fresh.forEach(({ c, same }, i) => {
      const id = res[i]?.meta?.last_row_id; out.set(spKey(c), { id, handle: "" }); local.add(id);
      if (!c.h) for (const r of same.slice(0, 3)) ops.push(queueStmt(db, "speaker", r.id, id, "name_without_shared_event", t));   // gleicher Name, aber nirgends gemeinsam aufgetreten (Eintraege mit Mitgliedsprofil haengen am Profil: kein Fall fuer die Warteschlange)
    });
  }
  return { out, ops };
}

// ---------------------------------------------------------------- Sessions
const LEVELS = ["100", "200", "300", "400"];
const timeOk = (s) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s || "") || /^\d{4}-\d{2}-\d{2}$/.test(s || "");
function cleanSession(c) {
  const title = scrubLine(c?.title, 140); if (title.length < 3) return null;
  const start = timeOk(c.start) ? c.start : "", end = timeOk(c.end) && (!start || c.end >= start) ? c.end : "", speakers = [];
  for (const s of (Array.isArray(c.speakers) ? c.speakers : []).slice(0, 12)) {
    const n = scrubLine(s?.n, 80); if (n.length < 2) continue;
    speakers.push({ n, sz: /^[A-Za-z0-9-]{1,64}$/.test(String(s.sz || "")) ? String(s.sz) : "", h: /^[a-z0-9][a-z0-9-]{2,29}$/.test(s.h || "") ? s.h : "", s: ["confirmed", "invited"].includes(s.s) ? s.s : "" });
  }
  return { title, tk: normSessionTitle(title), abstract: scrub(c.abstract, 1500), start, end, room: scrubLine(c.room, 60), track: scrubLine(c.track, 60), level: LEVELS.includes(String(c.level || "").slice(0, 3)) ? String(c.level).slice(0, 3) : "",
    lang: scrubLine(c.lang, 10).replace(/[^A-Za-z-]/g, ""), recording_url: httpsUrl(c.recording_url), sessionize_id: /^[A-Za-z0-9-]{1,40}$/.test(String(c.sessionize_id || "")) ? String(c.sessionize_id) : "", speakers };
}
// Gleiche Session? Schluessel immer aus dem Titel (die Spalte title_key ist nur ein Zwischenspeicher fuer SQL). high | low | null
function sessionMatch(a, b) {
  if (a.sessionize_id && b.sessionize_id) return a.sessionize_id === b.sessionize_id ? "high" : null;   // verschiedene Sessionize-IDs sind verschiedene Sessions
  const ka = a.tk ?? normSessionTitle(a.title), kb = b.tk ?? normSessionTitle(b.title), ov = overlaps(a.start, a.end, b.start, b.end);
  if (ka && ka === kb) return ov === false ? null : "high";
  if (ka && kb && ov !== false && jaccard(ka, kb) >= 0.8) return "low";
  return null;
}
// Veroeffentlichte Session eines Events, die sicher dieselbe ist wie der Kandidat (oder null)
export function matchSession(ctx, cand) { const c = cleanSession(cand); return (c && ctx.rows.find((r) => r.status === "live" && sessionMatch(c, r) === "high")) || null; }
const sepKey = (a, b) => pairOf(a, b).join(":");
// Alles, was der Abgleich ueber die Sessions eines Events wissen muss, in EINEM D1-Aufruf
export async function sessionCtx(db, eventId) {
  const [r, s, q] = await db.batch([
    db.prepare("SELECT * FROM event_sessions WHERE event_id=? AND merged_into=0 ORDER BY id").bind(eventId),
    db.prepare("SELECT x.session_id,x.kind,x.ref,x.hash FROM session_source x JOIN event_sessions s ON s.id=x.session_id WHERE s.event_id=? AND s.merged_into=0").bind(eventId),
    db.prepare("SELECT a_id,b_id FROM dedupe_queue WHERE kind='session' AND status='separate' AND a_id IN (SELECT id FROM event_sessions WHERE event_id=?)").bind(eventId),
  ]);
  const ctx = { rows: r.results || [], byRef: new Map(), sourced: new Set(), separate: new Set((q.results || []).map((p) => sepKey(p.a_id, p.b_id))) };
  const byId = new Map(ctx.rows.map((x) => [x.id, x]));
  for (const x of s.results || []) { ctx.sourced.add(x.session_id); ctx.byRef.set(x.kind + "|" + x.ref, { row: byId.get(x.session_id), hash: x.hash }); }
  return ctx;
}
const inviteStmts = (db, eventId, sid, sp, t) => [db.prepare("DELETE FROM speaker_invites WHERE session_id=? AND token NOT IN (SELECT value FROM json_each(?))").bind(sid, JSON.stringify(sp.filter((x) => x.t && !x.h).map((x) => x.t))),
  ...sp.filter((x) => x.t && !x.h).map((x) => db.prepare("INSERT OR IGNORE INTO speaker_invites(token,event_id,session_id,name,eid,created) VALUES(?,?,?,?,?,?)").bind(x.t, eventId, sid, x.n, x.e || "", t))];
const SES_TEXT = ["title", "abstract", "start", "end", "room", "track", "level", "lang", "recording_url"];
// Sessions eines Events gebuendelt anlegen, auffrischen oder zusammenfuehren: wenige D1-Aufrufe, unabhaengig von der Anzahl.
// items: [{ cand: { title, abstract, start, end, room, track, level, lang, recording_url, sessionize_id, speakers:[{ n, sz, h, s }] }, source: { kind, ref, url, hash } | null }]
// opts: now, by, trusted (Namen ohne Profil gelten als vom Veranstalter bestaetigt), status (live | pending), proposer_id,
//       authoritative (die Quelle ist massgeblich fuer Sessions, die sie selbst geliefert hat; von Hand geaenderte Felder bleiben),
//       propose (Vorschlag eines Mitglieds an ein fremdes Event: bestehende Sessions werden nicht angefasst), linkHandle (Profil auch an der Speaker-Identitaet merken)
// Ergebnis je Eintrag: { action: created | updated | merged | skipped, id, log?, reason? }
export async function upsertSessions(db, eventId, items, opts = {}, ctx = null) {
  const t = opts.now || now(), status = opts.status || "live";
  ctx = ctx || await sessionCtx(db, eventId);
  const results = items.map(() => null), work = [];
  items.forEach((it, i) => {
    const c = cleanSession(it.cand); if (!c) { results[i] = { action: "skipped", reason: "bad_data" }; return; }
    const source = it.source?.ref ? { kind: String(it.source.kind), ref: String(it.source.ref).slice(0, 300), url: safeUrl(it.source.url), hash: it.source.hash || "" } : null;
    work.push({ i, c, source });
  });
  for (const w of work) if (w.source) w.tomb = await sessionTomb(w.source.kind, w.source.ref);
  if (work.some((w) => w.tomb)) {   // vom Veranstalter geloeschte Sessions kommen nicht zurueck
    const dead = new Set(((await db.prepare("SELECT ref FROM event_tombstone WHERE kind='session' AND ref IN (SELECT value FROM json_each(?))").bind(JSON.stringify(work.map((w) => w.tomb).filter(Boolean))).all()).results || []).map((x) => x.ref));
    for (const w of work) if (w.tomb && dead.has(w.tomb)) { results[w.i] = { action: "skipped", reason: "deleted" }; w.skip = true; }
  }
  const todo = work.filter((w) => !w.skip), local = new Set();
  for (const r of ctx.rows) for (const e of parse(r.speakers, [])) if (e.r) local.add(e.r);
  const sp = await resolveSpeakers(db, todo.flatMap((w) => w.c.speakers), local, opts, t);
  const entries = (c) => c.speakers.map((x) => {
    const ref = sp.out.get(spKey(x)), e = { n: x.n, r: ref.id, s: x.s || (opts.trusted ? "confirmed" : "invited") };
    if (x.sz) e.sz = x.sz;
    if (x.h) e.h = x.h;   // ausdruecklich angegeben (eigenes Profil des Importierenden)
    else if (ref.handle) { e.h = ref.handle; e.s = "invited"; }   // abgeleitet aus der gemerkten Identitaet (nur nach starkem Nachweis gesetzt): die Person bestaetigt selbst
    if (!e.h) { e.o = 1; e.t = rndToken(); }
    return e;
  });
  // 1) Zuordnen (im Speicher) und neue Zeilen anlegen
  const inserts = [];
  for (const w of todo) {
    const known = w.source && ctx.byRef.get(w.source.kind + "|" + w.source.ref);
    w.sp = entries(w.c);
    const matches = ctx.rows.map((r) => ({ row: r, c: sessionMatch(w.c, r) })).filter((x) => x.c);
    if (opts.propose) {   // fremdes Event: nur der eigene offene Vorschlag wird fortgeschrieben; veroeffentlichte Sessions bleiben unberuehrt
      const own = (r) => !!r && r.status === "pending" && r.proposer_id === (opts.proposer_id || 0);
      const mine = own(known?.row) ? known.row : matches.find((x) => x.c === "high" && own(x.row))?.row;
      if (mine) { w.mode = "update"; w.row = mine; continue; }
      if (known?.row) { w.mode = "skip"; results[w.i] = { action: "skipped", reason: "exists" }; continue; }
      w.mode = "create"; w.status = "pending"; w.low = [];
    } else if (known?.row) { w.mode = "update"; w.row = known.row; continue; }
    else {
      const high = matches.find((x) => x.c === "high" && x.row.status !== "pending");
      if (high) { w.mode = "absorb"; w.row = high.row; }
      else { w.mode = "create"; w.status = status; w.low = matches.filter((x) => x.c === "low").map((x) => x.row.id); }
    }
    w.at = inserts.length;
    inserts.push(db.prepare("INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created,title_key,sessionize_id,merged_into) VALUES(?,?,?,?,?,?,?,?,?,'[]',?,?,?,?,?,?,?,?)")
      .bind(eventId, w.c.title, w.c.abstract, w.c.start, w.c.end, w.c.room, w.c.track, w.c.level, w.c.lang, JSON.stringify(w.mode === "absorb" ? w.sp.map(({ t: _t, ...x }) => x) : w.sp), w.c.recording_url, w.mode === "absorb" ? "merged" : w.status, opts.proposer_id || 0, t, w.c.tk || "-", w.c.sessionize_id, w.mode === "absorb" ? w.row.id : 0));
  }
  const ins = await runBatch(db, inserts);
  // 2) Aendern, Quellen, Einladungen, Protokoll
  const ops = [...sp.ops], logAt = [];
  for (const w of todo) {
    if (w.mode === "skip") continue;
    const c = w.c, nid = w.at !== undefined ? ins[w.at]?.meta?.last_row_id : 0;
    if (w.mode === "create") {
      if (w.source) ops.push(sesSourceStmt(db, nid, w.source, t));
      ops.push(...inviteStmts(db, eventId, nid, w.sp, t).slice(1), ...w.low.map((id) => queueStmt(db, "session", id, nid, "similar_title", t)));
      ctx.rows.push({ id: nid, event_id: eventId, title: c.title, abstract: c.abstract, start: c.start, end: c.end, room: c.room, track: c.track, level: c.level, lang: c.lang, speakers: JSON.stringify(w.sp), recording_url: c.recording_url, status: w.status, proposer_id: opts.proposer_id || 0, sessionize_id: c.sessionize_id, merged_into: 0, edited_fields: "" });
      if (w.source) { ctx.sourced.add(nid); ctx.byRef.set(w.source.kind + "|" + w.source.ref, { row: ctx.rows[ctx.rows.length - 1], hash: w.source.hash }); }
      results[w.i] = { action: "created", id: nid }; continue;
    }
    const row = w.row, lock = locked(row), cur = parse(row.speakers, []), nu = {};
    const auth = w.mode === "update" && opts.authoritative;   // dieselbe Quelle liefert ihren eigenen Datensatz erneut
    // Eine von Hand angelegte Session (bisher ohne Quelle) bekommt eine Quelle: was der Veranstalter eingetragen hat, gilt als von Hand gepflegt und bleibt bei jedem spaeteren Abgleich stehen
    const manual = w.mode === "absorb" && w.source && !ctx.sourced.has(row.id) ? [...SES_TEXT.filter((f) => row[f]), ...(cur.length ? ["speakers"] : [])] : [];
    for (const f of SES_TEXT) {
      if (lock.has(f)) continue;
      if (auth ? f !== "lang" && (f !== "level" || c.level) && c[f] !== row[f] : !row[f] && c[f] && f !== "title") nu[f] = c[f];
    }
    if (nu.title !== undefined) nu.title_key = c.tk || "-";
    if (!row.sessionize_id && c.sessionize_id) nu.sessionize_id = c.sessionize_id;
    if (!lock.has("speakers")) {
      const next = auth ? replaceFromSource(cur, w.sp) : unionSpeakers(cur, w.sp);
      for (const x of next) if (!x.h && !x.t) x.t = rndToken();
      const js = JSON.stringify(next); if (js !== row.speakers) { nu.speakers = js; w.next = next; }
    }
    if (manual.length && markEdited(row.edited_fields, manual) !== (row.edited_fields || "")) nu.edited_fields = markEdited(row.edited_fields, manual);
    const before = Object.fromEntries(Object.keys(nu).map((k) => [k, row[k] ?? ""]));
    if (Object.keys(nu).length) ops.push(setCols(db, "event_sessions", row.id, nu));
    if (w.mode === "update" && row.status === "retired" && status === "live") { ops.push(db.prepare("UPDATE event_sessions SET status='live' WHERE id=? AND status='retired'").bind(row.id)); row.status = "live"; }
    if (w.next) ops.push(...inviteStmts(db, eventId, row.id, w.next, t));
    if (w.mode === "update") { if (w.source) ops.push(sesSourceStmt(db, row.id, w.source, t)); results[w.i] = { action: "updated", id: row.id, changed: Object.keys(nu).length > 0 }; }
    else {   // absorb: der Kandidat steht als ausgeblendete Zeile nid, die Zusammenfuehrung ist protokolliert und umkehrbar
      const added = w.source && !ctx.byRef.has(w.source.kind + "|" + w.source.ref) ? [w.source] : [];
      if (w.source) { ops.push(sesSourceStmt(db, nid, w.source, t), sesSourceStmt(db, row.id, w.source, t)); ctx.sourced.add(row.id); ctx.byRef.set(w.source.kind + "|" + w.source.ref, { row, hash: w.source.hash }); }
      logAt.push([w.i, ops.length]);
      ops.push(logStmt(db, "session", nid, row.id, { into_before: before, into_after: nu, from_status: status, added_sources: added.map(({ kind, ref }) => ({ kind, ref })), invites: [] }, true, opts.by, t));
      results[w.i] = { action: "merged", id: row.id };
    }
    Object.assign(row, nu);
  }
  const res = await runBatch(db, ops, 50);
  for (const [i, at] of logAt) results[i].log = res[at]?.meta?.last_row_id || 0;
  return { results, ctx };
}
// Eine Session anlegen oder zusammenfuehren (siehe upsertSessions). source: { kind, ref, url }
export async function upsertSession(db, eventId, cand, source, opts = {}) {
  return (await upsertSessions(db, eventId, [{ cand, source }], opts)).results[0];
}

// ---------------------------------------------------------------- Zusammenfuehren (umkehrbar)
const idOf = (res) => res[res.length - 1]?.meta?.last_row_id || 0;
// Session a geht in Session b auf. Von Hand Eingetragenes in b bleibt: es werden nur leere Felder gefuellt und Speaker ergaenzt.
export async function mergeSessions(db, fromId, intoId, by = 0, auto = false) {
  const [ra, rb, rs, ri] = await db.batch([
    db.prepare("SELECT * FROM event_sessions WHERE id=? AND merged_into=0").bind(fromId), db.prepare("SELECT * FROM event_sessions WHERE id=? AND merged_into=0").bind(intoId),
    db.prepare("SELECT session_id,kind,ref,url,hash FROM session_source WHERE session_id IN (?,?)").bind(fromId, intoId), db.prepare("SELECT token FROM speaker_invites WHERE session_id=?").bind(fromId),
  ]);
  const a = ra.results?.[0], b = rb.results?.[0]; if (!a || !b || a.id === b.id) return { error: "not_found" };
  const t = now(), lock = locked(b), nu = {};
  for (const f of ["abstract", "start", "end", "room", "track", "level", "lang", "recording_url", "sessionize_id"]) if (!lock.has(f) && !b[f] && a[f]) nu[f] = a[f];
  if (!lock.has("speakers")) { const js = JSON.stringify(unionSpeakers(parse(b.speakers, []), parse(a.speakers, []))); if (js !== b.speakers) nu.speakers = js; }
  const src = rs.results || [], added = src.filter((s) => s.session_id === a.id && !src.some((x) => x.session_id === b.id && x.kind === s.kind && x.ref === s.ref));
  const snap = { into_before: Object.fromEntries(Object.keys(nu).map((k) => [k, b[k] ?? ""])), into_after: nu, from_status: a.status, added_sources: added.map(({ kind, ref }) => ({ kind, ref })), invites: (ri.results || []).map((x) => x.token) };
  const ops = [];
  if (Object.keys(nu).length) ops.push(setCols(db, "event_sessions", b.id, nu));
  for (const s of added) ops.push(sesSourceStmt(db, b.id, s, t));
  ops.push(db.prepare("UPDATE speaker_invites SET session_id=? WHERE session_id=?").bind(b.id, a.id), db.prepare("UPDATE event_sessions SET merged_into=?,status='merged' WHERE id=?").bind(b.id, a.id),
    mergedStmt(db, "session", a.id, b.id, by, t), logStmt(db, "session", a.id, b.id, snap, auto, by, t));
  return { ok: true, log: idOf(await db.batch(ops)) };
}
// Event a geht in Event b auf (die Richtung waehlt der Aufrufer: das von Hand gepflegte Event bleibt). Alles aus EVENT_TABLES wandert mit.
export async function mergeEvents(db, fromId, intoId, by = 0, auto = false) {
  const moveSel = (x) => (x.key ? db.prepare(`SELECT ${x.key} k FROM ${x.table} WHERE event_id=?1 AND ${x.key} NOT IN (SELECT ${x.key} FROM ${x.table} WHERE event_id=?2)`) : db.prepare(`SELECT 1 k FROM ${x.table} WHERE event_id=?1 AND NOT EXISTS (SELECT 1 FROM ${x.table} WHERE event_id=?2)`)).bind(fromId, intoId);
  const [ra, rb, rs, ...mv] = await db.batch([
    db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(fromId), db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(intoId),
    db.prepare("SELECT event_id,kind,ref,url FROM event_source WHERE event_id IN (?,?)").bind(fromId, intoId), ...EVENT_TABLES.map(moveSel),
  ]);
  const a = ra.results?.[0], b = rb.results?.[0]; if (!a || !b || a.id === b.id) return { error: "not_found" };
  const t = now(), f = fillEvent(b, a), src = rs.results || [], added = src.filter((s) => s.event_id === a.id && !src.some((x) => x.event_id === b.id && x.kind === s.kind && x.ref === s.ref));
  const moved = {}, ops = [];
  if (Object.keys(f.after).length) ops.push(setCols(db, "events", b.id, f.after, [t], ",updated=?"));
  for (const s of added) ops.push(evSourceStmt(db, b.id, s, t));
  EVENT_TABLES.forEach((x, i) => {
    const keys = (mv[i].results || []).map((r) => r.k); if (!keys.length) return;
    moved[x.table] = x.key ? keys : true;
    ops.push(x.key ? db.prepare(`UPDATE ${x.table} SET event_id=?1 WHERE event_id=?2 AND ${x.key} IN (SELECT value FROM json_each(?3))`).bind(b.id, a.id, JSON.stringify(keys)) : db.prepare(`UPDATE ${x.table} SET event_id=?1 WHERE event_id=?2`).bind(b.id, a.id));
  });
  ops.push(db.prepare("UPDATE events SET merged_into=?,public=0 WHERE id=?").bind(b.id, a.id), mergedStmt(db, "event", a.id, b.id, by, t),
    logStmt(db, "event", a.id, b.id, { into_before: f.before, into_after: f.after, from_public: a.public, added_sources: added.map(({ kind, ref }) => ({ kind, ref })), moved, session_logs: [] }, auto, by, t));
  const id = idOf(await runBatch(db, ops, 60));
  const dd = await dedupeEventSessions(db, b.id, by);   // die dabei vereinten Sessions gehoeren zu dieser Zusammenfuehrung und werden mit ihr zurueckgenommen
  if (dd.logs.length) await db.prepare("UPDATE merge_log SET snapshot=json_set(snapshot,'$.session_logs',json(?)) WHERE id=?").bind(JSON.stringify(dd.logs), id).run();
  return { ok: true, log: id };
}
// Doppelte Sessions innerhalb eines Events: sichere Treffer vereinen (protokolliert), unsichere in die Warteschlange.
// Zwei von Hand angelegte Sessions werden nie automatisch vereint, "getrennt lassen" wird beachtet; je Aufruf hoechstens opts.max Zusammenfuehrungen.
export async function dedupeEventSessions(db, eventId, by = 0, opts = {}) {
  const ctx = opts.ctx || await sessionCtx(db, eventId), max = opts.max ?? 8, t = now(), rows = ctx.rows.filter((r) => r.status === "live" && !r.merged_into);
  const used = new Set(), plan = [], queue = [], logs = []; let more = false;
  for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
    const a = rows[i], b = rows[j], c = sessionMatch(a, b); if (!c || ctx.separate.has(sepKey(a.id, b.id))) continue;
    const manA = !ctx.sourced.has(a.id), manB = !ctx.sourced.has(b.id);
    if (c === "low" || (manA && manB)) { queue.push(queueStmt(db, "session", a.id, b.id, c === "low" ? "similar_title" : "same_title", t)); continue; }
    if (used.has(a.id) || used.has(b.id)) { more = true; continue; }
    if (plan.length >= max) { more = true; continue; }
    used.add(a.id); used.add(b.id); plan.push(manB && !manA ? [a.id, b.id] : [b.id, a.id]);   // die von Hand angelegte bleibt, sonst die aeltere
  }
  let queued = 0; for (const r of await runBatch(db, queue.slice(0, 80), 80)) queued += Number(r?.meta?.changes || 0);
  for (const [from, into] of plan) { const r = await mergeSessions(db, from, into, by, true); if (r.ok) logs.push(r.log); }
  return { merged: logs.length, queued, logs, more };
}
export async function mergeSpeakerRefs(db, fromId, intoId, by = 0, auto = false) {
  const a = await db.prepare("SELECT * FROM speaker_ref WHERE id=? AND merged_into=0").bind(fromId).first(), b = await db.prepare("SELECT * FROM speaker_ref WHERE id=? AND merged_into=0").bind(intoId).first();
  if (!a || !b || a.id === b.id) return { error: "not_found" };
  const t = now(), sessions = [], ops = [];
  const rows = (await db.prepare("SELECT id,speakers FROM event_sessions WHERE speakers LIKE ? OR speakers LIKE ?").bind(`%"r":${a.id},%`, `%"r":${a.id}}%`).all()).results || [];
  for (const s of rows) {
    const sp = parse(s.speakers, []); if (!sp.some((x) => x.r === a.id)) continue;
    const next = unionSpeakers(sp.filter((x) => x.r !== a.id && x.r !== b.id), [...sp.filter((x) => x.r === b.id), ...sp.filter((x) => x.r === a.id).map((x) => ({ ...x, r: b.id }))]);
    // Reihenfolge der Speaker beibehalten: nach Position des ersten Treffers
    const ord = sp.map((x) => (x.r === a.id ? b.id : x.r)), pos = (x) => { const i = ord.indexOf(x.r); return i < 0 ? 999 : i; };
    next.sort((x, y) => pos(x) - pos(y));
    sessions.push({ id: s.id, before: s.speakers, after: JSON.stringify(next) });
    ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(next), s.id));
  }
  ops.push(db.prepare("UPDATE speaker_ref SET sessionize_id=CASE WHEN sessionize_id='' THEN ? ELSE sessionize_id END,handle=CASE WHEN handle='' THEN ? ELSE handle END,name=?,updated=? WHERE id=?").bind(a.sessionize_id, a.handle, richer(b.name, a.name), t, b.id),
    db.prepare("UPDATE speaker_ref SET merged_into=? WHERE id=?").bind(b.id, a.id), mergedStmt(db, "speaker", a.id, b.id, by, t),
    logStmt(db, "speaker", a.id, b.id, { into_before: { sessionize_id: b.sessionize_id, handle: b.handle, name: b.name }, sessions }, auto, by, t));
  return { ok: true, log: idOf(await runBatch(db, ops, 60)) };
}
// Zusammenfuehrung zuruecknehmen (nur einmal). Spalten, die seitdem von Hand geaendert wurden, bleiben stehen; das Paar gilt danach dauerhaft als "getrennt".
export async function unmerge(db, logId, by = 0, nested = false) {
  const l = await db.prepare("SELECT * FROM merge_log WHERE id=? AND undone=0").bind(logId).first(); if (!l) return { error: "not_found" };
  const s = parse(l.snapshot, {}), t = now(), ops = [], before = s.into_before || {}, after = s.into_after;
  const restore = (table) => { for (const c of Object.keys(before)) ops.push(after && c in after ? db.prepare(`UPDATE ${table} SET "${c}"=?1 WHERE id=?2 AND "${c}"=?3`).bind(before[c], l.into_id, after[c]) : db.prepare(`UPDATE ${table} SET "${c}"=? WHERE id=?`).bind(before[c], l.into_id)); };
  if (l.kind === "session") {
    restore("event_sessions");
    ops.push(db.prepare("UPDATE event_sessions SET merged_into=0,status=? WHERE id=?").bind(s.from_status || "live", l.from_id));
    for (const x of s.added_sources || []) ops.push(db.prepare("DELETE FROM session_source WHERE session_id=? AND kind=? AND ref=?").bind(l.into_id, x.kind, x.ref));
    if ((s.invites || []).length) ops.push(db.prepare("UPDATE speaker_invites SET session_id=? WHERE token IN (SELECT value FROM json_each(?))").bind(l.from_id, JSON.stringify(s.invites)));
  } else if (l.kind === "event") {
    // Erst die Sessions trennen, die ueber die beiden Events hinweg vereint wurden: bei dieser Zusammenfuehrung (session_logs) oder danach (z. B. beim naechsten Abgleich)
    const mine = JSON.stringify((s.moved || {}).event_sessions || []);
    const cross = ((await db.prepare("SELECT m.id FROM merge_log m JOIN event_sessions f ON f.id=m.from_id JOIN event_sessions i ON i.id=m.into_id WHERE m.kind='session' AND m.undone=0 AND f.event_id=?1 AND i.event_id=?1 AND (m.from_id IN (SELECT value FROM json_each(?2)))<>(m.into_id IN (SELECT value FROM json_each(?2)))").bind(l.into_id, mine).all()).results || []).map((r) => r.id);
    for (const id of [...new Set([...(s.session_logs || []), ...cross])].sort((x, y) => y - x)) await unmerge(db, id, by, true);
    restore("events");
    ops.push(db.prepare("UPDATE events SET merged_into=0,public=? WHERE id=?").bind(s.from_public ?? 1, l.from_id));
    const fr = await db.prepare("SELECT handle,title FROM events WHERE id=?").bind(l.from_id).first();   // nie sichtbar gewesene Zeile: jetzt eine echte Adresse
    if (fr?.handle.startsWith(HIDDEN)) ops.push(db.prepare("UPDATE events SET handle=? WHERE id=?").bind(await freeHandle(db, fr.title, normEventName(fr.title).year), l.from_id));
    for (const x of EVENT_TABLES) {
      const keys = (s.moved || {})[x.table]; if (!keys) continue;
      ops.push(x.key ? db.prepare(`UPDATE OR IGNORE ${x.table} SET event_id=?1 WHERE event_id=?2 AND ${x.key} IN (SELECT value FROM json_each(?3))`).bind(l.from_id, l.into_id, JSON.stringify(keys)) : db.prepare(`UPDATE OR IGNORE ${x.table} SET event_id=?1 WHERE event_id=?2`).bind(l.from_id, l.into_id));
    }
    for (const x of s.added_sources || []) ops.push(db.prepare("DELETE FROM event_source WHERE event_id=? AND kind=? AND ref=?").bind(l.into_id, x.kind, x.ref));
  } else if (l.kind === "speaker") {
    restore("speaker_ref");
    ops.push(db.prepare("UPDATE speaker_ref SET merged_into=0 WHERE id=?").bind(l.from_id));
    for (const x of s.sessions || []) ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=? AND speakers=?").bind(x.before, x.id, x.after));
  } else return { error: "bad_kind" };
  ops.push(db.prepare("UPDATE merge_log SET undone=1 WHERE id=?").bind(l.id));
  if (!nested) ops.push(separateStmt(db, l.kind, l.from_id, l.into_id, by, t));   // nicht sofort wieder automatisch zusammenfuehren
  await runBatch(db, ops, 60);
  return { ok: true, kind: l.kind };
}
// Entscheidung in der Warteschlange: "merge" fuehrt zusammen, "separate" merkt sich dauerhaft "getrennt lassen"
export async function decideDupe(db, id, action, by) {
  const q = await db.prepare("SELECT * FROM dedupe_queue WHERE id=? AND status='open'").bind(id).first(); if (!q) return { error: "not_found" };
  if (action === "separate") { await db.prepare("UPDATE dedupe_queue SET status='separate',decided=?,decided_by=? WHERE id=?").bind(now(), by, id).run(); return { ok: true, status: "separate" }; }
  if (action !== "merge") return { error: "bad_action" };
  let r;
  if (q.kind === "event") {
    const a = await db.prepare("SELECT * FROM events WHERE id=?").bind(q.a_id).first(), b = await db.prepare("SELECT * FROM events WHERE id=?").bind(q.b_id).first();
    if (!a || !b) return { error: "not_found" };
    const into = protectedEvent(a) !== protectedEvent(b) ? (protectedEvent(a) ? a : b) : a.id < b.id ? a : b, from = into === a ? b : a;   // das von Hand gepflegte Event bleibt
    r = await mergeEvents(db, from.id, into.id, by);
  } else if (q.kind === "session") {
    const man = async (id2) => !(await db.prepare("SELECT 1 x FROM session_source WHERE session_id=? LIMIT 1").bind(id2).first());
    const into = (await man(q.b_id)) && !(await man(q.a_id)) ? q.b_id : q.a_id;
    r = await mergeSessions(db, into === q.a_id ? q.b_id : q.a_id, into, by);
  } else r = await mergeSpeakerRefs(db, q.b_id, q.a_id, by);
  if (r.error) return r;
  await db.prepare("UPDATE dedupe_queue SET status='merged',decided=?,decided_by=? WHERE id=?").bind(now(), by, id).run();
  return { ok: true, status: "merged", log: r.log };
}
const titles = async (db, kind, ids) => {
  const j = JSON.stringify([...new Set(ids)]), sql = kind === "event" ? "SELECT id,title name FROM events WHERE id IN (SELECT value FROM json_each(?))" : kind === "session" ? "SELECT id,title name FROM event_sessions WHERE id IN (SELECT value FROM json_each(?))" : "SELECT id,name FROM speaker_ref WHERE id IN (SELECT value FROM json_each(?))";
  return new Map(((await db.prepare(sql).bind(j).all()).results || []).map((r) => [r.id, r.name]));
};
export async function listDupes(db) {
  const rows = (await db.prepare("SELECT * FROM dedupe_queue WHERE status='open' ORDER BY id LIMIT 100").all()).results || [];
  const side = (kind, id) => (kind === "event" ? db.prepare("SELECT id,handle,title,start,city,mode,source,unclaimed FROM events WHERE id=?")
    : kind === "session" ? db.prepare("SELECT s.id,s.title,s.start,s.room,e.title event,e.handle FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.id=?")
    : db.prepare("SELECT id,name,sessionize_id FROM speaker_ref WHERE id=?")).bind(id);
  const res = await runBatch(db, rows.flatMap((q) => [side(q.kind, q.a_id), side(q.kind, q.b_id)]), 50);   // gebuendelt statt zwei Abfragen je Eintrag
  return rows.map((q, i) => ({ id: q.id, kind: q.kind, reason: q.reason, a: res[2 * i]?.results?.[0] || null, b: res[2 * i + 1]?.results?.[0] || null }));
}
// Letzte Zusammenfuehrungen (auch die automatischen) mit ihrer Protokoll-ID, damit sie sich zuruecknehmen lassen
export async function listMerges(db, limit = 50) {
  const rows = (await db.prepare("SELECT id,kind,from_id,into_id,auto,created FROM merge_log WHERE undone=0 ORDER BY id DESC LIMIT ?").bind(limit).all()).results || [], names = {};
  for (const kind of ["event", "session", "speaker"]) { const ids = rows.filter((r) => r.kind === kind).flatMap((r) => [r.from_id, r.into_id]); names[kind] = ids.length ? await titles(db, kind, ids) : new Map(); }
  return rows.map((r) => ({ log: r.id, kind: r.kind, auto: !!r.auto, created: r.created, from: names[r.kind]?.get(r.from_id) || "", into: names[r.kind]?.get(r.into_id) || "" }));
}
