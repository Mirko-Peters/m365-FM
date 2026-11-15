import { audit, cleanText, isLang, rateLimit, sha256hex } from "./util.js";
import { baseIds, entityMap } from "./entities.js";
import { sendPush } from "./push.js";
import { embed, queryVectors, rrf, upsertVectors, vectorId } from "./vectors.js";
import { recordExpertContribution } from "./contributions.js";

const FORMATS = ["quote", "interview", "article", "podcast", "talk"];
const MAX_REQUESTS_PER_WEEK = 5, MAX_REPLIES_PER_DAY = 10, MIN_ACCOUNT_AGE = 86400;
const MAX_DEADLINE_DAYS = 60, MAX_OPEN_CALLS = 2, MAX_PITCH = 600, VECTOR_BATCH = 20;
// Mindestaehnlichkeit (Kosinus, wie SEARCH_VECTOR_MIN_SCORE) fuer Vektor-Treffer: in beiden Richtungen gleich
// (Anfrage -> Experten fuer Vorschau/Push, Experte -> Anfragen fuer Liste/Antworten), sonst passt bei kleinem Index jede Anfrage
const MIN_VECTOR_SCORE = 0.4;
const now = () => Math.floor(Date.now() / 1000);
const parse = (s) => { if (Array.isArray(s)) return s; try { const x = JSON.parse(s || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } };
const text = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const validLang = (lang) => lang === "en" || isLang(lang);
const contactPattern = /(?:\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|(?:https?:\/\/|www\.)\S+)/i;
// Telefonnummer nur bei mind. 9 Ziffern; Datum (12.11.2026, 2026-11-20, 12/11/2026, auch als Bereich), Jahresbereich (2019-2024)
// und Version mit Build-Nummer (16.0.17928.20114, Build 16.0.1792) zaehlen nicht – aber nur fuer sich, nicht als Teil einer Ziffernkette (06.12.34.56.78).
// Nur moegliche Daten (Tag/Monat 1-31, ISO-Monat 1-12, Jahr 19xx/20xx oder zweistellig) und dreiteilige Versionen nur mit v/Version/Build,
// sonst verschwindet eine Teilnehmernummer wie "0475 12.34.56" oder "+43 1 23.45.678" als Datum/Version.
const DAY = String.raw`(?:0?[1-9]|[12]\d|3[01])`, YEAR = String.raw`(?:19|20)\d{2}`;
const DATE = String.raw`(?:${DAY}[./]${DAY}[./](?:${YEAR}|\d{2})|${YEAR}[-/.](?:0?[1-9]|1[0-2])[-/.]${DAY})`;
const notPhone = new RegExp(String.raw`(?<![\d+][./-]?)\b(?:${DATE}(?:\s?[-–]\s?${DATE})?|${YEAR}\s?[-–]\s?${YEAR}|` +
  String.raw`(?:v|version\s?|build\s?)\d{1,2}\.\d{1,2}\.\d{3,5}(?:\.\d{1,5})?|\d{1,2}\.\d{1,2}\.(?:\d{3,5}\.\d{1,5}|\d{1,2}\.\d{3,5}))\b(?![./-]?\d)`, "gi");
const phonePattern = /\+?\d[\d\s()./-]{6,}\d/g;
const phone = (value) => [...value.replace(notPhone, " x ").matchAll(phonePattern)].some((m) => m[0].replace(/\D/g, "").length >= 9);
const contact = (value) => typeof value === "string" && (contactPattern.test(value) || phone(value));
// Roh und bereinigt pruefen: text() entfernt <, >, Null-Breite- und Bidi-Zeichen, die im Rohtext eine Adresse/Nummer tarnen,
// gespeichert und angezeigt wird aber der bereinigte Text
const contactIn = (value, n) => contact(value) || contact(text(value, n));
const audienceFits = (request, row) => request.audience === "all" || request.audience === "level" ||
  row.program === request.audience;
const blocked = async (db, a, b) => !!(await db.prepare("SELECT 1 x FROM msg_blocks WHERE (user_id=?1 AND blocked_id=?2) OR (user_id=?2 AND blocked_id=?1)").bind(a, b).first());
const blockedUsers = async (db, userId) => {
  const rows = (await db.prepare("SELECT user_id,blocked_id FROM msg_blocks WHERE user_id=? OR blocked_id=?").bind(userId, userId).all()).results || [];
  return new Set(rows.map((r) => r.user_id === userId ? r.blocked_id : r.user_id));
};
const publicRequest = (row) => {
  const { user_id, held_reason, reach, hide_outlet, ...r } = row;
  return { ...r, topics: parse(r.topics), ...(hide_outlet ? {} : { reach }), hide_outlet: !!hide_outlet };
};

const EXPERT_SQL = `SELECT DISTINCT g.user_id,g.topics,g.langs listing_langs,g.formats listing_formats,
      es.langs setting_langs,es.formats setting_formats,e.eid,p.program,e.level
    FROM guest_listings g
    JOIN users u ON u.id=g.user_id AND u.banned=0
    JOIN profiles pr ON pr.user_id=g.user_id AND pr.public=1 AND pr.handle IS NOT NULL
    JOIN expertise e ON e.owner_type='u' AND e.owner_id=g.user_id AND e.level>=3
    JOIN programs p ON p.owner_type='u' AND p.owner_id=g.user_id AND p.verified=1 AND p.program IN ('mvp','mct')
    JOIN expert_settings es ON es.user_id=g.user_id AND es.opt_in=1 AND es.paused_until<=?
    WHERE g.kind='speaker' AND g.active=1`;
const profileRows = async (db, userId) => (await db.prepare(`${EXPERT_SQL} AND g.user_id=?`).bind(now(), userId).all()).results || [];

async function matchingExperts(env, request) {
  const db = env.DB;
  const rows = (await db.prepare(`${EXPERT_SQL} AND g.user_id<>?`).bind(now(), request.user_id).all()).results || [];
  const topics = new Set(parse(request.topics)), candidates = new Map();
  for (const row of rows) {
    const listed = parse(row.topics), langs = [...parse(row.listing_langs), ...parse(row.setting_langs)];
    const formats = [...parse(row.listing_formats), ...parse(row.setting_formats)];
    if (!langs.includes(request.lang) || !formats.includes(request.format) || !audienceFits(request, row)) continue;
    const current = candidates.get(row.user_id) || new Set();
    if (topics.has(row.eid) && listed.includes(row.eid)) current.add(row.eid);
    candidates.set(row.user_id, current);
  }
  const rules = [...candidates.entries()].filter(([, shared]) => shared.size)
    .map(([id, shared]) => ({ id: String(id), shared: [...shared] }))
    .sort((a, b) => b.shared.length - a.shared.length || a.id.localeCompare(b.id));
  let vectorMatches = [];
  try {
    if (env.AI && env.VEC && candidates.size) {
      const [values] = await embed(env, [`${request.title}\n${request.description}\n${parse(request.topics).join(" ")}`], {
        collectLog: false, requestTimeoutMs: 1000,
      });
      vectorMatches = await queryVectors(env, values, { topK: 50, filter: { type: "expert" } });
      vectorMatches = vectorMatches.filter((match) => match.score >= MIN_VECTOR_SCORE && candidates.has(Number(match.metadata?.user_id)))
        .map((match) => ({ id: String(match.metadata.user_id) }));
    }
  } catch (error) {
    console.warn("Expert-Matching per Vektor fehlgeschlagen:", String(error?.message || error));
  }
  const ranked = rrf([vectorMatches, rules]);
  const best = ranked[0]?.rrfScore || 1;
  return ranked.map((item) => ({
    id: Number(item.id), score: Math.round(item.rrfScore / best * 100),
    shared: candidates.get(Number(item.id)) ? [...candidates.get(Number(item.id))] : [],
  }));
}

// Passende Anfragen fuer eine Person (Listen und Pruefung vor Antworten): Profil einmal laden, Regeln im Speicher,
// Vektoren mit einer Abfrage (gespeicherter Expertenvektor gegen Anfragevektoren). Kein Embedding je Anfrage.
async function matchesForExpert(env, userId, requests, profile = null) {
  const db = env.DB, result = new Map();
  if (!requests.length) return result;
  profile = profile || await profileRows(db, userId);
  if (!profile.length) return result;
  const candidates = new Map();
  for (const request of requests) {
    if (request.user_id === userId) continue;
    const topics = new Set(parse(request.topics));
    for (const row of profile) {
      const langs = [...parse(row.listing_langs), ...parse(row.setting_langs)];
      const formats = [...parse(row.listing_formats), ...parse(row.setting_formats)];
      if (!langs.includes(request.lang) || !formats.includes(request.format) || !audienceFits(request, row)) continue;
      const current = candidates.get(Number(request.id)) || new Set();
      if (topics.has(row.eid) && parse(row.topics).includes(row.eid)) current.add(row.eid);
      candidates.set(Number(request.id), current);
    }
  }
  if (!candidates.size) return result;
  const rules = [...candidates.entries()].filter(([, shared]) => shared.size)
    .map(([id, shared]) => ({ id: String(id), n: shared.size }))
    .sort((a, b) => b.n - a.n || a.id.localeCompare(b.id));
  let vectorMatches = [];
  try {
    const own = env.VEC ? await db.prepare("SELECT vid FROM expert_vectors WHERE user_id=?").bind(userId).first() : null;
    const [stored] = own ? await env.VEC.getByIds([own.vid]) : [];
    if (stored?.values?.length) {
      const byVid = new Map();
      for (const id of candidates.keys()) byVid.set(await vectorId(`request:${id}`), id);
      const matches = await queryVectors(env, Array.from(stored.values), { topK: 100, returnMetadata: "none", filter: { type: "request" } });
      vectorMatches = matches.filter((match) => match.score >= MIN_VECTOR_SCORE && byVid.has(match.id)).map((match) => ({ id: String(byVid.get(match.id)) }));
    }
  } catch (error) {
    console.warn("Anfrage-Matching per Vektor fehlgeschlagen:", String(error?.message || error));
  }
  const ranked = rrf([vectorMatches, rules]);
  const best = ranked[0]?.rrfScore || 1;
  for (const item of ranked) {
    result.set(Number(item.id), { score: Math.round(item.rrfScore / best * 100), shared: [...candidates.get(Number(item.id))] });
  }
  return result;
}

async function visibleMatches(env, userId) {
  const db = env.DB, t = now(), rows = (await db.prepare(`SELECT r.*,u.name author,
    EXISTS(SELECT 1 FROM expert_request_replies x WHERE x.request_id=r.id AND x.user_id=?) responded
    FROM expert_requests r
    JOIN users u ON u.id=r.user_id AND u.banned=0
    WHERE r.status='open' AND r.mode='match' AND r.deadline>=? AND r.user_id<>? ORDER BY r.created DESC LIMIT 100`).bind(userId, new Date(t * 1000).toISOString().slice(0, 10), userId).all()).results || [];
  const blocks = await blockedUsers(db, userId);
  const visible = rows.filter((r) => !blocks.has(r.user_id));
  const matches = await matchesForExpert(env, userId, visible);
  return visible.filter((r) => matches.has(Number(r.id))).map((r) => {
    const match = matches.get(Number(r.id));
    return { ...publicRequest(r), match_score: match.score, shared_topics: match.shared };
  });
}

async function notify(env, userId, payload) {
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC || !env.VAPID_SUBJECT) return;
  const db = env.DB, subs = (await db.prepare("SELECT endpoint,p256dh,auth FROM push_subs WHERE user_id=? LIMIT 20").bind(userId).all()).results || [];
  for (const sub of subs) {
    try { const result = await sendPush(env, sub, payload); if (result.gone) await db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(sub.endpoint).run(); } catch { /* Push ist eine optionale Benachrichtigung. */ }
  }
}

// Link auf Expert Connect (EN oder DE je Sprache der Empfangsperson); tab: calls | expert | requests
const connectUrl = (env, lang, tab) => `${env.SITE}${lang === "de" ? "/de" : ""}/community/expert-connect/#${tab}`;

async function notifyExperts(env, request) {
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC || !env.VAPID_SUBJECT) return;
  const db = env.DB;
  // Nur bei der ersten Veroeffentlichung: Entwurf/Freigabe im Wechsel loest keine weiteren Pushes aus
  if (!(await rateLimit(db, `expert_notify:${request.id}`, 1, 365 * 86400))) return;
  const users = await matchingExperts(env, request);
  const blocks = await blockedUsers(db, request.user_id);
  for (const expert of users.slice(0, 100)) {
    if (!blocks.has(expert.id)) await notifyExpert(env, expert.id, { title: "M365.FM · Publisher-Anfrage", body: request.title, tag: `expert-request-${request.id}` }, request.mode === "open" ? "calls" : "expert");
  }
}

async function notifyExpert(env, userId, payload, tab = "expert") {
  const settings = await env.DB.prepare("SELECT s.notify,s.opt_in,s.paused_until,u.lang FROM expert_settings s LEFT JOIN users u ON u.id=s.user_id WHERE s.user_id=?").bind(userId).first();
  if (settings?.opt_in && settings.paused_until <= now() && ["push", "both"].includes(settings.notify)) await notify(env, userId, { ...payload, url: connectUrl(env, settings.lang, tab) });
}

function defer(ctx, task) {
  const promise = Promise.resolve(task).catch((error) => console.warn("Expert-Connect-Aufgabe fehlgeschlagen:", String(error?.message || error)));
  if (ctx?.waitUntil) ctx.waitUntil(promise);
}

export async function deleteUserExpertRequests(env, userId) {
  const db = env.DB || env;
  // Experten- und Anfragevektoren gemeinsam entfernen; D1-Zeilen nur nach Erfolg loeschen, sonst raeumen
  // syncExpertVectors / closeExpiredExpertRequests sie spaeter auf (sie lesen expert_vectors bzw. expert_request_vectors).
  const vids = [
    ...((await db.prepare("SELECT vid FROM expert_vectors WHERE user_id=?").bind(userId).all()).results || []),
    ...((await db.prepare("SELECT v.vid FROM expert_request_vectors v JOIN expert_requests r ON r.id=v.request_id WHERE r.user_id=?").bind(userId).all()).results || []),
  ].map((row) => row.vid);
  let vectorsGone = !vids.length;
  if (vids.length && env.VEC) {
    try { await env.VEC.deleteByIds(vids); vectorsGone = true; }
    catch (error) { console.warn("Vektoren konnten bei Kontolöschung nicht entfernt werden:", String(error?.message || error)); }
  }
  await db.batch([
    db.prepare("DELETE FROM expert_settings WHERE user_id=?").bind(userId),
    ...(vectorsGone ? [
      db.prepare("DELETE FROM expert_vectors WHERE user_id=?").bind(userId),
      db.prepare("DELETE FROM expert_request_vectors WHERE request_id IN (SELECT id FROM expert_requests WHERE user_id=?)").bind(userId),
    ] : []),
    db.prepare("DELETE FROM expert_request_reports WHERE user_id=? OR request_id IN (SELECT id FROM expert_requests WHERE user_id=?) OR reply_id IN (SELECT id FROM expert_request_replies WHERE user_id=?)").bind(userId, userId, userId),
    db.prepare("DELETE FROM expert_request_replies WHERE user_id=? OR request_id IN (SELECT id FROM expert_requests WHERE user_id=?)").bind(userId, userId),
    db.prepare("DELETE FROM expert_requests WHERE user_id=?").bind(userId),
  ]);
}

const columnsReady = new WeakSet();   // einmal je Isolate und DB (Migration 0018 legt die Spalten an)
async function ensureExpertConnectColumns(db) {
  if (columnsReady.has(db)) return;
  for (const [table, column, definition] of [
    ["expert_requests", "hide_outlet", "INTEGER NOT NULL DEFAULT 0"],
    ["expert_requests", "reach", "TEXT NOT NULL DEFAULT ''"],
    ["expert_requests", "audience", "TEXT NOT NULL DEFAULT 'all'"],
    ["expert_requests", "mode", "TEXT NOT NULL DEFAULT 'match'"],
    ["expert_requests", "held_reason", "TEXT NOT NULL DEFAULT ''"],
    ["expert_request_replies", "kind", "TEXT NOT NULL DEFAULT 'match'"],
    ["expert_request_replies", "status", "TEXT NOT NULL DEFAULT 'pending'"],
    ["contributions", "expert_request_id", "INTEGER"],
  ]) {
    const columns = await db.prepare(`PRAGMA table_info(${table})`).all();
    if ((columns.results || []).some((item) => item.name === column)) continue;
    try { await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run(); }
    catch (error) {
      const current = await db.prepare(`PRAGMA table_info(${table})`).all();
      if (!(current.results || []).some((item) => item.name === column)) throw error;
    }
  }
  columnsReady.add(db);
}

function requestVectorText(request) {
  return `${request.title}\n${request.description}\n${parse(request.topics).join(" ")}`.slice(0, 3000);
}

async function syncRequestVector(env, request) {
  if (!env.AI || !env.VEC) return;
  const [values] = await embed(env, [requestVectorText(request)], { collectLog: false, requestTimeoutMs: 1000 });
  const vid = await vectorId(`request:${request.id}`);
  const h = await sha256hex(requestVectorText(request));
  await upsertVectors(env, [{ id: vid, values, metadata: {
    type: "request", request_id: request.id, lang: request.lang, format: request.format, topics: parse(request.topics),
  } }]);
  await env.DB.prepare("INSERT INTO expert_request_vectors(request_id,vid,h) VALUES(?,?,?) ON CONFLICT(request_id) DO UPDATE SET vid=excluded.vid,h=excluded.h")
    .bind(request.id, vid, h).run();
}

export async function syncExpertVectors(env, max = VECTOR_BATCH) {
  if (!env.AI || !env.VEC) return { skipped: "Workers-AI- oder Vectorize-Binding fehlt" };
  const db = env.DB, t = now();
  const activeRows = (await db.prepare(`SELECT DISTINCT g.user_id,g.topics,g.langs,g.formats,es.langs setting_langs,
      es.formats setting_formats,p.headline,p.about,p.job,u.bio,u.lang
    FROM guest_listings g JOIN profiles p ON p.user_id=g.user_id AND p.public=1 AND p.handle IS NOT NULL
    JOIN users u ON u.id=g.user_id AND u.banned=0
    JOIN expert_settings es ON es.user_id=g.user_id AND es.opt_in=1 AND es.paused_until<=?
    WHERE g.kind='speaker' AND g.active=1 ORDER BY g.user_id`).bind(t).all()).results || [];
  const ids = new Set(activeRows.map((row) => row.user_id));
  const old = (await db.prepare("SELECT user_id,vid FROM expert_vectors").all()).results || [];
  const stale = old.filter((row) => !ids.has(row.user_id));
  if (stale.length) {
    try { await env.VEC.deleteByIds(stale.map((row) => row.vid)); }
    catch (error) { console.warn("Abgemeldete Expertenvektoren konnten nicht entfernt werden:", String(error?.message || error)); return { deleted: 0, error: "vector_delete" }; }
    await db.batch(stale.map((row) => db.prepare("DELETE FROM expert_vectors WHERE user_id=?").bind(row.user_id)));
  }
  const map = await entityMap(env), pending = [];
  for (const row of activeRows) {
    const expertise = (await db.prepare("SELECT eid FROM expertise WHERE owner_type='u' AND owner_id=? AND level>=3 ORDER BY eid LIMIT 30").bind(row.user_id).all()).results || [];
    const topics = parse(row.topics), eids = [...new Set([...topics, ...expertise.map((item) => item.eid)])];
    const topicText = eids.map((eid) => {
      const e = map.get(eid);
      return e ? `${e.name} ${e.desc?.en || ""} ${e.desc?.de || ""}` : eid;
    }).join(" ");
    const contributions = (await db.prepare("SELECT title FROM contributions WHERE user_id=? AND public=1 ORDER BY published DESC LIMIT 20").bind(row.user_id).all()).results || [];
    const profileText = `${row.headline}\n${row.about}\n${row.job}\n${row.bio}\n${topicText}\n${contributions.map((item) => item.title).join("\n")}\n${[...parse(row.langs), ...parse(row.setting_langs), row.lang].filter(Boolean).join(" ")}`.slice(0, 6000);
    const h = await sha256hex(profileText);
    const previous = old.find((item) => item.user_id === row.user_id);
    if (!previous || previous.h !== h) pending.push({ row, profileText, h });
    if (pending.length >= max) break;
  }
  if (!pending.length) return { processed: 0, deleted: stale.length };
  const vectors = await embed(env, pending.map((item) => item.profileText), { collectLog: false, requestTimeoutMs: 3000 });
  const prepared = [];
  for (let i = 0; i < pending.length; i++) {
    const { row, h } = pending[i], vid = await vectorId(`expert:${row.user_id}`);
    const programs = (await db.prepare("SELECT program FROM programs WHERE owner_type='u' AND owner_id=? AND verified=1").bind(row.user_id).all()).results || [];
    const levels = (await db.prepare("SELECT MAX(level) level FROM expertise WHERE owner_type='u' AND owner_id=?").bind(row.user_id).first())?.level || 0;
    prepared.push({ id: vid, values: vectors[i], metadata: {
      type: "expert", user_id: row.user_id, lang: row.lang || parse(row.setting_langs)[0] || "",
      programs: programs.map((item) => item.program), level: levels,
      formats: [...new Set([...parse(row.formats), ...parse(row.setting_formats)])], opt_in: 1,
    } });
    pending[i].vid = vid;
  }
  await upsertVectors(env, prepared);
  await db.batch(pending.map(({ row, h, vid }) => db.prepare(
    "INSERT INTO expert_vectors(user_id,vid,h) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET vid=excluded.vid,h=excluded.h",
  ).bind(row.user_id, vid, h)));
  return { processed: pending.length, deleted: stale.length };
}

export async function closeExpiredExpertRequests(env) {
  const today = new Date().toISOString().slice(0, 10);
  const ids = (await env.DB.prepare("SELECT id FROM expert_requests WHERE status IN ('open','held') AND deadline<? LIMIT 200").bind(today).all()).results || [];
  if (ids.length) {
    await env.DB.batch(ids.map(({ id }) => env.DB.prepare("UPDATE expert_requests SET status='closed' WHERE id=? AND status IN ('open','held')").bind(id)));
  }
  const oldVectors = (await env.DB.prepare(`SELECT v.vid,v.request_id FROM expert_request_vectors v
    LEFT JOIN expert_requests r ON r.id=v.request_id WHERE r.id IS NULL OR r.status<>'open' LIMIT 200`).all()).results || [];
  if (oldVectors.length && env.VEC) {
    try {
      await env.VEC.deleteByIds(oldVectors.map(({ vid }) => vid));
      await env.DB.batch(oldVectors.map(({ request_id }) => env.DB.prepare("DELETE FROM expert_request_vectors WHERE request_id=?").bind(request_id)));
    } catch (error) { console.warn("Geschlossene Aufrufvektoren konnten nicht entfernt werden:", String(error?.message || error)); }
  }
  // Offene Anfragen ohne Vektor nachholen (Embedding-Timeout beim Anlegen); sonst sehen Experten nur per Vektor sie nicht
  let synced = 0;
  if (env.AI && env.VEC) {
    const missing = (await env.DB.prepare(`SELECT r.* FROM expert_requests r LEFT JOIN expert_request_vectors v ON v.request_id=r.id
      WHERE r.status='open' AND r.deadline>=? AND v.request_id IS NULL ORDER BY r.id LIMIT ?`).bind(today, VECTOR_BATCH).all()).results || [];
    for (const item of missing) {
      try { await syncRequestVector(env, item); synced++; }
      catch (error) { console.warn("Anfragevektor konnte nicht nachgeholt werden:", String(error?.message || error)); break; }
    }
  }
  return { closed: ids.length, vectors: oldVectors.length, synced };
}

async function expertSearch(env, query, filters = {}) {
  const db = env.DB, q = String(query || "").trim().slice(0, 200);
  const rows = (await db.prepare(`SELECT DISTINCT u.id,u.name,u.lang,p.handle,p.headline,p.job,g.topics,g.langs,g.formats,
      es.langs setting_langs,es.formats setting_formats,e.level,pr.program
    FROM expert_settings es JOIN guest_listings g ON g.user_id=es.user_id AND g.kind='speaker' AND g.active=1
    JOIN profiles p ON p.user_id=es.user_id AND p.public=1 AND p.handle IS NOT NULL
    JOIN users u ON u.id=es.user_id AND u.banned=0
    JOIN expertise e ON e.owner_type='u' AND e.owner_id=u.id AND e.level>=3
    JOIN programs pr ON pr.owner_type='u' AND pr.owner_id=u.id AND pr.verified=1 AND pr.program IN ('mvp','mct')
    WHERE es.opt_in=1 AND es.paused_until<=? LIMIT 1000`).bind(now()).all()).results || [];
  const eligible = rows.filter((row) => {
    const langs = [...parse(row.langs), ...parse(row.setting_langs)];
    const formats = [...parse(row.formats), ...parse(row.setting_formats)];
    return (!filters.lang || langs.includes(filters.lang)) &&
      (!filters.format || formats.includes(filters.format)) &&
      (!filters.program || row.program === filters.program) &&
      (!filters.level || Number(row.level) >= Number(filters.level));
  });
  const users = new Map();   // je Person die Zeile mit dem hoechsten Level (eligible: eine Zeile je Programm und Level)
  for (const row of eligible) if (!users.has(row.id) || Number(row.level) > Number(users.get(row.id).level)) users.set(row.id, row);
  let ftsRows = [], vectorRows = [];
  if (q) {
    const terms = q.match(/[\p{L}\p{N}]+/gu)?.slice(0, 8) || [];
    if (terms.length) {
      try {
        // Begriffssuche im Speicher (hoechstens 1000 Profile): keine FTS-Tabelle zur Laufzeit. Eine solche Tabelle haette die D1-Sicherung
        // (wrangler d1 export kann FTS5-Tabellen nicht sichern) und damit jeden Worker-Deploy blockiert; der Neuaufbau je Suche war zudem
        // ein Wettlauf zwischen gleichzeitigen Suchen und bis zu 1000 D1-Schreibzugriffe pro oeffentlichem Aufruf.
        const fold = (value) => String(value || "").normalize("NFKD").replace(/\p{M}+/gu, "").toLowerCase();
        const wanted = [...new Set(terms.map(fold))];
        const map = await entityMap(env);
        const scored = [];
        for (const [id, row] of users) {
          const names = parse(row.topics).map((eid) => {
            const ent = map.get(eid);
            return ent ? `${ent.name} ${ent.desc?.en || ""} ${ent.desc?.de || ""}` : eid;
          }).join(" ");
          const tokens = fold(`${row.name} ${row.headline} ${row.job} ${names}`).match(/[\p{L}\p{N}]+/gu) || [];
          const counts = new Map();
          for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
          const hits = wanted.filter((term) => counts.has(term));
          if (hits.length) scored.push({ id, distinct: hits.length, total: hits.reduce((sum, term) => sum + counts.get(term), 0) });
        }
        ftsRows = scored.sort((a, b) => b.distinct - a.distinct || b.total - a.total || a.id - b.id).slice(0, 100);
      } catch (error) { console.warn("Expertensuche (Begriffe) fehlgeschlagen:", String(error?.message || error)); }
      try {
        if (env.AI && env.VEC) {
          const [values] = await embed(env, [q], { collectLog: false, requestTimeoutMs: 1000 });
          vectorRows = await queryVectors(env, values, { topK: 50, filter: { type: "expert" } });
          vectorRows = vectorRows.filter((item) => users.has(Number(item.metadata?.user_id)))
            .map((item) => ({ id: String(item.metadata.user_id) }));
        }
      } catch (error) { console.warn("Expertensuche per Vektor fehlgeschlagen:", String(error?.message || error)); }
    }
  }
  const rules = ftsRows.map((row) => ({ id: String(row.id) }));
  const ranked = q ? rrf([vectorRows, rules]) : [...users.values()].map((row, i) => ({ id: String(row.id), rank: i + 1, rrfScore: 1 / (60 + i + 1) }));   // je Person einmal (eligible hat eine Zeile je Programm und Level)
  const maxScore = ranked[0]?.rrfScore || 1;
  return ranked.slice(0, 50).map((item) => {
    const row = users.get(Number(item.id));
    if (!row) return null;
    const langs = [...new Set([...parse(row.setting_langs), ...parse(row.langs)])];
    return {
      id: row.id, name: row.name, handle: row.handle, role: row.headline || row.job,
      programs: [...new Set(eligible.filter((x) => x.id === row.id).map((x) => x.program))],
      level: row.level, topics: parse(row.topics), langs, profile_lang: row.lang || langs[0] || "",
      formats: [...new Set([...parse(row.setting_formats), ...parse(row.formats)])],
      match_score: Math.round(item.rrfScore / maxScore * 100),
    };
  }).filter(Boolean);
}

export async function handleExpertRequests(env, request, path, user, J, ctx) {
  const db = env.DB, method = request.method, body = async () => request.json().catch(() => ({}));
  await ensureExpertConnectColumns(db);
  if (path === "/api/experts/search" && method === "GET") {
    if (new URL(request.url).searchParams.get("q")) {   // oeffentliche Suche mit Begriff: Embedding (Workers AI) kostet, daher IP-Grenze wie /api/search
      const day = new Date().toISOString().slice(0, 10);
      const ipHash = await sha256hex(`${request.headers.get("cf-connecting-ip") || ""}|${day}|${env.SESSION_SECRET || ""}`);
      if (!(await rateLimit(db, `expert_search:${ipHash}`, 60, 60))) return J({ error: "rate_limit" }, 429);
    }
    const items = await expertSearch(env, new URL(request.url).searchParams.get("q"), {
      lang: new URL(request.url).searchParams.get("lang") || "",
      format: new URL(request.url).searchParams.get("format") || "",
      program: new URL(request.url).searchParams.get("program") || "",
      level: new URL(request.url).searchParams.get("level") || "",
    });
    return J({ items }, 200, { "cache-control": "no-store" });
  }
  if (path.startsWith("/api/admin/expert-requests/")) {
    if (!user?.admin) return J({ error: user ? "forbidden" : "login" }, user ? 403 : 401);
    if (path === "/api/admin/expert-requests/reports" && method === "GET") {
      const reports = (await db.prepare(`SELECT r.request_id,r.user_id reporter_id,r.reply_id,r.reason,r.created,e.title,e.description,e.status,
        e.user_id publisher_id,p.name publisher_name,x.body reply_body,x.user_id expert_id,ex.name expert_name
        FROM expert_request_reports r JOIN expert_requests e ON e.id=r.request_id JOIN users p ON p.id=e.user_id
        LEFT JOIN expert_request_replies x ON x.id=r.reply_id AND x.request_id=r.request_id
        LEFT JOIN users ex ON ex.id=x.user_id
        WHERE e.status IN ('open','held') ORDER BY r.created DESC LIMIT 100`).all()).results || [];
      const held = (await db.prepare("SELECT id,title,description,held_reason,mode,created,deadline FROM expert_requests WHERE status='held' ORDER BY created LIMIT 100").all()).results || [];
      return J({ reports, held });
    }
    if (path === "/api/admin/expert-requests/moderation-log" && method === "GET") {
      return J({ items: (await db.prepare("SELECT * FROM moderation_log ORDER BY created DESC LIMIT 100").all()).results || [] });
    }
    if (path === "/api/admin/expert-requests/resolve" && method === "POST") {
      const b = await body(), id = Number(b.id), action = String(b.action || "");
      if (!Number.isSafeInteger(id) || id < 1 || !["release", "reject"].includes(action)) return J({ error: "bad_request" }, 400);
      const status = action === "release" ? "open" : "closed";
      const result = await db.prepare("UPDATE expert_requests SET status=?,held_reason='' WHERE id=? AND status='held'").bind(status, id).run();
      if (!result.meta.changes) return J({ error: "not_found" }, 404);
      // Meldungen zur Anfrage selbst sind erledigt: Schwelle beginnt nach der Freigabe neu
      await db.prepare("DELETE FROM expert_request_reports WHERE request_id=? AND reply_id=0").bind(id).run();
      const reason = text(b.reason, 300);
      await db.prepare("INSERT INTO moderation_log(actor_id,action,target_type,target_id,reason,created) VALUES(?,?,?,?,?,?)")
        .bind(user.id, action, "request", id, reason, now()).run();
      await audit(db, user.id, `expert_request_${action}`, String(id), reason);
      if (status === "open") {
        const item = await db.prepare("SELECT * FROM expert_requests WHERE id=?").bind(id).first();
        defer(ctx, syncRequestVector(env, item));   // Listen/Antworten nutzen gespeicherte Anfragevektoren
        defer(ctx, notifyExperts(env, item));
      }
      return J({ ok: true, status });
    }
    if (path === "/api/admin/expert-requests/close" && method === "POST") {
      const b = await body(), id = Number(b.id);
      if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
      const result = await db.prepare("UPDATE expert_requests SET status='closed' WHERE id=? AND status IN ('open','held')").bind(id).run();
      if (!result.meta.changes) return J({ error: "not_found" }, 404);
      await audit(db, user.id, "expert_request_close", String(id));
      return J({ ok: true });
    }
    if (path === "/api/admin/expert-requests/reply-delete" && method === "POST") {
      const b = await body(), id = Number(b.reply_id);
      if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
      await db.prepare("DELETE FROM expert_request_reports WHERE reply_id=?").bind(id).run();
      const result = await db.prepare("DELETE FROM expert_request_replies WHERE id=?").bind(id).run();
      if (!result.meta.changes) return J({ ok: true, gone: true });
      await audit(db, user.id, "expert_reply_delete", String(id));
      return J({ ok: true });
    }
  }
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/expert-settings" && method === "GET") {
    const settings = await db.prepare("SELECT opt_in,formats,langs,notify,contact_pref,contact_value,paused_until,updated FROM expert_settings WHERE user_id=?").bind(user.id).first();
    return J({ settings: settings ? { ...settings, opt_in: !!settings.opt_in, formats: parse(settings.formats), langs: parse(settings.langs) } : {
      opt_in: false, formats: [], langs: [], notify: "push", contact_pref: "platform", contact_value: "", paused_until: 0,
    } });
  }
  if (path === "/api/expert-settings" && method === "POST") {
    const b = await body(), formats = [...new Set((Array.isArray(b.formats) ? b.formats : []).filter((x) => FORMATS.includes(x)))];
    const langs = [...new Set((Array.isArray(b.langs) ? b.langs : []).filter(validLang))];
    const notifyMode = ["push", "weekly", "both", "none"].includes(b.notify) ? b.notify : "push";
    const contactPref = ["email", "linkedin", "website", "platform"].includes(b.contact_pref) ? b.contact_pref : "platform";
    const contactValue = cleanText(b.contact_value, 300).trim();
    if (contactPref === "email" && contactValue && !/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i.test(contactValue)) return J({ error: "bad_contact" }, 400);
    if (["linkedin", "website"].includes(contactPref) && contactValue) {
      try {
        const url = new URL(contactValue);
        if (url.protocol !== "https:" || url.username || url.password) return J({ error: "bad_contact" }, 400);
      } catch { return J({ error: "bad_contact" }, 400); }
    }
    let paused;
    if (b.pause_weeks) paused = now() + 14 * 86400;
    else if (b.paused_until !== undefined && Number.isSafeInteger(+b.paused_until)) paused = Math.max(0, Math.min(+b.paused_until, now() + 14 * 86400));
    else paused = (await db.prepare("SELECT paused_until FROM expert_settings WHERE user_id=?").bind(user.id).first())?.paused_until || 0;   // ohne Pausenfelder bleibt die Pause
    const optIn = b.opt_in ? 1 : 0, t = now();
    await db.prepare(`INSERT INTO expert_settings(user_id,opt_in,formats,langs,notify,contact_pref,contact_value,paused_until,updated)
      VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET opt_in=excluded.opt_in,formats=excluded.formats,
      langs=excluded.langs,notify=excluded.notify,contact_pref=excluded.contact_pref,contact_value=excluded.contact_value,
      paused_until=excluded.paused_until,updated=excluded.updated`)
      .bind(user.id, optIn, JSON.stringify(formats), JSON.stringify(langs), notifyMode, contactPref, contactValue, paused, t).run();
    if (!optIn || paused > t) defer(ctx, removeExpertVector(env, user.id));
    return J({ ok: true });
  }
  if (path === "/api/expert-requests/list" && method === "GET") return J({ items: await visibleMatches(env, user.id) });
  if (path === "/api/expert-requests/matches" && method === "GET") {
    const owned = (await db.prepare(`SELECT r.*, (SELECT COUNT(*) FROM expert_request_replies x WHERE x.request_id=r.id) replies
      FROM expert_requests r WHERE r.user_id=? ORDER BY r.created DESC LIMIT 50`).bind(user.id).all()).results || [];
    const items = [];
    for (const r of owned) {
      const replies = (await db.prepare(`SELECT x.id,x.user_id,x.body,x.created,x.kind,x.status,u.name expert
        FROM expert_request_replies x JOIN users u ON u.id=x.user_id AND u.banned=0
        WHERE x.request_id=? ORDER BY x.created DESC LIMIT 20`).bind(r.id).all()).results || [];
      for (const reply of replies) {
        if (reply.status === "accepted" && r.status === "accepted") reply.contacts = await acceptedContacts(db, r.user_id, reply.user_id);
        delete reply.user_id;
      }
      items.push({ ...publicRequest(r), reach: r.reach, replies });   // eigene Anfrage: Medium auch bei hide_outlet
    }
    const accepted = await acceptedForExpert(db, user.id);
    return J({ requests: items, matches: await visibleMatches(env, user.id), accepted });
  }
  if (path === "/api/expert-requests/preview" && method === "POST") {
    const b = await body(), item = await normalizeRequest(env, b);
    if (item.error) return J({ error: item.error, ...(item.topic ? { topic: item.topic } : {}) }, 400);
    item.user_id = user.id;
    const matches = await matchingExperts(env, item);
    const split = { mvp: 0, mct: 0, level: {}, lang: {} };
    for (const match of matches) {
      const row = await db.prepare("SELECT program,level FROM programs p JOIN expertise e ON e.owner_type='u' AND e.owner_id=p.owner_id WHERE p.owner_type='u' AND p.owner_id=? AND p.program IN ('mvp','mct') AND p.verified=1 AND e.level>=3 ORDER BY p.program LIMIT 1").bind(match.id).first();
      if (row?.program) split[row.program]++;
      if (row?.level) split.level[row.level] = (split.level[row.level] || 0) + 1;
      split.lang[item.lang] = (split.lang[item.lang] || 0) + 1;
    }
    return J({ count: matches.length, split });
  }
  if (path === "/api/expert-calls" && method === "GET") {
    const url = new URL(request.url), topic = url.searchParams.get("topic") || "", format = url.searchParams.get("format") || "";
    const lang = url.searchParams.get("lang") || "", deadline = url.searchParams.get("deadline") || "";
    const rows = (await db.prepare(`SELECT r.*,u.name author,EXISTS(SELECT 1 FROM expert_request_replies x WHERE x.request_id=r.id AND x.user_id=?) responded
      FROM expert_requests r JOIN users u ON u.id=r.user_id AND u.banned=0
      WHERE r.mode='open' AND r.status='open' AND r.deadline>=? AND r.user_id<>? ORDER BY r.created DESC LIMIT 200`)
      .bind(user.id, new Date().toISOString().slice(0, 10), user.id).all()).results || [];
    const blocks = await blockedUsers(db, user.id);
    let calls = rows.filter((r) => !blocks.has(r.user_id) && (!topic || parse(r.topics).includes(topic)) && (!format || r.format === format) &&
      (!lang || r.lang === lang) && (!deadline || r.deadline <= deadline));
    if (url.searchParams.get("sort") === "match") {
      const profile = await profileRows(db, user.id);
      // ohne Expertenprofil: neueste zuerst statt leerer Liste
      if (!profile.length) return J({ items: calls.map((call) => ({ ...publicRequest(call), match_score: 0, shared_topics: [] })), needs_profile: true });
      const matches = await matchesForExpert(env, user.id, calls, profile);
      calls = calls.map((call) => {
        const match = matches.get(Number(call.id));
        return { ...publicRequest(call), match_score: match?.score || 0, shared_topics: match?.shared || [] };
      }).sort((a, b) => b.match_score - a.match_score);
    } else calls = calls.map(publicRequest);
    return J({ items: calls });
  }
  if (path === "/api/expert-requests/create" && method === "POST") {
    const b = await body(), t = now(), account = await db.prepare("SELECT created FROM users WHERE id=? AND banned=0").bind(user.id).first();
    if (!account || t - account.created < MIN_ACCOUNT_AGE) return J({ error: "account_too_new" }, 403);
    const item = await normalizeRequest(env, b);
    if (item.error) return J({ error: item.error, ...(item.topic ? { topic: item.topic } : {}) }, 400);
    if (b.mode !== undefined && !["match", "open"].includes(b.mode)) return J({ error: "bad_mode" }, 400);
    if (contactIn(b.reach, 100)) return J({ error: "contact_details" }, 400);
    const mode = b.mode === "open" ? "open" : "match", draft = b.draft === true;
    const heldReason = !draft ? moderationReason(item.title, item.description) : "";
    const status = draft ? "draft" : heldReason ? "held" : "open";
    if (mode === "open" && status !== "draft") {
      const open = await db.prepare("SELECT COUNT(*) n FROM expert_requests WHERE user_id=? AND mode='open' AND status IN ('open','held')").bind(user.id).first();
      if (open.n >= MAX_OPEN_CALLS) return J({ error: "open_call_limit" }, 429);
    }
    const result = await db.prepare(`INSERT INTO expert_requests(user_id,title,description,topics,format,lang,deadline,created,status,hide_outlet,reach,audience,mode,held_reason)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM expert_requests WHERE user_id=? AND created>?)<?`)
      .bind(user.id, item.title, item.description, JSON.stringify(item.topics), item.format, item.lang, item.deadline, t, status,
        b.hide_outlet ? 1 : 0, text(b.reach, 100), item.audience, mode, heldReason, user.id, t - 7 * 86400, MAX_REQUESTS_PER_WEEK).run();
    if (!result.meta.changes) return J({ error: "weekly_limit" }, 429);
    const saved = { id: result.meta.last_row_id, user_id: user.id, ...item, status, mode };
    if (status === "held") await db.prepare("INSERT INTO moderation_log(actor_id,action,target_type,target_id,reason,created) VALUES(?,'auto_hold','request',?,?,?)")
      .bind(user.id, saved.id, heldReason, t).run();
    if (status === "open") {
      defer(ctx, syncRequestVector(env, saved));
      defer(ctx, notifyExperts(env, saved));
    }
    return J({ ok: true, id: saved.id, status });
  }
  if (path === "/api/expert-requests/update" && method === "POST") {
    const b = await body(), id = Number(b.id), old = Number.isSafeInteger(id) && id > 0
      ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND user_id=? AND status IN ('draft','open','held')").bind(id, user.id).first() : null;
    if (!old) return J({ error: "not_found" }, 404);
    const item = await normalizeRequest(env, { ...old, ...b, topics: b.topics ?? parse(old.topics) });
    if (item.error) return J({ error: item.error, ...(item.topic ? { topic: item.topic } : {}) }, 400);
    if (b.mode !== undefined && !["match", "open"].includes(b.mode)) return J({ error: "bad_mode" }, 400);
    if (b.reach !== undefined && contactIn(b.reach, 100)) return J({ error: "contact_details" }, 400);
    const deadline = b.deadline === undefined ? old.deadline : item.deadline;
    // Wegen Meldungen zurueckgehalten: bleibt zurueckgehalten, bis ein Admin entscheidet (auch bei Bearbeiten oder Entwurf)
    const heldByReports = old.status === "held" && old.held_reason === "reports";
    const autoReason = moderationReason(item.title, item.description);
    const status = heldByReports ? "held" : b.draft ? "draft" : autoReason ? "held" : "open";
    const heldReason = heldByReports ? "reports" : status === "held" ? autoReason : "";
    const mode = b.mode === undefined ? old.mode : b.mode;
    if (mode === "open" && status !== "draft" && (old.mode !== "open" || old.status === "draft")) {
      const open = await db.prepare("SELECT COUNT(*) n FROM expert_requests WHERE user_id=? AND id<>? AND mode='open' AND status IN ('open','held')").bind(user.id, id).first();
      if (open.n >= MAX_OPEN_CALLS) return J({ error: "open_call_limit" }, 429);
    }
    await db.prepare(`UPDATE expert_requests SET title=?,description=?,topics=?,format=?,lang=?,deadline=?,status=?,held_reason=?,
      hide_outlet=?,reach=?,audience=?,mode=? WHERE id=? AND user_id=?`)
      .bind(item.title, item.description, JSON.stringify(item.topics), item.format, item.lang, deadline, status, heldReason,
        b.hide_outlet === undefined ? old.hide_outlet : b.hide_outlet ? 1 : 0, b.reach === undefined ? old.reach : text(b.reach, 100),
        item.audience, mode, id, user.id).run();
    const saved = { ...old, ...item, id, user_id: user.id, deadline, status, mode };   // mode: Push-Link (#calls/#expert)
    if (status === "held" && old.status !== "held") await db.prepare("INSERT INTO moderation_log(actor_id,action,target_type,target_id,reason,created) VALUES(?,'auto_hold','request',?,?,?)")
      .bind(user.id, id, heldReason, now()).run();
    if (status === "open") {
      defer(ctx, syncRequestVector(env, saved));
      if (old.status !== "open") defer(ctx, notifyExperts(env, saved));
    }
    return J({ ok: true, status });
  }
  if (path === "/api/expert-requests/extend" && method === "POST") {
    const b = await body(), id = Number(b.id), deadline = validDeadline(b.deadline);
    if (!deadline) return J({ error: "deadline" }, 400);
    const result = await db.prepare("UPDATE expert_requests SET deadline=? WHERE id=? AND user_id=? AND status='open'").bind(deadline, id, user.id).run();
    return result.meta.changes ? J({ ok: true, deadline }) : J({ error: "not_found" }, 404);
  }
  if (path === "/api/expert-requests/respond" && method === "POST") {
    const b = await body(), id = Number(b.id);
    if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
    const item = await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open' AND mode='match' AND deadline>=?")
      .bind(id, new Date().toISOString().slice(0, 10)).first();
    if (!item || !(await matchesForExpert(env, user.id, [item])).has(Number(item.id))) return J({ error: "not_found" }, 404);
    if (await blocked(db, user.id, item.user_id)) return J({ error: "blocked" }, 403);
    return createReply(env, item, user, b.body, "match", ctx, J);
  }
  if (path === "/api/expert-requests/apply" && method === "POST") {
    const b = await body(), id = Number(b.id);
    const item = Number.isSafeInteger(id) && id > 0 ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND mode='open' AND status='open' AND deadline>=?")
      .bind(id, new Date().toISOString().slice(0, 10)).first() : null;
    if (!item || item.user_id === user.id) return J({ error: "not_found" }, 404);
    const account = await db.prepare("SELECT created FROM users WHERE id=? AND banned=0").bind(user.id).first();
    const settings = await db.prepare("SELECT * FROM expert_settings WHERE user_id=? AND opt_in=1 AND paused_until<=?").bind(user.id, now()).first();
    const profile = await profileRows(db, user.id);
    if (!account || now() - account.created < MIN_ACCOUNT_AGE) return J({ error: "account_too_new" }, 403);
    if (!settings || !profile.some((row) => [...parse(row.setting_langs), ...parse(row.listing_langs)].includes(item.lang) &&
        [...parse(row.setting_formats), ...parse(row.listing_formats)].includes(item.format) && audienceFits(item, row))) return J({ error: "opt_in_required" }, 403);
    if (await blocked(db, user.id, item.user_id)) return J({ error: "blocked" }, 403);
    return createReply(env, item, user, b.body, "application", ctx, J);
  }
  if (path === "/api/expert-requests/accept" && method === "POST") {
    const b = await body(), replyId = Number(b.reply_id), action = b.accept === false ? "declined" : "accepted";
    const reply = Number.isSafeInteger(replyId) && replyId > 0 ? await db.prepare(`SELECT x.*,r.user_id publisher_id,r.title,r.topics,r.status request_status
      FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id WHERE x.id=? AND r.user_id=?`)
      .bind(replyId, user.id).first() : null;
    if (!reply || reply.status !== "pending" || reply.request_status !== "open") return J({ error: "not_found" }, 404);
    if (action === "accepted") {
      // Erste Anweisung entscheidet (Antwort noch offen, Anfrage noch offen), die anderen haengen davon ab;
      // doppeltes Annehmen oder inzwischen geschlossene/zurueckgehaltene Anfrage aendert nichts -> 409
      const res = await db.batch([
        db.prepare(`UPDATE expert_request_replies SET status='accepted' WHERE id=? AND request_id=? AND status='pending'
          AND EXISTS(SELECT 1 FROM expert_requests WHERE id=? AND status='open')`).bind(replyId, reply.request_id, reply.request_id),
        db.prepare(`UPDATE expert_requests SET status='accepted' WHERE id=? AND status='open'
          AND EXISTS(SELECT 1 FROM expert_request_replies WHERE id=? AND status='accepted')`).bind(reply.request_id, replyId),
        db.prepare(`UPDATE expert_request_replies SET status='declined' WHERE request_id=? AND id<>? AND status='pending'
          AND EXISTS(SELECT 1 FROM expert_request_replies WHERE id=? AND status='accepted')`).bind(reply.request_id, replyId, replyId),
      ]);
      if (!res?.[0]?.meta?.changes) return J({ error: "not_found" }, 409);
      await recordExpertContribution(db, reply.user_id, { ...reply, id: reply.request_id });
      defer(ctx, notifyExpert(env, reply.user_id, { title: "M365.FM · Anfrage angenommen", body: reply.title, tag: `expert-accepted-${reply.request_id}` }, "expert"));
      return J({ ok: true, status: "accepted", contacts: await acceptedContacts(db, user.id, reply.user_id) });
    }
    await db.prepare("UPDATE expert_request_replies SET status='declined' WHERE id=? AND status='pending'").bind(replyId).run();
    return J({ ok: true, status: "declined" });
  }
  if (path === "/api/expert-requests/report" && method === "POST") {
    const b = await body(), id = Number(b.id), replyId = Number(b.reply_id);
    let item, reportReplyId = 0;
    if (Number.isSafeInteger(replyId) && replyId > 0) {
      item = await db.prepare(`SELECT r.* FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id
        WHERE x.id=? AND r.user_id=? AND r.status IN ('open','accepted')`).bind(replyId, user.id).first();
      if (!item) return J({ error: "not_found" }, 404);
      reportReplyId = replyId;
    } else {
      item = Number.isSafeInteger(id) && id > 0 ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open'").bind(id).first() : null;
      if (!item || !(await matchesForExpert(env, user.id, [item])).has(Number(item.id)) || await blocked(db, user.id, item.user_id)) return J({ error: "not_found" }, 404);
    }
    if (!(await rateLimit(db, `expert_report:${user.id}`, 5, 86400))) return J({ error: "rate_limit" }, 429);
    await db.prepare("INSERT OR IGNORE INTO expert_request_reports(request_id,user_id,reply_id,reason,created) VALUES(?,?,?,?,?)")
      .bind(item.id, user.id, reportReplyId, text(b.reason, 300), now()).run();
    // Schwelle: zwei verschiedene Meldende zur Anfrage selbst (nicht der Publisher, nicht Meldungen zu Antworten)
    let held = false;
    if (!reportReplyId) {
      const reports = await db.prepare("SELECT COUNT(DISTINCT user_id) n FROM expert_request_reports WHERE request_id=? AND reply_id=0 AND user_id<>?").bind(item.id, item.user_id).first();
      if (reports.n >= 2) {
        const res = await db.prepare("UPDATE expert_requests SET status='held',held_reason='reports' WHERE id=? AND status='open'").bind(item.id).run();
        if (res.meta.changes) await db.prepare("INSERT INTO moderation_log(actor_id,action,target_type,target_id,reason,created) VALUES(0,'hold','request',?,'reports',?)").bind(item.id, now()).run();
        held = true;
      }
    }
    return J({ ok: true, held });
  }
  if (path === "/api/expert-requests/block" && (method === "POST" || method === "DELETE")) {
    const b = await body(), id = Number(b.id), replyId = Number(b.reply_id); let target = 0;
    if (Number.isSafeInteger(replyId) && replyId > 0) {
      target = (await db.prepare("SELECT x.user_id FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id WHERE x.id=? AND r.user_id=?").bind(replyId, user.id).first())?.user_id || 0;
    } else {
      const item = Number.isSafeInteger(id) && id > 0 ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open'").bind(id).first() : null;
      if (item && item.user_id !== user.id && (await matchesForExpert(env, user.id, [item])).has(Number(item.id))) target = item.user_id;
    }
    if (!target || target === user.id) return J({ error: "not_found" }, 404);
    if (method === "POST") await db.prepare("INSERT OR IGNORE INTO msg_blocks(user_id,blocked_id) VALUES(?,?)").bind(user.id, target).run();
    else await db.prepare("DELETE FROM msg_blocks WHERE user_id=? AND blocked_id=?").bind(user.id, target).run();
    return J({ ok: true });
  }
  if (path === "/api/expert-requests/close" && method === "POST") {
    const b = await body(), id = Number(b.id);
    if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
    const result = await db.prepare("UPDATE expert_requests SET status='closed' WHERE id=? AND user_id=? AND status IN ('open','draft','held')").bind(id, user.id).run();
    return result.meta.changes ? J({ ok: true }) : J({ error: "not_found" }, 404);
  }
  return null;
}

function validDeadline(value) {
  const deadline = String(value || ""), date = new Date(`${deadline}T00:00:00Z`), today = new Date();
  const todayText = today.toISOString().slice(0, 10), max = new Date(today.getTime() + MAX_DEADLINE_DAYS * 86400000).toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== deadline || deadline < todayText || deadline > max) return "";
  return deadline;
}

async function normalizeRequest(env, b) {
  const title = text(b.title, 120), description = text(b.description, 1000), format = FORMATS.includes(b.format) ? b.format : "";
  const lang = String(b.lang || ""), deadline = validDeadline(b.deadline), audience = b.audience === undefined ? "all" : b.audience;
  if (!["all", "mvp", "mct", "level"].includes(audience)) return { error: "audience" };
  if (contact(b.title) || contact(b.description) || contact(title) || contact(description)) return { error: "contact_details" };
  if (title.length < 3 || description.length < 20) return { error: "text" };
  if (!format) return { error: "format" };
  if (!validLang(lang)) return { error: "lang" };
  if (!deadline) return { error: "deadline" };
  const known = await baseIds(env), topics = [];
  if (!Array.isArray(b.topics) || b.topics.length < 1 || b.topics.length > 10) return { error: "topics" };
  for (const eid of b.topics) {
    if (typeof eid !== "string" || !known.has(eid)) return { error: "topic", topic: eid };
    if (!topics.includes(eid)) topics.push(eid);
  }
  return { title, description, topics, format, lang, deadline, audience };
}

function moderationReason(title, description) {
  const text = `${title} ${description}`;
  if (/(?:backlink|link[- ]?building|seo[- ]?(?:link|service)|guest[- ]?post(?:ing)?\s+(?:exchange|for\s+link)|directory\s+submission)/i.test(text)) return "link_building";
  if (/(?:survey|questionnaire|poll|umfrage|question\s+for\s+research)/i.test(text)) return "survey";
  if (/(?:sales|lead[- ]?generation|book\s+a\s+demo|buy\s+now|pricing|product\s+promotion|vertrieb|verkauf|werbung)/i.test(text)) return "sales";
  return "";
}

async function removeExpertVector(env, userId) {
  const row = await env.DB.prepare("SELECT vid FROM expert_vectors WHERE user_id=?").bind(userId).first();
  if (!row) return;
  if (env.VEC) await env.VEC.deleteByIds([row.vid]);
  await env.DB.prepare("DELETE FROM expert_vectors WHERE user_id=?").bind(userId).run();
}

async function createReply(env, item, user, rawBody, kind, ctx, J) {
  const db = env.DB, account = await db.prepare("SELECT created FROM users WHERE id=? AND banned=0").bind(user.id).first();
  const settings = await db.prepare("SELECT opt_in,paused_until FROM expert_settings WHERE user_id=?").bind(user.id).first();
  if (!account || now() - account.created < MIN_ACCOUNT_AGE) return J({ error: "account_too_new" }, 403);
  if (!settings?.opt_in || settings.paused_until > now()) return J({ error: "opt_in_required" }, 403);
  const answer = text(rawBody, MAX_PITCH);
  if (contact(rawBody) || contact(answer)) return J({ error: "contact_details" }, 400);
  if (answer.length < 5) return J({ error: "text" }, 400);
  if (await db.prepare("SELECT 1 x FROM expert_request_replies WHERE request_id=? AND user_id=?").bind(item.id, user.id).first()) return J({ error: "already_replied" }, 409);
  if (!(await rateLimit(db, `expert_reply:${user.id}`, MAX_REPLIES_PER_DAY, 86400))) return J({ error: "daily_limit" }, 429);
  const t = now();
  let result;
  try {
    result = await db.prepare(`INSERT INTO expert_request_replies(request_id,user_id,body,created,kind)
      SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM expert_request_replies WHERE user_id=? AND created>?)<10`)
      .bind(item.id, user.id, answer, t, kind, user.id, t - 86400).run();
  } catch { return J({ error: "already_replied" }, 409); }
  if (!result.meta.changes) return J({ error: "daily_limit" }, 429);
  defer(ctx, db.prepare("SELECT lang FROM users WHERE id=?").bind(item.user_id).first().then((owner) =>
    notify(env, item.user_id, { title: "M365.FM · Antwort auf deine Anfrage", body: item.title, url: connectUrl(env, owner?.lang, "requests"), tag: `expert-reply-${item.id}` })));
  return J({ ok: true, kind });
}

async function acceptedContacts(db, publisherId, expertId) {
  const rows = await db.prepare("SELECT user_id,contact_pref,contact_value FROM expert_settings WHERE user_id IN (?,?)").bind(publisherId, expertId).all();
  return { publisher: publicContact((rows.results || []).find((row) => row.user_id === publisherId)),
    expert: publicContact((rows.results || []).find((row) => row.user_id === expertId)) };
}

function publicContact(row) {
  return row && row.contact_pref !== "platform" && row.contact_value ? { method: row.contact_pref, value: row.contact_value } : { method: "platform" };
}

async function acceptedForExpert(db, userId) {
  const rows = (await db.prepare(`SELECT r.id request_id,r.title,r.reach,r.status,x.id reply_id,x.body,x.kind,x.status reply_status,
      r.user_id publisher_id,u.name publisher
    FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id JOIN users u ON u.id=r.user_id
    WHERE x.user_id=? AND x.status='accepted' AND r.status='accepted' ORDER BY x.created DESC LIMIT 50`).bind(userId).all()).results || [];
  for (const row of rows) {
    row.contacts = await acceptedContacts(db, row.publisher_id, userId);
    delete row.publisher_id;
  }
  return rows;
}
